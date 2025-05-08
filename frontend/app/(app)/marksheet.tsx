import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const TermSelector = ({ 
  selectedTerm, 
  onSelectTerm,
  isDarkMode
}: { 
  selectedTerm: string; 
  onSelectTerm: (term: string) => void;
  isDarkMode: boolean;
}) => (
  <View style={[styles.termSelector, isDarkMode && styles.darkTermSelector]}>
    {['Term 1', 'Term 2', 'Annual'].map((term) => (
      <TouchableOpacity
        key={term}
        style={[
          styles.termButton,
          selectedTerm === term && styles.selectedTermButton,
          isDarkMode && styles.darkTermButton
        ]}
        onPress={() => onSelectTerm(term)}
      >
        <Text style={[
          styles.termButtonText,
          selectedTerm === term && styles.selectedTermButtonText,
          isDarkMode && styles.darkTermButtonText
        ]}>
          {term}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const SubjectCard = ({ 
  subject, 
  marks, 
  highest, 
  lowest, 
  highestScorer, 
  lowestScorer,
  isDarkMode
}: { 
  subject: string; 
  marks: number; 
  highest: number; 
  lowest: number; 
  highestScorer: string; 
  lowestScorer: string;
  isDarkMode: boolean;
}) => (
  <View style={[styles.subjectCard, isDarkMode && styles.darkSubjectCard]}>
    <View style={styles.subjectHeader}>
      <Text style={[styles.subjectName, isDarkMode && styles.darkText]}>{subject}</Text>
      <Text style={styles.marks}>{marks}/100</Text>
    </View>
    <View style={styles.performanceRow}>
      <View style={styles.performanceItem}>
        <Text style={[styles.performanceLabel, isDarkMode && styles.darkSubText]}>Highest</Text>
        <Text style={[styles.performanceValue, isDarkMode && styles.darkText]}>{highest}</Text>
        <Text style={[styles.scorerName, isDarkMode && styles.darkSubText]}>{highestScorer}</Text>
      </View>
      <View style={styles.performanceItem}>
        <Text style={[styles.performanceLabel, isDarkMode && styles.darkSubText]}>Lowest</Text>
        <Text style={[styles.performanceValue, isDarkMode && styles.darkText]}>{lowest}</Text>
        <Text style={[styles.scorerName, isDarkMode && styles.darkSubText]}>{lowestScorer}</Text>
      </View>
    </View>
  </View>
);

const ComparisonChart = ({ 
  currentTerm, 
  previousTerm, 
  annual,
  isDarkMode
}: { 
  currentTerm: number; 
  previousTerm: number; 
  annual: number;
  isDarkMode: boolean;
}) => (
  <View style={[styles.comparisonContainer, isDarkMode && styles.darkComparisonContainer]}>
    <Text style={[styles.comparisonTitle, isDarkMode && styles.darkText]}>Performance Comparison</Text>
    <View style={styles.barContainer}>
      <View style={styles.barItem}>
        <View style={[styles.bar, { height: `${currentTerm}%` }]} />
        <Text style={[styles.barLabel, isDarkMode && styles.darkSubText]}>Current</Text>
      </View>
      <View style={styles.barItem}>
        <View style={[styles.bar, { height: `${previousTerm}%` }]} />
        <Text style={[styles.barLabel, isDarkMode && styles.darkSubText]}>Previous</Text>
      </View>
      <View style={styles.barItem}>
        <View style={[styles.bar, { height: `${annual}%` }]} />
        <Text style={[styles.barLabel, isDarkMode && styles.darkSubText]}>Annual</Text>
      </View>
    </View>
  </View>
);

export default function MarksheetScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#1A1A1A"} />
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Marksheet</Text>
        <View style={styles.headerRight} />
      </View>

      <TermSelector 
        selectedTerm={selectedTerm} 
        onSelectTerm={setSelectedTerm}
        isDarkMode={isDarkMode}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ComparisonChart 
          currentTerm={85} 
          previousTerm={78} 
          annual={82}
          isDarkMode={isDarkMode}
        />

        <SubjectCard
          subject="Mathematics"
          marks={92}
          highest={98}
          lowest={45}
          highestScorer="John Doe"
          lowestScorer="Jane Smith"
          isDarkMode={isDarkMode}
        />
        <SubjectCard
          subject="Science"
          marks={88}
          highest={95}
          lowest={50}
          highestScorer="Alice Johnson"
          lowestScorer="Bob Wilson"
          isDarkMode={isDarkMode}
        />
        <SubjectCard
          subject="English"
          marks={85}
          highest={92}
          lowest={48}
          highestScorer="Emma Davis"
          lowestScorer="Michael Brown"
          isDarkMode={isDarkMode}
        />
        <SubjectCard
          subject="History"
          marks={90}
          highest={96}
          lowest={52}
          highestScorer="Sarah Miller"
          lowestScorer="David Taylor"
          isDarkMode={isDarkMode}
        />
        <SubjectCard
          subject="Geography"
          marks={87}
          highest={94}
          lowest={47}
          highestScorer="Lisa Anderson"
          lowestScorer="James Wilson"
          isDarkMode={isDarkMode}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  darkHeader: {
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#999',
  },
  headerRight: {
    width: 40,
  },
  termSelector: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  darkTermSelector: {
    borderBottomColor: '#333',
  },
  termButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  darkTermButton: {
    backgroundColor: '#1E1E1E',
  },
  selectedTermButton: {
    backgroundColor: '#2A67FF',
  },
  termButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  darkTermButtonText: {
    color: '#999',
  },
  selectedTermButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkSubjectCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  marks: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A67FF',
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  scorerName: {
    fontSize: 12,
    color: '#666',
  },
  comparisonContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkComparisonContainer: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 40,
    backgroundColor: '#2A67FF',
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
}); 