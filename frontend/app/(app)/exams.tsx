import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type ExamMode = 'practice' | 'competitive';

// Sample data for dropdowns
const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
];

const types = [
  {
    id: '4answer',
    name: '4 Answer MCQ',
    questions: 40,
  },
  {
    id: '5answer',
    name: '5 Answer MCQ',
    questions: 50,
  },
];

const hardnessLevels = [
  'Easy',
  'Medium',
  'Hard',
  'Expert',
];

const SelectionModal = ({ 
  visible, 
  onClose, 
  options, 
  onSelect, 
  selected,
  title,
  isDarkMode,
  isTypeSelection = false,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
        <View style={[styles.modalHeader, isDarkMode && styles.darkModalHeader]}>
          <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons 
              name="close" 
              size={24} 
              color={isDarkMode ? '#fff' : '#000'} 
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.optionsList}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                isDarkMode && styles.darkOptionItem,
                selected === (isTypeSelection ? option.id : option) && styles.selectedOption,
                selected === (isTypeSelection ? option.id : option) && isDarkMode && styles.darkSelectedOption,
              ]}
              onPress={() => {
                onSelect(isTypeSelection ? option.id : option);
                onClose();
              }}
            >
              {isTypeSelection ? (
                <View style={styles.typeOptionContent}>
                  <Text 
                    style={[
                      styles.optionText,
                      isDarkMode && styles.darkText,
                      selected === option.id && styles.selectedOptionText,
                    ]}
                  >
                    {option.name}
                  </Text>
                  <Text 
                    style={[
                      styles.questionCount,
                      isDarkMode && styles.darkSubText,
                      selected === option.id && styles.selectedQuestionCount,
                    ]}
                  >
                    {option.questions} Questions
                  </Text>
                </View>
              ) : (
                <Text 
                  style={[
                    styles.optionText,
                    isDarkMode && styles.darkText,
                    selected === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              )}
              {((isTypeSelection && selected === option.id) || (!isTypeSelection && selected === option)) && (
                <Ionicons 
                  name="checkmark" 
                  size={20} 
                  color="#2A67FF" 
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const SelectionField = ({ 
  value, 
  onPress, 
  placeholder,
  isDarkMode,
  isTypeSelection = false,
  selectedType = null,
}) => (
  <TouchableOpacity
    style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}
    onPress={onPress}
  >
    <View style={styles.selectionField}>
      <Text 
        style={[
          styles.selectionText,
          !value && styles.placeholderText,
          isDarkMode && (value ? styles.darkText : styles.darkPlaceholderText)
        ]}
      >
        {isTypeSelection && selectedType 
          ? `${types.find(t => t.id === value)?.name} (${types.find(t => t.id === value)?.questions} Questions)`
          : value || placeholder}
      </Text>
      <Ionicons 
        name="chevron-down" 
        size={20} 
        color={isDarkMode ? '#999' : '#666'} 
      />
    </View>
  </TouchableOpacity>
);

const ExamCard = ({ title, subject, date, time, status, location, type, isDarkMode }) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return {
          color: '#2196F3',
          icon: 'time',
          bgColor: isDarkMode ? '#1A237E' : '#E3F2FD',
        };
      case 'completed':
        return {
          color: '#4CAF50',
          icon: 'checkmark-circle',
          bgColor: isDarkMode ? '#1B5E20' : '#E8F5E9',
        };
      case 'ongoing':
        return {
          color: '#FF9800',
          icon: 'alert-circle',
          bgColor: isDarkMode ? '#E65100' : '#FFF3E0',
        };
      default:
        return {
          color: '#F44336',
          icon: 'close-circle',
          bgColor: isDarkMode ? '#B71C1C' : '#FFEBEE',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <TouchableOpacity style={[styles.examCard, { backgroundColor: statusConfig.bgColor }]}>
      <View style={styles.cardContent}>
        <View style={styles.examHeader}>
          <View style={styles.examType}>
            <Ionicons 
              name={type === 'Final' ? 'trophy' : type === 'Mid-Term' ? 'flag' : 'document-text'} 
              size={16} 
              color={statusConfig.color} 
            />
            <Text style={[styles.examTypeText, { color: statusConfig.color }]}>{type}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{status}</Text>
          </View>
        </View>

        <Text style={[styles.examTitle, isDarkMode && styles.darkText]}>{title}</Text>
        <Text style={[styles.examSubject, isDarkMode && styles.darkSubText]}>{subject}</Text>

        <View style={styles.examDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={isDarkMode ? '#999' : '#666'} />
            <Text style={[styles.detailText, isDarkMode && styles.darkSubText]}>{date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={isDarkMode ? '#999' : '#666'} />
            <Text style={[styles.detailText, isDarkMode && styles.darkSubText]}>{time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={isDarkMode ? '#999' : '#666'} />
            <Text style={[styles.detailText, isDarkMode && styles.darkSubText]}>{location}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}
          >
            <Text style={[styles.actionButtonText, { color: statusConfig.color }]}>
              {status === 'completed' ? 'View Results' : 'View Details'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={statusConfig.color} />
          </TouchableOpacity>
          {status === 'upcoming' && (
            <TouchableOpacity style={styles.reminderButton}>
              <Ionicons name="notifications-outline" size={20} color={isDarkMode ? '#999' : '#666'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StatCard = ({ title, value, trend, icon, color, isDarkMode }) => (
  <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#333' : color + '10' }]}>
    <View style={styles.statHeader}>
      <View style={[styles.statIcon, { backgroundColor: isDarkMode ? '#444' : color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trend > 0 ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={trend > 0 ? '#4CAF50' : '#F44336'} 
          />
          <Text 
            style={[
              styles.trendText, 
              { color: trend > 0 ? '#4CAF50' : '#F44336' }
            ]}
          >
            {Math.abs(trend)}%
          </Text>
        </View>
      )}
    </View>
    <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{value}</Text>
    <Text style={[styles.statTitle, isDarkMode && styles.darkSubText]}>{title}</Text>
  </View>
);

const ExamScreen = () => {
  const { isDarkMode } = useTheme();
  const [mode, setMode] = useState<ExamMode>('practice');
  
  // State for selection values
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedHardness, setSelectedHardness] = useState('');
  
  // State for modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const renderPracticeForm = () => (
    <View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
      <SelectionField
        value={selectedSubject}
        placeholder="Select Subject"
        onPress={() => setActiveModal('subject')}
        isDarkMode={isDarkMode}
      />
      <SelectionField
        value={selectedType}
        placeholder="Select Type"
        onPress={() => setActiveModal('type')}
        isDarkMode={isDarkMode}
        isTypeSelection={true}
        selectedType={selectedType}
      />
      <SelectionField
        value={selectedHardness}
        placeholder="Select Hardness"
        onPress={() => setActiveModal('hardness')}
        isDarkMode={isDarkMode}
      />
      <TouchableOpacity 
        style={[
          styles.startButton,
          (!selectedSubject || !selectedType || !selectedHardness) && styles.disabledButton
        ]}
        disabled={!selectedSubject || !selectedType || !selectedHardness}
      >
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>

      <SelectionModal
        visible={activeModal === 'subject'}
        onClose={() => setActiveModal(null)}
        options={subjects}
        onSelect={setSelectedSubject}
        selected={selectedSubject}
        title="Select Subject"
        isDarkMode={isDarkMode}
      />
      <SelectionModal
        visible={activeModal === 'type'}
        onClose={() => setActiveModal(null)}
        options={types}
        onSelect={setSelectedType}
        selected={selectedType}
        title="Select Type"
        isDarkMode={isDarkMode}
        isTypeSelection={true}
      />
      <SelectionModal
        visible={activeModal === 'hardness'}
        onClose={() => setActiveModal(null)}
        options={hardnessLevels}
        onSelect={setSelectedHardness}
        selected={selectedHardness}
        title="Select Hardness"
        isDarkMode={isDarkMode}
      />
    </View>
  );

  const renderCompetitiveForm = () => (
    <View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
      <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Enter Exam ID"
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
        />
      </View>
      <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Exam Pass"
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.content, isDarkMode && styles.darkContent]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Exam</Text>

        <View style={styles.modeContainer}>
          <LinearGradient
            colors={isDarkMode ? ['#1E1E1E', '#1E1E1E'] : ['#fff', '#fff']}
            style={[styles.modeSelector, isDarkMode && styles.darkModeSelector]}
          >
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'practice' && styles.activeModeButton,
                isDarkMode && styles.darkModeButton,
                mode === 'practice' && isDarkMode && styles.darkActiveModeButton,
              ]}
              onPress={() => setMode('practice')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'practice' && styles.activeModeButtonText,
                  isDarkMode && styles.darkModeButtonText,
                  mode === 'practice' && isDarkMode && styles.darkActiveModeButtonText,
                ]}
              >
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
              onPress={() => setMode('competitive')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'competitive' && styles.activeModeButtonText,
                  isDarkMode && styles.darkModeButtonText,
                  mode === 'competitive' && isDarkMode && styles.darkActiveModeButtonText,
                ]}
              >
                Competitive
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {mode === 'practice' ? renderPracticeForm() : renderCompetitiveForm()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  darkContent: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2A67FF',
    marginBottom: 24,
  },
  darkText: {
    color: '#fff',
  },
  modeContainer: {
    marginBottom: 32,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkModeSelector: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },
  darkModeButton: {
    backgroundColor: 'transparent',
  },
  activeModeButton: {
    backgroundColor: '#2A67FF',
  },
  darkActiveModeButton: {
    backgroundColor: '#2A67FF',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  darkModeButtonText: {
    color: '#999',
  },
  activeModeButtonText: {
    color: '#fff',
  },
  darkActiveModeButtonText: {
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  darkFormContainer: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  darkInputContainer: {
    backgroundColor: '#333',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  darkInput: {
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#2A67FF',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  darkSubText: {
    color: '#999',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },
  darkSearchBar: {
    backgroundColor: '#333',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 5,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  statCard: {
    padding: 15,
    borderRadius: 12,
    width: 160,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2196F3',
  },
  examCard: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 15,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  examType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  examTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  examSubject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  examDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reminderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
  },
  selectionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  placeholderText: {
    color: '#666',
  },
  darkPlaceholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  darkModalContent: {
    backgroundColor: '#1E1E1E',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  darkModalHeader: {
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  optionsList: {
    padding: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  darkOptionItem: {
    backgroundColor: '#333',
  },
  selectedOption: {
    backgroundColor: '#F0F4FF',
  },
  darkSelectedOption: {
    backgroundColor: '#1A237E',
  },
  optionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedOptionText: {
    color: '#2A67FF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  typeOptionContent: {
    flex: 1,
  },
  questionCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectedQuestionCount: {
    color: '#2A67FF',
  },
});

export default ExamScreen; 