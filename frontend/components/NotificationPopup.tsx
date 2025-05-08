import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const THEME = {
  primary: '#2A67FF',
  error: '#FF4A4A',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  dark: {
    background: '#1A1A1A',
    border: '#333',
    text: '#fff',
    textSecondary: '#999',
    card: '#1E1E1E'
  },
  light: {
    background: '#fff',
    border: '#E8E8E8',
    text: '#1A1A1A',
    textSecondary: '#666',
    card: '#fff'
  }
};

const NotificationItem = ({ type, title, message, time, onPress, isDarkMode, isUnread }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const getTypeConfig = () => {
    switch (type) {
      case 'event':
        return {
          icon: 'calendar',
          color: THEME.primary,
          gradient: isDarkMode ? ['#1A237E', '#1E1E1E'] : ['#E3F2FD', '#FFFFFF']
        };
      case 'exam':
        return {
          icon: 'document-text',
          color: THEME.warning,
          gradient: isDarkMode ? ['#E65100', '#1E1E1E'] : ['#FFF3E0', '#FFFFFF']
        };
      case 'resource':
        return {
          icon: 'book',
          color: THEME.success,
          gradient: isDarkMode ? ['#1B5E20', '#1E1E1E'] : ['#E8F5E9', '#FFFFFF']
        };
      case 'chat':
        return {
          icon: 'chatbubble',
          color: THEME.info,
          gradient: isDarkMode ? ['#0D47A1', '#1E1E1E'] : ['#E3F2FD', '#FFFFFF']
        };
      default:
        return {
          icon: 'notifications',
          color: THEME.primary,
          gradient: isDarkMode ? ['#1A237E', '#1E1E1E'] : ['#E3F2FD', '#FFFFFF']
        };
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const config = getTypeConfig();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={config.gradient}
          style={[
            styles.notificationItem,
            isDarkMode && styles.darkItem,
            isUnread && styles.unreadItem
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[
            styles.iconContainer,
            { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
          ]}>
            <Ionicons name={config.icon} size={24} color={config.color} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={[
              styles.title,
              isDarkMode && styles.darkText,
              isUnread && styles.unreadText
            ]}>
              {title}
            </Text>
            <Text style={[
              styles.message,
              isDarkMode && styles.darkSubText
            ]}>
              {message}
            </Text>
            <Text style={[styles.time, isDarkMode && styles.darkSubText]}>
              {time}
            </Text>
          </View>
          {isUnread && (
            <View style={[styles.unreadDot, { backgroundColor: config.color }]} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function NotificationPopup({ visible, onClose }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'event',
      title: 'Annual Sports Day',
      message: 'The annual sports day is scheduled for next week. Register now to participate!',
      time: '2 hours ago',
      isUnread: true,
    },
    {
      id: 2,
      type: 'exam',
      title: 'Mathematics Mid-Term Exam',
      message: 'Your mathematics mid-term exam is scheduled for March 20, 2024',
      time: '3 hours ago',
      isUnread: true,
    },
    {
      id: 3,
      type: 'resource',
      title: 'New Physics Materials',
      message: 'New study materials for Chapter 5: Wave Optics have been uploaded',
      time: '5 hours ago',
      isUnread: false,
    },
    {
      id: 4,
      type: 'chat',
      title: 'Ms. Sarah Johnson replied',
      message: 'Reply to your question about the chemistry assignment',
      time: '1 day ago',
      isUnread: true,
    },
  ]);

  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 50,
          bounciness: 5,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: height,
          useNativeDriver: true,
          speed: 50,
          bounciness: 5,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNotificationPress = (notification) => {
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isUnread: false } : n
    ));

    switch (notification.type) {
      case 'event':
        router.push('/calendar');
        break;
      case 'exam':
        router.push('/exams');
        break;
      case 'resource':
        router.push('/resources');
        break;
      case 'chat':
        router.push('/chat');
        break;
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.popup,
            isDarkMode && styles.darkPopup,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
              Notifications
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.markAllButton, isDarkMode && styles.darkMarkAllButton]}
                onPress={() => setNotifications(notifications.map(n => ({ ...n, isUnread: false })))}
              >
                <Text style={[styles.markAllText, { color: THEME.primary }]}>
                  Mark all as read
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={isDarkMode ? THEME.dark.text : THEME.light.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.notificationsList}
            showsVerticalScrollIndicator={false}
          >
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                isDarkMode={isDarkMode}
                onPress={() => handleNotificationPress(notification)}
              />
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropTouchable: {
    flex: 1,
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkPopup: {
    backgroundColor: THEME.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.light.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.light.text,
  },
  darkText: {
    color: THEME.dark.text,
  },
  darkSubText: {
    color: THEME.dark.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(42, 103, 255, 0.05)',
  },
  darkMarkAllButton: {
    backgroundColor: 'rgba(42, 103, 255, 0.1)',
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  notificationsList: {
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: THEME.light.card,
    borderWidth: 1,
    borderColor: THEME.light.border,
    marginBottom: 12,
  },
  darkItem: {
    backgroundColor: THEME.dark.card,
    borderColor: THEME.dark.border,
  },
  unreadItem: {
    borderWidth: 1,
    borderColor: 'rgba(42, 103, 255, 0.3)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.light.text,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    color: THEME.light.textSecondary,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: THEME.light.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
}); 