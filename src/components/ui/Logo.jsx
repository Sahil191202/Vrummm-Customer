import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Circle,
  Rect,
} from 'react-native-svg';
import { useTheme } from '../../theme/useTheme';

export function Logo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showWordmark = true,
  layout = 'horizontal', // 'horizontal' | 'vertical'
  animated = true,
  subtitle = 'MUMBAI TRANSIT',
  style,
}) {
  const { colors, typography, isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated || process.env.NODE_ENV === 'test') return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [animated, pulseAnim]);

  const dimensions = {
    sm: { icon: 34, text: 18, sub: 9, badge: 20 },
    md: { icon: 48, text: 24, sub: 10, badge: 24 },
    lg: { icon: 64, text: 32, sub: 11, badge: 30 },
    xl: { icon: 84, text: 40, sub: 12, badge: 36 },
  }[size] || { icon: 48, text: 24, sub: 10, badge: 24 };

  const isVertical = layout === 'vertical';

  return (
    <View
      style={[
        styles.container,
        isVertical ? styles.vertical : styles.horizontal,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            width: dimensions.icon,
            height: dimensions.icon,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 100"
          fill="none"
        >
          <Defs>
            <LinearGradient id="vrummGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#1FD88A" />
              <Stop offset="60%" stopColor="#8EB69B" />
              <Stop offset="100%" stopColor="#235347" />
            </LinearGradient>
            <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#0B2B26" />
              <Stop offset="100%" stopColor="#051F20" />
            </LinearGradient>
            <LinearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F5B301" />
              <Stop offset="100%" stopColor="#1FD88A" />
            </LinearGradient>
          </Defs>

          {/* Hexagonal Shield Background */}
          <Path
            d="M50 4 L90 26 L90 74 L50 96 L10 74 L10 26 Z"
            fill="url(#bgGrad)"
            stroke={isDark ? '#235347' : '#A3C9B0'}
            strokeWidth="3"
          />

          {/* Glowing Hex Inset */}
          <Path
            d="M50 12 L82 30 L82 70 L50 88 L18 70 L18 30 Z"
            stroke="#1FD88A"
            strokeWidth="1.2"
            strokeOpacity="0.4"
            fill="none"
          />

          {/* Dynamic Speed Chevrons ("V") */}
          <G transform="translate(0, 4)">
            {/* Primary V Wing */}
            <Path
              d="M26 32 L50 68 L74 32 L63 32 L50 51 L37 32 Z"
              fill="url(#vrummGrad)"
            />
            {/* Upper Speed Chevrons */}
            <Path
              d="M33 24 L50 48 L67 24 L60 24 L50 38 L40 24 Z"
              fill="#1FD88A"
              fillOpacity="0.85"
            />
            {/* Speed streak lines */}
            <Rect x="20" y="44" width="7" height="2.5" rx="1" fill="#F5B301" />
            <Rect x="73" y="44" width="7" height="2.5" rx="1" fill="#1FD88A" />
          </G>

          {/* Central Pulsing Beacon Dot */}
          <Circle cx="50" cy="74" r="3.5" fill="#1FD88A" />
        </Svg>
      </Animated.View>

      {showWordmark && (
        <View
          style={[
            styles.textBlock,
            isVertical ? styles.textBlockVertical : styles.textBlockHorizontal,
          ]}
        >
          <View style={styles.brandRow}>
            <Text
              style={[
                styles.brandName,
                {
                  fontSize: dimensions.text,
                  color: colors.text,
                  fontFamily: typography.fonts.heading,
                  fontWeight: typography.fontWeights.extrabold,
                },
              ]}
            >
              VRUMM
            </Text>
            <View
              style={[
                styles.speedMTag,
                {
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  marginLeft: 3,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: dimensions.text * 0.45,
                  fontWeight: '800',
                  color: colors.primaryForeground,
                }}
              >
                M
              </Text>
            </View>
          </View>

          {subtitle ? (
            <View style={styles.subtitleRow}>
              <View
                style={[
                  styles.pulseDot,
                  { backgroundColor: '#1FD88A' },
                ]}
              />
              <Text
                style={[
                  styles.subtitleText,
                  {
                    fontSize: dimensions.sub,
                    color: colors.textMutedHex,
                    fontWeight: typography.fontWeights.semibold,
                    letterSpacing: 1.5,
                  },
                ]}
              >
                {subtitle}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    justifyContent: 'center',
  },
  textBlockHorizontal: {
    marginLeft: 12,
  },
  textBlockVertical: {
    marginTop: 8,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    letterSpacing: 1,
  },
  speedMTag: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 6,
  },
  subtitleText: {
    textTransform: 'uppercase',
  },
});

export default Logo;
