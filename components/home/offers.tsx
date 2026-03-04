import { AppState, Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowUpRight, BadgeCheck, ChevronDown, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { paths } from '@/api/schema';
import { formatRelativeTime } from '@/lib/utils';
import { ServiceRequestData } from '@/hooks/types';
import { useMarketplaceContext } from '@/providers/use-marketplace-context';
import React from 'react';

export function Offers() {
  const { requests } = useMarketplaceContext();

  const { data, refetch } = useQuery(api.getAllServiceRequest());
  const offers = useQuery(api.getArtisanOffers());

  const pendingRequests = data?.requests?.filter(
    (i) => i.status === 'open' || i.status === 'in_negotiation'
  );

  const pendingOffers = offers?.data?.filter(
    (i) => i.serviceRequest?.status === 'in_negotiation' && i.status === 'pending'
  );

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // Refetch all data
        refetch();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Transform pendingRequests to ServiceRequestData format
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

  const transformedPendingOffers: ServiceRequestData[] =
    pendingOffers?.map((request) => ({
      categoryId: request?.serviceRequest?.category?.id || '',
      title: request?.serviceRequest?.title || '',
      budgetMax: request?.serviceRequest?.budgetMax || 0,
      budgetMin: request?.serviceRequest?.budgetMin || 0,
      createdAt: request?.serviceRequest?.createdAt || '',
      id: request?.serviceRequest?.id || '',
      categoryName: request?.serviceRequest?.category?.name || '',
      description: request?.serviceRequest?.description || '',
      preferredDate: request?.serviceRequest?.createdAt || '',
      serviceAddress: request?.serviceRequest?.serviceAddress || '',
      user: request?.serviceRequest?.user
        ? {
            name: request?.serviceRequest?.user?.profile?.fullName || '',
            avatarUrl: request?.serviceRequest?.user?.profile?.avatarUrl || '',
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

  const uniqueOffersData = transformedPendingOffers.filter(
    (offer) => !socketRequestIds.has(offer.id)
  );

  // Unify requests and pendingRequests, sort by createdAt (most recent first), take first 2
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const now = new Date().getTime();

  const unifiedData: ServiceRequestData[] = [
    ...(requests?.requests || []),
    ...uniqueApiData,
    ...uniqueOffersData,
  ]
    .filter((item) => now - new Date(item.createdAt).getTime() <= oneDayInMs)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  // Return null if no data
  if (unifiedData.length === 0) return null;

  return (
    <View className="flex gap-2">
      <Text className="font-cabinet-medium text-xs uppercase">New request</Text>

      <View className="flex gap-4">
        {unifiedData.map((offer) => (
          <OfferCard key={offer.id} data={offer} />
        ))}
      </View>

      <Pressable
        onPress={() => router.navigate('/requests')}
        className="mt-1 flex flex-row items-center gap-1">
        <Text className="font-cabinet-bold text-xs leading-none text-[#737381]">Show all</Text>

        <ChevronDown size={12} />
      </Pressable>
    </View>
  );
}

export type OfferType =
  paths['/api/offers/my-offers']['get']['responses'][200]['content']['application/json'][0];

interface OfferCardType {
  data: ServiceRequestData;
}

export function OfferCard({ data }: OfferCardType) {
  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
      className="flex gap-4 rounded-[8px] bg-white p-4">
      <View className="flex flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="font-cabinet-bold text-[#1B1B1E]">{data.categoryName}</Text>
          <Text className="text-xs text-[#FE6A00]">{formatRelativeTime(data.createdAt)}</Text>
        </View>

        <View className="flex flex-1 flex-row items-center justify-end gap-1">
          <Avatar alt="User's Avatar" className="h-6 w-6">
            <AvatarImage source={{ uri: data?.user?.avatarUrl }} />
            <AvatarFallback className="bg-primary">
              <Text className="font-cabinet-bold text-xs uppercase leading-none">
                {data?.user?.name?.substring(0, 2)}
              </Text>
            </AvatarFallback>
          </Avatar>

          <Text className="font-cabinet-bold text-sm text-[#737381]">{data?.user?.name}</Text>
        </View>
      </View>

      <Button
        onPress={() =>
          router.navigate({
            pathname: '/request',
            params: {
              id: data.id,
            },
          })
        }>
        View offer
      </Button>
    </View>
  );
}
