/**
 * WorldScreen.js - Main game world: sky, ground, phase, party, HUD, corelings
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useGame } from '../context/GameContext';
import { PhaseIndicator } from '../components/PhaseIndicator';
import { PartyBar } from '../components/PartyBar';
import { GameHUD } from '../components/GameHUD';
import { Coreling } from '../components/Coreling';
import { EchoButton } from '../components/EchoButton';
import { PHASES } from '../systems/GameEngine';

export function WorldScreen() {
  const {
    state,
    skyColorHex,
    setActiveCharacter,
    attackCoreling,
    useEcho,
  } = useGame();

  const { phase, gameMinute, gameDay, corelings, activeCharacter, inventory, echoCharges, characterHp } = state;
  const isNight = phase === PHASES.NIGHT;
  const currentHp = characterHp?.[activeCharacter] ?? 100;
  const isDead = currentHp <= 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: skyColorHex }]}>
      {/* Sky gradient effect via background */}
      <View style={[styles.ground, isNight && styles.groundNight]} />

      {/* Corelings (night only) - tap to attack */}
      {isNight &&
        corelings.map((c) => (
          <Coreling
            key={c.id}
            coreling={c}
            onTap={(id) => attackCoreling(id, 15)}
          />
        ))}

      {/* HUD */}
      <GameHUD
        phase={phase}
        minute={gameMinute}
        day={gameDay}
        inventory={inventory}
      />

      {/* Phase label when night */}
      {isNight && (
        <View style={styles.nightOverlay}>
          <Text style={styles.nightText}>SURVIVE THE NIGHT</Text>
          <Text style={styles.nightHint}>Tap Corelings to attack</Text>
        </View>
      )}

      {/* Warded Echo - when dead or emergency at night */}
      <EchoButton
        echoCharges={echoCharges}
        onUse={useEcho}
        showWhenDead={isDead}
      />

      {/* Party bar */}
      <PartyBar
        activeCharacter={activeCharacter}
        onSelectCharacter={setActiveCharacter}
        partyMembers={state.partyMembers}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#1a1510',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  groundNight: {
    backgroundColor: '#0d0a08',
  },
  nightOverlay: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.9,
  },
  nightText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#c41e3a',
    letterSpacing: 2,
  },
  nightHint: {
    fontSize: 14,
    color: '#8b8685',
    marginTop: 8,
  },
});
