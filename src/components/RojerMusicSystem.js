/**
 * RojerMusicSystem.js - Fiddle music to manipulate demon AI
 * Rhythm-based mini mechanic: Fiddle Charm, Demon Lullaby, Battle Hymn
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../systems/GameEngine';

const BEAT_INTERVAL_MS = 500;
const MIN_TAP_SIZE = 48;

const ABILITIES = [
  { id: 'charm', name: 'Fiddle Charm', desc: 'Mesmerize 1 demon', emoji: '🎻' },
  { id: 'lullaby', name: 'Demon Lullaby', desc: 'Slow all nearby', emoji: '😴' },
  { id: 'hymn', name: 'Battle Hymn', desc: 'Buff party', emoji: '⚔️' },
];

export function RojerMusicSystem({ onAbilityUse, active }) {
  const [beatPhase, setBeatPhase] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const beatRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    beatRef.current = setInterval(() => {
      setBeatPhase((p) => (p + 1) % 4);
    }, BEAT_INTERVAL_MS);
    return () => clearInterval(beatRef.current);
  }, [active]);

  const onBeatTap = () => {
    setCombo((c) => Math.min(c + 1, 4));
  };

  const useAbility = (abilityId) => {
    if (combo < 2) return;
    setSelectedAbility(abilityId);
    onAbilityUse?.(abilityId, combo);
    setCombo(0);
  };

  if (!active) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rojer's Music</Text>
      <Text style={styles.hint}>Tap the beat, then use an ability</Text>

      <View style={styles.beatRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.beatDot,
              beatPhase === i && styles.beatDotActive,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.beatButton}
        onPress={onBeatTap}
        activeOpacity={0.8}
      >
        <Text style={styles.beatButtonText}>Tap Beat</Text>
        <Text style={styles.comboText}>Combo: {combo}/4</Text>
      </TouchableOpacity>

      <View style={styles.abilities}>
        {ABILITIES.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={[
              styles.abilityButton,
              combo >= 2 && styles.abilityButtonReady,
            ]}
            onPress={() => useAbility(a.id)}
            disabled={combo < 2}
            activeOpacity={0.8}
          >
            <Text style={styles.abilityEmoji}>{a.emoji}</Text>
            <Text style={styles.abilityName}>{a.name}</Text>
            <Text style={styles.abilityDesc}>{a.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    margin: 16,
    borderWidth: 2,
    borderColor: COLORS.wardBlue,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  beatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  beatDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
  },
  beatDotActive: {
    backgroundColor: COLORS.wardBlue,
    transform: [{ scale: 1.2 }],
  },
  beatButton: {
    minHeight: MIN_TAP_SIZE,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  beatButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  comboText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  abilities: {
    gap: 8,
  },
  abilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    opacity: 0.6,
    minHeight: MIN_TAP_SIZE,
  },
  abilityButtonReady: {
    opacity: 1,
    borderWidth: 1,
    borderColor: COLORS.safe,
  },
  abilityEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  abilityName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  abilityDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
