import { Text } from '@/components/ui/text';
import { useBackgroundLocation } from '@/hooks/use-background-location';
import { MarketplaceProvider } from '@/providers/use-marketplace-context';
import { useAuthStore } from '@/store/auth-store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import { Key, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { isLoggedIn } = useAuthStore();
  const { startTracking, stopTracking } = useBackgroundLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      // Auto-start tracking for artisans
      startTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isLoggedIn]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <MarketplaceProvider artisanId={user?.id}>
          <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <MyTabBar {...props} />}>
            <Tabs.Screen
              name="(home)"
              options={{
                title: 'Home',
              }}
            />
            <Tabs.Screen
              name="jobs"
              options={{
                title: 'My Jobs',
              }}
            />
            <Tabs.Screen
              name="earnings"
              options={{
                title: 'Earnings',
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
              }}
            />
          </Tabs>
        </MarketplaceProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

type MyTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

function MyTabBar({ state, descriptors, navigation }: MyTabBarProps) {
  const insets = useSafeAreaInsets();

  const TAB_ICONS: Record<string, { icon: any; active: any }> = {
    '(home)': {
      icon: require('@/assets/icons/home.svg'),
      active: require('@/assets/icons/home-active.svg'),
    },
    jobs: {
      icon: require('@/assets/icons/jobs.svg'),
      active: require('@/assets/icons/jobs-active.svg'),
    },
    earnings: {
      icon: require('@/assets/icons/earnings.svg'),
      active: require('@/assets/icons/earnings-active.svg'),
    },
    profile: {
      icon: require('@/assets/icons/profile.svg'),
      active: require('@/assets/icons/profile-active.svg'),
    },
  };

  return (
    <View style={{ paddingBottom: insets.bottom }} className="bg-white">
      <View className="flex h-20 w-full flex-row items-center justify-center gap-[10%] bg-white">
        {state.routes.map(
          (route: { key: string | number; name: any }, index: Key | null | undefined) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                className="flex items-center gap-[6px]">
                <Image
                  source={isFocused ? TAB_ICONS[route?.name].active : TAB_ICONS[route?.name].icon}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  contentFit="contain"
                />

                <Text
                  className={`font-cabinet-bold text-[14px] ${
                    isFocused ? 'text-secondary' : 'text-[#737381]'
                  }`}>
                  {label}
                </Text>
              </Pressable>
            );
          }
        )}
      </View>
    </View>
  );
}
