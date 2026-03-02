/**
 * PhaseIndicator.js - Phase, time, day counter. Pulses when night approaches.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PHASES } from '../systems/GameEngine';
import { formatTime, getSunsetDangerProgress } from '../systems/DayNightEngine';
import { COLORS } from '../systems/GameEngine';

const PHASE_LABELS = {
  [PHASES.DAWN]: 'Dawn',
  [PHASES.DAY]: 'Day',
  [PHASES.DUSK]: 'Dusk',
  [PHASES.NIGHT]: 'Night',
};

export function PhaseIndicator({ phase, minute, day }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dangerProgress = getSunsetDangerProgress(minute);
  const isNight = phase === PHASES.NIGHT;
  const isDusk = phase === PHASES.DUSK;
  const shouldPulse = dangerProgress > 0.6 || isDusk || isNight;

  useEffect(() => {
    if (!shouldPulse) {
      pulseAnim.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [shouldPulse]);

  return (
    <Animated.View
      style={[
        styles.container,
        isNight && styles.containerNight,
        isDusk && styles.containerDusk,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <Text style={[styles.dayCounter, isNight && styles.textDanger]}>
        Day {day}
      </Text>
      <Text style={[styles.phaseText, isNight && styles.textDanger]}>
        {PHASE_LABELS[phase]}
      </Text>
      <Text style={styles.timeText}>{formatTime(minute)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 90,
  },
  containerNight: {
    backgroundColor: 'rgba(139, 38, 53, 0.5)',
    borderWidth: 2,
    borderColor: COLORS.bloodRed,
  },
  containerDusk: {
    backgroundColor: 'rgba(139, 38, 53, 0.35)',
    borderWidth: 1,
    borderColor: COLORS.bloodRed,
  },
  dayCounter: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  phaseText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  textDanger: {
    color: COLORS.danger,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
