import { Platform, Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import React, { useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TriggerRef } from '@rn-primitives/select';
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
import { Button } from '../ui/button';
import { X } from 'lucide-react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { router } from 'expo-router';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import * as ImagePicker from 'expo-image-picker';
import { LoadingState } from '../loading-state';
import { NIGERIAN_STATES } from '@/store/data';
import { DateInput } from '../ui/date-input';
import { formatSizeToMB } from '@/app/verify/step-2';
import { emojiRegex } from '@/lib/utils';

const formSchema = z.object({
  // Required: Category IDs for skills/services
  categoryIds: z.array(z.string()).min(1, 'Select at least 1 category'),

  // Required: Years of experience
  yearsOfExperience: z
    .string()
    .min(1, 'Years of experience is required')
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1 && num <= 50;
    }, 'Years of experience must be between 1 and 50'),

  // Optional: Professional license number
  professionalLicenseNumber: z
    .string()
    .refine((val) => !emojiRegex.test(val), 'License number cannot contain emojis.'),

  // Optional: License issue state
  licenseIssueState: z.string().optional(),

  // Optional: License issue date (ISO format)
  licenseIssueDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CertificationDetails() {
  const { data: profile, isLoading, refetch } = useQuery(api.getCurrentArtisanProfile());
  const categories = useQuery(api.getAllCategories());
  const { mutate, isPending } = useMutation(api.updateArtisan());

  const [certifications, setCertifications] = React.useState<
    {
      uri: string;
      mimeType: string;
      name: string;
      size: number;
    }[]
  >([]);

  const [previousJobs, setPreviousJobs] = React.useState<
    {
      uri: string;
      mimeType: string;
      name: string;
      size: number;
    }[]
  >([]);

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
      categoryIds: profile?.categories?.map((cat) => cat.id) ?? [],
      yearsOfExperience: profile?.yearsOfExperience?.toString() ?? '',
      professionalLicenseNumber: profile?.professionalLicenseNumber ?? '',
      licenseIssueState: profile?.licenseIssueState ?? '',
      licenseIssueDate: profile?.licenseIssueDate ?? '',
    } as FormValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      // transform form values to update dto
      const payload: Partial<FormValues> & {
        certifications?: typeof certifications;
        previousJobs?: typeof previousJobs;
      } = {};

      if (value.categoryIds !== profile?.categories?.map((cat) => cat.id)) {
        payload.categoryIds = value.categoryIds;
      }
      if (value.yearsOfExperience !== profile?.yearsOfExperience?.toString()) {
        payload.yearsOfExperience = value.yearsOfExperience;
      }
      if (value.professionalLicenseNumber !== profile?.professionalLicenseNumber) {
        payload.professionalLicenseNumber = value.professionalLicenseNumber;
      }
      if (value.licenseIssueState !== profile?.licenseIssueState) {
        payload.licenseIssueState = value.licenseIssueState;
      }
      if (value.licenseIssueDate !== profile?.licenseIssueDate) {
        payload.licenseIssueDate = value.licenseIssueDate;
      }

      if (certifications.length > 0) {
        payload.certifications = certifications;
      }

      if (previousJobs.length > 0) {
        payload.previousJobs = previousJobs;
      }

      // @ts-ignore
      mutate(payload, {
        onSuccess: () => {
          refetch();
          showSuccessMessage('Profile updated successfully.');
          router.back();
        },
        onError: (err) => {
          showErrorMessage(err.message);
        },
      });
    },
  });

  useEffect(() => {
    if (profile) {
      form.setFieldValue('categoryIds', profile.categories?.map((cat) => cat.id) ?? []);
      form.setFieldValue('yearsOfExperience', profile.yearsOfExperience?.toString() ?? '');
      form.setFieldValue('professionalLicenseNumber', profile.professionalLicenseNumber ?? '');
      form.setFieldValue('licenseIssueState', profile?.licenseIssueState ?? '');
      form.setFieldValue('licenseIssueDate', profile.licenseIssueDate ?? '');
    }
  }, [profile]);

  const hasChanges = useMemo(() => {
    if (!profile) return false;

    const currentValues = form.state.values;

    const isCategoryChanged =
      JSON.stringify(currentValues.categoryIds.sort()) !==
      JSON.stringify(profile.categories?.map((cat) => cat.id)?.sort() ?? []);

    const isExpChanged =
      currentValues.yearsOfExperience !== (profile.yearsOfExperience?.toString() ?? '');

    const isLicenseChanged =
      currentValues.professionalLicenseNumber !== (profile.professionalLicenseNumber ?? '');

    const isStateChanged = currentValues.licenseIssueState !== (profile?.licenseIssueState ?? '');

    const isDateChanged = currentValues.licenseIssueDate !== (profile.licenseIssueDate ?? '');

    const hasNewCerts = certifications.length > 0;
    const hasNewJobs = previousJobs.length > 0;

    return (
      isCategoryChanged ||
      isExpChanged ||
      isLicenseChanged ||
      // isStateChanged ||
      isDateChanged ||
      hasNewCerts ||
      hasNewJobs
    );
  }, [form.state.values, profile, certifications, previousJobs]);

  const pickDocument = async () => {
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
        setCertifications((prev) => [
          ...prev,
          {
            mimeType: asset.mimeType || '',
            name: asset.fileName || '',
            uri: asset.uri,
            size: asset.fileSize || 0,
          },
        ]);
      }
    }
  };

  const pickImagesVideos = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.type === 'image' || asset.type === 'video') {
        setPreviousJobs((prev) => [
          ...prev,
          {
            mimeType: asset.mimeType || '',
            name: asset.fileName || '',
            uri: asset.uri,
            size: asset.fileSize || 0,
          },
        ]);
      }
    }
  };

  return (
    <View className="flex-1 gap-6">
      {isLoading ? (
        <LoadingState />
      ) : (
        <View className="flex-1 gap-4 bg-white">
          <View className="flex gap-4">
            {categories.data && (
              <form.Field name="categoryIds">
                {(field) => (
                  <View>
                    <Label nativeID="skill">Select skill</Label>

                    <Select>
                      <SelectTrigger ref={ref} className="w-full bg-white">
                        <SelectValue
                          id="skill"
                          placeholder={
                            field.state.value.length > 0
                              ? `${field.state.value.length} selected`
                              : 'Select Skill'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        insets={contentInsets}
                        className="mt-2 w-full bg-white"
                        style={{ maxHeight: 300 }}>
                        <NativeSelectScrollView className="h-full">
                          <SelectGroup>
                            <SelectLabel>Skills</SelectLabel>
                            {categories.data?.map((cat) => (
                              <SelectItem
                                onPress={() => {
                                  if (!field.state.value.includes(cat.id)) {
                                    field.handleChange((prev) => [cat.id]);
                                  } else {
                                    field.handleChange((prev) =>
                                      prev.filter((id) => id !== cat.id)
                                    );
                                  }
                                }}
                                key={cat.id}
                                label={cat.name}
                                value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </NativeSelectScrollView>
                      </SelectContent>
                    </Select>

                    {!field.state.meta.isValid ? (
                      <InputError errors={field.state.meta.errors} />
                    ) : null}

                    <View className="mt-1 flex flex-row flex-wrap gap-2">
                      {field.state.value?.map(
                        (item) =>
                          item && (
                            <View
                              key={item}
                              className="flex flex-row items-center gap-2 rounded-sm border px-2 py-1">
                              <Text className="text-xs leading-none">
                                {categories.data?.find((i) => i.id === item)?.name}
                              </Text>

                              <Pressable
                                onPress={() => {
                                  field.handleChange((prev) => prev.filter((i) => i !== item));
                                }}>
                                <X size={16} color={'#B3031E'} />
                              </Pressable>
                            </View>
                          )
                      )}
                    </View>
                  </View>
                )}
              </form.Field>
            )}

            <form.Field name="yearsOfExperience">
              {(field) => (
                <View>
                  <Label nativeID="exp">Years of experience</Label>
                  <Input
                    className="bg-white"
                    id="exp"
                    value={String(field.state.value)}
                    onChangeText={field.handleChange}
                    placeholder="Enter your years of experience."
                    keyboardType="number-pad"
                    hasError={!field.state.meta.isValid}
                  />
                  {!field.state.meta.isValid ? (
                    <InputError errors={field.state.meta.errors} />
                  ) : null}
                </View>
              )}
            </form.Field>

            <form.Field name="professionalLicenseNumber">
              {(field) => (
                <View>
                  <Label nativeID="license">Professional license number</Label>
                  <Input
                    className="bg-white"
                    id="license"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    placeholder="Enter your professional license number."
                    hasError={!field.state.meta.isValid}
                  />
                  {!field.state.meta.isValid ? (
                    <InputError errors={field.state.meta.errors} />
                  ) : null}
                </View>
              )}
            </form.Field>

            <form.Field name="licenseIssueState">
              {(field) => (
                <View>
                  <Label nativeID="state">Issuing state</Label>

                  <Select
                    defaultValue={{
                      label: field.state.value || '',
                      value: field.state.value || '',
                    }}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue id="state" placeholder={field.state.value || 'Select State'} />
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

                  {!field.state.meta.isValid ? (
                    <InputError errors={field.state.meta.errors} />
                  ) : null}
                </View>
              )}
            </form.Field>

            <form.Field name="licenseIssueDate">
              {(field) => (
                <View>
                  <Label nativeID="date">Issue date</Label>

                  <DateInput
                    label={
                      field.state.value
                        ? new Date(field.state.value).toDateString()
                        : 'Enter Issue date'
                    }
                    onSelect={(date) => {
                      field.handleChange(date.toISOString());
                    }}
                    allowFutureDates={false}
                  />

                  {!field.state.meta.isValid ? (
                    <InputError errors={field.state.meta.errors} />
                  ) : null}
                </View>
              )}
            </form.Field>

            <View>
              <Label nativeID="certs">Upload certifications</Label>

              <Text className="text-sm text-[#737381]">
                Upload valid documents that show you are a professional in your field.
              </Text>

              {/* Existing Certifications from Profile */}
              {profile?.certificationUrls && profile.certificationUrls.length > 0 && (
                <View className="my-2 flex gap-2">
                  <Text className="text-xs font-semibold text-[#3E1A00]">Existing:</Text>
                  {profile.certificationUrls.map((doc: any, index: number) => (
                    <View
                      key={`existing-${index}`}
                      className="flex flex-row items-center gap-2 rounded-[8px] bg-[#F5F5F5] p-[10px]">
                      <View className="flex flex-1 flex-row items-center gap-6">
                        <Image
                          source={require('@/assets/icons/image.svg')}
                          style={{ width: 24, height: 24 }}
                          contentFit="contain"
                        />
                        <View className="flex flex-1 flex-row items-center gap-2">
                          <Text className="flex-1 text-xs text-[#3E1A00]" numberOfLines={1}>
                            {doc.name || `Certification ${index + 1}`}
                          </Text>
                          <View className="h-1 w-1 rounded-full bg-[#767676]" />
                          <Pressable
                            onPress={() =>
                              SheetManager.show('image-preview-sheet', {
                                payload: {
                                  imgSource: doc,
                                },
                              })
                            }>
                            <Text className="text-xs text-[#FE6A00]">Preview</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View className="my-2 flex gap-2">
                {/* selected documents */}
                {certifications?.map((doc, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center gap-2 rounded-[8px] bg-[#FFF4EA] p-[10px]">
                    <View className="flex flex-1 flex-row items-center gap-6">
                      <Image
                        source={require('@/assets/icons/image.svg')}
                        style={{ width: 24, height: 24 }}
                        contentFit="contain"
                      />

                      <View className="flex flex-1 flex-row items-center gap-2">
                        <Text className="flex-1 text-xs text-[#3E1A00]" numberOfLines={1}>
                          {doc.name}
                        </Text>

                        <View className="h-1 w-1 rounded-full bg-[#767676]" />

                        <Pressable
                          onPress={() =>
                            SheetManager.show('image-preview-sheet', {
                              payload: {
                                imgSource: doc.uri,
                              },
                            })
                          }>
                          <Text className="text-xs text-[#FE6A00]">Preview</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View className="flex flex-row items-center gap-6">
                      <Text className="text-xs text-[#A44400]">{formatSizeToMB(doc.size)}</Text>

                      <Pressable
                        onPress={() => {
                          setCertifications((prev) => prev.filter((_, i) => i !== index));
                        }}>
                        <X color={'#737381'} size={16} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={pickDocument}
                className="mt-1 flex aspect-[327/100] w-full items-center justify-center rounded-[8px] border-2 border-[#E9E9EB]">
                <Image
                  source={require('@/assets/icons/document.svg')}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                />

                <Text className="text-center text-sm text-[#FE6A00]">Add Documents</Text>
                <Text className="text-center text-xs text-[#B4B4BC]">Upload certificate </Text>
                <Text className="text-center text-xs text-[#B4B4BC]">
                  Accepted formats: JPG, JPEG, PNG.
                </Text>
              </Pressable>
            </View>

            <View>
              <Label nativeID="prev">Upload previous jobs</Label>

              <Text className="text-sm text-[#737381]">A minimum of 4</Text>

              {/* Existing Previous Jobs from Profile */}
              {profile?.previousJobUrls && profile.previousJobUrls.length > 0 && (
                <View className="my-2 flex gap-2">
                  <Text className="text-xs font-semibold text-[#3E1A00]">Existing:</Text>
                  {profile.previousJobUrls.map((doc: any, index: number) => (
                    <View
                      key={`existing-job-${index}`}
                      className="flex flex-row items-center gap-2 rounded-[8px] bg-[#F5F5F5] p-[10px]">
                      <View className="flex flex-1 flex-row items-center gap-6">
                        <Image
                          source={require('@/assets/icons/image.svg')}
                          style={{ width: 24, height: 24 }}
                          contentFit="contain"
                        />
                        <View className="flex flex-1 flex-row items-center gap-2">
                          <Text className="flex-1 text-xs text-[#3E1A00]" numberOfLines={1}>
                            {doc.name || `Job ${index + 1}`}
                          </Text>
                          <View className="h-1 w-1 rounded-full bg-[#767676]" />
                          <Pressable
                            onPress={() =>
                              SheetManager.show('image-preview-sheet', {
                                payload: {
                                  imgSource: doc,
                                },
                              })
                            }>
                            <Text className="text-xs text-[#FE6A00]">Preview</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View className="my-2 flex gap-2">
                {/* selected photos */}
                {previousJobs?.map((doc, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center gap-2 rounded-[8px] bg-[#FFF4EA] p-[10px]">
                    <View className="flex flex-1 flex-row items-center gap-6">
                      <Image
                        source={require('@/assets/icons/image.svg')}
                        style={{ width: 24, height: 24 }}
                        contentFit="contain"
                      />

                      <View className="flex flex-1 flex-row items-center gap-2">
                        <Text className="flex-1 text-xs text-[#3E1A00]" numberOfLines={1}>
                          {doc.name}
                        </Text>

                        <View className="h-1 w-1 rounded-full bg-[#767676]" />

                        <Pressable
                          onPress={() =>
                            SheetManager.show('image-preview-sheet', {
                              payload: {
                                imgSource: doc.uri,
                              },
                            })
                          }>
                          <Text className="text-xs text-[#FE6A00]">Preview</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View className="flex flex-row items-center gap-6">
                      <Text className="text-xs text-[#A44400]">{formatSizeToMB(doc.size)}</Text>

                      <Pressable
                        onPress={() => {
                          setPreviousJobs((prev) => prev.filter((_, i) => i !== index));
                        }}>
                        <X color={'#737381'} size={16} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={pickImagesVideos}
                className="mt-1 flex aspect-[327/100] w-full items-center justify-center rounded-[8px] border-2 border-[#E9E9EB]">
                <Image
                  source={require('@/assets/icons/camera-primary.svg')}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                />

                <Text className="text-center text-sm text-[#FE6A00]">Add Photos/Videos</Text>
                <Text className="text-center text-xs text-[#B4B4BC]">Upload previous jobs </Text>
                <Text className="text-center text-xs text-[#B4B4BC]">
                  Accepted formats: JPG, JPEG, PNG.
                </Text>
              </Pressable>
            </View>

            <Button onPress={form.handleSubmit} isLoading={isPending} disabled={isPending}>
              Save changes
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
