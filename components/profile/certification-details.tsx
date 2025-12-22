import { Platform, Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TriggerRef } from '@rn-primitives/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Image } from 'expo-image';
import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { InputError } from '../ui/input-error';
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { X } from 'lucide-react-native';
import { UploadedMedia } from '../uploaded-media';
import { SheetManager } from 'react-native-actions-sheet';

const formSchema = z.object({
  exp: z.string().min(1, 'Fullname is required.'),
  lic_number: z.string().min(1, 'Phone number is required.'),
  issue_state: z.email('Invalid email address').min(1, 'Email is required.'),
  issue_date: z.string().min(1, 'State is required.'),
});

const nigerianStates = [
  { label: 'Abia', value: 'abia' },
  { label: 'Adamawa', value: 'adamawa' },
  { label: 'Akwa Ibom', value: 'akwa-ibom' },
  { label: 'Anambra', value: 'anambra' },
  { label: 'Bauchi', value: 'bauchi' },
  { label: 'Bayelsa', value: 'bayelsa' },
  { label: 'Benue', value: 'benue' },
  { label: 'Borno', value: 'borno' },
  { label: 'Cross River', value: 'cross-river' },
  { label: 'Delta', value: 'delta' },
  { label: 'Ebonyi', value: 'ebonyi' },
  { label: 'Edo', value: 'edo' },
  { label: 'Ekiti', value: 'ekiti' },
  { label: 'Enugu', value: 'enugu' },
  { label: 'Gombe', value: 'gombe' },
  { label: 'Imo', value: 'imo' },
  { label: 'Jigawa', value: 'jigawa' },
  { label: 'Kaduna', value: 'kaduna' },
  { label: 'Kano', value: 'kano' },
  { label: 'Katsina', value: 'katsina' },
  { label: 'Kebbi', value: 'kebbi' },
  { label: 'Kogi', value: 'kogi' },
  { label: 'Kwara', value: 'kwara' },
  { label: 'Lagos', value: 'lagos' },
  { label: 'Nasarawa', value: 'nasarawa' },
  { label: 'Niger', value: 'niger' },
  { label: 'Ogun', value: 'ogun' },
  { label: 'Ondo', value: 'ondo' },
  { label: 'Osun', value: 'osun' },
  { label: 'Oyo', value: 'oyo' },
  { label: 'Plateau', value: 'plateau' },
  { label: 'Rivers', value: 'rivers' },
  { label: 'Sokoto', value: 'sokoto' },
  { label: 'Taraba', value: 'taraba' },
  { label: 'Yobe', value: 'yobe' },
  { label: 'Zamfara', value: 'zamfara' },
  { label: 'FCT', value: 'fct' },
];

const data = [
  {
    id: '1',
    label: 'Plumber',
  },
  {
    id: '2',
    label: 'Electrician',
  },
  {
    id: '3',
    label: 'Carpenter',
  },
  {
    id: '4',
    label: 'Driver',
  },
];

