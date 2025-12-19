import { View } from 'react-native';
import { Text } from '../ui/text';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

export function AvailabilityStatus() {
  const [checked, setChecked] = useState(false);

  function onCheckedChange(checked: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked(checked);
  }

  return (
    <View className="flex flex-row gap-6 rounded-[8px] bg-[#F4F4F5] p-4">
      <View className="flex-1">
        <Text className="font-cabinet-bold leading-none text-[#FE6A00]">Availability Status</Text>
        <Text className="text-sm text-[#737381]">Turn on availability to get job requests</Text>
      </View>

      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </View>
  );
}
