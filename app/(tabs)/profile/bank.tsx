import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { Image } from 'expo-image';
import { ChevronRight, Plus, Trash, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingState } from '@/components/loading-state';
import EmptyState from '@/components/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { showErrorMessage, showSuccessMessage } from '@/api/helpers';
import { BankCard } from '@/components/profile/bank-card';

export default function Screen() {
  const { isLoading, isRefetching, refetch, data } = useQuery(api.getBankAccounts());

  return (
    <Layout
      useBackground
      isRefreshing={isRefetching}
      onRefresh={refetch}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Bank Account" />
        </View>
      }>
      {isLoading ? (
        <LoadingState title="Loading your banks..." />
      ) : (
        <View className="flex-1 gap-6">
          <Button onPress={() => router.navigate('/profile/add-bank')}>
            <View className="flex flex-row items-center gap-2">
              <Plus color={'#FFFFFF'} />

              <Text className="font-cabinet-extrabold text-[#F4F4F5]">Add Bank Account</Text>
            </View>
          </Button>

          <View className="flex gap-2">
            <Text className="font-cabinet-bold text-sm text-[#737381]">Saved Banks</Text>

            {data && data?.length > 0 ? (
              <View className="flex gap-4">
                {data?.map((account) => (
                  <BankCard
                    key={account.id}
                    {...account}
                    onDeleteSuccessFn={refetch}
                    selectedBankId={account?.isDefault ? account.id : ''}
                  />
                ))}
              </View>
            ) : (
              <EmptyState
                title="No bank accounts"
                subtitle="You've not added any bank accounts yet."
              />
            )}
          </View>
        </View>
      )}
    </Layout>
  );
}
