import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../i18n';
import Logo from '../components/ui/Logo';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import ThemeSelectScreen from '../screens/ThemeSelectScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import PlaceSelectScreen from '../screens/PlaceSelectScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated, isInitializing, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Logo size="lg" layout="vertical" />
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      </View>
    );
  }

  const defaultScreenOptions = {
    headerShown: false,
    contentStyle: {
      backgroundColor: colors.background,
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={defaultScreenOptions}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PlaceSelect" component={PlaceSelectScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
            <Stack.Screen name="ThemeSelect" component={ThemeSelectScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PlaceSelect" component={PlaceSelectScreen} />
            <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
            <Stack.Screen name="ThemeSelect" component={ThemeSelectScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginTop: 24,
  },
});

export default RootNavigator;
