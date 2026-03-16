import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to DARK mode (neon)

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  // NEON GAMING COLOR PALETTE
  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      buttonOutline: '#ffffff',
      // NEON DARK MODE - Gaming Aesthetic
      background: '#050505',
      surface: '#0a0a0a',
      surfaceElevated: '#111111',
      primary: '#ff1a1a', // Electric Red
      primaryGlow: '#ff3333',
      accent: '#00ffff', // Neon Cyan
      accentPurple: '#bf00ff', // Neon Purple
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      textMuted: '#555555',
      border: '#1a1a1a',
      borderActive: '#ff1a1a',
      card: '#0f0f0f',
      success: '#00ff88', // Neon Green
      warning: '#ffaa00',
      error: '#ff1a1a',
      overlay: 'rgba(5,5,5,0.95)',
      shadow: '#ff1a1a',
      glow: 'rgba(255, 26, 26, 0.3)',
      glowCyan: 'rgba(0, 255, 255, 0.2)',
    } : {
      // LIGHT MODE (clean, modern)
      buttonOutline: '#000000',
      background: '#3EC9C1',
      surface: '#5dd6cf',
      surfaceElevated: '#7ae0da',
      primary: '#e63946',
      primaryGlow: '#c1121f',
      accent: '#00b4d8',
      accentPurple: '#9d4edd',
      text: '#1d3557',
      textSecondary: '#457b9d',
      textMuted: '#a8dadc',
      border: '#e9ecef',
      borderActive: '#e63946',
      card: '#ffffff',
      success: '#2a9d8f',
      warning: '#f4a261',
      error: '#e63946',
      overlay: 'rgba(29,53,87,0.8)',
      shadow: '#000000',
      glow: 'rgba(230, 57, 70, 0.2)',
      glowCyan: 'rgba(0, 180, 216, 0.1)',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
