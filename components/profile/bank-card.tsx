import { api } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { LoadingIndicator } from '../ui/loading-indicator';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import { Trash2 } from 'lucide-react-native';

interface BankCardProps {
  id: string;
  accountName: string;
  maskedAccountNumber: string;
  bankName: string;
  bankCode: string;
  isVerified: boolean;
  isDefault: boolean;
  createdAt: string;
  onDeleteSuccessFn?: () => void;
  selectedBankId?: string;
}

export function BankCard({
  accountName,
  bankCode,
  bankName,
  createdAt,
  id,
  isDefault,
  isVerified,
  maskedAccountNumber,
  onDeleteSuccessFn,
  selectedBankId,
}: BankCardProps) {
  const { mutate, isPending } = useMutation(api.removeBankAccount(id));

  return (
    <View
      key={id}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
      className="flex flex-row items-center justify-between gap-8 rounded-[8px] bg-white px-2 py-4">
      <View className="flex flex-1 flex-row items-center gap-4">
        <View
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedBankId === id ? 'border-[#FE6A00]' : 'border-[#B4B4BC]'}`}>
          <View className="flex flex-row items-center">
            <View
              className={`h-3 w-3 rounded-full ${selectedBankId === id ? 'bg-[#FE6A00]' : 'bg-[#B4B4BC]'}`}
            />
          </View>
        </View>

        <Text className="text-sm text-[#4E4E56]">
          {bankName} {accountName} - {maskedAccountNumber}
        </Text>
      </View>

      {isPending ? (
        <LoadingIndicator size={14} />
      ) : (
        <Pressable
          onPress={() =>
            mutate(undefined, {
              onSuccess: (res) => {
                onDeleteSuccessFn?.();
                showSuccessMessage(res?.message || 'Account deleted successfully.');
              },
              onError: (err) => {
                showErrorMessage(err?.message);
              },
            })
          }>
          <Trash2 size={20} color={'#FA4B67'} />
        </Pressable>
      )}
    </View>
  );
}
