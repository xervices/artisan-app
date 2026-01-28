import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { router, useLocalSearchParams, useNavigation, usePathname } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'expo-image';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ArrowLeft, Camera, PhoneCall } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import CameraPermissionDialog from '@/components/camera-permission-dialog';
import { useCurrentLocation, useLocation } from 'solomo';
import { useJobsSocket } from '@/hooks/use-jobs-socket';

const routeCoordinates = [
  { latitude: 37.78825, longitude: -122.4324 }, // Start point
  { latitude: 37.78625, longitude: -122.4304 },
  { latitude: 37.78425, longitude: -122.4284 },
  { latitude: 37.78225, longitude: -122.4264 },
  { latitude: 37.78025, longitude: -122.4244 },
  { latitude: 37.77825, longitude: -122.4224 },
  { latitude: 37.77625, longitude: -122.4204 }, // End point
];

export default function Screen() {
  const { id }: { id: string } = useLocalSearchParams();

  const { data, isLoading, refetch, isRefetching } = useQuery(api.getJobDetail(id));

  const pathname = usePathname();
  const navigation = useNavigation();

  const mapRef = React.useRef<MapView>(null);

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => ['50%', '70%', '90%'], []);

  const { fetchLocation } = useCurrentLocation({
    autoWatch: true,
  });

  const { startTracking, stopTracking, updateLocation } = useJobsSocket({
    autoConnect: true,
    jobId: id,
  });

  const [beforePhotos, setBeforePhotos] = React.useState<
    { url: string; mimeType: string; isVideo?: boolean }[]
  >([]);
  const [afterPhotos, setAfterPhotos] = React.useState<
    { url: string; mimeType: string; isVideo?: boolean }[]
  >([]);

  const startJob = useMutation(api.startJob(id));
  const cancelJob = useMutation(api.cancelJob(id));
  const completeJob = useMutation(api.completeJob(id));

  const beforeEvidence = data?.evidence?.filter((i) => i.evidenceType === 'before');
  const afterEvidence = data?.evidence?.filter((i) => i.evidenceType === 'after');

  // Location Tracking Logic
  const lastLocationRef = React.useRef<{ latitude: number; longitude: number } | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  React.useEffect(() => {
    let locationListener: any;

    const trackLocation = async () => {
      const status = data?.status;
      const isTrackable = status === 'paid' || status === 'in_progress';

      if (isTrackable) {
        try {
          await startTracking();
          console.log('✅ Tracking started (distance-based)');

          // Helper function to fetch and update on distance change
          const broadcastLocationIfMoved = async () => {
            const location = await fetchLocation();

            if (location && location.location) {
              const currentCoords = location.location.coords;

              // Check if we've moved more than 10 meters
              if (lastLocationRef.current) {
                const distance = calculateDistance(
                  lastLocationRef.current.latitude,
                  lastLocationRef.current.longitude,
                  currentCoords.latitude,
                  currentCoords.longitude
                );

                if (distance >= 10) {
                  console.log(`📍 Moved ${Math.round(distance)}m, updating location`);
                  updateLocation(currentCoords.latitude, currentCoords.longitude).catch((err) =>
                    console.error('Failed to update location:', err)
                  );
                  lastLocationRef.current = {
                    latitude: currentCoords.latitude,
                    longitude: currentCoords.longitude,
                  };
                }
              } else {
                // First location, always update
                updateLocation(currentCoords.latitude, currentCoords.longitude).catch((err) =>
                  console.error('Failed to update location:', err)
                );
                lastLocationRef.current = {
                  latitude: currentCoords.latitude,
                  longitude: currentCoords.longitude,
                };
              }
            }
          };

          // Initial update
          broadcastLocationIfMoved();

          // Check location every 2 seconds (instead of updating immediately every 5 seconds)
          locationListener = setInterval(broadcastLocationIfMoved, 2000);
        } catch (error) {
          console.error('Failed to start tracking:', error);
        }
      } else {
        stopTracking().catch((err) => console.error('Failed to stop tracking:', err));
        if (locationListener) clearInterval(locationListener);
      }
    };

    if (data?.status) {
      trackLocation();
    }

    return () => {
      if (locationListener) clearInterval(locationListener);
      lastLocationRef.current = null;
      stopTracking().catch((err) => console.log(err));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.status]);

  React.useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, []);

  const handleOnMarkArrived = () => {
    if (beforePhotos?.length < 1)
      return showErrorMessage('Take before photos before marking as arrived.');

    startJob?.mutate(
      // @ts-ignore
      {
        beforePhotos,
      },
      {
        onSuccess: (res) => {
          showSuccessMessage('Job marked as started.');
          refetch();
        },
        onError: (err) => {
          showErrorMessage(err?.message);
        },
      }
    );
  };

  const handleOnMarkCompleted = () => {
    if (afterPhotos?.length < 1)
      return showErrorMessage('Take After photos before marking as completed.');

    completeJob?.mutate(
      // @ts-ignore
      {
        afterPhotos,
      },
      {
        onSuccess: (res) => {
          showSuccessMessage('Job marked as completed.');
          refetch();
        },
        onError: (err) => {
          showErrorMessage(err?.message);
        },
      }
    );
  };

  return (
    <Layout
      useBackground
      isRefreshing={isRefetching}
      onRefresh={refetch}
      horizontalPadding={false}
      bottomPadding={0}>
      <View className="flex-1">
        <View className="relative flex flex-1 items-center justify-center">
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ width: '100%', height: '100%' }}
            initialRegion={{
              latitude: 37.78225,
              longitude: -122.4264,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}>
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#FE6A00" // Orange color
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />

            <Marker coordinate={routeCoordinates[0]} anchor={{ x: 0.5, y: 1 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 99999999,
                  backgroundColor: '#FFDCC1',
                  borderWidth: 1,
                  borderColor: '#606D5D1F',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                <Image
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                  source={require('@/assets/icons/map-pin.svg')}
                />
              </View>
            </Marker>

            <Marker
              coordinate={routeCoordinates[routeCoordinates.length - 1]}
              anchor={{ x: 0.5, y: 0.5 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 99999999,
                  backgroundColor: '#1B1B1E',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                <Image
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                  source={require('@/assets/icons/map-home.svg')}
                />
              </View>
            </Marker>
          </MapView>

          <View className="absolute top-7 flex h-[76px] w-[250px] items-center justify-center rounded-full border border-[#DFDFE1] bg-white">
            <Text className="text-center font-cabinet-bold text-xl text-[#1B1B1E]">
              Destination
            </Text>

            <Text className="text-center text-xs text-[#1B1B1E]">Your are 2 mins away</Text>
          </View>

          <BottomSheet
            ref={bottomSheetRef}
            index={0} // Start at first snap point (20% - peek)
            snapPoints={snapPoints}
            enablePanDownToClose={false} // Prevent closing completely
            backgroundStyle={{
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
            handleIndicatorStyle={{
              width: 38,
              height: 6,
              backgroundColor: '#FFF4EA',
            }}>
            <BottomSheetScrollView>
              <View className="flex gap-6 p-6">
                <View className="relative flex w-full flex-row items-center justify-center">
                  <Pressable
                    onPress={() => {
                      router.back();
                    }}
                    className="absolute left-0 h-8 w-8 justify-center">
                    <ArrowLeft size={24} color={'#B4B4BC'} />
                  </Pressable>
                </View>

                <View>
                  <Text className="font-cabinet-bold text-[#1B1B1E]">
                    Don’t forget to check in when you arrive
                  </Text>

                  <Text className="text-xs text-[#737381]">She'll check in when he arrives</Text>
                </View>

                <View className="flex w-full flex-row">
                  <View className="flex w-1/2 flex-row items-center gap-2">
                    <Avatar alt="User's Avatar" className="h-6 w-6">
                      <AvatarImage source={{ uri: data?.user?.profile?.avatarUrl }} />
                      <AvatarFallback className="bg-primary">
                        <Text className="font-cabinet-bold text-xs uppercase leading-none">
                          {data?.user?.profile?.fullName?.substring(0, 2)}
                        </Text>
                      </AvatarFallback>
                    </Avatar>

                    <View>
                      <View className="flex flex-row items-center">
                        <Text className="font-cabinet-bold text-[18px] text-[#1B1B1E]">
                          {data?.user?.profile?.fullName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="flex flex-row gap-4">
                  <Button className="flex-1 border-[#1B1B1E] bg-white">
                    <PhoneCall size={16} fill={'#1B1B1E'} />

                    <Text className="font-cabinet-bold text-[#1B1B1E]">Call</Text>
                  </Button>

                  <Button
                    onPress={() => {
                      SheetManager.hideAll();
                      router.navigate({
                        pathname: '/chat',
                        params: {
                          id: id,
                        },
                      });
                    }}
                    className="flex-1 border-[#FE6A00] bg-white">
                    <Image
                      source={require('@/assets/icons/message-notif.svg')}
                      style={{ width: 16, height: 16 }}
                      contentFit="contain"
                    />

                    <Text className="font-cabinet-bold text-[#FE6A00]">Message</Text>
                  </Button>
                </View>

                <View className="flex gap-4">
                  {data?.status === 'paid' ? (
                    <View className="flex flex-1 gap-2">
                      <Text className="font-cabinet-medium text-xs uppercase leading-none text-[#1B1B1E]">
                        Before Photo
                      </Text>

                      <Pressable
                        onPress={() => {
                          SheetManager.show('camera-sheet', {
                            payload: {
                              onSelect(value) {
                                setBeforePhotos((prev) => {
                                  return [...prev, value];
                                });
                              },
                            },
                          });
                        }}
                        className="flex aspect-square w-[66px] items-center justify-center rounded-[8px] border border-[#D4D4D8]">
                        <Camera size={24} color={'#737381'} />
                      </Pressable>

                      <View className="mt-1 flex flex-row flex-wrap gap-2">
                        {beforePhotos?.map((photo, index) => (
                          <View
                            key={index}
                            className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                            <Image
                              source={photo?.url}
                              style={{ width: '100%', height: '100%' }}
                              contentFit="cover"
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}

                  {beforeEvidence && beforeEvidence?.length > 0 ? (
                    <View className="flex flex-1 gap-2">
                      <Text className="font-cabinet-medium text-xs uppercase leading-none text-[#1B1B1E]">
                        Before Photo
                      </Text>

                      <View className="flex flex-row flex-wrap gap-2">
                        {beforeEvidence
                          ? beforeEvidence?.map((i) => (
                              <View
                                key={i?.id}
                                className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                                <Image
                                  source={i?.mediaUrl}
                                  style={{ width: '100%', height: '100%' }}
                                  contentFit="cover"
                                />
                              </View>
                            ))
                          : null}
                      </View>
                    </View>
                  ) : null}

                  {data?.status === 'in_progress' ? (
                    <View className="flex gap-2">
                      <Text className="font-cabinet-medium text-xs uppercase leading-none text-[#1B1B1E]">
                        After Photo
                      </Text>

                      <Pressable
                        onPress={() =>
                          SheetManager.show('camera-sheet', {
                            payload: {
                              onSelect(value) {
                                setAfterPhotos((prev) => {
                                  return [...prev, value];
                                });
                              },
                            },
                          })
                        }
                        className="flex aspect-square w-[66px] items-center justify-center rounded-[8px] border border-[#D4D4D8]">
                        <Camera size={24} color={'#737381'} />
                      </Pressable>

                      <View className="mt-1 flex flex-row flex-wrap gap-2">
                        {afterPhotos.map((photo, index) => (
                          <View
                            key={index}
                            className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                            <Image
                              source={photo?.url}
                              style={{ width: '100%', height: '100%' }}
                              contentFit="cover"
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}

                  {afterEvidence && afterEvidence?.length > 0 ? (
                    <View className="flex flex-1 gap-2">
                      <Text className="font-cabinet-medium text-xs uppercase leading-none text-[#1B1B1E]">
                        After Photo
                      </Text>

                      <View className="flex flex-row flex-wrap gap-2">
                        {afterEvidence
                          ? afterEvidence?.map((i) => (
                              <View
                                key={i?.id}
                                className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                                <Image
                                  source={i?.mediaUrl}
                                  style={{ width: '100%', height: '100%' }}
                                  contentFit="cover"
                                />
                              </View>
                            ))
                          : null}
                      </View>
                    </View>
                  ) : null}

                  <View className="flex flex-1 gap-4">
                    {data?.status === 'paid' ? (
                      <Button
                        isLoading={cancelJob?.isPending}
                        disabled={cancelJob?.isPending}
                        onPress={() => {
                          cancelJob?.mutate(
                            {},
                            {
                              onSuccess: (res) => {
                                showSuccessMessage('Job cancelled successfully.');
                                refetch();
                                SheetManager.hideAll();
                                router.replace('/jobs');
                              },
                              onError: (err) => {
                                showErrorMessage(err?.message);
                              },
                            }
                          );
                        }}
                        className="flex-1 border-[#DFDFE1] bg-white">
                        <Text className="font-cabinet-extrabold text-[#737381]">Cancel offer</Text>
                      </Button>
                    ) : null}

                    {data?.status === 'paid' ? (
                      <Button
                        isLoading={startJob?.isPending}
                        disabled={startJob?.isPending}
                        onPress={handleOnMarkArrived}
                        className="">
                        Mark Arrived
                      </Button>
                    ) : null}

                    {data?.status === 'in_progress' ? (
                      <Button
                        isLoading={completeJob?.isPending}
                        disabled={completeJob?.isPending}
                        onPress={() => {
                          handleOnMarkCompleted();
                        }}
                        className="">
                        Mark complete
                      </Button>
                    ) : null}

                    {data?.status === 'completed' ? (
                      <>
                        <Button
                          onPress={() => {
                            SheetManager.show('success-sheet', {
                              payload: {
                                title: 'Job Completed Successfully ',
                                subtitle:
                                  'The client will review your work, and upon approval, your payment will be released to you from escrow. You will be redirected to the home page shortly.',
                                hideBackButton: true,
                                useCheckImage: true,
                                onRedirect: () => {
                                  router.replace('/(tabs)/(home)');
                                },
                              },
                            });
                          }}>
                          Submit for review
                        </Button>

                        <Button
                          onPress={() =>
                            router.navigate({
                              pathname: '/jobs/dispute',
                              params: {
                                id: id,
                              },
                            })
                          }
                          variant={'outline'}>
                          Dispute
                        </Button>
                      </>
                    ) : null}
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        </View>
      </View>

      <CameraPermissionDialog />
    </Layout>
  );
}
