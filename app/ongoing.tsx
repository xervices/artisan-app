import { Text } from '@/components/ui/text';
import * as React from 'react';
import { AppState, Platform, Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { router, useLocalSearchParams, useNavigation, usePathname } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ArrowLeft, Camera, PhoneCall } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import CameraPermissionDialog from '@/components/camera-permission-dialog';
import { useCurrentLocation, useLocation } from 'solomo';
import { useJobsSocket } from '@/hooks/use-jobs-socket';
import { useCameraPermissions } from 'expo-camera';
import { makePhoneCall } from '@/lib/utils';
import { LoadingState } from '@/components/loading-state';
import * as Location from 'expo-location';

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
  const [artisanProfile, earnings, jobs] = useQueries({
    queries: [api.getCurrentArtisanProfile(), api.getMyEarnings(), api.getUserJobs()],
  });

  const [permission] = useCameraPermissions();
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const mapRef = React.useRef<MapView>(null);

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => ['50%', '70%', '90%'], []);

  const { fetchLocation } = useCurrentLocation({
    autoWatch: true,
  });

  const { startTracking, stopTracking, updateLocation, isConnected } = useJobsSocket({
    autoConnect: true,
    jobId: id,
  });

  const [beforePhotos, setBeforePhotos] = React.useState<
    { url: string; mimeType: string; isVideo?: boolean }[]
  >([]);
  const [afterPhotos, setAfterPhotos] = React.useState<
    { url: string; mimeType: string; isVideo?: boolean }[]
  >([]);

  const [userLocation, setUserLocation] = React.useState(routeCoordinates[0]);
  const [eta, setEta] = React.useState<string | null>(null);
  const [routeCoords, setRouteCoords] = React.useState<{ latitude: number; longitude: number }[]>(
    []
  );

  const startJob = useMutation(api.startJob(id));
  const cancelJob = useMutation(api.cancelJob(id));
  const completeJob = useMutation(api.completeJob(id));

  const beforeEvidence = data?.evidence?.filter((i) => i.evidenceType === 'before');
  const afterEvidence = data?.evidence?.filter((i) => i.evidenceType === 'after');

  // Location Tracking Logic
  const lastLocationRef = React.useRef<{ latitude: number; longitude: number } | null>(null);
  const lastEtaFetchLocationRef = React.useRef<{ latitude: number; longitude: number } | null>(
    null
  );

  const handleOnRefresh = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        refetch(),
        artisanProfile?.refetch(),
        earnings?.refetch(),
        jobs?.refetch(),
      ]);
    } catch (error) {
    } finally {
      setIsRefreshing(false);
    }
  };

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

  // Decode polyline from Google's encoded format
  const decodePolyline = (encoded: string): { latitude: number; longitude: number }[] => {
    const points: { latitude: number; longitude: number }[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const fetchEta = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ) => {
    try {
      const apiKey = 'AIzaSyDkT-0SiaW_dZq_ydeOTZAsKT6IvSgLp5Q'; // Fallback to dev key if Constants fails

      if (!apiKey) {
        console.warn('Google Maps API Key not found');
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`
      );

      const result = await response.json();

      if (result.routes && result.routes.length > 0 && result.routes[0].legs) {
        const duration = result.routes[0].legs[0].duration.text;
        setEta(duration);

        // Decode and set polyline
        const overviewPolyline = result.routes[0].overview_polyline?.points;
        if (overviewPolyline) {
          const decodedCoords = decodePolyline(overviewPolyline);
          setRouteCoords(decodedCoords);
        }
      }
    } catch (error) {
      console.error('Error fetching ETA:', error);
    }
  };

  React.useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        300
      );
    }
  }, [userLocation]);

  React.useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const status = data?.status;
      const isTrackable = status === 'paid' || status === 'in_progress';

      if (!isTrackable) {
        stopTracking().catch(console.error);
        locationSubscription?.remove();
        return;
      }

      // 1. Check and request permissions upfront
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        console.warn('Foreground location permission denied');
        return;
      }

      // 2. Request background permission on iOS for reliable tracking
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        console.warn('Background location permission denied — tracking may stop when backgrounded');
      }

      try {
        await startTracking();

        // 3. Use watchPositionAsync instead of setInterval + fetchLocation
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Only fires when moved 10m — no need to manually filter
            timeInterval: 2000, // Minimum 2s between updates (Android)
            mayShowUserSettingsDialog: true,
          },
          async (location) => {
            const { latitude, longitude } = location.coords;

            setUserLocation({ latitude, longitude });

            // Broadcast to socket
            updateLocation(latitude, longitude).catch((err) =>
              console.error('Failed to update location:', err)
            );

            // Throttle ETA fetches to every 200m
            const serviceLatitude =
              data?.serviceRequest?.destinationAddress &&
              (data?.status === 'completed' || data?.status === 'in_progress')
                ? data.serviceRequest.destinationLatitude
                : data?.serviceRequest?.serviceLatitude;

            const serviceLongitude =
              data?.serviceRequest?.destinationAddress &&
              (data?.status === 'completed' || data?.status === 'in_progress')
                ? data.serviceRequest.destinationLongitude
                : data?.serviceRequest?.serviceLongitude;

            if (serviceLatitude && serviceLongitude) {
              const distSinceLastEta = lastEtaFetchLocationRef.current
                ? calculateDistance(
                    lastEtaFetchLocationRef.current.latitude,
                    lastEtaFetchLocationRef.current.longitude,
                    latitude,
                    longitude
                  )
                : 999999;

              if (distSinceLastEta >= 200) {
                fetchEta(
                  { latitude, longitude },
                  { latitude: serviceLatitude, longitude: serviceLongitude }
                );
                lastEtaFetchLocationRef.current = { latitude, longitude };
              }
            }
          }
        );
      } catch (error) {
        console.error('Failed to start location tracking:', error);
      }
    };

    if (data?.status) {
      startLocationTracking();
    }

    return () => {
      locationSubscription?.remove();
      locationSubscription = null;
      lastLocationRef.current = null;
      stopTracking().catch(console.error);
    };
  }, [data?.status, data?.serviceRequest]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        if (!isConnected) {
          await startTracking();
        }
        // Refetch triggers data?.status change → location useEffect re-runs automatically
        refetch();
        artisanProfile?.refetch();
        earnings?.refetch();
        jobs?.refetch();
      }
    });

    return () => subscription.remove();
  }, [isConnected]);

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
          artisanProfile?.refetch();
          earnings?.refetch();
          jobs?.refetch();
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
          artisanProfile?.refetch();
          earnings?.refetch();
          jobs?.refetch();
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
      isRefreshing={isRefreshing}
      onRefresh={handleOnRefresh}
      horizontalPadding={false}
      bottomPadding={0}>
      {isLoading ? (
        <LoadingState title="Loading job activity..." />
      ) : (
        <View className="flex-1">
          <View className="relative flex flex-1 items-center justify-center">
            <MapView
              ref={mapRef}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
              style={{ width: '100%', height: '100%' }}
              initialRegion={{
                latitude: data?.serviceRequest?.serviceLatitude || 4.7425431,
                longitude: data?.serviceRequest?.serviceLongitude || 7.0379143,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}>
              {routeCoords.length > 0 && (
                <Polyline
                  coordinates={routeCoords}
                  strokeColor="#FE6A00"
                  strokeWidth={4}
                  lineCap="round"
                  lineJoin="round"
                />
              )}

              {/* User Marker */}
              <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 1 }}>
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

              {data?.serviceRequest?.destinationAddress &&
              (data?.status === 'in_progress' || data?.status === 'completed') ? (
                <Marker
                  coordinate={{
                    latitude: data?.serviceRequest?.destinationLatitude || 4.7425431,
                    longitude: data?.serviceRequest?.destinationLongitude || 7.0379143,
                  }}
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
              ) : (
                <Marker
                  coordinate={{
                    latitude: data?.serviceRequest?.serviceLatitude || 4.7425431,
                    longitude: data?.serviceRequest?.serviceLongitude || 7.0379143,
                  }}
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
              )}
            </MapView>

            <View className="absolute top-7 flex h-[76px] w-[250px] items-center justify-center rounded-full border border-[#DFDFE1] bg-white">
              <Text className="text-center font-cabinet-bold text-xl text-[#1B1B1E]">
                Destination
              </Text>

              <Text className="text-center text-xs text-[#1B1B1E]">
                {eta ? `You are ${eta} away` : 'Calculating arrival time...'}
              </Text>
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

                    {/* <Text className="text-xs text-[#737381]">She'll check in when he arrives</Text> */}
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
                    <Button
                      disabled={!data?.user?.phoneVerified}
                      onPress={() => {
                        makePhoneCall(data?.user?.phoneNumber);
                      }}
                      className="flex-1 border-[#1B1B1E] bg-white">
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
                            if (permission?.granted) {
                              SheetManager.show('camera-sheet', {
                                payload: {
                                  onSelect(value) {
                                    setBeforePhotos((prev) => {
                                      return [...prev, value];
                                    });
                                  },
                                },
                              });
                            } else {
                              setShowPermissionModal(true);
                            }
                          }}
                          className="flex aspect-square w-[66px] items-center justify-center rounded-[8px] border border-[#D4D4D8]">
                          <Camera size={24} color={'#737381'} />
                        </Pressable>

                        <View className="mt-1 flex flex-row flex-wrap gap-2">
                          {beforePhotos?.map((photo, index) => (
                            <View
                              key={index}
                              className="relative aspect-square w-20 overflow-hidden rounded-[4px]">
                              <Image
                                source={photo?.url}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                              />

                              <Pressable
                                onPress={() =>
                                  SheetManager.show('delete-image-sheet', {
                                    payload: {
                                      onDelete() {
                                        setBeforePhotos((prev) =>
                                          prev.filter((media) => media.url !== photo.url)
                                        );
                                      },
                                    },
                                  })
                                }
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF4EA]">
                                <Image
                                  source={require('@/assets/icons/trash.svg')}
                                  style={{ width: 12, height: 12 }}
                                  contentFit="contain"
                                />
                              </Pressable>
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
                                  className="aspect-square w-20 overflow-hidden rounded-[4px]">
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
                          onPress={() => {
                            if (permission?.granted) {
                              SheetManager.show('camera-sheet', {
                                payload: {
                                  onSelect(value) {
                                    setAfterPhotos((prev) => {
                                      return [...prev, value];
                                    });
                                  },
                                },
                              });
                            } else {
                              setShowPermissionModal(true);
                            }
                          }}
                          className="flex aspect-square w-[66px] items-center justify-center rounded-[8px] border border-[#D4D4D8]">
                          <Camera size={24} color={'#737381'} />
                        </Pressable>

                        <View className="mt-1 flex flex-row flex-wrap gap-2">
                          {afterPhotos.map((photo, index) => (
                            <View
                              key={index}
                              className="relative aspect-square w-20 overflow-hidden rounded-[4px]">
                              <Image
                                source={photo?.url}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                              />

                              <Pressable
                                onPress={() =>
                                  SheetManager.show('delete-image-sheet', {
                                    payload: {
                                      onDelete() {
                                        setAfterPhotos((prev) =>
                                          prev.filter((media) => media.url !== photo.url)
                                        );
                                      },
                                    },
                                  })
                                }
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF4EA]">
                                <Image
                                  source={require('@/assets/icons/trash.svg')}
                                  style={{ width: 12, height: 12 }}
                                  contentFit="contain"
                                />
                              </Pressable>
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
                                  className="aspect-square w-20 overflow-hidden rounded-[4px]">
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
                          <Text className="font-cabinet-extrabold text-[#737381]">
                            Cancel offer
                          </Text>
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
                                pathname: '/dispute',
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
      )}

      <CameraPermissionDialog
        onPermissionsGranted={() => {
          if (data?.status === 'in_progress') {
            SheetManager.show('camera-sheet', {
              payload: {
                onSelect(value) {
                  setAfterPhotos((prev) => {
                    return [...prev, value];
                  });
                },
              },
            });
          } else {
            SheetManager.show('camera-sheet', {
              payload: {
                onSelect(value) {
                  setBeforePhotos((prev) => {
                    return [...prev, value];
                  });
                },
              },
            });
          }
        }}
        visible={showPermissionModal}
        setVisible={setShowPermissionModal}
      />
    </Layout>
  );
}
