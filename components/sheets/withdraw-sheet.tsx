import { Pressable, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Text } from '../ui/text';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LoadingIndicator } from '../ui/loading-indicator';
import { useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function WithdrawSheet(props: SheetProps<'withdraw-sheet'>) {
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
        <View className="flex w-full flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              SheetManager.hide('withdraw-sheet');
            }}
            className="h-8 w-8 justify-center">
            <ArrowLeft size={24} color={'#B4B4BC'} />
          </Pressable>

          <Pressable
            onPress={() => {
              SheetManager.hide('withdraw-sheet');
            }}>
            <Text className="font-cabinet-extrabold text-sm text-[#FE6A00]">Add Bank</Text>
          </Pressable>
        </View>

        <View>
          <Label>Amount </Label>
          <Input
            placeholder="₦0.00"
            className="bg-white"
            rightIcon={
              <Pressable>
                <Text className="text-sm text-[#FE6A00]">Max</Text>
              </Pressable>
            }
          />
          <Text className="text-xs text-[#737381]">
            Available Balance <Text className="text-xs text-[#FE6A00]">• ₦5,200</Text>
          </Text>
        </View>

        <View className="flex gap-2">
          <Text className="font-cabinet-bold text-sm text-[#737381]">Saved Bank</Text>

          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            className="flex flex-row items-center justify-between gap-4 rounded-[8px] bg-white px-2 py-4">
            <View className="flex flex-row items-center gap-4">
              <View className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#FE6A00]">
                <View className="flex flex-row items-center">
                  <View className="h-3 w-3 rounded-full bg-[#FE6A00]" />
                </View>
              </View>

              <Text className="text-sm text-[#B4B4BC]">GTB Alex Baker - 1224 234976</Text>
            </View>

            <Pressable>
              <Trash2 size={20} color={'#FA4B67'} />
            </Pressable>
          </View>
        </View>

        <Button
          onPress={() => {
            SheetManager.hide('withdraw-sheet');
            setTimeout(() => {
              SheetManager.show('pin-sheet');
            }, 1000);
          }}>
          Withdraw
        </Button>
      </View>
    </ActionSheet>
  );
}
