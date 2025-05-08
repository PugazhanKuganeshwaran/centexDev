import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/context/ThemeContext';

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

// Mock data for select options
const PROVINCES = [
  'Central Province',
  'Eastern Province',
  'North Central Province',
  'Northern Province',
  'North Western Province',
  'Sabaragamuwa Province',
  'Southern Province',
  'Uva Province',
  'Western Province',
];

const DISTRICTS = {
  'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Eastern Province': ['Ampara', 'Batticaloa', 'Trincomalee'],
  'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
  'Northern Province': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  'North Western Province': ['Kurunegala', 'Puttalam'],
  'Sabaragamuwa Province': ['Kegalle', 'Ratnapura'],
  'Southern Province': ['Galle', 'Hambantota', 'Matara'],
  'Uva Province': ['Badulla', 'Monaragala'],
  'Western Province': ['Colombo', 'Gampaha', 'Kalutara'],
};

const LANGUAGE_MEDIUMS = ['Sinhala', 'Tamil', 'English'];

const SignUp = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState('');

  const validateDate = (date: string) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(date)) {
      setDateError('Please enter date in DD/MM/YYYY format');
      return false;
    }
    
    const [day, month, year] = date.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    
    if (inputDate > today) {
      setDateError('Date of birth cannot be in the future');
      return false;
    }
    
    setDateError('');
    return true;
  };

  const handleDateChange = (text: string) => {
    // Allow only numbers and forward slashes
    const cleanedText = text.replace(/[^0-9/]/g, '');
    
    // Auto-format the date as user types
    let formattedText = cleanedText;
    if (cleanedText.length > 2 && !cleanedText.includes('/')) {
      formattedText = cleanedText.slice(0, 2) + '/' + cleanedText.slice(2);
    }
    if (cleanedText.length > 5 && cleanedText.split('/').length === 2) {
      formattedText = cleanedText.slice(0, 5) + '/' + cleanedText.slice(5);
    }
    
    setPersonalInfo({ ...personalInfo, dateOfBirth: formattedText });
    validateDate(formattedText);
  };

  const renderStepIndicator = () => {
    const totalSteps = 4;
    const stepWidth = 100 / totalSteps;

    return (
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarBackground, isDarkMode && styles.darkProgressBarBackground]} />
          <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepCircle,
                { left: `${(index + 0.5) * stepWidth}%` },
                isDarkMode && styles.darkStepCircle,
                index < step && styles.stepCircleActive,
                index === step - 1 && (isDarkMode ? styles.darkCurrentStepCircle : styles.currentStepCircle)
              ]}
            >
              <Text style={[
                styles.stepNumber,
                isDarkMode && styles.darkStepNumber,
                index < step && styles.stepNumberActive
              ]}>
                {index + 1}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.stepLabels}>
          <Text style={[styles.stepLabel, isDarkMode && styles.darkStepLabel, step >= 1 && styles.stepLabelActive]}>Personal</Text>
          <Text style={[styles.stepLabel, isDarkMode && styles.darkStepLabel, step >= 2 && styles.stepLabelActive]}>Zone</Text>
          <Text style={[styles.stepLabel, isDarkMode && styles.darkStepLabel, step >= 3 && styles.stepLabelActive]}>Auth</Text>
          <Text style={[styles.stepLabel, isDarkMode && styles.darkStepLabel, step >= 4 && styles.stepLabelActive]}>Account</Text>
        </View>
      </View>
    );
  };

  const renderPersonalInfoStep = () => (
    <View style={styles.form}>
      <Text style={[styles.stepTitle, isDarkMode && styles.darkText]}>Personal Info</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="First Name"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        value={personalInfo.firstName}
        onChangeText={(text) => setPersonalInfo({ ...personalInfo, firstName: text })}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Last Name"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        value={personalInfo.lastName}
        onChangeText={(text) => setPersonalInfo({ ...personalInfo, lastName: text })}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <View style={styles.dateContainer}>
        <TextInput
          style={[
            styles.input,
            isDarkMode && styles.darkInput,
            dateError && (isDarkMode ? styles.darkInputError : styles.inputError)
          ]}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={personalInfo.dateOfBirth}
          onChangeText={handleDateChange}
          keyboardType="number-pad"
          maxLength={10}
        />
        {dateError ? <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{dateError}</Text> : null}
      </View>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            isDarkMode && styles.darkGenderButton,
            personalInfo.gender === 'Male' && styles.genderButtonActive,
          ]}
          onPress={() => setPersonalInfo({ ...personalInfo, gender: 'Male' })}
        >
          <Text
            style={[
              styles.genderText,
              isDarkMode && styles.darkGenderText,
              personalInfo.gender === 'Male' && styles.genderTextActive,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            isDarkMode && styles.darkGenderButton,
            personalInfo.gender === 'Female' && styles.genderButtonActive,
          ]}
          onPress={() => setPersonalInfo({ ...personalInfo, gender: 'Female' })}
        >
          <Text
            style={[
              styles.genderText,
              isDarkMode && styles.darkGenderText,
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
      <Text style={[styles.stepTitle, isDarkMode && styles.darkText]}>Zone Info</Text>
      <View style={styles.pickerContainer}>
        <Text style={[styles.pickerLabel, isDarkMode && styles.darkSubText]}>Select Province</Text>
        <SelectList
          setSelected={(value) => {
            setZoneInfo({
              ...zoneInfo,
              province: value,
              district: '',
              school: '',
            });
          }}
          data={PROVINCES.map(province => ({ key: province, value: province }))}
          save="value"
          placeholder="Select a province"
          search={false}
          boxStyles={[styles.selectBox, isDarkMode && styles.darkSelectBox]}
          inputStyles={[styles.selectInput, isDarkMode && styles.darkSelectInput]}
          dropdownStyles={[styles.dropdown, isDarkMode && styles.darkDropdown]}
          dropdownItemStyles={[styles.dropdownItem, isDarkMode && styles.darkDropdownItem]}
          dropdownTextStyles={[styles.selectInput, isDarkMode && styles.darkSelectInput]}
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={[styles.pickerLabel, isDarkMode && styles.darkSubText]}>Select District</Text>
        <SelectList
          setSelected={(value) => {
            setZoneInfo({
              ...zoneInfo,
              district: value,
              school: '',
            });
          }}
          data={zoneInfo.province ? DISTRICTS[zoneInfo.province].map(district => ({ key: district, value: district })) : []}
          save="value"
          placeholder="Select a district"
          search={false}
          boxStyles={[
            styles.selectBox,
            isDarkMode && styles.darkSelectBox,
            !zoneInfo.province && (isDarkMode ? styles.darkSelectBoxDisabled : styles.selectBoxDisabled)
          ]}
          inputStyles={[styles.selectInput, isDarkMode && styles.darkSelectInput]}
          dropdownStyles={[styles.dropdown, isDarkMode && styles.darkDropdown]}
          dropdownItemStyles={[styles.dropdownItem, isDarkMode && styles.darkDropdownItem]}
          dropdownTextStyles={[styles.selectInput, isDarkMode && styles.darkSelectInput]}
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          disable={!zoneInfo.province}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={[styles.pickerLabel, isDarkMode && styles.darkSubText]}>Select School</Text>
        <TextInput
          style={[
            styles.input,
            isDarkMode && styles.darkInput,
            !zoneInfo.district && (isDarkMode ? styles.darkInputDisabled : styles.inputDisabled)
          ]}
          placeholder="Enter school name"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={zoneInfo.school}
          onChangeText={(text) => setZoneInfo({ ...zoneInfo, school: text })}
          editable={!!zoneInfo.district}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={[styles.pickerLabel, isDarkMode && styles.darkSubText]}>Select Language Medium</Text>
        <SelectList
          setSelected={(value) => setZoneInfo({ ...zoneInfo, languageMedium: value })}
          data={LANGUAGE_MEDIUMS.map(lang => ({ key: lang, value: lang }))}
          save="value"
          placeholder="Select a language"
          search={false}
          boxStyles={[styles.selectBox, isDarkMode && styles.darkSelectBox]}
          inputStyles={[styles.selectInput, isDarkMode && styles.darkSelectInput]}
          dropdownStyles={[styles.dropdown, isDarkMode && styles.darkDropdown]}
          dropdownItemStyles={[styles.dropdownItem, isDarkMode && styles.darkDropdownItem]}
          dropdownTextStyles={[styles.selectInput, isDarkMode && styles.darkSelectInput]}
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
        />
      </View>
    </View>
  );

  const renderAuthInfoStep = () => (
    <View style={styles.form}>
      <Text style={[styles.stepTitle, isDarkMode && styles.darkText]}>Auth Info</Text>
      <View style={styles.userTypeContainer}>
        {(['Student', 'Teacher', 'Principal'] as UserType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.userTypeButton,
              isDarkMode && styles.darkUserTypeButton,
              authInfo.userType === type && styles.userTypeButtonActive,
            ]}
            onPress={() => setAuthInfo({ ...authInfo, userType: type })}
          >
            <Text
              style={[
                styles.userTypeText,
                isDarkMode && styles.darkUserTypeText,
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
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Admission Number"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={authInfo.admissionNumber}
          onChangeText={(text) => setAuthInfo({ ...authInfo, admissionNumber: text })}
          keyboardType="number-pad"
          maxLength={10}
        />
      )}
      {authInfo.userType === 'Teacher' && (
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Teacher's Token"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={authInfo.token}
          onChangeText={(text) => setAuthInfo({ ...authInfo, token: text })}
          autoCapitalize="none"
          maxLength={8}
        />
      )}
      {authInfo.userType === 'Principal' && (
        <>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Register ID"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            value={authInfo.registerId}
            onChangeText={(text) => setAuthInfo({ ...authInfo, registerId: text })}
            autoCapitalize="none"
            maxLength={10}
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="NIC Number"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            value={authInfo.nicNumber}
            onChangeText={(text) => setAuthInfo({ ...authInfo, nicNumber: text })}
            keyboardType="number-pad"
            maxLength={12}
          />
        </>
      )}
    </View>
  );

  const renderAccountInfoStep = () => (
    <View style={styles.form}>
      <Text style={[styles.stepTitle, isDarkMode && styles.darkText]}>Creating account</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Email Address"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        value={accountInfo.email}
        onChangeText={(text) => setAccountInfo({ ...accountInfo, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Phone Number"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        value={accountInfo.phoneNumber}
        onChangeText={(text) => setAccountInfo({ ...accountInfo, phoneNumber: text })}
        keyboardType="phone-pad"
        maxLength={10}
      />
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Create Password"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        value={accountInfo.password}
        onChangeText={(text) => setAccountInfo({ ...accountInfo, password: text })}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
      />
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Confirm Password"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        value={accountInfo.confirmPassword}
        onChangeText={(text) => setAccountInfo({ ...accountInfo, confirmPassword: text })}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
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

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderButtons = () => (
    <View style={styles.buttonContainer}>
      {step > 1 && (
        <TouchableOpacity 
          style={[styles.button, styles.previousButton, isDarkMode && styles.darkPreviousButton]} 
          onPress={handlePrevious}
        >
          <Text style={[styles.buttonText, styles.previousButtonText, isDarkMode && styles.darkPreviousButtonText]}>Previous</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={[styles.button, styles.nextButton, isDarkMode && styles.darkNextButton]} 
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {step === 4 ? 'Finish' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Sign Up</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubText]}>And make education simple</Text>
      </View>

      {renderStepIndicator()}

      {step === 1 && renderPersonalInfoStep()}
      {step === 2 && renderZoneInfoStep()}
      {step === 3 && renderAuthInfoStep()}
      {step === 4 && renderAccountInfoStep()}

      {renderButtons()}
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
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#999',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  stepIndicatorContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    height: 4,
    marginBottom: 24,
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  darkProgressBarBackground: {
    backgroundColor: '#333',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  stepCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }],
    top: -10,
  },
  darkStepCircle: {
    backgroundColor: '#333',
  },
  stepCircleActive: {
    backgroundColor: '#2563EB',
  },
  currentStepCircle: {
    borderWidth: 2,
    borderColor: '#2563EB',
    backgroundColor: '#fff',
  },
  darkCurrentStepCircle: {
    backgroundColor: '#121212',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  darkStepNumber: {
    color: '#999',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  darkStepLabel: {
    color: '#999',
  },
  stepLabelActive: {
    color: '#2563EB',
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
  darkStepTitle: {
    color: '#fff',
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
  inputError: {
    borderColor: '#EF4444',
  },
  darkInputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  darkErrorText: {
    color: '#DC2626',
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
  darkGenderButton: {
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  genderButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  genderText: {
    color: '#64748B',
    fontSize: 16,
  },
  darkGenderText: {
    color: '#999',
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
  darkUserTypeButton: {
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  userTypeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  userTypeText: {
    color: '#64748B',
    fontSize: 14,
  },
  darkUserTypeText: {
    color: '#999',
  },
  userTypeTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousButton: {
    backgroundColor: '#F1F5F9',
  },
  darkPreviousButton: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#333',
  },
  nextButton: {
    backgroundColor: '#2563EB',
  },
  darkNextButton: {
    backgroundColor: '#2A67FF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  previousButtonText: {
    color: '#64748B',
  },
  darkPreviousButtonText: {
    color: '#999',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  darkPickerLabel: {
    color: '#999',
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    height: 50,
    paddingHorizontal: 16,
  },
  darkSelectBox: {
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  selectInput: {
    color: '#1A1A1A',
    fontSize: 16,
  },
  darkSelectInput: {
    color: '#fff',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  darkDropdown: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  dropdownItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  darkDropdownItem: {
    borderBottomColor: '#333',
  },
  selectBoxDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  darkSelectBoxDisabled: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  dateContainer: {
    marginBottom: 8,
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  darkInputDisabled: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  inputText: {
    fontSize: 16,
    color: '#1E293B',
  },
  darkInputText: {
    color: '#fff',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  darkPlaceholderText: {
    color: '#666',
  },
});

export default SignUp; 