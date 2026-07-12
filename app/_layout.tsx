import '../location-task';
import '@/global.css';

import { useAuthStore } from '@/store/auth-store';
import { PortalHost } from '@rn-primitives/portal';
import { useEffect, useState } from 'react';
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
import { LocationConsentDialog } from '@/components/location-consent-dialog';
import { SplashScreen } from '@/components/splash-screen';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useTrackAppInstall } from '@/hooks/use-track-app-install';
import { useReferralDeepLink } from '@/hooks/use-referral-deep-link';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Keep the native splash visible until the JS bundle is ready,
// so it can hand off straight to the custom <SplashScreen /> with no flash.
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { isLoggedIn, hasCompletedOnboarding } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // The custom <SplashScreen /> is already painted on this first frame,
    // so hide the native splash immediately to reveal it.
    ExpoSplashScreen.hideAsync();
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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
                  <AppInstallTracker />
                  <ReferralDeepLinkHandler />
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

                    {/* Declared last on purpose. With no `index` route, expo-router lands a
                        logged-out user on the first screen above whose guard passes, so
                        anything ahead of `onboarding`/`login` here would steal that slot.
                        The onboarding guard is deliberately absent — a referral deep link
                        navigates a brand-new user straight here, and reaching the screen
                        marks them onboarded (see the effect in `register.tsx`). */}
                    <Stack.Protected guard={!isLoggedIn}>
                      <Stack.Screen name="register" options={{ headerShown: false }} />
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
                  {showSplash && (
                    <View className="absolute inset-0 z-50">
                      <SplashScreen />
                    </View>
                  )}
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

function AppInstallTracker() {
  useTrackAppInstall();
  return null;
}

function ReferralDeepLinkHandler() {
  useReferralDeepLink();
  return null;
}
