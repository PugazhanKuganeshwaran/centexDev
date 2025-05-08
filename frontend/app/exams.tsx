import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// This would come from your authentication context
const userRole = 'student'; // 'student' | 'teacher' | 'principal'

const ExamCard = ({ title, date, time, status }: { title: string; date: string; time: string; status: string }) => (
  <TouchableOpacity style={styles.examCard}>
    <View style={styles.examIcon}>
      <Ionicons name="document-text-outline" size={24} color="#2A67FF" />
    </View>
    <View style={styles.examContent}>
      <Text style={styles.examTitle}>{title}</Text>
      <Text style={styles.examDateTime}>{date} • {time}</Text>
      <View style={[styles.examStatus, { backgroundColor: status === 'Completed' ? '#E8F5E9' : status === 'Upcoming' ? '#FFF3E0' : '#F0F4FF' }]}>
        <Text style={[styles.examStatusText, { color: status === 'Completed' ? '#4CAF50' : status === 'Upcoming' ? '#FF9800' : '#2A67FF' }]}>
          {status}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const StudentExams = () => (
  <View style={styles.content}>
    <Text style={styles.title}>My Exams</Text>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.examsList}>
        <ExamCard
          title="Mathematics Final Exam"
          date="March 15, 2024"
          time="9:00 AM"
          status="Upcoming"
        />
        <ExamCard
          title="Physics Mid-Term"
          date="March 10, 2024"
          time="11:00 AM"
          status="Completed"
        />
        <ExamCard
          title="Chemistry Quiz"
          date="March 20, 2024"
          time="2:00 PM"
          status="Scheduled"
        />
      </View>
    </ScrollView>
  </View>
);

const TeacherExams = () => (
  <View style={styles.content}>
    <Text style={styles.title}>Exam Management</Text>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.examsList}>
        <ExamCard
          title="Class 10A - Mathematics Final"
          date="March 15, 2024"
          time="9:00 AM"
          status="Upcoming"
        />
        <ExamCard
          title="Class 11B - Physics Mid-Term"
          date="March 10, 2024"
          time="11:00 AM"
          status="Completed"
        />
        <ExamCard
          title="Class 10B - Chemistry Quiz"
          date="March 20, 2024"
          time="2:00 PM"
          status="Scheduled"
        />
      </View>
    </ScrollView>
  </View>
);

const PrincipalExams = () => (
  <View style={styles.content}>
    <Text style={styles.title}>School Examinations</Text>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.examsList}>
        <ExamCard
          title="Final Examinations - All Classes"
          date="March 15-30, 2024"
          time="As per schedule"
          status="Upcoming"
        />
        <ExamCard
          title="Mid-Term Examinations"
          date="March 1-10, 2024"
          time="Completed"
          status="Completed"
        />
        <ExamCard
          title="Monthly Assessment Tests"
          date="March 25, 2024"
          time="All Day"
          status="Scheduled"
        />
      </View>
    </ScrollView>
  </View>
);

export default function ExamsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>My Exams</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.examsList}>
            <ExamCard
              title="Mathematics Final Exam"
              date="March 15, 2024"
              time="9:00 AM"
              status="Upcoming"
            />
            <ExamCard
              title="Physics Mid-Term"
              date="March 10, 2024"
              time="11:00 AM"
              status="Completed"
            />
            <ExamCard
              title="Chemistry Quiz"
              date="March 20, 2024"
              time="2:00 PM"
              status="Scheduled"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  examsList: {
    gap: 16,
  },
  examCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  examIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  examContent: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  examDateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  examStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  examStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 