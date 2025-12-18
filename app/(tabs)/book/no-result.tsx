import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ArrowUpRight, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Button } from '@/components/ui/button';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader />
        </View>
      }>
      <View className="flex-1 gap-4">
        <View className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#FFE6D6]">
          <Image
            source={require('@/assets/images/logo-primary.svg')}
            style={{ width: 120, height: 120 }}
            contentFit="contain"
          />
        </View>

        <View className="mt-10">
          <Text className="text-center font-cabinet-bold text-[#737381]">No Pro Found</Text>
          <Text className="mx-auto max-w-[90%] text-center text-sm text-[#737381]">
            Couldn't match you with any pro at the moment. Please try requesting later."
          </Text>
        </View>

        <Button className="mt-auto">Resubmit</Button>
      </View>
    </Layout>
  );
}
