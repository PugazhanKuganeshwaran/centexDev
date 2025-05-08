import React, { useState } from 'react';
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
import Animated, { 
  FadeInRight,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

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
    if (answer.isSelected && answer.isCorrect) return '#4CAF50';
    if (answer.isSelected && !answer.isCorrect) return '#F44336';
    if (!answer.isSelected && answer.isCorrect) return '#4CAF50';
    return isDarkMode ? '#333' : '#E8E8E8';
  };

  const getBackgroundColor = () => {
    if (answer.isSelected && answer.isCorrect) return '#4CAF5020';
    if (answer.isSelected && !answer.isCorrect) return '#F4433620';
    if (!answer.isSelected && answer.isCorrect) return '#4CAF5010';
    return 'transparent';
  };

  const getIcon = () => {
    if (answer.isSelected && answer.isCorrect) return 'checkmark-circle';
    if (answer.isSelected && !answer.isCorrect) return 'close-circle';
    if (!answer.isSelected && answer.isCorrect) return 'checkmark-circle-outline';
    return 'radio-button-off';
  };

  const getIconColor = () => {
    if (answer.isSelected && answer.isCorrect) return '#4CAF50';
    if (answer.isSelected && !answer.isCorrect) return '#F44336';
    if (!answer.isSelected && answer.isCorrect) return '#4CAF50';
    return isDarkMode ? '#666' : '#999';
  };

  return (
    <View 
      style={[
        styles.answerItem,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
        isDarkMode && styles.darkAnswerItem,
      ]}
    >
      <Ionicons 
        name={getIcon()} 
        size={24} 
        color={getIconColor()} 
        style={styles.answerIcon}
      />
      <Text style={[
        styles.answerText,
        isDarkMode && styles.darkText,
      ]}>
        {answer.text}
      </Text>
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
  const [showExplanation, setShowExplanation] = useState(false);

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <Animated.View 
      entering={FadeInRight.delay(index * 100)}
      exiting={FadeOutLeft}
      layout={Layout.springify()}
      style={[
        styles.questionCard,
        isDarkMode && styles.darkQuestionCard,
      ]}
    >
      <View style={styles.questionHeader}>
        <View style={styles.questionMeta}>
          <Text style={[styles.questionNumber, isDarkMode && styles.darkText]}>
            Question {index + 1}
          </Text>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor() + '20' }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: getDifficultyColor() }
            ]}>
              {question.difficulty}
            </Text>
          </View>
          <View style={[
            styles.marksBadge,
            isDarkMode && styles.darkMarksBadge,
          ]}>
            <Text style={[
              styles.marksText,
              isDarkMode && { color: '#fff' }
            ]}>
              {question.marks} marks
            </Text>
          </View>
        </View>
        <Text style={[styles.subjectText, isDarkMode && { color: '#999' }]}>
          {question.subject}
        </Text>
      </View>

      <Text style={[styles.questionText, isDarkMode && styles.darkText]}>
        {question.text}
      </Text>

      <View style={styles.answersContainer}>
        {question.answers.map((answer) => (
          <AnswerItem 
            key={answer.id}
            answer={answer}
            isDarkMode={isDarkMode}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.explanationButton,
          isDarkMode && styles.darkExplanationButton,
        ]}
        onPress={() => setShowExplanation(!showExplanation)}
      >
        <Text style={[
          styles.explanationButtonText,
          isDarkMode && { color: '#2A67FF' }
        ]}>
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
        </Text>
        <Ionicons
          name={showExplanation ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={isDarkMode ? '#2A67FF' : '#2A67FF'}
        />
      </TouchableOpacity>

      {showExplanation && (
        <Animated.View
          entering={FadeInRight}
          style={[
            styles.explanationContainer,
            isDarkMode && styles.darkExplanationContainer,
          ]}
        >
          <Text style={[
            styles.explanationText,
            isDarkMode && { color: '#999' }
          ]}>
            {question.explanation}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default function ExamReview() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();

  // Parse the review data from params
  const questions: Question[] = params.reviewData ? JSON.parse(params.reviewData as string) : [];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
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
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkQuestionCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  questionHeader: {
    marginBottom: 16,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  marksBadge: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  darkMarksBadge: {
    backgroundColor: '#333',
  },
  marksText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  subjectText: {
    fontSize: 14,
    color: '#666',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  answersContainer: {
    gap: 12,
  },
  answerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  darkAnswerItem: {
    borderColor: '#333',
  },
  answerIcon: {
    marginRight: 12,
  },
  answerText: {
    flex: 1,
    fontSize: 14,
  },
  explanationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 8,
  },
  darkExplanationButton: {
    borderColor: '#333',
  },
  explanationButtonText: {
    fontSize: 14,
    color: '#2A67FF',
    marginRight: 4,
  },
  explanationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
  },
  darkExplanationContainer: {
    backgroundColor: '#262626',
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  darkText: {
    color: '#fff',
  },
}); 