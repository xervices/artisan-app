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

export default function Screen() {
  const [timer, setTimer] = React.useState(60);
  const { minute, seconds } = useTimer({ sec: timer });

  const handleOnResendOTP = () => {
    if (Number(seconds) > 0) return;

    setTimer((prev) => prev + 30);
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
          <Text className="text-sm text-[#FE6A00]">sarahrodri@gmail.com</Text> and{' '}
          <Text className="text-sm text-[#FE6A00]">+234813456789</Text>. Please check your email to
          retrieve the code and enter it here.
        </Text>

        <View className="mt-16">
          <OtpInput
            numberOfDigits={4}
            theme={{
              pinCodeContainerStyle: {
                width: 60,
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
        </View>

        <View className="flex flex-row items-center justify-center gap-1.5">
          {Number(seconds) > 0 ? (
            <Text className="text-center text-[#737381]">
              Wait to request code in:{' '}
              <Text className="text-primary">
                {minute}:{seconds}
              </Text>
            </Text>
          ) : (
            <Text className="text-center text-[#737381]">
              <Pressable>
                <Text className="mx-1 leading-normal text-[#737381]">Haven’t gotten any code?</Text>
              </Pressable>

              <Pressable onPress={handleOnResendOTP}>
                <Text className="leading-normal text-primary">Resend</Text>
              </Pressable>
            </Text>
          )}
        </View>
      </View>
    </Layout>
  );
}
