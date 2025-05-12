import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleButtonProps {
  style?: object;
  size?: number;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ style, size = 24 }) => {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.card }, style]} 
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={theme === 'dark' ? 'sunny' : 'moon'} 
        size={size} 
        color={theme === 'dark' ? '#FFD700' : '#6A0DAD'} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});

export default ThemeToggleButton; 