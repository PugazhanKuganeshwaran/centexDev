import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type UserType = 'Student' | 'Teacher' | 'Principal';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | '';
}

interface ZoneInfo {
  province: string;
  district: string;
  school: string;
  languageMedium: string;
}

interface AuthInfo {
  userType: UserType;
  token?: string;
  admissionNumber?: string;
  nicNumber?: string;
  registerId?: string;
}

interface AccountInfo {
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
  });
  const [zoneInfo, setZoneInfo] = useState<ZoneInfo>({
    province: '',
    district: '',
    school: '',
    languageMedium: '',
  });
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    userType: 'Student',
    token: '',
    admissionNumber: '',
    nicNumber: '',
    registerId: '',
  });
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((num) => (
          <View
            key={num}
            style={[
              styles.stepDot,
              { backgroundColor: step >= num ? '#2563EB' : '#E2E8F0' },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderPersonalInfoStep = () => (
    <View style={styles.form}>
      <Text style={styles.stepTitle}>Personal Info</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={personalInfo.firstName}
        onChangeText={(text) =>
          setPersonalInfo({ ...personalInfo, firstName: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={personalInfo.lastName}
        onChangeText={(text) =>
          setPersonalInfo({ ...personalInfo, lastName: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Select Date of Birth"
        value={personalInfo.dateOfBirth}
        onChangeText={(text) =>
          setPersonalInfo({ ...personalInfo, dateOfBirth: text })
        }
      />
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            personalInfo.gender === 'Male' && styles.genderButtonActive,
          ]}
          onPress={() => setPersonalInfo({ ...personalInfo, gender: 'Male' })}
        >
          <Text
            style={[
              styles.genderText,
              personalInfo.gender === 'Male' && styles.genderTextActive,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            personalInfo.gender === 'Female' && styles.genderButtonActive,
          ]}
          onPress={() => setPersonalInfo({ ...personalInfo, gender: 'Female' })}
        >
          <Text
            style={[
              styles.genderText,
              personalInfo.gender === 'Female' && styles.genderTextActive,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderZoneInfoStep = () => (
    <View style={styles.form}>
      <Text style={styles.stepTitle}>Zone Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Select Province"
        value={zoneInfo.province}
        onChangeText={(text) => setZoneInfo({ ...zoneInfo, province: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Select District"
        value={zoneInfo.district}
        onChangeText={(text) => setZoneInfo({ ...zoneInfo, district: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Select School"
        value={zoneInfo.school}
        onChangeText={(text) => setZoneInfo({ ...zoneInfo, school: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Select Language Medium"
        value={zoneInfo.languageMedium}
        onChangeText={(text) =>
          setZoneInfo({ ...zoneInfo, languageMedium: text })
        }
      />
    </View>
  );

  const renderAuthInfoStep = () => (
    <View style={styles.form}>
      <Text style={styles.stepTitle}>Auth Info</Text>
      <View style={styles.userTypeContainer}>
        {(['Student', 'Teacher', 'Principal'] as UserType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.userTypeButton,
              authInfo.userType === type && styles.userTypeButtonActive,
            ]}
            onPress={() => setAuthInfo({ ...authInfo, userType: type })}
          >
            <Text
              style={[
                styles.userTypeText,
                authInfo.userType === type && styles.userTypeTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {authInfo.userType === 'Student' && (
        <TextInput
          style={styles.input}
          placeholder="Admission Number"
          value={authInfo.admissionNumber}
          onChangeText={(text) =>
            setAuthInfo({ ...authInfo, admissionNumber: text })
          }
        />
      )}
      {authInfo.userType === 'Teacher' && (
        <TextInput
          style={styles.input}
          placeholder="Teacher's Token"
          value={authInfo.token}
          onChangeText={(text) => setAuthInfo({ ...authInfo, token: text })}
        />
      )}
      {authInfo.userType === 'Principal' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Register ID"
            value={authInfo.registerId}
            onChangeText={(text) =>
              setAuthInfo({ ...authInfo, registerId: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="NIC Number"
            value={authInfo.nicNumber}
            onChangeText={(text) =>
              setAuthInfo({ ...authInfo, nicNumber: text })
            }
          />
        </>
      )}
    </View>
  );

  const renderAccountInfoStep = () => (
    <View style={styles.form}>
      <Text style={styles.stepTitle}>Creating account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={accountInfo.email}
        onChangeText={(text) =>
          setAccountInfo({ ...accountInfo, email: text })
        }
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={accountInfo.phoneNumber}
        onChangeText={(text) =>
          setAccountInfo({ ...accountInfo, phoneNumber: text })
        }
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Create Password"
        value={accountInfo.password}
        onChangeText={(text) =>
          setAccountInfo({ ...accountInfo, password: text })
        }
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={accountInfo.confirmPassword}
        onChangeText={(text) =>
          setAccountInfo({ ...accountInfo, confirmPassword: text })
        }
        secureTextEntry
      />
    </View>
  );

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Handle sign up completion
      console.log('Sign up completed', {
        personalInfo,
        zoneInfo,
        authInfo,
        accountInfo,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>And make education simple</Text>
      </View>

      {renderStepIndicator()}

      {step === 1 && renderPersonalInfoStep()}
      {step === 2 && renderZoneInfoStep()}
      {step === 3 && renderAuthInfoStep()}
      {step === 4 && renderAccountInfoStep()}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {step === 4 ? 'Finish' : 'Next'}
        </Text>
      </TouchableOpacity>
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  form: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
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
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  genderText: {
    color: '#64748B',
    fontSize: 16,
  },
  genderTextActive: {
    color: '#fff',
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  userTypeButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  userTypeText: {
    color: '#64748B',
    fontSize: 14,
  },
  userTypeTextActive: {
    color: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUp; 