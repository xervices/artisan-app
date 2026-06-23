import React from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import { X } from 'lucide-react-native';

import { Text } from './ui/text';
import { Button } from './ui/button';
import { useLocationConsentStore } from '@/store/location-consent-store';

const ANDROID_TITLE = 'Location Data Consent';
const ANDROID_BODY =
  'Xervices Pro collects location data to enable Active Job navigation, Live Map Tracking, and accurate ETA calculations, even when the app is closed or not in use.\n\n' +
  'This location data is transmitted to Xervices servers so we can match you with nearby service requests, share your live location with customers during active jobs, and estimate your arrival time.\n\n' +
  'Location data is not shared with third parties for advertising and is not sold. You can revoke this permission at any time in your device settings.';

const IOS_TITLE = 'Location Data Consent';
const IOS_BODY =
  'Xervices Pro collects location data to enable Active Job navigation, Live Map Tracking, and accurate ETA calculations even when the app is closed or not in use.';

export function LocationConsentDialog() {
  const { visible, respond } = useLocationConsentStore();

  const isAndroid = Platform.OS === 'android';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-start bg-black-1/50 px-6 pt-20">
        <View
          className="flex w-full gap-2 rounded-[8px] bg-white p-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
          }}>
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 font-cabinet-bold text-base text-[#1B1B1E]">
              {isAndroid ? ANDROID_TITLE : IOS_TITLE}
            </Text>

            {!isAndroid && (
              <Pressable
                onPress={() => respond(false)}
                className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF4EA]"
                hitSlop={8}>
                <X size={16} color="#1B1B1E" />
              </Pressable>
            )}
          </View>

          <Text className="mb-4 mt-2 text-sm text-[#737381]">
            {isAndroid ? ANDROID_BODY : IOS_BODY}
          </Text>

          {isAndroid ? (
            <View className="flex flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => respond(false)}>
                Deny
              </Button>

              <Button className="flex-1" onPress={() => respond(true)}>
                Allow
              </Button>
            </View>
          ) : (
            <Button onPress={() => respond(true)}>Continue</Button>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default LocationConsentDialog;
