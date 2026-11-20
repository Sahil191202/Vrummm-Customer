import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, ArrowLeft, Languages } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation, SUPPORTED_LANGUAGES } from '../i18n';
import ListItem from '../components/ui/ListItem';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import BackgroundPattern from '../components/ui/BackgroundPattern';

export function LanguageSelectScreen({ navigation }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const { t, language, setLanguage } = useTranslation();

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
            {t('language.title')}
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
            {t('language.subtitle')}
          </Text>
        </View>

        <View style={{ gap: spacing[3] }}>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <ListItem
                key={lang.code}
                title={lang.nativeName}
                subtitle={lang.label}
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
                onPress={() => setLanguage(lang.code)}
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

export default LanguageSelectScreen;
