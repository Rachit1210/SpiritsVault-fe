import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import CustomHeader from '../components/CustomHeader';

// Mock spirit list for dropdown
const SPIRIT_OPTIONS = [
  'Macallan 18',
  'Lagavulin 16',
  'Monkey 47 Gin',
  'Hendrick\'s Gin',
  'Grey Goose Vodka',
  'Belvedere Vodka',
  'Zacapa XO Rum',
  'Don Julio 1942',
];

interface CreatePostFormScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
  route: {
    params: {
      image: string;
    };
  };
}

const CreatePostFormScreen: React.FC<CreatePostFormScreenProps> = ({ navigation, route }) => {
  const { colors, theme } = useTheme();
  const { image } = route.params;
  
  const [selectedSpirit, setSelectedSpirit] = useState('');
  const [showSpiritDropdown, setShowSpiritDropdown] = useState(false);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);

  const handleCreatePost = () => {
    if (!selectedSpirit || !description || rating === 0) {
      // Show validation error, but for now just return
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      userName: 'CurrentUser', // Would come from auth
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Would come from user profile
      timeAgo: 'Just now',
      spiritName: selectedSpirit,
      spiritType: 'Spirit', // Would be determined from actual spirit data
      rating: rating,
      description: description,
      image: image,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
    };

    // In a real app, would dispatch to a store or API
    console.log('New post created:', newPost);
    
    // Navigate back to home with the new post
    navigation.navigate('Home', { newPost });
  };

  const handleSaveDraft = () => {
    // In a real app, would save to local storage or API
    console.log('Saved as draft');
    navigation.goBack();
  };

  const renderStarRating = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={rating >= star ? 'star' : 'star-outline'}
                size={28}
                color={rating >= star ? colors.stars : colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const formIsValid = selectedSpirit && description && rating > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.primary}
      />
      
      {/* Added extra padding at the top specifically for this screen */}
      <View style={styles.headerSpacer} />
      
      <CustomHeader 
        title="New Post" 
        showBackButton={true}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imagePreview}>
            <Image source={{ uri: image }} style={styles.previewImage} />
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Spirit:</Text>
              <TouchableOpacity
                style={[styles.spiritSelector, { backgroundColor: colors.input, borderColor: colors.border }]}
                onPress={() => setShowSpiritDropdown(!showSpiritDropdown)}
              >
                <Text style={{ color: selectedSpirit ? colors.text : colors.textSecondary }}>
                  {selectedSpirit || 'Select a spirit'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              {showSpiritDropdown && (
                <View style={[styles.dropdown, { backgroundColor: colors.input, borderColor: colors.border }]}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                    {SPIRIT_OPTIONS.map(spirit => (
                      <TouchableOpacity
                        key={spirit}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedSpirit(spirit);
                          setShowSpiritDropdown(false);
                        }}
                      >
                        <Text style={{ color: colors.text }}>{spirit}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {renderStarRating()}

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Review:</Text>
              <TextInput
                style={[styles.textarea, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                placeholder="Share your thoughts about this spirit..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
        </ScrollView>

        {/* Instagram-style bottom action buttons with extra bottom spacing */}
        <View style={[styles.bottomButtonsContainer, { backgroundColor: colors.primary }]}>
          <View style={[styles.bottomButtons, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              style={[styles.bottomButton, styles.draftButton]}
              onPress={handleSaveDraft}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Save Draft</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.bottomButton, 
                styles.shareButton, 
                { 
                  backgroundColor: formIsValid ? colors.accent : colors.textSecondary,
                  opacity: formIsValid ? 1 : 0.7
                }
              ]}
              onPress={handleCreatePost}
              disabled={!formIsValid}
            >
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
          {/* Extra spacing at the bottom */}
          <View style={styles.bottomSpacer} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSpacer: {
    height: Platform.OS === 'ios' ? 40 : 25, // Add extra spacing at the top
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 250,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  spiritSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dropdown: {
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 180,
  },
  dropdownScroll: {
    padding: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  ratingContainer: {
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  starButton: {
    marginRight: 10,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  bottomButtonsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  bottomButtons: {
    flexDirection: 'row',
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 30 : 20, // Add extra spacing at the bottom
  },
  bottomButton: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  draftButton: {
    backgroundColor: 'transparent',
  },
  shareButton: {
    backgroundColor: '#0092cc', // Default accent color
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CreatePostFormScreen; 