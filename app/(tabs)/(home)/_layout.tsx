import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="notification"
        options={{
          headerShown: false,
          title: 'Notification',
        }}
      />
      <Stack.Screen
        name="requests"
        options={{
          headerShown: false,
          title: 'Requests',
        }}
      />
      <Stack.Screen
        name="request"
        options={{
          headerShown: false,
          title: 'Requests',
        }}
      />
    </Stack>
  );
}
