import { Pressable, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Text } from '../ui/text';
import { ArrowLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LoadingIndicator } from '../ui/loading-indicator';
import { useEffect } from 'react';

export function ImagePreviewSheet(props: SheetProps<'image-preview-sheet'>) {
  return (
    <ActionSheet
      gestureEnabled={true}
      closeOnTouchBackdrop={true}
      containerStyle={{
        backgroundColor: '#FFFFFF',
      }}
      indicatorStyle={{
        width: 38,
        height: 6,
        backgroundColor: '#FFF4EA',
      }}>
      <View className="flex items-center gap-4 p-6">
        <View className="flex w-full">
          <Pressable
            onPress={() => {
              SheetManager.hide('image-preview-sheet');
            }}
            className="h-8 w-8 justify-center">
            <ArrowLeft size={24} color={'#B4B4BC'} />
          </Pressable>
        </View>

        <Image
          source={props.payload?.imgSource}
          style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8 }}
          contentFit="contain"
        />
      </View>
    </ActionSheet>
  );
}
