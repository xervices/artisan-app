import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from '@tanstack/react-form';
import { Info, X } from 'lucide-react-native';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingState } from '@/components/loading-state';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { SheetManager } from 'react-native-actions-sheet';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import { useCameraPermissions } from 'expo-camera';
import { UploadedMedia } from '@/components/uploaded-media';
import { TriggerRef } from '@rn-primitives/dropdown-menu';
import { tokenStorage } from '@/api/token-storage';
import { useAuthStore } from '@/store/auth-store';

const formSchema = z.object({
  categoryIds: z.array(z.string()).min(1, 'Select at least 1 category'),
});

export default function Screen() {
  const { isRefetching, refetch, isLoading, data } = useQuery(api.getAllCategories());

  const { mutate, isPending } = useMutation(api.becomeArtisan());

  const { mutate: refreshAccessToken, isPending: isRefreshingToken } = useMutation(
    api.refreshToken()
  );

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
      categoryIds: [] as string[],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const refreshToken = await tokenStorage.getRefreshToken();

      mutate(value, {
        onSuccess: (res) => {
          showSuccessMessage(res?.message);
          if (refreshToken) {
            refreshAccessToken(
              { refreshToken },
              {
                onSuccess: () => {
                  useAuthStore.getState().setLoginState(true);
                  router.navigate('/verify/step-2');
                },
              }
            );
          }
        },
        onError: (err) => {
          showErrorMessage(err.message);
        },
      });
    },
  });

  return (
    <Layout
      useBackground
      isRefreshing={isRefetching}
      onRefresh={refetch}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Become a Pro" />
        </View>
      }>
      {isLoading ? (
        <LoadingState />
      ) : (
        <View className="flex-1 gap-4">
          <Text className="text-center font-cabinet-bold text-xs text-[#B4B4BC]">
            Want to also offer services?
          </Text>

          <Text className="text-center text-sm text-[#737381]">
            Select the category you want to get started with.
          </Text>

          {data && (
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
                          {data?.map((cat) => (
                            <SelectItem
                              onPress={() => {
                                field.handleChange((prev) =>
                                  prev.includes(cat.id)
                                    ? prev.filter((id) => id !== cat.id)
                                    : [...prev, cat.id]
                                );
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
                              {data?.find((i) => i.id === item)?.name}
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

          <Button
            isLoading={isPending || isRefreshingToken}
            disabled={isPending || isRefreshingToken}
            className="mt-14"
            onPress={form.handleSubmit}>
            Continue
          </Button>
        </View>
      )}
    </Layout>
  );
}
