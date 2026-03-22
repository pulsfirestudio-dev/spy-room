import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';

const { width } = Dimensions.get('window');

const vt = {
  en: { back: '← Back', title: 'Vote for Category', chooseCategory: 'Choose a Category', totalVotes: (n) => `${n} total votes this week`, vote: 'Vote', voteSubmitted: 'Vote Submitted!', thankYou: 'Thanks for voting! To unlock all weekly categories and exclusive challenges, upgrade to Premium.', goPremium: 'Go Premium Now', notNow: 'Not now',
    cats: [ { name: 'Sports Legends', desc: 'Famous athletes and sports icons' }, { name: 'Movies & TV Shows', desc: 'Actors, directors, and characters' } ] },
  lt: { back: '← Atgal', title: 'Balsuoti už kategoriją', chooseCategory: 'Pasirinkite kategoriją', totalVotes: (n) => `${n} balsų šią savaitę`, vote: 'Balsuoti', voteSubmitted: 'Balsas Pateiktas!', thankYou: 'Ačiū už balsavimą! Norėdami atrakinti visas savaitės kategorijas, pereikite prie Premium.', goPremium: 'Gauti Premium', notNow: 'Ne dabar',
    cats: [ { name: 'Sporto Legendos', desc: 'Garsūs sportininkai ir ikonos' }, { name: 'Filmai ir TV Laidos', desc: 'Aktoriai, režisieriai ir personažai' } ] },
  es: { back: '← Atrás', title: 'Votar por Categoría', chooseCategory: 'Elige una Categoría', totalVotes: (n) => `${n} votos totales esta semana`, vote: 'Votar', voteSubmitted: '¡Voto Enviado!', thankYou: '¡Gracias por votar! Para desbloquear todas las categorías semanales, actualiza a Premium.', goPremium: 'Ir a Premium', notNow: 'Ahora no',
    cats: [ { name: 'Leyendas del Deporte', desc: 'Atletas famosos e iconos del deporte' }, { name: 'Películas y Series', desc: 'Actores, directores y personajes' } ] },
  fr: { back: '← Retour', title: 'Voter pour une Catégorie', chooseCategory: 'Choisissez une Catégorie', totalVotes: (n) => `${n} votes au total cette semaine`, vote: 'Voter', voteSubmitted: 'Vote Soumis !', thankYou: 'Merci pour votre vote ! Pour débloquer toutes les catégories hebdomadaires, passez à Premium.', goPremium: 'Passer Premium', notNow: 'Pas maintenant',
    cats: [ { name: 'Légendes du Sport', desc: 'Athlètes et icônes sportives célèbres' }, { name: 'Films et Séries TV', desc: 'Acteurs, réalisateurs et personnages' } ] },
  de: { back: '← Zurück', title: 'Für Kategorie Abstimmen', chooseCategory: 'Wähle eine Kategorie', totalVotes: (n) => `${n} Gesamtstimmen diese Woche`, vote: 'Abstimmen', voteSubmitted: 'Stimme Abgegeben!', thankYou: 'Danke für Ihre Stimme! Um alle wöchentlichen Kategorien zu entsperren, wechsle zu Premium.', goPremium: 'Jetzt Premium', notNow: 'Nicht jetzt',
    cats: [ { name: 'Sport-Legenden', desc: 'Berühmte Athleten und Sportikonen' }, { name: 'Filme & TV-Serien', desc: 'Schauspieler, Regisseure und Charaktere' } ] },
  pl: { back: '← Wróć', title: 'Głosuj na Kategorię', chooseCategory: 'Wybierz Kategorię', totalVotes: (n) => `${n} głosów w tym tygodniu`, vote: 'Głosuj', voteSubmitted: 'Głos Oddany!', thankYou: 'Dziękujemy za głosowanie! Aby odblokować wszystkie tygodniowe kategorie, przejdź na Premium.', goPremium: 'Zdobądź Premium', notNow: 'Nie teraz',
    cats: [ { name: 'Legendy Sportu', desc: 'Znani sportowcy i ikony sportu' }, { name: 'Filmy i Seriale TV', desc: 'Aktorzy, reżyserzy i postacie' } ] },
  pt: { back: '← Voltar', title: 'Votar por Categoria', chooseCategory: 'Escolha uma Categoria', totalVotes: (n) => `${n} votos totais esta semana`, vote: 'Votar', voteSubmitted: 'Voto Enviado!', thankYou: 'Obrigado por votar! Para desbloquear todas as categorias semanais, atualize para Premium.', goPremium: 'Ir para Premium', notNow: 'Agora não',
    cats: [ { name: 'Lendas do Esporte', desc: 'Atletas famosos e ícones do esporte' }, { name: 'Filmes e Séries', desc: 'Atores, diretores e personagens' } ] },
  it: { back: '← Indietro', title: 'Vota per la Categoria', chooseCategory: 'Scegli una Categoria', totalVotes: (n) => `${n} voti totali questa settimana`, vote: 'Vota', voteSubmitted: 'Voto Inviato!', thankYou: 'Grazie per aver votato! Per sbloccare tutte le categorie settimanali, passa a Premium.', goPremium: 'Vai a Premium', notNow: 'Non ora',
    cats: [ { name: 'Leggende dello Sport', desc: 'Atleti famosi e icone sportive' }, { name: 'Film e Serie TV', desc: 'Attori, registi e personaggi' } ] },
  nl: { back: '← Terug', title: 'Stem op Categorie', chooseCategory: 'Kies een Categorie', totalVotes: (n) => `${n} stemmen totaal deze week`, vote: 'Stem', voteSubmitted: 'Stem Uitgebracht!', thankYou: 'Bedankt voor je stem! Ontgrendel alle wekelijkse categorieën door te upgraden naar Premium.', goPremium: 'Ga naar Premium', notNow: 'Niet nu',
    cats: [ { name: 'Sportlegenden', desc: 'Beroemde atleten en sportikonen' }, { name: 'Films en TV-series', desc: 'Acteurs, regisseurs en personages' } ] },
  ro: { back: '← Înapoi', title: 'Votează pentru Categorie', chooseCategory: 'Alege o Categorie', totalVotes: (n) => `${n} voturi totale această săptămână`, vote: 'Votează', voteSubmitted: 'Vot Trimis!', thankYou: 'Mulțumim pentru vot! Pentru a debloca toate categoriile săptămânale, treci la Premium.', goPremium: 'Mergi la Premium', notNow: 'Nu acum',
    cats: [ { name: 'Legende ale Sportului', desc: 'Atleți celebri și icoane sportive' }, { name: 'Filme și Seriale TV', desc: 'Actori, regizori și personaje' } ] },
};

