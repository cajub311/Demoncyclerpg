/**
 * WorldScreen.js - Main game world: sky, ground, phase, party, HUD, corelings
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useGame } from '../context/GameContext';
import { PhaseIndicator } from '../components/PhaseIndicator';
import { PartyBar } from '../components/PartyBar';
import { GameHUD } from '../components/GameHUD';
import { Coreling } from '../components/Coreling';
import { EchoButton } from '../components/EchoButton';
import { SkyAtmosphere } from '../components/SkyAtmosphere';
import { WardPlacementEffect } from '../components/WardPlacementEffect';
import { DamageNumber } from '../components/DamageNumber';
import { GroundLayer } from '../components/GroundLayer';
import { NightAtmosphere } from '../components/NightAtmosphere';
import { PHASES } from '../systems/GameEngine';

export function WorldScreen() {
  const {
    state,
    skyColorHex,
    setActiveCharacter,
    attackCoreling,
    removeCoreling,
    useEcho,
  } = useGame();

  const { phase, gameMinute, gameDay, corelings, activeCharacter, inventory, echoCharges, characterHp } = state;
  const isNight = phase === PHASES.NIGHT;
  const currentHp = characterHp?.[activeCharacter] ?? 100;
  const isDead = currentHp <= 0;

  const [wardEffects, setWardEffects] = useState([]);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [lastHitId, setLastHitId] = useState(null);

  useEffect(() => {
    if (!lastHitId) return;
    const t = setTimeout(() => setLastHitId(null), 200);
    return () => clearTimeout(t);
  }, [lastHitId]);

  const handleAttackCoreling = useCallback((id, x, y) => {
    const damage = 15;
    attackCoreling(id, damage);
    setLastHitId(id);
    setWardEffects((prev) => [...prev, { key: `w-${id}-${Date.now()}`, x, y }]);
    setDamageNumbers((prev) => [...prev, { key: `d-${id}-${Date.now()}`, damage, x, y }]);
  }, [attackCoreling]);

  const removeWardEffect = useCallback((key) => {
    setWardEffects((prev) => prev.filter((e) => e.key !== key));
  }, []);

  const removeDamageNumber = useCallback((key) => {
    setDamageNumbers((prev) => prev.filter((e) => e.key !== key));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Living sky: stars, sun, moon, clouds, fog */}
      <SkyAtmosphere
        skyColorHex={skyColorHex}
        phase={phase}
        minute={gameMinute}
      />
      <GroundLayer isNight={isNight} />

      {/* Night atmosphere - vignette, red pulse, threatening ground */}
      {isNight && <NightAtmosphere />}

      {/* Corelings (night only) - tap to attack */}
      {isNight &&
        corelings.map((c) => (
          <Coreling
            key={c.id}
            coreling={c}
            onTap={(id) => handleAttackCoreling(id, c.x, c.y)}
            isHit={lastHitId === c.id}
            onDeathComplete={removeCoreling}
          />
        ))}

      {/* Ward placement + damage number when attacking */}
      {wardEffects.map((e) => (
        <WardPlacementEffect
          key={e.key}
          x={e.x}
          y={e.y}
          onComplete={() => removeWardEffect(e.key)}
        />
      ))}
      {damageNumbers.map((e) => (
        <DamageNumber
          key={e.key}
          damage={e.damage}
          x={e.x}
          y={e.y}
          onComplete={() => removeDamageNumber(e.key)}
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
        characterHp={state.characterHp}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a12',
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
