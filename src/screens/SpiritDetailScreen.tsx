import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomHeader from '../components/CustomHeader';

// Import the Spirit type and data from CollectionScreen
// In a real app, this would be in a shared types file
type SpiritCategory = 'All' | 'Whisky' | 'Gin' | 'Rum' | 'Vodka' | 'Tequila' | 'Brandy' | 'Liqueur';
type PriceRange = 'All' | 'Budget' | 'Mid-range' | 'Premium' | 'Luxury';
type TasteProfile = 'All' | 'Sweet' | 'Spicy' | 'Smoky' | 'Fruity' | 'Herbal' | 'Floral' | 'Woody' | 'Citrus';

interface Spirit {
  id: string;
  name: string;
  category: SpiritCategory;
  image: string;
  rating: number;
  averagePrice: number;
  priceRange: PriceRange;
  tasteProfiles: TasteProfile[];
  abv: number; // Alcohol by volume
  description: string;
  origin: string;
  age?: string;
}

// Mock data - In a real app, this would be fetched from an API or shared state
const SPIRITS_DATA: Spirit[] = [
  {
    id: '1',
    name: 'Lagavulin 16',
    category: 'Whisky',
    image: 'https://images.unsplash.com/photo-1678391918061-b54344771ded?q=80&w=1588&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8,
    averagePrice: 89.99,
    priceRange: 'Premium',
    tasteProfiles: ['Smoky', 'Woody', 'Sweet'],
    abv: 43,
    description: 'Intensely flavored, smoky and rich, with deep sweetness and a complex, long finish.',
    origin: 'Scotland',
    age: '16 years',
  },
  {
    id: '2',
    name: 'Hendrick\'s Gin',
    category: 'Gin',
    image: 'https://images.unsplash.com/photo-1605270012917-bf157c5a9541?q=80&w=1606&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.6,
    averagePrice: 34.99,
    priceRange: 'Mid-range',
    tasteProfiles: ['Floral', 'Herbal', 'Fruity'],
    abv: 44,
    description: 'A most unusual gin, made with infusions of cucumber and rose petals for a distinctively refreshing flavor.',
    origin: 'Scotland',
  },
  {
    id: '3',
    name: 'Zacapa XO',
    category: 'Rum',
    image: 'https://images.unsplash.com/photo-1630364227896-696e5df5c1fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    rating: 4.9,
    averagePrice: 129.99,
    priceRange: 'Luxury',
    tasteProfiles: ['Sweet', 'Woody', 'Spicy'],
    abv: 40,
    description: 'Incredibly rich and sweet with notes of caramel, vanilla, cinnamon and dried fruits.',
    origin: 'Guatemala',
    age: 'Blend aged up to 25 years',
  },
  {
    id: '4',
    name: 'Grey Goose',
    category: 'Vodka',
    image: 'https://images.unsplash.com/photo-1608885898957-a1a0757ed638?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.2,
    averagePrice: 29.99,
    priceRange: 'Mid-range',
    tasteProfiles: ['Sweet'],
    abv: 40,
    description: 'Exceptionally smooth with subtle hints of almond and a long, satisfying finish.',
    origin: 'France',
  },
  {
    id: '5',
    name: 'Don Julio 1942',
    category: 'Tequila',
    image: 'https://images.unsplash.com/photo-1668957714470-00820c0742cc?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8,
    averagePrice: 149.99,
    priceRange: 'Luxury',
    tasteProfiles: ['Sweet', 'Fruity', 'Woody'],
    abv: 38,
    description: 'Warm oak, vanilla and roasted agave flavors with a lingering oak and rich vanilla finish.',
    origin: 'Mexico',
    age: 'Añejo, aged at least 2.5 years',
  },
  {
    id: '6',
    name: 'Macallan 12',
    category: 'Whisky',
    image: 'https://images.unsplash.com/photo-1601061700034-e4e7f6474484?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.7,
    averagePrice: 69.99,
    priceRange: 'Premium',
    tasteProfiles: ['Sweet', 'Fruity', 'Woody'],
    abv: 43,
    description: 'Rich and complex with notes of dried fruits, spices, and oak.',
    origin: 'Scotland',
    age: '12 years',
  },
  {
    id: '7',
    name: 'Tanqueray No. Ten',
    category: 'Gin',
    image: 'https://images.unsplash.com/photo-1651701532018-db06a4e12dc4?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.5,
    averagePrice: 38.99,
    priceRange: 'Mid-range',
    tasteProfiles: ['Citrus', 'Herbal', 'Floral'],
    abv: 47.3,
    description: 'Sophisticated citrus notes with juniper and chamomile for a smooth yet complex gin.',
    origin: 'United Kingdom',
  },
  {
    id: '8',
    name: 'Tito\'s Handmade Vodka',
    category: 'Vodka',
    image: 'https://images.unsplash.com/photo-1618058368547-ef0e7c404e13?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.3,
    averagePrice: 19.99,
    priceRange: 'Budget',
    tasteProfiles: ['Sweet'],
    abv: 40,
    description: 'Crafted in small batches, delivering a clean, smooth taste with a subtle sweetness.',
    origin: 'USA',
  },
];

