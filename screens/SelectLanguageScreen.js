// SelectLanguageScreen.js - Fixed light mode visibility
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
];

const translations = {
  en: { title: 'SELECT LANGUAGE', back: 'BACK' },
  lt: { title: 'PASIRINKTI KALBĄ', back: 'ATGAL' }
};

export default function SelectLanguageScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const currentLang = route.params?.currentLang || 'en';
  const t = translations[currentLang];
  const styles = getStyles(colors, isDarkMode);

  const selectLanguage = (langCode) => navigation.navigate('Home', { language: langCode });

  return (
    <SafeAreaView style={styles.container}>
      {!isDarkMode && <LinearGradient colors={['#3EC9C1', '#1a7ac7']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" />}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? colors.background : '#3EC9C1'} />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.languagesContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.languageCard, currentLang === lang.code && styles.selectedCard]}
              onPress={() => selectLanguage(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={[styles.languageName, currentLang === lang.code && styles.selectedText]}>{lang.name}</Text>
              {currentLang === lang.code && <Ionicons name="checkmark-circle" size={24} color={isDarkMode ? '#fff' : '#000'} />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 20, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isDarkMode ? '#fff' : colors.text
  },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: isDarkMode ? '#fff' : '#000', 
    letterSpacing: 2, 
    textShadowColor: isDarkMode ? colors.primary : 'transparent', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: isDarkMode ? 2 : 0 
  },
  placeholder: { width: 44 },
  languagesContainer: { gap: 20, marginBottom: 40 },
  languageCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.surface, 
    padding: 20, 
    borderRadius: 16, 
    borderWidth: 2, 
    borderColor: '#000', 
    gap: 15 
  },
  selectedCard: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  flag: { fontSize: 40 },
  languageName: { 
    flex: 1, 
    fontSize: 20, 
    fontWeight: '700', 
    color: isDarkMode ? '#fff' : '#000' 
  },
  selectedText: { color: isDarkMode ? '#fff' : '#000' },
  backButtonLarge: { 
    backgroundColor: colors.primary, 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#000' 
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 2 },
});
