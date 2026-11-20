import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import Button from './Button';

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
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
            borderColor: colors.border,
            marginBottom: spacing[4],
          },
        ]}
      >
        <Icon size={28} color={colors.primary} strokeWidth={2} />
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

      {description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.textMutedHex,
              fontSize: typography.scale.body.fontSize,
              lineHeight: typography.scale.body.lineHeight,
              marginBottom: actionLabel ? spacing[6] : 0,
            },
          ]}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
  },
});

export default EmptyState;
