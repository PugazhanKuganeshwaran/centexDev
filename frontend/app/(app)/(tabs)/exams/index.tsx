import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type ExamMode = 'practice' | 'competitive';

interface SelectionModalProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (option: string) => void;
  selected: string | null;
  title: string;
  isDarkMode: boolean;
}

const SelectionModal = ({ 
  visible, 
  onClose, 
  options, 
  onSelect, 
  selected,
  title,
  isDarkMode,
}: SelectionModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[
          styles.modalContent,
          isDarkMode && styles.darkModalContent
        ]}>
          <Text style={[
            styles.modalTitle,
            isDarkMode && styles.darkModalTitle
          ]}>
            {title}
          </Text>
          <ScrollView style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  isDarkMode && styles.darkOptionItem,
                  selected === option && styles.selectedOption,
                  selected === option && isDarkMode && styles.darkSelectedOption,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSelect(option);
                  onClose();
                }}
              >
                <Text style={[
                  styles.optionText,
                  isDarkMode && styles.darkOptionText,
                  selected === option && styles.selectedOptionText,
                  selected === option && isDarkMode && styles.darkSelectedOptionText,
                ]}>
                  {option}
                </Text>
                {selected === option && (
                  <Ionicons 
                    name="checkmark" 
                    size={24} 
                    color={isDarkMode ? '#4A80FF' : '#2A67FF'} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const SelectionField = ({ 
  value, 
  onPress, 
  placeholder,
  isDarkMode,
  icon,
}: { 
  value: string | null;
  onPress: () => void;
  placeholder: string;
  isDarkMode: boolean;
  icon: string;
}) => (
  <TouchableOpacity
    style={[
      styles.selectionField,
      isDarkMode && styles.darkSelectionField,
    ]}
    onPress={onPress}
  >
    <Ionicons 
      name={icon} 
      size={20}
      color={isDarkMode ? '#fff' : '#666'}
      style={styles.selectionIcon}
    />
    <Text style={[
      styles.selectionText,
      !value && styles.placeholderText,
      isDarkMode && styles.darkText,
      !value && isDarkMode && styles.darkPlaceholderText,
    ]}>
      {value || placeholder}
    </Text>
    <Ionicons 
      name="chevron-down" 
      size={20}
      color={isDarkMode ? '#666' : '#999'} 
    />
  </TouchableOpacity>
);

const StatCard = ({ title, value, trend, icon, color, isDarkMode }) => (
  <View style={[styles.statCard, isDarkMode && styles.darkStatCard]}>
    <View style={[styles.statIcon, { backgroundColor: color + (isDarkMode ? '30' : '20') }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.statInfo}>
      <Text style={[styles.statTitle, isDarkMode && styles.darkStatTitle]}>
        {title}
      </Text>
      <Text style={[styles.statValue, { color }]}>
        {value}
      </Text>
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trend > 0 ? "trending-up" : "trending-down"} 
            size={16} 
            color={trend > 0 ? (isDarkMode ? "#66BB6A" : "#4CAF50") : (isDarkMode ? "#EF5350" : "#F44336")} 
          />
          <Text style={[
            styles.trendText,
            { color: trend > 0 ? (isDarkMode ? "#66BB6A" : "#4CAF50") : (isDarkMode ? "#EF5350" : "#F44336") }
          ]}>
            {Math.abs(trend)}%
          </Text>
        </View>
      )}
    </View>
  </View>
);

const ExamCard = ({ 
  title, 
  score, 
  date, 
  type,
  isDarkMode,
  onPress,
}: { 
  title: string;
  score: number;
  date: string;
  type: 'practice' | 'competitive';
  isDarkMode: boolean;
  onPress: () => void;
}) => {
  const getGradeColor = () => {
    if (score >= 90) return isDarkMode ? '#66BB6A' : '#4CAF50';
    if (score >= 80) return isDarkMode ? '#81C784' : '#66BB6A';
    if (score >= 70) return isDarkMode ? '#FFB74D' : '#FF9800';
    if (score >= 60) return isDarkMode ? '#FFA726' : '#FB8C00';
    return isDarkMode ? '#EF5350' : '#F44336';
  };

  return (
    <TouchableOpacity 
      style={[styles.examCard, isDarkMode && styles.darkExamCard]}
      onPress={onPress}
    >
      <View style={styles.examCardLeft}>
        <View style={[
          styles.examTypeTag,
          { backgroundColor: type === 'practice' ? '#2196F320' : '#9C27B020' }
        ]}>
          <Ionicons
            name={type === 'practice' ? 'book-outline' : 'trophy-outline'}
            size={14}
            color={type === 'practice' ? '#2196F3' : '#9C27B0'}
          />
          <Text style={[
            styles.examTypeText,
            { color: type === 'practice' ? '#2196F3' : '#9C27B0' }
          ]}>
            {type === 'practice' ? 'Practice' : 'Competitive'}
          </Text>
        </View>
        <Text style={[styles.examTitle, isDarkMode && styles.darkText]}>
          {title}
        </Text>
        <Text style={[styles.examDate, isDarkMode && styles.darkSubText]}>
          {date}
        </Text>
      </View>
      <View style={styles.examCardRight}>
        <Text style={[styles.examScore, { color: getGradeColor() }]}>
          {score}%
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDarkMode ? '#666' : '#999'} 
        />
      </View>
    </TouchableOpacity>
  );
};

