import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, LogIn, ArrowLeft, Zap, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import Logo from '../components/ui/Logo';
import BackgroundPattern from '../components/ui/BackgroundPattern';

export function LoginScreen({ navigation }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const { t } = useTranslation();
  const { login, isLoading, error: authError, clearError } = useAuthStore();

  const [email, setEmail] = useState('customer@vrumm.local');
  const [password, setPassword] = useState('password123');
  const [validationError, setValidationError] = useState('');
  const [quickFillActive, setQuickFillActive] = useState(false);

  const handleQuickFill = () => {
    setEmail('customer@vrumm.local');
    setPassword('password123');
    setValidationError('');
    clearError();
    setQuickFillActive(true);
    setTimeout(() => setQuickFillActive(false), 1500);
  };

  const handleLogin = async () => {
    clearError();
    setValidationError('');

    if (!email || !email.includes('@')) {
      setValidationError(t('auth.errors.invalidEmail'));
      return;
    }
    if (!password || password.length < 8) {
      setValidationError(t('auth.errors.passwordTooShort'));
      return;
    }

    await login({ email: email.trim(), password });
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
          {/* Header Section */}
          <View style={{ marginTop: spacing[2], marginBottom: spacing[4] }}>
            <View style={[styles.cityBadge, { backgroundColor: isDark ? 'rgba(31, 216, 138, 0.12)' : 'rgba(35, 83, 71, 0.12)', borderColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.full }]}>
              <Text style={[styles.cityBadgeText, { color: isDark ? '#1FD88A' : colors.primary, fontSize: typography.scale.caption.fontSize }]}>
                MUMBAI RIDER ACCOUNT
              </Text>
            </View>
            <Text style={[styles.title, { color: colors.text, fontSize: typography.scale.display.fontSize - 4, fontFamily: typography.fonts.heading, marginTop: spacing[2] }]}>
              {t('auth.loginTitle')}
            </Text>
            <Text style={{ color: colors.textMutedHex, fontSize: typography.scale.body.fontSize, marginTop: 4, lineHeight: 22 }}>
              {t('auth.loginSubtitle')}
            </Text>
          </View>

          {/* Quick-Fill 1-Tap Demo Card */}
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
                  {t('auth.quickDemoFill')}
                </Text>
                {quickFillActive && <Text style={{ marginLeft: 6, fontSize: 11, color: isDark ? '#1FD88A' : colors.primary, fontWeight: '700' }}>✓ Loaded!</Text>}
              </View>
              <Text style={{ color: colors.textMutedHex, fontSize: typography.scale.caption.fontSize, marginTop: 2 }}>
                customer@vrumm.local • 1-tap test credentials
              </Text>
            </View>
          </Pressable>

          {authError && <Toast message={authError} variant="error" style={{ marginBottom: spacing[4] }} />}

          {/* Input Fields */}
          <Input
            label={t('auth.emailLabel')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChangeText={(text) => { setEmail(text); if (validationError) setValidationError(''); }}
            icon={Mail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={validationError && !email.includes('@') ? validationError : undefined}
          />

          <Input
            label={t('auth.passwordLabel')}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChangeText={(text) => { setPassword(text); if (validationError) setValidationError(''); }}
            icon={Lock}
            secureTextEntry
            error={validationError && password.length < 8 ? validationError : undefined}
          />

          {/* Primary Action Button */}
          <View style={{ marginTop: spacing[3] }}>
            <Button
              title={t('auth.loginAction')}
              variant="neon"
              size="lg"
              icon={LogIn}
              loading={isLoading}
              onPress={handleLogin}
            />

            <View style={[styles.securityBadge, { marginTop: spacing[4] }]}>
              <ShieldCheck size={14} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2.2} />
              <Text style={{ color: colors.textMutedHex, fontSize: typography.scale.caption.fontSize, marginLeft: 6 }}>
                256-bit Encrypted Mumbai Transit Session
              </Text>
            </View>

            {/* Switch to Register */}
            <View style={[styles.footerRow, { marginTop: spacing[5] }]}>
              <Text style={{ color: colors.textMutedHex, fontSize: typography.scale.body.fontSize }}>
                {t('auth.noAccount')}{' '}
              </Text>
              <Button
                title={t('welcome.signUpButton')}
                variant="ghost"
                size="sm"
                fullWidth={false}
                onPress={() => { clearError(); navigation.navigate('Register'); }}
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
  securityBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

export default LoginScreen;
