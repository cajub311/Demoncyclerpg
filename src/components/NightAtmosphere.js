/**
 * NightAtmosphere.js - Dark vignette, red pulsing danger glow, threatening feel
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../systems/GameEngine';

export function NightAtmosphere() {
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Dark vignette - 4 corner overlays */}
      <View style={[styles.vignetteCorner, styles.vignetteTL]} />
      <View style={[styles.vignetteCorner, styles.vignetteTR]} />
      <View style={[styles.vignetteCorner, styles.vignetteBL]} />
      <View style={[styles.vignetteCorner, styles.vignetteBR]} />
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />
      <View style={styles.vignetteLeft} />
      <View style={styles.vignetteRight} />

      {/* Red pulsing danger glow */}
      <Animated.View style={[styles.dangerGlow, { opacity: pulseOpacity }]} />
      <View style={styles.dangerBorder} />

      {/* Threatening ground overlay */}
      <View style={styles.groundThreat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  vignetteCorner: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  vignetteTL: {
    top: 0,
    left: 0,
    borderBottomRightRadius: 100,
  },
  vignetteTR: {
    top: 0,
    right: 0,
    borderBottomLeftRadius: 100,
  },
  vignetteBL: {
    bottom: 0,
    left: 0,
    borderTopRightRadius: 100,
  },
  vignetteBR: {
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 100,
  },
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 100,
    right: 100,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 100,
    right: 100,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  vignetteLeft: {
    position: 'absolute',
    top: 100,
    bottom: 100,
    left: 0,
    width: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  vignetteRight: {
    position: 'absolute',
    top: 100,
    bottom: 100,
    right: 0,
    width: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dangerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(196, 30, 58, 0.12)',
  },
  dangerBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: 'rgba(196, 30, 58, 0.25)',
  },
  groundThreat: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});
