import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import { useRoute, useIsFocused, RouteProp } from '@react-navigation/native';

// Define post type
interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  timeAgo: string;
  spiritName: string;
  spiritType: string;
  rating: number;
  description: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

// Define route param types
type RootStackParamList = {
  Home: { newPost?: Post };
  // ... other routes
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

// Mock data for the feed
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    userName: 'WhiskeyEnthusiast',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    timeAgo: '2h',
    spiritName: 'Macallan 18',
    spiritType: 'Single Malt Scotch Whisky',
    rating: 4.8,
    description: 'Rich mahogany color with notes of dried fruits, ginger, toffee, and wood smoke. Absolutely divine with a smooth finish.',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    likes: 248,
    comments: 42,
    shares: 18,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '2',
    userName: 'GinLover',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    timeAgo: '4h',
    spiritName: 'Monkey 47',
    spiritType: 'Dry Gin',
    rating: 4.7,
    description: 'Complex yet balanced with 47 botanicals. Notes of citrus, juniper, and a hint of cranberry. Perfect for a sophisticated G&T!',
    image: 'https://images.unsplash.com/photo-1605270012917-bf157c5a9541?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    likes: 186,
    comments: 31,
    shares: 12,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '3',
    userName: 'RumCollector',
    userAvatar: 'https://randomuser.me/api/portraits/men/64.jpg',
    timeAgo: '1d',
    spiritName: 'Zacapa XO',
    spiritType: 'Aged Rum',
    rating: 4.9,
    description: 'Incredibly smooth with a deep complexity. Sweet caramel and vanilla notes with a long finish of spices and dark chocolate.',
    image: 'https://images.unsplash.com/photo-1630364227896-696e5df5c1fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    likes: 315,
    comments: 54,
    shares: 27,
    isLiked: false,
    isBookmarked: false,
  },
];

const HomeScreen = () => {
  const { theme, colors, toggleTheme } = useTheme();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const route = useRoute<HomeScreenRouteProp>();
  const isFocused = useIsFocused();
  
  // Check for new posts when the screen comes into focus
  useEffect(() => {
    // Add new post if it exists in route params
    if (isFocused && route.params?.newPost) {
      // Create a new post object from the route params
      const newPost: Post = route.params.newPost;
      
      // Add it to the posts state
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
  }, [isFocused, route.params?.newPost]);

  const handleLike = (id: string) => {
    setPosts(
      posts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleBookmark = (id: string) => {
    setPosts(
      posts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked,
          };
        }
        return post;
      })
    );
  };

  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const renderPost = ({ item }: { item: Post }) => {
    return (
      <View style={[styles.postContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
          <View style={styles.postHeaderText}>
            <Text style={[styles.userName, { color: colors.text }]}>{item.userName}</Text>
            <Text style={[styles.timeAgo, { color: colors.textSecondary }]}>{item.timeAgo}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.spiritInfoContainer}>
          <Text style={[styles.spiritName, { color: colors.text }]}>{item.spiritName}</Text>
          <Text style={[styles.spiritType, { color: colors.textSecondary }]}>{item.spiritType}</Text>
          {renderStarRating(item.rating)}
        </View>

        <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
        
        <Image source={{ uri: item.image }} style={styles.postImage} />
        
        <View style={[styles.actionsContainer, { borderTopColor: colors.border }]}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleLike(item.id)}
            >
              <Ionicons 
                name={item.isLiked ? "heart" : "heart-outline"} 
                size={24} 
                color={item.isLiked ? colors.heart : colors.textSecondary} 
              />
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>{item.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>{item.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="paper-plane-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>{item.shares}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.bookmarkButton} 
            onPress={() => handleBookmark(item.id)}
          >
            <Ionicons 
              name={item.isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={item.isBookmarked ? colors.accent : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Ionicons key={i} name="star" size={14} color={colors.stars} />;
          } else if (i === fullStars && hasHalfStar) {
            return <Ionicons key={i} name="star-half" size={14} color={colors.stars} />;
          } else {
            return <Ionicons key={i} name="star-outline" size={14} color={colors.stars} />;
          }
        })}
        <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title="SpiritsVault" />
        
        <View style={[styles.searchContainer, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search spirits..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContainer}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  themeToggle: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  feedContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: '#1a0414',
    borderRadius: 12,
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderText: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeAgo: {
    color: '#999',
    fontSize: 12,
  },
  moreButton: {
    padding: 5,
  },
  spiritInfoContainer: {
    marginBottom: 10,
  },
  spiritName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spiritType: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 5,
  },
  description: {
    color: '#e0e0e0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    color: '#ccc',
    marginLeft: 5,
    fontSize: 14,
  },
  bookmarkButton: {
    padding: 5,
  },
});

export default HomeScreen; 