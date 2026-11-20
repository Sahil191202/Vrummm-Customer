import { colors } from '../theme/tokens';

function srgb(v) {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}

function getContrastRatio(hex1, hex2) {
  const l1 = Math.max(getLuminance(hex1), getLuminance(hex2));
  const l2 = Math.min(getLuminance(hex1), getLuminance(hex2));
  return (l1 + 0.05) / (l2 + 0.05);
}

describe('WCAG Accessibility Contrast Ratios', () => {
  const dark = colors.dark;
  const light = colors.light;

  test('Dark Theme: text on background passes WCAG AAA (>= 7:1)', () => {
    const ratio = getContrastRatio(dark.text, dark.background);
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    expect(ratio).toBeCloseTo(14.4, 0.5);
  });

  test('Dark Theme: text on card surface passes WCAG AAA (>= 7:1)', () => {
    const ratio = getContrastRatio(dark.text, dark.surface);
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    expect(ratio).toBeCloseTo(12.7, 0.5);
  });

  test('Dark Theme: text on raised surface passes WCAG AAA (>= 7:1)', () => {
    const ratio = getContrastRatio(dark.text, dark.surfaceRaised);
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    expect(ratio).toBeCloseTo(10.7, 0.5);
  });

  test('Dark Theme: button text on primary button passes WCAG AAA (>= 7:1)', () => {
    const ratio = getContrastRatio(dark.primaryForeground, dark.primary);
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    expect(ratio).toBeCloseTo(7.6, 0.5);
  });

  test('Dark Theme: error text on background passes WCAG AA (>= 4.5:1)', () => {
    const ratio = getContrastRatio(dark.error, dark.background);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('Light Theme: text on background passes WCAG AAA (>= 7:1)', () => {
    const ratio = getContrastRatio(light.text, light.background);
    expect(ratio).toBeGreaterThanOrEqual(7.0);
  });

  test('Light Theme: muted text on background passes WCAG AAA (>= 7:1)', () => {
    const ratio = getContrastRatio(light.textMuted, light.background);
    expect(ratio).toBeGreaterThanOrEqual(7.0);
  });

  test('Light Theme: primary button text passes WCAG AAA (>= 7:1)', () => {
    const ratio = getContrastRatio(light.primaryForeground, light.primary);
    expect(ratio).toBeGreaterThanOrEqual(7.0);
  });

  test('Light Theme: error text passes WCAG AA (>= 4.5:1)', () => {
    const ratio = getContrastRatio(light.error, light.background);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
