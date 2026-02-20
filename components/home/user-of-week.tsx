import { Image } from 'expo-image';
import { View } from 'react-native';
import { Text } from '../ui/text';

export function UserOfWeek() {
  return (
    <View className="flex gap-2 px-6">
      <Text className="font-cabinet-medium text-xs uppercase">User of the week</Text>

      <Image
        source={require('@/assets/images/user-of-week.png')}
        style={{
          width: '100%',
          aspectRatio: '327/150',
        }}
        contentFit="cover"
      />
    </View>
  );
}
