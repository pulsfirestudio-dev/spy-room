import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const wt = {
  en: { title: 'Weekly Categories', subtitle: 'New challenges every week', thisWeek: 'THIS WEEK', thisWeekName: 'Movie Celebrities', thisWeekDesc: 'Guess famous actors and directors!', voteTitle: 'Vote for Categories', voteDesc: "Help choose next week's topics", feature: 'Exclusive premium content', goPremium: 'Go Premium Now', notNow: 'Not now' },
  lt: { title: 'Savaitės Kategorijos', subtitle: 'Nauji iššūkiai kiekvieną savaitę', thisWeek: 'ŠI SAVAITĖ', thisWeekName: 'Kino Žvaigždės', thisWeekDesc: 'Atspėk garsias aktorius ir režisierius!', voteTitle: 'Balsuoti už kategorijas', voteDesc: 'Padėkite pasirinkti kitos savaitės temas', feature: 'Išskirtinis premium turinys', goPremium: 'Gauti Premium', notNow: 'Ne dabar' },
  es: { title: 'Categorías Semanales', subtitle: 'Nuevos retos cada semana', thisWeek: 'ESTA SEMANA', thisWeekName: 'Celebridades del Cine', thisWeekDesc: '¡Adivina actores y directores famosos!', voteTitle: 'Votar por categorías', voteDesc: 'Ayuda a elegir los temas de la próxima semana', feature: 'Contenido premium exclusivo', goPremium: 'Ir a Premium', notNow: 'Ahora no' },
  fr: { title: 'Catégories Hebdomadaires', subtitle: 'Nouveaux défis chaque semaine', thisWeek: 'CETTE SEMAINE', thisWeekName: 'Célébrités du Cinéma', thisWeekDesc: 'Devinez des acteurs et réalisateurs célèbres !', voteTitle: 'Voter pour des catégories', voteDesc: 'Aidez à choisir les thèmes de la semaine prochaine', feature: 'Contenu premium exclusif', goPremium: 'Passer Premium', notNow: 'Pas maintenant' },
  de: { title: 'Wöchentliche Kategorien', subtitle: 'Jede Woche neue Herausforderungen', thisWeek: 'DIESE WOCHE', thisWeekName: 'Film-Promis', thisWeekDesc: 'Rate berühmte Schauspieler und Regisseure!', voteTitle: 'Für Kategorien abstimmen', voteDesc: 'Hilf dabei, die Themen der nächsten Woche zu wählen', feature: 'Exklusiver Premium-Inhalt', goPremium: 'Jetzt Premium', notNow: 'Nicht jetzt' },
  pl: { title: 'Tygodniowe Kategorie', subtitle: 'Nowe wyzwania każdego tygodnia', thisWeek: 'W TYM TYGODNIU', thisWeekName: 'Gwiazdy Kina', thisWeekDesc: 'Zgaduj znanych aktorów i reżyserów!', voteTitle: 'Głosuj na kategorie', voteDesc: 'Pomóż wybrać tematy na następny tydzień', feature: 'Ekskluzywna zawartość premium', goPremium: 'Zdobądź Premium', notNow: 'Nie teraz' },
  pt: { title: 'Categorias Semanais', subtitle: 'Novos desafios toda semana', thisWeek: 'ESTA SEMANA', thisWeekName: 'Celebridades do Cinema', thisWeekDesc: 'Adivinhe atores e diretores famosos!', voteTitle: 'Votar em categorias', voteDesc: 'Ajude a escolher os temas da próxima semana', feature: 'Conteúdo premium exclusivo', goPremium: 'Ir para Premium', notNow: 'Agora não' },
  it: { title: 'Categorie Settimanali', subtitle: 'Nuove sfide ogni settimana', thisWeek: 'QUESTA SETTIMANA', thisWeekName: 'Celebrità del Cinema', thisWeekDesc: 'Indovina attori e registi famosi!', voteTitle: 'Vota per le categorie', voteDesc: 'Aiuta a scegliere i temi della prossima settimana', feature: 'Contenuto premium esclusivo', goPremium: 'Vai a Premium', notNow: 'Non ora' },
  nl: { title: 'Wekelijkse Categorieën', subtitle: 'Elke week nieuwe uitdagingen', thisWeek: 'DEZE WEEK', thisWeekName: 'Filmsterren', thisWeekDesc: 'Raad beroemde acteurs en regisseurs!', voteTitle: 'Stem op categorieën', voteDesc: 'Help de thema\'s van volgende week te kiezen', feature: 'Exclusieve premium-inhoud', goPremium: 'Ga naar Premium', notNow: 'Niet nu' },
  ro: { title: 'Categorii Săptămânale', subtitle: 'Provocări noi în fiecare săptămână', thisWeek: 'SĂPTĂMÂNA ACEASTA', thisWeekName: 'Celebrități de Film', thisWeekDesc: 'Ghicește actori și regizori celebri!', voteTitle: 'Votează pentru categorii', voteDesc: 'Ajută la alegerea temelor pentru săptămâna viitoare', feature: 'Conținut premium exclusiv', goPremium: 'Mergi la Premium', notNow: 'Nu acum' },
};

