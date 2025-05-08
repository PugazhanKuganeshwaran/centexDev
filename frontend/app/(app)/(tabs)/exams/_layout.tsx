import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useRouter } from 'expo-router';

export default function ExamsLayout() {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#F5F6FA'
        },
        animation: 'slide_from_right',
        animationDuration: 200,
        presentation: 'card'
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          animation: 'none'
        }}
      />
      <Stack.Screen 
        name="sheet" 
        options={{
          headerShown: true,
          headerTitle: "Exam",
          headerTitleStyle: {
            color: isDarkMode ? '#fff' : '#1A1A1A',
            fontSize: 18,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8, marginLeft: 8 }}
            >
              <Ionicons 
                name="close" 
                size={24} 
                color={isDarkMode ? '#fff' : '#1A1A1A'} 
              />
            </TouchableOpacity>
          ),
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true
        }}
      />
      <Stack.Screen 
        name="results" 
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
          gestureEnabled: true
        }}
      />
      <Stack.Screen 
        name="review" 
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true
        }}
      />
    </Stack>
  );
} 