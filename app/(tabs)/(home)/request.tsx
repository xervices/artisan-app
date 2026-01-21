import { api } from '@/api';
import { showErrorMessage } from '@/api/helpers';
import { AuthHeader } from '@/components/auth-header';
import RequestUserCard from '@/components/home/request-user-card';
import { Layout } from '@/components/layout';
import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useOffersSocket } from '@/hooks/use-offers-socket';
import { formatCurrency } from '@/lib/utils';
import { useMarketplaceContext } from '@/providers/use-marketplace-context';
import { useMutation, useQueries } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { CircleAlert, Play } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

export default function Screen() {
  const { id }: { id: string } = useLocalSearchParams();

  const [service, serviceOffers] = useQueries({
    queries: [api.getServiceRequest(id), api.getServiceOffers(id)],
  });

  const sendOffer = useMutation(api.createNewOffer());
  const counterOffer = useMutation(api.createCounterOffer(id));

  const { offers } = useMarketplaceContext();

  useEffect(() => {
    offers.joinServiceRequest(id);
  }, [id]);

  return (
    <Layout
      useBackground
      isRefreshing={service?.isRefetching || serviceOffers?.isRefetching}
      onRefresh={() => {
        service?.refetch();
        serviceOffers?.refetch();
      }}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Requests" />
        </View>
      }>
      {service?.isLoading || serviceOffers?.isLoading ? (
        <LoadingState title="Loading Request..." />
      ) : (
        <View className="flex-1 gap-4">
          <RequestUserCard
            address={service?.data?.serviceAddress}
            avatarUrl={service?.data?.user?.profile?.avatarUrl}
            date={service?.data?.createdAt}
            name={service?.data?.user?.profile?.fullName}
          />

          <View className="flex flex-row items-center justify-between rounded-[8px] bg-[#F4F4F5] p-4">
            <Text className="text-sm text-[#737381]">Service</Text>
            <Text className="font-cabinet-bold text-sm text-[#737381]">
              {service?.data?.category?.name}
            </Text>
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
            <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">Images</Text>

            <View className="flex flex-row flex-wrap justify-between gap-4">
              {service?.data?.mediaUrls?.map((media) => (
                <View
                  key={media}
                  className="relative aspect-square w-[47%] overflow-hidden rounded-[8px]">
                  <Image
                    source={media}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    contentFit="cover"
                  />
                </View>
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

          {serviceOffers?.data ? (
            <>
              <View className="flex gap-2">
                <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">Offers</Text>

                <View className="gap-4 rounded-[8px] border border-[#E9E9EB] p-4">
                  {serviceOffers?.data?.map((offer) =>
                    offer.offeredBy === 'artisan' ? (
                      <View
                        key={offer.id}
                        className="flex aspect-[295/60] w-full items-center justify-center rounded-[6px] bg-[#F4F4F5]">
                        <Text className="text-center text-xs text-[#737381]">Your offer</Text>
                        <Text className="text-center font-cabinet-bold text-sm text-[#1B1B1E]">
                          {formatCurrency(offer.amount)}
                        </Text>
                      </View>
                    ) : (
                      <View
                        key={offer.id}
                        className="flex aspect-[295/60] w-full items-center justify-center rounded-[6px] bg-[#0A0A0B]">
                        <Text className="text-center text-xs text-[#FFF4EA]">Customer offer</Text>
                        <Text className="text-center font-cabinet-bold text-sm text-[#FFB884]">
                          {formatCurrency(offer.amount)}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>

              <View className="flex flex-row gap-4">
                <Button
                  className="flex-1"
                  variant={'outline'}
                  onPress={() => {
                    SheetManager.show('counter-offer-sheet', {
                      payload: {
                        type: 'counter',
                        name: service.data?.user?.profile?.fullName,
                        profileImage: service.data?.user?.profile?.avatarUrl,
                        amount: 1000,
                        counterAmount: 1000,
                        onConfirm: (amount) => {
                          sendOffer.mutate(
                            { amount, serviceRequestId: id },
                            {
                              onSuccess: (res) => {
                                serviceOffers.refetch();
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

                <Button className="flex-1">Accept</Button>
              </View>
            </>
          ) : (
            <Button
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
                            serviceOffers.refetch();
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
