import '../location-task';
import '@/global.css';

import * as SplashScreenAPI from 'expo-splash-screen';

import { useAuthStore } from '@/store/auth-store';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SheetProvider } from 'react-native-actions-sheet';
import { Sheets } from '@/components/sheets';
import { View } from 'react-native';
import { LocationProvider } from 'solomo';
import { QueryProvider } from '@/providers/query-provider';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { NotificationProvider } from '@/providers/notification-provider';
import { useEffect, useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { LocationConsentDialog } from '@/components/location-consent-dialog';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { isLoggedIn, hasCompletedOnboarding } = useAuthStore();
  const [showingSplash, setShowingSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreenAPI.hideAsync(); // hide native splash first
      setShowingSplash(false); // then show your custom one
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showingSplash) return <SplashScreen />;

  return (
    // <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
    <GestureHandlerRootView>
      <QueryProvider>
        <LocationProvider>
          <KeyboardProvider>
            <NotificationProvider>
              <View className="flex-1 bg-white">
                <SheetProvider>
                  <Sheets />
                  <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                  <Stack>
                    <Stack.Protected guard={isLoggedIn}>
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                      <Stack.Screen name="chat" options={{ headerShown: false }} />
                      <Stack.Screen name="ongoing" options={{ headerShown: false }} />
                      <Stack.Screen name="dispute" options={{ headerShown: false }} />
                      <Stack.Screen name="rate" options={{ headerShown: false }} />
                      <Stack.Screen name="verify" options={{ headerShown: false }} />
                      <Stack.Screen name="verification" options={{ headerShown: false }} />
                    </Stack.Protected>

                    <Stack.Protected guard={!isLoggedIn && hasCompletedOnboarding}>
                      <Stack.Screen name="login" options={{ headerShown: false }} />
                      <Stack.Screen name="register" options={{ headerShown: false }} />
                      <Stack.Screen name="verify-email" options={{ headerShown: false }} />
                      <Stack.Screen name="become-artisan" options={{ headerShown: false }} />
                      <Stack.Screen name="verify-device" options={{ headerShown: false }} />
                      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
                      <Stack.Screen name="forgot-password-otp" options={{ headerShown: false }} />
                      <Stack.Screen name="new-password" options={{ headerShown: false }} />
                      <Stack.Screen name="terms" options={{ headerShown: false }} />
                      <Stack.Screen name="privacy" options={{ headerShown: false }} />
                    </Stack.Protected>

                    <Stack.Protected guard={!hasCompletedOnboarding}>
                      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                    </Stack.Protected>
                  </Stack>
                  <Toaster
                    theme="light"
                    richColors
                    styles={{
                      title: {
                        fontFamily: 'CabinetGrotesk-Bold',
                      },
                    }}
                  />
                  <PortalHost />
                  <LocationConsentDialog />
                </SheetProvider>
              </View>
            </NotificationProvider>
          </KeyboardProvider>
        </LocationProvider>
      </QueryProvider>
    </GestureHandlerRootView>
    // </ThemeProvider>
  );
}
