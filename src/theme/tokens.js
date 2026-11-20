/**
 * Theme tokens proxying the single source of truth in @vrumm/ui-tokens
 * Never hard-code hex values in screens.
 */

import { tokens as baseTokens, colors as baseColors, typography as baseTypography, spacing as baseSpacing, radius as baseRadius, shadows as baseShadows, contrastRatios as baseContrastRatios, palette as basePalette } from '@vrumm/ui-tokens';

export const palette = basePalette;
export const colors = baseColors;
export const typography = baseTypography;
export const spacing = baseSpacing;
export const radius = baseRadius;
export const shadows = baseShadows;
export const contrastRatios = baseContrastRatios;

export const tokens = baseTokens;

/**
 * Get active color token map for a given theme mode ('dark' or 'light')
 */
export function getThemeColors(mode = 'dark') {
  return mode === 'light' ? colors.light : colors.dark;
}

export default tokens;
