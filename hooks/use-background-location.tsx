import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK_NAME } from '@/location-task';

interface UseBackgroundLocationReturn {
  isTracking: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
  currentLocation: Location.LocationObject | null;
  error: string | null;
}

export const useBackgroundLocation = (): UseBackgroundLocationReturn => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if background location is already running
  useEffect(() => {
    checkTrackingStatus();
  }, []);

  const checkTrackingStatus = async () => {
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (isTaskDefined) {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      setIsTracking(hasStarted);
    }
  };

  const startTracking = useCallback(async () => {
    try {
      // Request permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== 'granted') {
        setError('Foreground location permission not granted');
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      if (backgroundStatus !== 'granted') {
        setError('Background location permission not granted');
        return;
      }

      // Get current location first
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCurrentLocation(location);

      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 100, // Update every 100 meters
        deferredUpdatesInterval: 60000, // Batch updates every 60 seconds (iOS)
        foregroundService: {
          notificationTitle: 'Xervices is using your location',
          notificationBody: 'To show you nearby artisans and update your position',
          notificationColor: '#FE6A00',
        },
        pausesUpdatesAutomatically: false,
        activityType: Location.ActivityType.Other,
        showsBackgroundLocationIndicator: true, // iOS only
      });

      setIsTracking(true);
      setError(null);
      console.log('✅ Background location tracking started');
    } catch (err) {
      console.error('Failed to start tracking:', err);
      setError(err instanceof Error ? err.message : 'Failed to start tracking');
    }
  }, []);

  const stopTracking = useCallback(async () => {
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        setIsTracking(false);
        console.log('✅ Background location tracking stopped');
      }
    } catch (err) {
      console.error('Failed to stop tracking:', err);
      setError(err instanceof Error ? err.message : 'Failed to stop tracking');
    }
  }, []);

  return {
    isTracking,
    startTracking,
    stopTracking,
    currentLocation,
    error,
  };
};
