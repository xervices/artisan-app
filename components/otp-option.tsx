import { View, Pressable } from 'react-native';
import { Text } from './ui/text';
import { MessageCircleMore } from 'lucide-react-native';

export function OtpOption() {
  return (
    <Pressable
      className={`flex w-full flex-row items-center gap-4 rounded-[8px] border p-4 ${true ? 'border-[#FE6A00]' : 'border-[#B4B4BC]'}`}>
      <View
        className={`flex h-10 w-10 items-center justify-center rounded-full ${true ? 'bg-[#FFE6D6]' : 'bg-[#DFDFE1]'}`}>
        <MessageCircleMore size={16} color={true ? '#FE6A00' : '#737381'} />
      </View>

      <View>
        <Text className="text-sm text-[#737381]">Via Sms</Text>
        <Text className="text-lg text-[#737381]">+234******7657</Text>
      </View>
    </Pressable>
  );
}
