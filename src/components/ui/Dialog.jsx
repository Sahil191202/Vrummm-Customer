import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import Button from './Button';

export function Dialog({
  visible,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  children,
}) {
  const { colors, typography, spacing, radius, shadows } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissOverlay} onPress={onCancel} />
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.border,
              borderRadius: radius.xl,
              padding: spacing[6],
              ...shadows.md,
            },
          ]}
        >
          {title && (
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
          )}

          {description && (
            <Text
              style={[
                styles.description,
                {
                  color: colors.textMutedHex,
                  fontSize: typography.scale.body.fontSize,
                  marginBottom: spacing[5],
                },
              ]}
            >
              {description}
            </Text>
          )}

          {children}

          <View style={[styles.actionsRow, { marginTop: spacing[5], gap: spacing[3] }]}>
            {onCancel && (
              <View style={styles.actionCol}>
                <Button
                  title={cancelLabel}
                  variant="secondary"
                  onPress={onCancel}
                  fullWidth
                />
              </View>
            )}
            {onConfirm && (
              <View style={styles.actionCol}>
                <Button
                  title={confirmLabel}
                  variant={confirmVariant}
                  onPress={onConfirm}
                  fullWidth
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 31, 32, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  title: {},
  description: {
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCol: {
    flex: 1,
  },
});

export default Dialog;
