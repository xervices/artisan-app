import { Pressable, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Text } from '../ui/text';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LoadingIndicator } from '../ui/loading-indicator';
import { useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { OtpInput } from 'react-native-otp-entry';

export function PinSheet(props: SheetProps<'pin-sheet'>) {
  return (
    <ActionSheet
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      containerStyle={{
        backgroundColor: '#FFFFFF',
      }}
      indicatorStyle={{
        width: 38,
        height: 6,
        backgroundColor: '#FFF4EA',
      }}>
      <View className="flex gap-4 p-6 pt-0">
        <View className="relative flex w-full flex-row items-center justify-center">
          <Pressable onPress={() => SheetManager.hide('pin-sheet')} className="absolute left-0">
            <Icon as={ArrowLeft} size={28} color={'#B4B4BC'} />
          </Pressable>

          <Text className="font-cabinet-bold text-sm">Add Pin</Text>
        </View>

        <Text className="text-center text-sm text-[#737381]">
          Your pin adds an extra layer of security to your account
        </Text>

        <OtpInput
          numberOfDigits={4}
          theme={{
            pinCodeContainerStyle: {
              width: 60,
              aspectRatio: 1 / 1,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#C8C8CF',
            },
            focusStickStyle: {
              backgroundColor: '#FE6A00',
            },
            focusedPinCodeContainerStyle: {
              borderColor: '#FE6A00',
            },
            pinCodeTextStyle: {
              fontSize: 24,
              color: '#1B1B1E',
              fontFamily: 'CabinetGrotesk-Bold',
            },
          }}
        />

        <Button>Save pin</Button>
      </View>
    </ActionSheet>
  );
}
