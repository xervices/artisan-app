import { Layout } from '@/components/layout';
import { Header } from '@/components/home/header';
import { View } from 'react-native';
import { Offers } from '@/components/home/offers';
import EnableLocationDialog from '@/components/enable-location-dialog';
import { AvailabilityStatus } from '@/components/home/availability-status';
import { OverviewCard } from '@/components/home/overview-card';
import { Stats } from '@/components/home/stats';
import { VerifyAccount } from '@/components/home/verify-account';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <Header />
        </View>
      }>
      <View className="flex-1 gap-4">
        <EnableLocationDialog />

        <AvailabilityStatus />

        <OverviewCard />

        <Stats />

        <VerifyAccount />

        <Offers />
      </View>
    </Layout>
  );
}
