// The root component, or App.tsx file in other React projects

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from '@/context/UserContext'
import { useAuth } from '@/context/UserContext';
import  Login  from '@/components/login'

function AuthGate() {
  const { user } = useAuth()

  if (!user) {
    return <Login />
  } 

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)"/>
    </Stack>
  )
}
export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <UserProvider>
        <AuthGate />
        <StatusBar style="auto" />
      </UserProvider>
    </>
  );
}
