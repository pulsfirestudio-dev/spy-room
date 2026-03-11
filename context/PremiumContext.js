import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { PurchasesError } from 'react-native-purchases';

const PremiumContext = createContext();

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize premium status on app launch
  useEffect(() => {
    const initializePremium = async () => {
      try {
        // First, check AsyncStorage for cached premium status
        const cachedPremium = await AsyncStorage.getItem('premiumStatus');
        if (cachedPremium === 'true') {
          setIsPremium(true);
        }

        // Then check with RevenueCat in the background
        const customerInfo = await Purchases.getCustomerInfo();
        const hasPremium = customerInfo.entitlements.active['premium'] !== undefined;

        if (hasPremium) {
          setIsPremium(true);
          await AsyncStorage.setItem('premiumStatus', 'true');
        } else {
          setIsPremium(false);
          await AsyncStorage.setItem('premiumStatus', 'false');
        }
      } catch (err) {
        console.warn('Error initializing premium status:', err);
        // Fall back to cached value if RevenueCat check fails
        const cachedPremium = await AsyncStorage.getItem('premiumStatus');
        setIsPremium(cachedPremium === 'true');
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
      // Get available packages/products
      const offerings = await Purchases.getOfferings();

      if (offerings.current === null) {
        setError('Premium offer not available');
        setIsLoading(false);
        return { success: false, message: 'Premium offer not available' };
      }

      // Get the premium package (one-time purchase)
      const premiumPackage = offerings.current.availablePackages.find(
        (pkg) => pkg.identifier === 'premium' || pkg.product.title.toLowerCase().includes('premium')
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
      if (err instanceof PurchasesError) {
        setIsLoading(false);
        if (err.code === Purchases.ErrorCode.PurchaseCancelledError) {
          setError('Purchase cancelled');
          return { success: false, message: 'Purchase cancelled' };
        } else if (err.code === Purchases.ErrorCode.PurchaseNotAllowedError) {
          setError('Purchase not allowed on this device');
          return { success: false, message: 'Purchase not allowed on this device' };
        } else if (err.code === Purchases.ErrorCode.NetworkError) {
          setError('Network error - please check your connection');
          return { success: false, message: 'Network error' };
        }
      }

      console.warn('Purchase error:', err);
      setError(err.message || 'Purchase failed');
      setIsLoading(false);
      return { success: false, message: err.message || 'Purchase failed' };
    }
  };

  const restorePurchases = async () => {
    setIsLoading(true);
    setError(null);

    try {
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