// Mock reviews data
interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

const REVIEWS: { [key: string]: Review[] } = {
  '1': [
    {
      id: '1-1',
      userName: 'WhiskeyFan42',
      userAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      rating: 5,
      comment: 'Absolute perfection! The smoky peat balanced with sweet undertones makes this my go-to Islay whisky.',
      date: '2 weeks ago',
    },
    {
      id: '1-2',
      userName: 'ScotchLover',
      userAvatar: 'https://randomuser.me/api/portraits/women/24.jpg',
      rating: 4.5,
      comment: 'Complex and rich. A bit pricey but worth every penny for special occasions.',
      date: '1 month ago',
    },
    {
      id: '1-3',
      userName: 'MaltMaster',
      userAvatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      rating: 5,
      comment: 'The quintessential Islay single malt. If you love smoky whisky, you must try this.',
      date: '3 months ago',
    },
  ],
  '3': [
    {
      id: '3-1',
      userName: 'RumEnthusiast',
      userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 5,
      comment: 'One of the finest rums I\'ve ever tasted. Smooth, rich, and complex.',
      date: '1 week ago',
    },
    {
      id: '3-2',
      userName: 'CocktailQueen',
      userAvatar: 'https://randomuser.me/api/portraits/women/35.jpg',
      rating: 4.5,
      comment: 'Perfect for sipping neat. Too good to mix!',
      date: '3 weeks ago',
    },
  ],
};

// Navigation type
type CollectionStackParamList = {
  Collection: undefined;
  SpiritDetail: { spiritId: string };
};

type SpiritDetailScreenRouteProp = RouteProp<CollectionStackParamList, 'SpiritDetail'>;
type SpiritDetailScreenNavigationProp = StackNavigationProp<CollectionStackParamList, 'SpiritDetail'>;

const SpiritDetailScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<SpiritDetailScreenNavigationProp>();
  const route = useRoute<SpiritDetailScreenRouteProp>();
  const { spiritId } = route.params;
  
  const [spirit, setSpirit] = useState<Spirit | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Local fallback images by category
  const fallbackImages: Record<SpiritCategory, string> = {
    All: 'https://via.placeholder.com/300/491D56/FFFFFF?text=Spirit',
    Whisky: 'https://via.placeholder.com/300/6D2F2F/FFFFFF?text=Whisky',
    Gin: 'https://via.placeholder.com/300/2F6D69/FFFFFF?text=Gin',
    Rum: 'https://via.placeholder.com/300/6D5D2F/FFFFFF?text=Rum',
    Vodka: 'https://via.placeholder.com/300/2F4A6D/FFFFFF?text=Vodka',
    Tequila: 'https://via.placeholder.com/300/4A6D2F/FFFFFF?text=Tequila',
    Brandy: 'https://via.placeholder.com/300/6D2F5D/FFFFFF?text=Brandy',
    Liqueur: 'https://via.placeholder.com/300/2F6D3D/FFFFFF?text=Liqueur'
  };
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundSpirit = SPIRITS_DATA.find(s => s.id === spiritId);
    setSpirit(foundSpirit || null);
    
    // Get reviews or empty array
    setReviews(REVIEWS[spiritId] || []);

    // Reset image states when spirit changes
    setImageLoading(true);
    setImageError(false);
  }, [spiritId]);
  
  // Create a bookmark button component for the right side of the header
  const renderBookmarkButton = () => {
    return (
      <TouchableOpacity 
        style={styles.bookmarkButton}
        onPress={() => setIsBookmarked(!isBookmarked)}
      >
        <Ionicons 
          name={isBookmarked ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color={isBookmarked ? colors.accent : colors.text} 
        />
      </TouchableOpacity>
    );
  };
  
  if (!spirit) {
    return (
      <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <CustomHeader title="Spirit Details" showBackButton={true} />
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Handle image loading complete
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };
  
  const renderStarRating = (rating: number, size = 16) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Ionicons key={i} name="star" size={size} color={colors.stars} />;
          } else if (i === fullStars && hasHalfStar) {
            return <Ionicons key={i} name="star-half" size={size} color={colors.stars} />;
          } else {
            return <Ionicons key={i} name="star-outline" size={size} color={colors.stars} />;
          }
        })}
        <Text style={[styles.ratingText, { color: colors.textSecondary, fontSize: size * 0.8 }]}>
          {rating.toFixed(1)}
        </Text>
      </View>
    );
  };
  
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };
  
  const renderReviewItem = ({ item }: { item: Review }) => {
    return (
      <View style={[styles.reviewContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.reviewHeader}>
          <Image source={{ uri: item.userAvatar }} style={styles.reviewerAvatar} />
          <View style={styles.reviewerInfo}>
            <Text style={[styles.reviewerName, { color: colors.text }]}>{item.userName}</Text>
            <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{item.date}</Text>
          </View>
          {renderStarRating(item.rating, 14)}
        </View>
        <Text style={[styles.reviewComment, { color: colors.text }]}>{item.comment}</Text>
      </View>
    );
  };
  
  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader 
          title={spirit.name} 
          showBackButton={true}
          rightComponent={renderBookmarkButton()}
        />
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View style={styles.imageLoaderContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
              </View>
            )}

            <Image 
              source={{ uri: imageError ? fallbackImages[spirit.category] : spirit.image }} 
              style={styles.spiritImage}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {!imageLoading && imageError && (
              <View style={styles.imageErrorOverlay}>
                <Text style={styles.categoryIconText}>{spirit.category}</Text>
              </View>
            )}

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={[styles.spiritName, { color: colors.text }]}>{spirit.name}</Text>
              <View style={styles.categoryAndPrice}>
                <Text style={[styles.categoryTag, { backgroundColor: colors.input }]}>
                  {spirit.category}
                </Text>
                <Text style={[styles.priceText, { color: colors.textSecondary }]}>
                  {formatPrice(spirit.averagePrice)}
                </Text>
              </View>
            </View>
            
            <View style={styles.ratingAndOrigin}>
              <View style={styles.ratingSection}>
                {renderStarRating(spirit.rating, 18)}
                <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </Text>
              </View>
              <View style={styles.detailsSection}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Origin</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{spirit.origin}</Text>
              </View>
              <View style={styles.detailsSection}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>ABV</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{spirit.abv}%</Text>
              </View>
            </View>
            
            {spirit.age && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Age</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{spirit.age}</Text>
              </View>
            )}
            
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
              <Text style={[styles.description, { color: colors.text }]}>{spirit.description}</Text>
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Taste Profile</Text>
              <View style={styles.tasteProfileContainer}>
                {spirit.tasteProfiles.map(taste => (
                  <View 
                    key={taste} 
                    style={[styles.tasteTag, { backgroundColor: colors.input, borderColor: colors.border }]}
                  >
                    <Text style={[styles.tasteText, { color: colors.text }]}>{taste}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.sectionContainer}>
              <View style={styles.reviewsHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
                <TouchableOpacity style={[styles.addReviewButton, { backgroundColor: colors.accent }]}>
                  <Text style={styles.addReviewText}>Write a Review</Text>
                </TouchableOpacity>
              </View>
              
              {reviews.length > 0 ? (
                <FlatList
                  data={reviews}
                  renderItem={renderReviewItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.noReviewsContainer}>
                  <Ionicons name="chatbubble-outline" size={40} color={colors.textSecondary} />
                  <Text style={[styles.noReviewsText, { color: colors.textSecondary }]}>
                    No reviews yet. Be the first to review!
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bookmarkButton: {
    padding: 5,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  spiritImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLoaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 5,
  },
  categoryIconText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  spiritName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryAndPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    color: '#fff',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingAndOrigin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  ratingSection: {
    flex: 2,
  },
  detailsSection: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 6,
  },
  reviewCount: {
    fontSize: 14,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  tasteProfileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tasteTag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  tasteText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addReviewButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reviewContainer: {
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  noReviewsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noReviewsText: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SpiritDetailScreen; 