import { Stack, usePathname } from 'expo-router';
import { Layout } from '@/components/layout';
import { View } from 'react-native';
import { AuthHeader } from '@/components/auth-header';

export default function VerifyLayout() {
  const pathname = usePathname();

  const currentStep = pathname === '/verify' ? 1 : pathname === '/verify/step-2' ? 2 : 0;

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Tell us about yourself" />

          <View className="mt-2 flex flex-row gap-2">
            <View className={`h-2 flex-1 rounded-full bg-[#FE6A00]`} />
            <View
              className={`h-2 flex-1 rounded-full ${currentStep > 1 ? 'bg-[#FE6A00]' : 'bg-[#E9E9EB]'}`}
            />
          </View>
        </View>
      }>
      <Stack screenOptions={{ headerShown: false }} />
    </Layout>
  );
}
