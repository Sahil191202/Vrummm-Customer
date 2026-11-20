import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius,
  style,
}) {
  const { colors, radius } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.surfaceRaised,
          borderRadius: borderRadius !== undefined ? borderRadius : radius.md,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

export default Skeleton;
