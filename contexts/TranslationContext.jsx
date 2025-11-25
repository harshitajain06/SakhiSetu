import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import enTranslations from './translations/en';
import hiTranslations from './translations/hi';

const TranslationContext = createContext();

const STORAGE_KEY = '@app_language';
const DEFAULT_LANGUAGE = 'en';

const translations = {
  en: enTranslations,
  hi: hiTranslations,
};

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
];

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (langCode) => {
    if (translations[langCode]) {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, langCode);
        setLanguage(langCode);
      } catch (error) {
        console.error('Error saving language:', error);
      }
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language] || translations[DEFAULT_LANGUAGE];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations[DEFAULT_LANGUAGE];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Simple parameter replacement
    let result = value;
    Object.keys(params).forEach((param) => {
      result = result.replace(`{{${param}}}`, params[param]);
    });

    return result;
  };

  return (
    <TranslationContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        isLoading,
        languages,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

