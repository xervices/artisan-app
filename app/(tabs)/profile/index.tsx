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
import { useAuthStore } from '@/store/auth-store';
import { tokenStorage } from '@/api/token-storage';
import { useNotification } from '@/providers/notification-provider';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import Storage from 'expo-sqlite/kv-store';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { SheetManager } from 'react-native-actions-sheet';

export default function Screen() {
  const { expoPushToken } = useNotification();
  const { mutateAsync: unregisterDevice, isPending } = useMutation(
    api.unregisterDeviceForPushNotification()
  );

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
        const [checked, setChecked] = React.useState(true);

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
      onPress: async () => {
        if (expoPushToken) {
          try {
            await unregisterDevice({ pushToken: expoPushToken });
            Storage.removeItemSync('push_token_registered');
            Storage.removeItemSync('is_registered_for_push');
          } catch (e) {
            console.log(e);
          }
        }

        await tokenStorage.clearTokens();
        useAuthStore.getState().setLoginState(false);
      },
    },
    {
      name: 'Delete account',
      icon: require('@/assets/icons/delete.svg'),
      isLink: true,
      isDestructive: true,
      onPress: () => SheetManager.show('delete-account-sheet'),
    },
  ];

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
            className="flex h-[60px] w-full flex-row items-center justify-between rounded-[8px] border border-[#9F9FA7] px-4">
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
                className={`font-cabinet-medium text-sm ${item.isDestructive ? 'text-[#B3031E]' : 'text-[#1B1B1E]'}`}>
                {item.name}
              </Text>
            </View>

            {item.rightComponent && item.rightComponent()}

            {item.isLink && <ChevronRight size={20} color={'#B4B4BC'} />}

            {isPending && item.name === 'Logout' && item.isDestructive ? <LoadingIndicator size={14} /> : null}
          </Pressable>
        ))}
      </View>
    </Layout>
  );
}
