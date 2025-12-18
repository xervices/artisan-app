import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight, Mail, MessageCircleMore } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';

export default function Screen() {
  const [selectedOption, setSelectedOption] = React.useState('');

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Password" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <View className="flex items-center justify-center">
          <Text className="text-center font-cabinet-bold text-[#1B1B1E]">Reset Password</Text>
          <Text className="text-center text-sm text-[#B4B4BC]">
            Select the contact details we can use to reset your password
          </Text>
        </View>

        <Pressable
          onPress={() => setSelectedOption('phone')}
          className={`flex w-full flex-row items-center gap-4 rounded-[8px] border p-4 ${selectedOption === 'phone' ? 'border-[#FE6A00]' : 'border-[#B4B4BC]'}`}>
          <View
            className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedOption === 'phone' ? 'bg-[#FFE6D6]' : 'bg-[#DFDFE1]'}`}>
            <MessageCircleMore
              size={16}
              color={selectedOption === 'phone' ? '#FE6A00' : '#737381'}
            />
          </View>

          <View>
            <Text className="text-sm text-[#737381]">Via Sms</Text>
            <Text
              className={`text-lg ${selectedOption === 'phone' ? 'text-[#1B1B1E]' : 'text-[#737381]'} font-cabinet-bold`}>
              +234******7657
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setSelectedOption('email')}
          className={`flex w-full flex-row items-center gap-4 rounded-[8px] border p-4 ${selectedOption === 'email' ? 'border-[#FE6A00]' : 'border-[#B4B4BC]'}`}>
          <View
            className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedOption === 'email' ? 'bg-[#FFE6D6]' : 'bg-[#DFDFE1]'}`}>
            <Mail size={16} color={selectedOption === 'email' ? '#FE6A00' : '#737381'} />
          </View>

          <View>
            <Text className="text-sm text-[#737381]">Via Email</Text>
            <Text
              className={`text-lg ${selectedOption === 'email' ? 'text-[#1B1B1E]' : 'text-[#737381]'} font-cabinet-bold`}>
              alex*******@gmail.com
            </Text>
          </View>
        </Pressable>

        <Button
          onPress={() => {
            router.navigate({
              pathname: '/profile/password-otp',
              params: {
                email: 'alex*******@gmail.com',
              },
            });
          }}
          className="mt-auto">
          Continue
        </Button>
      </View>
    </Layout>
  );
}
