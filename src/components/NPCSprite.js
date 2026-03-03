/**
 * NPCSprite.js - 32×32 NPC on tile map
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TILE_SIZE } from './TileMap';

const FACING = { down: '▼', up: '▲', left: '◀', right: '▶' };

export function NPCSprite({ npc }) {
  const left = npc.x * TILE_SIZE;
  const top = npc.y * TILE_SIZE;

  return (
    <View style={[styles.sprite, { left, top }]} pointerEvents="none">
      <View style={styles.body}>
        <Text style={styles.face}>{FACING[npc.facing] || '▼'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sprite: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: TILE_SIZE - 4,
    height: TILE_SIZE - 4,
    backgroundColor: '#3d2e1a',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4a3f35',
  },
  face: {
    fontSize: 14,
    color: '#e8e6e3',
  },
});
