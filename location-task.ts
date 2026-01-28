import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { tokenStorage } from './api/token-storage';
import createClient from 'openapi-fetch';
import { BASE_URL, refreshAccessToken } from './api/client';
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
        console.log('✅ Location updated successfully');
      } catch (err) {
        console.error('❌ Failed to update location:', err);
      }
    }
  }
});

// API call to update user location
async function updateUserLocation(coords: { latitude: number; longitude: number }) {
  let accessToken = await tokenStorage.getAccessToken();
  const refreshToken = await tokenStorage.getRefreshToken();

  if (!accessToken || !refreshToken) {
    throw new Error('No tokens available - user needs to log in again');
  }

  // Check if access token is expired
  try {
    const decodedAccessToken = jwtDecode<{ exp?: number }>(accessToken);

    if (!decodedAccessToken.exp) {
      throw new Error('Token has no expiration');
    }

    const expirationTime = dayjs.unix(decodedAccessToken.exp);
    const currentTime = dayjs();
    const timeUntilExpiry = expirationTime.diff(currentTime, 'second');

    // Refresh token if expired or expiring soon (within 1 minute)
    if (timeUntilExpiry < 60) {
      console.log('🔄 Access token expired or expiring soon, attempting refresh...');

      const newToken = await refreshAccessToken(true); // Pass true to skip UI updates in background

      if (!newToken) {
        throw new Error('Failed to refresh token');
      }

      accessToken = newToken;
    }
  } catch (error) {
    console.error('❌ Token validation error:', error);
    throw error;
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
    const errorText = await response.text();

    // Try to parse error as JSON
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    // If we get a 401, the token might be invalid even after refresh
    if (response.status === 401) {
      console.error('❌ 401 Unauthorized - clearing tokens');
      await tokenStorage.clearTokens();
      throw new Error('Unauthorized - please log in again');
    }

    throw new Error(errorData.message || `Failed to update location: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

export { LOCATION_TASK_NAME };
