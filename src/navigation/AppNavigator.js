import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import GuidelinesScreen from '../screens/GuidelinesScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import {COLORS} from '../constants/appConstants';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    primary: COLORS.primary,
    text: COLORS.text,
    border: COLORS.border,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{animation: 'fade'}} />
        <Stack.Screen name="Login" component={LoginScreen} options={{gestureEnabled: false}} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{gestureEnabled: false}} />
        <Stack.Screen name="Guidelines" component={GuidelinesScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{gestureEnabled: false}} />
        <Stack.Screen name="Result" component={ResultScreen} options={{gestureEnabled: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
