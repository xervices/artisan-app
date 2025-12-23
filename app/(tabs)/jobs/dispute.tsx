import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import {
  ArrowUpRight,
  BadgeCheck,
  Camera,
  ChevronRight,
  Mail,
  MessageCircleMore,
  Trash2,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  type: z.string().min(1, 'Issue type is required.'),
  reason: z.string().min(1, 'Please describe your concern.'),
});

const data = [
  {
    id: '1',
    label: 'Work quality issues',
  },
  {
    id: '2',
    label: "Pro didn't show up",
  },
  {
    id: '3',
    label: 'Billing dispute',
  },
  {
    id: '4',
    label: 'Safety or conduct issues',
  },
  {
    id: '5',
    label: 'Other issues',
  },
];

export default function Screen() {
  const { id } = useLocalSearchParams();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 24,
    right: 24,
  };

  const form = useForm({
    defaultValues: {
      type: '',
      reason: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Dispute" />
        </View>
      }>
      <View className="flex-1 gap-4">
        <View className="flex w-full flex-row">
          <View className="flex w-1/2 flex-row items-center gap-2">
            <Avatar alt="User's Avatar" className="h-14 w-14">
              <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
              <AvatarFallback className="bg-primary">
                <Text className="font-cabinet-bold leading-none">ZN</Text>
              </AvatarFallback>
            </Avatar>

            <View>
              <View className="flex flex-row items-center">
                <Text className="font-cabinet-bold text-[18px] text-[#1B1B1E]">Sarah Rodri</Text>
              </View>
            </View>
          </View>

          <View className="flex w-1/2 justify-between">
            <Text className="text-right text-xs text-[#FF6A00]">JOB ID ● #25667</Text>

            <Text className="text-right font-cabinet-bold text-[18px] text-[#FF6A00]">₦8500</Text>
          </View>
        </View>

        <View className="flex w-full flex-row justify-between">
          <Text className="flex-1 text-sm text-[#737381]">Booking Date & Time</Text>

          <Text className="font-cabinet-bold text-sm text-[#737381]">2025-11-27 17:47:27</Text>
        </View>

        <form.Field name="type">
          {(field) => (
            <View>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue id="state" placeholder="Select Issues Type" />
                </SelectTrigger>
                <SelectContent
                  insets={contentInsets}
                  className="mt-2 w-full bg-white"
                  style={{ maxHeight: 300 }}>
                  <NativeSelectScrollView className="h-full">
                    <SelectGroup>
                      <SelectLabel>Issues Type</SelectLabel>
                      {data.map((type) => (
                        <SelectItem
                          onPress={() => {
                            field.handleChange(type.label);
                          }}
                          key={type.id}
                          label={type.label}
                          value={type.label}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </NativeSelectScrollView>
                </SelectContent>
              </Select>

              {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
            </View>
          )}
        </form.Field>

        <form.Field name="reason">
          {(field) => (
            <View>
              <Label nativeID="reason">Describe your concern</Label>
              <Textarea
                className="bg-white"
                id="reason"
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="Clearly explain your issue"
                hasError={!field.state.meta.isValid}
              />
              {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
            </View>
          )}
        </form.Field>

        <View>
          <Text className="font-cabinet-bold text-sm text-[#737381]">Add Photos or Videos</Text>

          <Text className="text-sm text-[#737381]">
            Photos and videos will help us resolve disputes faster
          </Text>

          <Text className="text-sm text-[#FFAC70]">
            Include photos of: The completed work, Any damage or poor quality and original job
            agreement/messages
          </Text>
        </View>

        <View className="flex flex-row flex-wrap gap-2">
          {new Array(4).fill(0).map((_, index) => (
            <View
              key={index}
              className="relative aspect-[56/46] w-14 overflow-hidden rounded-[4px]">
              <Image
                source={require('@/assets/images/sample.png')}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />

              <View className="absolute inset-0 flex items-center justify-center">
                <Pressable className="flex aspect-square w-[26px] items-center justify-center rounded-full bg-[#FFF4EA]">
                  <Trash2 size={16} color={'#737381'} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View className="flex aspect-square w-[66px] items-center justify-center rounded-[8px] border border-[#D4D4D8]">
          <Camera size={24} color={'#737381'} />
        </View>

        <Button className="mt-14" onPress={form.handleSubmit}>
          Submit Dispute
        </Button>
      </View>
    </Layout>
  );
}
