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
  date?: string;
  serviceLat?: number;
  serviceLong?: number;
}

export default function RequestUserCard({
  address,
  avatarUrl,
  date,
  name,
  serviceLat,
  serviceLong,
}: RequestUserCardProp) {
  const { location } = useLocation();
  const [eta, setEta] = React.useState<string | null>(null);

  const fetchEta = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ) => {
    try {
      const apiKey = 'AIzaSyDkT-0SiaW_dZq_ydeOTZAsKT6IvSgLp5Q'; // Fallback to dev key if Constants fails

      if (!apiKey) {
        console.warn('Google Maps API Key not found');
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`
      );

      const result = await response.json();

      if (result.routes && result.routes.length > 0 && result.routes[0].legs) {
        const duration = result.routes[0].legs[0].duration.text;
        setEta(duration);
      }
    } catch (error) {
      console.error('Error fetching ETA:', error);
    }
  };

  useEffect(() => {
    if (location?.coords && serviceLat && serviceLong) {
      fetchEta(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude: serviceLat, longitude: serviceLong }
      );
    }
  }, [location, serviceLat, serviceLong]);

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

        <Text className="text-xs text-[#FFF4EA]">{address}</Text>
      </View>

      <View className="flex flex-row items-center justify-between gap-1">
        <View className="flex flex-row items-center gap-1.5">
          <Image
            source={require('@/assets/icons/location-primary.svg')}
            style={{ width: 16, height: 16 }}
            contentFit="contain"
          />

          <Text className="text-xs leading-none text-[#FFF4EA]">Location</Text>
        </View>

        <View className="h-0.5 flex-1 bg-[#FFF4EA]" />

        {eta ? (
          <Text className="font-cabinet-bold text-xs leading-none text-[#FFB884]">{eta} away</Text>
        ) : (
          <LoadingIndicator size={12} />
        )}
      </View>

      <View className="flex flex-row items-center justify-between gap-1">
        <Text className="text-sm text-[#FFF4EA]">Booking Date & Time</Text>
        <Text className="text-sm text-[#FFF4EA]">{formatDateTime(date)}</Text>
      </View>
    </View>
  );
}
