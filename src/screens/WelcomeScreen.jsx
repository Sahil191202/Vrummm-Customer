import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Bike, Car, Compass, Zap, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation, SUPPORTED_LANGUAGES } from '../i18n';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import BackgroundPattern from '../components/ui/BackgroundPattern';

const VEHICLES = [
  { id: 'bike', name: 'Vrumm Bike', eta: '2 min', price: '₹25', desc: 'Beat Mumbai peak-hour traffic', badge: 'FASTEST', badgeVariant: 'neon', icon: Bike },
  { id: 'auto', name: 'Vrumm Auto', eta: '3 min', price: '₹39', desc: 'Fair meter fares, zero haggling', badge: 'POPULAR', badgeVariant: 'amber', icon: Compass },
  { id: 'cab', name: 'Vrumm Cab', eta: '5 min', price: '₹79', desc: 'AC comfort across the city', badge: 'COMFORT', badgeVariant: 'cyan', icon: Car },
];

export function WelcomeScreen({ navigation }) {
  const { colors, typography, spacing, isDark } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <BackgroundPattern>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing[5] }]}
          showsVerticalScrollIndicator={false}
        >
          <Toast message={t('common.demoModeBanner')} variant="warning" style={styles.demoNotice} />

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Hero Header */}
            <View style={styles.heroSection}>
              <Logo size="lg" layout="vertical" animated={true} />
              <Text style={[styles.tagline, { color: colors.textMutedHex, fontSize: typography.scale.body.fontSize, marginTop: spacing[3] }]}>
                {t('welcome.subtitle')}
              </Text>

              {/* Language Pills + Theme Icon */}
              <View style={[styles.langBar, { marginTop: spacing[4], gap: spacing[2] }]}>
                {SUPPORTED_LANGUAGES.map((item) => {
                  const active = item.code === language;
                  return (
                    <Pressable
                      key={item.code}
                      onPress={() => setLanguage(item.code)}
                      style={[
                        styles.langPill,
                        {
                          backgroundColor: active ? (isDark ? '#1FD88A' : colors.primary) : (isDark ? '#0D2F28' : '#FFFFFF'),
                          borderColor: active ? '#1FD88A' : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.langText, { color: active ? '#051F20' : colors.text, fontWeight: active ? '700' : '500' }]}>
                        {item.nativeName}
                      </Text>
                    </Pressable>
                  );
                })}

                <Pressable
                  onPress={() => navigation.navigate('ThemeSelect')}
                  style={[styles.themePill, { backgroundColor: isDark ? '#0D2F28' : '#FFFFFF', borderColor: colors.border }]}
                  accessibilityLabel="Change Theme"
                >
                  <Moon size={15} color={colors.primary} />
                </Pressable>
              </View>
            </View>

            {/* Live Fleet Preview */}
            <View style={{ marginTop: spacing[5] }}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.scale.subheading.fontSize }]}>
                  CHOOSE YOUR MUMBAI RIDE
                </Text>
                <Badge label="LIVE DISPATCH" variant="neon" size="sm" pulse={true} />
              </View>

              <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
                {VEHICLES.map((v) => {
                  const VehicleIcon = v.icon;
                  return (
                    <Card key={v.id} elevated style={styles.vehicleCard} onPress={() => navigation.navigate('Onboarding')}>
                      <View style={styles.vehicleRow}>
                        <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#163832' : '#E8F5EB', borderColor: colors.border }]}>
                          <VehicleIcon size={24} color={colors.primary} strokeWidth={2.2} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <View style={styles.cardHeaderRow}>
                            <Text style={[styles.vehicleName, { color: colors.text, fontSize: typography.scale.bodyMedium.fontSize }]}>{v.name}</Text>
                            <Badge label={v.badge} variant={v.badgeVariant} size="sm" />
                          </View>
                          <Text style={[styles.vehicleDesc, { color: colors.textMutedHex, fontSize: typography.scale.caption.fontSize }]}>{v.desc}</Text>
                        </View>
                        <View style={styles.priceCol}>
                          <Text style={[styles.price, { color: isDark ? '#1FD88A' : colors.primary }]}>{v.price}</Text>
                          <Text style={[styles.eta, { color: colors.textMutedHex }]}>{v.eta} away</Text>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            </View>

            {/* Safety Guarantee Highlight Card */}
            <Card style={[styles.safetyCard, { marginTop: spacing[4], marginBottom: spacing[6], backgroundColor: isDark ? '#0D2F28' : '#EBF7EE', borderColor: isDark ? '#235347' : '#A3C9B0' }]}>
              <View style={styles.safetyRow}>
                <ShieldCheck size={22} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[styles.safetyTitle, { color: colors.text }]}>Verified Captains & Trip PIN Security</Text>
                  <Text style={[styles.safetySub, { color: colors.textMutedHex }]}>Every ride requires a customer PIN check and live simulated tracking.</Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>

        {/* Thumb-zone CTAs */}
        <View style={[styles.bottomBar, { backgroundColor: isDark ? '#061D1A' : '#FFFFFF', borderTopColor: colors.border, padding: spacing[4], gap: spacing[2] }]}>
          <Button title={t('welcome.signUpButton')} variant="neon" size="lg" icon={Zap} onPress={() => navigation.navigate('Register')} />
          <Button title={t('welcome.signInButton')} variant="secondary" size="default" onPress={() => navigation.navigate('Login')} />
        </View>
      </SafeAreaView>
    </BackgroundPattern>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: 8 },
  demoNotice: { marginBottom: 8 },
  heroSection: { alignItems: 'center', paddingVertical: 12 },
  tagline: { maxWidth: 290, lineHeight: 20, textAlign: 'center' },
  langBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  langPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.2 },
  langText: { fontSize: 12 },
  themePill: { padding: 7, borderRadius: 20, borderWidth: 1.2, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '700', letterSpacing: 0.5 },
  vehicleCard: { padding: 12 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vehicleName: { fontWeight: '700' },
  vehicleDesc: { marginTop: 2 },
  priceCol: { alignItems: 'flex-end', marginLeft: 8 },
  price: { fontSize: 16, fontWeight: '800' },
  eta: { fontSize: 10 },
  safetyCard: { padding: 12 },
  safetyRow: { flexDirection: 'row', alignItems: 'center' },
  safetyTitle: { fontSize: 13, fontWeight: '700' },
  safetySub: { fontSize: 11, marginTop: 2, lineHeight: 16 },
  bottomBar: { borderTopWidth: 1 },
});

export default WelcomeScreen;
