import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// Fix credit: Graham Walsh. RevenueCat requires platform-specific public keys.
// Android uses a mobile key, while web testing must use a Web Billing key.
const REVENUECAT_ANDROID_API_KEY = 'goog_YgxvzPUbckehiMlsMfbvAxzsCES';
const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '';
const REVENUECAT_WEB_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_WEB_API_KEY || '';
let purchasesConfigured = false;
let purchasesConfigurePromise = null;

// Fix credit: Graham Walsh. Choose the key by runtime platform to avoid web/mobile key mismatches.
const getRevenueCatApiKey = () => {
  if (Platform.OS === 'android') return REVENUECAT_ANDROID_API_KEY;
  if (Platform.OS === 'ios') return REVENUECAT_IOS_API_KEY;
  if (Platform.OS === 'web') return REVENUECAT_WEB_API_KEY;
  return '';
};

const ensurePurchasesConfigured = async () => {
  if (purchasesConfigured) return;
  // Fix credit: Graham Walsh. Reuse one in-flight configure promise to avoid duplicate init races.
  if (purchasesConfigurePromise) {
    await purchasesConfigurePromise;
    return;
  }

  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    // Fix credit: Graham Walsh. Fail fast with a clear key error instead of crashing deep in configure.
    throw new Error(
      Platform.OS === 'web'
        ? 'RevenueCat Web Billing API key is missing. Set EXPO_PUBLIC_REVENUECAT_WEB_API_KEY for web testing.'
        : 'RevenueCat API key is missing for this platform.'
    );
  }

  purchasesConfigurePromise = (async () => {
    const silentLevel = LOG_LEVEL?.SILENT;
    // Fix credit: Graham Walsh. Guard LOG_LEVEL.SILENT because some runtimes expose it as undefined/null.
    if (silentLevel != null) {
      await Purchases.setLogLevel(silentLevel);
    }
    await Purchases.configure({ apiKey });
    purchasesConfigured = true;
  })();

  try {
    await purchasesConfigurePromise;
  } finally {
    purchasesConfigurePromise = null;
  }
};

const PremiumContext = createContext();

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load premium status from cache only — no RevenueCat call at startup
  useEffect(() => {
    const initializePremium = async () => {
      try {
        const cachedPremium = await AsyncStorage.getItem('premiumStatus');
        setIsPremium(cachedPremium === 'true');
      } catch (err) {
        console.warn('Error loading premium status:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initializePremium();
  }, []);

  const purchasePremium = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await ensurePurchasesConfigured();
      // Get available packages/products
      const offerings = await Purchases.getOfferings();

      if (offerings.current === null) {
        setError('Premium offer not available');
        setIsLoading(false);
        return { success: false, message: 'Premium offer not available' };
      }

      // Get the premium package (one-time purchase)
      const premiumPackage = offerings.current.availablePackages.find(
        (pkg) => {
          const identifier = (pkg?.identifier || '').toLowerCase();
          const title = (pkg?.product?.title || '').toLowerCase();
          return identifier === 'premium' || title.includes('premium');
        }
      );

      if (!premiumPackage) {
        setError('Premium package not found');
        setIsLoading(false);
        return { success: false, message: 'Premium package not found' };
      }

      // Attempt purchase
      const purchaseResult = await Purchases.purchasePackage(premiumPackage);

      // Check if premium entitlement is now active
      const hasPremium = purchaseResult.customerInfo.entitlements.active['premium'] !== undefined;

      if (hasPremium) {
        setIsPremium(true);
        await AsyncStorage.setItem('premiumStatus', 'true');
        setIsLoading(false);
        return { success: true, message: 'Purchase successful!' };
      } else {
        setError('Purchase verification failed');
        setIsLoading(false);
        return { success: false, message: 'Purchase verification failed' };
      }
    } catch (err) {
      setIsLoading(false);

      // Fix credit: Graham Walsh. Avoid `instanceof PurchasesError` because the constructor can be unavailable on some builds.
      const errorCode = err?.code;
      const purchaseCancelled = Purchases?.ErrorCode?.PurchaseCancelledError;
      const purchaseNotAllowed = Purchases?.ErrorCode?.PurchaseNotAllowedError;
      const networkError = Purchases?.ErrorCode?.NetworkError;

      if (errorCode === purchaseCancelled) {
        setError('Purchase cancelled');
        return { success: false, message: 'Purchase cancelled' };
      }
      if (errorCode === purchaseNotAllowed) {
        setError('Purchase not allowed on this device');
        return { success: false, message: 'Purchase not allowed on this device' };
      }
      if (errorCode === networkError) {
        setError('Network error - please check your connection');
        return { success: false, message: 'Network error' };
      }

      console.warn('Purchase error:', err);
      const message = err?.message || 'Purchase failed';
      setError(message);
      return { success: false, message };
    }
  };

  const restorePurchases = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await ensurePurchasesConfigured();
      const customerInfo = await Purchases.restorePurchases();
      const hasPremium = customerInfo.entitlements.active['premium'] !== undefined;

      if (hasPremium) {
        setIsPremium(true);
        await AsyncStorage.setItem('premiumStatus', 'true');
        setIsLoading(false);
        return { success: true, message: 'Purchases restored successfully!' };
      } else {
        setIsPremium(false);
        await AsyncStorage.setItem('premiumStatus', 'false');
        setIsLoading(false);
        return { success: false, message: 'No purchases found to restore' };
      }
    } catch (err) {
      console.warn('Restore purchases error:', err);
      setError(err.message || 'Restore failed');
      setIsLoading(false);
      return { success: false, message: err.message || 'Restore failed' };
    }
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        isLoading,
        error,
        purchasePremium,
        restorePurchases,
        clearError: () => setError(null),
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export { PremiumContext };
