import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { Text } from '@/components/ui/text';
import { Layout } from '@/components/layout';
import { Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { AuthHeader } from '@/components/auth-header';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { InputError } from '@/components/ui/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Image } from 'expo-image';
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

const formSchema = z.object({
  fullname: z.string().min(1, 'Fullname is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
  email: z.email('Invalid email address').min(1, 'Email is required.'),
  skill: z.string().min(1, 'Skill is required.'),
  password: z.string().min(1, 'Password is required.'),
});

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

export default function Screen() {
  const { login } = useAuthStore();

  const [checked, setChecked] = React.useState(false);

  function onCheckedChange(checked: boolean) {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked(checked);
  }

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 24,
    right: 24,
  };

  const form = useForm({
    defaultValues: {
      fullname: '',
      phone: '',
      email: '',
      password: '',
      skill: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      router.navigate({
        pathname: '/verify-email',
        params: {
          email: value.email,
          phone: value.phone,
        },
      });
    },
  });

  return (
    <Layout useBackground>
      <View className="flex-1 gap-6">
        <View className="flex gap-2">
          <AuthHeader title="Get Started" />
        </View>

        <View className="flex gap-4">
          <form.Field name="fullname">
            {(field) => (
              <View>
                <Label nativeID="fullname">
                  Full name{' '}
                  <Text className="text-sm text-[#FE6A00]">(As it appears on your ID)</Text>
                </Label>
                <Input
                  id="fullname"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your name"
                  hasError={!field.state.meta.isValid}
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <form.Field name="phone">
            {(field) => (
              <View>
                <Label nativeID="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your phone number"
                  hasError={!field.state.meta.isValid}
                  keyboardType="phone-pad"
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <View>
                <Label nativeID="email">Email</Label>
                <Input
                  id="email"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your email"
                  hasError={!field.state.meta.isValid}
                  keyboardType="email-address"
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>

          <form.Field name="skill">
            {(field) => (
              <View>
                <Label nativeID="skill">Select skill</Label>
                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue id="skill" placeholder="Select Skill" />
                  </SelectTrigger>
                  <SelectContent
                    insets={contentInsets}
                    className="mt-2 w-full bg-white"
                    style={{ maxHeight: 300 }}>
                    <NativeSelectScrollView className="h-full">
                      <SelectGroup>
                        <SelectLabel>Skills </SelectLabel>
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

          <form.Field name="password">
            {(field) => (
              <View>
                <Label nativeID="password">Password</Label>
                <Input
                  id="password"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your password"
                  secureTextEntry
                  hasError={!field.state.meta.isValid}
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
    </Layout>
  );
}