export function CertificationDetails() {
  const ref = React.useRef<TriggerRef>(null);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 24,
    right: 24,
  };

  const form = useForm({
    defaultValues: {
      exp: '10 ',
      lic_number: '12345567788',
      issue_state: 'Rivers',
      issue_date: '27 Nov, 2025',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <View className="flex-1 gap-6">
      <View className="flex gap-4">
        <form.Field name="exp">
          {(field) => (
            <View>
              <Label nativeID="exp">Years of experience</Label>
              <Input
                className="bg-white"
                id="exp"
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="Enter your years of experience"
                hasError={!field.state.meta.isValid}
              />
              {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
            </View>
          )}
        </form.Field>

        <form.Field name="lic_number">
          {(field) => (
            <View>
              <Label nativeID="lic_number">Professional license number</Label>
              <Input
                className="bg-white"
                id="lic_number"
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="Enter your Professional license number"
                hasError={!field.state.meta.isValid}
                keyboardType="email-address"
              />
              {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
            </View>
          )}
        </form.Field>

        <form.Field name="issue_state">
          {(field) => (
            <View>
              <Label nativeID="state">Issue state</Label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue id="state" placeholder="Select Issue State" />
                </SelectTrigger>
                <SelectContent
                  insets={contentInsets}
                  className="mt-2 w-full bg-white"
                  style={{ maxHeight: 300 }}>
                  <NativeSelectScrollView className="h-full">
                    <SelectGroup>
                      <SelectLabel>State </SelectLabel>
                      {nigerianStates.map((type) => (
                        <SelectItem
                          onPress={() => {
                            field.handleChange(type.value);
                          }}
                          key={type.value}
                          label={type.label}
                          value={type.value}>
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

        <form.Field name="issue_date">
          {(field) => (
            <View>
              <Label nativeID="date">Issue date</Label>
              <Input
                className="bg-white"
                id="date"
                value={field.state.value}
                onChangeText={field.handleChange}
                placeholder="Enter your Issue date"
                hasError={!field.state.meta.isValid}
                keyboardType="number-pad"
              />
              {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
            </View>
          )}
        </form.Field>

        {new Array(2).fill(0).map((_, index) => (
          <View
            key={index}
            className="flex flex-1 flex-row items-center justify-between gap-6 rounded-[8px] bg-[#FFF4EA] p-3">
            <View className="flex flex-1 flex-row items-center gap-6">
              <Image
                source={require('@/assets/icons/image.svg')}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />

              <View className="flex flex-1 flex-row items-center gap-2">
                <Text className="text-xs text-[#3E1A00]" numberOfLines={1}>
                  File.doc
                </Text>

                <View className="h-1 w-1 rounded-full bg-[#767676]" />

                <Pressable>
                  <Text className="text-xs text-[#FE6A00]">Preview</Text>
                </Pressable>
              </View>
            </View>

            <View className="flex flex-row items-center gap-6">
              <Text className="text-xs text-[#A44400]" numberOfLines={1}>
                5.7MB
              </Text>

              <Pressable>
                <X size={16} color={'#737381'} />
              </Pressable>
            </View>
          </View>
        ))}

        <View>
          <Pressable className="mt-1 flex aspect-[327/100] w-full items-center justify-center rounded-[8px] border-2 border-[#E9E9EB]">
            <Image
              source={require('@/assets/icons/document.svg')}
              style={{ width: 24, height: 24 }}
              contentFit="contain"
            />

            <Text className="text-center text-sm text-[#FE6A00]">Add Documents</Text>
            <Text className="text-center text-xs text-[#B4B4BC]">Upload certificate </Text>
          </Pressable>
        </View>

        <View className="flex gap-2 border-t border-t-[#E9E9EB] pt-4">
          <Text className="font-cabinet-medium text-xs uppercase text-[#737381]" numberOfLines={1}>
            Previous Jobs
          </Text>

          <View className="flex flex-row flex-wrap justify-between gap-4">
            {[
              require('@/assets/images/sample.png'),
              require('@/assets/images/sample.png'),
              require('@/assets/images/sample.png'),
              require('@/assets/images/sample.png'),
            ].map((item, index) => (
              <UploadedMedia
                key={index}
                url={item}
                onDelete={() => SheetManager.show('delete-image-sheet')}
                type={'photo'}
                size="sm"
              />
            ))}
          </View>

          <Pressable className="mt-1 flex aspect-[327/100] w-full items-center justify-center rounded-[8px] border-2 border-[#E9E9EB]">
            <Image
              source={require('@/assets/icons/camera-primary.svg')}
              style={{ width: 24, height: 24 }}
              contentFit="contain"
            />

            <Text className="text-center text-sm text-[#FE6A00]">Add Photos/Videos</Text>
            <Text className="text-center text-xs text-[#B4B4BC]">Upload previous jobs </Text>
          </Pressable>
        </View>
      </View>

      <Button onPress={form.handleSubmit}>Save Changes</Button>
    </View>
  );
}
