import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navigation, ShieldCheck, Banknote, ArrowRight, Zap, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n';
import { useUiStore } from '../store/uiStore';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import BackgroundPattern from '../components/ui/BackgroundPattern';

export function OnboardingScreen({ navigation }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const { t } = useTranslation();
  const setOnboardingComplete = useUiStore((state) => state.setOnboardingComplete);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      badge: 'FASTEST MUMBAI COMMUTE',
      badgeColor: '#1FD88A',
      title: t('onboarding.slide1Title'),
      desc: t('onboarding.slide1Desc'),
      icon: Navigation,
      feature: '⚡ Average 3-min pickup across 36 Mumbai zones',
    },
    {
      badge: 'ZERO SURGE GUARANTEE',
      badgeColor: '#F5B301',
      title: t('onboarding.slide2Title'),
      desc: t('onboarding.slide2Desc'),
      icon: Banknote,
      feature: '₹ Server-calculated paise rates with no hidden fees',
    },
    {
      badge: 'SAFETY-FIRST TRANSIT',
      badgeColor: '#38BDF8',
      title: t('onboarding.slide3Title'),
      desc: t('onboarding.slide3Desc'),
      icon: ShieldCheck,
      feature: '🛡️ Trip PIN verification & 1-tap demo SOS incident reporting',
    },
  ];

  const handleFinish = () => {
    setOnboardingComplete(true);
    navigation.navigate('Welcome');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const currentSlide = slides[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <BackgroundPattern />

      {/* Top Bar with Logo and Skip */}
      <View style={[styles.topBar, { paddingHorizontal: spacing[5], paddingTop: spacing[3] }]}>
        <Logo size="sm" layout="horizontal" />

        <Pressable
          onPress={handleFinish}
          accessibilityRole="button"
          accessibilityLabel={t('common.skip')}
          style={[
            styles.skipButton,
            {
              backgroundColor: isDark ? 'rgba(22, 56, 50, 0.6)' : 'rgba(218, 241, 222, 0.6)',
              borderColor: colors.border,
              borderRadius: radius.full,
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[1],
            },
          ]}
        >
          <Text style={[styles.skipText, { color: colors.textMutedHex, fontSize: typography.scale.caption.fontSize }]}>
            {t('common.skip')}
          </Text>
        </Pressable>
      </View>

      {/* Slide Visual and Content */}
      <View style={[styles.slideContent, { paddingHorizontal: spacing[6] }]}>
        {/* Illuminated Icon Container */}
        <View
          style={[
            styles.iconOuterGlow,
            {
              backgroundColor: isDark ? 'rgba(31, 216, 138, 0.08)' : 'rgba(35, 83, 71, 0.08)',
              borderColor: isDark ? 'rgba(31, 216, 138, 0.25)' : 'rgba(35, 83, 71, 0.25)',
              borderRadius: radius['3xl'],
              marginBottom: spacing[6],
            },
          ]}
        >
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: isDark ? '#0B2B26' : '#FFFFFF',
                borderColor: currentSlide.badgeColor,
                borderRadius: radius['2xl'],
              },
            ]}
          >
            <IconComponent size={46} color={currentSlide.badgeColor} strokeWidth={2} />
          </View>
        </View>

        {/* Feature Badge */}
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isDark ? 'rgba(22, 56, 50, 0.8)' : '#E8F5EB',
              borderColor: currentSlide.badgeColor,
              borderRadius: radius.full,
              marginBottom: spacing[3],
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: currentSlide.badgeColor,
                fontSize: typography.scale.caption.fontSize,
                fontWeight: typography.fontWeights.bold,
              },
            ]}
          >
            {currentSlide.badge}
          </Text>
        </View>

        {/* Headline */}
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: typography.scale.display.fontSize - 4,
              fontWeight: typography.fontWeights.extrabold,
              fontFamily: typography.fonts.heading,
              marginBottom: spacing[3],
            },
          ]}
        >
          {currentSlide.title}
        </Text>

        {/* Description */}
        <Text
          style={[
            styles.description,
            {
              color: colors.textMutedHex,
              fontSize: typography.scale.body.fontSize + 1,
              lineHeight: 24,
              marginBottom: spacing[4],
            },
          ]}
        >
          {currentSlide.desc}
        </Text>

        {/* Feature Highlight Box */}
        <View
          style={[
            styles.featureBox,
            {
              backgroundColor: isDark ? '#0D2F28' : '#F4FAF5',
              borderColor: colors.border,
              borderRadius: radius.md,
              padding: spacing[3],
            },
          ]}
        >
          <Text style={[styles.featureText, { color: colors.text, fontSize: typography.scale.caption.fontSize + 1 }]}>
            {currentSlide.feature}
          </Text>
        </View>
      </View>

      {/* Bottom Bar: Indicators & Action Button */}
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
        <View style={styles.indicatorsRow}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: idx === currentIndex ? (isDark ? '#1FD88A' : colors.primary) : (isDark ? '#163832' : '#DAF1DE'),
                  borderRadius: radius.full,
                  width: idx === currentIndex ? 28 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? t('common.getStarted') : t('common.next')}
          variant="neon"
          size="lg"
          icon={ArrowRight}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    borderWidth: 1,
  },
  skipText: {
    fontWeight: '600',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
  },
  iconOuterGlow: {
    width: 104,
    height: 104,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 80,
    height: 80,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  badgeText: {
    letterSpacing: 0.6,
  },
  title: {
    lineHeight: 36,
  },
  description: {},
  featureBox: {
    borderWidth: 1,
  },
  featureText: {
    fontWeight: '500',
  },
  bottomBar: {},
  indicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    height: 6,
  },
});

export default OnboardingScreen;
