import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Chat {
  id: string;
  type: 'ai' | 'group';
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface ChatItemProps {
  chat: Chat;
  isDarkMode: boolean;
  onPress: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isDarkMode, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const isAI = chat.type === 'ai';
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.chatItem,
          isDarkMode && styles.darkChatItem,
          isAI && styles.aiChatItem,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={isAI ? 
            (isDarkMode ? 
              ['rgba(42, 103, 255, 0.2)', 'rgba(33, 150, 243, 0.1)'] : 
              ['rgba(42, 103, 255, 0.1)', 'rgba(33, 150, 243, 0.05)']
            ) : 
            (isDarkMode ? 
              ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] : 
              ['#fff', '#fff']
            )
          }
          style={styles.chatItemGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.chatItemContent}>
            <View style={styles.chatItemLeft}>
              {isAI ? (
                <View style={[styles.aiAvatar, isDarkMode && styles.darkAiAvatar]}>
                  <Ionicons name="logo-electron" size={24} color="#2A67FF" />
                </View>
              ) : (
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100' }}
                  style={styles.avatar}
                />
              )}
              <View style={styles.chatInfo}>
                <Text style={[
                  styles.chatName,
                  isDarkMode && { color: '#fff' },
                  isAI && styles.aiChatName
                ]}>
                  {chat.name}
                </Text>
                <Text 
                  style={[
                    styles.lastMessage,
                    isDarkMode && { color: 'rgba(255, 255, 255, 0.6)' },
                    chat.unread && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
              </View>
            </View>
            <View style={styles.chatItemRight}>
              <Text style={[
                styles.time,
                isDarkMode && { color: 'rgba(255, 255, 255, 0.6)' },
                chat.unread && styles.unreadTime
              ]}>
                {chat.time}
              </Text>
              {chat.unread && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>1</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ChatTab() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const chats: Chat[] = [
    {
      id: 'ai',
      type: 'ai',
      name: 'Centex AI Assistant',
      lastMessage: 'How can I help you with your studies today?',
      time: 'Now',
      unread: false,
    },
    {
      id: 'centex-community',
      type: 'group',
      name: 'Centex Community',
      lastMessage: "Welcome to the Centex community! Share your thoughts and connect with others.",
      time: '11:30 AM',
      unread: true,
    },
    {
      id: 'school-community',
      type: 'group',
      name: 'School Community',
      lastMessage: "Principal: Important announcement regarding upcoming events",
      time: '10:15 AM',
      unread: true,
    },
    {
      id: 'class-group',
      type: 'group',
      name: 'Class 10A Group',
      lastMessage: "Ms. Sarah: Don't forget to submit your assignments by Friday!",
      time: '9:30 AM',
      unread: false,
    }
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <ScrollView
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatListContent}
      >
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isDarkMode={isDarkMode}
            onPress={() => {
              router.push(`/(app)/(chat)/${chat.id}`);
            }}
          />
        ))}
      </ScrollView>
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
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  chatItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  darkChatItem: {
    backgroundColor: '#1E1E1E',
  },
  aiChatItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#2A67FF',
  },
  chatItemGradient: {
    borderRadius: 16,
  },
  chatItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  chatItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(42, 103, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  darkAiAvatar: {
    backgroundColor: 'rgba(42, 103, 255, 0.2)',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  aiChatName: {
    color: '#2A67FF',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
  chatItemRight: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  unreadTime: {
    color: '#2A67FF',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#2A67FF',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});