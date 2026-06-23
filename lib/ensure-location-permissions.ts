import * as Location from 'expo-location';
import { useLocationConsentStore } from '@/store/location-consent-store';

export type LocationPermissionResult = {
  foreground: boolean;
  background: boolean;
  consented: boolean;
};

export async function ensureLocationPermissions(
  options: { requireBackground?: boolean } = {}
): Promise<LocationPermissionResult> {
  const { requireBackground = true } = options;

  const fgCurrent = await Location.getForegroundPermissionsAsync();
  const bgCurrent = await Location.getBackgroundPermissionsAsync();

  let foreground = fgCurrent.status === 'granted';
  let background = bgCurrent.status === 'granted';

  const needsForeground = !foreground;
  const needsBackground = requireBackground && !background;

  if (!needsForeground && !needsBackground) {
    return { foreground, background, consented: true };
  }

  const store = useLocationConsentStore.getState();
  let consented = store.hasConsented;
  if (!consented) {
    consented = await store.show();
    if (!consented) {
      return { foreground, background, consented: false };
    }
  }

  if (needsForeground) {
    const result = await Location.requestForegroundPermissionsAsync();
    foreground = result.status === 'granted';
    if (!foreground) {
      return { foreground, background, consented: true };
    }
  }

  if (requireBackground && !background) {
    const result = await Location.requestBackgroundPermissionsAsync();
    background = result.status === 'granted';
  }

  return { foreground, background, consented: true };
}
