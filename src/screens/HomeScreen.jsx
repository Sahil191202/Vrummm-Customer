import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, ArrowRight, User, Zap, X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n';
import { useBookingStore } from '../store/bookingStore';
import { MapView } from '../components/map/MapView';
import VehicleSelector from '../components/booking/VehicleSelector';
import ScheduleTimePicker from '../components/booking/ScheduleTimePicker';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import { formatPaise, formatToIST } from '../utils/formatters';
import { MUMBAI_LOCATIONS, mapService } from '../services/mapService';
import { locationService } from '../services/locationService';

export function HomeScreen({ navigation }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const { t } = useTranslation();
  const {
    pickup, drop, vehicleType, mode, scheduledFor, quotes, isLoadingQuotes,
    isCreatingBooking, bookingError, currentBooking,
    setPickup, setDrop, setVehicleType, setMode, setScheduledFor, fetchQuotes, createBooking, resetBooking,
  } = useBookingStore();

  const [isSheetMinimized, setIsSheetMinimized] = useState(false);
  const [mapSelectTarget, setMapSelectTarget] = useState(null); // 'pickup' | 'drop' | null
  const [routeMeta, setRouteMeta] = useState(null); // { distanceMeters, durationSeconds }

  useEffect(() => {
    locationService.getCurrentLocation().then((loc) => { if (loc) setPickup(loc); });
  }, []);

  useEffect(() => {
    if (pickup && drop) fetchQuotes();
    else setRouteMeta(null);
  }, [pickup, drop]);

  const handleRecenter = async () => {
    const loc = await locationService.getCurrentLocation();
    if (loc) setPickup(loc);
    fetchQuotes();
  };

  const handleMapPress = async ({ latitude, longitude }) => {
    const place = await mapService.reverseGeocode([longitude, latitude]);
    if (mapSelectTarget === 'pickup') {
      setPickup(place);
    } else {
      setDrop(place);
      setIsSheetMinimized(false);
    }
    setMapSelectTarget(null);
  };

  const activeQuote = quotes ? quotes[vehicleType] : null;
  const isScheduled = mode === 'SCHEDULED';

  const getButtonTitle = () => {
    if (isScheduled) {
      return activeQuote ? `Schedule ${vehicleType} (${formatPaise(activeQuote.totalPaise)})` : t('booking.confirmSchedule');
    }
    return activeQuote ? `Book Instant ${vehicleType} • ${formatPaise(activeQuote.totalPaise)}` : t('booking.bookInstant');
  };

  return (
    <View style={styles.container}>
      {/* Real Interactive Map with Real Road Navigation Polyline */}
      <MapView
        pickupCoordinates={pickup?.coordinates}
        dropCoordinates={drop?.coordinates}
        onCenterPress={handleRecenter}
        onMapPress={handleMapPress}
        onRouteInfo={(meta) => setRouteMeta(meta)}
      />

      {/* Floating Top Navigation */}
      <SafeAreaView style={styles.topBarSafe} pointerEvents="box-none">
        <View style={[styles.topBar, { paddingHorizontal: spacing[4], paddingVertical: spacing[2] }]}>
          <Logo size="sm" layout="horizontal" />
          <Pressable
            onPress={() => setMapSelectTarget(mapSelectTarget ? null : 'drop')}
            style={[styles.onlinePill, { backgroundColor: isDark ? '#0B2B26' : '#FFFFFF', borderColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.full }]}
          >
            <View style={[styles.liveDot, { backgroundColor: mapSelectTarget ? '#F5B301' : '#1FD88A' }]} />
            <Text style={[styles.onlineText, { color: isDark ? '#1FD88A' : colors.primary }]}>
              {mapSelectTarget ? `SELECT ${mapSelectTarget.toUpperCase()} ON MAP` : 'MUMBAI LIVE'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
            accessibilityLabel={t('profile.title')}
            style={[styles.profileBtn, { backgroundColor: isDark ? '#0B2B26' : '#FFFFFF', borderColor: colors.border, borderRadius: radius.full }]}
          >
            <User size={18} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2.2} />
          </Pressable>
        </View>

        {mapSelectTarget && (
          <View style={[styles.mapPromptBanner, { backgroundColor: '#0B2B26', borderColor: '#1FD88A' }]}>
            <Text style={{ color: '#DAF1DE', fontSize: 12, fontWeight: '700' }}>
              🎯 Tap anywhere on the map to set your {mapSelectTarget.toUpperCase()}!
            </Text>
            <Pressable onPress={() => setMapSelectTarget(null)} style={{ padding: 4 }}>
              <X size={16} color="#8EB69B" />
            </Pressable>
          </View>
        )}
      </SafeAreaView>

      {/* Floating Bottom Sheet */}
      <View
        style={[
          styles.bottomSheet,
          isSheetMinimized && styles.bottomSheetMinimized,
          { backgroundColor: isDark ? '#07201C' : '#FFFFFF', borderTopColor: colors.border, borderRadius: radius['2xl'] },
        ]}
      >
        <Pressable onPress={() => setIsSheetMinimized(!isSheetMinimized)} style={styles.sheetHandleWrap}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          {drop && (
            <View style={styles.minimizeToggleRow}>
              {isSheetMinimized ? <ChevronUp size={16} color={isDark ? '#1FD88A' : colors.primary} /> : <ChevronDown size={16} color={colors.textMutedHex} />}
              <Text style={{ fontSize: 11, fontWeight: '700', color: isDark ? '#1FD88A' : colors.primary, marginLeft: 4 }}>
                {isSheetMinimized ? 'View Fares & Book' : 'Minimize Map'}
              </Text>
            </View>
          )}
        </Pressable>

        {isSheetMinimized && drop ? (
          <Pressable onPress={() => setIsSheetMinimized(false)} style={[styles.minimizedBar, { paddingHorizontal: spacing[4] }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '800' }}>
                ⚡ {vehicleType} • {activeQuote ? formatPaise(activeQuote.totalPaise) : 'Calculating...'}
              </Text>
              <Text style={{ color: colors.textMutedHex, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
                {pickup?.name} → {drop?.name}{routeMeta ? ` • ${(routeMeta.distanceMeters / 1000).toFixed(1)} km (${Math.round(routeMeta.durationSeconds / 60)}m)` : ''}
              </Text>
            </View>
            <Button title="Expand" size="sm" variant="neon" fullWidth={false} onPress={() => setIsSheetMinimized(false)} />
          </Pressable>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingBottom: spacing[6] }}>
            {currentBooking ? (
              <View>
                <View style={styles.bookingStatusHeader}>
                  <Badge label={currentBooking.mode === 'SCHEDULED' ? 'SCHEDULED CONFIRMED' : 'CAPTAIN SEARCHING'} variant="neon" size="default" pulse={true} />
                  <Pressable onPress={resetBooking} style={styles.closeBtn}><X size={18} color={colors.textMutedHex} /></Pressable>
                </View>
                <Text style={[styles.statusTitle, { color: colors.text, fontSize: typography.scale.heading.fontSize }]}>
                  {currentBooking.mode === 'SCHEDULED' ? t('booking.scheduledConfirmed') : t('booking.searchingCaptain')}
                </Text>
                <View style={[styles.pinBox, { backgroundColor: isDark ? '#0D2F28' : '#E8F5EB', borderColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.lg }]}>
                  <Text style={[styles.pinLabel, { color: colors.textMutedHex }]}>START RIDE OTP / PIN</Text>
                  <Text style={[styles.pinValue, { color: isDark ? '#1FD88A' : colors.primary }]}>{currentBooking.tripPin || '5829'}</Text>
                  <Text style={[styles.pinSub, { color: colors.textMutedHex }]}>Share with Captain only upon arrival</Text>
                </View>
                <View style={[styles.bookingDetailsRow, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMutedHex }}>Total Server Fare:</Text>
                  <Text style={[styles.totalText, { color: colors.text }]}>{formatPaise(currentBooking.totalPaise)}</Text>
                </View>
                <Button title={t('booking.cancelRide')} variant="destructive" size="default" style={{ marginTop: 12 }} onPress={resetBooking} />
              </View>
            ) : !drop ? (
              <View>
                <Pressable
                  onPress={() => navigation.navigate('PlaceSelect', { target: 'drop' })}
                  accessibilityRole="button"
                  accessibilityLabel={t('booking.whereTo')}
                  style={[styles.searchBar, { backgroundColor: isDark ? '#0B2B26' : '#F4FAF5', borderColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.xl }]}
                >
                  <Search size={20} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2.4} />
                  <Text style={[styles.searchBarText, { color: colors.textMutedHex }]}>{t('booking.whereTo')}</Text>
                </Pressable>

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <Pressable onPress={() => setMapSelectTarget('drop')} style={[styles.mapSelectBtn, { backgroundColor: isDark ? '#0F312B' : '#EBF7EE', borderColor: isDark ? '#1FD88A' : colors.primary }]}>
                    <MapPin size={13} color={isDark ? '#1FD88A' : colors.primary} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text, marginLeft: 4 }}>Set Drop on Map</Text>
                  </Pressable>
                  <Pressable onPress={() => setMapSelectTarget('pickup')} style={[styles.mapSelectBtn, { backgroundColor: isDark ? '#0F312B' : '#EBF7EE', borderColor: colors.border }]}>
                    <MapPin size={13} color="#F5B301" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text, marginLeft: 4 }}>Set Pickup on Map</Text>
                  </Pressable>
                </View>

                <Text style={[styles.sheetSectionTitle, { color: colors.textMutedHex }]}>{t('booking.recentLocations')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                  {MUMBAI_LOCATIONS.slice(0, 6).map((loc) => (
                    <Pressable
                      key={loc.id}
                      onPress={() => setDrop(loc)}
                      style={[styles.quickChip, { backgroundColor: isDark ? '#0E2E28' : '#EBF7EE', borderColor: colors.border, borderRadius: radius.full }]}
                    >
                      <MapPin size={13} color={isDark ? '#1FD88A' : colors.primary} />
                      <Text style={[styles.quickChipText, { color: colors.text }]}>{loc.name.split('(')[0].trim()}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <View>
                <Pressable
                  onPress={() => navigation.navigate('PlaceSelect', { target: 'drop' })}
                  style={[styles.routePill, { backgroundColor: isDark ? '#0B2B26' : '#F6FAF7', borderColor: colors.border, borderRadius: radius.lg }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: '#1FD88A', fontWeight: '800' }}>PICKUP: {pickup?.name}</Text>
                    <Text style={{ fontSize: 13, color: colors.text, fontWeight: '700', marginTop: 2 }}>DROP: {drop?.name}</Text>
                    {routeMeta && (
                      <Text style={{ fontSize: 11, color: isDark ? '#A3C9AE' : colors.textMutedHex, marginTop: 3, fontWeight: '600' }}>
                        🛣️ Real Road Route • {(routeMeta.distanceMeters / 1000).toFixed(1)} km (~{Math.round(routeMeta.durationSeconds / 60)} mins)
                      </Text>
                    )}
                  </View>
                  <ArrowRight size={18} color={isDark ? '#1FD88A' : colors.primary} />
                </Pressable>

                <VehicleSelector selectedType={vehicleType} quotes={quotes} isLoading={isLoadingQuotes} onSelectType={setVehicleType} />

                <View style={[styles.modeToggle, { backgroundColor: isDark ? '#0B2B26' : '#E8F5EB', borderRadius: radius.full }]}>
                  <Pressable onPress={() => { setMode('INSTANT'); setScheduledFor(null); }} style={[styles.modeBtn, mode === 'INSTANT' && { backgroundColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.full }]}>
                    <Text style={[styles.modeBtnText, { color: mode === 'INSTANT' ? '#051F20' : colors.text }]}>⚡ {t('booking.instant')}</Text>
                  </Pressable>
                  <Pressable onPress={() => setMode('SCHEDULED')} style={[styles.modeBtn, mode === 'SCHEDULED' && { backgroundColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.full }]}>
                    <Text style={[styles.modeBtnText, { color: mode === 'SCHEDULED' ? '#051F20' : colors.text }]}>📅 {t('booking.scheduled')}</Text>
                  </Pressable>
                </View>

                {isScheduled && <ScheduleTimePicker scheduledFor={scheduledFor} onSelectTime={setScheduledFor} />}
                {bookingError && <Toast message={bookingError} variant="error" style={{ marginVertical: 8 }} />}

                <Button
                  testID="book-action-button"
                  accessibilityLabel="Book Instant Vrumm"
                  title={getButtonTitle()}
                  variant="neon"
                  size="lg"
                  icon={Zap}
                  loading={isCreatingBooking}
                  onPress={createBooking}
                  style={{ marginTop: 10 }}
                />
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBarSafe: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  onlinePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1.2 },
  liveDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  onlineText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  profileBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  mapPromptBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '64%', borderTopWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 12, zIndex: 20 },
  bottomSheetMinimized: { maxHeight: 110, paddingBottom: 10 },
  sheetHandleWrap: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2 },
  minimizeToggleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  minimizedBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  mapSelectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 52, borderWidth: 1.5, marginTop: 4 },
  searchBarText: { marginLeft: 12, fontSize: 15, fontWeight: '600' },
  sheetSectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 14, marginBottom: 8 },
  quickChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, gap: 6 },
  quickChipText: { fontSize: 12, fontWeight: '600' },
  routePill: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1 },
  modeToggle: { flexDirection: 'row', padding: 3, marginVertical: 8 },
  modeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  modeBtnText: { fontSize: 13, fontWeight: '700' },
  bookingStatusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { padding: 4 },
  statusTitle: { fontWeight: '800', marginTop: 8 },
  pinBox: { padding: 12, alignItems: 'center', borderWidth: 1.5, marginVertical: 12 },
  pinLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  pinValue: { fontSize: 32, fontWeight: '900', letterSpacing: 4, marginVertical: 4 },
  pinSub: { fontSize: 11 },
  bookingDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 8 },
  totalText: { fontSize: 16, fontWeight: '800' },
});

export default HomeScreen;