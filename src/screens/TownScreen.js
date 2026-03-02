/**
 * TownScreen.js - Town view (Miln, Tibbet's Brook, etc.)
 * Ward strength, population, NPCs, supplies
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TOWN_DATA } from '../data/towns';
import { COLORS } from '../systems/GameEngine';

export function TownScreen({ townId, onLeave, onTravel }) {
  const town = TOWN_DATA[townId] || TOWN_DATA.miln;
  const { name, wardStrength, population, description, npcs } = town;

  const wardColor = wardStrength > 60 ? COLORS.safe : wardStrength > 30 ? '#b8860b' : COLORS.danger;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Ward Strength</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${wardStrength}%`, backgroundColor: wardColor }]} />
          </View>
          <Text style={styles.statValue}>{wardStrength}%</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Population</Text>
          <Text style={styles.statValue}>{population}</Text>
        </View>
      </View>

      {npcs && npcs.length > 0 && (
        <View style={styles.npcSection}>
          <Text style={styles.sectionTitle}>People</Text>
          {npcs.map((npc) => (
            <View key={npc.id} style={styles.npcCard}>
              <Text style={styles.npcName}>{npc.name}</Text>
              <Text style={styles.npcRole}>{npc.role}</Text>
              <Text style={styles.npcDialogue}>"{npc.dialogue}"</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.travelButton]}
          onPress={() => onTravel(townId)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Travel (Messenger)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.leaveButton]}
          onPress={onLeave}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Return to World</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  stats: {
    marginBottom: 24,
  },
  stat: {
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  barBg: {
    height: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  npcSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  npcCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.wardBlue,
  },
  npcName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  npcRole: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  npcDialogue: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  actions: {
    gap: 12,
  },
  button: {
    minHeight: 48,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelButton: {
    backgroundColor: COLORS.wardBlue,
  },
  leaveButton: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
});
