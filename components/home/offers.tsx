import { Pressable, View } from 'react-native';
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

export function Offers() {
  const { requests } = useMarketplaceContext();

  const { data } = useQuery(api.getArtisanOffers());

  // const negotiatingOffers = data?.filter(
  //   (offer, index, self) =>
  //     self.findIndex((o) => o.serviceRequest?.id === offer.serviceRequest?.id) === index
  // );

  if (!requests || !requests.requests || requests.requests.length === 0) return null;

  return (
    <View className="flex gap-2">
      <Text className="font-cabinet-medium text-xs uppercase">New request</Text>

      <View className="flex gap-4">
        {requests.requests?.slice(0, 2)?.map((offer) => (
          <OfferCard key={offer.id} data={offer} />
        ))}

        {/* {negotiatingOffers &&
          negotiatingOffers?.length > 0 &&
          negotiatingOffers?.slice(0, 2)?.map((offer) => (
            <OfferCard
              key={offer.id}
              data={{
                categoryId: offer.serviceRequest?.category.name || '',
                title: offer.serviceRequest?.title || '',
                budgetMax: offer.serviceRequest?.budgetMax || 0,
                budgetMin: offer.serviceRequest?.budgetMin || 0,
                createdAt: offer.serviceRequest?.createdAt || '',
                id: offer.serviceRequest?.id || '',
              }}
            />
          ))} */}
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
          <Text className="font-cabinet-bold text-[#1B1B1E]">{data.categoryId}</Text>
          <Text className="text-xs text-[#FE6A00]">{formatRelativeTime(data.createdAt)}</Text>
        </View>

        <View className="flex flex-1 flex-row items-center justify-end gap-1">
          <Avatar alt="User's Avatar" className="h-6 w-6">
            <AvatarImage source={{ uri: data?.avatarUrl }} />
            <AvatarFallback className="bg-primary">
              <Text className="font-cabinet-bold text-xs uppercase leading-none">
                {data?.username?.substring(0, 2)}
              </Text>
            </AvatarFallback>
          </Avatar>

          <Text className="font-cabinet-bold text-sm text-[#737381]">{data?.username}</Text>
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
