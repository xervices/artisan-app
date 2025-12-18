import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LegendList } from '@legendapp/list';
import { SheetManager } from 'react-native-actions-sheet';

export default function Screen() {
  const { type } = useLocalSearchParams();

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title={`${type} Photos`} />
        </View>
      }>
      <View className="flex-1 gap-6">
        <LegendList
          data={new Array(12).fill(0)}
          numColumns={3}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                SheetManager.show('image-preview-sheet', {
                  payload: {
                    imgSource: require('@/assets/images/sample.png'),
                  },
                });
              }}
              className="flex aspect-square w-full items-center justify-center gap-[2px] overflow-hidden rounded-[8px]">
              <Image
                source={require('@/assets/images/sample.png')}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </Pressable>
          )}
          recycleItems
          contentContainerStyle={{
            gap: 16,
          }}
          style={{
            paddingHorizontal: 10,
          }}
        />
      </View>
    </Layout>
  );
}
