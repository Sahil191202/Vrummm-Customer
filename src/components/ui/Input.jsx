import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Animated } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  icon: Icon,
  prefix,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  editable = true,
  accessibilityLabel,
  containerStyle,
}) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = error
    ? colors.error
    : isFocused
    ? isDark
      ? '#1FD88A'
      : colors.primary
    : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text
            style={[
              styles.label,
              {
                color: isFocused ? (isDark ? '#1FD88A' : colors.primary) : colors.textMutedHex,
                fontSize: typography.scale.caption.fontSize,
                fontWeight: typography.fontWeights.semibold,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? '#0D2F28' : '#FFFFFF',
            borderColor,
            borderWidth: isFocused ? 1.8 : 1.2,
            borderRadius: radius.lg,
            minHeight: 52,
            paddingHorizontal: spacing[3],
          },
        ]}
      >
        {Icon && (
          <View
            style={[
              styles.leftIconWrapper,
              {
                backgroundColor: isFocused
                  ? isDark
                    ? 'rgba(31, 216, 138, 0.15)'
                    : 'rgba(35, 83, 71, 0.10)'
                  : isDark
                  ? '#163832'
                  : '#EBF7EE',
                borderRadius: radius.md,
              },
            ]}
          >
            <Icon
              size={18}
              color={isFocused ? (isDark ? '#1FD88A' : colors.primary) : colors.textMutedHex}
              strokeWidth={2}
            />
          </View>
        )}

        {prefix && (
          <View
            style={[
              styles.prefixBadge,
              {
                backgroundColor: isDark ? '#163832' : '#E8F5EB',
                borderColor: colors.border,
                borderRadius: radius.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.prefixText,
                {
                  color: colors.text,
                  fontWeight: typography.fontWeights.bold,
                },
              ]}
            >
              {prefix}
            </Text>
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#70947E' : '#8EB69B'}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={accessibilityLabel || label}
          style={[
            styles.textInput,
            {
              color: colors.text,
              fontSize: typography.scale.body.fontSize,
              fontFamily: typography.fonts.body,
            },
          ]}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? (
              <EyeOff size={19} color={colors.textMutedHex} strokeWidth={2} />
            ) : (
              <Eye size={19} color={isDark ? '#1FD88A' : colors.primary} strokeWidth={2} />
            )}
          </Pressable>
        )}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Text
            style={[
              styles.errorText,
              {
                color: colors.error,
                fontSize: typography.scale.caption.fontSize,
                marginTop: spacing[1],
              },
            ]}
          >
            {error}
          </Text>
        </View>
      ) : helperText ? (
        <Text
          style={[
            styles.helperText,
            {
              color: colors.textMutedHex,
              fontSize: typography.scale.caption.fontSize,
              marginTop: spacing[1],
            },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  prefixBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 8,
    borderWidth: 1,
  },
  prefixText: {
    fontSize: 13,
  },
  textInput: {
    flex: 1,
    height: 48,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 8,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontWeight: '600',
  },
  helperText: {
    fontWeight: '400',
  },
});

export default Input;
