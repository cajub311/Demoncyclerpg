/**
 * Demon Cycle RPG - Main App
 * React Native + Expo, Android mobile first
 * Run: npx expo start --tunnel
 *
 * Screen routing:
 *   moral_path → world → town ↔ travel
 *                      → combat (night encounter)
 *                      → rojer  (music screen)
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GameProvider, useGame } from './src/context/GameContext';
import { MoralPathScreen }      from './src/screens/MoralPathScreen';
import { WorldScreen }          from './src/screens/WorldScreen';
import { TownScreen }           from './src/screens/TownScreen';
import { MessengerTravelScreen } from './src/screens/MessengerTravelScreen';
import { CombatScreen }         from './src/screens/CombatScreen';
import { RojerMusicSystem }     from './src/components/RojerMusicSystem';
import { COLORS }               from './src/systems/GameEngine';

// Sample enemies for demo combat — replace with zone encounter tables
const DEMO_ENEMIES = [
  {
        id: 'coreling_flame',
        name: 'Flame Demon',
        stats: { hp: 25, attack: 12, defense: 5, speed: 18, xp_reward: 15 },
        behavior: 'aggressive_ranged',
        abilities: [
          { name: 'Fire Spit', damage: 8, type: 'fire', range: 3 },
              ],
        weaknesses: ['cold', 'impact'],
        resistances: ['fire'],
        loot_table: [
          { item: 'flame_hora', chance: 0.3 },
          { item: 'ichor',      chance: 0.6 },
          { item: 'gold',       amount: [5, 15], chance: 1.0 },
              ],
  },
  ];

// Demo party — pulled from game state in full game
const DEMO_PARTY = [
  {
        id: 'arlen',
        name: 'Arlen',
        base_stats: { STR: 14, SPD: 12, WRD: 16, INT: 10, FOR: 13, CHR: 7 },
        stats: { STR: 14, SPD: 12, WRD: 16, INT: 10, FOR: 13, CHR: 7 },
        hp: 60, maxHp: 60, mp: 40, maxMp: 40,
        level: 1,
        skills: [
          { id: 'spear_strike', name: 'Spear Strike', damage_mult: 1.5, mp_cost: 4 },
              ],
  },
  {
        id: 'leesha',
        name: 'Leesha',
        base_stats: { STR: 6, SPD: 10, WRD: 12, INT: 18, FOR: 10, CHR: 14 },
        stats: { STR: 6, SPD: 10, WRD: 12, INT: 18, FOR: 10, CHR: 14 },
        hp: 38, maxHp: 38, mp: 55, maxMp: 55,
        level: 1,
        skills: [
          { id: 'salve', name: 'Healing Salve', heal_amount: 20, mp_cost: 6 },
              ],
  },
  ];

// Demo wards
const DEMO_WARDS = {
    ward_forbiddance: { learned: true, mastery: 'C', name: 'Forbiddance Ward',
                           combat: { damage: 8, damage_type: 'forbid', mp_cost: 5, effect: 'barrier',
                                                  scaling: { stat: 'WRD', multiplier: 1.2 } } },
    ward_fire: { learned: true, mastery: 'C', name: 'Fire Ward',
                    combat: { damage: 15, damage_type: 'fire', mp_cost: 8, effect: 'burn',
                                           scaling: { stat: 'WRD', multiplier: 1.5 } } },
};

// ─── APP CONTENT ──────────────────────────────────────────────────────────────

function AppContent() {
    const { state, setMoralPathSeen, setCurrentTown } = useGame();

  const [screen, setScreen]     = useState('world');
    const [townView, setTownView] = useState(null);
    const [combatData, setCombatData] = useState(null);

  // First launch: moral path selection
  if (!state.hasSeenMoralPath) {
        return <MoralPathScreen onSelect={() => setMoralPathSeen()} />;
  }

  const handleEnterTown = (townId) => {
        setTownView(townId);
        setScreen('town');
  };

  const handleLeaveTown = () => {
        setScreen('world');
        setTownView(null);
  };

  const handleTravel = () => setScreen('travel');

  const handleSelectDestination = (townId) => {
        setCurrentTown(townId);
        setTownView(townId);
        setScreen('town');
  };

  // Trigger a combat encounter (call this from night events or coreling tap)
  const handleStartCombat = (enemies = DEMO_ENEMIES, party = DEMO_PARTY) => {
        setCombatData({ enemies, party });
        setScreen('combat');
  };

  const handleCombatVictory = (summary) => {
        console.log('Victory!', summary);
        setCombatData(null);
        setScreen('world');
        // TODO: apply XP + loot to game state via GameContext
  };

  const handleCombatDefeat = () => {
        setCombatData(null);
        setScreen('world');
        // TODO: Warded Echo respawn — restore partial HP at last ward post
  };

  const handleCombatFled = () => {
        setCombatData(null);
        setScreen('world');
  };

  // ─── SCREEN ROUTER ────────────────────────────────────────────────────────

  if (screen === 'combat' && combatData) {
        return (
                <CombatScreen
            party={combatData.party}
          enemies={combatData.enemies}
        wards={DEMO_WARDS}
        items={[]}
        isBoss={false}
        onVictory={handleCombatVictory}
        onDefeat={handleCombatDefeat}
        onFled={handleCombatFled}
      />
              );
}

  if (screen === 'rojer') {
        return (
                <View style={styles.fullScreen}>
        <StatusBar style="light" />
                  <RojerMusicSystem
              active={true}
              onAbilityUse={(id) => console.log('Rojer ability:', id)}
            />
                        <TouchableOpacity style={styles.backButton} onPress={() => setScreen('world')} activeOpacity={0.8}>
                          <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                </View>
        );
  }

  if (screen === 'town') {
        return (
                <TownScreen
            townId={townView || state.currentTown}
        onLeave={handleLeaveTown}
        onTravel={handleTravel}
      />
              );
}

  if (screen === 'travel') {
        return (
                <MessengerTravelScreen
            currentTown={townView || state.currentTown}
        phase={state.phase}
        onSelectDestination={handleSelectDestination}
        onBack={() => setScreen('town')}
      />
              );
}

  // Default: World screen
  return (
        <View style={styles.app}>
      <StatusBar style="light" />
          <WorldScreen />

  {/* Overlay action buttons */}
      <View style={styles.worldActions}>
        <TouchableOpacity
          style={styles.worldButton}
          onPress={() => handleEnterTown(state.currentTown)}
          activeOpacity={0.8}
        >
                      <Text style={styles.worldButtonText}>🏘 Enter Town</Text>
            </TouchableOpacity>

