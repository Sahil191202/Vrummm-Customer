import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Phone, UserPlus, ArrowLeft, Zap } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import Logo from '../components/ui/Logo';
import BackgroundPattern from '../components/ui/BackgroundPattern';

export function RegisterScreen({ navigation }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const { t } = useTranslation();
  const { register, isLoading, error: authError, clearError } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [quickFillActive, setQuickFillActive] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 10) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  const handleQuickFill = () => {
    setDisplayName('Rohan Sharma');
    setPhone('9876543210');
    setEmail('rohan.sharma@vrumm.local');
    setPassword('MumbaiRide@2026');
    setValidationError('');
    clearError();
    setQuickFillActive(true);
    setTimeout(() => setQuickFillActive(false), 1500);
  };

  const handleRegister = async () => {
    clearError();
    setValidationError('');

    if (!displayName.trim() || displayName.trim().length < 2) {
      setValidationError(t('auth.errors.nameRequired'));
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    const formattedPhone = phone.startsWith('+') ? phone : `+91${cleanDigits}`;
    if (!cleanDigits || cleanDigits.length < 10) {
      setValidationError(t('auth.errors.phoneInvalid'));
      return;
    }
    if (!email || !email.includes('@')) {
      setValidationError(t('auth.errors.invalidEmail'));
      return;
    }
    if (!password || password.length < 8) {
      setValidationError(t('auth.errors.passwordTooShort'));
      return;
    }

    await register({
      email: email.trim(),
      password,
      displayName: displayName.trim(),
      phone: formattedPhone.trim(),
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <BackgroundPattern />

      {/* Top Header */}
      <View style={[styles.navBar, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
        <Pressable
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Welcome')}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={[styles.backButton, { backgroundColor: isDark ? colors.surfaceRaised : colors.surface, borderColor: colors.border, borderRadius: radius.full }]}
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2.2} />
        </Pressable>
        <Logo size="sm" layout="horizontal" />
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexOne}>
        <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: spacing[5], paddingBottom: spacing[6] }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={{ marginTop: spacing[2], marginBottom: spacing[3] }}>
            <View style={[styles.cityBadge, { backgroundColor: isDark ? 'rgba(31, 216, 138, 0.12)' : 'rgba(35, 83, 71, 0.12)', borderColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.full }]}>
              <Text style={[styles.cityBadgeText, { color: isDark ? '#1FD88A' : colors.primary, fontSize: typography.scale.caption.fontSize }]}>
                JOIN MUMBAI RIDER NETWORK
              </Text>
            </View>
            <Text style={[styles.title, { color: colors.text, fontSize: typography.scale.display.fontSize - 4, fontFamily: typography.fonts.heading, marginTop: spacing[2] }]}>
              {t('auth.registerTitle')}
            </Text>
            <Text style={{ color: colors.textMutedHex, fontSize: typography.scale.body.fontSize, marginTop: 4, lineHeight: 22 }}>
              {t('auth.registerSubtitle')}
            </Text>
          </View>

          {/* Quick Demo Fill Pill */}
          <Pressable
            onPress={handleQuickFill}
            accessibilityRole="button"
            accessibilityLabel={t('auth.quickDemoFill')}
            style={[styles.quickFillCard, { backgroundColor: isDark ? '#0F312B' : '#EBF7EE', borderColor: quickFillActive ? (isDark ? '#1FD88A' : colors.primary) : colors.border, borderRadius: radius.lg, padding: spacing[3], marginBottom: spacing[4] }]}
          >
            <View style={[styles.quickFillIcon, { backgroundColor: isDark ? '#163832' : '#DAF1DE', borderRadius: radius.md }]}>
              <Zap size={18} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing[3] }}>
              <View style={styles.rowCenter}>
                <Text style={{ color: colors.text, fontSize: typography.scale.bodySmall.fontSize, fontWeight: '700' }}>
                  ⚡ Auto-Fill Demo Rider Profile
                </Text>
                {quickFillActive && <Text style={{ marginLeft: 6, fontSize: 11, color: isDark ? '#1FD88A' : colors.primary, fontWeight: '700' }}>✓ Filled</Text>}
              </View>
              <Text style={{ color: colors.textMutedHex, fontSize: typography.scale.caption.fontSize, marginTop: 2 }}>
                Rohan Sharma • +91 9876543210
              </Text>
            </View>
          </Pressable>

          {authError && <Toast message={authError} variant="error" style={{ marginBottom: spacing[4] }} />}

          <Input
            label={t('auth.displayNameLabel')}
            placeholder={t('auth.displayNamePlaceholder')}
            value={displayName}
            onChangeText={(text) => { setDisplayName(text); if (validationError) setValidationError(''); }}
            icon={User}
            autoCapitalize="words"
          />

          <Input
            label={t('auth.phoneLabel')}
            placeholder={t('auth.phonePlaceholder')}
            value={phone}
            onChangeText={(text) => { setPhone(text); if (validationError) setValidationError(''); }}
            icon={Phone}
            prefix="🇮🇳 +91"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Input
            label={t('auth.emailLabel')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChangeText={(text) => { setEmail(text); if (validationError) setValidationError(''); }}
            icon={Mail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label={t('auth.passwordLabel')}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChangeText={(text) => { setPassword(text); if (validationError) setValidationError(''); }}
            icon={Lock}
            secureTextEntry
          />

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <View style={{ marginBottom: spacing[3], marginTop: -4 }}>
              <View style={styles.strengthBarRow}>
                <View style={[styles.strengthSegment, { backgroundColor: strength >= 1 ? '#FF5A52' : isDark ? '#163832' : '#DAF1DE', borderRadius: radius.full }]} />
                <View style={[styles.strengthSegment, { backgroundColor: strength >= 2 ? '#F5B301' : isDark ? '#163832' : '#DAF1DE', borderRadius: radius.full }]} />
                <View style={[styles.strengthSegment, { backgroundColor: strength >= 3 ? '#1FD88A' : isDark ? '#163832' : '#DAF1DE', borderRadius: radius.full }]} />
              </View>
              <Text style={{ color: strength >= 3 ? '#1FD88A' : strength >= 2 ? '#F5B301' : '#FF5A52', fontSize: typography.scale.caption.fontSize, fontWeight: '600' }}>
                {strength === 3 ? 'Strong Password' : strength === 2 ? 'Medium Security' : 'Too Short / Weak'}
              </Text>
            </View>
          )}

          {validationError ? (
            <Text style={{ color: colors.error, fontSize: typography.scale.caption.fontSize, marginBottom: spacing[3], fontWeight: '600' }}>
              {validationError}
            </Text>
          ) : null}

          {/* Action */}
          <View style={{ marginTop: spacing[2] }}>
            <Button
              testID="register-submit-button"
              title={t('auth.registerAction')}
              variant="neon"
              size="lg"
              icon={UserPlus}
              loading={isLoading}
              onPress={handleRegister}
            />

            <View style={[styles.footerRow, { marginTop: spacing[5] }]}>
              <Text style={{ color: colors.textMutedHex, fontSize: typography.scale.body.fontSize }}>
                {t('auth.hasAccount')}{' '}
              </Text>
              <Button
                title={t('welcome.signInButton')}
                variant="ghost"
                size="sm"
                fullWidth={false}
                onPress={() => { clearError(); navigation.navigate('Login'); }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flexOne: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  content: { flexGrow: 1 },
  cityBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  cityBadgeText: { fontWeight: '700', letterSpacing: 0.5 },
  title: { fontWeight: '800', letterSpacing: -0.5 },
  quickFillCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5 },
  quickFillIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  strengthBarRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  strengthSegment: { flex: 1, height: 4 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

export default RegisterScreen;
