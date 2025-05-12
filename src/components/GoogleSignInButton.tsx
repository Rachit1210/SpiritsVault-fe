// src/components/GoogleSignInButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GoogleSignInButtonProps {
  onPress: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="logo-google" size={22} color="white" style={styles.icon} />
      <Text style={styles.text}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 20,
    width: '70%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default GoogleSignInButton;  // **Make sure this is a default export**
