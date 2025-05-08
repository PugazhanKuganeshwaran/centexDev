import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Animated,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    type: 'user' | 'ai' | 'system';
  };
  timestamp: string;
  attachment?: {
    type: 'document' | 'image';
    name: string;
    url: string;
  };
}

const MessageBubble = ({ message, isDarkMode }: { message: Message; isDarkMode: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  };

  const isUser = message.sender.type === 'user';
  const isAI = message.sender.type === 'ai';

  return (
    <Animated.View
      style={[
        styles.messageBubbleContainer,
        isUser ? styles.userMessageContainer : styles.otherMessageContainer,
        {
          transform: [
            { scale: Animated.multiply(scaleAnim, pressAnim) },
          ],
          opacity: scaleAnim,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
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
          {!isUser && !isAI && (
            <Text style={[styles.senderName, isDarkMode && styles.darkText]}>
              {message.sender.name}
            </Text>
          )}
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.otherMessageText,
            isDarkMode && !isUser && styles.darkOtherMessageText,
          ]}>
            {message.text}
          </Text>
          {message.attachment && (
            <View style={styles.attachmentContainer}>
              <Ionicons 
                name={message.attachment.type === 'document' ? 'document' : 'image'} 
                size={20} 
                color={isUser ? '#fff' : '#2A67FF'} 
              />
              <Text style={[
                styles.attachmentName,
                isUser ? styles.userMessageText : styles.otherMessageText,
              ]}>
                {message.attachment.name}
              </Text>
            </View>
          )}
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.otherTimestamp,
          ]}>
            {message.timestamp}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const userRole = 'student';

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardVisible(false);
    });

    // Set initial animation values
    scaleAnim.setValue(0.8);
    opacityAnim.setValue(0);
    translateYAnim.setValue(50);

    // Start animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      })
    ]).start();

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      // Reset animation values on unmount
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      translateYAnim.setValue(50);
    };
  }, []);

  const getChatInfo = () => {
    switch (id) {
      case 'ai':
        return {
          type: 'ai',
          name: 'Centex AI Assistant',
          canSendMessage: true,
          canSendFiles: false,
          welcomeMessage: "Hello! I'm your AI learning assistant. How can I help you today?"
        };
      case 'centex-community':
        return {
          type: 'community',
          name: 'Centex Community',
          canSendMessage: userRole !== 'student',
          canSendFiles: userRole !== 'student',
          welcomeMessage: "Welcome to the Centex community! Only teachers and administrators can post messages here."
        };
      case 'school-community':
        return {
          type: 'community',
          name: 'School Community',
          canSendMessage: userRole !== 'student',
          canSendFiles: userRole !== 'student',
          welcomeMessage: "Welcome to the school community! Important announcements will be posted here."
        };
      case 'class-group':
        return {
          type: 'group',
          name: 'Class 10A Group',
          canSendMessage: true,
          canSendFiles: true,
          welcomeMessage: "Welcome to your class group! Share and discuss with your classmates."
        };
      default:
        return {
          type: 'group',
          name: 'Chat',
          canSendMessage: true,
          canSendFiles: true,
          welcomeMessage: "Welcome to the chat!"
        };
    }
  };

  const chatInfo = getChatInfo();

  React.useEffect(() => {
    setMessages([
      {
        id: '1',
        text: chatInfo.welcomeMessage,
        sender: {
          id: 'system',
          name: 'System',
          type: 'system'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 20,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      })
    ]).start(() => {
      setTimeout(() => router.back(), 50);
    });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !chatInfo.canSendMessage) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: {
        id: 'user',
        name: 'You',
        type: 'user'
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    scrollViewRef.current?.scrollToEnd({ animated: true });

    if (chatInfo.type === 'ai') {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I understand your question. Let me help you with that...",
          sender: {
            id: 'ai',
            name: 'AI Assistant',
            type: 'ai'
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 1000);
    }
  };

  const handleAttachment = async () => {
    if (!chatInfo.canSendFiles) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: 'Sent an attachment',
          sender: {
            id: 'user',
            name: 'You',
            type: 'user'
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachment: {
            type: result.mimeType?.startsWith('image/') ? 'image' : 'document',
            name: result.name,
            url: result.uri
          }
        };

        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#F5F6FA' }
      ]}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim }
            ],
            backgroundColor: isDarkMode ? '#121212' : '#F5F6FA'
          }
        ]}
      >
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDarkMode ? '#fff' : '#1A1A1A'} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
            {chatInfo.name}
          </Text>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[
            styles.content,
            isDarkMode && { backgroundColor: '#121212' }
          ]}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={[
              styles.messageList,
              isDarkMode && { backgroundColor: '#121212' }
            ]}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
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
          {chatInfo.canSendMessage ? (
            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              {chatInfo.canSendFiles && (
                <TouchableOpacity 
                  style={styles.attachButton} 
                  onPress={handleAttachment}
                >
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
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={24} 
                  color={message.trim() ? '#2A67FF' : isDarkMode ? '#666' : '#999'} 
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.restrictedContainer, isDarkMode && styles.darkRestrictedContainer]}>
              <Text style={[styles.restrictedText, isDarkMode && styles.darkText]}>
                Only teachers and administrators can send messages in this chat
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  darkText: {
    color: '#fff',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    gap: 16,
  },
  messageBubbleContainer: {
    maxWidth: width * 0.75,
    borderRadius: 16,
    overflow: 'hidden',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#2A67FF',
    borderBottomRightRadius: 4,
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  darkOtherMessage: {
    backgroundColor: '#1E1E1E',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  messageBubble: {
    padding: 12,
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
    color: '#999',
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  attachmentName: {
    marginLeft: 8,
    color: '#2A67FF',
    flex: 1,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#999',
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
  attachButton: {
    padding: 8,
    marginRight: 8,
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
    backgroundColor: '#2A2A2A',
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
  restrictedContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    alignItems: 'center',
  },
  darkRestrictedContainer: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#333',
  },
  restrictedText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
}); 