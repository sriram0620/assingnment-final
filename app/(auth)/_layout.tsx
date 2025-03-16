import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="register" />
      <Stack.Screen name="step-1-client-details" />
      <Stack.Screen name="assess-risk" /> // Changed from step-2-assess-risk
      <Stack.Screen name="step-3-goals" />
      <Stack.Screen name="step-4-plan" />
      <Stack.Screen name="step-5-invest" />
    </Stack>
  );
}