import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';

const { width } = Dimensions.get('window');

const VOTING_CATEGORIES = [
  { id: 1, name: 'Sports Legends', emoji: '⚽', description: 'Famous athletes and sports icons' },
  { id: 2, name: 'Movies & TV Shows', emoji: '🎬', description: 'Actors, directors, and characters' },
];

export default function VoteCategoriesScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const { purchasePremium, isPremium } = usePremium();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getGradientColors = () => {
    if (isDarkMode) {
      return ['#9B00FF', '#CC0055', '#FF4500'];
    } else {
      return ['#7B00E0', '#C2005A', '#FF2200'];
    }
  };

  const getCardGradientColors = () => {
    if (isDarkMode) {
      return ['#2D0060', '#6A0080', '#3A0060'];
    } else {
      return ['#7B00E0', '#A020F0', '#6600CC'];
    }
  };

  const getAccentColor = () => {
    return isDarkMode ? '#CC0055' : '#C2005A';
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vote for Category</Text>
        <View style={{ width: 50 }} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>Choose a Category</Text>
          <Text style={[styles.subtitle, { color: colors.textSub }]}>Vote for the next weekly category</Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {VOTING_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategorySelect(category)}
              activeOpacity={0.7}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={getCardGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.smallCategoryCard}
              >
                <View style={styles.smallCategoryContent}>
                  <Text style={styles.smallCategoryEmoji}>{category.emoji}</Text>
                  <Text style={styles.smallCategoryName}>{category.name}</Text>
                </View>

                <LinearGradient
                  colors={['#FF4500', '#CC0055']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.smallVoteBtn}
                >
                  <Text style={styles.voteBtnText}>Vote</Text>
                </LinearGradient>
              </LinearGradient>
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
                  <Text style={styles.selectedEmoji}>{selectedCategory.emoji}</Text>
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
    </SafeAreaView>
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
      paddingVertical: 16,
    },
    backBtn: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#FFFFFF',
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
      paddingVertical: 8,
      gap: 14,
    },
    cardWrapper: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#9B00FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    smallCategoryCard: {
      padding: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 100,
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
      color: '#FFFFFF',
    },
    smallVoteBtn: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 10,
      marginLeft: 12,
    },
    voteBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
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
      shadowColor: '#9B00FF',
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
      shadowColor: '#9B00FF',
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
      shadowColor: '#9B00FF',
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
