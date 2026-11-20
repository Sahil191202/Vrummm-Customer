import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, Globe, Moon, ShieldCheck, LogOut, Star, Compass, Leaf, Home, Briefcase } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ListItem from '../components/ui/ListItem';
import Dialog from '../components/ui/Dialog';
import Toast from '../components/ui/Toast';
import Logo from '../components/ui/Logo';
import BackgroundPattern from '../components/ui/BackgroundPattern';

export function ProfileScreen({ navigation }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const { t, language } = useTranslation();
  const { user, logout } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const initial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A';
  const displayName = user?.displayName || 'Aarav Mehta';
  const email = user?.email || 'customer@vrumm.local';
  const phone = user?.phone || '+91 98765 43210';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <BackgroundPattern />

      {/* Top Header */}
      <View style={[styles.navBar, { paddingHorizontal: spacing[5], paddingVertical: spacing[3] }]}>
        <Logo size="sm" layout="horizontal" />
        <View style={[styles.statusPill, { backgroundColor: isDark ? 'rgba(31, 216, 138, 0.15)' : 'rgba(35, 83, 71, 0.15)', borderColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.full }]}>
          <View style={[styles.liveDot, { backgroundColor: isDark ? '#1FD88A' : colors.primary }]} />
          <Text style={[styles.statusText, { color: isDark ? '#1FD88A' : colors.primary }]}>ACTIVE RIDER</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: spacing[5], paddingBottom: spacing[8] }]} showsVerticalScrollIndicator={false}>
        <Toast message={t('common.demoModeBanner')} variant="warning" style={{ marginBottom: spacing[4] }} />

        {/* Hero Rider Card */}
        <Card style={{ marginBottom: spacing[4] }}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatarRing, { borderColor: isDark ? '#1FD88A' : colors.primary, backgroundColor: isDark ? 'rgba(31, 216, 138, 0.12)' : 'rgba(35, 83, 71, 0.10)', borderRadius: radius.full }]}>
              <View style={[styles.avatarInner, { backgroundColor: isDark ? '#163832' : colors.primary, borderRadius: radius.full }]}>
                <Text style={[styles.avatarInitial, { color: isDark ? '#1FD88A' : '#DAF1DE' }]}>{initial}</Text>
              </View>
            </View>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={[styles.displayName, { color: colors.text, fontSize: typography.scale.heading.fontSize }]} numberOfLines={1}>{displayName}</Text>
              <Text style={[styles.email, { color: colors.textMutedHex, fontSize: typography.scale.bodySmall.fontSize }]} numberOfLines={1}>{email}</Text>
              <View style={{ marginTop: 6, flexDirection: 'row' }}>
                <Badge label="★ MUMBAI COMMUTER ELITE" variant="amber" size="sm" />
              </View>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={[styles.statsGrid, { backgroundColor: isDark ? '#0D2F28' : '#F4FAF5', borderColor: colors.border, borderRadius: radius.md, marginTop: spacing[4], paddingVertical: spacing[3] }]}>
            <View style={styles.statCol}>
              <View style={styles.statIconRow}>
                <Star size={14} color="#F5B301" fill="#F5B301" />
                <Text style={[styles.statValue, { color: colors.text, marginLeft: 4 }]}>4.92</Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textMutedHex }]}>Rating</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCol}>
              <View style={styles.statIconRow}>
                <Compass size={14} color={isDark ? '#1FD88A' : colors.primary} />
                <Text style={[styles.statValue, { color: colors.text, marginLeft: 4 }]}>48</Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textMutedHex }]}>Trips</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCol}>
              <View style={styles.statIconRow}>
                <Leaf size={14} color="#38BDF8" />
                <Text style={[styles.statValue, { color: colors.text, marginLeft: 4 }]}>182 kg</Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textMutedHex }]}>CO₂ Saved</Text>
            </View>
          </View>
        </Card>

        {/* Favorite Places */}
        <Text style={[styles.sectionHeading, { color: isDark ? '#1FD88A' : colors.primary, fontSize: typography.scale.caption.fontSize, marginBottom: spacing[2] }]}>FAVORITE PLACES</Text>
        <Card style={{ marginBottom: spacing[4], padding: spacing[2] }}>
          <ListItem title="Home" subtitle="Hill Road, Bandra West, Mumbai" icon={Home} showChevron={false} />
          <ListItem title="Office" subtitle="Maker Chambers, Nariman Point, Mumbai" icon={Briefcase} showChevron={false} />
        </Card>

        {/* Account Details */}
        <Text style={[styles.sectionHeading, { color: isDark ? '#1FD88A' : colors.primary, fontSize: typography.scale.caption.fontSize, marginBottom: spacing[2] }]}>{t('profile.accountDetails')}</Text>
        <Card style={{ marginBottom: spacing[4], padding: spacing[2] }}>
          <ListItem title={phone} subtitle={t('auth.phoneLabel')} icon={Phone} showChevron={false} />
          <ListItem title={email} subtitle={t('auth.emailLabel')} icon={Mail} showChevron={false} />
        </Card>

        {/* Preferences */}
        <Text style={[styles.sectionHeading, { color: isDark ? '#1FD88A' : colors.primary, fontSize: typography.scale.caption.fontSize, marginBottom: spacing[2] }]}>{t('profile.preferences')}</Text>
        <Card style={{ marginBottom: spacing[4], padding: spacing[2] }}>
          <ListItem title={t('language.title')} subtitle={language === 'hi' ? 'हिन्दी' : language === 'mr' ? 'मराठी' : 'English'} icon={Globe} onPress={() => navigation.navigate('LanguageSelect')} />
          <ListItem title={t('theme.title')} subtitle={isDark ? 'Dark Theme (Night Optimized)' : 'Light Theme (High Contrast)'} icon={Moon} onPress={() => navigation.navigate('ThemeSelect')} />
        </Card>

        {/* Security & SOS */}
        <Text style={[styles.sectionHeading, { color: isDark ? '#1FD88A' : colors.primary, fontSize: typography.scale.caption.fontSize, marginBottom: spacing[2] }]}>SAFETY & PRIVACY</Text>
        <Card style={{ marginBottom: spacing[6] }}>
          <View style={styles.securityRow}>
            <ShieldCheck size={22} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2.2} />
            <View style={{ flex: 1, marginLeft: spacing[3] }}>
              <Text style={[styles.securityTitle, { color: colors.text }]}>Encrypted Session Storage</Text>
              <Text style={[styles.securityDesc, { color: colors.textMutedHex }]}>{t('profile.tokenStorageSecure')}</Text>
            </View>
          </View>
        </Card>

        {/* Logout Button */}
        <Button title={t('profile.logout')} variant="destructive" icon={LogOut} size="lg" onPress={() => setShowLogoutDialog(true)} />
      </ScrollView>

      <Dialog
        visible={showLogoutDialog}
        title={t('profile.logoutConfirmTitle')}
        description={t('profile.logoutConfirmMessage')}
        confirmLabel={t('profile.logout')}
        confirmVariant="destructive"
        onConfirm={async () => {
          setShowLogoutDialog(false);
          await logout();
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  liveDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontWeight: '700', letterSpacing: 0.5, fontSize: 11 },
  content: { flexGrow: 1 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatarRing: { width: 66, height: 66, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  avatarInner: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 24, fontWeight: '800' },
  displayName: { fontWeight: '800' },
  email: { marginTop: 2 },
  statsGrid: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  statCol: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statIconRow: { flexDirection: 'row', alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '800' },
  statLabel: { fontSize: 10, marginTop: 2, fontWeight: '500' },
  statDivider: { width: 1, height: 28 },
  sectionHeading: { textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700' },
  securityRow: { flexDirection: 'row', alignItems: 'center' },
  securityTitle: { fontSize: 14, fontWeight: '700' },
  securityDesc: { fontSize: 12, marginTop: 2 },
});

export default ProfileScreen;
