import { View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Text } from '../ui/text';
import { Image } from 'expo-image';

export default function RequestUserCard() {
  return (
    <View className="gap-4 rounded-[8px] bg-[#0A0A0B] p-4">
      <View>
        <View className="flex flex-row items-center gap-1">
          <Avatar alt="User's Avatar" className="h-6 w-6">
            <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
            <AvatarFallback className="bg-primary">
              <Text className="font-cabinet-bold leading-none">ZN</Text>
            </AvatarFallback>
          </Avatar>

          <Text className="font-cabinet-bold text-sm text-[#FFB884]">Alex Baker</Text>
        </View>

        <Text className="text-xs text-[#FFF4EA]">No 9, Tomabo Choba, Port Harcourt.</Text>
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

        <Text className="font-cabinet-bold text-xs leading-none text-[#FFB884]">14 mins away</Text>
      </View>

      <View className="flex flex-row items-center justify-between gap-1">
        <Text className="text-sm text-[#FFF4EA]">Booking Date & Time</Text>
        <Text className="text-sm text-[#FFF4EA]">2025-11-27 17:47:27</Text>
      </View>
    </View>
  );
}
