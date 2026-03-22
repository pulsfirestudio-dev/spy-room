import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const slangData = {
  en: {
    catName: 'Irish Slang',
    headline: 'New Category Available!',
    sub: 'Unlock Irish Slang with Premium and test your lingo!',
    examples: [
      { word: 'Grand', hint: 'fine' },
      { word: 'Craic', hint: 'fun' },
      { word: 'Deadly', hint: 'great' },
    ],
    premium: 'Go Premium',
    dismiss: 'Not Now',
  },
  lt: {
    catName: 'Lietuviškas Slangas',
    headline: 'Nauja Kategorija!',
    sub: 'Atrakink Lietuvišką Slangą su Premium ir išbandyk!',
    examples: [
      { word: 'Bičas', hint: 'draugas' },
      { word: 'Šaunu', hint: 'gerai' },
      { word: 'Kaifas', hint: 'malonumas' },
    ],
    premium: 'Gauti Premium',
    dismiss: 'Ne dabar',
  },
  es: {
    catName: 'Argot Español',
    headline: '¡Nueva Categoría!',
    sub: '¡Desbloquea el Argot Español con Premium y demuestra tu vocabulario!',
    examples: [
      { word: 'Guay', hint: 'genial' },
      { word: 'Tío', hint: 'amigo' },
      { word: 'Mola', hint: 'gusta' },
    ],
    premium: 'Ir a Premium',
    dismiss: 'Ahora no',
  },
  fr: {
    catName: 'Argot Français',
    headline: 'Nouvelle Catégorie !',
    sub: "Débloque l'Argot Français avec Premium et montre ton style !",
    examples: [
      { word: 'Kiffer', hint: 'aimer' },
      { word: 'Ouf', hint: 'fou' },
      { word: 'Chelou', hint: 'bizarre' },
    ],
    premium: 'Passer Premium',
    dismiss: 'Pas maintenant',
  },
  de: {
    catName: 'Deutscher Slang',
    headline: 'Neue Kategorie!',
    sub: 'Schalte den Deutschen Slang mit Premium frei und zeig was du drauf hast!',
    examples: [
      { word: 'Geil', hint: 'toll' },
      { word: 'Alter', hint: 'freund' },
      { word: 'Krass', hint: 'extrem' },
    ],
    premium: 'Jetzt Premium',
    dismiss: 'Nicht jetzt',
  },
  pl: {
    catName: 'Polski Slang',
    headline: 'Nowa Kategoria!',
    sub: 'Odblokuj Polski Slang z Premium i sprawdź swój język!',
    examples: [
      { word: 'Spoko', hint: 'okej' },
      { word: 'Ziomek', hint: 'przyjaciel' },
      { word: 'Ogień', hint: 'super' },
    ],
    premium: 'Zdobądź Premium',
    dismiss: 'Nie teraz',
  },
  pt: {
    catName: 'Gíria Brasileira',
    headline: 'Nova Categoria!',
    sub: 'Desbloqueie a Gíria Brasileira com Premium e mostre sua habilidade!',
    examples: [
      { word: 'Cara', hint: 'pessoa' },
      { word: 'Mano', hint: 'irmão' },
      { word: 'Legal', hint: 'bom' },
    ],
    premium: 'Ir para Premium',
    dismiss: 'Agora não',
  },
  it: {
    catName: 'Slang Italiano',
    headline: 'Nuova Categoria!',
    sub: 'Sblocca lo Slang Italiano con Premium e metti alla prova il tuo vocabolario!',
    examples: [
      { word: 'Figo', hint: 'bello' },
      { word: 'Ganzo', hint: 'bravo' },
      { word: 'Sballo', hint: 'divertimento' },
    ],
    premium: 'Vai a Premium',
    dismiss: 'Non ora',
  },
  nl: {
    catName: 'Nederlandse Slang',
    headline: 'Nieuwe Categorie!',
    sub: 'Ontgrendel de Nederlandse Slang met Premium en laat je woordenschat zien!',
    examples: [
      { word: 'Vet', hint: 'gaaf' },
      { word: 'Lekker', hint: 'fijn' },
      { word: 'Sick', hint: 'geweldig' },
    ],
    premium: 'Ga naar Premium',
    dismiss: 'Niet nu',
  },
  ro: {
    catName: 'Argou Românesc',
    headline: 'Categorie Nouă!',
    sub: 'Deblochează Argoul Românesc cu Premium și arată ce știi!',
    examples: [
      { word: 'Mișto', hint: 'bun' },
      { word: 'Tare', hint: 'puternic' },
      { word: 'Marfă', hint: 'bun' },
    ],
    premium: 'Mergi la Premium',
    dismiss: 'Nu acum',
  },
};

