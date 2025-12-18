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
  Mail,
  MessageCircleMore,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Promotions & Rewards" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <View className="flex gap-4">
          <View className="flex gap-2">
            <Text className="font-cabinet-medium text-xs text-[#737381]">YOUR EARNINGS</Text>

            <Text className="font-cabinet-bold text-2xl text-[#737381]">₦5,200</Text>
          </View>

          <Button>Use Bonus</Button>
        </View>

        <View className="flex w-full flex-row gap-4">
          <View className="flex h-16 flex-1 items-center justify-center rounded-[8px] border border-[#FFE6D6]">
            <Text className="text-center font-cabinet-bold text-xl text-[#737381]">4</Text>
            <Text className="text-center text-xs text-[#B4B4BC]">Referrals</Text>
          </View>

          <View className="flex h-16 flex-1 items-center justify-center rounded-[8px] border border-[#FFE6D6]">
            <Text className="text-center font-cabinet-bold text-xl text-[#737381]">₦1000</Text>
            <Text className="text-center text-xs text-[#B4B4BC]">Per referral</Text>
          </View>
        </View>

        <View className="flex gap-2">
          <Text className="text-xs uppercase text-[#737381]">Your Referral Code</Text>

          <View className="flex h-32 w-full items-center justify-center gap-2 rounded-[8px] border border-[#FE6A00] bg-[#FFF4EA]">
            <Text className="text-center text-xs text-[#737381]">Share this code with friends</Text>

            <Text className="text-center font-cabinet-bold text-xl text-[#FE6A00]">ALEX2025</Text>

            <Button className="w-48" size={'sm'}>
              Copy Code
            </Button>
          </View>
        </View>

        <Text className="text-center text-xs text-[#737381]">Or share your referral link</Text>

        <View className="flex h-[52px] w-full flex-row items-center rounded-full bg-[#FFF4EA] px-2 pl-4">
          <Text
            className="flex-1 font-cabinet-bold text-sm text-[#FE6A00]"
            numberOfLines={1}
            ellipsizeMode="tail">
            xervices.app/ref/ALEX2025
          </Text>

          <Button className="w-16" size={'sm'}>
            Copy
          </Button>
        </View>

        <View className="flex gap-2">
          <Text className="text-xs uppercase text-[#737381]">My Discounts</Text>

          <View className="flex h-28 w-full items-center justify-center gap-2 rounded-[8px] border border-[#FE6A00] bg-[#E85A00]">
            <View className="flex h-5 items-center justify-center rounded-full bg-[#FF9445] px-2">
              <Text className="text-xs font-medium leading-none text-[#FFF4EA]">
                ACTIVE DISCOUNT
              </Text>
            </View>

            <Text className="text-center font-cabinet-bold text-2xl text-[#FFF4EA]">5% OFF</Text>

            <Text className="text-center text-xs text-[#FFF4EA]">
              Your first-time customer discount, valid for 30 days
            </Text>
          </View>
        </View>
      </View>
    </Layout>
  );
}
