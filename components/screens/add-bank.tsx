import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import * as z from 'zod';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/button';
import { TriggerRef } from '@rn-primitives/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm } from '@tanstack/react-form';
import { Label } from '@/components/ui/label';
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InputError } from '@/components/ui/input-error';
import { Input } from '@/components/ui/input';
import * as Haptics from 'expo-haptics';
import { Checkbox } from '@/components/ui/checkbox';
import { NIGERIAN_BANKS } from '@/store/data';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import { router } from 'expo-router';

const formSchema = z.object({
  bankCode: z.string().min(1, 'Bank is required.'),
  bankName: z.string().min(1, 'Bank Name is required.'),
  accountNumber: z.string().min(1, 'Account number is required.'),
  setAsDefault: z.boolean(),
});

export function AddBankScreen() {
  const ref = React.useRef<TriggerRef>(null);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 24,
    right: 24,
  };

  const [searchQuery, setSearchQuery] = React.useState('');

  const { refetch } = useQuery(api.getBankAccounts());
  const { mutate, isPending, data, isError, error } = useMutation(api.verifyBankAccount());
  const addAccount = useMutation(api.addBankAccount());

  const filteredBanks = React.useMemo(() => {
    if (!searchQuery) return NIGERIAN_BANKS.slice(0, 10);
    return NIGERIAN_BANKS.filter((bank) =>
      bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 20);
  }, [searchQuery]);

  const form = useForm({
    defaultValues: {
      bankCode: '',
      bankName: '',
      accountNumber: '',
      setAsDefault: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      addAccount?.mutate(value, {
        onSuccess: (res) => {
          refetch();
          showSuccessMessage('Account added successfully.');
          router.back();
        },
        onError: (err) => {
          showErrorMessage(err?.message);
        },
      });
    },
  });

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Add Bank Account" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <form.Field name="bankCode">
          {(field) => (
            <View>
              <Label nativeID="bank">Select Bank</Label>
              <Select>
                <SelectTrigger ref={ref} className="w-full bg-white">
                  <SelectValue id="bank" placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent
                  insets={contentInsets}
                  className="mt-2 w-full bg-white"
                  style={{ maxHeight: 300 }}>
                  <View className="sticky top-0 z-10 border-b border-gray-100 bg-white p-2">
                    <Input
                      autoFocus
                      placeholder="Search bank..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      className="h-10 bg-gray-50"
                    />
                  </View>
                  <NativeSelectScrollView className="h-full">
                    <SelectGroup>
                      <SelectLabel>Bank</SelectLabel>
                      {filteredBanks.map((bank, index) => (
                        <SelectItem
                          onPress={() => {
                            field.handleChange(bank.code);
                            form.setFieldValue('bankName', bank.name);
                          }}
                          key={`${bank.code}-${index}`}
                          label={bank.name}
                          value={bank.code}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </NativeSelectScrollView>
                </SelectContent>
              </Select>

              {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
            </View>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.values.accountNumber, state.values.bankCode]}>
          {([accountNumber, bankCode]) => (
            <VerificationHandler
              accountNumber={accountNumber}
              bankCode={bankCode}
              verify={mutate}
            />
          )}
        </form.Subscribe>

        <View>
          <form.Field name="accountNumber">
            {(field) => (
              <View>
                <Label nativeID="number">Account Number</Label>
                <Input
                  editable={!isPending}
                  className="bg-white"
                  id="number"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your account number"
                  hasError={!field.state.meta.isValid}
                  keyboardType="number-pad"
                  rightIcon={
                    isPending ? <ActivityIndicator size="small" color="#FE6A00" /> : undefined
                  }
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <View className="flex min-h-[20px] flex-row justify-end">
            {data ? <Text className="text-sm text-[#FE6A00]">{data.accountName}</Text> : null}
            {isError ? (
              <Text className="text-sm text-red-500">Could not verify account</Text>
            ) : null}
          </View>
        </View>

        <form.Field name="setAsDefault">
          {(field) => (
            <View className="flex flex-row items-center justify-center gap-2">
              <Checkbox
                aria-labelledby="save-account"
                id="save-account"
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />

              <Label
                nativeID="save-account"
                onPress={Platform.select({
                  native: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    field.handleChange(!field.state.value);
                  },
                })}
                className="text-center font-cabinet-medium text-sm text-[#B4B4BC]">
                Save Bank for future payment
              </Label>
            </View>
          )}
        </form.Field>

        <View className="mt-auto flex gap-6">
          <View>
            <View className="flex flex-row items-center justify-center gap-1">
              <Image
                source={require('@/assets/icons/verified.svg')}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />

              <Text className="text-center text-sm text-[#FE6A00]">Secured Payment</Text>
            </View>

            <Text className="text-center text-sm text-[#737381]">
              Your Bank details are secured processed by our PCI-DSS compliant payment partners
            </Text>
          </View>

          <Button
            isLoading={addAccount?.isPending || isPending}
            disabled={addAccount?.isPending || isPending}
            onPress={form.handleSubmit}>
            Continue
          </Button>
        </View>
      </View>
    </Layout>
  );
}

function VerificationHandler({
  accountNumber,
  bankCode,
  verify,
}: {
  accountNumber: string;
  bankCode: string;
  verify: (data: { accountNumber: string; bankCode: string }) => void;
}) {
  React.useEffect(() => {
    if (accountNumber && accountNumber.length === 10 && bankCode) {
      verify({ accountNumber, bankCode });
    }
  }, [accountNumber, bankCode, verify]);

  return null;
}
