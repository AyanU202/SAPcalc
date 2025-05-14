import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import ta from './locales/ta';
import te from './locales/te';
import ka from './locales/ka';
import ml from './locales/ml';
import hi from './locales/hi';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta },
      te: { translation: te },
      ka: { translation: ka },
      ml: { translation: ml },
      hi: { translation: hi },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
