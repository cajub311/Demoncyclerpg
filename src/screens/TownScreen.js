/**
 * TownScreen.js - Town view with dark styling, glowing ward bar, game UI buttons
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TOWN_DATA } from '../data/towns';
import { COLORS } from '../systems/GameEngine';

export function TownScreen({ townId, onLeave, onTravel }) {
  const town = TOWN_DATA[townId] || TOWN_DATA.miln;
  const { name, wardStrength, population, description, npcs } = town;

  const wardColor = wardStrength > 60 ? COLORS.safe : wardStrength > 30 ? '#b8860b' : COLORS.danger;
  const wardGlows = wardStrength > 60;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.titleUnderline} />
        <Text style={styles.desc}>{description}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statLabel}>WARD STRENGTH</Text>
        <View style={[styles.barBg, wardGlows && styles.barBgGlow]}>
          <View
            style={[
              styles.barFill,
              {
                width: `${wardStrength}%`,
                backgroundColor: wardColor,
              },
              wardGlows && styles.barFillGlow,
            ]}
          />
        </View>
        <Text style={[styles.statValue, wardGlows && { color: COLORS.wardBlue }]}>
          {wardStrength}%
        </Text>

        <View style={styles.popStat}>
          <Text style={styles.statLabel}>POPULATION</Text>
          <Text style={styles.statValue}>{population}</Text>
        </View>
      </View>

      {npcs && npcs.length > 0 && (
        <View style={styles.npcSection}>
          <Text style={styles.sectionTitle}>— PEOPLE —</Text>
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
          style={styles.gameButton}
          onPress={() => onTravel(townId)}
          activeOpacity={0.85}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonIcon}>◇</Text>
            <Text style={styles.buttonText}>Travel (Messenger)</Text>
          </View>
          <View style={styles.buttonBorder} pointerEvents="none" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gameButton, styles.gameButtonSecondary]}
          onPress={onLeave}
          activeOpacity={0.85}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Return to World</Text>
          </View>
          <View style={styles.buttonBorder} pointerEvents="none" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
  },
  content: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 2,
  },
  titleUnderline: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.bloodRed,
    marginVertical: 10,
  },
  desc: {
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  stats: {
    marginBottom: 28,
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: 8,
  },
  barBg: {
    height: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barBgGlow: {
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.3)',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
  barFillGlow: {
    shadowColor: COLORS.wardBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  popStat: {
    marginTop: 16,
  },
  npcSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 16,
  },
  npcCard: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.wardBlue,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  npcName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  npcRole: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  npcDialogue: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actions: {
    gap: 16,
  },
  gameButton: {
    minHeight: 52,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.wardBlue,
    borderWidth: 2,
    borderColor: '#6b8fc9',
  },
  gameButtonSecondary: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.textMuted,
  },
  buttonInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
  },
  buttonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    margin: 2,
  },
  buttonIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1,
  },
});
