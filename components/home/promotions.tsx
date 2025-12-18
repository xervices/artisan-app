import { Image } from 'expo-image';
import { View, ScrollView } from 'react-native';
import { Text } from '../ui/text';

export function Promotions() {
  return (
    <View className="flex gap-2">
      <Text className="pl-6 font-cabinet-medium text-xs uppercase">Promotions & news</Text>

      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        showsHorizontalScrollIndicator={false}>
        <Image
          source={require('@/assets/images/promotion-1.svg')}
          style={{ width: 250, height: 100 }}
          contentFit="contain"
        />

        <Image
          source={require('@/assets/images/promotion-2.svg')}
          style={{ width: 250, height: 100 }}
          contentFit="contain"
        />
      </ScrollView>
    </View>
  );
}
