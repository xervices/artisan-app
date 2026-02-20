import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';
import { Button } from '../ui/button';
import { SheetManager } from 'react-native-actions-sheet';
import { formatCurrency } from '@/lib/utils';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

interface BalanceCardProp {
  balance?: number;
  totalEarned?: number;
  incomingPayment?: number;
  hasSavedBank?: boolean;
  commissionRate?: number;
  isPercentage?: boolean;
}

export function BalanceCard({
  balance,
  incomingPayment,
  totalEarned,
  hasSavedBank,
  commissionRate,
  isPercentage,
}: BalanceCardProp) {
  const { data } = useQuery(api.getCurrentArtisanProfile());
  const [balanceVisibility, setBalanceVisibility] = useState(true);

  return (
    <View className="flex gap-2 rounded-[8px] bg-[#0A0A0B] px-4 py-3">
      <View className="relative flex flex-row gap-2">
        <View className="flex-1">
          <Text className="text-xs text-[#FFF4EA]">Total Earned</Text>
          <Text className="font-cabinet-bold text-xl text-[#FFB884]">
            {balanceVisibility ? formatCurrency(totalEarned) : '₦✼✼✼✼✼✼✼'}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-[#FFF4EA]">Earned</Text>
          <Text className="font-cabinet-bold text-xl text-[#FFB884]">
            {balanceVisibility ? formatCurrency(balance) : '₦✼✼✼✼✼✼✼'}
          </Text>
        </View>

        <Pressable
          onPress={() => setBalanceVisibility((prev) => !prev)}
          accessibilityLabel={balanceVisibility ? 'Show balance' : 'Hide balance'}
          accessibilityRole="button"
          hitSlop={8}
          className="absolute right-0 top-0">
          {balanceVisibility ? (
            <EyeOff size={20} color="#FFB884" />
          ) : (
            <Eye size={20} color="#FFB884" />
          )}
        </Pressable>
      </View>

      {incomingPayment ? (
        <View className="flex flex-row items-center gap-1">
          <Text className="text-xs text-[#FFF4EA]">Incoming payment</Text>

          <View className="h-1 w-1 rounded-full bg-[#FE6A00]" />

          <Text className="font-cabinet-bold text-xs text-[#FFF4EA]">
            {balanceVisibility ? formatCurrency(incomingPayment) : '₦✼✼✼✼✼✼✼'}
          </Text>
        </View>
      ) : null}

      <Button
        onPress={() => {
          if (!data?.isVerified) {
            router.navigate('/verification');
          } else if (hasSavedBank) {
            SheetManager.show('withdraw-sheet');
          } else {
            router.navigate('/earnings/add-bank');
          }
        }}
        className="mt-3 border-[#B74C01] bg-[#FE6A00]">
        Withdraw
      </Button>

      {commissionRate ? (
        <Text className="text-center text-xs text-[#FFF4EA]">
          Xervices collects a {isPercentage ? `${commissionRate}%` : formatCurrency(commissionRate)}{' '}
          service fee{' '}
        </Text>
      ) : null}
    </View>
  );
}
