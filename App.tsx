import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import AppTabs from './src/navigation/AppNavigator';
import ThemeProvider from './src/context/ThemeContext';

// Create a Stack Navigator for the screens
const Stack = createStackNavigator();

// Define a splash screen component
interface SplashScreenProps {
  onFinishAnimation: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinishAnimation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Delay before navigating to login screen
      setTimeout(() => {
        onFinishAnimation();
      }, 1000);
    });
  }, []);

  return (
    <LinearGradient colors={['#2a061e', '#0a0006']} style={styles.container}>
      <StatusBar hidden />
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>SpiritsVault</Text>
      </Animated.View>
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        Uncover the Essence Within
      </Animated.Text>
    </LinearGradient>
  );
};

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  // Set this to true to skip authentication and go directly to the main app
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Change to false later for real auth

  // Define AppNavigator
  const AuthNavigator = () => {
    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    );
  };

  // Handle splash screen finished animation
  const handleFinishAnimation = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        {isLoading ? (
          <SplashScreen onFinishAnimation={handleFinishAnimation} />
        ) : isAuthenticated ? (
          <AppTabs />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
  },
});
