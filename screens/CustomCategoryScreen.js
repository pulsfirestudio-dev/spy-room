import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const translations = {
  en: {
    title: 'CUSTOM CATEGORY',
    categoryName: 'CATEGORY NAME',
    enterName: 'Enter category name...',
    words: 'WORDS (6 required)',
    enterWord: 'Enter word...',
    add: 'ADD',
    save: 'SAVE CATEGORY',
    back: 'BACK',
    needSix: 'Please add exactly 6 words!',
    noName: 'Please enter a category name',
    success: 'Category saved!',
  },
  lt: {
    title: 'SAVO KATEGORIJA',
    categoryName: 'KATEGORIJOS PAVADINIMAS',
    enterName: 'Įveskite pavadinimą...',
    words: 'ŽODŽIAI (reikia 6)',
    enterWord: 'Įveskite žodį...',
    add: 'PRIDĖTI',
    save: 'IŠSAUGOTI',
    back: 'ATGAL',
    needSix: 'Reikia būtent 6 žodžių!',
    noName: 'Įveskite kategorijos pavadinimą',
    success: 'Kategorija išsaugota!',
  },
  es: {
    title: 'CATEGORÍA PERSONALIZADA',
    categoryName: 'NOMBRE DE CATEGORÍA',
    enterName: 'Escribe el nombre...',
    words: 'PALABRAS (6 requeridas)',
    enterWord: 'Escribe una palabra...',
    add: 'AÑADIR',
    save: 'GUARDAR CATEGORÍA',
    back: 'ATRÁS',
    needSix: '¡Añade exactamente 6 palabras!',
    noName: 'Introduce un nombre de categoría',
    success: '¡Categoría guardada!',
  },
  fr: {
    title: 'CATÉGORIE PERSONNALISÉE',
    categoryName: 'NOM DE LA CATÉGORIE',
    enterName: 'Entrez un nom...',
    words: 'MOTS (6 requis)',
    enterWord: 'Entrez un mot...',
    add: 'AJOUTER',
    save: 'ENREGISTRER LA CATÉGORIE',
    back: 'RETOUR',
    needSix: 'Veuillez ajouter exactement 6 mots !',
    noName: 'Entrez un nom de catégorie',
    success: 'Catégorie enregistrée !',
  },
  de: {
    title: 'EIGENE KATEGORIE',
    categoryName: 'KATEGORIENAME',
    enterName: 'Name eingeben...',
    words: 'WÖRTER (6 erforderlich)',
    enterWord: 'Wort eingeben...',
    add: 'HINZUFÜGEN',
    save: 'KATEGORIE SPEICHERN',
    back: 'ZURÜCK',
    needSix: 'Bitte genau 6 Wörter hinzufügen!',
    noName: 'Bitte einen Kategorienamen eingeben',
    success: 'Kategorie gespeichert!',
  },
  pl: {
    title: 'WŁASNA KATEGORIA',
    categoryName: 'NAZWA KATEGORII',
    enterName: 'Wpisz nazwę...',
    words: 'SŁOWA (wymagane 6)',
    enterWord: 'Wpisz słowo...',
    add: 'DODAJ',
    save: 'ZAPISZ KATEGORIĘ',
    back: 'WRÓĆ',
    needSix: 'Dodaj dokładnie 6 słów!',
    noName: 'Wprowadź nazwę kategorii',
    success: 'Kategoria zapisana!',
  },
  pt: {
    title: 'CATEGORIA PERSONALIZADA',
    categoryName: 'NOME DA CATEGORIA',
    enterName: 'Digite o nome...',
    words: 'PALAVRAS (6 necessárias)',
    enterWord: 'Digite uma palavra...',
    add: 'ADICIONAR',
    save: 'SALVAR CATEGORIA',
    back: 'VOLTAR',
    needSix: 'Adicione exatamente 6 palavras!',
    noName: 'Digite um nome de categoria',
    success: 'Categoria salva!',
  },
  it: {
    title: 'CATEGORIA PERSONALIZZATA',
    categoryName: 'NOME CATEGORIA',
    enterName: 'Inserisci un nome...',
    words: 'PAROLE (6 richieste)',
    enterWord: 'Inserisci una parola...',
    add: 'AGGIUNGI',
    save: 'SALVA CATEGORIA',
    back: 'INDIETRO',
    needSix: 'Aggiungi esattamente 6 parole!',
    noName: 'Inserisci un nome per la categoria',
    success: 'Categoria salvata!',
  },
  nl: {
    title: 'AANGEPASTE CATEGORIE',
    categoryName: 'CATEGORIENAAM',
    enterName: 'Voer naam in...',
    words: 'WOORDEN (6 vereist)',
    enterWord: 'Voer een woord in...',
    add: 'TOEVOEGEN',
    save: 'CATEGORIE OPSLAAN',
    back: 'TERUG',
    needSix: 'Voeg precies 6 woorden toe!',
    noName: 'Voer een categorienaam in',
    success: 'Categorie opgeslagen!',
  },
  ro: {
    title: 'CATEGORIE PERSONALIZATĂ',
    categoryName: 'NUMELE CATEGORIEI',
    enterName: 'Introdu un nume...',
    words: 'CUVINTE (6 necesare)',
    enterWord: 'Introdu un cuvânt...',
    add: 'ADAUGĂ',
    save: 'SALVEAZĂ CATEGORIA',
    back: 'ÎNAPOI',
    needSix: 'Adaugă exact 6 cuvinte!',
    noName: 'Introdu un nume de categorie',
    success: 'Categorie salvată!',
  },
};

