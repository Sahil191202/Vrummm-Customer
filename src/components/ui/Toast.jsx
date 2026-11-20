import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

export function Toast({
  message,
  variant = 'info', // 'info' | 'success' | 'warning' | 'error'
  style,
}) {
  const { colors, typography, radius, spacing } = useTheme();

  if (!message) return null;

  const getVariantConfig = () => {
    switch (variant) {
      case 'success':
        return {
          bg: colors.surfaceRaised,
          border: colors.success,
          color: colors.success,
          Icon: CheckCircle2,
        };
      case 'error':
        return {
          bg: colors.surfaceRaised,
          border: colors.error,
          color: colors.error,
          Icon: AlertCircle,
        };
      case 'warning':
        return {
          bg: colors.surfaceRaised,
          border: colors.warning,
          color: colors.warning,
          Icon: AlertTriangle,
        };
      default:
        return {
          bg: colors.surfaceRaised,
          border: colors.primary,
          color: colors.primary,
          Icon: Info,
        };
    }
  };

  const cfg = getVariantConfig();
  const IconComponent = cfg.Icon;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cfg.bg,
          borderColor: cfg.border,
          borderRadius: radius.md,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
        },
        style,
      ]}
      accessibilityRole="alert"
    >
      <IconComponent size={18} color={cfg.color} strokeWidth={2} style={styles.icon} />
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: typography.scale.bodySmall.fontSize,
            lineHeight: typography.scale.bodySmall.lineHeight,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontWeight: '500',
  },
});

export default Toast;
