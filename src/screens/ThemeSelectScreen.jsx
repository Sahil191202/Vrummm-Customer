import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Moon, Sun, Smartphone, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n';
import ListItem from '../components/ui/ListItem';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import BackgroundPattern from '../components/ui/BackgroundPattern';

export function ThemeSelectScreen({ navigation }) {
  const { colors, typography, spacing, radius, themePreference, setThemePreference, isDark } = useTheme();
  const { t } = useTranslation();

  const themes = [
    {
      key: 'dark',
      title: t('theme.dark'),
      subtitle: t('theme.darkDescription'),
      icon: Moon,
    },
    {
      key: 'light',
      title: t('theme.light'),
      subtitle: t('theme.lightDescription'),
      icon: Sun,
    },
    {
      key: 'system',
      title: t('theme.system'),
      subtitle: t('theme.systemDescription'),
      icon: Smartphone,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <BackgroundPattern />

      {/* Nav Bar */}
      <View style={[styles.navBar, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={[
            styles.backButton,
            {
              backgroundColor: isDark ? colors.surfaceRaised : colors.surface,
              borderColor: colors.border,
              borderRadius: radius.full,
            },
          ]}
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2.2} />
        </Pressable>

        <Logo size="sm" layout="horizontal" />

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: spacing[5], paddingBottom: spacing[6] }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { marginTop: spacing[2], marginBottom: spacing[5] }]}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: typography.scale.display.fontSize - 6,
                fontWeight: typography.fontWeights.extrabold,
                fontFamily: typography.fonts.heading,
                marginBottom: spacing[2],
              },
            ]}
          >
            {t('theme.title')}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textMutedHex,
                fontSize: typography.scale.body.fontSize,
                lineHeight: 22,
              },
            ]}
          >
            {t('theme.subtitle')}
          </Text>
        </View>

        <View style={{ gap: spacing[3] }}>
          {themes.map((item) => {
            const isSelected = item.key === themePreference;
            return (
              <ListItem
                key={item.key}
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                selected={isSelected}
                showChevron={false}
                rightAccessory={
                  isSelected ? (
                    <View
                      style={[
                        styles.checkCircle,
                        {
                          backgroundColor: isDark ? '#1FD88A' : colors.primary,
                          borderRadius: radius.full,
                        },
                      ]}
                    >
                      <Check size={14} color="#051F20" strokeWidth={3} />
                    </View>
                  ) : null
                }
                onPress={() => setThemePreference(item.key)}
              />
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[4],
          },
        ]}
      >
        <Button
          title={t('common.done')}
          variant="neon"
          size="lg"
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {},
  title: {
    letterSpacing: -0.5,
  },
  subtitle: {},
  checkCircle: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {},
});

export default ThemeSelectScreen;
