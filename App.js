import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

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
import WeeklyCategoriesModal from './components/WeeklyCategoriesModal';

import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { PremiumProvider, PremiumContext } from './context/PremiumContext';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isPremium, purchasePremium, isLoading: premiumLoading } = useContext(PremiumContext);
  const [appIsReady, setAppIsReady] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Check if user has dismissed the modal before
        const hasDismissed = await AsyncStorage.getItem('weeklyModalDismissed');
        
        // Only show modal if user is not premium and hasn't dismissed it
        if (!isPremium && !hasDismissed && !premiumLoading) {
          setShowWeeklyModal(true);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    
    prepare();
  }, [isPremium, premiumLoading]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleCloseModal = async () => {
    setShowWeeklyModal(false);
    // Mark that user has dismissed the modal
    await AsyncStorage.setItem('weeklyModalDismissed', 'true');
  };

  const handlePurchase = async () => {
    const result = await purchasePremium();
    if (result.success) {
      setShowWeeklyModal(false);
      await AsyncStorage.setItem('weeklyModalDismissed', 'true');
    }
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <>
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
      
      <WeeklyCategoriesModal
        visible={showWeeklyModal}
        onClose={handleCloseModal}
        onPurchase={handlePurchase}
        isPremium={isPremium}
      />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <PremiumProvider>
          <AppContent />
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