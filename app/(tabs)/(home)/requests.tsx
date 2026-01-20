import { api } from '@/api';
import { AuthHeader } from '@/components/auth-header';
import { OfferCard } from '@/components/home/offers';
import { Layout } from '@/components/layout';
import { LoadingState } from '@/components/loading-state';
import { useServiceRequestsSocket } from '@/hooks/use-service-requests-socket';
import { useAuthStore } from '@/store/auth-store';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { View } from 'react-native';

export default function Screen() {
  const { user } = useAuthStore();

  const [artisanProfile, artisanOffers] = useQueries({
    queries: [api.getCurrentArtisanProfile(), api.getArtisanOffers()],
  });

  const artisanId = useMemo(() => user?.id, [user?.id]);

  const { requests } = useServiceRequestsSocket({
    artisanId,
  });

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
          {requests?.map((offer) => (
            <OfferCard key={offer.id} data={offer} />
          ))}
        </View>
      )}
    </Layout>
  );
}
