import { api } from '@/api';
import { AuthHeader } from '@/components/auth-header';
import { OfferCard } from '@/components/home/offers';
import { Layout } from '@/components/layout';
import { LoadingState } from '@/components/loading-state';
import { ServiceRequestData } from '@/hooks/types';
import { useMarketplaceContext } from '@/providers/use-marketplace-context';
import { useQueries } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AppState, View } from 'react-native';

export default function Screen() {
  const [artisanProfile, serviceRequests] = useQueries({
    queries: [api.getCurrentArtisanProfile(), api.getAllServiceRequest()],
  });

  const { requests } = useMarketplaceContext({
    onOfferEvent(eventType, data) {
      serviceRequests?.refetch();
    },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOnRefresh = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([artisanProfile.refetch(), serviceRequests?.refetch()]);
    } catch (error) {
    } finally {
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // Refetch all data
        artisanProfile?.refetch();
        serviceRequests?.refetch();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const pendingRequests = serviceRequests?.data?.requests?.filter(
    (i) => i.status === 'open' || i.status === 'in_negotiation'
  );

  // Transform pendingOffers to ServiceRequestData format
  const transformedPendingRequests: ServiceRequestData[] =
    pendingRequests?.map((request) => ({
      categoryId: request?.category?.id || '',
      title: request?.title || '',
      budgetMax: request?.budgetMax || 0,
      budgetMin: request?.budgetMin || 0,
      createdAt: request?.createdAt || '',
      id: request?.id || '',
      categoryName: request?.category?.name || '',
      description: request?.description || '',
      preferredDate: request?.createdAt || '',
      serviceAddress: request?.serviceAddress || '',
      user: request?.user
        ? {
            name: request?.user?.profile?.fullName || '',
            avatarUrl: request?.user?.profile?.avatarUrl || '',
          }
        : {
            avatarUrl: '',
            name: '',
          },
    })) || [];

  // Create a Set of IDs from socket requests for efficient lookup
  const socketRequestIds = new Set(requests?.requests?.map((r) => r.id));

  // Filter API data to exclude items already in socket data
  const uniqueApiData = transformedPendingRequests.filter(
    (offer) => !socketRequestIds.has(offer.id)
  );

  const oneDayInMs = 24 * 60 * 60 * 1000;
  const now = new Date().getTime();

  // Unify requests and pendingRequests, sort by createdAt (most recent first), take first 2
  const unifiedData: ServiceRequestData[] = [...(requests?.requests || []), ...uniqueApiData]
    .filter((item) => now - new Date(item.createdAt).getTime() <= oneDayInMs)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
      {artisanProfile?.isLoading || serviceRequests?.isLoading ? (
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
