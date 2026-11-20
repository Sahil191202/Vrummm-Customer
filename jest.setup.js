/* eslint-env jest */

jest.mock('expo-font', () => ({
  useFonts: () => [true],
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));

jest.mock('@expo-google-fonts/plus-jakarta-sans', () => ({
  useFonts: () => [true],
  PlusJakartaSans_400Regular: 'PlusJakartaSans_400Regular',
  PlusJakartaSans_500Medium: 'PlusJakartaSans_500Medium',
  PlusJakartaSans_600SemiBold: 'PlusJakartaSans_600SemiBold',
  PlusJakartaSans_700Bold: 'PlusJakartaSans_700Bold',
  PlusJakartaSans_800ExtraBold: 'PlusJakartaSans_800ExtraBold',
}));

jest.mock('@expo-google-fonts/noto-sans-devanagari', () => ({
  useFonts: () => [true],
  NotoSansDevanagari_400Regular: 'NotoSansDevanagari_400Regular',
  NotoSansDevanagari_500Medium: 'NotoSansDevanagari_500Medium',
  NotoSansDevanagari_600SemiBold: 'NotoSansDevanagari_600SemiBold',
  NotoSansDevanagari_700Bold: 'NotoSansDevanagari_700Bold',
}));

jest.mock('lucide-react-native', () => {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        const MockIcon = () => null;
        MockIcon.displayName = String(prop);
        return MockIcon;
      },
    },
  );
});

jest.mock('react-native-svg', () => {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        return prop;
      },
    },
  );
});

jest.mock('expo-secure-store', () => {
  const store = new Map();
  return {
    isAvailableAsync: jest.fn().mockResolvedValue(true),
    getItemAsync: jest.fn(async (key) => store.get(key) || null),
    setItemAsync: jest.fn(async (key, value) => {
      store.set(key, String(value));
    }),
    deleteItemAsync: jest.fn(async (key) => {
      store.delete(key);
    }),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: 'SafeAreaProvider',
    SafeAreaConsumer: (props) => (props.children ? props.children(inset) : null),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaView: 'SafeAreaView',
  };
});
