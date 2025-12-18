import { Pressable, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Text } from '../ui/text';
import { ArrowLeft, Minus, Plus } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LoadingIndicator } from '../ui/loading-indicator';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function CounterOfferSheet(props: SheetProps<'counter-offer-sheet'>) {
  const [amount, setAmount] = useState(8500);

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
        <View className="relative flex w-full flex-row items-center gap-4">
          <Pressable
            onPress={() => {
              SheetManager.hide('counter-offer-sheet');
            }}
            className="h-8 w-8 justify-center">
            <ArrowLeft size={24} color={'#B4B4BC'} />
          </Pressable>

          <Text className="font-cabinet-bold text-[18px] text-[#737381]">
            Counteroffer to Sarah
          </Text>
        </View>

        <View className="flex w-1/2 flex-row items-center gap-2">
          <Avatar alt="User's Avatar" className="h-10 w-10">
            <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
            <AvatarFallback className="bg-primary">
              <Text className="font-cabinet-bold leading-none">ZN</Text>
            </AvatarFallback>
          </Avatar>

          <View>
            <Text className="font-cabinet-bold text-[18px] leading-none text-[#1B1B1E]">
              Sarah Rodri
            </Text>

            <Text className="text-[#B4B4BC]">
              Her offer: <Text className="text-[#FE6A00]">₦8500</Text>
            </Text>
          </View>
        </View>

        <View className="flex gap-4">
          <Text className="text-sm leading-none text-[#737381]">Your counteroffer</Text>

          {amount <= 8300 && (
            <Text className="text-center text-sm leading-none text-[#FFAC70]">Can’t go lower</Text>
          )}

          <View className="flex flex-row items-center justify-center gap-4">
            <Pressable
              onPress={() => {
                if (amount > 8300) {
                  setAmount((prev) => prev - 100);
                }
              }}
              className="flex h-8 w-12 items-center justify-center rounded-l-full bg-[#F4F4F5]">
              <Minus color={'#FF8733'} size={24} />
            </Pressable>

            <Text className="font-cabinet-bold leading-none text-[#1B1B1E]">₦{amount}</Text>

            <Pressable
              onPress={() => {
                setAmount((prev) => prev + 100);
              }}
              className="flex h-8 w-12 items-center justify-center rounded-r-full bg-[#F4F4F5]">
              <Plus color={'#FF8733'} size={24} />
            </Pressable>
          </View>
        </View>

        <Button>Send counteroffer</Button>
      </View>
    </ActionSheet>
  );
}
