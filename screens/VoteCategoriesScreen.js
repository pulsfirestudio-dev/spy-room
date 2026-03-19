import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, ActivityIndicator, Alert } from 'react-native';
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

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {VOTING_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                }
              ]}
              onPress={() => handleCategorySelect(category)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryContent}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {category.name}
                </Text>
                <Text style={[styles.categoryDesc, { color: colors.textSub }]}>
                  {category.description}
                </Text>
              </View>
              <View style={[styles.checkCircle, { borderColor: getAccentColor() }]}>
                <LinearGradient
                  colors={getGradientColors()}
                  style={styles.checkGradient}
                >
                  <Text style={styles.checkmark}>✓</Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))}
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
    categoriesGrid: {
      paddingHorizontal: 12,
      gap: 12,
    },
    categoryCard: {
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 4,
      minHeight: 120,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    categoryContent: {
      flex: 1,
      marginRight: 12,
    },
    categoryEmoji: {
      fontSize: 32,
      marginBottom: 8,
    },
    categoryName: {
      fontSize: 17,
      fontWeight: '800',
      marginBottom: 4,
    },
    categoryDesc: {
      fontSize: 12,
      lineHeight: 16,
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
    checkGradient: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
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
