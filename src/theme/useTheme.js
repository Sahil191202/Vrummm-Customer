import { useColorScheme } from 'react-native';
import { useUiStore } from '../store/uiStore';
import { getThemeColors, typography, spacing, radius, shadows, palette } from './tokens';

/**
 * Hook to access active theme, colors and responsive styles
 */
export function useTheme() {
  const systemScheme = useColorScheme();
  const themePreference = useUiStore((state) => state.theme);
  const setThemePreference = useUiStore((state) => state.setTheme);

  const effectiveMode =
    themePreference === 'system'
      ? systemScheme === 'light'
        ? 'light'
        : 'dark'
      : themePreference;

  const activeColors = getThemeColors(effectiveMode);

  return {
    mode: effectiveMode,
    themePreference,
    setThemePreference,
    isDark: effectiveMode === 'dark',
    colors: activeColors,
    palette,
    typography,
    spacing,
    radius,
    shadows,
  };
}

export default useTheme;
