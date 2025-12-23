import { AuthHeader } from '@/components/auth-header';
import TransactionCard from '@/components/earnings/transaction-card';
import { Layout } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="flex gap-4 pb-4">
          <AuthHeader
            title="Transaction history"
            rightComponent={
              <Pressable onPress={() => SheetManager.show('filter-sheet')}>
                <Image
                  source={require('@/assets/icons/filter.svg')}
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                />
              </Pressable>
            }
          />
          <View className="flex flex-row items-center justify-between">
            <View className="flex h-9 items-center justify-center rounded-[8px] border border-[#FFB884] bg-[#FFF4EA] px-3">
              <Text className="text-xs leading-none text-[#FE6A00]">This week</Text>
            </View>

            <Text className="text-xs text-[#B4B4BC]">Show results (6)</Text>
          </View>
        </View>
      }>
      <View className="flex-1 gap-4">
        <TransactionCard />
        <TransactionCard type="withdrawal" />
        <TransactionCard type="dispute" />
        <TransactionCard />
        <TransactionCard type="withdrawal" />
        <TransactionCard type="dispute" />
      </View>
    </Layout>
  );
}
