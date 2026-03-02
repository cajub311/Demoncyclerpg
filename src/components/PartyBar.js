/**
 * PartyBar.js - Party member switching (Arlen, Leesha, Rojer)
 * Minimum 44px tap targets for mobile
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CHARACTERS } from '../systems/GameEngine';
import { COLORS } from '../systems/GameEngine';

const MIN_TAP_SIZE = 48;

export function PartyBar({ activeCharacter, onSelectCharacter, partyMembers }) {
  const members = partyMembers || ['arlen', 'leesha', 'rojer'];

  return (
    <View style={styles.container}>
      {members.map((charId) => {
        const char = CHARACTERS[charId.toUpperCase()] || CHARACTERS.ARLEN;
        const isActive = activeCharacter === charId;
        return (
          <TouchableOpacity
            key={charId}
            style={[styles.characterButton, isActive && styles.characterButtonActive]}
            onPress={() => onSelectCharacter(charId)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{char.emoji}</Text>
            </View>
            <Text style={[styles.name, isActive && styles.nameActive]} numberOfLines={1}>
              {char.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: COLORS.surfaceLight,
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 80,
  },
  characterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: MIN_TAP_SIZE,
    minHeight: MIN_TAP_SIZE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  characterButtonActive: {
    backgroundColor: COLORS.wardBlue,
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  emojiContainer: {
    marginBottom: 4,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  nameActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
});
