import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { router, useLocalSearchParams } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { useTimer } from '@/hooks/use-timer';
import { OtpInput } from 'react-native-otp-entry';
import { useAuthStore } from '@/store/auth-store';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';

export default function Screen() {
  const { phoneNumber }: { phoneNumber: string } = useLocalSearchParams();

  const { user } = useAuthStore();

  const requestOtp = useMutation(api.requestPhoneChangeOtp());
  const changePhoneNumber = useMutation(api.changePhoneNumber());

  const [timer, setTimer] = React.useState(60);
  const { minute, seconds } = useTimer({ sec: timer });

  const handleOnResendOTP = () => {
    if (Number(seconds) > 0) return;

    setTimer((prev) => prev + 30);

    requestOtp.mutate(undefined, {
      onSuccess: (res) => {
        showSuccessMessage(res?.message || 'OTP successfully sent.');
      },
      onError: (err) => {
        showErrorMessage(err?.message);
      },
    });
  };

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Verify" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <Text className="text-center text-sm text-[#737381]">
          A verification code has been sent to{' '}
          <Text className="text-sm text-[#FE6A00]">{user?.email}</Text>. Enter it below to
          confirm your new number{' '}
          <Text className="text-sm text-[#FE6A00]">{phoneNumber}</Text>.
        </Text>

        <View className="mt-16">
          <OtpInput
            numberOfDigits={6}
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
            disabled={changePhoneNumber.isPending}
            onFilled={(value) => {
              changePhoneNumber.mutate(
                { otp: value, phoneNumber },
                {
                  onSuccess: () => {
                    SheetManager.show('success-sheet', {
                      payload: {
                        title: 'Successful',
                        subtitle: 'Your phone number has been successfully updated.',
                        hideBackButton: true,
                        useCheckImage: true,
                        onRedirect: () => {
                          router.replace('/profile');
                        },
                      },
                    });
                  },
                  onError: (err) => {
                    showErrorMessage(err?.message);
                  },
                }
              );
            }}
          />
        </View>

        <View className="flex flex-row items-center justify-center gap-1.5">
          {changePhoneNumber.isPending || requestOtp.isPending ? (
            <LoadingIndicator size={24} />
          ) : Number(seconds) > 0 ? (
            <Text className="text-center text-[#737381]">
              Wait to request code in:{' '}
              <Text className="text-primary">
                {minute}:{seconds}
              </Text>
            </Text>
          ) : (
            <Text className="text-center text-[#737381]">
              Haven't gotten any code?{' '}
              <Text onPress={handleOnResendOTP} className="text-primary">
                Resend
              </Text>
            </Text>
          )}
        </View>
      </View>
    </Layout>
  );
}
