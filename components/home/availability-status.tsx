import { View } from 'react-native';
import { Text } from '../ui/text';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingIndicator } from '../ui/loading-indicator';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';

export function AvailabilityStatus() {
  const { data, isError, isLoading, refetch } = useQuery(api.getCurrentArtisanProfile());

  const { isPending, mutate } = useMutation(api.toggleAvailability());

  if (isError) return null;

  console.log(data?.userId);

  function onCheckedChange(checked: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    mutate(
      { isAvailable: checked },
      {
        onSuccess: () => {
          refetch();
          showSuccessMessage('Availability changed successfully');
        },
        onError: (err) => {
          showErrorMessage(err.message);
        },
      }
    );
  }

  return (
    <View className="flex flex-row gap-6 rounded-[8px] bg-[#F4F4F5] p-4">
      <View className="flex-1">
        <Text className="font-cabinet-bold leading-none text-[#FE6A00]">Availability Status</Text>
        <Text className="text-sm text-[#737381]">Turn on availability to get job requests</Text>
      </View>

      {isLoading || isPending ? (
        <LoadingIndicator size={24} />
      ) : (
        <Switch checked={data?.isAvailable || false} onCheckedChange={onCheckedChange} />
      )}
    </View>
  );
}
