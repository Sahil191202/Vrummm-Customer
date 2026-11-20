import { translations, translate } from '../i18n';

describe('i18n Translation System', () => {
  const { en, hi, mr } = translations;

  test('all top-level sections exist in English, Hindi, and Marathi', () => {
    const requiredSections = ['common', 'welcome', 'language', 'theme', 'onboarding', 'auth', 'profile'];
    for (const section of requiredSections) {
      expect(en[section]).toBeDefined();
      expect(hi[section]).toBeDefined();
      expect(mr[section]).toBeDefined();
    }
  });

  test('common action keys are mirrored across languages', () => {
    const commonKeys = ['continue', 'next', 'skip', 'getStarted', 'save', 'cancel', 'retry', 'close', 'done'];
    for (const key of commonKeys) {
      expect(en.common[key]).toBeTruthy();
      expect(hi.common[key]).toBeTruthy();
      expect(mr.common[key]).toBeTruthy();
    }
  });

  test('translate function retrieves correct localized string', () => {
    expect(translate('welcome.title', 'en')).toBe('Vrumm');
    expect(translate('welcome.title', 'hi')).toBe('वरूम');
    expect(translate('welcome.title', 'mr')).toBe('वरूम');
  });

  test('translate falls back to English for unknown keys', () => {
    expect(translate('welcome.title', 'fr')).toBe('Vrumm');
  });

  test('Hindi and Marathi strings are non-empty and well-formed', () => {
    expect(hi.common.demoModeBanner.length).toBeGreaterThan(20);
    expect(mr.common.demoModeBanner.length).toBeGreaterThan(20);
    expect(hi.onboarding.slide1Desc.length).toBeGreaterThan(15);
    expect(mr.onboarding.slide1Desc.length).toBeGreaterThan(15);
  });
});
