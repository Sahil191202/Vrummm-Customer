import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/useTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function BackgroundPattern({ children, style }) {
  const { colors, isDark } = useTheme();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ]),
    );
    float.start();
    return () => float.stop();
  }, [floatAnim]);

  const translateY1 = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const translateY2 = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const orbColor1 = isDark ? '#1FD88A' : '#8EB69B';
  const orbColor2 = isDark ? '#235347' : '#DAF1DE';

  return (
    <View
      style={[
        children ? styles.container : StyleSheet.absoluteFillObject,
        { backgroundColor: colors.background },
        style,
      ]}
      pointerEvents={children ? 'auto' : 'none'}
    >
      {/* Ambient background SVG glowing orbs & transit grid */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Animated.View
          style={[
            styles.glowOrbTop,
            {
              transform: [{ translateY: translateY1 }],
            },
          ]}
        >
          <Svg width={300} height={300} viewBox="0 0 300 300">
            <Defs>
              <RadialGradient id="gradTop" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor={orbColor1} stopOpacity={isDark ? '0.18' : '0.22'} />
                <Stop offset="70%" stopColor={orbColor1} stopOpacity="0.04" />
                <Stop offset="100%" stopColor={orbColor1} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="150" cy="150" r="150" fill="url(#gradTop)" />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.glowOrbBottom,
            {
              transform: [{ translateY: translateY2 }],
            },
          ]}
        >
          <Svg width={360} height={360} viewBox="0 0 360 360">
            <Defs>
              <RadialGradient id="gradBottom" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor={orbColor2} stopOpacity={isDark ? '0.25' : '0.20'} />
                <Stop offset="80%" stopColor={orbColor2} stopOpacity="0.05" />
                <Stop offset="100%" stopColor={orbColor2} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="180" cy="180" r="180" fill="url(#gradBottom)" />
          </Svg>
        </Animated.View>

        {/* Mumbai Coastal Transit Vector Lines */}
        <Svg
          width={SCREEN_WIDTH || 400}
          height={SCREEN_HEIGHT || 800}
          style={styles.gridSvg}
          viewBox="0 0 400 800"
        >
          <Path
            d="M-50 160 C 120 120, 240 280, 450 200"
            stroke={isDark ? '#1FD88A' : '#8EB69B'}
            strokeWidth="1.2"
            strokeOpacity={isDark ? '0.12' : '0.18'}
            strokeDasharray="4 6"
            fill="none"
          />
          <Path
            d="M-30 420 C 140 380, 260 520, 480 440"
            stroke={isDark ? '#8EB69B' : '#235347'}
            strokeWidth="1.2"
            strokeOpacity={isDark ? '0.09' : '0.14'}
            fill="none"
          />
          <Path
            d="M-20 680 C 150 630, 280 750, 460 700"
            stroke={isDark ? '#F5B301' : '#B45309'}
            strokeWidth="1"
            strokeOpacity={isDark ? '0.08' : '0.12'}
            strokeDasharray="2 8"
            fill="none"
          />
        </Svg>
      </View>

      {/* Screen Foreground Children */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  glowOrbTop: {
    position: 'absolute',
    top: -60,
    right: -60,
  },
  glowOrbBottom: {
    position: 'absolute',
    bottom: -80,
    left: -80,
  },
  gridSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default BackgroundPattern;
