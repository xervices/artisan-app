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
import { useAuthStore } from '@/store/auth-store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { NIGERIAN_STATES } from '@/store/data';

const formSchema = z.object({
  avatarUrl: z.string(),
  avatarMimeType: z.string(),
  state: z.string(),
  city: z.string(),
  country: z.string(),
  address: z.string(),
  postalCode: z.string(),
  bio: z.string(),
});

export function PersonalDetails() {
  const { user } = useAuthStore();

  const { mutate, isPending } = useMutation(api.updateProfile());
  const { refetch } = useQuery(api.getCurrentUser());

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 24,
    right: 24,
  };

  const initialValues = React.useMemo(
    () => ({
      avatarUrl: user?.profile?.avatarUrl || '',
      avatarMimeType: '',
      city: user?.profile?.city || '',
      state: user?.profile?.state || '',
      country: user?.profile?.country || '',
      address: user?.profile?.address || '',
      postalCode: user?.profile?.postalCode || '',
      bio: user?.profile?.bio || '',
    }),
    [user]
  );

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // @ts-ignore
      mutate(value, {
        onSuccess: () => {
          showSuccessMessage('Profile updated successfully');
          refetch();
          router.back();
        },
        onError: (err) => {
          showErrorMessage(err.message);
        },
      });
    },
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.type === 'image') {
        form.setFieldValue('avatarUrl', asset.uri);
        form.setFieldValue('avatarMimeType', asset.mimeType || '');
      }
    }
  };

  return (
    <View className="flex-1 gap-6">
      <form.Subscribe
        selector={(state) => ({
          url: state.values.avatarUrl,
        })}
        children={({ url }) => {
          return (
            <View className="flex w-full items-center justify-center">
              <Pressable
                onPress={pickImage}
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
        <View>
          <Label nativeID="fullname">Full name</Label>
          <Input
            className="bg-white"
            id="fullname"
            value={user?.profile?.fullName}
            placeholder="Enter your name"
            editable={false}
          />
        </View>

        <View>
          <Label nativeID="email">Email</Label>
          <Input
            className="bg-white"
            id="email"
            value={user?.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            editable={false}
          />
        </View>

        <View>
          <Label nativeID="nin">NIN Number</Label>
          <Input
            className="bg-white"
            id="nin"
            value={'12323456778'}
            placeholder="Enter your NIN"
            keyboardType="number-pad"
            editable={false}
          />
        </View>
      </View>

      <View>
        <Text className="font-cabinet-medium text-xs uppercase text-[#737381]">Editable</Text>

        <View className="flex gap-4">
          <form.Field name="bio">
            {(field) => (
              <View>
                <Label nativeID="bio">Bio</Label>
                <Textarea
                  className="bg-white"
                  id="bio"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your Bio"
                  hasError={!field.state.meta.isValid}
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

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

                        <SelectItem
                          onPress={() => {
                            field.handleChange('Nigeria');
                          }}
                          label="Nigeria"
                          value="Nigeria">
                          Nigeria
                        </SelectItem>
                      </SelectGroup>
                    </NativeSelectScrollView>
                  </SelectContent>
                </Select>

                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <form.Field name="state">
            {(field) => (
              <View>
                <Label nativeID="state">State</Label>

                <Select defaultValue={{ label: field.state.value, value: field.state.value }}>
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

                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => ({
              state: state.values.state,
            })}
            children={({ state }) => {
              const LGA_DATA = NIGERIAN_STATES.find((i) => i.state === state);

              if (!LGA_DATA) {
                return null;
              }

              return (
                <form.Field name="city">
                  {(field) => (
                    <View>
                      <Label nativeID="city">City</Label>

                      <Select defaultValue={{ label: field.state.value, value: field.state.value }}>
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
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>
        </View>
      </View>

      <form.Subscribe
        selector={(state) => ({
          values: state.values,
        })}>
        {({ values }) => {
          const hasChanges = JSON.stringify(values) !== JSON.stringify(initialValues);

          return (
            <Button
              onPress={form.handleSubmit}
              isLoading={isPending}
              disabled={isPending || !hasChanges}>
              Save Changes
            </Button>
          );
        }}
      </form.Subscribe>
    </View>
  );
}
