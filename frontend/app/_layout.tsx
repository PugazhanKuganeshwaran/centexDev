import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

// This is a simple auth check - you should implement proper auth state management
const useProtectedRoute = () => {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated
      router.replace('/signin');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the home page if authenticated
      router.replace('/(app)/(tabs)/home');
    }
  }, [segments, isAuthenticated]);
};

function RootLayoutNav() {
  useProtectedRoute();
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
