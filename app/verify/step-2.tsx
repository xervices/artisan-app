import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Camera, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
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
import { TriggerRef } from '@rn-primitives/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

const formSchema = z.object({
  exp: z.string().min(1, 'State is required.'),
  license: z.string().min(1, 'Address is required.'),
  state: z.string().min(1, 'Address is required.'),
  // certs: z.string().min(1, 'Identification type is required.'),
  // prev: z.string().min(1, 'Identification number is required.'),
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

export default function Screen() {
  const ref = React.useRef<TriggerRef>(null);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 24,
    right: 24,
  };

  // Workaround for rn-primitives/select not opening on mobile
  //   function onTouchStart() {
  //     console.log(ref.current);
  //     ref.current?.open();
  //   }

  const form = useForm({
    defaultValues: {
      exp: '',
      license: '',
      state: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View className="flex-1 gap-4 bg-white">
        <Text className="text-center font-cabinet-bold text-xs text-[#B4B4BC]">Step 2 of 2</Text>

        <Text className="text-center text-sm text-[#737381]">
          Connect with thousands of potential customers
        </Text>

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
                  placeholder="Enter your years of experience."
                  keyboardType="number-pad"
                  hasError={!field.state.meta.isValid}
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <form.Field name="license">
            {(field) => (
              <View>
                <Label nativeID="license">Professional license number</Label>
                <Input
                  className="bg-white"
                  id="license"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your Professional license number."
                  hasError={!field.state.meta.isValid}
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <form.Field name="state">
            {(field) => (
              <View>
                <Label nativeID="state">Issue state</Label>

                <Select>
                  <SelectTrigger ref={ref} className="w-full bg-white">
                    <SelectValue id="state" placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent
                    insets={contentInsets}
                    className="mt-2 w-full bg-white"
                    style={{ maxHeight: 300 }}>
                    <NativeSelectScrollView className="h-full">
                      <SelectGroup>
                        <SelectLabel>State</SelectLabel>
                        {nigerianStates.map((state) => (
                          <SelectItem
                            onPress={() => {
                              field.handleChange(state.value);
                            }}
                            key={state.value}
                            label={state.label}
                            value={state.value}>
                            {state.label}
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

          <View>
            <Label nativeID="certs">Upload certifications</Label>

            <Text className="text-sm text-[#737381]">
              Upload valid documents that shows you are a professional in your field.
            </Text>

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

          <View>
            <Label nativeID="prev">Upload previous jobs</Label>

            <Text className="text-sm text-[#737381]">A minimum of 4</Text>

            <View className="my-2 flex gap-2">
              <View className="flex flex-row items-center gap-2 rounded-[8px] bg-[#FFF4EA] p-[10px]">
                <View className="flex flex-1 flex-row items-center gap-6">
                  <Image
                    source={require('@/assets/icons/image.svg')}
                    style={{ width: 24, height: 24 }}
                    contentFit="contain"
                  />

                  <View className="flex flex-1 flex-row items-center gap-2">
                    <Text className="flex-1 text-xs text-[#3E1A00]" numberOfLines={1}>
                      Picture.png
                    </Text>

                    <View className="h-1 w-1 rounded-full bg-[#767676]" />

                    <Pressable>
                      <Text className="text-xs text-[#FE6A00]">Preview</Text>
                    </Pressable>
                  </View>
                </View>

                <View className="flex flex-row items-center gap-6">
                  <Text className="text-xs text-[#A44400]">5.7MB</Text>

                  <Pressable>
                    <X color={'#737381'} size={16} />
                  </Pressable>
                </View>
              </View>
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

          <Button onPress={form.handleSubmit}>Continue</Button>
        </View>

        <View className="flex flex-row items-center justify-center gap-1.5">
          <Text className="text-[#737381]">Already have an account?</Text>

          <Pressable onPress={() => router.navigate('/login')}>
            <Text className="text-primary">Log in</Text>
          </Pressable>
        </View>

        <View className="flex flex-row items-center justify-center gap-1.5">
          <Text className="text-center text-[#737381]">
            <Pressable>
              <Text className="mx-1 leading-normal text-[#737381]">
                By creating an account, you agree to our
              </Text>
            </Pressable>

            <Pressable>
              <Text className="leading-normal text-primary">Terms of Service</Text>
            </Pressable>
            <Pressable>
              <Text className="mx-1 leading-normal text-[#737381]">and</Text>
            </Pressable>
            <Pressable>
              <Text className="leading-normal text-primary">Privacy Policy</Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
