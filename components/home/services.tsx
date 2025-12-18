import { Image } from 'expo-image';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { LegendList } from '@legendapp/list';
import { ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';

const data = [
  {
    id: 1,
    name: 'Plumber',
    icon: require('@/assets/icons/plumber.svg'),
  },
  {
    id: 2,
    name: 'Cleaner',
    icon: require('@/assets/icons/cleaner.svg'),
  },
  {
    id: 3,
    name: 'Painter',
    icon: require('@/assets/icons/painter.svg'),
  },
  {
    id: 4,
    name: 'Carpenter',
    icon: require('@/assets/icons/carpenter.svg'),
  },
  {
    id: 5,
    name: 'Electrician',
    icon: require('@/assets/icons/electrician.svg'),
  },
  {
    id: 6,
    name: 'Gardener',
    icon: require('@/assets/icons/gardener.svg'),
  },
];

export function Services() {
  return (
    <View className="flex gap-2 px-6">
      <Text className="font-cabinet-medium text-xs uppercase">Our Services</Text>

      <LegendList
        data={data}
        numColumns={3}
        renderItem={({ item }) => (
          <Pressable className="flex aspect-square w-full items-center justify-center gap-[2px] rounded-[8px] border border-[#FFCFAD]">
            <Image source={item.icon} style={{ width: 24, height: 24 }} contentFit="contain" />

            <Text className="text-center font-cabinet-bold text-xs text-[#737381]">
              {item.name}
            </Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.name}
        recycleItems
        contentContainerStyle={{
          gap: 16,
        }}
        style={{
          paddingHorizontal: 10,
        }}
      />

      <Pressable
        onPress={() => router.navigate('/services')}
        className="mt-1 flex flex-row items-center gap-1">
        <Text className="font-cabinet-bold text-xs leading-none text-[#737381]">Show all</Text>

        <ChevronDown size={12} />
      </Pressable>
    </View>
  );
}
