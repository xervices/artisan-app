import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ArrowUpRight, ChevronRight, Mail, MessageCircleMore } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Screen() {
  const [value, setValue] = React.useState('progress');

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Disputes" />
        </View>
      }>
      <Tabs value={value} onValueChange={setValue} className="w-full">
        <TabsList className="h-[52px] w-full border-none p-0">
          <TabsTrigger
            className="h-full w-1/2 rounded-none border-none"
            value="progress"
            style={{
              borderColor: undefined,
              borderWidth: 0,
              backgroundColor: value === 'progress' ? '#1B1B1E' : '#F4F4F5',
            }}>
            <Text
              className="font-cabinet-bold text-sm"
              style={{
                color: value === 'progress' ? '#FFF4EA' : '#737381',
              }}>
              In Progress
            </Text>
          </TabsTrigger>
          <TabsTrigger
            className="h-full w-1/2 rounded-none border-none"
            value="resolved"
            style={{
              borderColor: undefined,
              borderWidth: 0,
              backgroundColor: value === 'resolved' ? '#1B1B1E' : '#F4F4F5',
            }}>
            <Text
              className="font-cabinet-bold text-sm"
              style={{
                color: value === 'resolved' ? '#FFF4EA' : '#737381',
              }}>
              Resolved
            </Text>
          </TabsTrigger>
        </TabsList>

        {/* In progress content */}
        <TabsContent value="progress" className="flex gap-6 pt-4">
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
                <Text className="flex-1 font-cabinet-bold leading-none text-[#1B1B1E]">
                  Plumber
                </Text>
                <Text className="flex-1 text-sm text-[#FE6A00]">Dispute ID: 2984564</Text>
              </View>

              <View className="flex h-[26px] items-center justify-center rounded-full bg-[#FFF4EA] px-3">
                <Text className="text-sm text-primary">In Progress</Text>
              </View>
            </View>

            <Text className="text-sm text-[#737381]">
              Leaky kitchen faucet needs immediate repair. Water dripping constantly.
            </Text>

            <View className="flex flex-row items-center justify-between">
              <Pressable
                onPress={() => {
                  router.navigate({
                    pathname: '/profile/dispute-detail',
                    params: {
                      id: '45',
                    },
                  });
                }}
                className="flex flex-row items-center gap-1">
                <Text className="font-cabinet-bold text-sm text-primary">View Details</Text>

                <ArrowUpRight size={14} color={'#FE6A00'} />
              </Pressable>
            </View>
          </View>
        </TabsContent>

        {/* Resolved content */}
        <TabsContent value="resolved" className="flex gap-6 pt-4">
          {new Array(2).fill(0).map((_, index) => (
            <View
              key={index}
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
                  <Text className="flex-1 font-cabinet-bold leading-none text-[#1B1B1E]">
                    Plumber
                  </Text>
                  <Text className="flex-1 text-sm text-[#FE6A00]">Dispute ID: 2984564</Text>
                </View>

                <View className="flex h-[26px] items-center justify-center rounded-full bg-[#EAF5FF] px-3">
                  <Text className="text-sm text-[#004C8D]">Resolved</Text>
                </View>
              </View>

              <Text className="text-sm text-[#737381]">
                Leaky kitchen faucet needs immediate repair. Water dripping constantly.
              </Text>

              <View className="flex flex-row items-center justify-between">
                <Pressable
                  onPress={() => {
                    router.navigate({
                      pathname: '/profile/dispute-detail',
                      params: {
                        id: 'resolved',
                      },
                    });
                  }}
                  className="flex flex-row items-center gap-1">
                  <Text className="font-cabinet-bold text-sm text-primary">View Details</Text>

                  <ArrowUpRight size={14} color={'#FE6A00'} />
                </Pressable>
              </View>
            </View>
          ))}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
