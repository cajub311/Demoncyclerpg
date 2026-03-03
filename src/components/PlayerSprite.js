/**
 * PlayerSprite.js - 32×32 player with 4-directional facing
 * Pixel fantasy style
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TILE_SIZE } from './TileMap';

const FACING = { down: '▼', up: '▲', left: '◀', right: '▶' };

export function PlayerSprite({ x, y, facing = 'down' }) {
  const left = x * TILE_SIZE;
  const top = y * TILE_SIZE;

  return (
    <View style={[styles.sprite, { left, top }]} pointerEvents="none">
      <View style={styles.body}>
        <Text style={styles.face}>{FACING[facing] || FACING.down}</Text>
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
    backgroundColor: '#4a6fa5',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6b8fc9',
  },
  face: {
    fontSize: 16,
    color: '#e8e6e3',
    fontWeight: 'bold',
  },
});
