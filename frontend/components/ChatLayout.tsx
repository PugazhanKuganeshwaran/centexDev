import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'other';
  status: 'sent' | 'delivered' | 'read';
}

interface ChatLayoutProps {
  isDarkMode: boolean;
  messages: Message[];
  onSendMessage: (text: string) => void;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onVideoCall?: () => void;
  onVoiceCall?: () => void;
  onAttach?: () => void;
  style?: ViewStyle;
  showActions?: boolean;
}

const MessageBubble = ({ message, isDarkMode }: { message: Message; isDarkMode: boolean }) => {
  const isUser = message.sender === 'user';

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return 'checkmark';
      case 'delivered':
        return 'checkmark-done';
      case 'read':
        return 'checkmark-done';
      default:
        return 'checkmark';
    }
  };

  return (
    <View style={[
      styles.messageBubbleContainer,
      isUser ? styles.userMessageContainer : styles.otherMessageContainer,
    ]}>
      <LinearGradient
        colors={isUser 
          ? (isDarkMode ? ['#1A237E', '#0D47A1'] : ['#2A67FF', '#2196F3'])
          : (isDarkMode ? ['#333333', '#262626'] : ['#FFFFFF', '#F5F5F5'])
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.messageBubble,
          isUser ? styles.userMessage : styles.otherMessage,
          isDarkMode && !isUser && styles.darkOtherMessage,
        ]}
      >
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.otherMessageText,
          isDarkMode && !isUser && styles.darkOtherMessageText,
        ]}>
          {message.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.otherTimestamp,
            isDarkMode && !isUser && styles.darkOtherTimestamp,
          ]}>
            {message.timestamp}
          </Text>
          {isUser && (
            <Ionicons
              name={getStatusIcon()}
              size={16}
              color={message.status === 'read' ? '#4CAF50' : '#FFFFFF'}
              style={styles.statusIcon}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default function ChatLayout({
  isDarkMode,
  messages,
  onSendMessage,
  title,
  subtitle,
  onBack,
  onVideoCall,
  onVoiceCall,
  onAttach,
  style,
  showActions = true,
}: ChatLayoutProps) {
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer, style]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <View style={styles.headerContent}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDarkMode ? '#fff' : '#1A1A1A'} 
              />
            </TouchableOpacity>
          )}
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.headerSubtitle, isDarkMode && styles.darkSubText]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {showActions && (
          <View style={styles.headerActions}>
            {onVideoCall && (
              <TouchableOpacity style={styles.headerButton} onPress={onVideoCall}>
                <Ionicons 
                  name="videocam" 
                  size={24} 
                  color={isDarkMode ? '#fff' : '#1A1A1A'} 
                />
              </TouchableOpacity>
            )}
            {onVoiceCall && (
              <TouchableOpacity style={styles.headerButton} onPress={onVoiceCall}>
                <Ionicons 
                  name="call" 
                  size={24} 
                  color={isDarkMode ? '#fff' : '#1A1A1A'} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(msg => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isDarkMode={isDarkMode}
            />
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
          {onAttach && (
            <TouchableOpacity style={styles.attachButton} onPress={onAttach}>
              <Ionicons 
                name="attach" 
                size={24} 
                color={isDarkMode ? '#fff' : '#1A1A1A'} 
              />
            </TouchableOpacity>
          )}
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Type a message..."
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
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
              color={message.trim() ? '#fff' : isDarkMode ? '#666' : '#999'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#4CAF50',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 8,
  },
  messageBubbleContainer: {
    maxWidth: width * 0.75,
    marginVertical: 4,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    minWidth: 80,
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    borderBottomLeftRadius: 4,
  },
  darkOtherMessage: {
    borderColor: '#333',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#1A1A1A',
  },
  darkOtherMessageText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#666',
  },
  darkOtherTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  darkInputContainer: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#333',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 16,
    color: '#1A1A1A',
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A67FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#E8E8E8',
  },
}); 