{/* DEMO: launch a combat encounter */}
        <TouchableOpacity
          style={[styles.worldButton, styles.combatButton]}
          onPress={() => handleStartCombat()}
          activeOpacity={0.8}
        >
                      <Text style={styles.worldButtonText}>⚔️ Fight!</Text>
            </TouchableOpacity>

{state.activeCharacter === 'rojer' && (
            <TouchableOpacity
             style={styles.worldButton}
            onPress={() => setScreen('rojer')}
            activeOpacity={0.8}
          >
                          <Text style={styles.worldButtonText}>🎻 Music</Text>
              </TouchableOpacity>
        )}
</View>
          </View>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
    return (
          <GameProvider>
            <AppContent />
      </GameProvider>
    );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    app: {
          flex: 1,
          backgroundColor: COLORS.background,
    },
    fullScreen: {
          flex: 1,
          backgroundColor: COLORS.background,
          paddingTop: 48,
    },
    worldActions: {
          position: 'absolute',
          top: 120,
          right: 12,
          zIndex: 20,
          gap: 8,
    },
    worldButton: {
          backgroundColor: 'rgba(0,0,0,0.65)',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          minHeight: 48,
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
    },
    combatButton: {
          borderColor: 'rgba(255,80,0,0.4)',
          backgroundColor: 'rgba(80,0,0,0.65)',
    },
    worldButtonText: {
          fontSize: 14,
          fontWeight: '700',
          color: COLORS.text,
    },
    backButton: {
          padding: 16,
          alignItems: 'center',
    },
    backButtonText: {
          fontSize: 16,
          color: COLORS.textMuted,
    },
});
