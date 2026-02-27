import { View } from 'react-native';
import { Text } from '../ui/text';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface TransactionCardProps {
  type?: string;
  amount?: number;
  date?: string;
  customer?: string;
  jobId?: string;
  charge?: number;
  category?: string;
}

export default function TransactionCard({
  type = 'income',
  amount = 0,
  date,
  category = '',
  charge = 0,
  customer = '',
  jobId = '',
}: TransactionCardProps) {
  return (
    <View className="flex flex-shrink-0 flex-row gap-2 rounded-[8px] border border-[#F4F4F5] bg-white p-4">
      <View className="flex-1 gap-1">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-cabinet-bold text-sm text-[#737381]">
          {type === 'withdrawal'
            ? 'Withdrawal'
            : type === 'referral_bonus'
              ? 'Referral Bonus'
              : category}{' '}
          {type === 'referral_bonus' ? null : (
            <Text className="text-xs text-[#FF6A00]" numberOfLines={1} ellipsizeMode="tail">
              {type === 'withdrawal' ? 'WD ● ' : `JOB ID ● ${jobId}`}
            </Text>
          )}
        </Text>

        {(type === 'payment_received' || type === 'earning') && (
          <Text className="font-cabinet-bold text-sm text-[#737381]">
            {customer}
            <Text className="font-cabinet-bold text-sm text-[#22973B]">
              +{formatCurrency(amount + charge)}
            </Text>
          </Text>
        )}

        {type === 'withdrawal' ||
          (type === 'referral_bonus' && (
            <Text className="font-cabinet-bold text-sm text-[#737381]">
              Amount
              <Text className="font-cabinet-bold text-sm text-[#22973B]">
                +{formatCurrency(amount)}
              </Text>
            </Text>
          ))}

        {type === 'dispute' && (
          <Text className="font-cabinet-bold text-sm text-[#737381]">
            {customer}
            <Text className="font-cabinet-bold text-sm text-[#B3031E]">
              +{formatCurrency(amount)}
            </Text>
          </Text>
        )}
      </View>

      <View className="flex items-end gap-1">
        {(type === 'payment_received' || type === 'earning') && (
          <Text className="text-sm text-[#22973B]">
            Income{' '}
            <Text className="font-cabinet-bold text-sm text-[#22973B]">
              +{formatCurrency(amount)}
            </Text>
          </Text>
        )}

        {(type === 'payment_received' || type === 'earning') && (
          <Text className="text-sm text-[#737381]">
            Charges
            <Text className="font-cabinet-bold text-sm text-[#737381]">
              {formatCurrency(charge)}
            </Text>
          </Text>
        )}

        {type === 'dispute' && <Text className="text-sm text-[#B3031E]">Dispute</Text>}

        <Text className="text-xs text-[#737381]">{formatDateTime(date)}</Text>
      </View>
    </View>
  );
}
