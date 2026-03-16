// RevealResultScreen.js — all cards red outlined, pure black bg, back button white/black outlined
import React, { useEffect, useMemo } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView,
} from "react-native";
import SoundManager from "../utils/SoundManager";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function RevealResultScreen({ route, navigation }) {
  const { colors, isDarkMode } = useTheme();
  const {
    players = [], language = "en", categoryName = null,
    word = null, spyIndex = null, imposterIndices = [],
  } = route.params || {};

  const imposterNames =
    Array.isArray(imposterIndices) && imposterIndices.length
      ? imposterIndices.map((i) => players[i]).filter(Boolean)
      : Number.isInteger(spyIndex) ? [players[spyIndex]].filter(Boolean) : [];

  const t = useMemo(() => {
    const EN = { title: "REVEAL", category: "CATEGORY", word: "THE WORD", spy: "IMPOSTER", back: "Back to Discussion" };
    const LT = { title: "ATSKLEIDIMAS", category: "KATEGORIJA", word: "ŽODIS", spy: "APSIMETĖLIS", back: "Grįžti į diskusiją" };
    return language === "lt" ? LT : EN;
  }, [language]);

  // Play dramatic sting + heavy haptic when spy is revealed
  useEffect(() => {
    SoundManager.playSpyRevealed();
  }, []);

  const styles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);
  const border = isDarkMode ? "#ffffff" : "#000000";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t.title}</Text>

        <View style={styles.card}>
          <Text style={styles.rowLabel}>{t.category}</Text>
          <Text style={styles.rowValue}>{categoryName || "—"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.rowLabel}>{t.word}</Text>
          <Text style={styles.wordValue}>{word || "—"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.rowLabel}>{t.spy}</Text>
          {imposterNames.length
            ? imposterNames.map((name, i) => <Text key={i} style={styles.imposterName}>🕵️ {name}</Text>)
            : <Text style={styles.imposterName}>—</Text>}
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Ionicons name="arrow-back" size={20} color={isDarkMode ? "#fff" : colors.text} />
          <Text style={[styles.backBtnText, { color: isDarkMode ? "#fff" : colors.text }]}>{t.back}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20, paddingTop: 40, paddingBottom: 40 },
    title: { fontSize: 26, fontWeight: "900", letterSpacing: 4, color: isDarkMode ? "#fff" : "#000", marginBottom: 28 },
    card: { backgroundColor: "transparent", borderRadius: 18, borderWidth: 2, borderColor: isDarkMode ? "#cc0000" : colors.text, padding: 22, marginBottom: 16 },
    rowLabel: { fontSize: 12, fontWeight: "800", letterSpacing: 3, color: isDarkMode ? "#cc0000" : colors.text, marginBottom: 8 },
    rowValue: { fontSize: 22, fontWeight: "800", color: isDarkMode ? "#fff" : "#000" },
    wordValue: { fontSize: 36, fontWeight: "900", letterSpacing: 1, color: isDarkMode ? "#fff" : "#000" },
    imposterName: { fontSize: 24, fontWeight: "800", color: isDarkMode ? "#fff" : "#000", marginTop: 2 },
    backBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10, paddingVertical: 17, borderRadius: 22, borderWidth: 2, backgroundColor: isDarkMode ? colors.primary : colors.surface, borderColor: isDarkMode ? "#fff" : colors.text },
    backBtnText: { fontSize: 17, fontWeight: "800", letterSpacing: 1 },
  });