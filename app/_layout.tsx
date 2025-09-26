// The root component, or App.tsx file in other React projects

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from '@/context/UserContext'
import { useAuth } from '@/context/UserContext';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
function AuthGate() {
/*   const { user, loading } = useAuth()

  if (loading) {
    return null
  }  

  return (
    <Stack screenOptions={{ headerShown: false }}>
     {!user ? (
        <Stack.Screen name="login" />
      ): (
      <Stack.Screen name="(tabs)"/> 
      )} 
    </Stack>
  ) */
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');  // redirect to login if not logged in
      } else {
        router.replace('/');       // redirect to tabs root if logged in
      }
    }
  }, [user, loading]);

  if (loading) return null; // or splash screen

  return <Stack screenOptions={{ headerShown: false }} />;
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
