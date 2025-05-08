import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const StatCard = ({ 
  title, 
  value, 
  subtitle,
  icon,
  color,
  isDarkMode,
}: { 
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  isDarkMode: boolean;
}) => (
  <View style={[styles.statCard, isDarkMode && styles.darkStatCard]}>
    <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={[styles.statTitle, isDarkMode && styles.darkText]}>
      {title}
    </Text>
    <Text style={[styles.statValue, { color }]}>
      {value}
    </Text>
    {subtitle && (
      <Text style={[styles.statSubtitle, isDarkMode && styles.darkSubText]}>
        {subtitle}
      </Text>
    )}
  </View>
);

export default function ExamResults() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();

  const {
    total,
    attempted,
    correct,
    score,
    maxScore,
  } = params;

  const percentage = Math.round((Number(score) / Number(maxScore)) * 100);
  const accuracy = Math.round((Number(correct) / Number(attempted)) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', color: '#4CAF50' };
    if (percentage >= 80) return { grade: 'A', color: '#8BC34A' };
    if (percentage >= 70) return { grade: 'B+', color: '#CDDC39' };
    if (percentage >= 60) return { grade: 'B', color: '#FFC107' };
    if (percentage >= 50) return { grade: 'C', color: '#FF9800' };
    return { grade: 'F', color: '#F44336' };
  };

  const { grade, color } = getGrade();

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="close" 
            size={24} 
            color={isDarkMode ? '#fff' : '#1A1A1A'} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          Exam Results
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.gradeCard, isDarkMode && styles.darkGradeCard]}>
          <LinearGradient
            colors={isDarkMode ? 
              [color + '40', color + '20'] :
              [color + '20', color + '10']
            }
            style={styles.gradeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.gradeLabel, isDarkMode && styles.darkText]}>
              Your Grade
            </Text>
            <Text style={[styles.grade, { color }]}>
              {grade}
            </Text>
            <Text style={[styles.score, isDarkMode && styles.darkText]}>
              {score} / {maxScore}
            </Text>
            <Text style={[styles.percentage, { color }]}>
              {percentage}%
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Questions"
            value={`${attempted}/${total}`}
            subtitle="Attempted"
            icon="document-text"
            color="#2196F3"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Correct"
            value={correct}
            subtitle="Answers"
            icon="checkmark-circle"
            color="#4CAF50"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Accuracy"
            value={`${accuracy}%`}
            icon="analytics"
            color="#FF9800"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Time"
            value="60:00"
            subtitle="Minutes"
            icon="time"
            color="#9C27B0"
            isDarkMode={isDarkMode}
          />
        </View>

        <TouchableOpacity
          style={[styles.reviewButton, isDarkMode && styles.darkReviewButton]}
          onPress={() => {
            router.push({
              pathname: '/(app)/exam-review',
              params: {
                total,
                attempted,
                correct,
                score,
                maxScore,
                reviewData: params.reviewData,
                preserveTabAccess: true
              }
            });
          }}
        >
          <Text style={styles.reviewButtonText}>
            Review Answers
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  gradeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkGradeCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  gradeGradient: {
    padding: 24,
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  grade: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  score: {
    fontSize: 18,
    marginBottom: 4,
  },
  percentage: {
    fontSize: 24,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkStatCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  reviewButton: {
    backgroundColor: '#2A67FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  darkReviewButton: {
    backgroundColor: '#2A67FF',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#999',
  },
}); 