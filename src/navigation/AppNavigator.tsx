import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import { useTheme } from '../context/ThemeContext';
import CollectionScreen from '../screens/CollectionScreen';
import SpiritDetailScreen from '../screens/SpiritDetailScreen';
import CustomHeader from '../components/CustomHeader';

// Placeholder components that you'll replace with actual screens
const ExploreScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.primary }]}>
      <CustomHeader title="Explore" />
      <View style={styles.screenContent}>
        <Text style={[styles.screenText, { color: colors.text }]}>Explore Screen</Text>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.primary }]}>
      <CustomHeader title="Profile" />
      <View style={styles.screenContent}>
        <Text style={[styles.screenText, { color: colors.text }]}>Profile Screen</Text>
      </View>
    </View>
  );
};

// Define the stack param lists for type safety
type RootStackParamList = {
  MainTabs: undefined;
  CreatePostStack: undefined;
  Home: { newPost?: any };
  Explore: undefined;
  Collection: undefined;
  SpiritDetail: { spiritId: string };
  Camera: { onImageCaptured?: (image: string) => void };
  CreatePostForm: { image: string };
  Profile: undefined;
};

// Create the tab navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

// Create stack navigators for each tab section
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Explore" component={ExploreScreen} />
  </Stack.Navigator>
);

const CollectionStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Collection" component={CollectionScreen} />
    <Stack.Screen name="SpiritDetail" component={SpiritDetailScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// Create a stack for the post creation flow - using dynamic import with require instead of import statement
const CreatePostStack = () => {
  // Get the components using require (this bypasses the TypeScript module resolution issues)
  const CameraScreen = require('../screens/CameraScreen').default;
  const CreatePostFormScreen = require('../screens/CreatePostFormScreen').default;
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen}
      />
      <Stack.Screen 
        name="CreatePostForm" 
        component={CreatePostFormScreen}
      />
    </Stack.Navigator>
  );
};

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

// Custom tab bar component with centered "+" button
const CustomTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.tabBarContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined 
          ? options.tabBarLabel 
          : options.title !== undefined 
            ? options.title 
            : route.name;
            
        const isFocused = state.index === index;
        
        // Get icon name based on route
        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Explore') {
          iconName = isFocused ? 'compass' : 'compass-outline';
        } else if (route.name === 'Create') {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.createTabButton}
              onPress={() => navigation.navigate('CreatePostStack')}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <View style={[styles.createButtonContainer, { backgroundColor: colors.accent }]}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          );
        } else if (route.name === 'Collection') {
          iconName = isFocused ? 'wine' : 'wine-outline';
        } else if (route.name === 'Profile') {
          iconName = isFocused ? 'person' : 'person-outline';
        }
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <Ionicons 
              name={iconName} 
              size={24} 
              color={isFocused ? colors.accent : colors.textSecondary} 
            />
            <Text style={[
              styles.tabLabel, 
              { color: isFocused ? colors.accent : colors.textSecondary }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Main tab navigator
export function AppTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="CreatePostStack" component={CreatePostStack} />
    </Stack.Navigator>
  );
}

// Main tab navigator that doesn't include the create post flow
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Explore" component={ExploreStack} />
      <Tab.Screen 
        name="Create" 
        component={ExploreStack}  // Placeholder, actual navigation handled in CustomTabBar
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen name="Collection" component={CollectionStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
    paddingTop: 5,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // Move button up to create the raised effect
  },
  createButtonContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});

export default AppTabs;
