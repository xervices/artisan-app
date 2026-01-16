import { api } from '@/api';
import { AuthHeader } from '@/components/auth-header';
import { OfferCard } from '@/components/home/offers';
import { Layout } from '@/components/layout';
import { LoadingState } from '@/components/loading-state';
import { useSocketIO } from '@/hooks/use-socket-io';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Screen() {
  const { joinRoom, isJoiningRoom, isConnected, on } = useSocketIO({ autoConnect: true });

  const artisanProfile = useQuery(api.getCurrentArtisanProfile());

  useEffect(() => {
    const artisanCategories = artisanProfile?.data?.categories;

    if (isConnected && artisanCategories && artisanCategories?.length > 1) {
      artisanCategories?.map((cat) =>
        on(`service_request:${cat.id}`, (data) => {
          console.log(data);
        })
      );
    }
  }, [isConnected, artisanProfile]);

  return (
    <Layout
      useBackground
      isRefreshing={artisanProfile?.isRefetching}
      onRefresh={artisanProfile?.refetch}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Requests" />
        </View>
      }>
      {artisanProfile?.isLoading ? (
        <LoadingState title="Loading data..." />
      ) : (
        <View className="flex-1 gap-6">
          {new Array(6).fill(0).map((_, index) => (
            <OfferCard key={index} />
          ))}
        </View>
      )}
    </Layout>
  );
}
