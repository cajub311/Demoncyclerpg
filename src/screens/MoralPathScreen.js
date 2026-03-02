/**
 * MoralPathScreen.js - First-launch moral path selection
 * Dramatic, dark, with full consequences of each path
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dark atmospheric header */}
        <View style={styles.header}>
          <Text style={styles.title}>THE DEMON CYCLE</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Humanity hangs by a thread</Text>
          <Text style={styles.lore}>
            Every night the Corelings rise. Wards are all that stand between
            humanity and extinction. But some have learned a darker path—to
            consume the demons' power. Your choice here sets your course.
            {'\n\n'}
            Nothing is permanent. Your actions will shift the balance.
          </Text>
        </View>

        {/* Ward-Bearer - full consequences */}
        <TouchableOpacity
          style={[styles.pathButton, styles.wardBearer]}
          onPress={chooseWardBearer}
          activeOpacity={0.85}
        >
          <Text style={styles.pathSymbol}>◇</Text>
          <Text style={styles.pathTitle}>Ward-Bearer</Text>
          <Text style={styles.pathTagline}>Defend. Protect. Endure.</Text>
          <Text style={styles.pathDesc}>
            Wards grow stronger in your presence. Towns welcome you. Leesha
            and Rojer fight at your side. You stand with humanity against the
            night.
          </Text>
          <Text style={styles.pathConsequence}>
            + Stronger wards, longer lasting
          </Text>
          <Text style={styles.pathConsequence}>
            + Towns trust and respect you
          </Text>
        </TouchableOpacity>

        {/* Demon-Eater - full consequences */}
        <TouchableOpacity
          style={[styles.pathButton, styles.demonEater]}
          onPress={chooseDemonEater}
          activeOpacity={0.85}
        >
          <Text style={styles.pathSymbol}>◆</Text>
          <Text style={styles.pathTitle}>Demon-Eater</Text>
          <Text style={styles.pathTagline}>Consume. Corrupt. Dominate.</Text>
          <Text style={styles.pathDesc}>
            Demon flesh grants overwhelming power. Corelings hesitate around
            you. But wards burn your skin at night. Towns fear you. Leesha
            will refuse to heal you as corruption deepens.
          </Text>
          <Text style={styles.pathConsequenceDanger}>
            − Wards damage you at night
          </Text>
          <Text style={styles.pathConsequenceDanger}>
            − Towns grow fearful, Leesha turns away
          </Text>
        </TouchableOpacity>

        {/* Walk the Edge */}
        <TouchableOpacity
          style={[styles.pathButton, styles.neutral]}
          onPress={chooseNeutral}
          activeOpacity={0.85}
        >
          <Text style={styles.pathSymbol}>◈</Text>
          <Text style={styles.pathTitle}>Walk the Edge</Text>
          <Text style={styles.pathTagline}>Let fate decide.</Text>
          <Text style={styles.pathDesc}>
            Commit to nothing. Your actions—every choice, every deed—will
            push you toward light or darkness. The path is yours to forge.
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 32,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 4,
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: COLORS.bloodRed,
    alignSelf: 'center',
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.bloodRed,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 16,
  },
  lore: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  pathButton: {
    minHeight: MIN_TAP_SIZE * 2.5,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  wardBearer: {
    borderColor: COLORS.wardBlue,
    backgroundColor: 'rgba(74, 111, 165, 0.15)',
  },
  demonEater: {
    borderColor: COLORS.demonPurple,
    backgroundColor: 'rgba(74, 44, 106, 0.25)',
  },
  neutral: {
    borderColor: COLORS.textMuted,
    backgroundColor: 'rgba(60, 60, 70, 0.2)',
  },
  pathSymbol: {
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 6,
  },
  pathTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  pathTagline: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  pathDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 8,
  },
  pathConsequence: {
    fontSize: 12,
    color: COLORS.safe,
    marginTop: 4,
  },
  pathConsequenceDanger: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});
