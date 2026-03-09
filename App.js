import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import Purchases from 'react-native-purchases';

import HomeScreen from './screens/HomeScreen';
import CreateRoomScreen from './screens/CreateRoomScreen';
import GameScreen from './screens/GameScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import JoinRoomScreen from './screens/JoinRoomScreen';
import LobbyScreen from './screens/LobbyScreen';
import CustomCategoryScreen from './screens/CustomCategoryScreen';
import SelectLanguageScreen from './screens/SelectLanguageScreen';
import SettingsScreen from './screens/SettingsScreen';
import DiscussionScreen from './screens/DiscussionScreen';
import RevealResultScreen from './screens/RevealResultScreen';

import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { PremiumProvider } from './context/PremiumContext';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize RevenueCat
        // IMPORTANT: Replace 'YOUR_REVENUECAT_API_KEY' with your actual RevenueCat API key
        // Get your API key from https://app.revenuecat.com/
        await Purchases.configure({
          apiKey: 'YOUR_REVENUECAT_API_KEY', // TODO: Replace with actual key
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SettingsProvider>
      <ThemeProvider>
        <PremiumProvider>
          <NavigationContainer>
            <View style={styles.container} onLayout={onLayoutRootView}>
              <StatusBar style="auto" />
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
                <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
                <Stack.Screen name="Lobby" component={LobbyScreen} />
                <Stack.Screen name="Game" component={GameScreen} />
                <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
                <Stack.Screen name="CustomCategory" component={CustomCategoryScreen} />
                <Stack.Screen name="SelectLanguage" component={SelectLanguageScreen} />
                <Stack.Screen name="Discussion" component={DiscussionScreen} />
                <Stack.Screen name="RevealResult" component={RevealResultScreen} />
              </Stack.Navigator>
            </View>
          </NavigationContainer>
        </PremiumProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});