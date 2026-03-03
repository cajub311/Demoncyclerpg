/**
 * DialogueBox.js - NPC dialogue overlay (press A to interact)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../systems/GameEngine';

export function DialogueBox({ npc, onClose }) {
  if (!npc) return null;

  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.box}>
        <Text style={styles.name}>{npc.name}</Text>
        <Text style={styles.role}>{npc.role}</Text>
        <Text style={styles.dialogue}>"{npc.dialogue}"</Text>
        <Text style={styles.hint}>Tap to close</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  box: {
    margin: 24,
    padding: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.wardBlue,
    maxWidth: 320,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  dialogue: {
    fontSize: 16,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 16,
    textAlign: 'center',
  },
});
