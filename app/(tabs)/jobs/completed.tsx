import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import {
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  EllipsisVertical,
  Mail,
  MapPin,
  MessageCircleMore,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingState } from '@/components/loading-state';
import { formatCurrency } from '@/lib/utils';

export default function Screen() {
  const { id }: { id: string } = useLocalSearchParams();

  const { isLoading, data, refetch, isRefetching } = useQuery(api.getJobDetail(id));

  const beforeEvidence = data?.evidence?.filter((i) => i.evidenceType === 'before');
  const afterEvidence = data?.evidence?.filter((i) => i.evidenceType === 'after');

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 4,
    right: 4,
  };

  return (
    <Layout
      useBackground
      isRefreshing={isRefetching}
      onRefresh={refetch}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Completed Jobs" />
        </View>
      }>
      {isLoading ? (
        <LoadingState title="Loading job details..." />
      ) : (
        <View className="flex-1 gap-6">
          <View className="flex w-full flex-row justify-between gap-4">
            <View className="flex flex-1 flex-row items-center gap-2">
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

            <View className="flex max-w-[40%] flex-row items-center gap-2">
              <Text
                className="flex-shrink text-right text-xs text-[#FF6A00]"
                numberOfLines={1}
                ellipsizeMode="tail">
                JOB ID ● {id}
              </Text>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Pressable className="flex h-4 w-4 items-center justify-center">
                    <EllipsisVertical color={'#737381'} />
                  </Pressable>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  insets={contentInsets}
                  sideOffset={2}
                  className="w-56 bg-white"
                  align="start">
                  <DropdownMenuItem
                    onPress={() =>
                      router.navigate({
                        pathname: '/jobs/dispute',
                        params: {
                          id,
                        },
                      })
                    }>
                    <Text className="font-cabinet-bold">Raise Dispute</Text>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </View>
          </View>

          <View className="flex gap-4">
            <Text className="text-sm text-[#737381]">Progress update</Text>

            <View
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
              className="flex flex-row items-center justify-between gap-4 rounded-[8px] bg-white p-4">
              <Image
                source={require('@/assets/icons/location.svg')}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />

              <View className="flex-1">
                <Text className="font-cabinet-bold text-sm text-[#1B1B1E]">
                  You arrived at the location
                </Text>
                <Text className="text-xs leading-none text-[#B4B4BC]">0:9AM - 27-11-2025</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                router.navigate({
                  pathname: '/jobs/photo-preview',
                  params: {
                    type: 'Before',
                    id: id,
                  },
                });
              }}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
              className="flex flex-row justify-between gap-4 rounded-[8px] bg-white p-4">
              <Image
                source={require('@/assets/icons/checkin.svg')}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />

              <View className="flex-1 gap-1">
                <Text className="font-cabinet-bold text-sm text-[#1B1B1E]">
                  You checked in and started work
                </Text>

                <Text className="text-xs text-[#B4B4BC]">Before photo has been attached</Text>

                <View className="mt-1 flex flex-row flex-wrap gap-2">
                  {beforeEvidence?.map((item) => (
                    <View
                      key={item?.id}
                      className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                      <Image
                        source={item?.mediaUrl}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                      />
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                router.navigate({
                  pathname: '/jobs/photo-preview',
                  params: {
                    type: 'After',
                    id: id,
                  },
                });
              }}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
              className="flex flex-row justify-between gap-4 rounded-[8px] bg-white p-4">
              <Image
                source={require('@/assets/icons/checkout.svg')}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />

              <View className="flex-1 gap-1">
                <Text className="font-cabinet-bold text-sm text-[#1B1B1E]">
                  You are done and has checked out
                </Text>

                <Text className="text-xs text-[#B4B4BC]">After photo has been attached</Text>

                <View className="mt-1 flex flex-row flex-wrap gap-2">
                  {afterEvidence?.map((item) => (
                    <View
                      key={item?.id}
                      className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                      <Image
                        source={item?.mediaUrl}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                      />
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>

            <View className="flex flex-row items-center justify-between">
              <Text className="text-sm leading-none text-[#737381]">Promos</Text>
              <Text className="text-sm leading-none text-[#FF6A00]">XS12334555</Text>
            </View>

            <View className="mx-auto h-[1px] w-[92%] bg-[#F1F1F1]" />

            <View className="flex flex-row items-center justify-between">
              <Text className="text-sm leading-none text-[#737381]">Booking Date & Time</Text>
              <Text className="text-sm leading-none text-[#737381]">2025-11-27 17:47:27</Text>
            </View>

            <View className="mx-auto h-[1px] w-[92%] bg-[#F1F1F1]" />

            <View className="flex flex-row items-center justify-between">
              <Text className="text-sm leading-none text-[#737381]">Promo Discount</Text>
              <Text className="text-sm leading-none text-[#FF6A00]">₦500</Text>
            </View>

            <View className="flex flex-row items-center justify-between">
              <Text className="text-sm leading-none text-[#737381]">Total Price</Text>
              <Text className="text-sm leading-none text-[#FF6A00]">
                {formatCurrency(data?.finalAmount)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </Layout>
  );
}
