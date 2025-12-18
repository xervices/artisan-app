import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SheetManager } from 'react-native-actions-sheet';

const formSchema = z.object({
  fullname: z.string().min(1, 'Fullname is required.'),
  email: z.email('Invalid email address').min(1, 'Email is required.'),
  message: z.string().min(1, 'Message is required.'),
});

export default function Screen() {
  const form = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      message: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      SheetManager.show('success-sheet', {
        payload: {
          subtitle:
            'Your complaint has been sent successfully. You will receive confirmation via email shortly.',
          title: 'Complaint sent successfully',
          useCheckImage: true,
        },
      });
    },
  });

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Support" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <Text className="text-center text-sm text-[#737381]">
          Have a concern or problem, how can we help you?
        </Text>

        <View className="flex gap-4">
          <form.Field name="fullname">
            {(field) => (
              <View>
                <Label nativeID="fullname">Full name</Label>
                <Input
                  className="bg-white"
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

          <form.Field name="email">
            {(field) => (
              <View>
                <Label nativeID="email">Email</Label>
                <Input
                  className="bg-white"
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

          <form.Field name="message">
            {(field) => (
              <View>
                <Label nativeID="message">Message</Label>
                <Textarea
                  className="bg-white"
                  id="message"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Enter your message"
                  hasError={!field.state.meta.isValid}
                />
                {!field.state.meta.isValid ? <InputError errors={field.state.meta.errors} /> : null}
              </View>
            )}
          </form.Field>
        </View>

        <Button className="mt-auto" onPress={form.handleSubmit}>
          Submit
        </Button>
      </View>
    </Layout>
  );
}
