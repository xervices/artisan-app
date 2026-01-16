import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { ArrowUpRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

export function VerifyAccount() {
  const { data, isLoading } = useQuery(api.getCurrentArtisanProfile());

  if (data?.verificationStatus !== 'rejected' || isLoading) return null;

  return (
    <View className="flex gap-1 rounded-[8px] border border-[#DFDFE1] bg-[#F4F4F5] p-4">
      <Text className="font-cabinet-bold text-[#1B1B1E]">Hi There! 👋</Text>

      <View className="flex flex-row items-center justify-between">
        <Text className="text-sm text-[#737381]">You need to verify your account.</Text>

        <Pressable
          onPress={() => router.navigate('/verify/step-2')}
          className="flex flex-row items-center gap-1">
          <Text className="font-cabinet-bold text-sm text-primary">Verify</Text>

          <ArrowUpRight size={14} color={'#FE6A00'} />
        </Pressable>
      </View>
    </View>
  );
}
