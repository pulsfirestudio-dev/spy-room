import React, { createContext, useContext } from 'react';

const PremiumContext = createContext();

export const PremiumProvider = ({ children }) => (
  <PremiumContext.Provider
    value={{
      isPremium: true,
      isLoading: false,
      error: null,
      purchasePremium: async () => ({ success: false, message: '' }),
      restorePurchases: async () => ({ success: false, message: '' }),
      clearError: () => {},
    }}
  >
    {children}
  </PremiumContext.Provider>
);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) throw new Error('usePremium must be used within a PremiumProvider');
  return context;
};

export { PremiumContext };
