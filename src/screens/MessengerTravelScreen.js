/**
 * MessengerTravelScreen.js - Travel between towns as Messenger
 * Cannot travel at night - must reach safety before sunset
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TOWN_DATA } from '../data/towns';
import { TOWNS } from '../systems/GameEngine';
import { canTravel } from '../systems/DayNightEngine';
import { COLORS } from '../systems/GameEngine';

export function MessengerTravelScreen({
  currentTown,
  phase,
  onSelectDestination,
  onBack,
}) {
  const travelAllowed = canTravel(phase);
  const towns = Object.values(TOWNS).filter((t) => t.unlocked && t.id !== currentTown);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Messenger Travel</Text>
      <Text style={styles.subtitle}>
        {travelAllowed
          ? 'Daylight is your window. Choose a destination.'
          : 'Too dangerous. Wait for dawn.'}
      </Text>

      {!travelAllowed && (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            Corelings rise at dusk. You cannot travel at night.
          </Text>
        </View>
      )}

      <View style={styles.townList}>
        {towns.map((town) => (
          <TouchableOpacity
            key={town.id}
            style={[
              styles.townCard,
              !travelAllowed && styles.townCardDisabled,
            ]}
            onPress={() => travelAllowed && onSelectDestination(town.id)}
            disabled={!travelAllowed}
            activeOpacity={0.8}
          >
            <Text style={styles.townName}>{town.name}</Text>
            <Text style={styles.townStats}>
              Wards: {town.wardStrength}% • Pop: {town.population}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  warning: {
    backgroundColor: 'rgba(196, 30, 58, 0.2)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '600',
  },
  townList: {
    gap: 12,
    marginBottom: 24,
  },
  townCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.wardBlue,
    minHeight: 48,
  },
  townCardDisabled: {
    opacity: 0.5,
    borderColor: COLORS.textMuted,
  },
  townName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  townStats: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  backButton: {
    minHeight: 48,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
});
