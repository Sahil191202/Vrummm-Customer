import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export function BottomSheet({
  children,
  style,
  handleVisible = true,
  onHandlePress,
}) {
  const { colors, radius, spacing, shadows } = useTheme();

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surfaceCard,
          borderTopLeftRadius: radius['2xl'],
          borderTopRightRadius: radius['2xl'],
          borderColor: colors.border,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          paddingHorizontal: spacing[4],
          paddingBottom: spacing[6],
          paddingTop: spacing[2],
          ...shadows.floating,
        },
        style,
      ]}
    >
      {handleVisible && (
        <Pressable
          onPress={onHandlePress}
          hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
          style={styles.handleContainer}
        >
          <View
            style={[
              styles.handle,
              {
                backgroundColor: colors.border,
                borderRadius: radius.full,
              },
            ]}
          />
        </Pressable>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: '100%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 44,
    height: 4,
  },
});

export default BottomSheet;
