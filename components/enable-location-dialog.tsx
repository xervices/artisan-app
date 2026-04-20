import React, { useEffect, useState } from 'react';
import { Text } from './ui/text';
import { Modal, Pressable, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from './ui/button';
import { useLocation } from 'solomo';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { useBackgroundLocation } from '@/hooks/use-background-location';

export default function EnableLocationDialog() {
  const { hasPermission, requestPermission, location } = useLocation();
  const { startTracking } = useBackgroundLocation();

  const { mutate } = useMutation(api.updateLocation());

  const [visible, setVisible] = useState(!hasPermission);

  useEffect(() => {
    if (hasPermission) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [hasPermission]);

  useEffect(() => {
    if (location?.coords) {
      mutate(
        { latitude: location?.coords?.latitude, longitude: location?.coords?.longitude }
        // {
        //   onSuccess: (res) => {
        //     console.log(res);
        //   },
        // }
      );
    }
  }, [location]);

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
          {/* Header with Close Button */}
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 font-cabinet-bold text-base text-[#1B1B1E]">
              Location Data Consent
            </Text>

            <Pressable
              onPress={() => setVisible(false)}
              className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF4EA]"
              hitSlop={8}>
              <X size={16} color="#1B1B1E" />
            </Pressable>
          </View>

          {/* Description */}
          <Text className="mb-4 mt-2 text-sm text-[#737381]">
            Xervices Pro collects location data to enable Active Job navigation, Live Map Tracking,
            and accurate ETA calculations even when the app is closed or not in use.
          </Text>

          {/* Action Button */}
          <Button
            onPress={async () => {
              await requestPermission();
              await startTracking();
              setVisible(false);
            }}>
            Continue
          </Button>
        </View>
      </View>
    </Modal>
  );
}
