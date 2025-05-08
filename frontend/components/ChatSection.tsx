import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ChatLayout from './ChatLayout';
import type { Message } from './ChatLayout';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatSectionProps {
  chatId: string;
  chatType: 'ai' | 'community' | 'zone' | 'school' | 'class' | 'group';
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export default function ChatSection({ chatId, chatType, title, subtitle, onBack }: ChatSectionProps) {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: chatType === 'ai' 
        ? 'Hello! I\'m your Centex AI Assistant. I\'m here to help you with your studies. How can I assist you today?'
        : `Welcome to ${title}! 👋`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'other',
      status: 'read'
    }
  ]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);

    if (chatType === 'ai') {
      // Simulate AI thinking
      setTimeout(async () => {
        // TODO: Replace with actual AI API call
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I understand your question. Let me help you with that...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'other',
          status: 'read'
        };

        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const getGradientColors = () => {
    if (chatType === 'ai') {
      return isDarkMode
        ? ['#1A237E', '#0D47A1', '#1A1A1A'] as const
        : ['#E3F2FD', '#BBDEFB', '#FFFFFF'] as const;
    }
    if (chatType === 'community' || chatType === 'zone') {
      return isDarkMode
        ? ['#1B5E20', '#2E7D32', '#1A1A1A'] as const
        : ['#E8F5E9', '#C8E6C9', '#FFFFFF'] as const;
    }
    if (chatType === 'school') {
      return isDarkMode
        ? ['#0D47A1', '#1976D2', '#1A1A1A'] as const
        : ['#E3F2FD', '#BBDEFB', '#FFFFFF'] as const;
    }
    if (chatType === 'class') {
      return isDarkMode
        ? ['#E65100', '#F57C00', '#1A1A1A'] as const
        : ['#FFF3E0', '#FFE0B2', '#FFFFFF'] as const;
    }
    // Default for groups
    return isDarkMode
      ? ['#4A148C', '#6A1B9A', '#1A1A1A'] as const
      : ['#F3E5F5', '#E1BEE7', '#FFFFFF'] as const;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradientColors()}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      />
      <ChatLayout
        isDarkMode={isDarkMode}
        messages={messages}
        onSendMessage={handleSendMessage}
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        showActions={chatType !== 'ai'}
        style={styles.chat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chat: {
    backgroundColor: 'transparent',
  },
}); 