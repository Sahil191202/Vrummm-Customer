import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export function Card({
  children,
  onPress,
  selected = false,
  elevated = false,
  highlighted = false,
  accessibilityRole,
  accessibilityLabel,
  style,
}) {
  const { colors, radius, spacing, shadows, isDark } = useTheme();

  const getBackgroundColor = () => {
    if (selected) return isDark ? '#143E35' : '#DAF1DE';
    if (elevated) return isDark ? '#0F342D' : '#FFFFFF';
    return isDark ? '#0B2B26' : '#FFFFFF';
  };

  const getBorderColor = () => {
    if (selected) return isDark ? '#1FD88A' : colors.primary;
    if (highlighted) return isDark ? '#327363' : colors.border;
    return colors.border;
  };

  const cardStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: selected ? 1.8 : 1.2,
    borderRadius: radius.xl,
    padding: spacing[4],
    ...(selected && isDark ? shadows.glowMint : shadows.sm),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole={accessibilityRole || 'button'}
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          cardStyle,
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.92 : 1,
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

export default Card;
