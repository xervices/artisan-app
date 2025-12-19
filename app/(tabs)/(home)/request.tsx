import { AuthHeader } from '@/components/auth-header';
import RequestUserCard from '@/components/home/request-user-card';
import { Layout } from '@/components/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Image } from 'expo-image';
import { CircleAlert, Play } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Requests" />
        </View>
      }>
      <View className="flex-1 gap-4">
        <RequestUserCard />

        <View className="flex flex-row items-center justify-between rounded-[8px] bg-[#F4F4F5] p-4">
          <Text className="text-sm text-[#737381]">Service</Text>
          <Text className="font-cabinet-bold text-sm text-[#737381]">Plumber</Text>
        </View>

        <View className="flex gap-2">
          <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">Description</Text>

          <View className="flex flex-row items-center justify-between rounded-[8px] bg-[#F4F4F5] p-4">
            <Text className="text-sm text-[#737381]">
              Leaky kitchen faucet needs immediate repair. Water dripping constantly.Kitchen sink is
              completely clogged and water won't drain at all. Tried using a plunger but no luck.
              Need this fixed today if possible as we can't use the kitchen.
            </Text>
          </View>
        </View>

        <View className="flex gap-2">
          <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">Images</Text>

          <View className="flex flex-row flex-wrap justify-between gap-4">
            <View className="relative aspect-square w-[47%] overflow-hidden rounded-[8px]">
              <Image
                source={require('@/assets/images/sample.png')}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                contentFit="cover"
              />
            </View>

            <View className="relative aspect-square w-[47%] overflow-hidden rounded-[8px]">
              <Image
                source={require('@/assets/images/sample.png')}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                contentFit="cover"
              />

              <View className="absolute inset-0 flex h-full w-full items-center justify-center bg-[#FFE6D6]/0 p-4">
                <Pressable className="flex aspect-square w-11 items-center justify-center rounded-full bg-[#FFFFFF]">
                  <Play size={24} color={'#737381'} fill={'#737381'} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View className="flex flex-row gap-2 rounded-[8px] border border-[#0582F1] bg-[#EAF5FF] p-2">
          <CircleAlert size={20} color={'#0582F1'} />

          <Text className="flex-1 text-sm text-[#014178]">
            Prices cover service only. Materials, if needed, are handled between you and the client.
            Xervices does not provide or charge for them.
          </Text>
        </View>

        <View className="flex gap-2">
          <Text className="font-cabinet-medium text-xs uppercase text-[#1B1B1E]">Offers</Text>

          <View className="gap-4 rounded-[8px] border border-[#E9E9EB] p-4">
            <View className="flex aspect-[295/60] w-full items-center justify-center rounded-[6px] bg-[#F4F4F5]">
              <Text className="text-center text-xs text-[#737381]">Your offer</Text>
              <Text className="text-center font-cabinet-bold text-sm text-[#1B1B1E]">₦10,500</Text>
            </View>

            <View className="flex aspect-[295/60] w-full items-center justify-center rounded-[6px] bg-[#0A0A0B]">
              <Text className="text-center text-xs text-[#FFF4EA]">Customer offer</Text>
              <Text className="text-center font-cabinet-bold text-sm text-[#FFB884]">₦8500</Text>
            </View>
          </View>
        </View>

        <View className="flex flex-row gap-4">
          <Button
            className="flex-1"
            variant={'outline'}
            onPress={() => SheetManager.show('counter-offer-sheet')}>
            Counter
          </Button>

          <Button className="flex-1">Accept</Button>
        </View>

        <Button onPress={() => SheetManager.show('counter-offer-sheet')}>Send offer</Button>
      </View>
    </Layout>
  );
}
