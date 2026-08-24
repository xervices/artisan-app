import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputError } from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { useAuthStore } from '@/store/auth-store';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import { formatPhoneNumber } from '@/lib/utils';
import { DEFAULT_COUNTRY, hasValidNationalNumber } from '@/lib/countries';

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required.')
    .refine(hasValidNationalNumber, 'Enter a valid phone number.'),
});

export default function Screen() {
  const { user } = useAuthStore();

  const requestOtp = useMutation(api.requestPhoneChangeOtp());

  const form = useForm({
    defaultValues: {
      phoneNumber: DEFAULT_COUNTRY.dialCode,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const phoneNumber = formatPhoneNumber(value.phoneNumber);

      if (phoneNumber === user?.phoneNumber) {
        showErrorMessage('This is already your current phone number.');
        return;
      }

      requestOtp.mutate(undefined, {
        onSuccess: (res) => {
          showSuccessMessage(res?.message || 'OTP sent successfully!');
          router.navigate({
            pathname: '/profile/verify-phone-number',
            params: { phoneNumber },
          });
        },
        onError: (err) => {
          showErrorMessage(err.message);
        },
      });
    },
  });

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Phone Number" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <View>
          <Label nativeID="current-phone">Current phone number</Label>
          <Input
            className="bg-white"
            id="current-phone"
            value={user?.phoneNumber || ''}
            editable={false}
          />
        </View>

        <form.Field name="phoneNumber">
          {(field) => (
            <View>
              <Label nativeID="phone">New phone number</Label>
              <Input
                className="bg-white"
                id="phone"
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="Enter your new phone number"
                hasError={!field.state.meta.isValid}
                keyboardType="phone-pad"
              />
              {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
            </View>
          )}
        </form.Field>

        <Text className="text-sm text-[#737381]">
          To confirm this change, a verification code will be sent to{' '}
          <Text className="text-sm text-[#FE6A00]">{user?.email}</Text>.
        </Text>

        <Button
          isLoading={requestOtp.isPending}
          disabled={requestOtp.isPending}
          onPress={form.handleSubmit}
          className="mt-auto">
          Send Code
        </Button>
      </View>
    </Layout>
  );
}
