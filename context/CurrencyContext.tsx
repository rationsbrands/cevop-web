'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedCurrency } from '@/lib/currency';

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'NGN',
  setCurrency: () => {},
});

export function CurrencyProvider({
  children,
  initialCurrency,
}: {
  children: React.ReactNode;
  initialCurrency: SupportedCurrency;
}) {
  const [currency, setCurrencyState] = useState<SupportedCurrency>(initialCurrency);

  // Re-hydrate from sessionStorage if available
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('cevop_currency') as SupportedCurrency;
      if (stored && ['NGN', 'GBP', 'USD', 'Africa'].includes(stored)) {
        setCurrencyState(stored);
      }
    } catch {
      // Ignore
    }
  }, []);

  function setCurrency(c: SupportedCurrency) {
    setCurrencyState(c);
    // Store in sessionStorage so it persists across navigation
    try { sessionStorage.setItem('cevop_currency', c); } catch { void 0; }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
