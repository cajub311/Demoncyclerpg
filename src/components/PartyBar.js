/**
 * PartyBar.js - Party member switching with HP bars
 * All 3 characters visible, 44px+ tap targets
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CHARACTERS } from '../systems/GameEngine';
import { COLORS } from '../systems/GameEngine';

const MIN_TAP_SIZE = 48;

const MAX_HP = { arlen: 100, leesha: 80, rojer: 70 };

export function PartyBar({ activeCharacter, onSelectCharacter, partyMembers, characterHp }) {
  const members = partyMembers || ['arlen', 'leesha', 'rojer'];
  const hp = characterHp || {};

  return (
    <View style={styles.container}>
      {members.map((charId) => {
        const char = CHARACTERS[charId.toUpperCase()] || CHARACTERS.ARLEN;
        const isActive = activeCharacter === charId;
        const currentHp = hp[charId] ?? MAX_HP[charId] ?? 100;
        const maxHp = MAX_HP[charId] ?? 100;
        const hpPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;

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
            {/* HP bar under portrait */}
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
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderTopWidth: 2,
    borderTopColor: COLORS.surfaceLight,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    minHeight: 90,
  },
  characterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    minHeight: MIN_TAP_SIZE,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  characterButtonActive: {
    backgroundColor: COLORS.wardBlue,
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  emojiContainer: {
    marginBottom: 2,
  },
  emoji: {
    fontSize: 22,
  },
  name: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  nameActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  hpBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: COLORS.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  hpBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
