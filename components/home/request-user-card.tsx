import { View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Text } from '../ui/text';
import { Image } from 'expo-image';
import { formatDateTime } from '@/lib/utils';
import React, { useEffect } from 'react';
import { useLocation } from 'solomo';
import { LoadingIndicator } from '../ui/loading-indicator';

interface RequestUserCardProp {
  avatarUrl?: string;
  name?: string;
  address?: string;
  dropoffAddress?: string;
  date?: string;
  serviceLat?: number;
  serviceLong?: number;
  dropOffLat?: number;
  dropOffLong?: number;
}

export default function RequestUserCard({
  address,
  avatarUrl,
  date,
  name,
  serviceLat,
  serviceLong,
  dropoffAddress,
  dropOffLat,
  dropOffLong,
}: RequestUserCardProp) {
  const { location } = useLocation();
  const [eta, setEta] = React.useState<string | null>(null);
  const [dropoffEta, setDropoffEta] = React.useState<string | null>(null);
  const [deliveryEta, setDeliveryEta] = React.useState<string | null>(null);
  const [deliveryDistance, setDeliveryDistance] = React.useState<string | null>(null);

  const fetchEta = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    onSuccess: (duration: string, distance: string) => void
  ) => {
    try {
      const apiKey = 'AIzaSyDlZwHBiKYN7A9CJHuvZqbroZCPnKlCHWc';

      if (!apiKey) {
        console.warn('Google Maps API Key not found');
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`
      );

      const result = await response.json();

      if (result.routes?.length > 0 && result.routes[0].legs?.length > 0) {
        const leg = result.routes[0].legs[0];
        onSuccess(leg.duration.text, leg.distance.text);
      }
    } catch (error) {
      console.error('Error fetching ETA:', error);
    }
  };

  // Current location → service location (how far the pro is from the pickup)
  useEffect(() => {
    if (location?.coords && serviceLat && serviceLong) {
      fetchEta(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude: serviceLat, longitude: serviceLong },
        (duration) => setEta(duration)
      );
    }
  }, [location, serviceLat, serviceLong]);

  // Current location → drop-off location
  useEffect(() => {
    if (location?.coords && dropOffLat && dropOffLong) {
      fetchEta(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude: dropOffLat, longitude: dropOffLong },
        (duration) => setDropoffEta(duration)
      );
    }
  }, [location, dropOffLat, dropOffLong]);

  // Service location → drop-off location (delivery distance + time)
  useEffect(() => {
    if (serviceLat && serviceLong && dropOffLat && dropOffLong) {
      fetchEta(
        { latitude: serviceLat, longitude: serviceLong },
        { latitude: dropOffLat, longitude: dropOffLong },
        (duration, distance) => {
          setDeliveryEta(duration);
          setDeliveryDistance(distance);
        }
      );
    }
  }, [serviceLat, serviceLong, dropOffLat, dropOffLong]);

  return (
    <View className="gap-4 rounded-[8px] bg-[#0A0A0B] p-4">
      <View className="flex gap-1">
        <View className="flex flex-row items-center gap-1">
          <Avatar alt="User's Avatar" className="h-6 w-6">
            <AvatarImage source={{ uri: avatarUrl }} />
            <AvatarFallback className="bg-primary">
              <Text className="font-cabinet-bold text-xs uppercase leading-none">
                {name?.substring(0, 2)}
              </Text>
            </AvatarFallback>
          </Avatar>

          <Text className="font-cabinet-bold text-sm text-[#FFB884]">{name}</Text>
        </View>

        <View>
          {dropoffAddress ? <Text className="text-xs text-[#FFF4EA]">Pickup location</Text> : null}

          <Text className="text-xs text-[#FFF4EA]">{address}</Text>
        </View>

        {dropoffAddress ? (
          <View className="mt-2">
            <Text className="text-xs text-[#FFF4EA]">Drop-off location</Text>
            <Text className="text-xs text-[#FFF4EA]">{dropoffAddress}</Text>
          </View>
        ) : null}
      </View>

      <View className="flex flex-row items-center justify-between gap-1">
        <View className="flex flex-row items-center gap-1.5">
          <Image
            source={require('@/assets/icons/location-primary.svg')}
            style={{ width: 16, height: 16 }}
            contentFit="contain"
          />

          <Text className="text-xs leading-none text-[#FFF4EA]">
            {dropoffAddress ? 'Pickup location' : 'Location'}
          </Text>
        </View>

        <View className="h-0.5 flex-1 bg-[#FFF4EA]" />

        {eta ? (
          <Text className="font-cabinet-bold text-xs leading-none text-[#FFB884]">{eta} away</Text>
        ) : (
          <LoadingIndicator size={12} />
        )}
      </View>

      {dropoffAddress ? (
        <View className="flex flex-row items-center justify-between gap-1">
          <View className="flex flex-row items-center gap-1.5">
            <Image
              source={require('@/assets/icons/location-primary.svg')}
              style={{ width: 16, height: 16 }}
              contentFit="contain"
            />

            <Text className="text-xs leading-none text-[#FFF4EA]">
              {dropoffAddress ? 'Drop-off location' : 'Location'}
            </Text>
          </View>

          <View className="h-0.5 flex-1 bg-[#FFF4EA]" />

          {dropoffEta ? (
            <Text className="font-cabinet-bold text-xs leading-none text-[#FFB884]">
              {dropoffEta} away
            </Text>
          ) : (
            <LoadingIndicator size={12} />
          )}
        </View>
      ) : null}

      {dropoffAddress ? (
        <View className="flex flex-row items-center justify-between gap-1">
          <Text className="text-sm text-[#FFF4EA]">Estimated distance</Text>

          {deliveryDistance ? (
            <Text className="text-sm text-[#FFF4EA]">{deliveryDistance}</Text>
          ) : (
            <LoadingIndicator size={12} />
          )}
        </View>
      ) : null}

      {dropoffAddress ? (
        <View className="flex flex-row items-center justify-between gap-1">
          <Text className="text-sm text-[#FFF4EA]">Estimated delivery time</Text>

          {deliveryEta ? (
            <Text className="text-sm text-[#FFF4EA]">{deliveryEta}</Text>
          ) : (
            <LoadingIndicator size={12} />
          )}
        </View>
      ) : null}

      <View className="flex flex-row items-center justify-between gap-1">
        <Text className="text-sm text-[#FFF4EA]">Booking Date & Time</Text>
        <Text className="text-sm text-[#FFF4EA]">{formatDateTime(date)}</Text>
      </View>
    </View>
  );
}
