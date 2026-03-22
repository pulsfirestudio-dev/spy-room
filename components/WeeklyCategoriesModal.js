import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function WeeklyCategoriesModal({ visible, onClose, onPurchase, isPremium, onVote }) {
  const { colors, isDarkMode } = useTheme();

  if (isPremium) return null;

  const getGradientColors = () => {
    if (isDarkMode) {
      return ['#9B00FF', '#CC0055', '#FF4500'];
    } else {
      return ['#7B00E0', '#C2005A', '#FF2200'];
    }
  };

  const getAccentColor = () => {
    return isDarkMode ? '#CC0055' : '#C2005A';
  };

  const styles = getStyles(colors, isDarkMode);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            {/* Close button */}
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: getAccentColor() + '20' }]} onPress={onClose}>
              <Text style={[styles.closeBtnText, { color: getAccentColor() }]}>✕</Text>
            </TouchableOpacity>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name="diamond" size={48} color="#fff" />
              </LinearGradient>
            </View>

            {/* Content */}
            <Text style={[styles.title, { color: colors.text }]}>Weekly Categories</Text>
            <Text style={[styles.subtitle, { color: colors.textSub }]}>New challenges every week</Text>

            {/* This Week's Category */}
            <View style={[styles.upcomingCard, { backgroundColor: getAccentColor() + '10', borderColor: getAccentColor() }]}>
              <View style={styles.upcomingHeader}>
                <Text style={[styles.upcomingLabel, { color: getAccentColor() }]}>THIS WEEK</Text>
                <Text style={[styles.upcomingEmoji]}>⭐</Text>
              </View>
              <Text style={[styles.upcomingTitle, { color: colors.text }]}>Movie Celebrities</Text>
              <Text style={[styles.upcomingDesc, { color: colors.textSub }]}>Guess famous actors and directors!</Text>
            </View>

            {/* Coming Soon Section */}
            <TouchableOpacity 
              style={[styles.comingCard, { backgroundColor: colors.surface }]}
              onPress={onVote}
              activeOpacity={0.7}
            >
              <Text style={[styles.comingEmoji]}>🗳️</Text>
              <Text style={[styles.comingTitle, { color: colors.text }]}>Vote for Categories</Text>
              <Text style={[styles.comingDesc, { color: colors.textSub }]}>Help choose next week's topics</Text>
            </TouchableOpacity>

            {/* Features */}
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>🔥</Text>
              <Text style={[styles.featureText, { color: colors.text }]}>Exclusive premium content</Text>
            </View>

            {/* Buttons */}
            <LinearGradient
              colors={getGradientColors()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.purchaseBtnGradient}
            >
              <TouchableOpacity style={styles.purchaseBtn} onPress={onPurchase}>
                <Text style={styles.purchaseBtnText}>Go Premium Now</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity style={[styles.laterBtn, { borderColor: getAccentColor() }]} onPress={onClose}>
              <Text style={[styles.laterBtnText, { color: getAccentColor() }]}>Not now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const getStyles = (colors, isDarkMode) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    gradientBorder: {
      padding: 2,
      borderRadius: 28,
      shadowColor: '#9B00FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 25,
    },
    modalContainer: {
      borderRadius: 26,
      overflow: 'hidden',
      paddingVertical: 32,
      paddingHorizontal: 28,
      alignItems: 'center',
    },
    closeBtn: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    closeBtnText: {
      fontSize: 18,
      fontWeight: '700',
    },
    iconContainer: {
      marginBottom: 18,
    },
    iconGradient: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#9B00FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 18,
    },
    icon: {
      fontSize: 48,
    },
    title: {
      fontSize: 32,
      fontWeight: '900',
      marginBottom: 6,
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: '500',
    },
    upcomingCard: {
      width: '100%',
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
      borderWidth: 2,
    },
    upcomingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    upcomingLabel: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1.5,
    },
    upcomingEmoji: {
      fontSize: 16,
    },
    upcomingTitle: {
      fontSize: 19,
      fontWeight: '800',
      marginBottom: 6,
    },
    upcomingDesc: {
      fontSize: 13,
      lineHeight: 18,
    },
    comingCard: {
      width: '100%',
      borderRadius: 14,
      padding: 18,
      marginBottom: 18,
      alignItems: 'center',
    },
    comingEmoji: {
      fontSize: 28,
      marginBottom: 8,
    },
    comingTitle: {
      fontSize: 17,
      fontWeight: '800',
      marginBottom: 4,
      textAlign: 'center',
    },
    comingDesc: {
      fontSize: 13,
      textAlign: 'center',
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      marginBottom: 18,
    },
    featureIcon: {
      fontSize: 18,
      width: 24,
    },
    featureText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
    },
    purchaseBtnGradient: {
      width: '100%',
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: '#ffffff',
      shadowColor: '#9B00FF',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 15,
    },
    purchaseBtn: {
      width: '100%',
      paddingVertical: 16,
      alignItems: 'center',
      borderRadius: 10,
    },
    purchaseBtnText: {
      fontSize: 17,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    laterBtn: {
      width: '100%',
      paddingVertical: 14,
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 2,
    },
    laterBtnText: {
      fontSize: 15,
      fontWeight: '600',
    },
  });
};
