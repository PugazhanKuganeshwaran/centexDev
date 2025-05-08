import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@/components/Text';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <View style={[
      styles.featureCard,
      isDarkMode && styles.darkFeatureCard
    ]}>
      <View style={[
        styles.featureIcon,
        isDarkMode && styles.darkFeatureIcon
      ]}>
        <Ionicons name={icon} size={32} color="#2A67FF" />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

export default function OnboardingScreen() {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <LinearGradient
        colors={isDarkMode ? 
          ['#1A237E', '#0D47A1', '#1A1A1A'] :
          ['#E3F2FD', '#BBDEFB', '#FFFFFF']
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.logo, isDarkMode && styles.darkLogo]}>
            <Ionicons 
              name="school-outline" 
              size={40} 
              color={isDarkMode ? '#fff' : '#2A67FF'} 
            />
          </View>
          <Text style={styles.title}>Advanced LMS</Text>
          <Text style={styles.subtitle}>Transform Your Learning Experience</Text>
        </View>

        <View style={styles.featuresContainer}>
          <FeatureCard
            icon="book-outline"
            title="Comprehensive Learning"
            description="Access study materials, track progress, and excel in your studies"
          />
          <FeatureCard
            icon="people-outline"
            title="Interactive Community"
            description="Connect with teachers and peers in a collaborative environment"
          />
          <FeatureCard
            icon="analytics-outline"
            title="Performance Tracking"
            description="Monitor your progress with detailed analytics and insights"
          />
          <FeatureCard
            icon="shield-checkmark-outline"
            title="Secure Platform"
            description="Your data is protected with advanced security measures"
          />
        </View>

        <TouchableOpacity
          style={[styles.getStartedButton, isDarkMode && styles.darkGetStartedButton]}
          onPress={() => router.push('/(app)/(tabs)/home')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(42, 103, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  darkLogo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A67FF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    opacity: 0.8,
  },
  featuresContainer: {
    flex: 1,
    gap: 20,
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkFeatureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(42, 103, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  darkFeatureIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  getStartedButton: {
    backgroundColor: '#2A67FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  darkGetStartedButton: {
    backgroundColor: '#2A67FF',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 