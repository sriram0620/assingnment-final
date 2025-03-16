import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="index2" />
      <Stack.Screen name="investments" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}