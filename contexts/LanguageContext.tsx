import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGE_STORAGE_KEY = '@bakrosur_language';

export type SupportedLanguage = 'fr' | 'en' | 'ar';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    rtl: false,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
  },
];

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'fr'
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadLanguage = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored) {
        const lang = stored as SupportedLanguage;
        await i18n.changeLanguage(lang);
        setCurrentLanguage(lang);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  }, [i18n]);

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    try {
      console.log('Changing language to:', language);
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setCurrentLanguage(language);
      console.log('Language changed successfully');
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [i18n]);

  const getCurrentLanguageInfo = useCallback((): LanguageInfo => {
    return (
      SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [currentLanguage]);

  const isRTL = useCallback((): boolean => {
    return getCurrentLanguageInfo().rtl;
  }, [getCurrentLanguageInfo]);

  return useMemo(() => ({
    currentLanguage,
    changeLanguage,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES,
    getCurrentLanguageInfo,
    isRTL,
  }), [currentLanguage, changeLanguage, isLoading, getCurrentLanguageInfo, isRTL]);
});
