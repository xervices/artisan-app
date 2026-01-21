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

  const { requests } = useMarketplaceContext();

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
        </View>
      )}
    </Layout>
  );
}
