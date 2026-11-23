import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bike, Compass, Car, ChevronDown, ChevronUp, ShieldCheck, Check } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { useTranslation } from '../../i18n';
import { formatPaise, formatDistance } from '../../utils/formatters';

export function VehicleSelector({ selectedType, quotes, isLoading, onSelectType }) {
  const { colors, typography, radius, isDark } = useTheme();
  const { t } = useTranslation();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const vehicles = [
    { type: 'BIKE', label: 'Bike', icon: Bike, eta: '2m', tag: 'FASTEST' },
    { type: 'AUTO', label: 'Auto', icon: Compass, eta: '3m', tag: 'POPULAR' },
    { type: 'CAB', label: 'Cab', icon: Car, eta: '5m', tag: 'AC SEDAN' },
  ];

  const activeQuote = quotes ? quotes[selectedType] : null;

  return (
    <View style={styles.container}>
      {/* 3 Vehicle Cards with Unified Layout */}
      <View style={styles.cardsRow}>
        {vehicles.map((v) => {
          const VIcon = v.icon;
          const isSelected = selectedType === v.type;
          const vQuote = quotes ? quotes[v.type] : null;

          return (
            <Pressable
              key={v.type}
              onPress={() => onSelectType(v.type)}
              accessibilityRole="button"
              accessibilityLabel={`${v.label} ${vQuote ? formatPaise(vQuote.totalPaise) : ''}`}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: isSelected
                    ? (isDark ? 'rgba(31, 216, 138, 0.12)' : '#E8F5EB')
                    : (isDark ? '#0B2B26' : '#FFFFFF'),
                  borderColor: isSelected
                    ? (isDark ? '#1FD88A' : colors.primary)
                    : (isDark ? '#163832' : colors.border),
                  borderWidth: isSelected ? 2 : 1.2,
                  borderRadius: radius.xl,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              {/* Top Tag Pill INSIDE Card */}
              <View
                style={[
                  styles.tagBadge,
                  {
                    backgroundColor: isSelected
                      ? (isDark ? '#1FD88A' : colors.primary)
                      : (isDark ? '#163832' : '#DAF1DE'),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    {
                      color: isSelected
                        ? '#051F20'
                        : (isDark ? '#A3C9AE' : colors.primary),
                    },
                  ]}
                >
                  {v.tag}
                </Text>
              </View>

              {/* Vehicle Icon Circle */}
              <View
                style={[
                  styles.iconWrapper,
                  {
                    backgroundColor: isSelected
                      ? (isDark ? 'rgba(31, 216, 138, 0.2)' : 'rgba(35, 83, 71, 0.15)')
                      : (isDark ? '#163832' : '#F4FAF5'),
                    borderColor: isSelected ? (isDark ? '#1FD88A' : colors.primary) : colors.border,
                  },
                ]}
              >
                <VIcon
                  size={24}
                  color={isSelected ? (isDark ? '#1FD88A' : colors.primary) : colors.textMutedHex}
                  strokeWidth={2.4}
                />
              </View>

              {/* Title */}
              <Text
                style={[
                  styles.vehicleTitle,
                  {
                    color: colors.text,
                    fontSize: typography.scale.bodyMedium.fontSize,
                    fontWeight: isSelected ? '800' : '700',
                  },
                ]}
              >
                {v.label}
              </Text>

              {/* Real Individual Price */}
              <Text
                style={[
                  styles.priceText,
                  {
                    color: isSelected
                      ? (isDark ? '#1FD88A' : colors.primary)
                      : colors.text,
                  },
                ]}
              >
                {isLoading ? '...' : vQuote ? formatPaise(vQuote.totalPaise) : '₹--'}
              </Text>

              {/* ETA */}
              <Text style={[styles.etaText, { color: colors.textMutedHex }]}>
                {v.eta} away
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Transparent Fare Breakdown Accordion */}
      {activeQuote && (
        <View
          style={[
            styles.breakdownBox,
            {
              backgroundColor: isDark ? '#0B2B26' : '#F4FAF5',
              borderColor: isDark ? '#235347' : colors.border,
              borderRadius: radius.lg,
            },
          ]}
        >
          <Pressable onPress={() => setShowBreakdown(!showBreakdown)} style={styles.breakdownHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ShieldCheck size={16} color={isDark ? '#1FD88A' : colors.primary} />
              <Text style={[styles.breakdownTitle, { color: colors.text, marginLeft: 6 }]}>
                {selectedType} Fare Breakdown: {formatPaise(activeQuote.totalPaise)}
              </Text>
            </View>
            {showBreakdown ? (
              <ChevronUp size={16} color={colors.text} />
            ) : (
              <ChevronDown size={16} color={colors.text} />
            )}
          </Pressable>

          {showBreakdown && (
            <View style={styles.breakdownContent}>
              <View style={styles.bdRow}>
                <Text style={[styles.bdLabel, { color: colors.textMutedHex }]}>{t('booking.baseFare')}</Text>
                <Text style={[styles.bdValue, { color: colors.text }]}>{formatPaise(activeQuote.breakdown.baseFarePaise)}</Text>
              </View>
              <View style={styles.bdRow}>
                <Text style={[styles.bdLabel, { color: colors.textMutedHex }]}>
                  {t('booking.distanceFare')} ({formatDistance(activeQuote.breakdown.distanceCharge.distanceMetres)})
                </Text>
                <Text style={[styles.bdValue, { color: colors.text }]}>{formatPaise(activeQuote.breakdown.distanceCharge.amountPaise)}</Text>
              </View>
              <View style={styles.bdRow}>
                <Text style={[styles.bdLabel, { color: colors.textMutedHex }]}>Time Charge</Text>
                <Text style={[styles.bdValue, { color: colors.text }]}>{formatPaise(activeQuote.breakdown.timeCharge.amountPaise)}</Text>
              </View>
              <View style={styles.bdRow}>
                <Text style={[styles.bdLabel, { color: colors.textMutedHex }]}>{t('booking.taxes')}</Text>
                <Text style={[styles.bdValue, { color: colors.text }]}>{formatPaise(activeQuote.breakdown.totalTaxPaise)}</Text>
              </View>
              <View style={[styles.bdRow, styles.totalRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total Server Fare</Text>
                <Text style={[styles.totalValue, { color: isDark ? '#1FD88A' : colors.primary }]}>{formatPaise(activeQuote.totalPaise)}</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  cardsRow: { flexDirection: 'row', gap: 8 },
  card: { flex: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4 },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginBottom: 6 },
  tagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  iconWrapper: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  vehicleTitle: {},
  priceText: { fontSize: 16, fontWeight: '900', marginTop: 2 },
  etaText: { fontSize: 10, marginTop: 2 },
  breakdownBox: { padding: 12, borderWidth: 1, marginTop: 10 },
  breakdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakdownTitle: { fontSize: 12, fontWeight: '700' },
  breakdownContent: { marginTop: 10, gap: 5 },
  bdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bdLabel: { fontSize: 12 },
  bdValue: { fontSize: 12, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, paddingTop: 6, marginTop: 4 },
  totalLabel: { fontSize: 13, fontWeight: '800' },
  totalValue: { fontSize: 16, fontWeight: '900' },
});

export default VehicleSelector;
