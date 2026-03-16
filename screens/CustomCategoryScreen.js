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
  }
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
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  title: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1, textShadowColor: isDarkMode ? colors.primary : 'transparent', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: isDarkMode ? 2 : 0 },
  placeholder: { width: 44 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 2, marginBottom: 10 },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 18, borderWidth: 2, borderColor: colors.border, fontSize: 16, color: '#fff' },
  wordInputContainer: { flexDirection: 'row', gap: 10 },
  wordInput: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 18, borderWidth: 2, borderColor: colors.border, fontSize: 16, color: '#fff' },
  addButton: { backgroundColor: colors.primary, paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.primary },
  addButtonText: { color: '#fff', fontWeight: '800' },
  wordsList: { gap: 10, marginBottom: 25 },
  wordChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 15, borderRadius: 12, borderWidth: 2, borderColor: colors.border, gap: 10 },
  wordNumber: { color: '#fff', fontWeight: '800', width: 30 },
  wordText: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  progressBar: { flex: 1, height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  progressText: { color: '#fff', fontWeight: '700' },
  saveButton: { backgroundColor: '#00ff88', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 12, marginBottom: 15, gap: 10, borderWidth: 2, borderColor: '#00ff88' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  backButtonLarge: { backgroundColor: colors.surface, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
