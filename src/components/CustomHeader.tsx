import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ 
  title, 
  showBackButton = false,
  rightComponent 
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.primary, borderBottomColor: colors.border }]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <View style={styles.rightContainer}>
        {rightComponent}
        <ThemeToggleButton style={styles.themeToggle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  leftContainer: {
    position: 'absolute',
    left: 15,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightContainer: {
    position: 'absolute',
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginLeft: 10,
  }
});

export default CustomHeader; 