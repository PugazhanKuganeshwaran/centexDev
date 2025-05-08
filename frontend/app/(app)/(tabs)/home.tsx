import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  RefreshControl,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import NotificationPopup from '@/components/NotificationPopup';
import ProfilePopup from '@/components/ProfilePopup';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const WeatherWidget = ({ isDarkMode }) => (
  <LinearGradient
    colors={isDarkMode ? ['#1A237E', '#0D47A1'] : ['#E3F2FD', '#BBDEFB']}
    style={styles.weatherWidget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.weatherInfo}>
      <Ionicons name="partly-sunny" size={32} color={isDarkMode ? '#FFF' : '#2196F3'} />
      <Text style={[styles.temperature, isDarkMode && styles.darkText]}>24°C</Text>
    </View>
    <Text style={[styles.weatherText, isDarkMode && styles.darkSubText]}>Perfect for outdoor activities</Text>
  </LinearGradient>
);

const StudyStreak = ({ isDarkMode }) => (
  <View style={[styles.streakContainer, isDarkMode && styles.darkCard]}>
    <View style={styles.streakHeader}>
      <Text style={[styles.streakTitle, isDarkMode && styles.darkText]}>Study Streak</Text>
      <View style={[styles.streakBadge, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.streakBadgeText}>7 Days</Text>
      </View>
    </View>
    <View style={styles.streakDays}>
      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
        <View 
          key={day} 
          style={[
            styles.streakDay,
            { backgroundColor: day <= 5 ? '#4CAF50' : isDarkMode ? '#333' : '#E8E8E8' }
          ]} 
        />
      ))}
    </View>
  </View>
);

