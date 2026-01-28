import { api } from '@/api';
import { AuthHeader } from '@/components/auth-header';
import { OfferCard } from '@/components/home/offers';
import { Layout } from '@/components/layout';
import { LoadingState } from '@/components/loading-state';
import { useMarketplaceContext } from '@/providers/use-marketplace-context';
import { useQueries } from '@tanstack/react-query';
import { View } from 'react-native';

export default function Screen() {
  const [artisanProfile, artisanOffers] = useQueries({
    queries: [api.getCurrentArtisanProfile(), api.getArtisanOffers()],
  });

  const { requests } = useMarketplaceContext({
    onOfferEvent(eventType, data) {
      artisanOffers?.refetch();
    },
  });

  // const negotiatingOffers = artisanOffers?.data?.filter(
  //   (offer, index, self) =>
  //     self.findIndex((o) => o.serviceRequest?.id === offer.serviceRequest?.id) === index
  // );

  return (
    <Layout
      useBackground
      isRefreshing={artisanProfile?.isRefetching || artisanOffers?.isRefetching}
      onRefresh={() => {
        artisanProfile?.refetch();
        artisanOffers?.refetch();
      }}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Requests" />
        </View>
      }>
      {artisanProfile?.isLoading || artisanOffers?.isLoading ? (
        <LoadingState title="Loading data..." />
      ) : (
        <View className="flex-1 gap-6">
          {requests.requests?.map((offer) => (
            <OfferCard key={offer.id} data={offer} />
          ))}

          {/* {negotiatingOffers &&
            negotiatingOffers?.length > 0 &&
            negotiatingOffers?.map((offer) => (
              <OfferCard
                key={offer.id}
                data={{
                  categoryId: offer.serviceRequest?.category.name || '',
                  title: offer.serviceRequest?.title || '',
                  budgetMax: offer.serviceRequest?.budgetMax || 0,
                  budgetMin: offer.serviceRequest?.budgetMin || 0,
                  createdAt: offer.serviceRequest?.createdAt || '',
                  id: offer.serviceRequest?.id || '',
                  username: offer?.serviceRequest?.user?.profile?.fullName,
                  avatarUrl: offer?.serviceRequest?.user?.profile?.avatarUrl,
                }}
              />
            ))} */}
        </View>
      )}
    </Layout>
  );
}
