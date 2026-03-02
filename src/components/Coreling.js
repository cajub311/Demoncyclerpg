/**
 * Coreling.js - Demon entity, tap-to-attack (min 44px target)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../systems/GameEngine';

const MIN_TAP_SIZE = 48;

export function Coreling({ coreling, onTap, disabled }) {
  const { id, type, hp, maxHp, x, y } = coreling;
  const hpPercent = maxHp > 0 ? (hp / maxHp) * 100 : 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          left: `${x}%`,
          top: `${y}%`,
          minWidth: MIN_TAP_SIZE,
          minHeight: MIN_TAP_SIZE,
        },
      ]}
      onPress={() => !disabled && onTap(id)}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={styles.demon}>
        <Text style={styles.emoji}>👹</Text>
        <View style={styles.hpBar}>
          <View
            style={[
              styles.hpFill,
              {
                width: `${hpPercent}%`,
                backgroundColor: hpPercent > 50 ? COLORS.safe : hpPercent > 25 ? '#b8860b' : COLORS.danger,
              },
            ]}
          />
        </View>
        <Text style={styles.hpText}>{hp}/{maxHp}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demon: {
    alignItems: 'center',
    backgroundColor: COLORS.demonPurple,
    borderRadius: 24,
    padding: 8,
    borderWidth: 2,
    borderColor: COLORS.bloodRed,
  },
  emoji: {
    fontSize: 28,
  },
  hpBar: {
    width: 40,
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  hpFill: {
    height: '100%',
    borderRadius: 3,
  },
  hpText: {
    fontSize: 10,
    color: COLORS.text,
    marginTop: 2,
  },
});
