/**
 * Demon Cycle RPG - Main App
 * React Native + Expo, Android mobile first
 * Run: npx expo start --tunnel
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GameProvider, useGame } from './src/context/GameContext';
import { MoralPathScreen } from './src/screens/MoralPathScreen';
import { WorldScreen } from './src/screens/WorldScreen';
import { TownScreen } from './src/screens/TownScreen';
import { MessengerTravelScreen } from './src/screens/MessengerTravelScreen';
import { RojerMusicSystem } from './src/components/RojerMusicSystem';
import { COLORS } from './src/systems/GameEngine';

function AppContent() {
  const gameState = useGame();
  const { state, setMoralPathSeen, setMoralScore, setCurrentTown, startTravel } = gameState;

  const [screen, setScreen] = useState('world'); // world | town | travel | rojer
  const [townView, setTownView] = useState(null);

  const handleMoralPathSelect = () => {
    setMoralPathSeen();
  };

  const handleEnterTown = (townId) => {
    setTownView(townId);
    setScreen('town');
  };

  const handleTravel = (fromTownId) => {
    setScreen('travel');
  };

  const handleSelectDestination = (townId) => {
    setCurrentTown(townId);
    setTownView(townId);
    setScreen('town');
  };

  const handleLeaveTown = () => {
    setScreen('world');
    setTownView(null);
  };

  // First launch: show moral path
  if (!state.hasSeenMoralPath) {
    return (
      <MoralPathScreen
        onSelect={handleMoralPathSelect}
      />
    );
  }

  // Main app with screen routing
  return (
    <View style={styles.app}>
      <StatusBar style="light" />
      {screen === 'world' && (
        <>
          <WorldScreen />
          <View style={styles.worldActions}>
            <TouchableOpacity
              style={styles.worldButton}
              onPress={() => handleEnterTown(state.currentTown)}
              activeOpacity={0.8}
            >
              <Text style={styles.worldButtonText}>Enter Town</Text>
            </TouchableOpacity>
            {state.activeCharacter === 'rojer' && (
              <TouchableOpacity
                style={styles.worldButton}
                onPress={() => setScreen('rojer')}
                activeOpacity={0.8}
              >
                <Text style={styles.worldButtonText}>Music</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      {screen === 'town' && (
        <TownScreen
          townId={townView || state.currentTown}
          onLeave={handleLeaveTown}
          onTravel={handleTravel}
        />
      )}
      {screen === 'travel' && (
        <MessengerTravelScreen
          currentTown={townView || state.currentTown}
          phase={state.phase}
          onSelectDestination={handleSelectDestination}
          onBack={() => setScreen('town')}
        />
      )}
      {screen === 'rojer' && (
        <View style={styles.rojerScreen}>
          <RojerMusicSystem
            active={true}
            onAbilityUse={(id) => console.log('Rojer ability:', id)}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen('world')}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  worldActions: {
    position: 'absolute',
    top: 120,
    right: 12,
    zIndex: 20,
    gap: 8,
  },
  worldButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  worldButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  rojerScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 48,
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
