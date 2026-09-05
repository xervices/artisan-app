import { View, Pressable, AppState } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BadgeCheck, Bell } from 'lucide-react-native';
import { Text } from '../ui/text';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { showErrorMessage } from '@/api/helpers';
import { useEffect } from 'react';

export function Header() {
  const { user } = useAuthStore();

  const [artisanProfile, unreadNotifications] = useQueries({
    queries: [api.getCurrentArtisanProfile(), api.getUnreadNotificationCount()],
  });
  const markAllNotifications = useMutation(api.markAllNotificationAsRead());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        artisanProfile?.refetch();
        unreadNotifications?.refetch();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View className="flex w-full flex-row items-end justify-between">
      <View className="flex flex-row items-center gap-2">
        <Avatar alt="User's Avatar">
          <AvatarImage source={{ uri: user?.profile?.avatarUrl }} />
          <AvatarFallback className="bg-primary">
            <Text className="font-cabinet-bold text-sm uppercase leading-none">
              {user?.profile?.fullName.substring(0, 2)}
            </Text>
          </AvatarFallback>
        </Avatar>

        <View>
          <Text className="text-xs leading-none text-[#1B1B1E]">Welcome</Text>
          <View className="flex flex-row gap-1">
            <Text className="font-cabinet-bold leading-none text-[#1B1B1E]">
              {user?.profile?.fullName}
            </Text>

            {artisanProfile?.data?.isVerified && (
              <BadgeCheck size={16} fill={'#FE6A00'} stroke={'#FFFFFF'} />
            )}
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => {
          markAllNotifications?.mutate(undefined, {
            onSuccess: () => {
              unreadNotifications?.refetch();
            },
            onError: (err) => {
              showErrorMessage(err.message);
            },
          });
          router.navigate('/notification');
        }}
        className="relative flex h-6 w-6 items-center justify-center">
        <Bell fill={'#1B1B1E'} />

        {unreadNotifications?.data &&
        unreadNotifications?.data?.unreadCount &&
        unreadNotifications?.data?.unreadCount > 0 ? (
          <View className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#FE6A00]" />
        ) : null}
      </Pressable>
    </View>
  );
}
