import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ResourceCard = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: keyof typeof Ionicons.glyphMap 
}) => (
  <TouchableOpacity style={styles.resourceCard}>
    <View style={styles.resourceIcon}>
      <Ionicons name={icon} size={24} color="#2A67FF" />
    </View>
    <Text style={styles.resourceTitle}>{title}</Text>
    <Text style={styles.resourceDescription}>{description}</Text>
  </TouchableOpacity>
);

export default function ResourcesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>Learning Resources</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.resourcesGrid}>
            <ResourceCard
              icon="book-outline"
              title="Study Materials"
              description="Access your subject-wise study materials"
            />
            <ResourceCard
              icon="videocam-outline"
              title="Video Tutorials"
              description="Watch educational video content"
            />
            <ResourceCard
              icon="document-text-outline"
              title="Past Papers"
              description="Practice with previous exam papers"
            />
            <ResourceCard
              icon="library-outline"
              title="Digital Library"
              description="Access the digital library collection"
            />
          </View>
        </ScrollView>
      </View>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  resourceCard: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 