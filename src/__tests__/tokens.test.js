import { palette, colors, typography, spacing, radius, getThemeColors } from '../theme/tokens';

describe('Design Tokens Specification', () => {
  test('palette contains the exact 6 specified hex colors', () => {
    expect(palette.deepest).toBe('#051F20');
    expect(palette.deepGreen).toBe('#0B2B26');
    expect(palette.forest).toBe('#163832');
    expect(palette.hunterGreen).toBe('#235347');
    expect(palette.mintSage).toBe('#8EB69B');
    expect(palette.lightest).toBe('#DAF1DE');
  });

  test('dark theme adheres to the specified mapping', () => {
    const dark = colors.dark;
    expect(dark.background).toBe('#051F20');
    expect(dark.surface).toBe('#0B2B26');
    expect(dark.surfaceRaised).toBe('#163832');
    expect(dark.border).toBe('#235347');
    expect(dark.primary).toBe('#8EB69B');
    expect(dark.primaryForeground).toBe('#051F20');
    expect(dark.text).toBe('#DAF1DE');
  });

  test('light theme adheres to the specified mapping', () => {
    const light = colors.light;
    expect(light.primary).toBe('#235347');
    expect(light.primaryForeground).toBe('#DAF1DE');
    expect(light.text).toBe('#051F20');
    expect(light.textMuted).toBe('#235347');
  });

  test('status colors (error/sos) are clearly red/orange-red, not green', () => {
    expect(colors.dark.error).not.toMatch(/green/i);
    expect(colors.dark.sos).toBe('#FF4D4D');
    expect(colors.light.sos).toBe('#C0392B');
  });

  test('spacing defines 48px minimum tap target', () => {
    expect(spacing[12]).toBe(48);
  });

  test('typography scale covers display, title, heading, body, caption', () => {
    expect(typography.scale.display.fontSize).toBe(32);
    expect(typography.scale.title.fontSize).toBe(24);
    expect(typography.scale.heading.fontSize).toBe(20);
    expect(typography.scale.body.fontSize).toBe(14);
    expect(typography.scale.caption.fontSize).toBe(11);
  });

  test('getThemeColors returns appropriate palette for mode', () => {
    expect(getThemeColors('dark').background).toBe('#051F20');
    expect(getThemeColors('light').primary).toBe('#235347');
  });
});
