import * as React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingState } from '../loading-state';

export function TermsScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery(api.getTerms());

  return (
    <Layout
      useBackground
      isRefreshing={isRefetching}
      onRefresh={refetch}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title={'Terms of Service'} />
        </View>
      }>
      {isLoading ? (
        <LoadingState title="Loading Terms of Service..." />
      ) : (
        <View className="flex-1 gap-6">
          <Text className="text-[#737381]">{data?.data?.content}</Text>
        </View>
      )}
    </Layout>
  );
}
