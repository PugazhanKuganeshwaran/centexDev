import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function Text({ style, ...props }: TextProps) {
  const { isDarkMode } = useTheme();

  return (
    <RNText
      style={[
        styles.text,
        isDarkMode && styles.darkText,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#1A1A1A',
  },
  darkText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
}); 