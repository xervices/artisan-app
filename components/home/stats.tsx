import { View } from 'react-native';
import { Text } from '../ui/text';

export function Stats() {
  return (
    <View className="flex flex-row gap-4">
      <View className="flex aspect-[155/60] flex-1 items-center justify-center rounded-[4px] bg-[#F4F4F5]">
        <Text className="text-center font-cabinet-bold text-lg text-[#737381]">8</Text>
        <Text className="text-center text-xs text-[#737381]">Jobs</Text>
      </View>

      <View className="flex aspect-[155/60] flex-1 items-center justify-center rounded-[4px] bg-[#F4F4F5]">
        <Text className="text-center font-cabinet-bold text-lg text-[#FE6A00]">4.9★</Text>
        <Text className="text-center text-xs text-[#737381]">Rating</Text>
      </View>
    </View>
  );
}
