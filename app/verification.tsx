import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight, ShieldCheck, IdCard, ScanFace } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { SheetManager } from 'react-native-actions-sheet';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';

export default function Screen() {
  const { user } = useAuthStore();

  const { refetch, isLoading, isRefetching } = useQuery(api.getArtisanOffers());

  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader
            title="Identity Verification"
            rightComponent={
              <Pressable
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/(tabs)/(home)');
                  }
                }}>
                <Text className="font-cabinet-medium text-sm text-muted-foreground">Skip</Text>
              </Pressable>
            }
          />
        </View>
      }>
      <View className="flex-1">
        <View className="flex-1 items-center justify-center py-8">
          <View className="mb-8 items-center justify-center rounded-full bg-[#0A0A0B]/10 p-6">
            <ShieldCheck size={64} color="#0A0A0B" strokeWidth={1.5} />
          </View>

          <Text className="mb-2 text-center font-cabinet-bold text-2xl text-foreground">
            Let's verify your identity
          </Text>

          <Text className="mb-10 text-center font-cabinet-medium text-base text-muted-foreground">
            To ensure a secure community for everyone, we need to verify your identity.
          </Text>

          <View className="w-full gap-6">
            <View className="flex-row items-start gap-4 rounded-2xl border border-border bg-card p-4">
              <View className="rounded-full bg-[#0A0A0B]/10 p-2.5">
                <IdCard size={24} color="#0A0A0B" />
              </View>
              <View className="flex-1 gap-1">
                <Text className="font-cabinet-bold text-base text-foreground">Government ID</Text>
                <Text className="font-cabinet-medium text-sm text-muted-foreground">
                  Upload a clear photo of your National ID or NIN slip.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4 rounded-2xl border border-border bg-card p-4">
              <View className="rounded-full bg-[#0A0A0B]/10 p-2.5">
                <ScanFace size={24} color="#0A0A0B" />
              </View>
              <View className="flex-1 gap-1">
                <Text className="font-cabinet-bold text-base text-foreground">Liveness Check</Text>
                <Text className="font-cabinet-medium text-sm text-muted-foreground">
                  Take a quick liveness check to prove you're a real person.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Button
            className="w-full"
            isLoading={isLoading || isRefetching}
            disabled={isLoading || isRefetching}
            onPress={() =>
              SheetManager.show('verification-profile-sheet', {
                payload: {
                  metadata: {
                    userId: user?.id,
                  },
                  userData: {
                    email: user?.email,
                  },
                  onSuccess(result) {
                    refetch().finally(() => {
                      if (router.canGoBack()) {
                        router.back();
                      } else {
                        router.replace('/(tabs)/(home)');
                      }
                    });
                  },
                },
              })
            }>
            Start Verification
          </Button>
          <Text className="mt-4 text-center font-cabinet-medium text-xs text-muted-foreground">
            Your data is securely stored and never shared without your consent.
          </Text>
        </View>
      </View>
    </Layout>
  );
}
