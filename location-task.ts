import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

import { tokenStorage } from './api/token-storage';
import createClient from 'openapi-fetch';
import { BASE_URL } from './api/client';
import { paths } from './api/schema';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];

    if (location) {
      console.log('📍 Background location update:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp).toISOString(),
      });

      // Send location to your API
      try {
        await updateUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        console.error('Failed to update location:', err);
      }
    }
  }
});

// API call to update user location
async function updateUserLocation(coords: { latitude: number; longitude: number }) {
  let accessToken = await tokenStorage.getAccessToken();
  const refreshToken = await tokenStorage.getRefreshToken();

  if (!accessToken) {
    throw new Error('No access token available');
  }

  // Check if access token is expired
  try {
    const decodedAccessToken = jwtDecode<{ exp?: number }>(accessToken);
    const isAccessTokenExpired = decodedAccessToken.exp
      ? dayjs.unix(decodedAccessToken.exp).diff(dayjs()) < 1
      : true;

    // Refresh token if expired
    if (isAccessTokenExpired) {
      console.log('🔄 Access token expired, refreshing...');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshClient = createClient<paths>({ baseUrl: BASE_URL });
      const { data, error } = await refreshClient.POST('/api/auth/refresh', {
        body: { refreshToken },
      });

      if (error || !data) {
        throw new Error('Failed to refresh token');
      }

      // Update stored tokens
      await tokenStorage.setTokens(data.accessToken, data.refreshToken || refreshToken);
      accessToken = data.accessToken; // Use new token for the request
      console.log('✅ Access token refreshed successfully');
    }
  } catch (decodeError) {
    console.error('Token decode error:', decodeError);
    throw new Error('Invalid access token');
  }

  // Make the location update request with (possibly refreshed) token
  const response = await fetch(`${BASE_URL}/api/users/location`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      latitude: coords.latitude,
      longitude: coords.longitude,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update location');
  }

  return response.json();
}

export { LOCATION_TASK_NAME };
