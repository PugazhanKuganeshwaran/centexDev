import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import NotificationPopup from '@/components/NotificationPopup';
import ProfilePopup from '@/components/ProfilePopup';

export default function AppLayout() {
  const { isDarkMode } = useTheme();
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  return (
    <>
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
          name="(tabs)" 
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen 
          name="(chat)" 
          options={{
            presentation: 'card',
            animation: 'fade',
            contentStyle: {
              backgroundColor: isDarkMode ? '#121212' : '#F5F6FA',
            },
          }}
        />
      </Stack>

      <NotificationPopup
        visible={isNotificationVisible}
        onClose={() => setIsNotificationVisible(false)}
      />
      
      <ProfilePopup
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />
    </>
  );
} 