export default function SlangPromoModal({ visible, language, onClose, onPurchase }) {
  const { colors, isDarkMode } = useTheme();
  const d = slangData[language] || slangData.en;

  const gradientColors = isDarkMode
    ? ['#ff3333', '#cc1111', '#991111']
    : ['#1d3557', '#1a7ac7'];

  const accentColor = isDarkMode ? '#ff3333' : '#e63946';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={[styles.container, { backgroundColor: isDarkMode ? '#1c1c1e' : '#ffffff' }]}>
            {/* Close */}
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: accentColor + '20' }]}
              onPress={onClose}
            >
              <Text style={[styles.closeBtnText, { color: accentColor }]}>✕</Text>
            </TouchableOpacity>

            {/* Icon */}
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Ionicons name="sparkles" size={40} color="#fff" />
            </LinearGradient>

            {/* Headline */}
            <Text style={[styles.headline, { color: colors.text }]}>{d.headline}</Text>
            <Text style={[styles.catName, { color: accentColor }]}>{d.catName}</Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>{d.sub}</Text>

            {/* Example words */}
            <View style={[styles.examplesBox, { backgroundColor: isDarkMode ? '#2a2a2a' : colors.surface, borderColor: isDarkMode ? '#444' : '#ddd' }]}>
              <Text style={[styles.examplesLabel, { color: accentColor }]}>PREVIEW</Text>
              {d.examples.map((ex, i) => (
                <View key={i} style={styles.exampleRow}>
                  <Text style={[styles.exampleWord, { color: colors.text }]}>{ex.word}</Text>
                  <Text style={[styles.exampleHint, { color: colors.textSecondary }]}>→ {ex.hint}</Text>
                </View>
              ))}
            </View>

            {/* Buttons */}
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumBtnGradient}
            >
              <TouchableOpacity style={styles.premiumBtn} onPress={onPurchase}>
                <Text style={styles.premiumBtnText}>{d.premium}</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={[styles.dismissBtn, { borderColor: accentColor }]}
              onPress={onClose}
            >
              <Text style={[styles.dismissBtnText, { color: accentColor }]}>{d.dismiss}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 28,
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
    width: '100%',
  },
  container: {
    borderRadius: 26,
    paddingVertical: 32,
    paddingHorizontal: 24,
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
  closeBtnText: { fontSize: 18, fontWeight: '700' },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
  },
  headline: {
    fontSize: 22,
    fontFamily: 'Orbitron_900Black',
    marginBottom: 6,
    textAlign: 'center',
  },
  catName: {
    fontSize: 16,
    fontFamily: 'Orbitron_700Bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sub: {
    fontSize: 13,
    fontFamily: 'Orbitron_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  examplesBox: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  examplesLabel: {
    fontSize: 10,
    fontFamily: 'Orbitron_700Bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exampleWord: {
    fontSize: 15,
    fontFamily: 'Orbitron_700Bold',
  },
  exampleHint: {
    fontSize: 13,
    fontFamily: 'Orbitron_400Regular',
  },
  premiumBtnGradient: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#ff1a1a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 15,
  },
  premiumBtn: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  premiumBtnText: {
    fontSize: 15,
    fontFamily: 'Orbitron_700Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  dismissBtn: {
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
  },
  dismissBtnText: {
    fontSize: 14,
    fontFamily: 'Orbitron_400Regular',
  },
});
