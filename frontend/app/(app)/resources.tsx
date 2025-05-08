import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type ResourceType = 'pdf' | 'video';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  unit: string;
  subject: string;
  icon: string;
}

const ResourceCard = ({ title, description, icon, isDarkMode }: { title: string; description: string; icon: string; isDarkMode: boolean }) => (
  <TouchableOpacity 
    style={[
      styles.resourceCard,
      isDarkMode && styles.darkResourceCard
    ]}
  >
    <View style={[
      styles.resourceIcon,
      isDarkMode && styles.darkResourceIcon
    ]}>
      <Ionicons name={icon} size={24} color="#2A67FF" />
    </View>
    <Text style={[
      styles.resourceTitle,
      isDarkMode && styles.darkText
    ]}>
      {title}
    </Text>
    <Text style={[
      styles.resourceDescription,
      isDarkMode && styles.darkSubText
    ]}>
      {description}
    </Text>
  </TouchableOpacity>
);

const SearchResultItem = ({ title, subject, unit, type, isDarkMode }: { title: string; subject: string; unit: string; type: ResourceType; isDarkMode: boolean }) => {
  const getTypeConfig = () => {
    if (type === 'pdf') {
      return {
        icon: 'document-text',
        color: '#4CAF50',
        gradient: isDarkMode ? ['#1B5E20', '#1E1E1E'] : ['#E8F5E9', '#FFFFFF']
      };
    }
    return {
      icon: 'videocam',
      color: '#2196F3',
      gradient: isDarkMode ? ['#0D47A1', '#1E1E1E'] : ['#E3F2FD', '#FFFFFF']
    };
  };

  const config = getTypeConfig();

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <LinearGradient
        colors={config.gradient}
        style={[styles.resultItem, isDarkMode && styles.darkResultItem]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.resultIcon, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <Ionicons name={config.icon} size={24} color={config.color} />
        </View>
        <View style={styles.resultContent}>
          <Text style={[styles.resultTitle, isDarkMode && styles.darkText]}>{title}</Text>
          <Text style={[styles.resultSubtitle, isDarkMode && styles.darkSubText]}>{subject} • Unit {unit}</Text>
        </View>
        <View style={styles.resultActions}>
          {type === 'pdf' ? (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye-outline" size={20} color={config.color} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download-outline" size={20} color={config.color} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="play-circle-outline" size={24} color={config.color} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function ResourcesScreen() {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<ResourceType>('pdf');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Wave Motion and Sound',
      description: 'Complete study material for Unit 1',
      type: 'pdf',
      unit: '1',
      subject: 'Physics',
      icon: 'document-text-outline'
    },
    {
      id: '2',
      title: 'Wave Optics Lecture',
      description: 'Video lecture on wave optics',
      type: 'video',
      unit: '2',
      subject: 'Physics',
      icon: 'videocam-outline'
    },
    {
      id: '3',
      title: 'Thermodynamics Notes',
      description: 'Comprehensive notes on Unit 3',
      type: 'pdf',
      unit: '3',
      subject: 'Physics',
      icon: 'document-text-outline'
    },
    // Add more resources as needed
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = resource.type === activeType;
    return matchesSearch && matchesType;
  });

  const renderContent = () => {
    if (searchQuery) {
      return (
        <View style={styles.searchResults}>
          {filteredResources.map((resource) => (
            <SearchResultItem
              key={resource.id}
              title={resource.title}
              subject={resource.subject}
              unit={resource.unit}
              type={resource.type}
              isDarkMode={isDarkMode}
            />
          ))}
          {filteredResources.length === 0 && (
            <Text style={[styles.noResults, isDarkMode && styles.darkSubText]}>
              No results found
            </Text>
          )}
        </View>
      );
    }

    return (
      <View style={styles.resourcesGrid}>
        <ResourceCard
          icon="book-outline"
          title="Study Materials"
          description="Access your subject-wise study materials"
          isDarkMode={isDarkMode}
        />
        <ResourceCard
          icon="videocam-outline"
          title="Video Tutorials"
          description="Watch educational video content"
          isDarkMode={isDarkMode}
        />
        <ResourceCard
          icon="document-text-outline"
          title="Past Papers"
          description="Practice with previous exam papers"
          isDarkMode={isDarkMode}
        />
        <ResourceCard
          icon="library-outline"
          title="Digital Library"
          description="Access the digital library collection"
          isDarkMode={isDarkMode}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Learning Resources
        </Text>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, isDarkMode && styles.darkSearchBar]}>
            <Ionicons name="search" size={20} color={isDarkMode ? "#999" : "#666"} />
            <TextInput
              style={[styles.searchInput, isDarkMode && styles.darkText]}
              placeholder="Search by unit, subject..."
              placeholderTextColor={isDarkMode ? "#999" : "#666"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={isDarkMode ? "#999" : "#666"} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {searchQuery && (
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeType === 'pdf' && styles.activeFilter,
                isDarkMode && styles.darkFilterButton,
                activeType === 'pdf' && isDarkMode && styles.darkActiveFilter,
              ]}
              onPress={() => setActiveType('pdf')}
            >
              <Ionicons
                name="document-text"
                size={20}
                color={activeType === 'pdf' ? '#fff' : isDarkMode ? '#999' : '#666'}
              />
              <Text
                style={[
                  styles.filterText,
                  activeType === 'pdf' && styles.activeFilterText,
                  isDarkMode && styles.darkFilterText,
                ]}
              >
                PDF docs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeType === 'video' && styles.activeFilter,
                isDarkMode && styles.darkFilterButton,
                activeType === 'video' && isDarkMode && styles.darkActiveFilter,
              ]}
              onPress={() => setActiveType('video')}
            >
              <Ionicons
                name="videocam"
                size={20}
                color={activeType === 'video' ? '#fff' : isDarkMode ? '#999' : '#666'}
              />
              <Text
                style={[
                  styles.filterText,
                  activeType === 'video' && styles.activeFilterText,
                  isDarkMode && styles.darkFilterText,
                ]}
              >
                Videos
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
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
  darkContainer: {
    backgroundColor: '#1A1A1A',
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
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#999',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  darkSearchBar: {
    backgroundColor: '#333',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  darkFilterButton: {
    backgroundColor: '#333',
  },
  activeFilter: {
    backgroundColor: '#2A67FF',
  },
  darkActiveFilter: {
    backgroundColor: '#2A67FF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  darkFilterText: {
    color: '#999',
  },
  activeFilterText: {
    color: '#fff',
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
  darkResourceCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
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
  darkResourceIcon: {
    backgroundColor: '#333',
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
  searchResults: {
    gap: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  darkResultItem: {
    borderWidth: 1,
    borderColor: '#333',
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
}); 