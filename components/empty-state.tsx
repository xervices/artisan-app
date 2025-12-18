import { View } from 'react-native';
import { Text } from './ui/text';
import { Image } from 'expo-image';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
}

export default function EmptyState({ subtitle, title }: EmptyStateProps) {
  return (
    <View className="flex flex-1 items-center justify-center gap-6">
      <View>
        <Text className="text-center font-cabinet-bold text-[#FE6A00]">{title}</Text>
        <Text className="text-center text-sm text-[#737381]">{subtitle}</Text>
      </View>

      <Image
        source={require('@/assets/icons/empty.svg')}
        style={{ width: 117, height: 100 }}
        contentFit="contain"
      />
    </View>
  );
}
