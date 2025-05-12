import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomHeader from '../components/CustomHeader';

// Define types
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
  imageLoading?: boolean;
  imageError?: boolean;
}

// Mock data
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
    imageLoading: true,
    imageError: false,
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
    imageLoading: true,
    imageError: false,
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
    imageLoading: true,
    imageError: false,
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
    imageLoading: true,
    imageError: false,
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
    imageLoading: true,
    imageError: false,
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
    imageLoading: true,
    imageError: false,
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
    imageLoading: true,
    imageError: false,
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
    imageLoading: true,
    imageError: false,
  },
];

// Navigation type
type CollectionStackParamList = {
  Collection: undefined;
  SpiritDetail: { spiritId: string };
};

type CollectionScreenNavigationProp = StackNavigationProp<CollectionStackParamList, 'Collection'>;

const CollectionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<CollectionScreenNavigationProp>();
  const [spirits, setSpirits] = useState<Spirit[]>(SPIRITS_DATA.map(spirit => ({
    ...spirit,
    imageLoading: true,
    imageError: false
  })));
  const [filteredSpirits, setFilteredSpirits] = useState<Spirit[]>(spirits);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<SpiritCategory>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>('All');
  const [selectedTasteProfile, setSelectedTasteProfile] = useState<TasteProfile>('All');
  
  const categories: SpiritCategory[] = ['All', 'Whisky', 'Gin', 'Rum', 'Vodka', 'Tequila', 'Brandy', 'Liqueur'];
  const priceRanges: PriceRange[] = ['All', 'Budget', 'Mid-range', 'Premium', 'Luxury'];
  const tasteProfiles: TasteProfile[] = ['All', 'Sweet', 'Spicy', 'Smoky', 'Fruity', 'Herbal', 'Floral', 'Woody'];

  // Local fallback images by category
  const fallbackImages: Record<SpiritCategory, string> = {
    All: 'https://via.placeholder.com/150/491D56/FFFFFF?text=Spirit',
    Whisky: 'https://via.placeholder.com/150/6D2F2F/FFFFFF?text=Whisky',
    Gin: 'https://via.placeholder.com/150/2F6D69/FFFFFF?text=Gin',
    Rum: 'https://via.placeholder.com/150/6D5D2F/FFFFFF?text=Rum',
    Vodka: 'https://via.placeholder.com/150/2F4A6D/FFFFFF?text=Vodka',
    Tequila: 'https://via.placeholder.com/150/4A6D2F/FFFFFF?text=Tequila',
    Brandy: 'https://via.placeholder.com/150/6D2F5D/FFFFFF?text=Brandy',
    Liqueur: 'https://via.placeholder.com/150/2F6D3D/FFFFFF?text=Liqueur'
  };

  // Apply filters and search
  useEffect(() => {
    let results = spirits;
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      results = results.filter(spirit => spirit.category === selectedCategory);
    }
    
    // Apply price range filter
    if (selectedPriceRange !== 'All') {
      results = results.filter(spirit => spirit.priceRange === selectedPriceRange);
    }
    
    // Apply taste profile filter
    if (selectedTasteProfile !== 'All') {
      results = results.filter(spirit => spirit.tasteProfiles.includes(selectedTasteProfile));
    }
    
    // Apply search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      results = results.filter(
        spirit => 
          spirit.name.toLowerCase().includes(lowercasedQuery) ||
          spirit.category.toLowerCase().includes(lowercasedQuery) ||
          spirit.description.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    setFilteredSpirits(results);
  }, [selectedCategory, selectedPriceRange, selectedTasteProfile, searchQuery, spirits]);

  // Handle image loading state changes
  const handleImageLoad = (id: string) => {
    setSpirits(currentSpirits => 
      currentSpirits.map(spirit => 
        spirit.id === id ? { ...spirit, imageLoading: false } : spirit
      )
    );
  };

  // Handle image loading errors
  const handleImageError = (id: string) => {
    setSpirits(currentSpirits => 
      currentSpirits.map(spirit => 
        spirit.id === id ? { ...spirit, imageLoading: false, imageError: true } : spirit
      )
    );
  };

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Ionicons key={i} name="star" size={12} color={colors.stars} />;
          } else if (i === fullStars && hasHalfStar) {
            return <Ionicons key={i} name="star-half" size={12} color={colors.stars} />;
          } else {
            return <Ionicons key={i} name="star-outline" size={12} color={colors.stars} />;
          }
        })}
        <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderSpiritItem = ({ item }: { item: Spirit }) => {
    return (
      <TouchableOpacity 
        style={[styles.itemContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('SpiritDetail', { spiritId: item.id })}
      >
        <View style={styles.imageContainer}>
          {item.imageLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          )}
          
          <Image 
            source={{ 
              uri: item.imageError ? fallbackImages[item.category] : item.image 
            }}
            style={styles.itemImage}
            onLoad={() => handleImageLoad(item.id)}
            onError={() => handleImageError(item.id)}
          />
          
          {!item.imageLoading && item.imageError && (
            <View style={styles.errorOverlay}>
              <Text style={styles.categoryIconText}>{item.category.charAt(0)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
          <View style={styles.itemDetails}>
            <Text style={[styles.categoryTag, { backgroundColor: colors.input }]}>{item.category}</Text>
            {renderStarRating(item.rating)}
          </View>
          <Text style={[styles.priceText, { color: colors.textSecondary }]}>
            {formatPrice(item.averagePrice)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterModal = () => {
    return (
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filter Spirits</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Categories */}
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Category</Text>
              <View style={styles.filterOptions}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      { 
                        backgroundColor: selectedCategory === category ? colors.accent : colors.input,
                        borderColor: colors.border 
                      }
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text 
                      style={[
                        styles.filterChipText, 
                        { color: selectedCategory === category ? '#fff' : colors.text }
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Ranges */}
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Price Range</Text>
              <View style={styles.filterOptions}>
                {priceRanges.map(priceRange => (
                  <TouchableOpacity
                    key={priceRange}
                    style={[
                      styles.filterChip,
                      { 
                        backgroundColor: selectedPriceRange === priceRange ? colors.accent : colors.input,
                        borderColor: colors.border 
                      }
                    ]}
                    onPress={() => setSelectedPriceRange(priceRange)}
                  >
                    <Text 
                      style={[
                        styles.filterChipText, 
                        { color: selectedPriceRange === priceRange ? '#fff' : colors.text }
                      ]}
                    >
                      {priceRange}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Taste Profiles */}
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Taste Profile</Text>
              <View style={styles.filterOptions}>
                {tasteProfiles.map(taste => (
                  <TouchableOpacity
                    key={taste}
                    style={[
                      styles.filterChip,
                      { 
                        backgroundColor: selectedTasteProfile === taste ? colors.accent : colors.input,
                        borderColor: colors.border 
                      }
                    ]}
                    onPress={() => setSelectedTasteProfile(taste)}
                  >
                    <Text 
                      style={[
                        styles.filterChipText, 
                        { color: selectedTasteProfile === taste ? '#fff' : colors.text }
                      ]}
                    >
                      {taste}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.footerButton, { borderColor: colors.border }]}
                onPress={() => {
                  setSelectedCategory('All');
                  setSelectedPriceRange('All');
                  setSelectedTasteProfile('All');
                }}
              >
                <Text style={[styles.footerButtonText, { color: colors.text }]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.footerButton, { backgroundColor: colors.accent }]}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={[styles.footerButtonText, { color: '#fff' }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title="Collection" />

        <View style={styles.searchAndFilterContainer}>
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
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: colors.input, borderColor: colors.border }]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.selectedFiltersContainer}>
          {selectedCategory !== 'All' && (
            <View style={[styles.selectedFilterChip, { backgroundColor: colors.accent }]}>
              <Text style={styles.selectedFilterText}>{selectedCategory}</Text>
              <TouchableOpacity onPress={() => setSelectedCategory('All')}>
                <Ionicons name="close-circle" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          {selectedPriceRange !== 'All' && (
            <View style={[styles.selectedFilterChip, { backgroundColor: colors.accent }]}>
              <Text style={styles.selectedFilterText}>{selectedPriceRange}</Text>
              <TouchableOpacity onPress={() => setSelectedPriceRange('All')}>
                <Ionicons name="close-circle" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          {selectedTasteProfile !== 'All' && (
            <View style={[styles.selectedFilterChip, { backgroundColor: colors.accent }]}>
              <Text style={styles.selectedFilterText}>{selectedTasteProfile}</Text>
              <TouchableOpacity onPress={() => setSelectedTasteProfile('All')}>
                <Ionicons name="close-circle" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {filteredSpirits.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={60} color={colors.textSecondary} />
            <Text style={[styles.noResultsText, { color: colors.text }]}>No spirits found</Text>
            <Text style={[styles.noResultsSubText, { color: colors.textSecondary }]}>
              Try changing your search or filters
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSpirits}
            renderItem={renderSpiritItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        )}

        {renderFilterModal()}
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
  searchAndFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
  },
  selectedFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  selectedFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilterText: {
    color: '#fff',
    marginRight: 8,
    fontSize: 12,
  },
  listContainer: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  categoryIconText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  itemInfo: {
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryTag: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 15,
  },
  footerButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  footerButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  noResultsSubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CollectionScreen; 