export default function CustomCategoryScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];
  const [categoryName, setCategoryName] = useState('');
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const styles = getStyles(colors, isDarkMode);

  const addWord = () => {
    if (!newWord.trim()) return;
    if (words.length >= 6) { Alert.alert('Error', 'Max 6 words'); return; }
    setWords([...words, newWord.trim()]);
    setNewWord('');
  };

  const removeWord = (index) => {
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
  };

  const saveCategory = () => {
    if (!categoryName.trim()) { Alert.alert('Error', t.noName); return; }
    if (words.length !== 6) { Alert.alert('Error', t.needSix); return; }
    Alert.alert('Success', t.success);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isDarkMode && <LinearGradient colors={['#3EC9C1', '#1a7ac7']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" />}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.categoryName}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.enterName}
            placeholderTextColor="#fff"
            value={categoryName}
            onChangeText={setCategoryName}
            maxLength={20}
            color="#fff"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.words} ({words.length}/6)</Text>
          <View style={styles.wordInputContainer}>
            <TextInput
              style={styles.wordInput}
              placeholder={t.enterWord}
              placeholderTextColor="#fff"
              value={newWord}
              onChangeText={setNewWord}
              maxLength={15}
              color="#fff"
            />
            <TouchableOpacity style={styles.addButton} onPress={addWord}>
              <Text style={styles.addButtonText}>{t.add}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.wordsList}>
          {words.map((word, index) => (
            <View key={index} style={styles.wordChip}>
              <Text style={styles.wordNumber}>{index + 1}.</Text>
              <Text style={styles.wordText}>{word}</Text>
              <TouchableOpacity onPress={() => removeWord(index)}>
                <Ionicons name="close-circle" size={20} color="#ff1a1a" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(words.length / 6) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{words.length}/6</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>{t.save}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  title: { fontSize: 20, fontFamily: 'SpecialElite_400Regular', color: '#fff', letterSpacing: 1, textShadowColor: isDarkMode ? colors.primary : 'transparent', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: isDarkMode ? 2 : 0 },
  placeholder: { width: 44 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 13, fontFamily: 'SpecialElite_400Regular', color: '#fff', letterSpacing: 2, marginBottom: 10 },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 18, borderWidth: 2, borderColor: colors.border, fontSize: 14, color: '#fff' },
  wordInputContainer: { flexDirection: 'row', gap: 10 },
  wordInput: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 18, borderWidth: 2, borderColor: colors.border, fontSize: 14, color: '#fff' },
  addButton: { backgroundColor: colors.primary, paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.primary },
  addButtonText: { color: '#fff', fontFamily: 'SpecialElite_400Regular' },
  wordsList: { gap: 10, marginBottom: 25 },
  wordChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 15, borderRadius: 12, borderWidth: 2, borderColor: colors.border, gap: 10 },
  wordNumber: { color: '#fff', fontFamily: 'SpecialElite_400Regular', width: 30 },
  wordText: { flex: 1, color: '#fff', fontSize: 14, fontFamily: 'SpecialElite_400Regular' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  progressBar: { flex: 1, height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  progressText: { color: '#fff', fontFamily: 'SpecialElite_400Regular' },
  saveButton: { backgroundColor: '#00ff88', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 12, marginBottom: 15, gap: 10, borderWidth: 2, borderColor: '#00ff88' },
  saveButtonText: { color: '#fff', fontSize: 16, fontFamily: 'SpecialElite_400Regular', letterSpacing: 2 },
  backButtonLarge: { backgroundColor: colors.surface, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  backButtonText: { color: '#fff', fontSize: 14, fontFamily: 'SpecialElite_400Regular' },
});
