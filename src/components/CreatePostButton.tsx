import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

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

interface CreatePostButtonProps {
  onPostCreated?: (post: any) => void;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onPostCreated }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpirit, setSelectedSpirit] = useState('');
  const [showSpiritDropdown, setShowSpiritDropdown] = useState(false);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  
  // Mock image upload - would connect to device camera/gallery in a real app
  const [image, setImage] = useState<string | null>(null);

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
      image: image || 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
    };

    if (onPostCreated) {
      onPostCreated(newPost);
    }

    // Reset form and close modal
    setSelectedSpirit('');
    setDescription('');
    setRating(0);
    setImage(null);
    setModalVisible(false);
  };

  const handleSelectImage = () => {
    // Mock image selection, would use image picker library in a real app
    setImage('https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
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

  return (
    <>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: colors.accent }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Create Post</Text>
                <TouchableOpacity onPress={handleCreatePost}>
                  <Text style={[styles.postButton, { color: colors.accent }]}>Post</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
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

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Photo:</Text>
                  {image ? (
                    <View style={[styles.selectedImageContainer, { borderColor: colors.border }]}>
                      <Image source={{ uri: image }} style={styles.selectedImage} />
                      <TouchableOpacity
                        style={[styles.removeImageButton, { backgroundColor: colors.accent }]}
                        onPress={() => setImage(null)}
                      >
                        <Ionicons name="close" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.imageSelector, { backgroundColor: colors.input, borderColor: colors.border }]}
                      onPress={handleSelectImage}
                    >
                      <Ionicons name="camera" size={24} color={colors.textSecondary} />
                      <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
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
  imageSelector: {
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImageContainer: {
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePostButton; 