import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { useQueries, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingState } from '@/components/loading-state';
import { useAuthStore } from '@/store/auth-store';

const badgeIcons = [
  require('@/assets/icons/level-1.svg'),
  require('@/assets/icons/level-2.svg'),
  require('@/assets/icons/level-3.svg'),
  require('@/assets/icons/level-4.svg'),
  require('@/assets/icons/level-5.svg'),
];

const BADGEICONS = {
  STARTER: require('@/assets/icons/level-1.svg'),
  SKILLED: require('@/assets/icons/level-2.svg'),
  PRO: require('@/assets/icons/level-3.svg'),
  EXPERT: require('@/assets/icons/level-4.svg'),
  ELITE: require('@/assets/icons/level-5.svg'),
};

export default function Screen() {
  const { user } = useAuthStore();

  const [levels, myLevel, artisan] = useQueries({
    queries: [api.getLevels(), api.getMyLevel(), api.getCurrentArtisanProfile()],
  });

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Your Level" />
        </View>
      }>
      {levels?.isLoading || myLevel?.isLoading ? (
        <LoadingState title="Loading levels..." />
      ) : (
        <View className="flex-1 gap-4">
          <View className="flex flex-row items-center justify-between gap-4 rounded-[8px] bg-[#140900] p-4">
            <View className="flex gap-4">
              <Text className="font-cabinet-bold text-sm text-[#FFF4EA]">
                {user?.profile?.fullName}
              </Text>

              <View className="flex flex-row items-center gap-6">
                <Text className="font-cabinet-bold text-xs text-[#FFAC70]">
                  Total Jobs :{' '}
                  <Text className="text-xs text-[#FFAC70]">
                    {myLevel?.data?.totalJobsCompleted}
                  </Text>
                </Text>

                <Text className="font-cabinet-bold text-xs text-[#FFAC70]">
                  Rating :{' '}
                  <Text className="text-xs text-[#FFAC70]">
                    {artisan?.data?.averageRating ? artisan?.data?.averageRating : 0}★
                  </Text>
                </Text>
              </View>
            </View>

            {myLevel?.data && BADGEICONS[myLevel?.data?.currentLevel] ? (
              <Image
                source={BADGEICONS[myLevel?.data?.currentLevel]}
                style={{ width: 56, height: 56 }}
                contentFit="contain"
              />
            ) : null}
          </View>

          <View className="flex flex-row items-center justify-between rounded-[8px] bg-[#FFF4EA] p-4">
            <View className="flex">
              <Text className="font-cabinet-bold text-sm text-[#3E1A00]">Level limit</Text>

              <Text className="text-xs text-[#737381]">
                The higher your level, the more visible you are to users.
              </Text>
            </View>
          </View>

          {levels?.data?.map((level) => (
            <View
              key={level.id}
              className="flex flex-row items-center justify-between gap-2 rounded-[8px] bg-[#F4F4F5] p-4">
              <Text className="flex-1 text-sm text-[#737381]">
                {level?.displayOrder}. {level?.displayName} - {level?.minJobsRequired} jobs &{' '}
                {level?.commissionPercent}% rating
              </Text>

              {BADGEICONS[level?.level] ? (
                <Image
                  source={BADGEICONS[level?.level]}
                  style={{ width: 32, height: 32 }}
                  contentFit="contain"
                />
              ) : null}
            </View>
          ))}
        </View>
      )}
    </Layout>
  );
  ``;
}
