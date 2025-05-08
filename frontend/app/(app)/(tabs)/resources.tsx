import React, { useState } from 'react';
import {
  View,
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
import { Text } from '@/components/Text';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type ResourceType = 'pdf' | 'video';

interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  from: string;
  uploadTime: string;
  duration?: string;
}

const searchResults: Resource[] = [
  {
    id: '1',
    type: 'video',
    title: 'Introduction to Physics',
    from: 'Science Department',
    uploadTime: '2 days ago',
    duration: '45:30',
  },
  {
    id: '2',
    type: 'pdf',
    title: 'Chemistry Notes Chapter 1',
    from: 'Mr. Johnson',
    uploadTime: '1 week ago',
  },
  {
    id: '3',
    type: 'video',
    title: 'Biology Cell Structure',
    from: 'Ms. Smith',
    uploadTime: '3 days ago',
    duration: '32:15',
  },
  {
    id: '4',
    type: 'pdf',
    title: 'Mathematics Formula Sheet',
    from: 'Math Department',
    uploadTime: '5 days ago',
  },
];

const SearchBar = ({ value, onChangeText, isDarkMode }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[
      styles.searchContainer,
      isDarkMode && styles.darkSearchContainer,
      isFocused && styles.searchContainerFocused,
      isFocused && isDarkMode && styles.darkSearchContainerFocused,
    ]}>
      <Ionicons 
        name="search" 
        size={20} 
        color={isDarkMode ? (isFocused ? '#fff' : '#666') : (isFocused ? '#2A67FF' : '#666')} 
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search resources..."
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value.length > 0 && (
        <TouchableOpacity 
          onPress={() => onChangeText('')}
          style={styles.clearButton}
        >
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={isDarkMode ? '#666' : '#999'} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const FilterTabs = ({ activeFilter, onFilterChange, isDarkMode }) => (
  <View style={styles.filterTabs}>
    {['all', 'pdf', 'video'].map((filter) => (
      <TouchableOpacity
        key={filter}
        style={[
          styles.filterTab,
          activeFilter === filter && styles.activeFilterTab,
          isDarkMode && styles.darkFilterTab,
          activeFilter === filter && isDarkMode && styles.darkActiveFilterTab,
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onFilterChange(filter);
        }}
      >
        <Text style={[
          styles.filterText,
          activeFilter === filter && styles.activeFilterText,
          isDarkMode && styles.darkFilterText,
          activeFilter === filter && isDarkMode && styles.darkActiveFilterText,
        ]}>
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const SearchResultItem = ({ resource, isDarkMode }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <TouchableOpacity 
      style={[styles.resultItem, isDarkMode && styles.darkResultItem]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isDarkMode ? 
          ['rgba(42, 103, 255, 0.1)', 'rgba(42, 103, 255, 0.05)'] : 
          ['#F0F4FF', '#F8FAFF']
        }
        style={styles.resultGradient}
      >
        <View style={styles.resultContent}>
          <Text style={[styles.resultFrom, isDarkMode && styles.darkText]}>
            From - {resource.from}
          </Text>
          <Text style={[styles.resultTitle, isDarkMode && styles.darkText]}>
            {resource.title}
          </Text>
          <Text style={[styles.resultTime, isDarkMode && styles.darkSubText]}>
            {resource.uploadTime}
          </Text>
        </View>
        <View style={styles.resultActions}>
          {resource.type === 'pdf' ? (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye-outline" size={20} color="#2A67FF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download-outline" size={20} color="#2A67FF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.duration}>
                <Text style={styles.durationText}>{resource.duration}</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="play-circle-outline" size={24} color="#2A67FF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ResourceItem = ({ title, description, icon, isDarkMode }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <TouchableOpacity 
      style={[styles.resourceItem, isDarkMode && styles.darkResourceItem]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isDarkMode ? 
          ['rgba(42, 103, 255, 0.1)', 'rgba(42, 103, 255, 0.05)'] : 
          ['#F0F4FF', '#F8FAFF']
        }
        style={styles.itemGradient}
      >
        <View style={[styles.resourceIcon, isDarkMode && styles.darkResourceIcon]}>
          <Ionicons name={icon} size={24} color="#2A67FF" />
        </View>
        <View style={styles.resourceContent}>
          <Text style={[styles.resourceTitle, isDarkMode && styles.darkText]}>{title}</Text>
          <Text style={[styles.resourceDescription, isDarkMode && styles.darkSubText]}>{description}</Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#CCCCCC'} 
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const resources = [
  {
    id: '1',
    icon: 'book-outline',
    title: 'Study Materials',
    description: 'Access subject-wise study materials and notes',
  },
  {
    id: '2',
    icon: 'videocam-outline',
    title: 'Video Tutorials',
    description: 'Watch educational video content',
  },
  {
    id: '3',
    icon: 'document-text-outline',
    title: 'Past Papers',
    description: 'Practice with previous exam papers',
  },
];

export default function ResourcesScreen() {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredResults = searchResults.filter(resource => {
    const matchesQuery = (
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.from.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesFilter = activeFilter === 'all' || resource.type === activeFilter;
    return matchesQuery && matchesFilter;
  });

  const renderSearchResults = () => (
    <>
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        isDarkMode={isDarkMode}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredResults.length > 0 ? (
          filteredResults.map(resource => (
            <SearchResultItem
              key={resource.id}
              resource={resource}
              isDarkMode={isDarkMode}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={48}
              color={isDarkMode ? '#666' : '#999'}
            />
            <Text style={[styles.emptyText, isDarkMode && styles.darkSubText]}>
              No resources found
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );

  const renderResourceGrid = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {resources.map(resource => (
        <ResourceItem
          key={resource.id}
          icon={resource.icon}
          title={resource.title}
          description={resource.description}
          isDarkMode={isDarkMode}
        />
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Learning Resources</Text>
        
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          isDarkMode={isDarkMode}
        />

        {searchQuery ? renderSearchResults() : renderResourceGrid()}
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
  scrollContent: {
    gap: 12,
    paddingTop: 16,
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
    color: 'rgba(255, 255, 255, 0.7)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 12,
  },
  darkSearchContainer: {
    backgroundColor: '#2A2A2A',
    borderColor: '#333',
  },
  searchContainerFocused: {
    borderColor: '#2A67FF',
    backgroundColor: '#fff',
  },
  darkSearchContainerFocused: {
    borderColor: '#2A67FF',
    backgroundColor: '#1E1E1E',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    padding: 0,
  },
  darkSearchInput: {
    color: '#fff',
  },
  clearButton: {
    padding: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  darkFilterTab: {
    backgroundColor: '#2A2A2A',
  },
  activeFilterTab: {
    backgroundColor: '#2A67FF',
  },
  darkActiveFilterTab: {
    backgroundColor: '#2A67FF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  darkFilterText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeFilterText: {
    color: '#fff',
  },
  darkActiveFilterText: {
    color: '#fff',
  },
  resourceItem: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  darkResourceItem: {
    backgroundColor: '#1E1E1E',
  },
  itemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkResourceIcon: {
    backgroundColor: 'rgba(42, 103, 255, 0.1)',
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
  },
  resultItem: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  darkResultItem: {
    backgroundColor: '#1E1E1E',
  },
  resultGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  resultContent: {
    flex: 1,
  },
  resultFrom: {
    fontSize: 12,
    color: '#2A67FF',
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  resultTime: {
    fontSize: 12,
    color: '#666',
  },
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  duration: {
    backgroundColor: '#2A67FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 