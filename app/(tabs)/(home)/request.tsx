import { api } from '@/api';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import { AuthHeader } from '@/components/auth-header';
import RequestUserCard from '@/components/home/request-user-card';
import { Layout } from '@/components/layout';
import { LoadingState } from '@/components/loading-state';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Text } from '@/components/ui/text';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useMarketplaceContext } from '@/providers/use-marketplace-context';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { CircleAlert, Play } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { isVideoUri, VideoThumb } from '@/components/video-thumb';

function MediaThumbnail({ media }: { media: string }) {
  const isVideo = isVideoUri(media);

  return (
    <Pressable
      onPress={() => SheetManager.show('image-preview-sheet', { payload: { imgSource: media } })}
      className="relative aspect-square w-[47%] overflow-hidden rounded-[8px]">
      {isVideo ? (
        <VideoThumb uri={media} />
      ) : (
        <Image source={media} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      )}
    </Pressable>
  );
}

export default function Screen() {
  const { id }: { id: string } = useLocalSearchParams();

  const [service, artisanOffers] = useQueries({
    queries: [api.getServiceRequest(id), api.getArtisanOffers()],
  });

  const userRating = useQuery(api.getCustomerStats(service?.data?.user?.id));
  const userReviews = useQuery(api.getCustomerReviews(service?.data?.user?.id));

  const sendOffer = useMutation(api.createNewOffer());
  const sendCounterOffer = useMutation(api.createCounterOffer());

  const { offers } = useMarketplaceContext({
    onOfferEvent(eventType, data) {
      artisanOffers?.refetch();

      if (eventType === 'offer:accepted') {
        showSuccessMessage('Offer accepted');
        router.replace('/jobs');
      }

      if (eventType === 'offer:rejected' || eventType === 'offer:withdrawn') {
        showSuccessMessage('Offer has been rejected/withdrawn by user.');
        router.back();
      }
    },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOnRefresh = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([service.refetch(), artisanOffers?.refetch()]);
    } catch (error) {
    } finally {
      setIsRefreshing(false);
    }
  };

  const offersMade = artisanOffers?.data?.filter((i) => i.serviceRequestId === id);

  const artisanCounterOffersCount = offersMade?.filter(
    (i) => i.offeredBy === 'artisan' && i.parentOfferId
  )?.length;

  const lastOfferId = offersMade && offersMade.length > 0 ? offersMade[0]?.id : '';
  const respondToOffer = useMutation(api.respondToOffer(lastOfferId));
  const withdrawOffer = useMutation(api.withdrawOffer(lastOfferId));

  useEffect(() => {
    offers.joinServiceRequest(id);
  }, [id]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground
        // Reconnect socket if disconnected
        if (!offers?.isConnected) {
          offers?.joinServiceRequest(id);
        }

        // Refetch all data
        service?.refetch();
        artisanOffers?.refetch();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [offers?.isConnected, id]);

  useEffect(() => {
    if (service?.data?.status === 'accepted') {
      router.replace('/jobs');
    }
  }, [service?.data]);

  useEffect(() => {
    if (offersMade && offersMade.length > 0 && offersMade[0]?.id) {
      if (
        offersMade[0]?.status === 'expired' ||
        offersMade[0]?.status === 'rejected' ||
        offersMade[0]?.status === 'withdrawn'
      ) {
        router.back();
      }
    }
  }, [offersMade]);

  return (
    <Layout
      useBackground
      isRefreshing={isRefreshing}
      onRefresh={handleOnRefresh}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Requests" />
        </View>
      }>
      {service?.isLoading || artisanOffers?.isLoading ? (
        <LoadingState title="Loading Request..." />
      ) : (
        <View className="flex-1 gap-4">
          <RequestUserCard
            address={service?.data?.serviceAddress}
            avatarUrl={service?.data?.user?.profile?.avatarUrl}
            date={service?.data?.createdAt}
            name={service?.data?.user?.profile?.fullName}
            serviceLat={service?.data?.serviceLatitude || undefined}
            serviceLong={service?.data?.serviceLongitude || undefined}
            dropoffAddress={service?.data?.destinationAddress || undefined}
            dropOffLat={service?.data?.destinationLatitude || undefined}
            dropOffLong={service?.data?.destinationLongitude || undefined}
            customerRating={userRating?.data?.averageRating}
          />

          <View className="flex flex-row items-center justify-between rounded-[8px] bg-[#F4F4F5] p-4">
            <Text className="text-sm text-[#737381]">Service</Text>
            <Text className="font-cabinet-bold text-sm text-[#737381]">
              {service?.data?.category?.name}
            </Text>
          </View>

          <View className="flex gap-2">
            <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">
              Customer recent reviews
            </Text>

            <View className="flex gap-4 rounded-[8px] bg-[#F4F4F5] p-4">
              {userReviews?.data?.reviews && userReviews.data.reviews.length > 0 ? (
                userReviews.data.reviews.slice(0, 5).map((review) => (
                  <View key={review?.id} className="flex gap-1">
                    <View className="flex flex-row items-center gap-2">
                      <Avatar
                        alt="User's Avatar"
                        className="h-8 w-8 rounded-sm border border-[#FFE6D6]">
                        <AvatarImage source={{ uri: review?.reviewer?.avatarUrl ?? undefined }} />
                        <AvatarFallback className="bg-primary">
                          <Text className="font-cabinet-bold text-xs uppercase leading-none">
                            {review?.reviewer?.fullName?.substring(0, 2)}
                          </Text>
                        </AvatarFallback>
                      </Avatar>

                      <View>
                        <Text className="font-cabinet-bold text-sm leading-none text-[#737381]">
                          {review?.reviewer?.fullName}
                        </Text>

                        <Text className="text-xs text-[#FE6A00]">
                          {new Array(Math.floor(review.rating)).fill(0).map((_, index) => (
                            <Text key={index}>★</Text>
                          ))}{' '}
                          <Text className="text-xs text-[#B4B4BC]">
                            {formatRelativeTime(review?.createdAt)}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    <Text className="text-sm text-[#737381]">{review?.comment}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm text-[#B4B4BC]">No reviews yet</Text>
              )}
            </View>
          </View>

          <View className="flex gap-2">
            <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">
              Description
            </Text>

            <View className="flex flex-row items-center justify-between rounded-[8px] bg-[#F4F4F5] p-4">
              <Text className="text-sm text-[#737381]">{service?.data?.description}</Text>
            </View>
          </View>

          <View className="flex gap-2">
            <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">
              Images & Videos
            </Text>

            <View className="flex flex-row flex-wrap justify-between gap-4">
              {service?.data?.mediaUrls?.map((media) => (
                <MediaThumbnail key={media} media={media} />
              ))}
            </View>
          </View>

          <View className="flex flex-row gap-2 rounded-[8px] border border-[#0582F1] bg-[#EAF5FF] p-2">
            <CircleAlert size={20} color={'#0582F1'} />

            <Text className="flex-1 text-sm text-[#014178]">
              Prices cover service only. Materials, if needed, are handled between you and the
              client. Xervices does not provide or charge for them.
            </Text>
          </View>

          {offersMade && offersMade?.length > 0 ? (
            <>
              <View className="flex gap-2">
                <View className="flex flex-row items-center justify-between gap-4">
                  <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">
                    Offers
                  </Text>

                  {offersMade && offersMade?.length === 0 ? null : withdrawOffer?.isPending ? (
                    <LoadingIndicator size={14} />
                  ) : offersMade[0]?.status === 'accepted' ? null : (
                    <Pressable
                      onPress={() => {
                        withdrawOffer?.mutate(
                          {},
                          {
                            onSuccess: () => {
                              showSuccessMessage('Offer rejected');
                              artisanOffers.refetch();
                              service.refetch();
                              router.back();
                            },
                            onError: (err) => {
                              showErrorMessage(err.message);
                            },
                          }
                        );
                      }}>
                      <Text className="font-cabinet-bold text-xs uppercase text-[#B3031E]">
                        REJECT OFFER
                      </Text>
                    </Pressable>
                  )}
                </View>

                <View className="gap-4 rounded-[8px] border border-[#E9E9EB] p-4">
                  {offersMade?.map((offer) => (
                    <View key={offer.id}>
                      {offer.offeredBy === 'artisan' ? (
                        <View className="flex aspect-[295/60] w-full items-center justify-center rounded-[6px] bg-[#F4F4F5]">
                          <Text className="text-center text-xs text-[#737381]">Your offer</Text>
                          <Text className="text-center font-cabinet-bold text-sm text-[#1B1B1E]">
                            {formatCurrency(offer.amount)}
                          </Text>
                        </View>
                      ) : (
                        <View className="flex aspect-[295/60] w-full items-center justify-center rounded-[6px] bg-[#0A0A0B]">
                          <Text className="text-center text-xs text-[#FFF4EA]">Customer offer</Text>
                          <Text className="text-center font-cabinet-bold text-sm text-[#FFB884]">
                            {formatCurrency(offer.amount)}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}

                  <Text className="text-center font-cabinet-medium text-xs text-primary">
                    You have {2 - (artisanCounterOffersCount ? artisanCounterOffersCount : 0)}{' '}
                    counter offers left.
                  </Text>
                </View>
              </View>

              <View className="flex flex-row gap-4">
                <Button
                  className="flex-1"
                  variant={'outline'}
                  isLoading={sendCounterOffer?.isPending}
                  disabled={sendCounterOffer?.isPending}
                  loadingIndicatorColor="#1B1B1E"
                  onPress={() => {
                    if ((artisanCounterOffersCount ? artisanCounterOffersCount : 0) > 1) {
                      return showErrorMessage("You've run out of counters for this job.");
                    }
                    SheetManager.show('counter-offer-sheet', {
                      payload: {
                        type: 'counter',
                        name: service.data?.user?.profile?.fullName,
                        profileImage: service.data?.user?.profile?.avatarUrl,
                        amount: offersMade && offersMade?.length > 0 ? offersMade[0]?.amount : 1000,
                        counterAmount:
                          offersMade && offersMade?.length > 0 ? offersMade[0]?.amount : 1000,
                        onConfirm: (amount) => {
                          sendCounterOffer.mutate(
                            // @ts-ignore
                            { amount, id: offersMade[0]?.id },
                            {
                              onSuccess: (res) => {
                                artisanOffers.refetch();
                                showSuccessMessage('Counter offer sent successfully!');
                              },
                              onError: (err) => {
                                showErrorMessage(err.message);
                              },
                            }
                          );
                        },
                      },
                    });
                  }}>
                  Counter
                </Button>

                <Button
                  isLoading={respondToOffer?.isPending}
                  disabled={
                    respondToOffer?.isPending ||
                    (offersMade && offersMade?.length > 0 && offersMade[0]?.offeredBy === 'artisan')
                  }
                  onPress={() => {
                    if (
                      offersMade &&
                      offersMade?.length > 0 &&
                      offersMade[0]?.offeredBy === 'artisan'
                    )
                      return showErrorMessage(
                        'You cannot accept your own offer. Wait for the user to send a counter offer'
                      );
                    respondToOffer?.mutate(
                      { action: 'accept' },
                      {
                        onSuccess: () => {
                          showSuccessMessage('Offer accepted');
                          artisanOffers.refetch();
                          service.refetch();
                        },
                        onError: (err) => {
                          showErrorMessage(err.message);
                        },
                      }
                    );
                  }}
                  className="flex-1">
                  Accept
                </Button>
              </View>
            </>
          ) : (
            <Button
              isLoading={sendOffer?.isPending}
              disabled={sendOffer?.isPending}
              onPress={() => {
                SheetManager.show('counter-offer-sheet', {
                  payload: {
                    type: 'offer',
                    name: service.data?.user?.profile?.fullName,
                    profileImage: service.data?.user?.profile?.avatarUrl,
                    onConfirm: (amount) => {
                      sendOffer.mutate(
                        { amount, serviceRequestId: id },
                        {
                          onSuccess: (res) => {
                            artisanOffers.refetch();
                          },
                          onError: (err) => {
                            showErrorMessage(err.message);
                          },
                        }
                      );
                    },
                  },
                });
              }}>
              Send offer
            </Button>
          )}
        </View>
      )}
    </Layout>
  );
}
