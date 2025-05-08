import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme, Platform } from 'react-native';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to determine if we're in a web environment
const isWeb = Platform.OS === 'web';

// Storage helpers that work in both web and native environments
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      // For native, we'll use a try-catch to handle the case where AsyncStorage isn't available
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.warn('AsyncStorage not available, using in-memory storage');
        return null;
      }
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.warn('AsyncStorage not available, using in-memory storage');
      }
    }
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceTheme = useDeviceColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Load saved theme preference
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await storage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        setIsDarkMode(deviceTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setIsDarkMode(deviceTheme === 'dark');
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await storage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 