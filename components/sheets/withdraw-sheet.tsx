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
import { useMutation, useQueries } from '@tanstack/react-query';
import { api } from '@/api';
import { router } from 'expo-router';
import { formatCurrency } from '@/lib/utils';
import { BankCard } from '../profile/bank-card';
import { Icon } from '../ui/icon';
import { OtpInput } from 'react-native-otp-entry';
import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { InputError } from '../ui/input-error';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';

const form1Schema = z.object({
  bankAccountId: z.string().min(1, 'Select bank account.'),
  amount: z.number().min(100, 'Amount cannot be less than 100.'),
});

export function WithdrawSheet(props: SheetProps<'withdraw-sheet'>) {
  const [currentStep, setCurrentStep] = useState<'1' | '2'>('1');

  const [earnings, banks] = useQueries({
    queries: [api.getMyEarnings(), api.getBankAccounts()],
  });
  const { isPending, mutate } = useMutation(api.requestWithdrawal());

  const [pin, setPin] = useState('');

  const form1 = useForm({
    defaultValues: {
      bankAccountId: '',
      amount: 0,
    },
    validators: {
      onSubmit: form1Schema,
    },
    onSubmit: async ({ value }) => {
      setCurrentStep('2');
    },
  });

  const handleOnWithdraw = () => {
    const data = { ...form1.state.values, pin };

    mutate(data, {
      onSuccess: (res) => {
        earnings?.refetch();
        showSuccessMessage('Withdrawal request sent successfully.');
        SheetManager.hide('withdraw-sheet');
      },
      onError: (err) => {
        showErrorMessage(err?.message);
      },
    });
  };

  return (
    <ActionSheet
      gestureEnabled={true}
      closeOnTouchBackdrop={!isPending}
      containerStyle={{
        backgroundColor: '#FFFFFF',
      }}
      indicatorStyle={{
        width: 38,
        height: 6,
        backgroundColor: '#FFF4EA',
      }}>
      {currentStep === '1' ? (
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
                router.navigate('/earnings/add-bank');
              }}>
              <Text className="font-cabinet-extrabold text-sm text-[#FE6A00]">Add Bank</Text>
            </Pressable>
          </View>

          <View>
            <form1.Field name="amount">
              {(field) => (
                <View>
                  <Label nativeID="amount">Amount</Label>
                  <Input
                    className="bg-white"
                    id="number"
                    value={String(field.state.value)}
                    onChangeText={(text) => field.handleChange(Number(text))}
                    placeholder="₦0.00"
                    hasError={!field.state.meta.isValid}
                    keyboardType="number-pad"
                    rightIcon={
                      <Pressable
                        onPress={() => {
                          if (earnings?.data?.availableBalance) {
                            field.handleChange(earnings?.data?.availableBalance);
                          }
                        }}>
                        <Text className="text-sm text-[#FE6A00]">Max</Text>
                      </Pressable>
                    }
                  />
                  {!field.state.meta.isValid ? (
                    <InputError errors={field.state.meta.errors} />
                  ) : null}
                </View>
              )}
            </form1.Field>

            <Text className="text-xs text-[#737381]">
              Available Balance{' '}
              <Text className="text-xs text-[#FE6A00]">
                • {formatCurrency(earnings?.data?.availableBalance)}
              </Text>
            </Text>
          </View>

          <View className="flex">
            <form1.Field name="bankAccountId">
              {(field) => (
                <>
                  <Label nativeID="bankId">Saved Bank</Label>

                  {banks?.data?.map((account) => (
                    <Pressable onPress={() => field.handleChange(account.id)} key={account.id}>
                      <BankCard
                        {...account}
                        onDeleteSuccessFn={() => banks?.refetch()}
                        selectedBankId={field.state.value}
                      />
                    </Pressable>
                  ))}

                  {!field.state.meta.isValid ? (
                    <InputError errors={field.state.meta.errors} />
                  ) : null}
                </>
              )}
            </form1.Field>
          </View>

          <Button onPress={form1.handleSubmit}>Withdraw</Button>
        </View>
      ) : currentStep === '2' ? (
        <View className="flex gap-4 p-6 pt-0">
          <View className="relative flex w-full flex-row items-center justify-center">
            <Pressable
              onPress={() => {
                if (!isPending) {
                  setCurrentStep('1');
                }
              }}
              className="absolute left-0">
              <Icon as={ArrowLeft} size={28} color={'#B4B4BC'} />
            </Pressable>

            <Text className="font-cabinet-bold text-sm">Add Pin</Text>
          </View>

          <Text className="text-center text-sm text-[#737381]">
            Your pin adds an extra layer of security to your account
          </Text>

          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setPin(text)}
            disabled={isPending}
            theme={{
              pinCodeContainerStyle: {
                width: 45,
                aspectRatio: 1 / 1,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#C8C8CF',
              },
              focusStickStyle: {
                backgroundColor: '#FE6A00',
              },
              focusedPinCodeContainerStyle: {
                borderColor: '#FE6A00',
              },
              pinCodeTextStyle: {
                fontSize: 24,
                color: '#1B1B1E',
                fontFamily: 'CabinetGrotesk-Bold',
              },
            }}
          />

          <Button
            isLoading={isPending}
            disabled={isPending || pin?.length !== 6}
            onPress={handleOnWithdraw}>
            Withdraw
          </Button>
        </View>
      ) : null}
    </ActionSheet>
  );
}
