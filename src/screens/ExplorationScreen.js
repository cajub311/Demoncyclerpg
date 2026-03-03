/**
 * ExplorationScreen.js - Phase 1 deliverable: tile map overworld + town
 * Walk around Tibbet's Brook, enter buildings, talk to NPCs
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import { TileMap, TILE_SIZE } from '../components/TileMap';
import { PlayerSprite } from '../components/PlayerSprite';
import { NPCSprite } from '../components/NPCSprite';
import { DPad } from '../components/DPad';
import { DialogueBox } from '../components/DialogueBox';
import { useExploration } from '../hooks/useExploration';
import { useGame } from '../context/GameContext';
import { COLORS } from '../systems/GameEngine';

export function ExplorationScreen({ onEnterWorld, onCombat }) {
  const { state } = useGame();
  const {
    mapData,
    playerX,
    playerY,
    facing,
    npcDialogue,
    onDirection,
    interact,
    closeDialogue,
  } = useExploration();

  return (
    <SafeAreaView style={styles.container}>
      <TileMap mapData={mapData} playerX={playerX} playerY={playerY}>
        <PlayerSprite x={playerX} y={playerY} facing={facing} />
        {(mapData.npcs || []).map((npc) => (
          <NPCSprite key={npc.id} npc={npc} />
        ))}
      </TileMap>

      {npcDialogue && (
        <DialogueBox npc={npcDialogue} onClose={closeDialogue} />
      )}

      {/* Bottom UI: D-pad left, Action buttons right */}
      <View style={styles.uiBar}>
        <DPad onDirection={onDirection} />
        <View style={styles.rightButtons}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={interact}
            activeOpacity={0.8}
          >
            <Text style={styles.actionText}>A</Text>
            <Text style={styles.actionLabel}>Interact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.menuBtn]}
            onPress={onEnterWorld}
            activeOpacity={0.8}
          >
            <Text style={styles.actionText}>≡</Text>
            <Text style={styles.actionLabel}>Menu</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HP bar - top */}
      <View style={styles.hpBar}>
        <Text style={styles.hpLabel}>HP</Text>
        <View style={styles.hpBg}>
          <View
            style={[
              styles.hpFill,
              {
                width: `${((state.characterHp?.[state.activeCharacter] ?? 100) / 100) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  uiBar: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(74, 111, 165, 0.9)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6b8fc9',
  },
  menuBtn: {
    backgroundColor: 'rgba(50, 50, 70, 0.9)',
    borderColor: COLORS.textMuted,
  },
  actionText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  actionLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  hpBar: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hpLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    width: 24,
  },
  hpBg: {
    flex: 1,
    height: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    backgroundColor: COLORS.danger,
    borderRadius: 6,
  },
});