export default function WeeklyCategoriesModal({ visible, onClose, onPurchase, isPremium, onVote, language }) {
  const { colors, isDarkMode } = useTheme();
  const [selectedSection, setSelectedSection] = useState('thisWeek');
  const t = wt[language] || wt.en;
  const secondaryText = isDarkMode ? colors.textSecondary : '#1d3557';

  if (isPremium) return null;

  const getGradientColors = () => {
    if (isDarkMode) {
      return ['#ff3333', '#cc1111', '#991111'];
    } else {
      return ['#1d3557', '#1a7ac7'];
    }
  };

  const getAccentColor = () => {
    return isDarkMode ? '#ff3333' : '#e63946';
  };

  const styles = getStyles(colors, isDarkMode);
  const ltFont = (size) => language === 'lt' ? { fontFamily: 'SpecialElite_400Regular', fontSize: size - 2 } : {};

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
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1c1c1e' : colors.background }]}>
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
            <Text style={[styles.title, { color: colors.text }, ltFont(32)]}>{t.title}</Text>
            <Text style={[styles.subtitle, { color: secondaryText }, ltFont(15)]}>{t.subtitle}</Text>

            {/* This Week's Category */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedSection('thisWeek')}
              style={[
                styles.upcomingCard,
                {
                  backgroundColor: isDarkMode ? getAccentColor() + '30' : getAccentColor() + '10',
                  borderColor: selectedSection === 'thisWeek' ? getAccentColor() : isDarkMode ? '#444' : colors.surface,
                },
              ]}
            >
              <View style={styles.upcomingHeader}>
                <Text style={[styles.upcomingLabel, { color: getAccentColor() }, ltFont(10)]}>{t.thisWeek}</Text>
              </View>
              <Text style={[styles.upcomingTitle, { color: colors.text }, ltFont(19)]}>{t.thisWeekName}</Text>
              <Text style={[styles.upcomingDesc, { color: secondaryText }, ltFont(13)]}>{t.thisWeekDesc}</Text>
            </TouchableOpacity>

            {/* Vote for Categories */}
            <TouchableOpacity
              style={[
                styles.comingCard,
                {
                  backgroundColor: isDarkMode ? '#2a2a2a' : colors.surface,
                  borderColor: selectedSection === 'vote' ? getAccentColor() : isDarkMode ? '#555' : '#bbb',
                },
              ]}
              onPress={() => {
                setSelectedSection('vote');
                onVote();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="people" size={28} color={selectedSection === 'vote' ? getAccentColor() : colors.text} style={{ marginBottom: 8 }} />
              <Text style={[styles.comingTitle, { color: colors.text }, ltFont(17)]}>{t.voteTitle}</Text>
              <Text style={[styles.comingDesc, { color: secondaryText }, ltFont(13)]}>{t.voteDesc}</Text>
            </TouchableOpacity>

            {/* Features */}
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>🔥</Text>
              <Text style={[styles.featureText, { color: colors.text }, ltFont(14)]}>{t.feature}</Text>
            </View>

            {/* Buttons */}
            <LinearGradient
              colors={getGradientColors()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.purchaseBtnGradient}
            >
              <TouchableOpacity style={styles.purchaseBtn} onPress={onPurchase}>
                <Text style={[styles.purchaseBtnText, ltFont(17)]}>{t.goPremium}</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity style={[styles.laterBtn, { borderColor: getAccentColor() }]} onPress={onClose}>
              <Text style={[styles.laterBtnText, { color: getAccentColor() }, ltFont(15)]}>{t.notNow}</Text>
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
      shadowColor: '#ff1a1a',
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
      fontSize: 16,
      fontFamily: 'SpecialElite_400Regular',
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
      shadowColor: '#ff1a1a',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 18,
    },
    icon: {
      fontSize: 48,
    },
    title: {
      fontSize: 29,
      fontFamily: 'SpecialElite_400Regular',
      marginBottom: 6,
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 13,
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: 'SpecialElite_400Regular',
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
      fontFamily: 'SpecialElite_400Regular',
      letterSpacing: 1.5,
    },
    upcomingEmoji: {
      fontSize: 14,
    },
    upcomingTitle: {
      fontSize: 17,
      fontFamily: 'SpecialElite_400Regular',
      marginBottom: 6,
    },
    upcomingDesc: {
      fontSize: 13,
      lineHeight: 18,
      fontFamily: 'SpecialElite_400Regular',
    },
    comingCard: {
      width: '100%',
      borderRadius: 14,
      padding: 18,
      marginBottom: 18,
      alignItems: 'center',
      borderWidth: 2,
    },
    comingTitle: {
      fontSize: 15,
      fontFamily: 'SpecialElite_400Regular',
      marginBottom: 4,
      textAlign: 'center',
    },
    comingDesc: {
      fontSize: 13,
      textAlign: 'center',
      fontFamily: 'SpecialElite_400Regular',
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      marginBottom: 18,
    },
    featureIcon: {
      fontSize: 16,
      width: 24,
    },
    featureText: {
      flex: 1,
      fontSize: 13,
      fontFamily: 'SpecialElite_400Regular',
    },
    purchaseBtnGradient: {
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
    purchaseBtn: {
      width: '100%',
      paddingVertical: 16,
      alignItems: 'center',
      borderRadius: 10,
    },
    purchaseBtnText: {
      fontSize: 15,
      fontFamily: 'SpecialElite_400Regular',
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
      fontSize: 13,
      fontFamily: 'SpecialElite_400Regular',
    },
  });
};
