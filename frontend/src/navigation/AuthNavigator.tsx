import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 