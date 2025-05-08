import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { ChatLayout } from '../../../components/ChatLayout';

export default function DynamicChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { dark, colors } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: id === 'ai' ? 'Hello! How can I assist you today?' : 'Welcome to the community chat!',
      sender: id === 'ai' ? 'ai' : 'system',
      timestamp: new Date().toISOString(),
    }
  ]);

  const isAI = id === 'ai';
  const isCommunity = id === 'community';
  const userRole = 'student'; // This should come from your auth context

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // For community chat, only allow non-students to post
    if (isCommunity && userRole === 'student') {
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    if (isAI) {
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: 'I understand your message. How else can I help you?',
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, dark && styles.darkHeader]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={dark ? 'rgba(255, 255, 255, 0.9)' : '#000'} 
          />
        </TouchableOpacity>
        <Text style={[styles.title, dark && styles.darkText]}>
          {isAI ? 'Centex AI Assistant' : 'Community Chat'}
        </Text>
      </View>

      <ChatLayout
        messages={messages}
        isAI={isAI}
        dark={dark}
      />

      <View style={[styles.inputContainer, dark && styles.darkInputContainer]}>
        {(!isCommunity || userRole !== 'student') && (
          <>
            <TextInput
              style={[styles.input, dark && styles.darkInput]}
              value={message}
              onChangeText={setMessage}
              placeholder={isCommunity && userRole === 'student' ? 'Students cannot post in community chat' : 'Type a message...'}
              placeholderTextColor={dark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
              editable={!isCommunity || userRole !== 'student'}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !message.trim() && styles.disabledButton]} 
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={message.trim() ? '#2A67FF' : (dark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)')} 
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  darkText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  darkInputContainer: {
    backgroundColor: '#1E1E1E',
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#2A2A2A',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 