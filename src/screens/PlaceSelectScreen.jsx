import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, ArrowUpDown, MapPin, Building, Train, Plane, Check, Navigation } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n';
import { useBookingStore } from '../store/bookingStore';
import { mapService, MUMBAI_LOCATIONS } from '../services/mapService';
import { locationService } from '../services/locationService';
import BackgroundPattern from '../components/ui/BackgroundPattern';

export function PlaceSelectScreen({ navigation, route }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const { t } = useTranslation();
  const { pickup, drop, setPickup, setDrop, swapPickupAndDrop } = useBookingStore();

  const initialTarget = route.params?.target || (pickup ? 'drop' : 'pickup');
  const [activeTarget, setActiveTarget] = useState(initialTarget); // 'pickup' | 'drop'
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState(MUMBAI_LOCATIONS);

  useEffect(() => {
    let isMounted = true;
    mapService.searchPlaces(searchQuery).then((results) => {
      if (isMounted) setPlaces(results);
    });
    return () => { isMounted = false; };
  }, [searchQuery]);

  const handleSelectPlace = (place) => {
    const selectedObj = {
      name: place.name,
      address: place.address,
      coordinates: place.coordinates,
    };

    if (activeTarget === 'pickup') {
      setPickup(selectedObj);
      if (!drop) {
        setActiveTarget('drop');
        setSearchQuery('');
      } else {
        navigation.goBack();
      }
    } else {
      setDrop(selectedObj);
      navigation.goBack();
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'transit':
        return <Train size={18} color={isDark ? '#1FD88A' : colors.primary} />;
      case 'business':
        return <Building size={18} color="#38BDF8" />;
      default:
        return <MapPin size={18} color="#F5B301" />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <BackgroundPattern />

      {/* Top Navigation */}
      <View style={[styles.topBar, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={[styles.backBtn, { backgroundColor: isDark ? colors.surfaceRaised : colors.surface, borderColor: colors.border, borderRadius: radius.full }]}
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2.2} />
        </Pressable>
        <Text style={[styles.screenTitle, { color: colors.text, fontSize: typography.scale.heading.fontSize, fontFamily: typography.fonts.heading }]}>
          {t('booking.whereTo')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Dual Inputs: Pickup & Drop */}
      <View style={[styles.inputsContainer, { backgroundColor: isDark ? '#0B2B26' : '#FFFFFF', borderColor: colors.border, borderRadius: radius.xl, marginHorizontal: spacing[4], padding: spacing[3] }]}>
        <View style={styles.inputsRow}>
          <View style={styles.pinsCol}>
            <View style={[styles.dot, { backgroundColor: '#1FD88A' }]} />
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: '#F5B301' }]} />
          </View>

          <View style={{ flex: 1, marginHorizontal: 8 }}>
            {/* Pickup Selector Box */}
            <Pressable
              onPress={() => { setActiveTarget('pickup'); setSearchQuery(''); }}
              style={[styles.inputBox, { borderColor: activeTarget === 'pickup' ? '#1FD88A' : 'transparent', backgroundColor: isDark ? '#07201C' : '#F6FAF7', borderRadius: radius.md }]}
            >
              <Text style={[styles.inputLabel, { color: '#1FD88A' }]}>PICKUP</Text>
              <Text style={[styles.inputText, { color: colors.text }]} numberOfLines={1}>
                {pickup ? pickup.name : 'Select Mumbai pickup location'}
              </Text>
            </Pressable>

            {/* Drop Selector Box */}
            <Pressable
              onPress={() => { setActiveTarget('drop'); setSearchQuery(''); }}
              style={[styles.inputBox, { borderColor: activeTarget === 'drop' ? '#F5B301' : 'transparent', backgroundColor: isDark ? '#07201C' : '#F6FAF7', borderRadius: radius.md, marginTop: 6 }]}
            >
              <Text style={[styles.inputLabel, { color: '#F5B301' }]}>DROP</Text>
              <Text style={[styles.inputText, { color: drop ? colors.text : colors.textMutedHex }]} numberOfLines={1}>
                {drop ? drop.name : t('booking.enterDrop')}
              </Text>
            </Pressable>
          </View>

          {/* Swap Button */}
          <Pressable
            onPress={swapPickupAndDrop}
            accessibilityRole="button"
            accessibilityLabel={t('booking.swap')}
            style={[styles.swapBtn, { backgroundColor: isDark ? '#163832' : '#E8F5EB', borderColor: colors.border, borderRadius: radius.full }]}
          >
            <ArrowUpDown size={16} color={colors.text} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      {/* Search Input */}
      <View style={[styles.searchBox, { backgroundColor: isDark ? '#0D2F28' : '#FFFFFF', borderColor: isDark ? '#235347' : '#A3C9B0', borderRadius: radius.lg, marginHorizontal: spacing[4], marginTop: spacing[3], paddingHorizontal: spacing[3] }]}>
        <Search size={18} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2.2} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('booking.searchPrompt')}
          placeholderTextColor={colors.textMutedHex}
          autoFocus={true}
          style={[styles.searchInput, { color: colors.text, fontFamily: typography.fonts.body }]}
        />
      </View>

      {/* 1-Tap Use Current Location */}
      <Pressable
        onPress={async () => {
          const loc = await locationService.getCurrentLocation();
          if (loc) {
            handleSelectPlace(loc);
          }
        }}
        style={[styles.currentLocBtn, { backgroundColor: isDark ? '#0F312B' : '#E8F5EB', borderColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.lg, marginHorizontal: spacing[4], marginTop: 8 }]}
      >
        <Navigation size={18} color={isDark ? '#1FD88A' : colors.primary} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>Use Current Location</Text>
          <Text style={{ fontSize: 11, color: colors.textMutedHex }}>GPS Auto-Detect via LocationIQ</Text>
        </View>
      </Pressable>

      {/* Places List */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#1FD88A' : colors.primary, marginHorizontal: spacing[5], marginTop: spacing[4], marginBottom: spacing[2] }]}>
        {t('booking.recentLocations')}
      </Text>

      <FlatList
        data={places}
        keyExtractor={(item, index) => `${item.id || 'place'}_${index}`}
        contentContainerStyle={{ paddingHorizontal: spacing[4], paddingBottom: spacing[6] }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const isSelected = (activeTarget === 'pickup' && pickup?.name === item.name) || (activeTarget === 'drop' && drop?.name === item.name);
          return (
            <Pressable
              onPress={() => handleSelectPlace(item)}
              style={({ pressed }) => [
                styles.placeItem,
                {
                  backgroundColor: isSelected ? (isDark ? '#163832' : '#E8F5EB') : (isDark ? '#0B2B26' : '#FFFFFF'),
                  borderColor: isSelected ? (isDark ? '#1FD88A' : colors.primary) : colors.border,
                  borderRadius: radius.lg,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: isDark ? '#163832' : '#F4FAF5' }]}>
                {getCategoryIcon(item.category)}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.placeName, { color: colors.text, fontSize: typography.scale.bodyMedium.fontSize }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.tag && (
                    <View style={[styles.tagPill, { backgroundColor: isDark ? '#163832' : '#DAF1DE' }]}>
                      <Text style={[styles.tagText, { color: isDark ? '#1FD88A' : colors.primary }]}>{item.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.placeAddress, { color: colors.textMutedHex, fontSize: typography.scale.caption.fontSize }]} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
              {isSelected && <Check size={18} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2.5} />}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  screenTitle: { fontWeight: '800' },
  inputsContainer: { borderWidth: 1.5 },
  inputsRow: { flexDirection: 'row', alignItems: 'center' },
  pinsCol: { alignItems: 'center', justifyContent: 'center', width: 20 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  line: { width: 2, height: 26, marginVertical: 3 },
  inputBox: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1.5 },
  inputLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  inputText: { fontSize: 13, fontWeight: '600', marginTop: 1 },
  swapBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderWidth: 1.5 },
  searchInput: { flex: 1, height: 48, marginLeft: 8, fontSize: 14 },
  currentLocBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1.2 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  placeItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, marginBottom: 8 },
  categoryIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  placeName: { fontWeight: '700' },
  placeAddress: { marginTop: 2 },
  tagPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 },
  tagText: { fontSize: 10, fontWeight: '700' },
});

export default PlaceSelectScreen;
