import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const SignIn = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { setIsAuthenticated } = useAuth();

  const handleSignIn = () => {
    // Set authenticated to true
    setIsAuthenticated(true);
    // Navigate to home
    router.replace('/(app)/(tabs)/home');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Sign In</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubText]}>And make education simple</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Phone no / email"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={phoneOrEmail}
          onChangeText={setPhoneOrEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Password"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="OTP"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[styles.button, isDarkMode && styles.darkButton]} 
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDarkMode && styles.darkSubText]}>Are you new user? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signUpLink}>Sign UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#999',
  },
  form: {
    gap: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
    color: '#1A1A1A',
  },
  darkInput: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    color: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  darkButton: {
    backgroundColor: '#2A67FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  signUpLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignIn; 