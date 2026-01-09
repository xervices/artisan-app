import React from 'react';
import { Pressable } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Text } from './text';

interface DateInputInterface {
  label?: string;
  onSelect?: (date: Date) => void;
}

export function DateInput({ label = 'Enter date', onSelect }: DateInputInterface) {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    onSelect?.(date);
    hideDatePicker();
  };

  return (
    <>
      <Pressable
        onPress={showDatePicker}
        className="flex h-[56px] w-full flex-row items-center rounded-sm border border-[#DFDFE1] px-4">
        {selectedDate ? (
          <Text className="text-[#1B1B1E]">{selectedDate.toDateString()}</Text>
        ) : (
          <Text className="text-[#B4B4BC]">{label}</Text>
        )}
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
}
