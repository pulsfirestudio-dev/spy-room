import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, ActivityIndicator, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';

const { width } = Dimensions.get('window');

const VOTING_CATEGORIES = [
  { id: 1, name: 'Sports Legends', emoji: '⚽', description: 'Famous athletes and sports icons' },
  { id: 2, name: 'Movies & TV Shows', emoji: '🎬', description: 'Actors, directors, and characters' },
  { id: 3, name: 'Historical Figures', emoji: '📜', description: 'Important people throughout history' },
  { id: 4, name: 'Tech Founders', emoji: '💻', description: 'Tech entrepreneurs and innovators' },
  { id: 5, name: 'Memes & Trends', emoji: '😂', description: 'Internet culture and viral moments' },
];

export default function VoteCategoriesScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const { purchasePremium, isPremium } = usePremium();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getGradientColors = () => {
    if (isDarkMode) {
      return ['#FF006E', '#8338EC', '#3A86FF'];
    } else {
      return ['#FF1744', '#F50057', '#D81B60'];
    }
  };

  const getAccentColor = () => {
    return isDarkMode ? '#FF006E' : '#F50057';
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowPurchasePrompt(true);
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const result = await purchasePremium();
      if (result?.success) {
        setShowPurchasePrompt(false);
        Alert.alert('Success!', 'Welcome to Premium! Enjoy all categories.', [
          {
            text: 'Continue',
            onPress: () => navigation.goBack()
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Purchase Error', error.message || 'Failed to process purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setShowPurchasePrompt(false);
    navigation.goBack();
  };

  const currentCategories = VOTING_CATEGORIES.slice(currentIndex, currentIndex + 2);
  const hasMore = currentIndex + 2 < VOTING_CATEGORIES.length;
  const hasPrev = currentIndex > 0;

  const styles = getStyles(colors, isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: getAccentColor() }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Vote for Categories</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>Choose a Category</Text>
          <Text style={[styles.subtitle, { color: colors.textSub }]}>Vote for the next weekly challenge</Text>
        </View>

        {/* Categories - 2 at a time */}
        <View style={styles.categoriesContainer}>
          {currentCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.smallCategoryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: getAccentColor() + '30'
                }
              ]}
              onPress={() => handleCategorySelect(category)}
              activeOpacity={0.7}
            >
              <View style={styles.smallCategoryContent}>
                <Text style={styles.smallCategoryEmoji}>{category.emoji}</Text>
                <Text style={[styles.smallCategoryName, { color: colors.text }]}>
                  {category.name}
                </Text>
              </View>
              
              <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.smallVoteBtn}
              >
                <Text style={styles.voteBtnText}>Vote</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: Math.ceil(VOTING_CATEGORIES.length / 2) }).map((_, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: Math.floor(currentIndex / 2) === idx ? getAccentColor() : colors.textSub + '40'
                }
              ]}
              onPress={() => setCurrentIndex(idx * 2)}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationRow}>
          <TouchableOpacity
            style={[styles.navBtn, !hasPrev && styles.navBtnDisabled]}
            onPress={() => setCurrentIndex(Math.max(0, currentIndex - 2))}
            disabled={!hasPrev}
          >
            <Text style={[styles.navBtnText, !hasPrev && styles.navBtnTextDisabled]}>← Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, !hasMore && styles.navBtnDisabled]}
            onPress={() => setCurrentIndex(Math.min(currentIndex + 2, VOTING_CATEGORIES.length - 2))}
            disabled={!hasMore}
          >
            <Text style={[styles.navBtnText, !hasMore && styles.navBtnTextDisabled]}>Next →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Purchase Prompt Modal */}
      <Modal
        visible={showPurchasePrompt}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.promptOverlay}>
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promptGradientBorder}
          >
            <View style={[styles.promptContainer, { backgroundColor: colors.background }]}>
              {/* Icon */}
              <View style={styles.promptIconContainer}>
                <LinearGradient
                  colors={getGradientColors()}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.promptIconGradient}
                >
                  <Text style={styles.promptIcon}>⭐</Text>
                </LinearGradient>
              </View>

              {/* Selected Category Display */}
              {selectedCategory && (
                <View style={styles.selectedCategoryDisplay}>
                  <Text style={[styles.selectedEmoji]}>{selectedCategory.emoji}</Text>
                  <Text style={[styles.selectedName, { color: colors.text }]}>
                    {selectedCategory.name}
                  </Text>
                </View>
              )}

              {/* Message */}
              <Text style={[styles.promptTitle, { color: colors.text }]}>Vote Submitted!</Text>
              <Text style={[styles.promptMessage, { color: colors.textSub }]}>
                Thanks for voting! To unlock all weekly categories and exclusive challenges, upgrade to Premium.
              </Text>

              {/* Buttons */}
              <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.purchaseBtnGradient}
              >
                <TouchableOpacity 
                  style={styles.purchaseBtn} 
                  onPress={handlePurchase}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.purchaseBtnText}>Go Premium Now</Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity style={[styles.skipBtn, { borderColor: getAccentColor() + '50' }]} onPress={handleSkip}>
                <Text style={[styles.skipBtnText, { color: getAccentColor() }]}>Not now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors, isDarkMode) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
    },
    backBtn: {
      fontSize: 16,
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    titleSection: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '900',
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 14,
      textAlign: 'center',
    },
    categoriesContainer: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 14,
    },
    smallCategoryCard: {
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 100,
      shadowColor: '#FF006E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    smallCategoryContent: {
      flex: 1,
      gap: 8,
    },
    smallCategoryEmoji: {
      fontSize: 36,
    },
    smallCategoryName: {
      fontSize: 16,
      fontWeight: '800',
    },
    smallVoteBtn: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
      marginLeft: 12,
    },
    voteBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 16,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    navigationRow: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    navBtn: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#FF006E',
      alignItems: 'center',
    },
    navBtnDisabled: {
      borderColor: '#CCCCCC',
      opacity: 0.5,
    },
    navBtnText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FF006E',
    },
    navBtnTextDisabled: {
      color: '#999999',
    },
    checkCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    checkmark: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '800',
    },
    // Prompt Modal Styles
    promptOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    promptGradientBorder: {
      padding: 2,
      borderRadius: 28,
      shadowColor: '#FF006E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 25,
    },
    promptContainer: {
      borderRadius: 26,
      padding: 28,
      alignItems: 'center',
    },
    promptIconContainer: {
      marginBottom: 20,
    },
    promptIconGradient: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#FF006E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 18,
    },
    promptIcon: {
      fontSize: 40,
    },
    selectedCategoryDisplay: {
      alignItems: 'center',
      marginBottom: 16,
    },
    selectedEmoji: {
      fontSize: 48,
      marginBottom: 8,
    },
    selectedName: {
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    promptTitle: {
      fontSize: 24,
      fontWeight: '900',
      marginBottom: 12,
      textAlign: 'center',
    },
    promptMessage: {
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    purchaseBtnGradient: {
      width: '100%',
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: '#FF006E',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 15,
    },
    purchaseBtn: {
      width: '100%',
      paddingVertical: 14,
      alignItems: 'center',
      borderRadius: 12,
    },
    purchaseBtnText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    skipBtn: {
      width: '100%',
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 1.5,
    },
    skipBtnText: {
      fontSize: 14,
      fontWeight: '600',
    },
  });
};
