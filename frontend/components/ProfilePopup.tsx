import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

const { height } = Dimensions.get('window');

const THEME = {
  primary: '#2A67FF',
  error: '#FF4A4A',
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

const ProfileSection = ({ title, children, isDarkMode }) => (
  <View style={[styles.section, isDarkMode && styles.darkSection]}>
    <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{title}</Text>
    {children}
  </View>
);

const ProfileOption = ({ icon, title, subtitle, showBadge, onPress, rightElement, isDarkMode }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={[styles.optionIcon, { backgroundColor: isDarkMode ? '#333' : '#F5F5F5' }]}>
      <Ionicons name={icon} size={20} color="#2196F3" />
    </View>
    <View style={styles.optionContent}>
      <Text style={[styles.optionTitle, isDarkMode && styles.darkText]}>{title}</Text>
      {subtitle && <Text style={[styles.optionSubtitle, isDarkMode && styles.darkSubText]}>{subtitle}</Text>}
    </View>
    {rightElement ? (
      rightElement
    ) : showBadge ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>2</Text>
      </View>
    ) : (
      <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#999" : "#666"} />
    )}
  </TouchableOpacity>
);

export default function ProfilePopup({ visible, onClose }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#1A1A1A"} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.profileHeader, isDarkMode && styles.darkProfileHeader]}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/200' }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.name, isDarkMode && styles.darkText]}>John Doe</Text>
                <Text style={styles.role}>Student</Text>
                <Text style={[styles.class, isDarkMode && styles.darkSubText]}>Class: 10th Grade</Text>
              </View>
              <TouchableOpacity style={[styles.editButton, isDarkMode && styles.darkEditButton]}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <ProfileSection title="Academic Information" isDarkMode={isDarkMode}>
              <View style={styles.academicStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, isDarkMode && styles.darkText]}>85%</Text>
                  <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Average</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, isDarkMode && styles.darkText]}>92%</Text>
                  <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Attendance</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, isDarkMode && styles.darkText]}>15</Text>
                  <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>Courses</Text>
                </View>
              </View>
            </ProfileSection>

            <ProfileSection title="Personal Information" isDarkMode={isDarkMode}>
              <ProfileOption
                icon="person"
                title="Student ID"
                subtitle="STD2024001"
                isDarkMode={isDarkMode}
              />
              <ProfileOption
                icon="mail"
                title="Email"
                subtitle="john.doe@example.com"
                isDarkMode={isDarkMode}
              />
              <ProfileOption
                icon="call"
                title="Phone"
                subtitle="+1 234 567 8900"
                isDarkMode={isDarkMode}
              />
            </ProfileSection>

            <ProfileSection title="Settings" isDarkMode={isDarkMode}>
              <ProfileOption
                icon="notifications"
                title="Notifications"
                showBadge={true}
                isDarkMode={isDarkMode}
              />
              <ProfileOption
                icon="lock-closed"
                title="Privacy & Security"
                isDarkMode={isDarkMode}
              />
              <ProfileOption
                icon="language"
                title="Language"
                subtitle="English"
                isDarkMode={isDarkMode}
              />
              <ProfileOption
                icon="moon"
                title="Dark Mode"
                subtitle={isDarkMode ? "On" : "Off"}
                isDarkMode={isDarkMode}
                rightElement={
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isDarkMode ? "#2196F3" : "#f4f3f4"}
                  />
                }
              />
            </ProfileSection>

            <TouchableOpacity style={styles.logoutButton}>
              <Ionicons name="log-out" size={20} color="#F44336" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
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
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  darkHeader: {
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  darkProfileHeader: {
    borderBottomColor: '#333',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  darkText: {
    color: '#fff',
  },
  role: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 4,
  },
  class: {
    fontSize: 14,
    color: '#666',
  },
  darkSubText: {
    color: '#999',
  },
  editButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  darkEditButton: {
    backgroundColor: '#333',
  },
  editButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  darkSection: {
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  academicStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 20,
  },
  logoutText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 