export default function ExamsScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [mode, setMode] = useState<ExamMode>('practice');
  const [examId, setExamId] = useState('');
  const [password, setPassword] = useState('');
  
  // Practice mode selections
  const [subject, setSubject] = useState<string | null>(null);
  const [examType, setExamType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  
  // Modal states
  const [showSubjects, setShowSubjects] = useState(false);
  const [showExamTypes, setShowExamTypes] = useState(false);
  const [showDifficulties, setShowDifficulties] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const examTypes = ['4 Answer (40 Questions)', '5 Answer (50 Questions)'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Mock recent exams data - replace with actual data from your backend
  const recentExams = [
    {
      id: '1',
      title: 'Mathematics Final',
      score: 92,
      date: 'Today, 2:30 PM',
      type: 'practice' as const,
    },
    {
      id: '2',
      title: 'Physics Quiz',
      score: 85,
      date: 'Yesterday, 10:00 AM',
      type: 'competitive' as const,
    },
    {
      id: '3',
      title: 'Chemistry Test',
      score: 78,
      date: '2 days ago',
      type: 'practice' as const,
    },
  ];

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (mode === 'practice') {
      if (subject && examType && difficulty) {
        router.push({
          pathname: '/(app)/exam-sheet',
          params: {
            mode: 'practice',
            subject,
            type: examType,
            difficulty,
          }
        });
      }
    } else if (examId && password) {
      router.push({
        pathname: '/(app)/exam-sheet',
        params: {
          mode: 'competitive',
          examId,
          password,
        }
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Exams"
            value="24"
            trend={5}
            icon="document-text"
            color={isDarkMode ? '#4A80FF' : '#2196F3'}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Average Score"
            value="85%"
            trend={-2}
            icon="analytics"
            color={isDarkMode ? '#66BB6A' : '#4CAF50'}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Completed"
            value="18"
            icon="checkmark-circle"
            color={isDarkMode ? '#FFB74D' : '#FF9800'}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Time Spent"
            value="42h"
            trend={8}
            icon="time"
            color={isDarkMode ? '#BA68C8' : '#9C27B0'}
            isDarkMode={isDarkMode}
          />
        </View>

        <View style={[styles.modeContainer, isDarkMode && styles.darkModeContainer]}>
          <View style={[styles.modeToggle, isDarkMode && styles.darkModeToggle]}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'practice' && styles.activeModeButton,
                isDarkMode && styles.darkModeButton,
                mode === 'practice' && isDarkMode && styles.darkActiveModeButton,
              ]}
              onPress={() => {
                setMode('practice');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons 
                name="book-outline"
                size={20} 
                color={mode === 'practice' ? '#fff' : (isDarkMode ? '#fff' : '#666')}
              />
              <Text style={[
                styles.modeButtonText,
                mode === 'practice' && styles.activeModeButtonText,
                isDarkMode && styles.darkModeButtonText,
              ]}>
                Practice
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'competitive' && styles.activeModeButton,
                isDarkMode && styles.darkModeButton,
                mode === 'competitive' && isDarkMode && styles.darkActiveModeButton,
              ]}
              onPress={() => {
                setMode('competitive');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons 
                name="trophy-outline"
                size={20} 
                color={mode === 'competitive' ? '#fff' : (isDarkMode ? '#fff' : '#666')}
              />
              <Text style={[
                styles.modeButtonText,
                mode === 'competitive' && styles.activeModeButtonText,
                isDarkMode && styles.darkModeButtonText,
              ]}>
                Competitive
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            {mode === 'practice' ? (
              <>
                <SelectionField
                  value={subject}
                  onPress={() => setShowSubjects(true)}
                  placeholder="Select Subject"
                  isDarkMode={isDarkMode}
                  icon="book"
                />
                <SelectionField
                  value={examType}
                  onPress={() => setShowExamTypes(true)}
                  placeholder="Select Exam Type"
                  isDarkMode={isDarkMode}
                  icon="documents"
                />
                <SelectionField
                  value={difficulty}
                  onPress={() => setShowDifficulties(true)}
                  placeholder="Select Difficulty"
                  isDarkMode={isDarkMode}
                  icon="speedometer"
                />
              </>
            ) : (
              <>
                <TextInput
                  style={[
                    styles.input,
                    isDarkMode && styles.darkInput,
                  ]}
                  placeholder="Enter Exam ID"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                  value={examId}
                  onChangeText={setExamId}
                />
                <TextInput
                  style={[
                    styles.input,
                    isDarkMode && styles.darkInput,
                  ]}
                  placeholder="Enter Password"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </>
            )}

            <TouchableOpacity
              style={[
                styles.startButton,
                ((mode === 'practice' && (!subject || !examType || !difficulty)) ||
                (mode === 'competitive' && (!examId || !password))) && styles.disabledButton,
              ]}
              onPress={handleStart}
              disabled={
                (mode === 'practice' && (!subject || !examType || !difficulty)) ||
                (mode === 'competitive' && (!examId || !password))
              }
            >
              <Text style={styles.startButtonText}>
                Start Exam
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.recentExamsContainer, isDarkMode && styles.darkRecentExamsContainer]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Recent Exams
          </Text>
          <View style={styles.examsList}>
            {recentExams.map((exam) => (
              <ExamCard
                key={exam.id}
                title={exam.title}
                score={exam.score}
                date={exam.date}
                type={exam.type}
                isDarkMode={isDarkMode}
                onPress={() => {
                  router.push({
                    pathname: '/(app)/(tabs)/exams/review',
                    params: { examId: exam.id }
                  });
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <SelectionModal
        visible={showSubjects}
        onClose={() => setShowSubjects(false)}
        options={subjects}
        onSelect={setSubject}
        selected={subject}
        title="Select Subject"
        isDarkMode={isDarkMode}
      />

      <SelectionModal
        visible={showExamTypes}
        onClose={() => setShowExamTypes(false)}
        options={examTypes}
        onSelect={setExamType}
        selected={examType}
        title="Select Exam Type"
        isDarkMode={isDarkMode}
      />

      <SelectionModal
        visible={showDifficulties}
        onClose={() => setShowDifficulties(false)}
        options={difficulties}
        onSelect={setDifficulty}
        selected={difficulty}
        title="Select Difficulty"
        isDarkMode={isDarkMode}
      />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  darkStatTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  modeContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkModeContainer: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  darkModeToggle: {
    backgroundColor: '#2A2A2A',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeModeButton: {
    backgroundColor: '#2A67FF',
  },
  darkModeButton: {
    backgroundColor: '#2A2A2A',
  },
  darkActiveModeButton: {
    backgroundColor: '#2A67FF',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeModeButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  darkModeButtonText: {
    color: '#fff',
  },
  formContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  darkInput: {
    backgroundColor: '#2A2A2A',
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#2A67FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  darkModalContent: {
    backgroundColor: '#1E1E1E',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  darkModalTitle: {
    color: '#fff',
  },
  optionsList: {
    maxHeight: '80%',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5F6FA',
  },
  darkOptionItem: {
    backgroundColor: '#2A2A2A',
  },
  selectedOption: {
    backgroundColor: '#2A67FF20',
  },
  darkSelectedOption: {
    backgroundColor: '#2A67FF40',
  },
  optionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  darkOptionText: {
    color: '#fff',
  },
  selectedOptionText: {
    color: '#2A67FF',
    fontWeight: '500',
  },
  darkSelectedOptionText: {
    color: '#4A80FF',
    fontWeight: '500',
  },
  selectionField: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkSelectionField: {
    backgroundColor: '#2A2A2A',
  },
  selectionIcon: {
    marginRight: 12,
  },
  selectionText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  placeholderText: {
    color: '#999',
  },
  darkPlaceholderText: {
    color: '#666',
  },
  recentExamsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  darkRecentExamsContainer: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  examsList: {
    gap: 12,
  },
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 16,
  },
  darkExamCard: {
    backgroundColor: '#2A2A2A',
  },
  examCardLeft: {
    flex: 1,
    marginRight: 16,
  },
  examTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    gap: 4,
  },
  examTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  examDate: {
    fontSize: 14,
    color: '#666',
  },
  examCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  examScore: {
    fontSize: 24,
    fontWeight: '600',
  },
  darkSubText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  examType: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
}); 