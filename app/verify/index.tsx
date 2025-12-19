import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Camera } from 'lucide-react-native';
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
  state: z.string().min(1, 'State is required.'),
  address: z.string().min(1, 'Address is required.'),
  idType: z.string().min(1, 'Identification type is required.'),
  idNumber: z.string().min(1, 'Identification number is required.'),
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

const idTypes = [
  { value: 'BVN', label: 'BVN' },
  { value: 'NIN', label: 'NIN' },
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
      state: '',
      address: '',
      idType: '',
      idNumber: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      router.navigate('/verify/step-2');
    },
  });

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View className="flex-1 gap-4 bg-white">
        <Text className="text-center font-cabinet-bold text-xs text-[#B4B4BC]">Step 1 of 2</Text>

        <Text className="text-center text-sm text-[#737381]">
          Connect with thousands of potential customers
        </Text>

        <View className="flex w-full items-center justify-center">
          <Pressable className="relative h-20 w-20 overflow-hidden rounded-full">
            <Avatar className="h-full w-full" alt="User's Avatar">
              <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
              <AvatarFallback className="bg-primary">
                <Text className="font-cabinet-bold leading-none">ZN</Text>
              </AvatarFallback>
            </Avatar>

            <View className="absolute inset-0 flex h-full w-full items-center justify-center bg-[#1B1B1E]/40">
              <Image
                source={require('@/assets/icons/camera.svg')}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            </View>
          </Pressable>
        </View>

        <View className="flex gap-4">
          <form.Field name="state">
            {(field) => (
              <View>
                <Label nativeID="state">State</Label>

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

          <form.Field name="address">
            {(field) => (
              <View>
                <Label nativeID="address">Address</Label>
                <Input
                  className="bg-white"
                  id="address"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your current address"
                  hasError={!field.state.meta.isValid}
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <form.Field name="idType">
            {(field) => (
              <View>
                <Label nativeID="idType">Select Identification</Label>

                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue id="idType" placeholder="Select ID" />
                  </SelectTrigger>
                  <SelectContent
                    insets={contentInsets}
                    className="mt-2 w-full bg-white"
                    style={{ maxHeight: 300 }}>
                    <NativeSelectScrollView className="h-full">
                      <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
                        {idTypes.map((state) => (
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

          <form.Field name="idNumber">
            {(field) => (
              <View>
                <Label nativeID="idNumber">Enter NIN Number</Label>
                <Input
                  className="bg-white"
                  id="idNumber"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your NIN number"
                  hasError={!field.state.meta.isValid}
                  keyboardType="number-pad"
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

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
