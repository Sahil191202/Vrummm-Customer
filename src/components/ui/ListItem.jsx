import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

export function ListItem({
  title,
  subtitle,
  icon: Icon,
  rightAccessory,
  showChevron = true,
  onPress,
  disabled = false,
  selected = false,
  style,
}) {
  const { colors, typography, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: selected ? colors.surfaceRaised : colors.surfaceCard,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: 1,
          borderRadius: radius.md,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          minHeight: spacing[12], // 48px min touch target
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {Icon && (
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              marginRight: spacing[3],
            },
          ]}
        >
          <Icon size={20} color={colors.primary} strokeWidth={2} />
        </View>
      )}

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: typography.scale.bodyMedium.fontSize,
              fontWeight: typography.fontWeights.semibold,
              fontFamily: typography.fonts.heading,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textMutedHex,
                fontSize: typography.scale.caption.fontSize,
                marginTop: spacing[0] + 2,
              },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {rightAccessory && <View style={styles.accessoryWrapper}>{rightAccessory}</View>}

      {showChevron && onPress && (
        <ChevronRight size={18} color={colors.textMutedHex} strokeWidth={2} style={styles.chevron} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {},
  subtitle: {},
  accessoryWrapper: {
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 6,
  },
});

export default ListItem;
