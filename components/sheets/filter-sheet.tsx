import { Pressable, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Text } from '../ui/text';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LoadingIndicator } from '../ui/loading-indicator';
import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { OtpInput } from 'react-native-otp-entry';

const data = [
  {
    value: 'prev-month',
    label: 'Previous month',
  },
  {
    value: 'year',
    label: 'This year',
  },
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'month',
    label: 'This month',
  },
  {
    value: 'week',
    label: 'This week',
  },
];

export function FilterSheet(props: SheetProps<'filter-sheet'>) {
  const [selected, setSelected] = useState('');

  return (
    <ActionSheet
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      containerStyle={{
        backgroundColor: '#FFFFFF',
      }}
      indicatorStyle={{
        width: 38,
        height: 6,
        backgroundColor: '#FFF4EA',
      }}>
      <View className="flex gap-4 p-6 pt-0">
        <View className="flex w-full flex-row items-center justify-between border-b border-b-[#E9E9EB] py-4">
          <Pressable
            onPress={() => {
              SheetManager.hide('filter-sheet');
            }}
            className="flex flex-row items-center gap-4">
            <ArrowLeft size={24} color={'#B4B4BC'} />

            <Text className="text-sm text-[#737381]">Filters</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              SheetManager.hide('filter-sheet');
            }}>
            <Text className="font-cabinet-extrabold text-sm text-[#FE6A00]">Clear</Text>
          </Pressable>
        </View>

        <View className="flex w-full border-b border-b-[#E9E9EB] pb-4">
          <Text className="font-cabinet-bold text-[#737381]">Period</Text>

          <View className="flex flex-row flex-wrap gap-4">
            {data.map((i) => (
              <Pressable
                key={i.value}
                onPress={() => setSelected(i.value)}
                className={`flex h-9 items-center justify-center rounded-[8px] border ${selected === i.value ? 'border-[#FFB884] bg-[#FFF4EA]' : 'border-[#E9E9EB] bg-white'} px-3`}>
                <Text
                  className={`text-xs leading-none ${selected === i.value ? 'text-[#FE6A00]' : 'text-[#737381]'}`}>
                  {i.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="flex w-full border-b border-b-[#E9E9EB] pb-4">
          <Text className="font-cabinet-bold text-[#737381]">Select period</Text>

          <View className="flex flex-row items-center gap-6">
            <Pressable
              className={`flex h-9 flex-row items-center justify-center gap-2 rounded-[8px] border border-[#E9E9EB] bg-white px-3`}>
              <Image
                source={require('@/assets/icons/calendar.svg')}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />

              <Text className={`text-xs leading-none text-[#737381]`}>11 Dec 2018</Text>
            </Pressable>

            <View className="h-0.5 w-3 bg-[#737381]" />

            <Pressable
              className={`flex h-9 flex-row items-center justify-center gap-2 rounded-[8px] border border-[#E9E9EB] bg-white px-3`}>
              <Image
                source={require('@/assets/icons/calendar.svg')}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />

              <Text className={`text-xs leading-none text-[#737381]`}>20 Sep 2023</Text>
            </Pressable>
          </View>
        </View>

        <Button>Show results (6)</Button>
      </View>
    </ActionSheet>
  );
}
