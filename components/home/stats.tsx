import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { router } from 'expo-router';

export function Stats() {
  const { data } = useQuery(api.getCurrentArtisanProfile());

  return (
    <View className="flex flex-row gap-4">
      <View className="flex flex-1 items-center justify-center rounded-[4px] bg-[#F4F4F5] py-2">
        <Text className="text-center font-cabinet-bold text-lg text-[#737381]">
          {data?.totalJobsCompleted ? data?.totalJobsCompleted : 0}
        </Text>
        <Text className="text-center text-xs text-[#737381]">Jobs</Text>
      </View>

      <Pressable
        onPress={() => router.navigate('/requests')}
        className="flex flex-1 items-center justify-center rounded-[4px] bg-[#F4F4F5] py-2">
        <Text className="text-center font-cabinet-bold text-lg text-[#FE6A00]">
          {data?.averageRating ? data?.averageRating : 0}★
        </Text>
        <Text className="text-center text-xs text-[#737381]">Rating</Text>
      </Pressable>
    </View>
  );
}
