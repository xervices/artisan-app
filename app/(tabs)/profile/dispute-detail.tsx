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
  const { id } = useLocalSearchParams();

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Disputes" />
        </View>
      }>
      <View className="flex-1 gap-4">
        <View className="flex w-full flex-row">
          <View className="flex w-1/2 flex-row items-center gap-2">
            <Avatar alt="User's Avatar" className="h-14 w-14">
              <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
              <AvatarFallback className="bg-primary">
                <Text className="font-cabinet-bold leading-none">ZN</Text>
              </AvatarFallback>
            </Avatar>

            <View>
              <View className="flex flex-row items-center">
                <Text className="font-cabinet-bold text-[18px] text-[#1B1B1E]">Sarah Rodri</Text>

                <BadgeCheck size={16} fill={'#FE6A00'} stroke={'#FFFFFF'} />
              </View>

              <Text className="text-xs text-[#1B1B1E]">Plumbing Specialist</Text>

              <Text className="text-xs text-[#FF6A00]">4.9 ★ (145)</Text>
            </View>
          </View>

          <View className="flex w-1/2 justify-between">
            <Text className="text-right text-xs text-[#FF6A00]">JOB ID ● #25667</Text>

            <Text className="text-right font-cabinet-bold text-[18px] text-[#FF6A00]">₦8500</Text>
          </View>
        </View>

        <View className="flex w-full flex-row justify-between">
          <Text className="flex-1 text-sm text-[#737381]">Booking Date & Time</Text>

          <Text className="font-cabinet-bold text-sm text-[#737381]">2025-11-27 17:47:27</Text>
        </View>

        <View className="flex w-full flex-row justify-between">
          <Text className="flex-1 text-sm text-[#737381]">Job Description</Text>

          <Text className="font-cabinet-bold text-sm text-[#737381]">Plumbing</Text>
        </View>

        <View className="w-full rounded-[4px] border border-[#DFDFE1] p-4">
          <Text className="flex-1 text-sm text-[#737381]">Work Quality Issues</Text>
        </View>

        <View>
          <Text className="font-cabinet-bold text-[#737381]">Concern</Text>

          <View className="w-full rounded-[4px] border border-[#DFDFE1] p-4">
            <Text className="flex-1 text-sm text-[#737381]">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
              euismod tincidunt ut laoreet
            </Text>
          </View>
        </View>

        <View>
          <Text className="font-cabinet-bold text-[#737381]">Photos or Videos</Text>

          <Text className="flex-1 text-sm text-[#737381]">Photos and videos before and after</Text>

          <View className="mt-2 flex gap-2">
            <View>
              <Text className="font-cabinet-bold text-xs text-[#B4B4BC]">Before</Text>

              <View className="flex flex-row flex-wrap gap-2">
                {new Array(4).fill(0).map((_, index) => (
                  <View key={index} className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                    <Image
                      source={require('@/assets/images/sample.png')}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </View>
            </View>

            <View>
              <Text className="font-cabinet-bold text-xs text-[#B4B4BC]">After</Text>

              <View className="flex flex-row flex-wrap gap-2">
                {new Array(4).fill(0).map((_, index) => (
                  <View key={index} className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                    <Image
                      source={require('@/assets/images/sample.png')}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text className="font-cabinet-bold text-[#FE6A00]">Conclusion</Text>

          <View className="w-full rounded-[4px] border border-[#DFDFE1] p-4">
            <Text className="flex-1 text-sm text-[#1B1B1E]">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
            </Text>
          </View>
        </View>
      </View>
    </Layout>
  );
}
