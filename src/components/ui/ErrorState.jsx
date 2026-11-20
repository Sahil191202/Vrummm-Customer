import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import Button from './Button';

export function ErrorState({
  title = 'Something Went Wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  style,
}) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing[6] }, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.error,
            marginBottom: spacing[4],
          },
        ]}
      >
        <AlertCircle size={32} color={colors.error} strokeWidth={2} />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.scale.heading.fontSize,
            fontWeight: typography.fontWeights.bold,
            marginBottom: spacing[2],
          },
        ]}
      >
        {title}
      </Text>

      {message && (
        <Text
          style={[
            styles.message,
            {
              color: colors.textMutedHex,
              fontSize: typography.scale.body.fontSize,
              lineHeight: typography.scale.body.lineHeight,
              marginBottom: onRetry ? spacing[6] : 0,
            },
          ]}
        >
          {message}
        </Text>
      )}

      {onRetry && (
        <Button
          title={retryLabel}
          onPress={onRetry}
          icon={RotateCcw}
          variant="secondary"
          size="default"
          fullWidth={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 320,
  },
});

export default ErrorState;
