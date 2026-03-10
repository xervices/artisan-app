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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingState } from '@/components/loading-state';
import { NIGERIAN_STATES } from '@/store/data';
import { DateInput } from '@/components/ui/date-input';
import * as ImagePicker from 'expo-image-picker';
import { SheetManager } from 'react-native-actions-sheet';
import { showErrorMessage } from '@/api/helpers';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { useAuthStore } from '@/store/auth-store';
import { emojiRegex } from '@/lib/utils';

/**
 * Formats file size in bytes to megabytes with 1 decimal place
 * @param bytes - File size in bytes
 * @returns Formatted size string (e.g., "2.5 MB")
 */
export function formatSizeToMB(bytes: number | undefined | null): string {
  if (!bytes || bytes === 0) {
    return '0.0 MB';
  }

  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(1)} MB`;
}

const formSchema = z.object({
  // Required: Category IDs for skills/services
  categoryIds: z.array(z.string()).min(1, 'Select at least 1 category'),

  // Required: Identification type
  // identificationType: z.string().min(1, 'Identification type is required.'),

  // Required: Identification number
  // identificationNumber: z
  //   .string()
  //   .min(1, 'Identification number is required')
  //   .min(11, 'Identification number must be at least 11 characters')
  //   .max(11, 'Identification number must be 11 characters'),

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
  licenseIssueState: z.string(),

  // Optional: License issue date (ISO format)
  licenseIssueDate: z.string(),
});

// const idTypes = [
//   // { value: 'BVN', label: 'BVN' },
//   { value: 'NIN', label: 'NIN' },
// ];

export default function Screen() {
  const { user } = useAuthStore();

  const categories = useQuery(api.getAllCategories());

  const queryClient = useQueryClient();

  // const verifyNIN = useMutation(api.verifyNIN());

  const { mutate, isPending } = useMutation(api.onboardArtisan());

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
      categoryIds: [''],
      // identificationType: 'NIN',
      // identificationNumber: '',
      yearsOfExperience: '',
      professionalLicenseNumber: '',
      licenseIssueState: '',
      licenseIssueDate: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // if (!verifyNIN.data?.success || !verifyNameMatch()) {
      //   showErrorMessage('Please validate your NIN before proceeding!.');
      //   return;
      // }

      const data = { ...value, certifications, previousJobs };

      // @ts-ignore
      mutate(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: api.getCurrentArtisanProfile().queryKey,
          });
          router.replace('/verification');
        },
        onError: (err) => {
          showErrorMessage(err.message);
        },
      });
    },
  });

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

  // const verifyNameMatch = () => {
  //   const ninFirstName = verifyNIN.data?.data?.firstName;
  //   const ninLastName = verifyNIN.data?.data?.lastName;

  //   if (ninFirstName && ninLastName) {
  //     if (
  //       user?.profile?.fullName.includes(ninFirstName) &&
  //       user?.profile.fullName.includes(ninLastName)
  //     ) {
  //       return true;
  //     }
  //   }

  //   return false;
  // };

  return (
    <View className="flex-1">
      {categories.isLoading ? (
        <LoadingState />
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-4 bg-white">
            <Text className="text-center font-cabinet-bold text-xs text-[#B4B4BC]">
              Step 2 of 2
            </Text>

            <Text className="text-center text-sm text-[#737381]">
              Connect with thousands of potential customers
            </Text>

            <View className="flex gap-4">
              {categories.data && (
                <form.Field name="categoryIds">
                  {(field) => (
                    <View>
                      <Label nativeID="skill">Select skill</Label>

                      <Select>
                        <SelectTrigger ref={ref} className="w-full bg-white">
                          <SelectValue id="skill" placeholder="Select Skill" />
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
                                      field.handleChange((prev) => [...prev, cat.id]);
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

              {/* <form.Field name="identificationType">
                {(field) => (
                  <View>
                    <Label nativeID="idType">Select Identification</Label>

                    <Select defaultValue={{ label: 'NIN', value: 'NIN' }}>
                      <SelectTrigger ref={ref} className="w-full bg-white">
                        <SelectValue id="idType" placeholder="Select Identification" />
                      </SelectTrigger>
                      <SelectContent
                        insets={contentInsets}
                        className="mt-2 w-full bg-white"
                        style={{ maxHeight: 300 }}>
                        <NativeSelectScrollView className="h-full">
                          <SelectGroup>
                            <SelectLabel>ID Type</SelectLabel>
                            {idTypes.map((id) => (
                              <SelectItem
                                onPress={() => {
                                  field.handleChange(id.value);
                                }}
                                key={id.value}
                                label={id.label}
                                value={id.value}>
                                {id.label}
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
              </form.Field> */}

              {/* <form.Field name="identificationNumber">
                {(field) => (
                  <View>
                    <Label nativeID="idNumber">Enter Identification Number</Label>
                    <Input
                      className="bg-white"
                      id="idNumber"
                      value={String(field.state.value)}
                      onChangeText={field.handleChange}
                      placeholder="Enter your ID number."
                      keyboardType="number-pad"
                      hasError={!field.state.meta.isValid}
                      editable={!verifyNIN.isPending}
                    />
                    {!field.state.meta.isValid ? (
                      <InputError errors={field.state.meta.errors} />
                    ) : null}

                    <form.Subscribe
                      selector={(state) => ({
                        idNumber: state.values.identificationNumber,
                      })}
                      children={({ idNumber }) => {
                        React.useEffect(() => {
                          if (idNumber && idNumber.length === 11) {
                            verifyNIN.mutate({ nin: idNumber });
                          }
                        }, [idNumber]);

                        return (
                          <View className="flex flex-row gap-2">
                            {verifyNIN.isSuccess &&
                              verifyNIN.data.success === true &&
                              verifyNameMatch() && (
                                <Text className="text-xs text-[#2BC84E]">Match with name</Text>
                              )}

                            {verifyNIN.isSuccess &&
                              verifyNIN.data.success === true &&
                              !verifyNameMatch() && (
                                <Text className="text-xs text-[#B3031E]">
                                  Name associated with NIN does not match registered name.
                                </Text>
                              )}

                            {verifyNIN.isSuccess && verifyNIN.data.success === false && (
                              <Text className="text-xs text-[#B3031E]">
                                {verifyNIN.data.message}
                              </Text>
                            )}

                            {verifyNIN.isPending && (
                              <>
                                <LoadingIndicator size={14} />

                                <Text className="text-xs">Validating your NIN</Text>
                              </>
                            )}

                            {verifyNIN.isError && (
                              <Text className="text-xs text-[#B3031E]">
                                {verifyNIN.error.message}
                              </Text>
                            )}
                          </View>
                        );
                      }}
                    />
                  </View>
                )}
              </form.Field> */}

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
                      placeholder="Enter your Professional license number."
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
                    <Label nativeID="state">Issue state</Label>

                    <Select>
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
                      label="Enter Issue date"
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
                  Upload valid documents that shows you are a professional in your field.
                </Text>

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
                </Pressable>
              </View>

              <View>
                <Label nativeID="prev">Upload previous jobs</Label>

                <Text className="text-sm text-[#737381]">A minimum of 4</Text>

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
                </Pressable>
              </View>

              <Button onPress={form.handleSubmit} isLoading={isPending} disabled={isPending}>
                Continue
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
