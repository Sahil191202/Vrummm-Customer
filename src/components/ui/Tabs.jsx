import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export function Tabs({
  tabs = [], // [{ key, label, icon: Icon }]
  activeKey,
  onChange,
  style,
}) {
  const { colors, typography, radius, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing[1],
        },
        style,
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        const Icon = tab.icon;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={[
              styles.tabItem,
              {
                backgroundColor: isActive ? colors.primary : 'transparent',
                borderRadius: radius.md,
                paddingVertical: spacing[2],
                paddingHorizontal: spacing[3],
                minHeight: 40,
              },
            ]}
          >
            {Icon && (
              <Icon
                size={16}
                color={isActive ? colors.primaryForeground : colors.textMutedHex}
                strokeWidth={2}
                style={styles.tabIcon}
              />
            )}
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? colors.primaryForeground : colors.text,
                  fontWeight: isActive ? typography.fontWeights.bold : typography.fontWeights.medium,
                  fontSize: typography.scale.bodySmall.fontSize,
                  fontFamily: typography.fonts.heading,
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    textAlign: 'center',
  },
});

export default Tabs;
