import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ExamSheet() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        if (prev <= 300) { // Last 5 minutes
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock exam data - replace with actual data from your backend
  const examData = {
    id: '1',
    title: 'Mathematics Practice Exam',
    totalQuestions: 40,
    duration: 60, // minutes
    questions: [
      {
        id: '1',
        text: 'What is the value of π (pi) to two decimal places?',
        type: 'single',
        answers: [
          { id: 'a', text: '3.14' },
          { id: 'b', text: '3.12' },
          { id: 'c', text: '3.16' },
          { id: 'd', text: '3.18' },
        ],
      },
      // Add more questions...
    ],
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Calculate results
    const total = examData.questions.length;
    const attempted = Object.keys(selectedAnswers).length;
    let correct = 0;
    let score = 0;
    let maxScore = 0;

    // Prepare review data
    const reviewData = examData.questions.map(question => ({
      ...question,
      answers: question.answers.map(answer => ({
        ...answer,
        isSelected: selectedAnswers[question.id] === answer.id
      }))
    }));

    examData.questions.forEach((question) => {
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
      pathname: '/(app)/(tabs)/exams/results',
      params: {
        total,
        attempted,
        correct,
        score,
        maxScore,
        reviewData: JSON.stringify(reviewData),
        preserveTabAccess: true
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <LinearGradient
        colors={isDarkMode ? 
          ['#1A1A1A', '#121212'] : 
          ['#fff', '#F5F6FA']
        }
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.quitButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                'Quit Exam',
                'Are you sure you want to quit? Your progress will be lost.',
                [
                  { text: 'Cancel', style: 'cancel' },
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
            }}
          >
            <LinearGradient
              colors={isDarkMode ? 
                ['#FF4A4A20', '#FF4A4A10'] : 
                ['#FF4A4A15', '#FF4A4A05']
              }
              style={styles.quitButtonGradient}
            >
              <Ionicons 
                name="close" 
                size={20} 
                color="#FF4A4A" 
              />
              <Text style={styles.quitButtonText}>Quit</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#2A67FF', '#5C93FF']}
                style={[styles.progressFill, { width: `${(currentQuestion + 1) / examData.totalQuestions * 100}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={[styles.progressText, isDarkMode && styles.darkText]}>
              {currentQuestion + 1}/{examData.totalQuestions}
            </Text>
          </View>

          <Animated.View style={[
            styles.timerContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            <LinearGradient
              colors={timeLeft <= 300 ? 
                (isDarkMode ? ['#FF4A4A30', '#FF4A4A15'] : ['#FF4A4A20', '#FF4A4A10']) :
                (isDarkMode ? ['#2A67FF30', '#2A67FF15'] : ['#2A67FF20', '#2A67FF10'])
              }
              style={styles.timerGradient}
            >
              <Ionicons 
                name="time-outline" 
                size={20} 
                color={timeLeft <= 300 ? '#FF4A4A' : '#2A67FF'} 
              />
              <Text style={[
                styles.timerText,
                { color: timeLeft <= 300 ? '#FF4A4A' : '#2A67FF' }
              ]}>
                {formatTime(timeLeft)}
              </Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </LinearGradient>

      {/* Question Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Question text */}
        <Text style={[styles.questionText, isDarkMode && styles.darkText]}>
          {examData.questions[currentQuestion].text}
        </Text>

        {/* Answer options */}
        <View style={styles.answers}>
          {examData.questions[currentQuestion].answers.map((answer) => (
            <TouchableOpacity
              key={answer.id}
              style={[
                styles.answerOption,
                isDarkMode && styles.darkAnswerOption,
                selectedAnswers[examData.questions[currentQuestion].id]?.includes(answer.id) &&
                  styles.selectedAnswer,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Handle answer selection
              }}
            >
              <Text style={[
                styles.answerText,
                isDarkMode && styles.darkText,
                selectedAnswers[examData.questions[currentQuestion].id]?.includes(answer.id) &&
                  styles.selectedAnswerText,
              ]}>
                {answer.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={[styles.navigation, isDarkMode && styles.darkNavigation]}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton]}
          onPress={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(prev => prev - 1);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
          disabled={currentQuestion === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={currentQuestion === 0 ? '#999' : (isDarkMode ? '#fff' : '#1A1A1A')} 
          />
          <Text style={[
            styles.navButtonText,
            currentQuestion === 0 && styles.disabledText,
            isDarkMode && styles.darkText
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestion === examData.totalQuestions - 1 ? (
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
            style={[styles.navButton, styles.nextButton]}
            onPress={() => {
              if (currentQuestion < examData.totalQuestions - 1) {
                setCurrentQuestion(prev => prev + 1);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
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
  headerGradient: {
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  quitButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  quitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  quitButtonText: {
    color: '#FF4A4A',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timerContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  },
  answers: {
    gap: 12,
  },
  answerOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkAnswerOption: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  selectedAnswer: {
    backgroundColor: '#2A67FF',
    borderColor: '#2A67FF',
  },
  answerText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedAnswerText: {
    color: '#fff',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  darkNavigation: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#333',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prevButton: {
    opacity: 0.8,
  },
  nextButton: {
    opacity: 0.8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
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
  darkSubText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
}); 