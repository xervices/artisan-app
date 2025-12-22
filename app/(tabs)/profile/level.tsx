import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';

const data = [
  {
    id: 1,
    title: '1.⁠ ⁠Starter — 10 jobs & 10% rating',
    badge: require('@/assets/icons/level-1.svg'),
  },
  {
    id: 2,
    title:
      '2.⁠ ⁠Skilled — 20 jobs & 10% rating — Ask them for picture and send then t-shirt or cap',
    badge: require('@/assets/icons/level-2.svg'),
  },
  {
    id: 3,
    title: '3.⁠ ⁠Pro — 50 Jobs & 20% rating — Ask them for picture and send then t-shirt or cap',
    badge: require('@/assets/icons/level-3.svg'),
  },
  {
    id: 4,
    title: '4.⁠ ⁠Expert — 100 job & 50% — Give cover-raw & cap',
    badge: require('@/assets/icons/level-4.svg'),
  },
  {
    id: 5,
    title: '5.⁠ ⁠Elite — 200 jobs & 90% — Tool box & cover-raw & cap',
    badge: require('@/assets/icons/level-5.svg'),
  },
];

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Your level" />
        </View>
      }>
      <View className="flex-1 gap-4">
        <View className="flex flex-row items-center justify-between gap-4 rounded-[8px] bg-[#140900] p-4">
          <View className="flex gap-4">
            <Text className="font-cabinet-bold text-sm text-[#FFF4EA]">Sarah Rodri</Text>

            <View className="flex flex-row items-center gap-6">
              <Text className="font-cabinet-bold text-xs text-[#FFAC70]">
                Total Jobs : <Text className="text-xs text-[#FFAC70]">10</Text>
              </Text>

              <Text className="font-cabinet-bold text-xs text-[#FFAC70]">
                Rating : <Text className="text-xs text-[#FFAC70]">10%</Text>
              </Text>
            </View>
          </View>

          <Image
            source={require('@/assets/icons/level-1.svg')}
            style={{ width: 56, height: 56 }}
            contentFit="contain"
          />
        </View>

        <View className="flex flex-row items-center justify-between rounded-[8px] bg-[#FFF4EA] p-4">
          <View className="flex">
            <Text className="font-cabinet-bold text-sm text-[#3E1A00]">Level limit</Text>

            <Text className="text-xs text-[#737381]">
              The higher your level the more visible you are to users.
            </Text>
          </View>
        </View>

        {data.map((i) => (
          <View
            key={i.id}
            className="flex flex-row items-center justify-between gap-2 rounded-[8px] bg-[#F4F4F5] p-4">
            <Text className="flex-1 text-sm text-[#737381]">{i.title}</Text>

            <Image source={i.badge} style={{ width: 32, height: 32 }} contentFit="contain" />
          </View>
        ))}
      </View>
    </Layout>
  );
  ``;
}
