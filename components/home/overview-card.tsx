import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';

export function OverviewCard() {
  const [balanceVisibility, setBalanceVisibility] = useState(true);

  return (
    <View className="flex gap-2">
      <Text className="font-cabinet-medium text-xs uppercase leading-none text-[#1B1B1E]">
        Overview
      </Text>

      <View className="flex gap-2 rounded-[8px] bg-[#0A0A0B] px-4 py-3">
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <Text className="text-xs text-[#FFF4EA]">Earned</Text>
            <Text className="font-cabinet-bold text-xl text-[#FFB884]">
              {balanceVisibility ? '₦0,00' : '₦✼✼✼✼✼✼✼'}
            </Text>
          </View>

          <Pressable
            onPress={() => setBalanceVisibility((prev) => !prev)}
            accessibilityLabel={balanceVisibility ? 'Show balance' : 'Hide balance'}
            accessibilityRole="button"
            // HitSlop increases the touchable area without changing the layout
            hitSlop={8}>
            {balanceVisibility ? (
              <EyeOff size={20} color="#FFB884" />
            ) : (
              <Eye size={20} color="#FFB884" />
            )}
          </Pressable>
        </View>

        <View className="flex flex-row items-center gap-1">
          <Text className="text-xs text-[#FFF4EA]">Incoming payment</Text>

          <View className="h-1 w-1 rounded-full bg-[#FE6A00]" />

          <Text className="font-cabinet-bold text-xs text-[#FFF4EA]">
            {balanceVisibility ? '₦0,00' : '₦✼✼✼✼✼✼✼'}
          </Text>
        </View>
      </View>
    </View>
  );
}
