import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Currency } from '@/constants/currencies';
import { convertCurrency, formatCurrency } from '@/constants/currencies';

const CURRENCY_STORAGE_KEY = '@bakrôsur_currency';

export const [CurrencyProvider, useCurrency] = createContextHook(() => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('FCFA');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const stored = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (stored) {
        setSelectedCurrency(stored as Currency);
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeCurrency = useCallback(async (currency: Currency) => {
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currency);
      setSelectedCurrency(currency);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  }, []);

  const convert = useCallback(
    (amount: number, from: Currency = 'FCFA') => {
      return convertCurrency(amount, from, selectedCurrency);
    },
    [selectedCurrency]
  );

  const format = useCallback(
    (amount: number, from: Currency = 'FCFA') => {
      const converted = convert(amount, from);
      return formatCurrency(converted, selectedCurrency);
    },
    [convert, selectedCurrency]
  );

  return useMemo(
    () => ({
      selectedCurrency,
      changeCurrency,
      convert,
      format,
      isLoading,
    }),
    [selectedCurrency, changeCurrency, convert, format, isLoading]
  );
});
