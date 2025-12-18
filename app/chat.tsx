import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import * as Application from 'expo-application';
import { Layout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CheckCheck,
  Dot,
  Phone,
  Send,
} from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LegendList } from '@legendapp/list';
import { Input } from '@/components/ui/input';

const data = [
  {
    id: '123',
    date: 'Today',
    content: null,
    time: null,
    isTyping: false,
    isPro: false,
  },
  {
    id: '124',
    date: 'Today',
    content: "Hi! I'm on my way to fix your kitchen sink. Should be there in 15 minutes.",
    time: '09:31 am',
    isTyping: false,
    isPro: true,
  },
  {
    id: '125',
    date: 'Today',
    content: "Great! I'll be here. The leak is getting worse.",
    time: '09:33 am',
    isTyping: false,
    isPro: false,
  },
  {
    id: '126',
    date: 'Today',
    content: 'No problem! I have all the parts needed. Can you send me a photo of the leak?',
    time: '09:35 am',
    isTyping: false,
    isPro: true,
  },
  {
    id: '127',
    date: null,
    content: null,
    time: null,
    isTyping: true,
    isPro: true,
  },
];

export default function Screen() {
  return (
    <Layout useBackground scrollable={false}>
      <View className="flex-1 gap-4">
        <View className="relative flex w-full flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={28} color={'#B4B4BC'} />
          </Pressable>

          <Pressable>
            <Phone size={24} color={'#FE6A00'} fill={'#FE6A00'} />
          </Pressable>
        </View>

        <View className="flex w-full flex-row">
          <View className="flex flex-1 flex-row items-center gap-2">
            <View className="relative h-14 w-14">
              <Avatar alt="User's Avatar" className="h-14 w-14">
                <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
                <AvatarFallback className="bg-primary">
                  <Text className="font-cabinet-bold leading-none">ZN</Text>
                </AvatarFallback>
              </Avatar>

              <View className="absolute bottom-0 right-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-[#04802E]" />
            </View>

            <View>
              <View className="flex flex-row items-center">
                <Text className="font-cabinet-bold text-[18px] text-[#1B1B1E]">Sarah Rodri</Text>

                <BadgeCheck size={16} fill={'#FE6A00'} stroke={'#FFFFFF'} />
              </View>

              <Text className="text-xs text-[#1B1B1E]">Plumbing Specialist</Text>

              <Text className="font-cabinet-bold text-xs text-[#22973B]">Online</Text>
            </View>
          </View>

          <View className="flex flex-row justify-between">
            <View className="flex h-[26px] items-center justify-center rounded-full bg-[#FFF4EA] px-3">
              <Text className="text-sm text-primary">In Progress</Text>
            </View>
          </View>
        </View>

        <LegendList
          data={data}
          renderItem={({ item }) =>
            item.content === null && item.isTyping === false ? (
              <Text className="text-center text-sm text-[#B4B4BC]">{item.date}</Text>
            ) : item.content === null && item.isTyping === true ? (
              <View className="flex flex-row items-center gap-2">
                <Text className="text-center text-sm text-[#B4B4BC]">Sarah is typing</Text>

                <View className="flex flex-row">
                  {new Array(5).fill(0).map((_, index) => (
                    <Dot key={index} size={20} color={'#FE6A00'} fill={'#FE6A00'} />
                  ))}
                </View>
              </View>
            ) : item.isPro ? (
              <View>
                <Text className="text-sm text-[#737381]">{item.content}</Text>
                <Text className="text-xs text-[#AAA6B9]">{item.time}</Text>
              </View>
            ) : (
              <View className="flex flex-row justify-end">
                <View className="w-[80%]">
                  <View className="rounded-2xl rounded-br-none bg-[#FE6A00] p-4">
                    <Text className="text-sm text-white">{item.content}</Text>
                  </View>

                  <View className="mt-1 flex flex-row items-center justify-end gap-1">
                    <Text className="text-xs text-[#AAA6B9]">{item.time}</Text>

                    <CheckCheck size={14} color={'#808080'} />
                  </View>
                </View>
              </View>
            )
          }
          estimatedItemSize={68}
          //   alignItemsAtEnd
          //   maintainScrollAtEnd
          maintainScrollAtEndThreshold={0.1}
          contentContainerStyle={{ flexGrow: 1, gap: 16 }}
        />

        <View className="flex w-full flex-row items-center justify-between gap-4">
          <View className="flex flex-1 flex-row">
            <Input placeholder="Type your message" className="h-12 bg-white" />
          </View>

          <Pressable className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF8733]">
            <Send size={24} stroke={'#FFF4EA'} fill={'#FFF4EA'} />
          </Pressable>
        </View>
      </View>
    </Layout>
  );
}
