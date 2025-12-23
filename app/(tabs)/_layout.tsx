import { Text } from '@/components/ui/text';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import { Key } from 'react';
import { Pressable, View } from 'react-native';

export default function TabsLayout() {
  return (
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
  );
}

type MyTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

function MyTabBar({ state, descriptors, navigation }: MyTabBarProps) {
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
    <View className="bg-white">
      <View className="mb-5 flex h-20 w-full flex-row items-center justify-between gap-6 bg-white px-[28px]">
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
