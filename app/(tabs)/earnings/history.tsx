import { api, TransactionsPeriodTypes } from '@/api';
import { AuthHeader } from '@/components/auth-header';
import TransactionCard from '@/components/earnings/transaction-card';
import EmptyState from '@/components/empty-state';
import { Layout } from '@/components/layout';
import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const filterPeriods: { value: TransactionsPeriodTypes; label: string }[] = [
  {
    value: 'previous_month',
    label: 'Previous month',
  },
  {
    value: 'this_year',
    label: 'This year',
  },
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'this_month',
    label: 'This month',
  },
  {
    value: 'this_week',
    label: 'This week',
  },
];

export default function Screen() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const [period, setSelectedPeriod] = useState<TransactionsPeriodTypes>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const { isLoading, refetch, isRefetching, data } = useQuery(
    api.getTransactionHistory({ period, endDate, startDate })
  );

  const handleStartDateConfirm = (date: Date) => {
    const dateString = date.toISOString();

    setSelectedPeriod(undefined);
    setStartDate(dateString);

    setStartDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    const dateString = date.toISOString();

    setSelectedPeriod(undefined);
    setEndDate(dateString);

    setEndDatePickerVisibility(false);
  };

  return (
    <Layout
      isRefreshing={isRefetching}
      onRefresh={refetch}
      useBackground
      stickyHeader={
        <View className="flex gap-4 pb-4">
          <AuthHeader
            title="Transaction history"
            rightComponent={
              <Pressable onPress={() => bottomSheetRef.current?.present()}>
                <Image
                  source={require('@/assets/icons/filter.svg')}
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                />
              </Pressable>
            }
          />
          {period || startDate || endDate ? (
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-1 flex-row">
                <View className="flex h-9 items-center justify-center rounded-[8px] border border-[#FFB884] bg-[#FFF4EA] px-3">
                  <Text className="text-xs leading-none text-[#FE6A00]">
                    {period
                      ? filterPeriods?.find((i) => i.value === period)?.label
                      : startDate && endDate
                        ? `${new Date(startDate).toDateString()} - ${new Date(endDate).toDateString()}`
                        : null}
                  </Text>
                </View>
              </View>

              <Text className="text-xs text-[#B4B4BC]">Shown results ({data?.length})</Text>
            </View>
          ) : null}
        </View>
      }>
      {isLoading ? (
        <LoadingState title="Loading your transactions..." />
      ) : data && data?.length === 0 ? (
        <EmptyState title="No Transactions" />
      ) : (
        <View className="flex-1 gap-4">
          {data?.map((transaction) => (
            <TransactionCard
              key={transaction?.id}
              type={transaction?.type}
              amount={transaction?.amount}
              date={transaction?.createdAt}
              charge={transaction?.jobDetails?.xervicesCharge}
              customer={transaction?.jobDetails?.customerName}
              category={transaction?.jobDetails?.categoryName}
              jobId={transaction?.jobDetails?.jobId}
            />
          ))}
        </View>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
        )}
        backgroundStyle={{
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
        handleIndicatorStyle={{
          width: 38,
          height: 6,
          backgroundColor: '#FFF4EA',
        }}>
        <BottomSheetScrollView>
          <View className="flex gap-4 p-6 pt-0">
            <View className="flex w-full flex-row items-center justify-between border-b border-b-[#E9E9EB] py-4">
              <Pressable
                onPress={() => {
                  bottomSheetRef.current?.close();
                }}
                className="flex flex-row items-center gap-4">
                <ArrowLeft size={24} color={'#B4B4BC'} />

                <Text className="font-cabinet-medium text-sm text-[#4E4E56]">Filters</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSelectedPeriod(undefined);
                  setStartDate(undefined);
                  setEndDate(undefined);
                  bottomSheetRef.current?.close();
                }}>
                <Text className="font-cabinet-extrabold text-sm text-[#FE6A00]">Clear</Text>
              </Pressable>
            </View>

            <View className="flex w-full border-b border-b-[#E9E9EB] pb-4">
              <Text className="font-cabinet-bold text-[#4E4E56]">Period</Text>

              <View className="flex flex-row flex-wrap gap-4">
                {filterPeriods.map((i) => (
                  <Pressable
                    key={i.value}
                    onPress={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                      setSelectedPeriod(i.value);
                    }}
                    className={`flex h-9 items-center justify-center rounded-[8px] border ${period === i.value ? 'border-[#FFB884] bg-[#FFF4EA]' : 'border-[#E9E9EB] bg-white'} px-3`}>
                    <Text
                      className={`font-cabinet-medium text-xs leading-none ${period === i.value ? 'text-[#FE6A00]' : 'text-[#4E4E56]'}`}>
                      {i.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex w-full border-b border-b-[#E9E9EB] pb-4">
              <Text className="font-cabinet-bold text-[#4E4E56]">Select period</Text>

              <View className="flex flex-row flex-wrap items-center gap-2">
                <Pressable
                  onPress={() => setStartDatePickerVisibility(true)}
                  className={`flex h-9 flex-row items-center justify-center gap-2 rounded-[8px] border border-[#E9E9EB] bg-white px-3`}>
                  <Image
                    source={require('@/assets/icons/calendar.svg')}
                    style={{ width: 16, height: 16 }}
                    contentFit="contain"
                  />

                  <Text className={`font-cabinet-medium text-xs leading-none text-[#4E4E56]`}>
                    {startDate ? new Date(startDate).toDateString() : 'Start Date'}
                  </Text>
                </Pressable>

                <View className="h-0.5 w-3 bg-[#4E4E56]" />

                <Pressable
                  onPress={() => setEndDatePickerVisibility(true)}
                  className={`flex h-9 flex-row items-center justify-center gap-2 rounded-[8px] border border-[#E9E9EB] bg-white px-3`}>
                  <Image
                    source={require('@/assets/icons/calendar.svg')}
                    style={{ width: 16, height: 16 }}
                    contentFit="contain"
                  />

                  <Text className={`font-cabinet-medium text-xs leading-none text-[#4E4E56]`}>
                    {endDate ? new Date(endDate).toDateString() : 'End Date'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Button onPress={() => bottomSheetRef?.current?.close()}>Show results </Button>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setStartDatePickerVisibility(false)}
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setEndDatePickerVisibility(false)}
      />
    </Layout>
  );
}
