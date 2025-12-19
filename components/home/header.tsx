import { View, Pressable } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BadgeCheck, Bell } from 'lucide-react-native';
import { Text } from '../ui/text';
import { router } from 'expo-router';

export function Header() {
  return (
    <View className="flex w-full flex-row items-end justify-between">
      <View className="flex flex-row items-center gap-2">
        <Avatar alt="User's Avatar">
          <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
          <AvatarFallback className="bg-primary">
            <Text className="font-cabinet-bold leading-none">ZN</Text>
          </AvatarFallback>
        </Avatar>

        <View>
          <Text className="text-xs leading-none text-[#1B1B1E]">Welcome</Text>
          <View className="flex flex-row gap-1">
            <Text className="font-cabinet-bold leading-none text-[#1B1B1E]">Sarah Rodri</Text>

            <BadgeCheck size={16} fill={'#FE6A00'} stroke={'#FFFFFF'} />
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => router.navigate('/notification')}
        className="relative flex h-6 w-6 items-center justify-center">
        <Bell fill={'#1B1B1E'} />

        <View className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#FE6A00]" />
      </Pressable>
    </View>
  );
}
