import { AuthHeader } from '@/components/auth-header';
import { OfferCard } from '@/components/home/offers';
import { Layout } from '@/components/layout';
import { View } from 'react-native';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Requests" />
        </View>
      }>
      <View className="flex-1 gap-6">
        {new Array(6).fill(0).map((_, index) => (
          <OfferCard key={index} />
        ))}
      </View>
    </Layout>
  );
}
