import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ArrowUpRight, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader />
        </View>
      }>
      <View className="flex-1 gap-2">
        <View className="flex flex-row items-center justify-between gap-2">
          <Text className="flex-1 text-sm text-[#737381]">8 artisans viewed your request</Text>

          <View className="flex-row">
            <Avatar
              alt="@mrzachnugent"
              className="-mr-2 h-6 w-6 border-2 border-background web:border-0 web:ring-2 web:ring-background">
              <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
              <AvatarFallback>
                <Text>ZN</Text>
              </AvatarFallback>
            </Avatar>
            <Avatar
              alt="@leerob"
              className="-mr-2 h-6 w-6 border-2 border-background web:border-0 web:ring-2 web:ring-background">
              <AvatarImage source={{ uri: 'https://github.com/leerob.png' }} />
              <AvatarFallback>
                <Text>LR</Text>
              </AvatarFallback>
            </Avatar>
            <Avatar
              alt="@evilrabbit"
              className="-mr-2 h-6 w-6 border-2 border-background web:border-0 web:ring-2 web:ring-background">
              <AvatarImage source={{ uri: 'https://github.com/evilrabbit.png' }} />
              <AvatarFallback>
                <Text>ER</Text>
              </AvatarFallback>
            </Avatar>
            <Avatar
              alt="@mrzachnugent"
              className="-mr-2 h-6 w-6 border-2 border-background web:border-0 web:ring-2 web:ring-background">
              <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
              <AvatarFallback>
                <Text>ZN</Text>
              </AvatarFallback>
            </Avatar>
            <Avatar
              alt="@leerob"
              className="-mr-2 h-6 w-6 border-2 border-background web:border-0 web:ring-2 web:ring-background">
              <AvatarImage source={{ uri: 'https://github.com/leerob.png' }} />
              <AvatarFallback>
                <Text>LR</Text>
              </AvatarFallback>
            </Avatar>
            <Avatar
              alt="@evilrabbit"
              className="-mr-2 h-6 w-6 border-2 border-background web:border-0 web:ring-2 web:ring-background">
              <AvatarImage source={{ uri: 'https://github.com/evilrabbit.png' }} />
              <AvatarFallback>
                <Text>ER</Text>
              </AvatarFallback>
            </Avatar>
            <Avatar
              alt="@evilrabbit"
              className="-mr-2 h-6 w-6 border-2 border-background bg-[#F4F4F5] web:border-0 web:ring-2 web:ring-background">
              <AvatarFallback>
                <Text className="font-cabinet-bold text-xs">+2</Text>
              </AvatarFallback>
            </Avatar>
          </View>
        </View>

        <Image
          source={require('@/assets/images/success-check.svg')}
          style={{ width: 100, height: 100, marginHorizontal: 'auto' }}
          contentFit="contain"
        />

        <View className="mt-2">
          <Text className="text-center font-cabinet-bold text-[#1B1B1E]">
            Your service has been booked!
          </Text>
          <Text className="text-center text-sm text-[#737381]">
            Your service request is now visible to verified pros
          </Text>
        </View>

        <View
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
          className="flex gap-4 rounded-[8px] bg-white p-4">
          <View className="flex flex-row items-center justify-between">
            <View>
              <Text className="flex-1 font-cabinet-bold text-[#1B1B1E]">Plumber</Text>
              <Text className="flex-1 text-xs text-[#FE6A00]">Posted 2 sec ago</Text>
            </View>

            <View className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-[#FFAC70]">
              <Image
                source={require('@/assets/images/sample.png')}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
          </View>

          <Text className="text-sm text-[#737381]">
            Leaky kitchen faucet needs immediate repair. Water dripping constantly.
          </Text>

          <View className="flex flex-row items-center justify-end">
            <Pressable
              onPress={() =>
                router.navigate({
                  pathname: '/jobs/ongoing',
                  params: {
                    id: '97575',
                  },
                })
              }
              className="flex flex-row items-center gap-1">
              <Text className="font-cabinet-bold text-sm text-primary">View details</Text>

              <ArrowUpRight size={14} color={'#FE6A00'} />
            </Pressable>
          </View>
        </View>

        <View className="mt-3 flex gap-2">
          <Text className="font-cabinet-bold text-[#737381]">What happens next?</Text>

          <View className="flex flex-row items-center gap-2">
            <View className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#FE6A00]">
              <View className="h-1.5 w-1.5 rounded-full bg-white" />
            </View>

            <Text className="text-sm text-[#737381]">Pros will review your service request</Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <View className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#FE6A00]">
              <View className="h-1.5 w-1.5 rounded-full bg-white" />
            </View>

            <Text className="text-sm text-[#737381]">
              You’ll receive negotiable offers within 5 minutes
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <View className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#FE6A00]">
              <View className="h-1.5 w-1.5 rounded-full bg-white" />
            </View>

            <Text className="text-sm text-[#737381]">Compare profiles and choose a pro</Text>
          </View>
        </View>

        <View className="mt-6 flex items-center justify-center gap-2">
          <Text className="text-center text-xs text-[#FE6A00]">
            Automatically searching for pros...
          </Text>

          <LoadingIndicator size={42} />
        </View>
      </View>
    </Layout>
  );
}
