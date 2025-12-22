import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight, Plus, Trash, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { Button } from '@/components/ui/button';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Bank account" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <Button onPress={() => router.navigate('/profile/add-bank')}>
          <View className="flex flex-row items-center gap-2">
            <Plus color={'#FFFFFF'} />

            <Text className="font-cabinet-extrabold text-[#F4F4F5]">Add Bank Account</Text>
          </View>
        </Button>

        <View className="flex gap-2">
          <Text className="font-cabinet-bold text-sm text-[#737381]">Saved Bank</Text>

          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            className="flex flex-row items-center justify-between gap-4 rounded-[8px] bg-white px-2 py-4">
            <View className="flex flex-row items-center gap-4">
              <View className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#FE6A00]">
                <View className="flex flex-row items-center">
                  <View className="h-3 w-3 rounded-full bg-[#FE6A00]" />
                </View>
              </View>

              <Text className="text-sm text-[#B4B4BC]">GTB Alex Baker - 1224 234976</Text>
            </View>

            <Pressable>
              <Trash2 size={20} color={'#FA4B67'} />
            </Pressable>
          </View>
        </View>
      </View>
    </Layout>
  );
}
