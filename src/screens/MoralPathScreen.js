/**
 * MoralPathScreen.js - First-launch moral path selection (Fable-style)
 * Ward-Bearer vs Demon-Eater - sets initial drift
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useGame } from '../context/GameContext';
import { COLORS } from '../systems/GameEngine';

const MIN_TAP_SIZE = 48;

export function MoralPathScreen({ onSelect }) {
  const { setMoralScore } = useGame();
  const chooseWardBearer = () => {
    setMoralScore(30);
    onSelect();
  };

  const chooseDemonEater = () => {
    setMoralScore(-30);
    onSelect();
  };

  const chooseNeutral = () => {
    setMoralScore(0);
    onSelect();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>The Demon Cycle</Text>
        <Text style={styles.subtitle}>Choose your path</Text>
        <Text style={styles.lore}>
          Humanity survives behind wards. But some have learned to consume the
          Corelings' power. Your choices will shape who you become.
        </Text>

        <TouchableOpacity
          style={[styles.pathButton, styles.wardBearer]}
          onPress={chooseWardBearer}
          activeOpacity={0.8}
        >
          <Text style={styles.pathEmoji}>🛡️</Text>
          <Text style={styles.pathTitle}>Ward-Bearer</Text>
          <Text style={styles.pathDesc}>
            Defend humanity. Stronger wards. Towns trust you.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pathButton, styles.demonEater]}
          onPress={chooseDemonEater}
          activeOpacity={0.8}
        >
          <Text style={styles.pathEmoji}>👹</Text>
          <Text style={styles.pathTitle}>Demon-Eater</Text>
          <Text style={styles.pathDesc}>
            Consume their power. Wards burn you. Fear follows.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pathButton, styles.neutral]}
          onPress={chooseNeutral}
          activeOpacity={0.8}
        >
          <Text style={styles.pathEmoji}>⚖️</Text>
          <Text style={styles.pathTitle}>Walk the Edge</Text>
          <Text style={styles.pathDesc}>
            Let your actions decide. Nothing is permanent.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  lore: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  pathButton: {
    minHeight: MIN_TAP_SIZE * 2,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
  },
  wardBearer: {
    backgroundColor: 'rgba(74, 111, 165, 0.3)',
    borderColor: COLORS.wardBlue,
  },
  demonEater: {
    backgroundColor: 'rgba(74, 44, 106, 0.4)',
    borderColor: COLORS.demonPurple,
  },
  neutral: {
    backgroundColor: 'rgba(45, 90, 39, 0.2)',
    borderColor: COLORS.safe,
  },
  pathEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  pathTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  pathDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
});
