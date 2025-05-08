import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import * as Haptics from 'expo-haptics';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'single';
  difficulty: 'easy' | 'medium' | 'hard';
  answers: Answer[];
  explanation: string;
  subject: string;
  marks: number;
}

const AnswerItem = ({ 
  answer,
  isDarkMode,
}: { 
  answer: Answer;
  isDarkMode: boolean;
}) => {
  const getBorderColor = () => {
    if (answer.isCorrect) return '#4CAF50';
    if (answer.isSelected && !answer.isCorrect) return '#F44336';
    return isDarkMode ? '#333' : '#E8E8E8';
  };

  const getBackgroundColor = () => {
    if (answer.isCorrect) return 'rgba(76, 175, 80, 0.1)';
    if (answer.isSelected && !answer.isCorrect) return 'rgba(244, 67, 54, 0.1)';
    return isDarkMode ? '#1E1E1E' : '#fff';
  };

  const getIcon = () => {
    if (answer.isCorrect) return 'checkmark-circle';
    if (answer.isSelected && !answer.isCorrect) return 'close-circle';
    return 'radio-button-off';
  };

  const getIconColor = () => {
    if (answer.isCorrect) return '#4CAF50';
    if (answer.isSelected && !answer.isCorrect) return '#F44336';
    return isDarkMode ? '#666' : '#999';
  };

  return (
    <View style={[
      styles.answerItem,
      {
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
      }
    ]}>
      <Text style={[
        styles.answerText,
        isDarkMode && styles.darkText
      ]}>
        {answer.text}
      </Text>
      <Ionicons
        name={getIcon()}
        size={24}
        color={getIconColor()}
      />
    </View>
  );
};

const QuestionCard = ({
  question,
  index,
  isDarkMode,
}: {
  question: Question;
  index: number;
  isDarkMode: boolean;
}) => {
  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#666';
    }
  };

  return (
    <View style={[styles.questionCard, isDarkMode && styles.darkQuestionCard]}>
      <View style={styles.questionHeader}>
        <View style={styles.questionInfo}>
          <Text style={[styles.questionNumber, isDarkMode && styles.darkText]}>
            Question {index + 1}
          </Text>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor() + '20' }
          ]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={[styles.marks, isDarkMode && styles.darkSubText]}>
          {question.marks} marks
        </Text>
      </View>

      <Text style={[styles.questionText, isDarkMode && styles.darkText]}>
        {question.text}
      </Text>

      <View style={styles.answers}>
        {question.answers.map((answer) => (
          <AnswerItem
            key={answer.id}
            answer={answer}
            isDarkMode={isDarkMode}
          />
        ))}
      </View>

      <View style={[styles.explanation, isDarkMode && styles.darkExplanation]}>
        <Text style={[styles.explanationTitle, isDarkMode && styles.darkText]}>
          Explanation
        </Text>
        <Text style={[styles.explanationText, isDarkMode && styles.darkSubText]}>
          {question.explanation}
        </Text>
      </View>
    </View>
  );
};

export default function ExamReview() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();

  // Parse the review data from params
  const questions: Question[] = params.reviewData ? JSON.parse(params.reviewData as string) : [];

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? '#fff' : '#1A1A1A'} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          Review Answers
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isDarkMode={isDarkMode}
          />
        ))}
        {questions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, isDarkMode && styles.darkText]}>
              No review data available
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkQuestionCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  marks: {
    fontSize: 14,
    color: '#666',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  answers: {
    gap: 12,
    marginBottom: 20,
  },
  answerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },
  explanation: {
    backgroundColor: '#F5F6FA',
    padding: 16,
    borderRadius: 12,
  },
  darkExplanation: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
}); 