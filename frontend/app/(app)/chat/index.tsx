import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';

export default function ChatScreen() {
  const router = useRouter();
  const { dark, colors } = useTheme();

  const chats = [
    {
      id: 'ai',
      type: 'ai',
      name: 'Centex AI Assistant',
      lastMessage: 'How can I help you today?',
      time: '9:30 AM',
      unread: false,
    },
    {
      id: 'community',
      type: 'group',
      name: 'Community Chat',
      lastMessage: 'Latest announcements and updates',
      time: '10:15 AM',
      unread: true,
    }
  ];

  const renderChatItem = (chat) => {
    const isAI = chat.type === 'ai';
    
    return (
      <TouchableOpacity
        key={chat.id}
        style={[
          styles.chatItem,
          dark && styles.darkChatItem,
          isAI && styles.aiChatItem,
          dark && isAI && styles.aiChatItemDark,
        ]}
        onPress={() => router.push(`/chat/${chat.id}`)}
      >
        {isAI ? (
          <LinearGradient
            colors={dark ? 
              ['rgba(42, 103, 255, 0.3)', 'rgba(26, 35, 126, 0.25)', 'rgba(13, 71, 161, 0.2)', 'rgba(21, 101, 192, 0.15)'] :
              ['rgba(42, 103, 255, 0.1)', 'rgba(26, 35, 126, 0.08)', 'rgba(13, 71, 161, 0.06)', 'rgba(21, 101, 192, 0.04)']
            }
            style={styles.gradient}
          />
        ) : null}
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[
              styles.chatName,
              dark && styles.darkText,
              isAI && styles.aiChatName,
              chat.unread && styles.unreadChatName
            ]}>
              {chat.name}
            </Text>
            <Text style={[
              styles.chatTime,
              dark && styles.darkSubText,
              isAI && styles.aiChatTime,
              chat.unread && styles.unreadChatTime
            ]}>
              {chat.time}
            </Text>
          </View>
          
          <Text style={[
            styles.lastMessage,
            dark && styles.darkSubText,
            isAI && styles.aiLastMessage,
            chat.unread && styles.unreadLastMessage
          ]}>
            {chat.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, dark && styles.darkHeader]}>
        <Text style={[styles.title, dark && styles.darkText]}>Chat</Text>
      </View>
      
      <ScrollView style={styles.chatList}>
        {chats.map(renderChatItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  darkChatItem: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  aiChatItem: {
    position: 'relative',
    overflow: 'hidden',
    borderLeftWidth: 2,
    borderLeftColor: '#2A67FF',
  },
  aiChatItemDark: {
    backgroundColor: 'transparent',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  darkSubText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  aiChatName: {
    color: '#2A67FF',
  },
  unreadChatName: {
    fontWeight: '700',
  },
  chatTime: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  aiChatTime: {
    color: '#5C93FF',
  },
  unreadChatTime: {
    color: '#2A67FF',
  },
  lastMessage: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  aiLastMessage: {
    color: '#5C93FF',
  },
  unreadLastMessage: {
    color: '#000',
    fontWeight: '500',
  },
}); 