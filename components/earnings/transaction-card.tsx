import { View } from 'react-native';
import { Text } from '../ui/text';

interface TransactionCardProps {
  type?: 'income' | 'withdrawal' | 'dispute';
}

export default function TransactionCard({ type = 'income' }: TransactionCardProps) {
  return (
    <View className="flex flex-shrink-0 flex-row gap-2 rounded-[8px] border border-[#F4F4F5] bg-white p-4">
      <View className="flex-1 gap-1">
        <Text className="font-cabinet-bold text-sm text-[#737381]">
          {type === 'withdrawal' ? 'Withdrawal' : 'Plumber'}{' '}
          <Text className="text-xs text-[#FF6A00]">
            {type === 'withdrawal' ? 'WD ● #25667' : 'JOB ID ● #25667'}
          </Text>
        </Text>

        {type === 'income' && (
          <Text className="font-cabinet-bold text-sm text-[#737381]">
            Alex Baker
            <Text className="font-cabinet-bold text-sm text-[#22973B]">+₦8500</Text>
          </Text>
        )}

        {type === 'withdrawal' && (
          <Text className="font-cabinet-bold text-sm text-[#737381]">
            Amount
            <Text className="font-cabinet-bold text-sm text-[#22973B]">+₦8500</Text>
          </Text>
        )}

        {type === 'dispute' && (
          <Text className="font-cabinet-bold text-sm text-[#737381]">
            Alex Baker
            <Text className="font-cabinet-bold text-sm text-[#B3031E]">+₦8500</Text>
          </Text>
        )}
      </View>

      <View className="flex items-end gap-1">
        {type === 'income' && (
          <Text className="text-sm text-[#22973B]">
            Income <Text className="font-cabinet-bold text-sm text-[#22973B]">+₦8500</Text>
          </Text>
        )}

        {type === 'income' && (
          <Text className="text-sm text-[#737381]">
            Charges
            <Text className="font-cabinet-bold text-sm text-[#737381]">₦425</Text>
          </Text>
        )}

        {type === 'dispute' && <Text className="text-sm text-[#B3031E]">Dispute</Text>}

        <Text className="text-xs text-[#737381]">2025-11-27 17:47:27</Text>
      </View>
    </View>
  );
}
