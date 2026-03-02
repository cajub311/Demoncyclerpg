/**
 * GameHUD.js - Day count, phase, inventory basics
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PhaseIndicator } from './PhaseIndicator';
import { COLORS } from '../systems/GameEngine';

export function GameHUD({ phase, minute, day, inventory }) {
  const inv = inventory || {};

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <PhaseIndicator phase={phase} minute={minute} day={day} />
        <View style={styles.inventoryRow}>
          <InventoryItem icon="🍞" value={inv.food ?? 0} label="Food" />
          <InventoryItem icon="💧" value={inv.water ?? 0} label="Water" />
          <InventoryItem icon="◇" value={inv.ward_stone ?? 0} label="Wards" />
          <InventoryItem icon="🌿" value={inv.healing_herbs ?? 0} label="Herbs" />
        </View>
      </View>
    </View>
  );
}

function InventoryItem({ icon, value, label }) {
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
