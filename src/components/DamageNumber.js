/**
 * DamageNumber.js - Floating damage number on attack
 */

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../systems/GameEngine';

export function DamageNumber({ damage, x, y, onComplete }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -50,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => onComplete?.());
  }, []);

  return (
    <Animated.Text
      style={[
        styles.damage,
        {
          left: `${x}%`,
          top: `${y}%`,
          marginLeft: -15,
          marginTop: -30,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      -{damage}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  damage: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.danger,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    zIndex: 6,
  },
});
