import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts, SpecialElite_400Regular } from '@expo-google-fonts/special-elite';

import HomeScreen from './screens/HomeScreen';
import CreateRoomScreen from './screens/CreateRoomScreen';
import GameScreen from './screens/GameScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import JoinRoomScreen from './screens/JoinRoomScreen';
import LobbyScreen from './screens/LobbyScreen';
import MultiplayerMenuScreen from './screens/MultiplayerMenuScreen';
import MultiplayerGameScreen from './screens/MultiplayerGameScreen';
import CustomCategoryScreen from './screens/CustomCategoryScreen';
import SelectLanguageScreen from './screens/SelectLanguageScreen';
import SettingsScreen from './screens/SettingsScreen';
import DiscussionScreen from './screens/DiscussionScreen';
import RevealResultScreen from './screens/RevealResultScreen';
import VoteCategoriesScreen from './screens/VoteCategoriesScreen';
import OnboardingScreen from './screens/OnboardingScreen';

import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { PremiumProvider } from './context/PremiumContext';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Home');
  const [fontsLoaded] = useFonts({ SpecialElite_400Regular });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const seen = await AsyncStorage.getItem('hasSeenOnboarding');
        if (!seen) setInitialRoute('Onboarding');
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

  if (!appIsReady || !fontsLoaded) {
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
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
                <Stack.Screen name="VoteCategories" component={VoteCategoriesScreen} />
                <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
                <Stack.Screen name="Lobby" component={LobbyScreen} />
                <Stack.Screen name="MultiplayerMenu" component={MultiplayerMenuScreen} />
                <Stack.Screen name="MultiplayerGame" component={MultiplayerGameScreen} />
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