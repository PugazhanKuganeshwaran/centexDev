import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const handleSignIn = () => {
    // Implement sign in logic here
    console.log('Sign in attempted');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>And make education simple</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Phone no / email"
          value={phoneOrEmail}
          onChangeText={setPhoneOrEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Are you new user? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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
  },
  button: {
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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