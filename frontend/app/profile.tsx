import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ProfileOption = ({ 
  icon, 
  title, 
  subtitle 
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  title: string; 
  subtitle?: string 
}) => (
  <TouchableOpacity style={styles.option}>
    <View style={styles.optionIcon}>
      <Ionicons name={icon} size={24} color="#2A67FF" />
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={24} color="#666" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.role}>Student</Text>
          <Text style={styles.details}>Class 10A • Roll No: 123</Text>
        </View>

        <ProfileSection title="Academic Information">
          <ProfileOption
            icon="school-outline"
            title="Class Performance"
            subtitle="View your academic progress"
          />
          <ProfileOption
            icon="trophy-outline"
            title="Achievements"
            subtitle="Certificates and awards"
          />
          <ProfileOption
            icon="calendar-outline"
            title="Attendance"
            subtitle="View attendance records"
          />
        </ProfileSection>

        <ProfileSection title="Settings">
          <ProfileOption
            icon="person-outline"
            title="Personal Information"
          />
          <ProfileOption
            icon="notifications-outline"
            title="Notifications"
          />
          <ProfileOption
            icon="shield-outline"
            title="Privacy & Security"
          />
        </ProfileSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#2A67FF',
    fontWeight: '500',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
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
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
}); 