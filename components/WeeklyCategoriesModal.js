import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WeeklyCategoriesModal({ visible, onClose, onPurchase, isPremium }) {
  if (isPremium) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#FF006E', '#8338EC', '#3A86FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.modalContainer}>
            {/* Close button */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#FF006E', '#8338EC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Text style={styles.icon}>✨</Text>
              </LinearGradient>
            </View>

            {/* Content */}
            <Text style={styles.title}>Weekly Challenges</Text>
            <Text style={styles.subtitle}>Unlock premium categories</Text>

            <View style={styles.featuresList}>
              <View style={styles.featureRow}>
                <Text style={styles.featureIcon}>🔥</Text>
                <Text style={styles.featureText}>New challenges every week</Text>
              </View>
              <View style={styles.featureRow}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text style={styles.featureText}>Trending topics & exclusive games</Text>
              </View>
              <View style={styles.featureRow}>
                <Text style={styles.featureIcon}>👑</Text>
                <Text style={styles.featureText}>Premium member perks</Text>
              </View>
            </View>

            {/* Buttons */}
            <LinearGradient
              colors={['#FF006E', '#8338EC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.purchaseBtnGradient}
            >
              <TouchableOpacity style={styles.purchaseBtn} onPress={onPurchase}>
                <Text style={styles.purchaseBtnText}>Go Premium</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity style={styles.laterBtn} onPress={onClose}>
              <Text style={styles.laterBtnText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    width: width * 0.88,
    padding: 2,
    borderRadius: 28,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  modalContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 0, 110, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    fontSize: 20,
    color: '#FF006E',
    fontWeight: '700',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#B0B0B0',
    marginBottom: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresList: {
    width: '100%',
    marginBottom: 32,
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255, 0, 110, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#FF006E',
  },
  featureIcon: {
    fontSize: 20,
    width: 28,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
    fontWeight: '500',
  },
  purchaseBtnGradient: {
    width: '100%',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  purchaseBtn: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  purchaseBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  laterBtn: {
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 110, 0.3)',
  },
  laterBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF006E',
  },
});
