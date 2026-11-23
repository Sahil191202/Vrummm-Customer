import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Clock, ChevronUp, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { useTranslation } from '../../i18n';
import { formatToIST } from '../../utils/formatters';

export function ScheduleTimePicker({ scheduledFor, onSelectTime }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const { t } = useTranslation();

  const initialDate = scheduledFor ? new Date(scheduledFor) : new Date(Date.now() + 45 * 60 * 1000);

  const [selectedDayOffset, setSelectedDayOffset] = useState(0); // 0 = Today, 1 = Tomorrow, 2 = Day After
  const [selectedHour, setSelectedHour] = useState(initialDate.getHours() % 12 || 12);
  const [selectedMinute, setSelectedMinute] = useState(Math.round(initialDate.getMinutes() / 15) * 15 % 60);
  const [isPM, setIsPM] = useState(initialDate.getHours() >= 12);

  // Compute final ISO timestamp whenever day, hour, minute, or AM/PM changes
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + selectedDayOffset);

    let hour24 = selectedHour % 12;
    if (isPM) hour24 += 12;

    targetDate.setHours(hour24, selectedMinute, 0, 0);
    onSelectTime(targetDate.toISOString());
  }, [selectedDayOffset, selectedHour, selectedMinute, isPM]);

  // Validation: must be at least 30 minutes in the future
  const selectedDateObj = scheduledFor ? new Date(scheduledFor) : initialDate;
  const minutesDifference = Math.round((selectedDateObj.getTime() - Date.now()) / (60 * 1000));
  const isValidTime = minutesDifference >= 30;

  const handleQuickPreset = (minutesAhead) => {
    const d = new Date(Date.now() + minutesAhead * 60 * 1000);
    const dayDiff = d.getDate() - new Date().getDate();
    setSelectedDayOffset(Math.max(0, dayDiff));
    setSelectedHour(d.getHours() % 12 || 12);
    setSelectedMinute(Math.round(d.getMinutes() / 15) * 15 % 60);
    setIsPM(d.getHours() >= 12);
  };

  const incrementHour = () => setSelectedHour((h) => (h === 12 ? 1 : h + 1));
  const decrementHour = () => setSelectedHour((h) => (h === 1 ? 12 : h - 1));

  const incrementMinute = () => setSelectedMinute((m) => (m === 45 ? 0 : m + 15));
  const decrementMinute = () => setSelectedMinute((m) => (m === 0 ? 45 : m - 15));

  const dayOptions = [
    { label: 'Today', offset: 0 },
    { label: 'Tomorrow', offset: 1 },
    { label: 'Day After', offset: 2 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0D2F28' : '#F4FAF5', borderColor: colors.border, borderRadius: radius.xl, padding: spacing[3] }]}>
      {/* Clean Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Clock size={16} color={isDark ? '#1FD88A' : colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>SCHEDULE RIDE TIME</Text>
        </View>
        <View style={[styles.istBadge, { backgroundColor: isDark ? '#163832' : '#E8F5EB', borderColor: isDark ? '#1FD88A' : colors.primary }]}>
          <Text style={[styles.istText, { color: isDark ? '#1FD88A' : colors.primary }]}>MUMBAI (IST)</Text>
        </View>
      </View>

      {/* Day Selector Tabs */}
      <View style={[styles.dayRow, { backgroundColor: isDark ? '#0B2B26' : '#E8F5EB', borderRadius: radius.lg }]}>
        {dayOptions.map((opt) => (
          <Pressable
            key={opt.offset}
            onPress={() => setSelectedDayOffset(opt.offset)}
            style={[styles.dayTab, selectedDayOffset === opt.offset && { backgroundColor: isDark ? '#1FD88A' : colors.primary, borderRadius: radius.md }]}
          >
            <Text style={[styles.dayTabText, { color: selectedDayOffset === opt.offset ? '#051F20' : colors.text }]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Ergonomic Big Time Stepper */}
      <View style={[styles.timeBox, { backgroundColor: isDark ? '#0B2B26' : '#FFFFFF', borderColor: isDark ? '#235347' : colors.border, borderRadius: radius.lg }]}>
        {/* Hour Column */}
        <View style={styles.stepperCol}>
          <Pressable onPress={incrementHour} style={styles.stepperBtn} hitSlop={10}>
            <ChevronUp size={22} color={isDark ? '#1FD88A' : colors.primary} />
          </Pressable>
          <Text style={[styles.timeDigit, { color: colors.text }]}>{selectedHour < 10 ? `0${selectedHour}` : selectedHour}</Text>
          <Pressable onPress={decrementHour} style={styles.stepperBtn} hitSlop={10}>
            <ChevronDown size={22} color={isDark ? '#1FD88A' : colors.primary} />
          </Pressable>
        </View>

        <Text style={[styles.colon, { color: colors.textMutedHex }]}>:</Text>

        {/* Minute Column */}
        <View style={styles.stepperCol}>
          <Pressable onPress={incrementMinute} style={styles.stepperBtn} hitSlop={10}>
            <ChevronUp size={22} color={isDark ? '#1FD88A' : colors.primary} />
          </Pressable>
          <Text style={[styles.timeDigit, { color: colors.text }]}>{selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}</Text>
          <Pressable onPress={decrementMinute} style={styles.stepperBtn} hitSlop={10}>
            <ChevronDown size={22} color={isDark ? '#1FD88A' : colors.primary} />
          </Pressable>
        </View>

        {/* AM / PM Column */}
        <View style={styles.ampmCol}>
          <Pressable
            onPress={() => setIsPM(false)}
            style={[styles.ampmPill, !isPM && { backgroundColor: isDark ? '#1FD88A' : colors.primary }]}
          >
            <Text style={[styles.ampmText, { color: !isPM ? '#051F20' : colors.textMutedHex }]}>AM</Text>
          </Pressable>
          <Pressable
            onPress={() => setIsPM(true)}
            style={[styles.ampmPill, isPM && { backgroundColor: isDark ? '#1FD88A' : colors.primary }]}
          >
            <Text style={[styles.ampmText, { color: isPM ? '#051F20' : colors.textMutedHex }]}>PM</Text>
          </Pressable>
        </View>
      </View>

      {/* Quick Presets */}
      <View style={styles.presetsRow}>
        {[
          { label: '+45 min', mins: 45 },
          { label: '+1 hour', mins: 60 },
          { label: '+2 hours', mins: 120 },
          { label: 'Tomorrow 9 AM', mins: 24 * 60 - (new Date().getHours() * 60 + new Date().getMinutes()) + 9 * 60 },
        ].map((preset) => (
          <Pressable
            key={preset.label}
            onPress={() => handleQuickPreset(preset.mins)}
            style={[styles.presetChip, { backgroundColor: isDark ? '#163832' : '#FFFFFF', borderColor: colors.border, borderRadius: radius.full }]}
          >
            <Text style={{ fontSize: 11, color: isDark ? '#1FD88A' : colors.primary, fontWeight: '700' }}>{preset.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Live Feedback Banner */}
      <View style={[styles.previewBanner, { backgroundColor: isValidTime ? (isDark ? '#0B2B26' : '#E8F5EB') : (isDark ? '#261212' : '#FBE9E8'), borderColor: isValidTime ? (isDark ? '#1FD88A' : '#52B788') : '#FF4D4D', borderRadius: radius.md }]}>
        {isValidTime ? (
          <CheckCircle2 size={16} color={isDark ? '#1FD88A' : '#52B788'} />
        ) : (
          <AlertCircle size={16} color="#FF4D4D" />
        )}
        <Text style={[styles.previewText, { color: isValidTime ? colors.text : '#FF4D4D' }]}>
          {isValidTime
            ? `Pickup: ${formatToIST(scheduledFor)} (${minutesDifference}m away)`
            : t('booking.scheduleNotice')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1.2, marginVertical: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginLeft: 6 },
  istBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1 },
  istText: { fontSize: 10, fontWeight: '800' },
  dayRow: { flexDirection: 'row', padding: 3, marginBottom: 10 },
  dayTab: { flex: 1, paddingVertical: 7, alignItems: 'center' },
  dayTabText: { fontSize: 12, fontWeight: '700' },
  timeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderWidth: 1 },
  stepperCol: { alignItems: 'center', paddingHorizontal: 16 },
  stepperBtn: { padding: 4 },
  timeDigit: { fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  colon: { fontSize: 26, fontWeight: '900', marginBottom: 4 },
  ampmCol: { marginLeft: 16, gap: 4 },
  ampmPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  ampmText: { fontSize: 12, fontWeight: '800' },
  presetsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  presetChip: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  previewBanner: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 1, gap: 6 },
  previewText: { fontSize: 11, fontWeight: '600', flex: 1 },
});

export default ScheduleTimePicker;
