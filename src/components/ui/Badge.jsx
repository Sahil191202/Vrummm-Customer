import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Info,
  Zap,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

export function Badge({
  label,
  variant = 'default', // 'default' | 'success' | 'warning' | 'error' | 'sos' | 'neon' | 'amber' | 'cyan'
  icon: CustomIcon,
  pulse = false,
  size = 'default', // 'sm' | 'default'
  style,
}) {
  const { colors, typography, radius, spacing, isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, pulseAnim]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return {
          bg: isDark ? 'rgba(31, 216, 138, 0.16)' : '#E8F5EB',
          border: '#1FD88A',
          text: isDark ? '#1FD88A' : '#0E7A4F',
          DefaultIcon: Zap,
        };
      case 'amber':
        return {
          bg: isDark ? 'rgba(245, 179, 1, 0.16)' : '#FEF3C7',
          border: '#F5B301',
          text: isDark ? '#F5B301' : '#B45309',
          DefaultIcon: Sparkles,
        };
      case 'cyan':
        return {
          bg: isDark ? 'rgba(56, 189, 248, 0.16)' : '#E0F2FE',
          border: '#38BDF8',
          text: isDark ? '#38BDF8' : '#0284C7',
          DefaultIcon: Info,
        };
      case 'success':
        return {
          bg: isDark ? 'rgba(82, 183, 136, 0.16)' : '#EBF7EE',
          border: colors.success,
          text: colors.success,
          DefaultIcon: CheckCircle2,
        };
      case 'warning':
        return {
          bg: isDark ? 'rgba(255, 183, 3, 0.16)' : '#FEF3C7',
          border: colors.warning,
          text: colors.warning,
          DefaultIcon: AlertTriangle,
        };
      case 'error':
        return {
          bg: isDark ? 'rgba(255, 77, 77, 0.16)' : '#FEE2E2',
          border: colors.error,
          text: colors.error,
          DefaultIcon: AlertCircle,
        };
      case 'sos':
        return {
          bg: isDark ? 'rgba(255, 77, 77, 0.22)' : '#FEE2E2',
          border: colors.sos,
          text: colors.sos,
          DefaultIcon: ShieldAlert,
        };
      default:
        return {
          bg: isDark ? colors.surfaceRaised : colors.surface,
          border: colors.border,
          text: colors.text,
          DefaultIcon: Info,
        };
    }
  };

  const v = getVariantStyles();
  const IconComponent = CustomIcon || v.DefaultIcon;
  const iconSize = size === 'sm' ? 12 : 14;
  const fontSize = size === 'sm' ? 11 : 12;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderRadius: radius.full,
          paddingVertical: size === 'sm' ? 3 : 5,
          paddingHorizontal: size === 'sm' ? spacing[2] : spacing[3],
        },
        style,
      ]}
    >
      {pulse ? (
        <Animated.View
          style={[
            styles.pulseDot,
            { backgroundColor: v.text, opacity: pulseAnim },
          ]}
        />
      ) : (
        <IconComponent size={iconSize} color={v.text} strokeWidth={2.2} style={styles.icon} />
      )}
      <Text
        style={[
          styles.text,
          {
            color: v.text,
            fontSize,
            fontWeight: typography.fontWeights.bold,
            fontFamily: typography.fonts.heading,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  icon: {
    marginRight: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    letterSpacing: 0.4,
  },
});

export default Badge;
