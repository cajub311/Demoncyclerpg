/**
 * PhaseIndicator.js - Shows current day/night phase
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PHASES } from '../systems/GameEngine';
import { formatTime } from '../systems/DayNightEngine';
import { COLORS } from '../systems/GameEngine';

const PHASE_LABELS = {
  [PHASES.DAWN]: 'Dawn',
  [PHASES.DAY]: 'Day',
  [PHASES.DUSK]: 'Dusk',
  [PHASES.NIGHT]: 'Night',
};

export function PhaseIndicator({ phase, minute, day }) {
  const isNight = phase === PHASES.NIGHT;
  return (
    <View style={[styles.container, isNight && styles.containerNight]}>
      <Text style={[styles.phaseText, isNight && styles.textDanger]}>
        {PHASE_LABELS[phase]}
      </Text>
      <Text style={styles.timeText}>{formatTime(minute)}</Text>
      <Text style={styles.dayText}>Day {day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    alignItems: 'center',
  },
  containerNight: {
    backgroundColor: 'rgba(139, 38, 53, 0.4)',
    borderWidth: 1,
    borderColor: COLORS.bloodRed,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  textDanger: {
    color: COLORS.danger,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  dayText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
