import { Layout } from '@/components/layout';
import { Header } from '@/components/home/header';
import { AppState, Platform, View } from 'react-native';
import { Offers } from '@/components/home/offers';
import { AvailabilityStatus } from '@/components/home/availability-status';
import { OverviewCard } from '@/components/home/overview-card';
import { Stats } from '@/components/home/stats';
import { VerifyAccount } from '@/components/home/verify-account';
import { RateClientPrompt } from '@/components/home/rate-client-prompt';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useAuthStore } from '@/store/auth-store';
import { useNotification } from '@/providers/notification-provider';
import { useEffect, useState } from 'react';
import Storage from 'expo-sqlite/kv-store';
import { BroadcastDialog } from '@/components/home/broadcast-dialog';
import { Promotions } from '@/components/home/promotions';
import { UserOfWeek } from '@/components/home/user-of-week';
import { ensureLocationPermissions } from '@/lib/ensure-location-permissions';
import { useBackgroundLocation } from '@/hooks/use-background-location';
import * as Location from 'expo-location';

export default function Screen() {
  const { isLoggedIn } = useAuthStore();
  const { expoPushToken } = useNotification();
  const { mutateAsync: registerDevice } = useMutation(api.registerDeviceForPushNotification());
  const { mutateAsync: unregisterDevice } = useMutation(api.unregisterDeviceForPushNotification());
  const { startTracking } = useBackgroundLocation();
  const { mutate: updateLocation } = useMutation(api.updateLocation());

  const [serviceRequests, artisanProfile, earnings, offers, userOfWeek, newsPromotions, userJobs] =
    useQueries({
      queries: [
        api.getAllServiceRequest(),
        api.getCurrentArtisanProfile(),
        api.getMyEarnings(),
        api.getArtisanOffers(),
        api.getActiveFeaturedProfiles(),
        api.getNewsAndPromotions(),
        api.getUserJobs(),
      ],
    });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOnRefresh = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        serviceRequests.refetch(),
        artisanProfile?.refetch(),
        earnings?.refetch(),
        offers?.refetch(),
        userOfWeek?.refetch(),
        newsPromotions?.refetch(),
        userJobs?.refetch(),
      ]);
    } catch (error) {
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (expoPushToken) {
      registerDevice({
        pushToken: expoPushToken,
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
      }).catch((error) => {
        console.log('Failed to register device:', error);
      });
    }
  }, [expoPushToken]);

  useEffect(() => {
    if (!isLoggedIn) return;

    (async () => {
      const { foreground, background } = await ensureLocationPermissions();

      if (foreground) {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          updateLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        } catch (e) {
          console.log('Failed to fetch current location:', e);
        }
      }

      if (foreground && background) {
        await startTracking();
      }
    })();
  }, [isLoggedIn]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        serviceRequests.refetch();
        artisanProfile?.refetch();
        earnings?.refetch();
        offers?.refetch();
        userOfWeek?.refetch();
        newsPromotions?.refetch();
        userJobs?.refetch();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Layout
      useBackground
      isRefreshing={isRefreshing}
      onRefresh={handleOnRefresh}
      horizontalPadding={false}
      stickyHeader={
        <View className="px-6 pb-4">
          <Header />
        </View>
      }>
      <View className="flex-1 gap-4">
        <BroadcastDialog />

        <View className="px-6">
          <AvailabilityStatus />
        </View>

        <View className="px-6">
          <OverviewCard />
        </View>

        <View className="px-6">
          <Stats />
        </View>

        <View className="px-6">
          <VerifyAccount />
        </View>

        <View className="px-6">
          <Offers />
        </View>

        <View className="px-6">
          <RateClientPrompt />
        </View>

        <Promotions />

        <UserOfWeek />
      </View>
    </Layout>
  );
}
