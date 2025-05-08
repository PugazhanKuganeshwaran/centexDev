import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import NotificationPopup from '@/components/NotificationPopup';
import ProfilePopup from '@/components/ProfilePopup';

export default function TabsLayout() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: isDarkMode ? '#1A1A1A' : '#fff',
          },
          headerTitleStyle: {
            color: '#2A67FF',
            fontSize: 22,
            fontWeight: 'bold',
          },
          headerTitle: () => (
            <View>
              <Text style={{
                color: '#2A67FF',
                fontSize: 22,
                fontWeight: 'bold',
              }}>
                Centex Student
              </Text>
              <Text style={{
                color: isDarkMode ? '#999' : '#666',
                fontSize: 14,
                marginTop: 2,
                display: route.name === 'home' ? 'none' : 'flex',
              }}>
                {route.name === 'resources' ? 'Resources' :
                 route.name === 'chat-tab' ? 'Chat' :
                 route.name === 'exams' ? 'Exams' : ''}
              </Text>
            </View>
          ),
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#1A1A1A' : '#fff',
            borderTopColor: isDarkMode ? '#333' : '#E8E8E8',
          },
          tabBarActiveTintColor: '#2A67FF',
          tabBarInactiveTintColor: isDarkMode ? '#999' : '#666',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16, marginRight: 16 }}>
              <TouchableOpacity
                style={{ padding: 4 }}
                onPress={() => setIsNotificationVisible(true)}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={isDarkMode ? '#fff' : '#1A1A1A'}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#FF4A4A',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 4 }}
                onPress={() => setIsProfileVisible(true)}
              >
                <Image
                  source={{ uri: 'https://i.pravatar.cc/200' }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: '#2A67FF',
                  }}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="resources"
          options={{
            title: "Resources",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "book" : "book-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat-tab"
          options={{
            title: "Chat",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="exams"
          options={{
            title: "Exams",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "document-text" : "document-text-outline"} size={size} color={color} />
            ),
          }}
        />
      </Tabs>

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