import { Pressable, View } from 'react-native';
import React from 'react';
import { Text } from '../ui/text';
import ActionSheet, { ScrollView, SheetManager, SheetProps } from 'react-native-actions-sheet';
import { router } from 'expo-router';
import { ArrowLeft, BadgeCheck, Camera, PhoneCall } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Image } from 'expo-image';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';

export function OngoingJobSheet(props: SheetProps<'ongoing-job-sheet'>) {
  const jobId = props.payload?.id || '';

  const { isLoading, data, refetch, isRefetching } = useQuery(api.getJobDetail(jobId));

  const startJob = useMutation(api.startJob(jobId));
  const cancelJob = useMutation(api.cancelJob(jobId));
  const completeJob = useMutation(api.completeJob(jobId));

  const snapPoints = [100];

  return (
    <ActionSheet
      snapPoints={snapPoints}
      initialSnapIndex={0}
      closable={false}
      closeOnPressBack={true}
      onNavigateBack={() => {
        SheetManager.hide('ongoing-job-sheet');
      }}
      backgroundInteractionEnabled={true}
      isModal={false}
      gestureEnabled={true}
      containerStyle={{
        backgroundColor: '#FFFFFF',
      }}
      indicatorStyle={{
        width: 38,
        height: 6,
        backgroundColor: '#FFF4EA',
      }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex gap-6 p-6">
          <View className="relative flex w-full flex-row items-center justify-center">
            <Pressable
              onPress={() => {
                SheetManager.hide('ongoing-job-sheet');
                router.back();
              }}
              className="absolute left-0 h-8 w-8 justify-center">
              <ArrowLeft size={24} color={'#B4B4BC'} />
            </Pressable>
          </View>

          <View>
            <Text className="font-cabinet-bold text-[#1B1B1E]">
              Don’t forget to check in when you arrive
            </Text>

            <Text className="text-xs text-[#737381]">She'll check in when he arrives</Text>
          </View>

          <View className="flex w-full flex-row">
            <View className="flex w-1/2 flex-row items-center gap-2">
              <Avatar alt="User's Avatar" className="h-6 w-6">
                <AvatarImage source={{ uri: data?.user?.profile?.avatarUrl }} />
                <AvatarFallback className="bg-primary">
                  <Text className="font-cabinet-bold text-xs uppercase leading-none">
                    {data?.user?.profile?.fullName?.substring(0, 2)}
                  </Text>
                </AvatarFallback>
              </Avatar>

              <View>
                <View className="flex flex-row items-center">
                  <Text className="font-cabinet-bold text-[18px] text-[#1B1B1E]">
                    {data?.user?.profile?.fullName}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex flex-row gap-4">
            <Button className="flex-1 border-[#1B1B1E] bg-white">
              <PhoneCall size={16} fill={'#1B1B1E'} />

              <Text className="font-cabinet-bold text-[#1B1B1E]">Call</Text>
            </Button>

            <Button
              onPress={() => {
                SheetManager.hideAll();
                router.navigate({
                  pathname: '/chat',
                  params: {
                    id: data?.id,
                  },
                });
              }}
              className="flex-1 border-[#FE6A00] bg-white">
              <Image
                source={require('@/assets/icons/message-notif.svg')}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />

              <Text className="font-cabinet-bold text-[#FE6A00]">Message</Text>
            </Button>
          </View>

          <View className="flex gap-4">
            <View className="flex gap-2">
              <Text className="font-cabinet-medium text-xs uppercase leading-none text-[#1B1B1E]">
                Before Photo
              </Text>

              <View className="flex aspect-square w-[66px] items-center justify-center rounded-[8px] border border-[#D4D4D8]">
                <Camera size={24} color={'#737381'} />
              </View>

              <View className="mt-1 flex flex-row flex-wrap gap-2">
                {new Array(4).fill(0).map((_, index) => (
                  <View key={index} className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                    <Image
                      source={require('@/assets/images/sample.png')}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </View>
            </View>

            <View className="flex gap-2">
              <Text className="font-cabinet-medium text-xs uppercase leading-none text-[#1B1B1E]">
                After Photo
              </Text>

              <View className="flex aspect-square w-[66px] items-center justify-center rounded-[8px] border border-[#D4D4D8]">
                <Camera size={24} color={'#737381'} />
              </View>

              <View className="mt-1 flex flex-row flex-wrap gap-2">
                {new Array(4).fill(0).map((_, index) => (
                  <View key={index} className="aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
                    <Image
                      source={require('@/assets/images/sample.png')}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </View>
            </View>

            <View className="flex gap-4">
              <Button
                isLoading={cancelJob?.isPending}
                disabled={cancelJob?.isPending}
                onPress={() => {
                  cancelJob?.mutate(
                    {},
                    {
                      onSuccess: (res) => {
                        showSuccessMessage('Job cancelled successfully.');
                        refetch();
                        SheetManager.hideAll();
                        router.replace('/jobs');
                      },
                      onError: (err) => {
                        showErrorMessage(err?.message);
                      },
                    }
                  );
                }}
                className="flex-1 border-[#DFDFE1] bg-white">
                <Text className="font-cabinet-extrabold text-[#737381]">Cancel offer</Text>
              </Button>

              <Button
                isLoading={startJob?.isPending}
                disabled={startJob?.isPending}
                onPress={() => {
                  startJob?.mutate(
                    {},
                    {
                      onSuccess: (res) => {
                        showSuccessMessage('Job marked as started.');
                        refetch();
                      },
                      onError: (err) => {
                        showErrorMessage(err?.message);
                      },
                    }
                  );
                }}
                className="">
                Mark Arrived
              </Button>

              <Button
                isLoading={completeJob?.isPending}
                disabled={completeJob?.isPending}
                onPress={() => {
                  completeJob?.mutate(
                    {},
                    {
                      onSuccess: (res) => {
                        showSuccessMessage('Job marked as completed.');
                        refetch();
                      },
                      onError: (err) => {
                        showErrorMessage(err?.message);
                      },
                    }
                  );
                }}
                className="">
                Mark complete
              </Button>

              <Button
                isLoading={completeJob?.isPending}
                disabled={completeJob?.isPending}
                onPress={() =>
                  router.navigate({
                    pathname: '/jobs/dispute',
                    params: {
                      id: jobId,
                    },
                  })
                }
                variant={'outline'}>
                Dispute
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
}
