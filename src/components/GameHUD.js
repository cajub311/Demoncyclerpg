/**
 * GameHUD.js - Day count, phase, sunset timer bar, inventory
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PhaseIndicator } from './PhaseIndicator';
import { getSunsetDangerProgress } from '../systems/DayNightEngine';
import { COLORS } from '../systems/GameEngine';

export function GameHUD({ phase, minute, day, inventory }) {
  const inv = inventory || {};
  const sunsetProgress = getSunsetDangerProgress(minute);
  const barColor = sunsetProgress < 0.5
    ? COLORS.wardBlue
    : sunsetProgress < 0.8
      ? '#b8860b'
      : COLORS.danger;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <PhaseIndicator phase={phase} minute={minute} day={day} />
        <View style={styles.rightColumn}>
          {/* Sunset timer bar - turns red as night approaches */}
          <View style={styles.sunsetBarContainer}>
            <View style={styles.sunsetBarBg}>
              <View
                style={[
                  styles.sunsetBarFill,
                  {
                    width: `${sunsetProgress * 100}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.sunsetLabel}>
              {sunsetProgress >= 1 ? 'NIGHT' : 'SUNSET'}
            </Text>
          </View>
          <View style={styles.inventoryRow}>
            <InventoryItem icon="🍞" value={inv.food ?? 0} />
            <InventoryItem icon="💧" value={inv.water ?? 0} />
            <InventoryItem icon="◇" value={inv.ward_stone ?? 0} />
            <InventoryItem icon="🌿" value={inv.healing_herbs ?? 0} />
          </View>
        </View>
      </View>
    </View>
  );
}

function InventoryItem({ icon, value }) {
  return (
    <View style={styles.invItem}>
      <Text style={styles.invIcon}>{icon}</Text>
      <Text style={styles.invValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 48,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    marginLeft: 12,
  },
  sunsetBarContainer: {
    marginBottom: 8,
  },
  sunsetBarBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sunsetBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sunsetLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  inventoryRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 12,
  },
  invItem: {
    alignItems: 'center',
    minWidth: 44,
  },
  invIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  invValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
});
