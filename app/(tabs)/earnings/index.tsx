import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import * as Application from 'expo-application';
import { Layout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router } from 'expo-router';
import { ArrowUpRight, BadgeCheck, ChevronDown } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LegendList } from '@legendapp/list';
import { BalanceCard } from '@/components/earnings/balance-card';
import TransactionCard from '@/components/earnings/transaction-card';
import { Button } from '@/components/ui/button';

export default function Screen() {
  const [value, setValue] = React.useState('earnings');

  return (
    <Layout useBackground scrollable={false}>
      <View className="flex-1">
        <Tabs value={value} onValueChange={setValue} className="w-full">
          <TabsList className="h-[52px] w-full border-none p-0">
            <TabsTrigger
              className="h-full w-1/2 rounded-none border-none"
              value="earnings"
              style={{
                borderColor: undefined,
                borderWidth: 0,
                backgroundColor: value === 'earnings' ? '#1B1B1E' : '#F4F4F5',
              }}>
              <Text
                className="font-cabinet-bold text-sm"
                style={{
                  color: value === 'earnings' ? '#FFF4EA' : '#522200',
                }}>
                Earnings
              </Text>
            </TabsTrigger>
            <TabsTrigger
              className="h-full w-1/2 rounded-none border-none"
              value="promotions"
              style={{
                borderColor: undefined,
                borderWidth: 0,
                backgroundColor: value === 'promotions' ? '#1B1B1E' : '#F4F4F5',
              }}>
              <Text
                className="font-cabinet-bold text-sm"
                style={{
                  color: value === 'promotions' ? '#FFF4EA' : '#522200',
                }}>
                Promotions
              </Text>
            </TabsTrigger>
          </TabsList>

          {/* Earnings content */}
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <TabsContent value="earnings" className="flex gap-4 pb-16 pt-4">
              <BalanceCard />

              <View className="flex flex-row items-center justify-between">
                <Text className="font-cabinet-medium text-xs uppercase text-[#737381]">
                  Transaction History
                </Text>

                <Pressable
                  onPress={() => router.navigate('/earnings/history')}
                  className="mt-1 flex flex-row items-center gap-1">
                  <Text className="font-cabinet-bold text-xs leading-none text-[#737381]">
                    Show all
                  </Text>

                  <ChevronDown size={12} />
                </Pressable>
              </View>

              <TransactionCard />
              <TransactionCard type="withdrawal" />
              <TransactionCard type="dispute" />
              <TransactionCard />
              <TransactionCard type="withdrawal" />
              <TransactionCard type="dispute" />
            </TabsContent>
          </ScrollView>

          {/* Promotions content */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
            showsVerticalScrollIndicator={false}>
            <TabsContent value="promotions" className="flex gap-4 pt-4">
              <View className="flex gap-1">
                <Text className="font-cabinet-medium text-xs text-[#737381]">YOUR EARNINGS</Text>

                <Text className="font-cabinet-bold text-2xl text-[#737381]">₦5,200</Text>

                <Button className="mt-2">Withdraw</Button>
              </View>

              <View className="flex w-full flex-row gap-4">
                <View className="flex h-16 flex-1 items-center justify-center rounded-[8px] border border-[#DFDFE1]">
                  <Text className="text-center font-cabinet-bold text-xl text-[#737381]">4</Text>
                  <Text className="text-center text-xs text-[#B4B4BC]">Referrals</Text>
                </View>

                <View className="flex h-16 flex-1 items-center justify-center rounded-[8px] border border-[#DFDFE1]">
                  <Text className="text-center font-cabinet-bold text-xl text-[#737381]">
                    ₦1000
                  </Text>
                  <Text className="text-center text-xs text-[#B4B4BC]">Per referral</Text>
                </View>
              </View>

              <View className="flex gap-2">
                <Text className="text-xs uppercase text-[#737381]">Your Referral Code</Text>

                <View className="flex h-32 w-full items-center justify-center gap-2 rounded-[8px] border border-[#DFDFE1] bg-[#F4F4F5]">
                  <Text className="text-center text-xs text-[#737381]">
                    Share this code with friends
                  </Text>

                  <Text className="text-center font-cabinet-bold text-xl text-[#737381]">
                    ALEX2025
                  </Text>

                  <Button className="w-48" size={'sm'}>
                    Copy Code
                  </Button>
                </View>
              </View>

              <Text className="text-center text-xs text-[#737381]">
                Or share your referral link
              </Text>

              <View className="flex h-[52px] w-full flex-row items-center rounded-full bg-[#F4F4F5] px-2 pl-4">
                <Text
                  className="flex-1 font-cabinet-bold text-sm text-[#737381]"
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  xervices.app/ref/ALEX2025
                </Text>

                <Button className="w-16" size={'sm'}>
                  Copy
                </Button>
              </View>

              <View className="flex gap-2">
                <Text className="text-xs uppercase text-[#737381]">My Discounts</Text>

                <View className="flex h-28 w-full items-center justify-center gap-2 rounded-[8px] bg-[#1B1B1E]">
                  <View className="flex h-5 items-center justify-center rounded-full bg-[#737381] px-2">
                    <Text className="text-xs font-medium leading-none text-[#FFF4EA]">
                      ACTIVE DISCOUNT
                    </Text>
                  </View>

                  <Text className="text-center font-cabinet-bold text-2xl text-[#FFF4EA]">
                    5% OFF
                  </Text>

                  <Text className="text-center text-xs text-[#FFF4EA]">
                    Your first-time customer discount, valid for 30 days
                  </Text>
                </View>
              </View>
            </TabsContent>
          </ScrollView>
        </Tabs>
      </View>
    </Layout>
  );
}
