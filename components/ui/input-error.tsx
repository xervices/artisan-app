import { View } from 'react-native';
import React from 'react';
import { Text } from './text';

interface InputErrorProps {
  errors?: Array<{ message?: string } | undefined>;
}

export function InputError({ errors }: InputErrorProps) {
  if (!errors?.length) {
    return null;
  }

  const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

  if (uniqueErrors?.length == 1) {
    return <Text className="text-error font-cabinet text-xs">{uniqueErrors[0]?.message}</Text>;
  }

  return (
    <View className="flex gap-0">
      {uniqueErrors.map(
        (error, index) =>
          error?.message && (
            <Text className="text-error font-cabinet text-xs" key={index}>
              {error.message}
            </Text>
          )
      )}
    </View>
  );
}
