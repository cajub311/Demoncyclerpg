/**
 * GroundLayer.js - Warded town, fence posts with glowing wards, grass/dirt texture
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../systems/GameEngine';

// Ward symbol - simplified geometric ward shape (triangle/circle combo)
const WARD_SYMBOL = '◇';

export function GroundLayer({ isNight }) {
  return (
    <View style={[styles.container, isNight && styles.containerNight]}>
      {/* Grass/dirt texture - layered strips */}
      <View style={styles.grassStrip} />
      <View style={[styles.grassStrip, styles.grassStrip2]} />
      <View style={[styles.grassStrip, styles.grassStrip3]} />
      <View style={styles.dirtPatch} />

      {/* Warded town in background */}
      <View style={[styles.townSilhouette, isNight && styles.townNight]}>
        <View style={styles.townBuilding1} />
        <View style={styles.townBuilding2} />
        <View style={styles.townBuilding3} />
        <View style={styles.townTower} />
        {/* Glowing ward lights in windows */}
        <View style={[styles.wardLight, styles.wardLight1]} />
        <View style={[styles.wardLight, styles.wardLight2]} />
        <View style={[styles.wardLight, styles.wardLight3]} />
      </View>

      {/* Fence posts with ward symbols */}
      <View style={styles.fenceRow}>
        <FencePost isNight={isNight} />
        <FencePost isNight={isNight} />
        <FencePost isNight={isNight} />
        <FencePost isNight={isNight} />
        <FencePost isNight={isNight} />
      </View>

      {/* Ground texture overlay */}
      <View style={[styles.textureOverlay, isNight && styles.textureNight]} />
    </View>
  );
}

function FencePost({ isNight }) {
  return (
    <View style={[styles.fencePost, isNight && styles.fencePostNight]}>
      <View style={[styles.wardSymbol, isNight && styles.wardSymbolGlow]}>
        <Text style={[styles.wardText, isNight && styles.wardTextGlow]}>{WARD_SYMBOL}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#1a1510',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  containerNight: {
    backgroundColor: '#0f0d0a',
  },
  grassStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#2d3a1f',
    opacity: 0.8,
  },
  grassStrip2: {
    top: 20,
    backgroundColor: '#252f18',
    opacity: 0.6,
  },
  grassStrip3: {
    top: 40,
    backgroundColor: '#1e2812',
    opacity: 0.5,
  },
  dirtPatch: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: '30%',
    backgroundColor: '#3d2e1a',
    borderRadius: 20,
    opacity: 0.7,
  },
  townSilhouette: {
    position: 'absolute',
    bottom: '25%',
    left: '15%',
    right: '15%',
    height: '45%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  townNight: {
    opacity: 0.9,
  },
  townBuilding1: {
    width: 50,
    height: 70,
    backgroundColor: '#2a2520',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  townBuilding2: {
    width: 60,
    height: 90,
    backgroundColor: '#1f1a15',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  townBuilding3: {
    width: 45,
    height: 55,
    backgroundColor: '#352e28',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  townTower: {
    width: 35,
    height: 110,
    backgroundColor: '#1a1510',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  wardLight: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.wardBlue,
    opacity: 0.9,
  },
  wardLight1: {
    left: '22%',
    bottom: 45,
  },
  wardLight2: {
    left: '48%',
    bottom: 65,
  },
  wardLight3: {
    left: '68%',
    bottom: 35,
  },
  fenceRow: {
    position: 'absolute',
    bottom: '8%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  fencePost: {
    width: 16,
    height: 50,
    backgroundColor: '#4a3f35',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  fencePostNight: {
    backgroundColor: '#2a2520',
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.3)',
  },
  wardSymbol: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 111, 165, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wardSymbolGlow: {
    backgroundColor: 'rgba(74, 111, 165, 0.6)',
    shadowColor: COLORS.wardBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
  wardText: {
    fontSize: 14,
    color: COLORS.wardBlue,
    fontWeight: '700',
  },
  wardTextGlow: {
    color: '#7ba3d4',
  },
  textureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.15,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  textureNight: {
    backgroundColor: '#0a0805',
    opacity: 0.2,
  },
});
