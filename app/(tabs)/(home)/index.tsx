import { Layout } from '@/components/layout';
import { Header } from '@/components/home/header';
import { Platform, View } from 'react-native';
import { Offers } from '@/components/home/offers';
import EnableLocationDialog from '@/components/enable-location-dialog';
import { AvailabilityStatus } from '@/components/home/availability-status';
import { OverviewCard } from '@/components/home/overview-card';
import { Stats } from '@/components/home/stats';
import { VerifyAccount } from '@/components/home/verify-account';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useAuthStore } from '@/store/auth-store';
import { useNotification } from '@/providers/notification-provider';
import { useEffect } from 'react';
import Storage from 'expo-sqlite/kv-store';

export default function Screen() {
  const { isLoggedIn } = useAuthStore();
  const { expoPushToken } = useNotification();
  const { mutateAsync: registerDevice } = useMutation(api.registerDeviceForPushNotification());
  const { mutateAsync: unregisterDevice } = useMutation(api.unregisterDeviceForPushNotification());

  const [serviceRequests, artisanProfile, earnings, offers] = useQueries({
    queries: [
      api.getAllServiceRequest(),
      api.getCurrentArtisanProfile(),
      api.getMyEarnings(),
      api.getArtisanOffers(),
    ],
  });

  useEffect(() => {
    const handleRegistration = async () => {
      if (isLoggedIn && expoPushToken) {
        const storedToken = Storage.getItemSync('push_token_registered');

        if (storedToken !== expoPushToken) {
          if (storedToken) {
            try {
              await unregisterDevice({ pushToken: storedToken });
            } catch (error) {
              console.log('Failed to unregister old token:', error);
            }
          }

          try {
            await registerDevice({
              pushToken: expoPushToken,
              platform: Platform.OS === 'ios' ? 'ios' : 'android',
            });
            Storage.setItemSync('push_token_registered', expoPushToken);
            Storage.setItemSync('is_registered_for_push', 'true');
          } catch (error) {
            console.log('Failed to register token:', error);
          }
        }
      }
    };

    handleRegistration();
  }, [isLoggedIn, expoPushToken]);

  return (
    <Layout
      useBackground
      isRefreshing={
        serviceRequests?.isRefetching ||
        artisanProfile?.isRefetching ||
        earnings?.isRefetching ||
        offers?.isRefetching
      }
      onRefresh={() => {
        serviceRequests?.refetch();
        artisanProfile?.refetch();
        earnings?.refetch();
        offers?.refetch();
      }}
      stickyHeader={
        <View className="pb-4">
          <Header />
        </View>
      }>
      <View className="flex-1 gap-4">
        <EnableLocationDialog />

        <AvailabilityStatus />

        <OverviewCard />

        <Stats />

        <VerifyAccount />

        <Offers />
      </View>
    </Layout>
  );
}
