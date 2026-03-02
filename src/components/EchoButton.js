/**
 * EchoButton.js - Warded Echo respawn - invoke on death
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../systems/GameEngine';

export function EchoButton({ echoCharges, onUse, showWhenDead }) {
  if (echoCharges <= 0) return null;
  if (!showWhenDead) return null;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onUse}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>◇</Text>
      <Text style={styles.text}>Invoke Warded Echo</Text>
      <Text style={styles.charges}>{echoCharges} charge{echoCharges !== 1 ? 's' : ''}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: COLORS.wardBlue,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.text,
    minHeight: 48,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  charges: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
