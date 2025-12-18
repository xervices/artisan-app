import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react-native';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Screen() {
  const [rating, setRating] = React.useState(0);

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Rate Xervices" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <View className="flex gap-2">
          <Text className="text-center font-cabinet-bold text-[#737381]">Rate us</Text>

          <Text className="text-center text-sm text-[#737381]">We would love to hear from you</Text>
        </View>

        <View className="flex gap-10">
          <View className="flex flex-row items-center justify-center gap-4">
            {new Array(5).fill(0).map((_, index) => (
              <Pressable onPress={() => setRating(index + 1)} key={index}>
                <Star
                  fill={index >= rating ? '#DFDFE1' : '#FF9445'}
                  size={28}
                  stroke={index >= rating ? '#DFDFE1' : '#FF9445'}
                />
              </Pressable>
            ))}
          </View>

          <View>
            <Label nativeID="comment">Add a comment</Label>
            <Textarea className="bg-white" id="comment" />
          </View>
        </View>

        <Button className="mt-auto">Submit Review</Button>
      </View>
    </Layout>
  );
}
