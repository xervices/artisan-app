import { api } from '@/api';
import { AuthHeader } from '@/components/auth-header';
import { OfferCard } from '@/components/home/offers';
import { Layout } from '@/components/layout';
import { LoadingState } from '@/components/loading-state';
import { ServiceRequestData } from '@/hooks/types';
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

  const pendingOffers = artisanOffers?.data?.filter((i) => i.status === 'pending');

  // Transform pendingOffers to ServiceRequestData format
  const transformedPendingOffers: ServiceRequestData[] =
    pendingOffers?.map((offer) => ({
      categoryId: offer.serviceRequest?.category?.id || '',
      title: offer.serviceRequest?.title || '',
      budgetMax: offer.serviceRequest?.budgetMax || 0,
      budgetMin: offer.serviceRequest?.budgetMin || 0,
      createdAt: offer.serviceRequest?.createdAt || '',
      id: offer.serviceRequest?.id || '',
      categoryName: offer.serviceRequest?.category?.name || '',
      description: offer?.serviceRequest?.description || '',
      preferredDate: offer?.serviceRequest?.createdAt || '',
      serviceAddress: offer?.serviceRequest?.serviceAddress || '',
      user: offer?.serviceRequest?.user
        ? {
            name: offer?.serviceRequest?.user?.profile?.fullName || '',
            avatarUrl: offer?.serviceRequest?.user?.profile?.avatarUrl || '',
          }
        : {
            avatarUrl: '',
            name: '',
          },
    })) || [];

  // Unify requests and pendingOffers, sort by createdAt (most recent first), take first 2
  const unifiedData: ServiceRequestData[] = [
    ...(requests?.requests || []),
    ...transformedPendingOffers,
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log(unifiedData);

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
          {unifiedData?.map((offer) => (
            <OfferCard key={offer.id} data={offer} />
          ))}
        </View>
      )}
    </Layout>
  );
}
