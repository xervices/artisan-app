import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { ArrowUpRight, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { useQueries, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function RateClientPrompt() {
  const { data } = useQuery(api.getUserJobs());

  const approvedJobs = data?.filter((i) => i.status === 'approved') ?? [];

  const reviewChecks = useQueries({
    queries: approvedJobs.map((job) => api.canReview(job.id)),
  });

  const reviewableIndex = reviewChecks.findIndex((r) => r.data?.canReview === true);
  const job = reviewableIndex >= 0 ? approvedJobs[reviewableIndex] : null;

  if (!job) return null;

  const fullName = job.user?.profile?.fullName;
  const avatarUrl = job.user?.profile?.avatarUrl;

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: '/rate',
          params: {
            id: job.id,
            customerId: job.userId,
          },
        })
      }
      className="flex gap-3 rounded-[8px] border border-[#FFE6D6] bg-[#FFF4EA] p-4">
      <View className="flex flex-row items-center gap-2">
        <Star size={16} fill="#FE6A00" stroke="#FE6A00" />
        <Text className="font-cabinet-bold text-[#1B1B1E]">Rate your client</Text>
      </View>

      <View className="flex flex-row items-center justify-between gap-2">
        <View className="flex flex-1 flex-row items-center gap-2">
          <Avatar alt="Client avatar" className="h-8 w-8">
            <AvatarImage source={{ uri: avatarUrl ?? undefined }} />
            <AvatarFallback className="bg-primary">
              <Text className="font-cabinet-bold text-xs uppercase leading-none">
                {fullName?.substring(0, 2)}
              </Text>
            </AvatarFallback>
          </Avatar>

          <Text className="flex-1 text-sm text-[#737381]">
            {fullName ? `${fullName} approved your work.` : 'Your client approved your work.'}{' '}
            Share your experience.
          </Text>
        </View>

        <View className="flex flex-row items-center gap-1">
          <Text className="font-cabinet-bold text-sm text-primary">Rate</Text>
          <ArrowUpRight size={14} color="#FE6A00" />
        </View>
      </View>
    </Pressable>
  );
}
