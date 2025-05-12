import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

// Interface for navigation props
interface CameraProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params: any) => void;
  };
}

// Mock image if camera fails
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610631267629-cd77a66d4c85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80';

// Use a simplified camera approach using ImagePicker instead
const CameraScreen: React.FC<CameraProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status === 'granted') {
          // Open camera immediately when permission is granted
          launchCamera();
        } else {
          Alert.alert(
            'Camera Permission Required',
            'Please grant camera access to take photos',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setHasPermission(false);
        Alert.alert(
          'Camera Error',
          'Failed to initialize camera. You can use a sample image instead.',
          [
            { 
              text: 'Use Sample', 
              onPress: () => navigation.navigate('CreatePostForm', { image: FALLBACK_IMAGE }) 
            },
            { 
              text: 'Go Back', 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      }
    })();
  }, [navigation]);

  // Launch camera using ImagePicker (more reliable than Camera component)
  const launchCamera = async () => {
    setIsLoading(true);
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      setIsLoading(false);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Success - navigate to post form with the captured image
        navigation.navigate('CreatePostForm', { image: result.assets[0].uri });
      } else {
        // User canceled - go back
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      setIsLoading(false);
      
      // Show error and offer fallback
      Alert.alert(
        'Camera Error',
        'Failed to capture image. Would you like to use a sample image instead?',
        [
          { 
            text: 'Use Sample', 
            onPress: () => navigation.navigate('CreatePostForm', { image: FALLBACK_IMAGE }) 
          },
          { 
            text: 'Try Again', 
            onPress: launchCamera 
          },
          { 
            text: 'Cancel', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    }
  };

  // Manual camera controls UI for fallback
  const renderManualControls = () => (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.mockCamera}>
        <Image 
          // source={require('../../assets/camera-viewfinder.png')} 
          style={styles.mockPreview}
          resizeMode="contain"
        />
        
        {/* Back button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        
        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="flash-off" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={launchCamera}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="camera-reverse" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Opening camera...</Text>
      </View>
    );
  }

  // Permission denied state
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('CreatePostForm', { image: FALLBACK_IMAGE })}
          >
            <Text style={styles.buttonText}>Use Sample Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Render camera interface (either actual camera or mock interface)
  return renderManualControls();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockCamera: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: '#111',
  },
  mockPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF',
  },
});

export default CameraScreen; 