const StudyTodo = ({ isDarkMode }) => {
  const [todos, setTodos] = useState([
    { id: '1', task: 'Review Physics Chapter 5', completed: true, subject: 'Physics', duration: '30 min' },
    { id: '2', task: 'Complete Math Assignment', completed: false, subject: 'Mathematics', duration: '45 min' },
    { id: '3', task: 'Practice Chemistry Problems', completed: false, subject: 'Chemistry', duration: '1 hr' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    subject: 'Physics',
    duration: '30 min'
  });

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAddTodo = () => {
    if (newTask.task.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          ...newTask,
          completed: false
        }
      ]);
      setNewTask({ task: '', subject: 'Physics', duration: '30 min' });
      setShowForm(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Physics':
        return '#2196F3';
      case 'Mathematics':
        return '#4CAF50';
      case 'Chemistry':
        return '#FF9800';
      default:
        return '#9C27B0';
    }
  };

  return (
    <View style={[styles.todoContainer, isDarkMode && styles.darkCard]}>
      <View style={styles.todoHeader}>
        <Text style={[styles.todoTitle, isDarkMode && styles.darkText]}>Study Tasks</Text>
        <TouchableOpacity 
          style={[styles.addButton, isDarkMode && styles.darkAddButton]}
          onPress={() => {
            setShowForm(!showForm);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons 
            name={showForm ? "close" : "add"} 
            size={20} 
            color={isDarkMode ? '#fff' : '#2A67FF'} 
          />
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={[styles.todoForm, isDarkMode && styles.darkTodoForm]}>
          <TextInput
            style={[styles.todoInput, isDarkMode && styles.darkTodoInput]}
            placeholder="What do you need to study?"
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
            value={newTask.task}
            onChangeText={(text) => setNewTask({ ...newTask, task: text })}
          />
          <View style={styles.todoFormRow}>
            <TouchableOpacity
              style={[styles.subjectSelector, isDarkMode && styles.darkSubjectSelector]}
              onPress={() => {
                const subjects = ['Physics', 'Mathematics', 'Chemistry'];
                const currentIndex = subjects.indexOf(newTask.subject);
                const nextSubject = subjects[(currentIndex + 1) % subjects.length];
                setNewTask({ ...newTask, subject: nextSubject });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={{ color: getSubjectColor(newTask.subject) }}>{newTask.subject}</Text>
              <Ionicons name="chevron-down" size={16} color={getSubjectColor(newTask.subject)} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.durationSelector, isDarkMode && styles.darkDurationSelector]}
              onPress={() => {
                const durations = ['30 min', '45 min', '1 hr', '2 hr'];
                const currentIndex = durations.indexOf(newTask.duration);
                const nextDuration = durations[(currentIndex + 1) % durations.length];
                setNewTask({ ...newTask, duration: nextDuration });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="time-outline" size={16} color={isDarkMode ? '#fff' : '#666'} />
              <Text style={[styles.durationText, isDarkMode && styles.darkText]}>{newTask.duration}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addTaskButton,
                !newTask.task.trim() && styles.disabledAddTaskButton
              ]}
              onPress={handleAddTodo}
              disabled={!newTask.task.trim()}
            >
              <Text style={styles.addTaskButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {todos.map(todo => (
        <TouchableOpacity
          key={todo.id}
          style={[
            styles.todoItem,
            isDarkMode && styles.darkTodoItem,
            todo.completed && styles.completedTodo
          ]}
          onPress={() => handleToggleTodo(todo.id)}
        >
          <View style={styles.todoCheckbox}>
            <View style={[
              styles.checkbox,
              isDarkMode && styles.darkCheckbox,
              todo.completed && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
            ]}>
              {todo.completed && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </View>
          </View>
          <View style={styles.todoContent}>
            <Text style={[
              styles.todoText,
              isDarkMode && styles.darkText,
              todo.completed && styles.completedText
            ]}>
              {todo.task}
            </Text>
            <View style={styles.todoMeta}>
              <View style={[
                styles.subjectTag,
                { backgroundColor: getSubjectColor(todo.subject) + '20' }
              ]}>
                <Text style={[
                  styles.subjectText,
                  { color: getSubjectColor(todo.subject) }
                ]}>
                  {todo.subject}
                </Text>
              </View>
              <Text style={[styles.duration, isDarkMode && styles.darkSubText]}>
                {todo.duration}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const TimeTable = ({ isDarkMode }) => {
  const currentHour = new Date().getHours();
  
  return (
    <View style={[styles.timeTableContainer, isDarkMode && styles.darkCard]}>
      <Text style={[styles.timeTableTitle, isDarkMode && styles.darkText]}>Today's Schedule</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { time: '09:00', subject: 'Mathematics', room: '301', isActive: currentHour === 9 },
          { time: '10:30', subject: 'Physics', room: '205', isActive: currentHour === 10 },
          { time: '12:00', subject: 'Chemistry', room: '405', isActive: currentHour === 12 },
          { time: '14:00', subject: 'Biology', room: '302', isActive: currentHour === 14 },
        ].map((class_, index) => (
          <View 
            key={index}
            style={[
              styles.classCard,
              isDarkMode && styles.darkClassCard,
              class_.isActive && styles.activeClassCard
            ]}
          >
            <Text style={[styles.classTime, isDarkMode && styles.darkText]}>{class_.time}</Text>
            <Text style={[styles.classSubject, isDarkMode && styles.darkText]}>{class_.subject}</Text>
            <View style={styles.classRoom}>
              <Ionicons name="location" size={12} color={isDarkMode ? '#999' : '#666'} />
              <Text style={[styles.classRoomText, isDarkMode && styles.darkSubText]}>Room {class_.room}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const QuickAction = ({ title, icon, onPress, color, isDarkMode }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[
          styles.quickAction, 
          { 
            borderColor: isDarkMode ? color + '30' : color + '40',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
            shadowColor: isDarkMode ? color + '20' : color + '10',
          }
        ]} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={[
          styles.quickActionIcon, 
          { 
            backgroundColor: isDarkMode ? color + '15' : color + '20',
            borderColor: isDarkMode ? color + '20' : 'transparent',
            borderWidth: isDarkMode ? 1 : 0,
          }
        ]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.quickActionText, isDarkMode && styles.darkText]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PerformanceCard = ({ title, value, status, icon, trend, isDarkMode }) => {
  const getGradientColors = () => {
    switch (status) {
      case 'excellent':
        return isDarkMode ? ['#1B5E20', '#2E7D32'] : ['#E8F5E9', '#C8E6C9'];
      case 'good':
        return isDarkMode ? ['#0D47A1', '#1976D2'] : ['#E3F2FD', '#BBDEFB'];
      case 'average':
        return isDarkMode ? ['#E65100', '#F57C00'] : ['#FFF3E0', '#FFE0B2'];
      default:
        return isDarkMode ? ['#1A237E', '#283593'] : ['#E8EAF6', '#C5CAE9'];
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'excellent':
        return '#4CAF50';
      case 'good':
        return '#2196F3';
      case 'average':
        return '#FF9800';
      default:
        return '#3F51B5';
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={[styles.performanceCard, isDarkMode && styles.darkPerformanceCard]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.performanceHeader}>
        <Text style={[styles.performanceTitle, isDarkMode && styles.darkText]}>
          {title}
        </Text>
        <View style={[styles.performanceIcon, { backgroundColor: getIconColor() + '20' }]}>
          <Ionicons name={icon} size={20} color={getIconColor()} />
        </View>
      </View>
      <Text style={[styles.performanceValue, isDarkMode && styles.darkText]}>
        {value}
      </Text>
      <View style={styles.performanceTrend}>
        <Ionicons
          name={trend > 0 ? 'trending-up' : 'trending-down'}
          size={16}
          color={trend > 0 ? '#4CAF50' : '#F44336'}
        />
        <Text style={[
          styles.performanceTrendValue,
          { color: trend > 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {Math.abs(trend)}%
        </Text>
      </View>
    </LinearGradient>
  );
};

const ActivityCard = ({ title, subject, time, status, icon, isDarkMode }) => {
  const getStatusColors = () => {
    switch (status) {
      case 'completed':
        return {
          bg: isDarkMode ? '#1B5E20' : '#E8F5E9',
          text: '#4CAF50'
        };
      case 'ongoing':
        return {
          bg: isDarkMode ? '#0D47A1' : '#E3F2FD',
          text: '#2196F3'
        };
      case 'upcoming':
        return {
          bg: isDarkMode ? '#E65100' : '#FFF3E0',
          text: '#FF9800'
        };
      default:
        return {
          bg: isDarkMode ? '#1A237E' : '#E8EAF6',
          text: '#3F51B5'
        };
    }
  };

  const colors = getStatusColors();

  return (
    <TouchableOpacity 
      style={[
        styles.activityCard, 
        isDarkMode && styles.darkCard,
        { borderColor: isDarkMode ? '#333' : '#E8E8E8' }
      ]}
      activeOpacity={0.7}
    >
      <View style={[
        styles.activityIcon,
        { backgroundColor: colors.bg }
      ]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={colors.text} 
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, isDarkMode && styles.darkText]}>{title}</Text>
        <Text style={[styles.activitySubject, isDarkMode && styles.darkSubText]}>{subject}</Text>
        <Text style={[styles.activityTime, isDarkMode && styles.darkSubText]}>{time}</Text>
      </View>
      <View style={[
        styles.activityStatus,
        { backgroundColor: colors.bg }
      ]}>
        <Text style={[
          styles.activityStatusText,
          { color: colors.text }
        ]}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const UpcomingEvent = ({ title, date, time, type, location, isDarkMode }) => {
  const getEventTypeColors = () => {
    switch (type) {
      case 'exam':
        return {
          bg: isDarkMode ? '#1A237E' : '#E8EAF6',
          text: '#3F51B5',
          icon: 'document-text'
        };
      case 'assignment':
        return {
          bg: isDarkMode ? '#0D47A1' : '#E3F2FD',
          text: '#2196F3',
          icon: 'create'
        };
      case 'meeting':
        return {
          bg: isDarkMode ? '#1B5E20' : '#E8F5E9',
          text: '#4CAF50',
          icon: 'people'
        };
      default:
        return {
          bg: isDarkMode ? '#E65100' : '#FFF3E0',
          text: '#FF9800',
          icon: 'calendar'
        };
    }
  };

  const typeConfig = getEventTypeColors();

  return (
    <TouchableOpacity 
      style={[
        styles.eventCard, 
        isDarkMode && styles.darkCard,
        { borderColor: isDarkMode ? '#333' : '#E8E8E8' }
      ]}
      activeOpacity={0.7}
    >
      <View style={[
        styles.eventIcon, 
        { backgroundColor: typeConfig.bg }
      ]}>
        <Ionicons name={typeConfig.icon} size={24} color={typeConfig.text} />
      </View>
      <View style={styles.eventContent}>
        <Text style={[styles.eventTitle, isDarkMode && styles.darkText]}>{title}</Text>
        <Text style={[styles.eventDateTime, isDarkMode && styles.darkSubText]}>{date} • {time}</Text>
        <Text style={[styles.eventLocation, isDarkMode && styles.darkSubText]}>{location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SubjectCard = ({ 
  subject, 
  marks, 
  highest, 
  lowest, 
  highestScorer, 
  lowestScorer,
  isDarkMode
}) => (
  <View style={[styles.subjectCard, isDarkMode && styles.darkCard]}>
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
}) => (
  <View style={[styles.comparisonContainer, isDarkMode && styles.darkCard]}>
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

const MarksheetModal = ({ visible, onClose, isDarkMode }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, isDarkMode && styles.darkCard]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Term 1 Marksheet</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#666'} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
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
      </View>
    </View>
  </Modal>
);

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [marksheetVisible, setMarksheetVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TimeTable isDarkMode={isDarkMode} />

        <View style={styles.streakContainer}>
          <StudyStreak isDarkMode={isDarkMode} />
        </View>
        <StudyTodo isDarkMode={isDarkMode} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Performance Overview</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.performanceCards}
          >
            <PerformanceCard
              title="Academic Report"
              value="A+"
              status="excellent"
              icon="school"
              trend={8}
              isDarkMode={isDarkMode}
            />
            <PerformanceCard
              title="Attendance"
              value="92%"
              status="good"
              icon="calendar-check"
              trend={4}
              isDarkMode={isDarkMode}
            />
            <PerformanceCard
              title="Sports Report"
              value="92%"
              status="good"
              icon="basketball"
              trend={5}
              isDarkMode={isDarkMode}
            />
            <PerformanceCard
              title="Club Activity"
              value="4.8"
              status="excellent"
              icon="people"
              trend={10}
              isDarkMode={isDarkMode}
            />
            <PerformanceCard
              title="Study Routine"
              value="85%"
              status="good"
              icon="time"
              trend={3}
              isDarkMode={isDarkMode}
            />
          </ScrollView>

          <View style={styles.marksheetContainer}>
            <View style={[styles.marksheetHeader, isDarkMode && styles.darkCard]}>
              <Text style={[styles.marksheetTitle, isDarkMode && styles.darkText]}>Term & Annual Marksheet</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(app)/marksheet');
                }}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#2A67FF" />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.marksheetCard, isDarkMode && styles.darkCard]}>
              <View style={styles.termSection}>
                <Text style={[styles.termTitle, isDarkMode && styles.darkText]}>Term 1</Text>
                <View style={styles.subjectScores}>
                  <View style={styles.subjectScore}>
                    <Text style={[styles.subjectName, isDarkMode && styles.darkSubText]}>Mathematics</Text>
                    <Text style={[styles.score, isDarkMode && styles.darkText]}>95%</Text>
                  </View>
                  <View style={styles.subjectScore}>
                    <Text style={[styles.subjectName, isDarkMode && styles.darkSubText]}>Physics</Text>
                    <Text style={[styles.score, isDarkMode && styles.darkText]}>88%</Text>
                  </View>
                  <View style={styles.subjectScore}>
                    <Text style={[styles.subjectName, isDarkMode && styles.darkSubText]}>Chemistry</Text>
                    <Text style={[styles.score, isDarkMode && styles.darkText]}>92%</Text>
                  </View>
                </View>
              </View>
              
              <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
              
              <View style={styles.termSection}>
                <Text style={[styles.termTitle, isDarkMode && styles.darkText]}>Annual</Text>
                <View style={styles.subjectScores}>
                  <View style={styles.subjectScore}>
                    <Text style={[styles.subjectName, isDarkMode && styles.darkSubText]}>Overall Grade</Text>
                    <Text style={[styles.score, { color: '#4CAF50' }]}>A+</Text>
                  </View>
                  <View style={styles.subjectScore}>
                    <Text style={[styles.subjectName, isDarkMode && styles.darkSubText]}>Percentage</Text>
                    <Text style={[styles.score, isDarkMode && styles.darkText]}>91.6%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Recent Activity</Text>
          <View style={styles.activities}>
            <ActivityCard
              title="Mathematics Quiz"
              subject="Advanced Calculus"
              time="2 hours ago"
              status="completed"
              icon="checkmark-circle"
              isDarkMode={isDarkMode}
            />
            <ActivityCard
              title="Physics Assignment"
              subject="Quantum Mechanics"
              time="5 hours ago"
              status="ongoing"
              icon="time"
              isDarkMode={isDarkMode}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Upcoming Events</Text>
          <View style={styles.events}>
            <UpcomingEvent
              title="Final Exam"
              date="March 15"
              time="10:00 AM"
              type="exam"
              location="Room 301"
              isDarkMode={isDarkMode}
            />
            <UpcomingEvent
              title="Project Submission"
              date="March 20"
              time="11:59 PM"
              type="assignment"
              location="Online"
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </ScrollView>

      <NotificationPopup
        visible={isNotificationVisible}
        onClose={() => setIsNotificationVisible(false)}
      />
      
      <ProfilePopup
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />

      <MarksheetModal 
        visible={marksheetVisible} 
        onClose={() => setMarksheetVisible(false)}
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
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#999',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  performanceCards: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  performanceCard: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
  },
  darkPerformanceCard: {
    backgroundColor: '#1E1E1E',
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  performanceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  performanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  performanceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  performanceTrendValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  activities: {
    marginTop: 8,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  darkCard: {
    backgroundColor: '#1E1E1E',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  activitySubject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  activityStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  events: {
    marginTop: 8,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  streakContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  streakBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  streakDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakDay: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timeTableContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  timeTableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    minWidth: 120,
  },
  darkClassCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  activeClassCard: {
    borderColor: '#2A67FF',
    borderWidth: 2,
  },
  classTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  classRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classRoomText: {
    fontSize: 12,
    color: '#666',
  },
  todoContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkAddButton: {
    backgroundColor: '#1E1E1E',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  darkTodoItem: {
    borderBottomColor: '#333',
  },
  completedTodo: {
    opacity: 0.7,
  },
  todoCheckbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCheckbox: {
    borderColor: '#999',
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  todoForm: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  darkTodoForm: {
    backgroundColor: '#2A2A2A',
  },
  todoInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  darkTodoInput: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
  },
  todoFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  darkSubjectSelector: {
    backgroundColor: '#1E1E1E',
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  darkDurationSelector: {
    backgroundColor: '#1E1E1E',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  addTaskButton: {
    backgroundColor: '#2A67FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 'auto',
  },
  disabledAddTaskButton: {
    backgroundColor: '#ccc',
  },
  addTaskButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  eventDateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: '#666',
  },
  marksheetContainer: {
    marginTop: 24,
  },
  marksheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  marksheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2A67FF',
    fontWeight: '500',
  },
  marksheetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  termSection: {
    marginBottom: 12,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  subjectScores: {
    gap: 8,
  },
  subjectScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 14,
    color: '#666',
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  darkDivider: {
    backgroundColor: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  comparisonContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
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