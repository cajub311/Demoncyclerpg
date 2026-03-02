/**
 * WardPlacementEffect.js - Glowing blue ward symbol with circle animation
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../systems/GameEngine';

export function WardPlacementEffect({ x, y, onComplete }) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const duration = 600;
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: duration * 0.4,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration * 0.2,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(circleScale, {
          toValue: 3,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(circleOpacity, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => onComplete?.());
  }, []);

  return (
    <View
      style={[
        styles.container,
        { left: `${x}%`, top: `${y}%`, marginLeft: -40, marginTop: -40 },
      ]}
      pointerEvents="none"
    >
      {/* Expanding circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: circleScale }],
            opacity: circleOpacity,
          },
        ]}
      />
      {/* Ward symbol */}
      <Animated.View
        style={[
          styles.symbolContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.wardSymbol}>◇</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  circle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: COLORS.wardBlue,
    backgroundColor: 'transparent',
  },
  symbolContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(74, 111, 165, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.wardBlue,
    shadowColor: COLORS.wardBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 12,
  },
  wardSymbol: {
    fontSize: 28,
    color: COLORS.wardBlue,
    fontWeight: '900',
  },
});
