import React, { useRef } from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, View, Animated } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'destructive' | 'neon'
  size = 'default', // 'sm' | 'default' | 'lg'
  icon: Icon,
  disabled = false,
  loading = false,
  fullWidth = true,
  accessibilityLabel,
  testID,
  style,
  textStyle,
}) {
  const { colors, typography, spacing, radius, shadows, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: isDark ? colors.surfaceRaised : colors.surface,
          borderColor: colors.border,
          borderWidth: 1.5,
          textColor: colors.text,
          extraShadow: shadows.sm,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: colors.text,
          extraShadow: null,
        };
      case 'destructive':
        return {
          backgroundColor: colors.error,
          borderColor: colors.error,
          borderWidth: 0,
          textColor: colors.errorForeground,
          extraShadow: shadows.sm,
        };
      case 'neon':
        return {
          backgroundColor: colors.neonMint || '#1FD88A',
          borderColor: '#1FD88A',
          borderWidth: 0,
          textColor: '#051F20',
          extraShadow: shadows.glowMint,
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: isDark ? '#A3C9AE' : '#1B473D',
          borderWidth: 1,
          textColor: colors.primaryForeground,
          extraShadow: isDark ? shadows.glowMint : shadows.sm,
        };
    }
  };

  const vStyles = getVariantStyles();
  const minHeight = size === 'sm' ? 40 : size === 'lg' ? 56 : 48;
  const paddingHorizontal = size === 'sm' ? spacing[3] : size === 'lg' ? spacing[6] : spacing[4];
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 15;

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
    >
      <Pressable
        testID={testID}
        disabled={disabled || loading}
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        style={[
          styles.baseButton,
          {
            backgroundColor: vStyles.backgroundColor,
            borderColor: vStyles.borderColor,
            borderWidth: vStyles.borderWidth,
            minHeight,
            paddingHorizontal,
            borderRadius: radius.lg,
            opacity: disabled || loading ? 0.5 : 1,
            ...(vStyles.extraShadow || {}),
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={vStyles.textColor} />
        ) : (
          <View style={styles.contentRow}>
            {Icon && (
              <View style={styles.iconWrapper}>
                <Icon size={size === 'sm' ? 16 : 19} color={vStyles.textColor} strokeWidth={2.2} />
              </View>
            )}
            <Text
              style={[
                styles.buttonText,
                {
                  color: vStyles.textColor,
                  fontSize,
                  fontWeight: typography.fontWeights.bold,
                  fontFamily: typography.fonts.heading,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  buttonText: {
    letterSpacing: 0.3,
  },
});

export default Button;
