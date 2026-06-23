import * as React from 'react';
import { View } from 'react-native';

import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';
import { HtmlContent } from '@/components/html-content';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { LoadingState } from '../loading-state';

export function CancellationPolicyScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery(api.getCancellationPolicy());

  return (
    <Layout
      useBackground
      isRefreshing={isRefetching}
      onRefresh={refetch}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title={'Cancellation Policy'} />
        </View>
      }>
      {isLoading ? (
        <LoadingState title="Loading Cancellation policy..." />
      ) : (
        <View className="flex-1">
          <HtmlContent html={data?.data?.content} />
        </View>
      )}
    </Layout>
  );
}
