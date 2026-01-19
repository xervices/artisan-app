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

  console.log('📝 Updating location with token check...');

  if (!accessToken) {
    console.error('❌ No access token available');
    throw new Error('No access token available');
  }

  // Check if access token is expired
  let isAccessTokenExpired = false;

  try {
    const decodedAccessToken = jwtDecode<{ exp?: number }>(accessToken);

    if (!decodedAccessToken.exp) {
      console.warn('⚠️ Token has no expiration, treating as expired');
      isAccessTokenExpired = true;
    } else {
      const expirationTime = dayjs.unix(decodedAccessToken.exp);
      const currentTime = dayjs();
      const timeUntilExpiry = expirationTime.diff(currentTime, 'second');

      console.log(`⏰ Token expires in ${timeUntilExpiry} seconds`);

      // Token is expired if it expires in less than 1 second
      isAccessTokenExpired = timeUntilExpiry < 1;
    }

    // Refresh token if expired
    if (isAccessTokenExpired) {
      console.log('🔄 Access token expired, attempting refresh...');

      if (!refreshToken) {
        console.error('❌ No refresh token available');
        throw new Error('No refresh token available - user needs to log in again');
      }

      try {
        const refreshClient = createClient<paths>({ baseUrl: BASE_URL });

        console.log('📡 Calling refresh endpoint...');
        const { data, error } = await refreshClient.POST('/api/auth/refresh', {
          body: { refreshToken },
        });

        if (error) {
          console.error('❌ Refresh API error:', error);
          throw new Error(`Failed to refresh token: ${JSON.stringify(error)}`);
        }

        if (!data) {
          console.error('❌ No data returned from refresh endpoint');
          throw new Error('No data returned from refresh endpoint');
        }

        console.log('✅ Token refresh successful');

        // Update stored tokens
        await tokenStorage.setTokens(data.accessToken, data.refreshToken || refreshToken);
        accessToken = data.accessToken; // Use new token for the request

        console.log('💾 New tokens stored successfully');
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Clear tokens if refresh fails
        await tokenStorage.clearTokens();
        throw new Error('Session expired. Please log in again.');
      }
    } else {
      console.log('✅ Access token is still valid');
    }
  } catch (decodeError) {
    console.error('❌ Token decode error:', decodeError);
    throw new Error('Invalid access token');
  }

  // Make the location update request with (possibly refreshed) token
  console.log('📡 Sending location update to server...');

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
    console.error('❌ Location update failed:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

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
  console.log('✅ Location update response:', result);
  return result;
}

export { LOCATION_TASK_NAME };
