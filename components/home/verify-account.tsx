import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { ArrowUpRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

export function VerifyAccount() {
  const { data, isLoading } = useQuery(api.getCurrentArtisanProfile());

  if (data?.verificationStatus === 'verified' || isLoading) return null;

  // verificstion rejected, retry the verification

  return (
    <View className="flex gap-1 rounded-[8px] border border-[#DFDFE1] bg-[#F4F4F5] p-4">
      <Text className="font-cabinet-bold text-[#1B1B1E]">Hi There! 👋</Text>

      <View className="flex flex-row items-center justify-between gap-2">
        <Text className="flex-1 text-sm text-[#737381]">
          {data?.verificationStatus === 'in_progress'
            ? "Your account verification is in progress. We'll notify you once it's complete."
            : data?.verificationStatus === 'rejected'
              ? 'Your verification has been rejected. Please retry verification or contact support.'
              : 'You need to verify your account to get started.'}
        </Text>

        {data?.verificationStatus === 'in_progress' ? null : (
          <Pressable
            onPress={() => {
              if (data === undefined || !data?.previousJobUrls) {
                router.navigate('/verify/step-2');
              } else {
                router.navigate('/verification');
              }
            }}
            className="flex flex-row items-center gap-1">
            <Text className="font-cabinet-bold text-sm text-primary">Verify</Text>

            <ArrowUpRight size={14} color={'#FE6A00'} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
