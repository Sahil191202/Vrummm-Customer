import { useUiStore } from '../store/uiStore';
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';

export const translations = {
  en,
  hi,
  mr,
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
];

/**
 * Access nested translation key like "welcome.title" or "common.continue"
 */
export function translate(key, lang = 'en', params = {}) {
  const dict = translations[lang] || translations.en;
  const parts = key.split('.');
  let current = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English
      let fallback = translations.en;
      for (const p of parts) {
        if (fallback && typeof fallback === 'object' && p in fallback) {
          fallback = fallback[p];
        } else {
          return key;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== 'string') {
    return key;
  }

  let text = current;
  for (const [paramKey, val] of Object.entries(params)) {
    text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(val));
  }
  return text;
}

export function useTranslation() {
  const language = useUiStore((state) => state.language);
  const setLanguage = useUiStore((state) => state.setLanguage);

  const t = (key, params) => translate(key, language, params);

  return {
    t,
    language,
    setLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}

export default useTranslation;
