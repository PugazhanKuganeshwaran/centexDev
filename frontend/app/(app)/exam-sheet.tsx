import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
  subject: string;
  marks: number;
}

const QuestionCard = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isDarkMode,
}: {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answerId: string) => void;
  isDarkMode: boolean;
}) => (
  <View style={[styles.questionCard, isDarkMode && styles.darkQuestionCard]}>
    <Text style={[styles.questionText, isDarkMode && styles.darkText]}>
      {question.text}
    </Text>
    <View style={styles.answersList}>
      {question.answers.map((answer) => (
        <TouchableOpacity
          key={answer.id}
          style={[
            styles.answerOption,
            isDarkMode && styles.darkAnswerOption,
            selectedAnswer === answer.id && styles.selectedAnswer,
            selectedAnswer === answer.id && isDarkMode && styles.darkSelectedAnswer,
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelectAnswer(answer.id);
          }}
        >
          <View style={[
            styles.answerCheckbox,
            isDarkMode && styles.darkAnswerCheckbox,
            selectedAnswer === answer.id && styles.selectedCheckbox,
          ]}>
            {selectedAnswer === answer.id && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={[
            styles.answerText,
            isDarkMode && styles.darkText,
            selectedAnswer === answer.id && styles.selectedAnswerText,
          ]}>
            {answer.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function ExamSheet() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Mock questions - replace with actual questions from your backend
  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the capital of France?',
      answers: [
        { id: 'a', text: 'London', isCorrect: false },
        { id: 'b', text: 'Paris', isCorrect: true },
        { id: 'c', text: 'Berlin', isCorrect: false },
        { id: 'd', text: 'Madrid', isCorrect: false },
      ],
      subject: 'Geography',
      marks: 1,
    },
    // Add more questions...
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: answerId,
    }));
  };

  const handleSubmit = () => {
    // Calculate results
    const total = questions.length;
    const attempted = Object.keys(selectedAnswers).length;
    let correct = 0;
    let score = 0;
    let maxScore = 0;

    questions.forEach((question) => {
      maxScore += question.marks;
      if (selectedAnswers[question.id]) {
        const selectedAnswer = question.answers.find(
          (a) => a.id === selectedAnswers[question.id]
        );
        if (selectedAnswer?.isCorrect) {
          correct++;
          score += question.marks;
        }
      }
    });

    router.push({
      pathname: '/(app)/exam-results',
      params: {
        total,
        attempted,
        correct,
        score,
        maxScore,
      }
    });
  };

  const handleQuit = () => {
    Alert.alert(
      'Quit Exam',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Quit',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity
          style={styles.quitButton}
          onPress={handleQuit}
        >
          <Ionicons 
            name="close" 
            size={24} 
            color={isDarkMode ? '#fff' : '#1A1A1A'} 
          />
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Ionicons 
            name="time" 
            size={20} 
            color={timeLeft < 300 ? '#F44336' : (isDarkMode ? '#fff' : '#1A1A1A')} 
          />
          <Text style={[
            styles.timer,
            isDarkMode && styles.darkText,
            timeLeft < 300 && styles.timerWarning,
          ]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={[styles.progress, isDarkMode && styles.darkText]}>
            {currentQuestion + 1}/{questions.length}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard
          question={questions[currentQuestion]}
          selectedAnswer={selectedAnswers[questions[currentQuestion].id]}
          onSelectAnswer={handleSelectAnswer}
          isDarkMode={isDarkMode}
        />
      </ScrollView>

      <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
        <TouchableOpacity
          style={[styles.navButton, isDarkMode && styles.darkNavButton]}
          onPress={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={currentQuestion === 0 ? 
              (isDarkMode ? '#666' : '#999') : 
              (isDarkMode ? '#fff' : '#1A1A1A')
            } 
          />
          <Text style={[
            styles.navButtonText,
            isDarkMode && styles.darkText,
            currentQuestion === 0 && styles.disabledText,
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestion === questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.submitButton, isDarkMode && styles.darkSubmitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              Submit
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, isDarkMode && styles.darkNavButton]}
            onPress={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
          >
            <Text style={[styles.navButtonText, isDarkMode && styles.darkText]}>
              Next
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={isDarkMode ? '#fff' : '#1A1A1A'} 
            />
          </TouchableOpacity>
        )}
      </View>
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
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333',
  },
  quitButton: {
    padding: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  timerWarning: {
    color: '#F44336',
  },
  progressContainer: {
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  progress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
  questionText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  answersList: {
    gap: 12,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 16,
  },
  darkAnswerOption: {
    backgroundColor: '#2A2A2A',
  },
  selectedAnswer: {
    backgroundColor: '#2A67FF20',
  },
  darkSelectedAnswer: {
    backgroundColor: '#2A67FF40',
  },
  answerCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkAnswerCheckbox: {
    borderColor: '#666',
  },
  selectedCheckbox: {
    backgroundColor: '#2A67FF',
    borderColor: '#2A67FF',
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedAnswerText: {
    color: '#2A67FF',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  darkFooter: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#333',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  darkNavButton: {
    opacity: 0.9,
  },
  navButtonText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  disabledText: {
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#2A67FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  darkSubmitButton: {
    backgroundColor: '#2A67FF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
}); 