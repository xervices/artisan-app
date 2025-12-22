import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import * as z from 'zod';
import { Image } from 'expo-image';
import { ChevronRight, Plus, Trash, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
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

const formSchema = z.object({
  bank: z.string().min(1, 'Bank is required.'),
  number: z.string().min(1, 'Account number is required.'),
});

const data = [
  {
    id: '1',
    label: 'GTB',
  },
  {
    id: '2',
    label: 'First Bank',
  },
  {
    id: '3',
    label: 'UBA',
  },
];

export default function Screen() {
  const ref = React.useRef<TriggerRef>(null);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 24,
    right: 24,
  };

  const [checked, setChecked] = React.useState(false);

  function onCheckedChange(checked: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked(checked);
  }

  const form = useForm({
    defaultValues: {
      bank: '',
      number: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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
        <form.Field name="bank">
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
                  <NativeSelectScrollView className="h-full">
                    <SelectGroup>
                      <SelectLabel>Bank</SelectLabel>
                      {data.map((bank) => (
                        <SelectItem
                          onPress={() => {
                            field.handleChange(bank.label);
                          }}
                          key={bank.label}
                          label={bank.label}
                          value={bank.label}>
                          {bank.label}
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

        <form.Field name="number">
          {(field) => (
            <View>
              <Label nativeID="number">Account Number</Label>
              <Input
                className="bg-white"
                id="number"
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="Enter your account number"
                hasError={!field.state.meta.isValid}
                keyboardType="number-pad"
              />
              {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}

              <View className="flex flex-row justify-end">
                <Text className="text-sm text-[#FE6A00]">Sarah Rodri</Text>
              </View>
            </View>
          )}
        </form.Field>

        <View className="flex flex-row items-center justify-center gap-2">
          <Checkbox
            aria-labelledby="save-account"
            id="save-account"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />

          <Label
            nativeID="save-account"
            onPress={Platform.select({
              native: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setChecked((prev) => !prev);
              },
            })}
            className="text-center font-cabinet-medium text-sm text-[#B4B4BC]">
            Save Bank for future payment
          </Label>
        </View>

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

          <Button>Continue</Button>
        </View>
      </View>
    </Layout>
  );
}
