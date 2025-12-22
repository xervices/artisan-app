import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Switch } from '@/components/ui/switch';

const data = [
  {
    name: 'Personal Details',
    icon: require('@/assets/icons/personal.svg'),
    isLink: true,
    isDestructive: false,
    onPress: () => router.navigate('/profile/personal'),
  },
  {
    name: 'Password',
    icon: require('@/assets/icons/password.svg'),
    isLink: true,
    isDestructive: false,
    onPress: () => router.navigate('/profile/password'),
  },
  {
    name: 'Dispute',
    icon: require('@/assets/icons/dispute.svg'),
    isLink: true,
    isDestructive: false,
    onPress: () => router.navigate('/profile/disputes'),
  },
  {
    name: 'Payment',
    icon: require('@/assets/icons/payment.svg'),
    isLink: true,
    onPress: () => router.navigate('/profile/payment'),
  },
  {
    name: 'Rate Xervices',
    icon: require('@/assets/icons/rate.svg'),
    isLink: true,
    isDestructive: false,
    onPress: () => router.navigate('/profile/rate'),
  },
  {
    name: 'Support',
    icon: require('@/assets/icons/support.svg'),
    isLink: true,
    isDestructive: false,
    onPress: () => router.navigate('/profile/support'),
  },
  {
    name: 'About Xervices',
    icon: require('@/assets/icons/about.svg'),
    isLink: true,
    isDestructive: false,
    onPress: () => router.navigate('/profile/about'),
  },
  {
    name: 'Your Level',
    icon: require('@/assets/icons/shield.svg'),
    isLink: true,
    isDestructive: false,
    onPress: () => router.navigate('/profile/level'),
  },
  {
    name: 'Location',
    icon: require('@/assets/icons/gps.svg'),
    isLink: false,
    isDestructive: false,
    onPress: () => {},
    rightComponent: () => {
      const [checked, setChecked] = React.useState(false);

      function onCheckedChange(checked: boolean) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setChecked(checked);
      }

      return <Switch checked={checked} onCheckedChange={onCheckedChange} />;
    },
  },
  {
    name: 'Logout',
    icon: require('@/assets/icons/logout.svg'),
    isLink: false,
    isDestructive: true,
    onPress: () => router.navigate('/profile'),
  },
];

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Settings" showBackButton={false} />
        </View>
      }>
      <View className="flex-1 gap-6">
        {data.map((item) => (
          <Pressable
            onPress={item.onPress}
            key={item.name}
            className="flex h-[60px] w-full flex-row items-center justify-between rounded-[8px] border border-[#E9E9EB] px-4">
            <View className="flex flex-row items-center gap-2">
              <Image
                source={item.icon}
                style={{
                  width: 24,
                  height: 24,
                }}
                contentFit="contain"
              />

              <Text
                className={`text-sm ${item.isDestructive ? 'text-[#B3031E]' : 'text-[#737381]'}`}>
                {item.name}
              </Text>
            </View>

            {item.rightComponent && item.rightComponent()}

            {item.isLink && <ChevronRight size={20} color={'#B4B4BC'} />}
          </Pressable>
        ))}
      </View>
    </Layout>
  );
}
