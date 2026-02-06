import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { useTimer } from '@/hooks/use-timer';
import { OtpInput } from 'react-native-otp-entry';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingState } from '@/components/loading-state';
import { useAuthStore } from '@/store/auth-store';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';

export default function Screen() {
  const { user } = useAuthStore();
  const { mutate, isPending, data } = useMutation(api.checkPinStatus());

  const requestOtp = useMutation(api.requestOtpForPin());

  const [pin, setPin] = React.useState('');

  React.useEffect(() => {
    mutate({});
  }, []);

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="PIN" />
        </View>
      }>
      {isPending ? (
        <LoadingState title="Getting things ready..." />
      ) : (
        <View className="flex-1 gap-6">
          <Text className="text-center text-sm text-[#737381]">
            {data?.hasPin ? 'Change' : 'Create'} PIN
          </Text>

          <View className="mt-16">
            <OtpInput
              numberOfDigits={6}
              onTextChange={setPin}
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
              disabled={requestOtp?.isPending}
            />
          </View>

          <Text className="text-center text-sm text-[#737381]">
            A verification code will be sent to{' '}
            <Text className="text-sm text-[#FE6A00]">{user?.email}</Text> and{' '}
            {user?.phoneVerified && (
              <Text className="text-sm text-[#FE6A00]">{user?.phoneNumber}</Text>
            )}
            .
          </Text>

          <Button
            isLoading={requestOtp?.isPending}
            disabled={requestOtp?.isPending}
            onPress={() => {
              requestOtp?.mutate(
                {},
                {
                  onSuccess: (res) => {
                    showSuccessMessage(res?.message || 'OTP sent successfully!');
                    router.navigate({
                      pathname: '/profile/verify-pin',
                      params: {
                        pin,
                      },
                    });
                  },
                  onError: (err) => {
                    showErrorMessage(err.message);
                  },
                }
              );
            }}
            // onPress={() => router.navigate('/profile/verify-pin')}
            className="mt-auto">
            Continue
          </Button>
        </View>
      )}
    </Layout>
  );
}
