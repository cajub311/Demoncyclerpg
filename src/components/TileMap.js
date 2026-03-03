/**
 * TileMap.js - 32×32 tile renderer for overworld and town
 * Zelda/Pokémon-style top-down grid
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../systems/GameEngine';

const TILE_SIZE = 32;

// Tile types: 0=grass, 1=wall, 2=building, 3=door/entrance
const TILE_COLORS = {
  0: '#2d3a1f', // grass
  1: '#1a1510', // wall/border
  2: '#3d2e1a', // building
  3: '#4a3f35', // door
};

export function TileMap({ mapData, playerX, playerY, children }) {
  const { width, height, tiles } = mapData;
  const mapWidth = width * TILE_SIZE;
  const mapHeight = height * TILE_SIZE;

  const screenW = Dimensions.get('window').width;
  const screenH = Dimensions.get('window').height;
  const camX = Math.max(0, Math.min(playerX * TILE_SIZE - screenW / 2 + TILE_SIZE / 2, mapWidth - screenW));
  const camY = Math.max(0, Math.min(playerY * TILE_SIZE - screenH / 2 + TILE_SIZE / 2, mapHeight - screenH));

  const rows = tiles.map((row, y) => (
    <View key={y} style={styles.row}>
      {row.map((tile, x) => (
        <View
          key={`${x}-${y}`}
          style={[
            styles.tile,
            { backgroundColor: TILE_COLORS[tile] ?? TILE_COLORS[0] },
            tile === 3 && styles.tileDoor,
          ]}
        />
      ))}
    </View>
  ));

  return (
    <View style={[styles.viewport, { width: screenW, height: screenH }]}>
      <View style={[styles.mapLayer, { width: mapWidth, height: mapHeight, left: -camX, top: -camY }]}>
        {rows}
      </View>
      <View style={[styles.overlay, { width: mapWidth, height: mapHeight, left: -camX, top: -camY }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    overflow: 'hidden',
  },
  mapLayer: {
    position: 'absolute',
    flexDirection: 'column',
  },
  overlay: {
    position: 'absolute',
    flexDirection: 'column',
    pointerEvents: 'box-none',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  tileDoor: {
    borderColor: COLORS.wardBlue,
    borderWidth: 1,
  },
});

export { TILE_SIZE };