export default function VoteCategoriesScreen({ navigation, route }) {
  const lang = route.params?.language || 'en';
  const t = vt[lang] || vt.en;
  const VOTING_CATEGORIES = t.cats.map((c, i) => ({ id: i + 1, emoji: i === 0 ? '⚽' : '🎬', name: c.name, description: c.desc }));

// Seeded community vote base counts
const BASE_VOTES = { 1: 142, 2: 89 };

  const { colors, isDarkMode } = useTheme();
  const { purchasePremium, isPremium } = usePremium();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voteCounts, setVoteCounts] = useState(BASE_VOTES);

  useEffect(() => {
    const loadVotes = async () => {
      try {
        const stored = await AsyncStorage.getItem('categoryVoteCounts');
        if (stored) setVoteCounts(JSON.parse(stored));
      } catch (_) {}
    };
    loadVotes();
  }, []);

  const getGradientColors = () => {
    if (isDarkMode) {
      return ['#ff3333', '#cc1111', '#991111'];
    } else {
      return ['#1d3557', '#1a7ac7'];
    }
  };

  const getCardGradientColors = () => {
    if (isDarkMode) {
      return ['#2d0808', '#4a1010', '#2d0808'];
    } else {
      return ['#1d3557', '#2c5f8a'];
    }
  };

  const getAccentColor = () => {
    return isDarkMode ? '#ff1a1a' : '#e63946';
  };

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

  const handleCategorySelect = async (category) => {
    const updated = { ...voteCounts, [category.id]: voteCounts[category.id] + 1 };
    setVoteCounts(updated);
    try {
      await AsyncStorage.setItem('categoryVoteCounts', JSON.stringify(updated));
    } catch (_) {}
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
          { text: 'Continue', onPress: () => navigation.goBack() }
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
          <Text style={styles.backBtn}>{t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <View style={{ width: 50 }} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>{t.chooseCategory}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t.totalVotes(totalVotes)}
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {VOTING_CATEGORIES.map((category) => {
            const count = voteCounts[category.id] ?? 0;
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
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
                    {/* Vote bar */}
                    <View style={styles.voteBarBg}>
                      <View style={[styles.voteBarFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.voteCount}>{count} votes · {pct}%</Text>
                  </View>

                  <LinearGradient
                    colors={isDarkMode ? ['#ff1a1a', '#cc0000'] : ['#e63946', '#c0392b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.smallVoteBtn}
                  >
                    <Text style={styles.voteBtnText}>{t.vote}</Text>
                  </LinearGradient>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Purchase Prompt Modal */}
      <Modal visible={showPurchasePrompt} transparent={true} animationType="fade">
        <View style={styles.promptOverlay}>
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promptGradientBorder}
          >
            <View style={[styles.promptContainer, { backgroundColor: isDarkMode ? colors.background : '#ffffff' }]}>
              {/* Icon */}
              <View style={styles.promptIconContainer}>
                <LinearGradient
                  colors={getGradientColors()}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.promptIconGradient}
                >
                  <Ionicons name="checkmark-circle" size={40} color="#fff" />
                </LinearGradient>
              </View>

              {/* Selected Category Display */}
              {selectedCategory && (
                <View style={styles.selectedCategoryDisplay}>
                  <Text style={styles.selectedEmoji}>{selectedCategory.emoji}</Text>
                  <Text style={[styles.selectedName, { color: isDarkMode ? colors.text : '#1d3557' }]}>
                    {selectedCategory.name}
                  </Text>
                  <Text style={[styles.selectedVoteCount, { color: getAccentColor() }]}>
                    {voteCounts[selectedCategory.id]} votes
                  </Text>
                </View>
              )}

              {/* Message */}
              <Text style={[styles.promptTitle, { color: isDarkMode ? colors.text : '#1d3557' }]}>{t.voteSubmitted}</Text>
              <Text style={[styles.promptMessage, { color: isDarkMode ? colors.textSecondary : '#2c5f7a' }]}>
                {t.thankYou}
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
                    <Text style={styles.purchaseBtnText}>{t.goPremium}</Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity style={[styles.skipBtn, { borderColor: getAccentColor() }]} onPress={handleSkip}>
                <Text style={[styles.skipBtnText, { color: getAccentColor() }]}>{t.notNow}</Text>
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
    container: { flex: 1 },
    header: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16,
    },
    backBtn: { fontSize: 14, fontFamily: 'SpecialElite_400Regular', color: '#FFFFFF' },
    headerTitle: { fontSize: 16, fontFamily: 'SpecialElite_400Regular', color: '#FFFFFF' },
    content: { flex: 1 },
    scrollContent: { paddingBottom: 30 },
    titleSection: { paddingHorizontal: 16, paddingVertical: 24, alignItems: 'center' },
    title: { fontSize: 25, fontFamily: 'SpecialElite_400Regular', marginBottom: 6, textAlign: 'center', letterSpacing: -0.5 },
    subtitle: { fontSize: 13, textAlign: 'center', fontFamily: 'SpecialElite_400Regular' },
    categoriesContainer: { paddingHorizontal: 16, paddingVertical: 8, gap: 14 },
    cardWrapper: {
      borderRadius: 16, overflow: 'hidden',
      borderWidth: 2,
      borderColor: isDarkMode ? '#ff3333' : 'transparent',
      shadowColor: isDarkMode ? '#ff1a1a' : '#1d3557',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
    },
    smallCategoryCard: {
      padding: 18, flexDirection: 'row',
      justifyContent: 'space-between', alignItems: 'center', minHeight: 110,
    },
    smallCategoryContent: { flex: 1, gap: 6 },
    smallCategoryEmoji: { fontSize: 36 },
    smallCategoryName: { fontSize: 14, fontFamily: 'SpecialElite_400Regular', color: '#FFFFFF' },
    voteBarBg: {
      height: 6, borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.2)', width: '90%',
    },
    voteBarFill: {
      height: 6, borderRadius: 3,
      backgroundColor: '#FF4500',
    },
    voteCount: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'SpecialElite_400Regular' },
    smallVoteBtn: {
      paddingVertical: 10, paddingHorizontal: 18,
      borderRadius: 10, marginLeft: 12,
    },
    voteBtnText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'SpecialElite_400Regular', textAlign: 'center' },
    // Modal
    promptOverlay: {
      flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,
    },
    promptGradientBorder: {
      padding: 2, borderRadius: 28,
      shadowColor: '#9B00FF', shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5, shadowRadius: 20, elevation: 25,
    },
    promptContainer: { borderRadius: 26, padding: 28, alignItems: 'center' },
    promptIconContainer: { marginBottom: 20 },
    promptIconGradient: {
      width: 80, height: 80, borderRadius: 40,
      justifyContent: 'center', alignItems: 'center',
      shadowColor: '#9B00FF', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6, shadowRadius: 16, elevation: 18,
    },
    selectedCategoryDisplay: { alignItems: 'center', marginBottom: 16 },
    selectedEmoji: { fontSize: 48, marginBottom: 6 },
    selectedName: { fontSize: 18, fontFamily: 'SpecialElite_400Regular', letterSpacing: -0.5, marginBottom: 4 },
    selectedVoteCount: { fontSize: 13, fontFamily: 'SpecialElite_400Regular' },
    promptTitle: { fontSize: 21, fontFamily: 'SpecialElite_400Regular', marginBottom: 12, textAlign: 'center' },
    promptMessage: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24, fontFamily: 'SpecialElite_400Regular' },
    purchaseBtnGradient: {
      width: '100%', borderRadius: 12, marginBottom: 10,
      shadowColor: '#9B00FF', shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5, shadowRadius: 16, elevation: 15,
    },
    purchaseBtn: { width: '100%', paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
    purchaseBtnText: { fontSize: 14, fontFamily: 'SpecialElite_400Regular', color: '#FFFFFF', letterSpacing: 0.5 },
    skipBtn: { width: '100%', paddingVertical: 12, alignItems: 'center', borderRadius: 10, borderWidth: 2 },
    skipBtnText: { fontSize: 13, fontFamily: 'SpecialElite_400Regular' },
  });
};
