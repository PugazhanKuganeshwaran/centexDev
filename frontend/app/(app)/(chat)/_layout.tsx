import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ChatLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#F5F6FA',
        },
        animation: 'fade',
        animationDuration: 200,
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="[id]"
        options={{
          animation: 'fade',
          contentStyle: {
            backgroundColor: isDarkMode ? '#121212' : '#F5F6FA',
          },
        }}
      />
    </Stack>
  );
} 