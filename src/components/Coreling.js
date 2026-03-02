/**
 * Coreling.js - Demon with combat feedback: flash on hit, fade-out on death
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../systems/GameEngine';

const MIN_TAP_SIZE = 48;

const TYPE_STYLES = {
  field: { size: 44, color: '#4a2c6a', eyeColor: '#ff4444', shape: 'circle' },
  rock: { size: 72, color: '#3d3d3d', eyeColor: '#ff6666', shape: 'square' },
  wood: { size: 52, color: '#2d4a2d', eyeColor: '#ff4444', shape: 'circle' },
  wind: { size: 38, color: '#2a3a4a', eyeColor: '#44aaff', shape: 'circle' },
  flame: { size: 50, color: '#4a2a1a', eyeColor: '#ff8800', shape: 'circle' },
};

export function Coreling({ coreling, onTap, disabled, isHit, onDeathComplete }) {
  const { id, type, hp, maxHp, x, y, dying } = coreling;
  const hpPercent = maxHp > 0 ? (hp / maxHp) * 100 : 0;
  const style = TYPE_STYLES[type] || TYPE_STYLES.field;
  const size = Math.max(style.size, MIN_TAP_SIZE);
  const isDead = hp <= 0 || dying;

  const flashOpacity = useRef(new Animated.Value(0)).current;
  const fadeOpacity = useRef(new Animated.Value(1)).current;

  // Flash effect when hit
  useEffect(() => {
    if (!isHit) return;
    flashOpacity.setValue(1);
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isHit]);

  // Fade-out when dying
  useEffect(() => {
    if (!isDead) return;
    Animated.timing(fadeOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => onDeathComplete?.(id));
  }, [isDead]);

  if (isDead) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            left: `${x}%`,
            top: `${y}%`,
            opacity: fadeOpacity,
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.hpBarBg}>
          <View style={[styles.hpBarFill, { width: '0%', backgroundColor: COLORS.danger }]} />
        </View>
        <View
          style={[
            styles.body,
            {
              width: size,
              height: size,
              borderRadius: style.shape === 'square' ? 8 : size / 2,
              backgroundColor: style.color,
            },
          ]}
        >
          <View style={styles.eyes}>
            <View style={[styles.eye, { backgroundColor: style.eyeColor }]} />
            <View style={[styles.eye, { backgroundColor: style.eyeColor }]} />
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { left: `${x}%`, top: `${y}%`, minWidth: size + 20, minHeight: size + 40 }]}
      onPress={() => !disabled && onTap(id)}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {/* Flash overlay when hit */}
      <Animated.View
        style={[styles.flashOverlay, { opacity: flashOpacity }]}
        pointerEvents="none"
      />

      <View style={styles.hpBarBg}>
        <View
          style={[
            styles.hpBarFill,
            {
              width: `${hpPercent}%`,
              backgroundColor: hpPercent > 50 ? COLORS.safe : hpPercent > 25 ? '#b8860b' : COLORS.danger,
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.body,
          {
            width: size,
            height: size,
            borderRadius: style.shape === 'square' ? 8 : size / 2,
            backgroundColor: style.color,
            borderWidth: style.shape === 'rock' ? 4 : 2,
          },
        ]}
      >
        <View style={styles.eyes}>
          <View style={[styles.eye, { backgroundColor: style.eyeColor }]} />
          <View style={[styles.eye, { backgroundColor: style.eyeColor }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: -30,
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 40,
    zIndex: 1,
  },
  hpBarBg: {
    width: 50,
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  hpBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.bloodRed,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  eyes: {
    flexDirection: 'row',
    gap: 8,
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});
