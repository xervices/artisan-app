import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Keyboard, Platform, Pressable, ScrollView, View } from 'react-native';
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
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/auth-store';
import { NIGERIAN_STATES } from '@/store/data';
import { COUNTRIES } from '@/lib/countries';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const formSchema = z.object({
  avatarUrl: z.string(),
  avatarMimeType: z.string(),
  state: z.string(),
  city: z.string(),
  country: z.string(),
  address: z.string(),
  postalCode: z.string(),
});

export default function Screen() {
  const { user } = useAuthStore();

  const { mutate, isPending } = useMutation(api.updateProfile());
  const { refetch } = useQuery(api.getCurrentUser());
  const [isPickingImage, setIsPickingImage] = React.useState(false);
  const isPickingImageRef = React.useRef(false);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 24,
    right: 24,
  };

  const form = useForm({
    defaultValues: {
      avatarUrl: '',
      avatarMimeType: '',
      city: '',
      state: '',
      country: '',
      address: '',
      postalCode: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // @ts-ignore
      mutate(value, {
        onSuccess: () => {
          showSuccessMessage('Profile updated successfully');
          refetch();
          router.navigate('/verify/step-2');
        },
        onError: (err) => {
          showErrorMessage(err.message);
        },
      });
    },
  });

  const pickImage = async () => {
    if (isPickingImageRef.current) {
      return;
    }

    try {
      isPickingImageRef.current = true;
      setIsPickingImage(true);
      Keyboard.dismiss();

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showErrorMessage('Photo library permission is required to choose an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset || asset.type !== 'image') {
        showErrorMessage('Please select a valid image.');
        return;
      }

      const isUnsupported =
        asset.mimeType?.includes('heic') ||
        asset.mimeType?.includes('heif') ||
        asset.mimeType?.includes('avif') ||
        asset.uri.toLowerCase().endsWith('.heic') ||
        asset.uri.toLowerCase().endsWith('.heif') ||
        asset.uri.toLowerCase().endsWith('.avif');

      if (isUnsupported) {
        showErrorMessage('The selected file format is not supported.');
        return;
      }

      form.setFieldValue('avatarUrl', asset.uri);
      form.setFieldValue('avatarMimeType', asset.mimeType || 'image/jpeg');
    } catch {
      showErrorMessage('Unable to open your photo library. Please try again.');
    } finally {
      isPickingImageRef.current = false;
      setIsPickingImage(false);
    }
  };

  return (
    <View className="flex-1">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4 bg-white">
          <Text className="text-center font-cabinet-bold text-xs text-[#B4B4BC]">Step 1 of 2</Text>

          <Text className="text-center text-sm text-[#737381]">
            Connect with thousands of potential customers
          </Text>

          <form.Subscribe
            selector={(state) => ({
              url: state.values.avatarUrl,
            })}
            children={({ url }) => {
              return (
                <View className="flex w-full items-center justify-center">
                  <Pressable
                    onPress={pickImage}
                    disabled={isPickingImage}
                    className="relative h-20 w-20 overflow-hidden rounded-full">
                    <Avatar className="h-full w-full" alt="User's Avatar">
                      <AvatarImage source={{ uri: url }} />
                      <AvatarFallback className="bg-primary">
                        <Text className="font-cabinet-bold text-4xl leading-none">
                          {user?.profile?.fullName?.substring(0, 2) || ''}
                        </Text>
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
              );
            }}
          />

          <View className="flex gap-4">
            <form.Field name="country">
              {(field) => (
                <View>
                  <Label nativeID="country">Country</Label>

                  <Select defaultValue={{ label: field.state.value, value: field.state.value }}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue id="country" placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent
                      insets={contentInsets}
                      className="mt-2 w-full bg-white"
                      style={{ maxHeight: 300 }}>
                      <NativeSelectScrollView className="h-full">
                        <SelectGroup>
                          <SelectLabel>Country</SelectLabel>

                          {COUNTRIES.map((country) => (
                            <SelectItem
                              key={country.code}
                              onPress={() => {
                                field.handleChange(country.name);
                                // Reset location fields that depend on the country
                                form.setFieldValue('state', '');
                                form.setFieldValue('city', '');
                                form.setFieldValue('postalCode', '');
                              }}
                              label={country.name}
                              value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </NativeSelectScrollView>
                    </SelectContent>
                  </Select>

                  {!field.state.meta.isValid ? (
                    <InputError errors={field.state.meta.errors} />
                  ) : null}
                </View>
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => ({ country: state.values.country })}
              children={({ country }) => {
                const isNigeria = country === 'Nigeria';

                return (
                  <form.Field name="state">
                    {(field) => (
                      <View>
                        <Label nativeID="state">State</Label>

                        {isNigeria ? (
                          <Select
                            defaultValue={{ label: field.state.value, value: field.state.value }}>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue id="state" placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent
                              insets={contentInsets}
                              className="mt-2 w-full bg-white"
                              style={{ maxHeight: 300 }}>
                              <NativeSelectScrollView className="h-full">
                                <SelectGroup>
                                  <SelectLabel>State</SelectLabel>
                                  {NIGERIAN_STATES.map((state) => (
                                    <SelectItem
                                      onPress={() => {
                                        field.handleChange(state.state);
                                        // Reset city/postal when the state changes
                                        form.setFieldValue('city', '');
                                        form.setFieldValue('postalCode', '');
                                      }}
                                      key={state.state}
                                      label={state.state}
                                      value={state.state}>
                                      {state.state}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </NativeSelectScrollView>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            className="bg-white"
                            id="state"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            placeholder="Enter your state / region"
                            hasError={!field.state.meta.isValid}
                          />
                        )}

                        {!field.state.meta.isValid ? (
                          <InputError errors={field.state.meta.errors} />
                        ) : null}
                      </View>
                    )}
                  </form.Field>
                );
              }}
            />

            <form.Subscribe
              selector={(state) => ({
                country: state.values.country,
                state: state.values.state,
              })}
              children={({ country, state }) => {
                const isNigeria = country === 'Nigeria';
                const LGA_DATA = NIGERIAN_STATES.find((i) => i.state === state);

                // For Nigeria, only show the City dropdown once a state is picked
                if (isNigeria && !LGA_DATA) {
                  return null;
                }

                return (
                  <form.Field name="city">
                    {(field) => (
                      <View>
                        <Label nativeID="city">City</Label>

                        {isNigeria ? (
                          <Select>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue id="city" placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent
                              insets={contentInsets}
                              className="mt-2 w-full bg-white"
                              style={{ maxHeight: 300 }}>
                              <NativeSelectScrollView className="h-full">
                                <SelectGroup>
                                  <SelectLabel>City</SelectLabel>
                                  {LGA_DATA?.lgas?.map((lga) => (
                                    <SelectItem
                                      onPress={() => {
                                        field.handleChange(lga.name);
                                        form.setFieldValue('postalCode', lga.postal_code);
                                      }}
                                      key={lga.name}
                                      label={lga.name}
                                      value={lga.name}>
                                      {lga.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </NativeSelectScrollView>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            className="bg-white"
                            id="city"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            placeholder="Enter your city"
                            hasError={!field.state.meta.isValid}
                          />
                        )}

                        {!field.state.meta.isValid ? (
                          <InputError errors={field.state.meta.errors} />
                        ) : null}
                      </View>
                    )}
                  </form.Field>
                );
              }}
            />

            <form.Field name="address">
              {(field) => (
                <View>
                  <Label nativeID="address">Address</Label>
                  <Textarea
                    className="bg-white"
                    id="address"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    placeholder="Enter your current address"
                    hasError={!field.state.meta.isValid}
                  />
                  {!field.state.meta.isValid ? (
                    <InputError errors={field.state.meta.errors} />
                  ) : null}
                </View>
              )}
            </form.Field>

            <Button onPress={form.handleSubmit} isLoading={isPending} disabled={isPending}>
              Continue
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
