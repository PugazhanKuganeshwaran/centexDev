import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | string;
  timestamp: string;
}

const MessageBubble: React.FC<{
  message: Message;
  isDarkMode: boolean;
}> = ({ message, isDarkMode }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  return (
    <View style={[
      styles.messageBubbleContainer,
      isUser ? styles.userMessageContainer : styles.otherMessageContainer
    ]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          {isAI ? (
            <View style={[styles.aiAvatar, isDarkMode && styles.darkAiAvatar]}>
              <Ionicons name="logo-electron" size={20} color="#2A67FF" />
            </View>
          ) : (
            <Image
              source={{ uri: 'https://i.pravatar.cc/100' }}
              style={styles.avatar}
            />
          )}
        </View>
      )}
      <View style={[
        styles.messageBubble,
        isUser ? styles.userMessage : styles.otherMessage,
        isDarkMode && (isUser ? styles.darkUserMessage : styles.darkOtherMessage),
        isAI && styles.aiMessage
      ]}>
        {!isUser && !isAI && (
          <Text style={[styles.senderName, isDarkMode && styles.darkText]}>
            {message.sender}
          </Text>
        )}
        <Text style={[
          styles.messageText,
          isDarkMode && styles.darkText,
          isUser && styles.userMessageText
        ]}>
          {message.text}
        </Text>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [message, setMessage] = useState('');

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hello! How can I help you with your studies today?',
      sender: 'ai',
      timestamp: '9:30 AM',
    },
    {
      id: '2',
      text: 'I need help understanding quantum mechanics',
      sender: 'user',
      timestamp: '9:31 AM',
    },
    {
      id: '3',
      text: 'Quantum mechanics is a fundamental theory in physics that describes the behavior of matter and energy at the atomic and subatomic scales. What specific aspect would you like to learn about?',
      sender: 'ai',
      timestamp: '9:31 AM',
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <ScrollView
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isDarkMode={isDarkMode}
          />
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Type a message..."
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !message.trim() && styles.disabledSendButton
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={message.trim() ? '#2A67FF' : (isDarkMode ? '#666' : '#999')}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: width * 0.8,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(42, 103, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkAiAvatar: {
    backgroundColor: 'rgba(42, 103, 255, 0.2)',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: width * 0.7,
  },
  userMessage: {
    backgroundColor: '#2A67FF',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  darkUserMessage: {
    backgroundColor: '#2A67FF',
  },
  darkOtherMessage: {
    backgroundColor: '#1E1E1E',
  },
  aiMessage: {
    backgroundColor: 'rgba(42, 103, 255, 0.1)',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  darkText: {
    color: '#fff',
  },
  userMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  darkInputContainer: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    color: '#1A1A1A',
  },
  darkInput: {
    backgroundColor: '#121212',
    color: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    opacity: 0.5,
  },
}); 