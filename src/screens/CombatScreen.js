/**
 * Demon Cycle RPG - Combat Screen
 * ATB turn-based battle UI
 * Screens: enemy sprites (top), party status (middle), action menu (bottom)
 * Mobile-first: all tap targets 44px+
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView,
} from 'react-native';
import { COLORS } from '../systems/GameEngine';
import {
    COMBAT_STATUS, ATB_TICK_INTERVAL_MS, ATB_MAX,
    tickAtb, processStatusEffects, applyStatus,
    calcPhysicalDamage, calcWardDamage,
    getEnemyAction, attemptFlee,
    checkCombatEnd, buildVictorySummary, initCombat,
    addWardCharge, canUseGrandWard, consumeWardCharge,
} from '../systems/CombatEngine';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const MENU = { ROOT: 'root', FIGHT: 'fight', WARD: 'ward', ITEM: 'item' };

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function AtbBar({ value, max = ATB_MAX, color = '#FFD700' }) {
    const pct = Math.min(1, (value || 0) / max);
    return (
          <View style={styles.atbTrack}>
      <View style={[styles.atbFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    );
}

function HpBar({ value, max, color = '#22CC44' }) {
    const pct = Math.min(1, Math.max(0, (value || 0) / (max || 1)));
    const barColor = pct > 0.5 ? '#22CC44' : pct > 0.25 ? '#FFB300' : '#FF3333';
    return (
          <View style={styles.hpTrack}>
      <View style={[styles.hpFill, { width: `${pct * 100}%`, backgroundColor: barColor }]} />
      </View>
    );
}

function WardChargeBar({ value, max = 100 }) {
    const pct = Math.min(1, (value || 0) / max);
    const ready = pct >= 1;
    return (
          <View style={[styles.wardTrack, ready && styles.wardTrackReady]}>
            <View style={[styles.wardFill, { width: `${pct * 100}%` }, ready && styles.wardFillReady]} />
      </View>
    );
}

function StatusBadges({ effects = [] }) {
    if (effects.length === 0) return null;
    return (
          <View style={styles.statusRow}>
    {effects.map((e, i) => (
              <View key={i} style={[styles.statusBadge, { backgroundColor: e.color || '#666' }]}>
                <Text style={styles.statusBadgeText}>{e.name?.slice(0, 3).toUpperCase()}</Text>
                 </View>
                       ))}
</View>
  );
}

function CombatantTile({ combatant, isActive, isEnemy }) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
        if (isActive) {
                Animated.loop(
                          Animated.sequence([
                                      Animated.timing(pulseAnim, { toValue: 1.08, duration: 400, useNativeDriver: true }),
                                      Animated.timing(pulseAnim, { toValue: 1.0,  duration: 400, useNativeDriver: true }),
                                    ])
                        ).start();
        } else {
                pulseAnim.setValue(1);
        }
        return () => pulseAnim.stopAnimation();
  }, [isActive]);

  const isDead = combatant.hp <= 0;

  return (
        <Animated.View style={[
          styles.combatantTile,
          isEnemy && styles.enemyTile,
          isActive && styles.activeTile,
          isDead && styles.deadTile,
  { transform: [{ scale: pulseAnim }] },
        ]}>
  {/* Sprite placeholder */}
          <View style={[styles.spritePlaceholder, isDead && styles.spriteDead]}>
            <Text style={styles.spriteEmoji}>{isEnemy ? '👹' : '⚔️'}</Text>
  </View>
      <Text style={styles.combatantName} numberOfLines={1}>{combatant.name}</Text>
      <HpBar value={combatant.hp} max={combatant.maxHp} />
      <Text style={styles.hpText}>{combatant.hp}/{combatant.maxHp}</Text>
{!isEnemy && <AtbBar value={combatant.atb} />}
{!isEnemy && <WardChargeBar value={combatant.wardCharge} />}
      <StatusBadges effects={combatant.statusEffects || []} />
  </Animated.View>
  );
}

function CombatLog({ entries }) {
    return (
          <ScrollView style={styles.logContainer} showsVerticalScrollIndicator={false}>
{entries.slice(-6).map((entry, i) => (
          <Text key={i} style={[styles.logEntry, entry.type === 'damage' && styles.logDamage,
                      entry.type === 'heal' && styles.logHeal, entry.type === 'system' && styles.logSystem]}>
  {entry.message}
  </Text>
                             ))}
</ScrollView>
  );
}

function ActionMenu({ activeCharacter, wards, items, onAction, onFlee, disabled }) {
    const [menu, setMenu] = useState(MENU.ROOT);
    const [selectedWard, setSelectedWard] = useState(null);

  if (disabled) {
        return (
                <View style={styles.actionPanel}>
                  <Text style={styles.waitingText}>⏳ Waiting for ATB...</Text>
          </View>
        );
  }

  if (menu === MENU.ROOT) {
        return (
                <View style={styles.actionPanel}>
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setMenu(MENU.FIGHT)} activeOpacity={0.8}>
                      <Text style={styles.actionBtnText}>⚔️ FIGHT</Text>
          </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setMenu(MENU.WARD)} activeOpacity={0.8}>
                      <Text style={styles.actionBtnText}>🔮 WARD</Text>
          </TouchableOpacity>
          </View>
            <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setMenu(MENU.ITEM)} activeOpacity={0.8}>
                      <Text style={styles.actionBtnText}>🎒 ITEM</Text>
          </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.fleeBtn]} onPress={onFlee} activeOpacity={0.8}>
                      <Text style={styles.actionBtnText}>💨 FLEE</Text>
          </TouchableOpacity>
          </View>
    {canUseGrandWard(activeCharacter) && (
                <TouchableOpacity
                 style={[styles.actionBtn, styles.grandWardBtn]}
                 onPress={() => onAction({ type: 'grand_ward', actorId: activeCharacter.id })}
                 activeOpacity={0.8}
               >
                               <Text style={styles.grandWardText}>✨ GRAND WARD — {activeCharacter.name.toUpperCase()}</Text>
                   </TouchableOpacity>
             )}
</View>
                       );
}

  if (menu === MENU.FIGHT) {
        const skills = activeCharacter.skills || [];
        return (
                <View style={styles.actionPanel}>
        <Text style={styles.subMenuTitle}>⚔️ FIGHT — {activeCharacter.name}</Text>
            <TouchableOpacity style={styles.subMenuBtn}
          onPress={() => { onAction({ type: 'attack', actorId: activeCharacter.id }); setMenu(MENU.ROOT); }}
          activeOpacity={0.8}>
                      <Text style={styles.subMenuBtnText}>Attack</Text>
          <Text style={styles.subMenuBtnSub}>Basic physical strike</Text>
            </TouchableOpacity>
{skills.map(skill => (
            <TouchableOpacity key={skill.id} style={styles.subMenuBtn}
            onPress={() => { onAction({ type: 'skill', actorId: activeCharacter.id, skillId: skill.id }); setMenu(MENU.ROOT); }}
            activeOpacity={0.8}>
                          <Text style={styles.subMenuBtnText}>{skill.name}</Text>
            <Text style={styles.subMenuBtnSub}>MP: {skill.mp_cost}</Text>
              </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.backBtn} onPress={() => setMenu(MENU.ROOT)} activeOpacity={0.8}>
                    <Text style={styles.backBtnText}>◀ Back</Text>
          </TouchableOpacity>
          </View>
    );
}

  if (menu === MENU.WARD) {
        const learnedWards = Object.entries(wards || {})
          .filter(([, v]) => v.learned)
          .map(([id, v]) => ({ id, ...v }));
        return (
                <View style={styles.actionPanel}>
        <Text style={styles.subMenuTitle}>🔮 WARD — {activeCharacter.name}</Text>
            <ScrollView style={{ maxHeight: 160 }}>
{learnedWards.length === 0 && (
              <Text style={styles.emptyText}>No wards learned yet.</Text>
           )}
{learnedWards.map(ward => (
              <TouchableOpacity key={ward.id} style={styles.subMenuBtn}
              onPress={() => { onAction({ type: 'ward', actorId: activeCharacter.id, wardId: ward.id, mastery: ward.mastery }); setMenu(MENU.ROOT); }}
              activeOpacity={0.8}>
                              <Text style={styles.subMenuBtnText}>{ward.name || ward.id}</Text>
              <Text style={styles.subMenuBtnSub}>Mastery: {ward.mastery} | MP: ~</Text>
                </TouchableOpacity>
          ))}
            </ScrollView>
        <TouchableOpacity style={styles.backBtn} onPress={() => setMenu(MENU.ROOT)} activeOpacity={0.8}>
                      <Text style={styles.backBtnText}>◀ Back</Text>
            </TouchableOpacity>
            </View>
    );
}

  if (menu === MENU.ITEM) {
        const usableItems = (items || []).filter(slot => slot && slot.item_id);
        return (
                <View style={styles.actionPanel}>
        <Text style={styles.subMenuTitle}>🎒 ITEM — {activeCharacter.name}</Text>
    {usableItems.length === 0 && <Text style={styles.emptyText}>No items available.</Text>}
     {usableItems.map((slot, i) => (
                 <TouchableOpacity key={i} style={styles.subMenuBtn}
                                  onPress={() => { onAction({ type: 'item', actorId: activeCharacter.id, itemSlot: i }); setMenu(MENU.ROOT); }}
                  activeOpacity={0.8}>
                                <Text style={styles.subMenuBtnText}>{slot.item_id}</Text>
                  <Text style={styles.subMenuBtnSub}>x{slot.quantity}</Text>
                    </TouchableOpacity>
              ))}
             <TouchableOpacity style={styles.backBtn} onPress={() => setMenu(MENU.ROOT)} activeOpacity={0.8}>
                <Text style={styles.backBtnText}>◀ Back</Text>
      </TouchableOpacity>
      </View>
        );
  }

  return null;
}

// ─── MAIN COMBAT SCREEN ───────────────────────────────────────────────────────

export function CombatScreen({
    party,
    enemies: initialEnemies,
    wards = {},
    items = [],
    isBoss = false,
    onVictory,
    onDefeat,
    onFled,
}) {
    const [combat, setCombat] = useState(() => initCombat(party, initialEnemies, isBoss));
    const [activeActorId, setActiveActorId] = useState(null);
    const [combatLog, setCombatLog] = useState([
      { type: 'system', message: '⚔️ A battle begins! Corelings rise from the dark!' },
        ]);
    const [waitingForPlayer, setWaitingForPlayer] = useState(false);
    const [result, setResult] = useState(null);
    const tickRef = useRef(null);

  const addLog = useCallback((entries) => {
        setCombatLog(prev => [...prev, ...(Array.isArray(entries) ? entries : [entries])]);
  }, []);

  // ─── ATB TICKER ────────────────────────────────────────────────────────────
  useEffect(() => {
        if (waitingForPlayer || result) return;

                tickRef.current = setInterval(() => {
                        setCombat(prev => {
                                  const allCombatants = [...prev.partyMembers, ...prev.enemies];
                                  const { combatants: ticked, readyId } = tickAtb(allCombatants);

                                          const newParty   = ticked.filter(c => c.isParty);
                                  const newEnemies = ticked.filter(c => !c.isParty);

                                          if (readyId) {
                                                      clearInterval(tickRef.current);
                                                      const actor = ticked.find(c => c.id === readyId);

                                    if (actor.isParty) {
                                                  // Player's turn — pause ATB and show action menu
                                                        setActiveActorId(readyId);
                                                  setWaitingForPlayer(true);
                                    } else {
                                                  // Enemy turn — run AI
                                                        setTimeout(() => handleEnemyTurn(actor, newParty, newEnemies), 400);
                                    }

                                    return {
                                                  ...prev,
                                                  partyMembers: newParty.map(p => p.id === readyId ? { ...p, acted: true } : p),
                                                  enemies: newEnemies.map(e => e.id === readyId ? { ...e, acted: true } : e),
                                    };
                                          }

                                          // Reset acted flags when all have acted
                                          const allActed = ticked.filter(c => c.hp > 0).every(c => c.acted);
                                  if (allActed) {
                                              return {
                                                            ...prev,
                                                            partyMembers: newParty.map(p => ({ ...p, acted: false, atb: 0 })),
                                                            enemies: newEnemies.map(e => ({ ...e, acted: false, atb: 0 })),
                                                            turn: prev.turn + 1,
                                              };
                                  }

                                          return { ...prev, partyMembers: newParty, enemies: newEnemies };
                        });
                }, ATB_TICK_INTERVAL_MS);

                return () => clearInterval(tickRef.current);
  }, [waitingForPlayer, result]);

  // ─── ENEMY TURN HANDLER ────────────────────────────────────────────────────
  const handleEnemyTurn = useCallback((enemy, currentParty, currentEnemies) => {
        const aliveParty = currentParty.filter(p => p.hp > 0);
        const action = getEnemyAction(enemy, aliveParty);
        if (!action) { setWaitingForPlayer(false); return; }

                                          const target = aliveParty.find(p => p.id === action.targetId) || aliveParty[0];

                                          setCombat(prev => {
                                                  let newParty = [...prev.partyMembers];
                                                  const logEntries = [];

                                                          if (action.action === 'attack' || action.action === 'ability') {
                                                                    const dmgResult = calcPhysicalDamage(
                                                                      { stats: { STR: enemy.stats.attack || 10 } },
                                                                      { stats: { defense: target.stats?.FOR || 5 } },
                                                                                action.abilityData?.damage ? (action.abilityData.damage / (enemy.stats.attack || 1)) : 1.0
                                                                              );

                                                    newParty = newParty.map(p => {
                                                                if (p.id !== target.id) return p;
                                                                const newHp = Math.max(0, p.hp - dmgResult.damage);
                                                                const updated = addWardCharge({ ...p, hp: newHp }, Math.floor(dmgResult.damage * 0.3));
                                                                return updated;
                                                    });

                                                    logEntries.push({
                                                                type: 'damage',
                                                                message: `${enemy.name} attacks ${target.name} for ${dmgResult.damage} damage${dmgResult.isCrit ? ' (CRIT!)' : ''}!`,
                                                    });

                                                    // Apply status from ability
                                                    if (action.abilityData?.effect && action.abilityData.effect !== 'explode') {
                                                                newParty = newParty.map(p => {
                                                                              if (p.id !== target.id) return p;
                                                                              return applyStatus(p, action.abilityData.effect);
                                                                });
                                                                logEntries.push({ type: 'system', message: `${target.name} is afflicted with ${action.abilityData.effect}!` });
                                                    }
                                                          }

                                                          addLog(logEntries);

                                                          const newState = { ...prev, partyMembers: newParty };
                                                  const endResult = checkCombatEnd(newState);

                                                          if (endResult === COMBAT_STATUS.VICTORY) {
                                                                    const summary = buildVictorySummary(newState, party[0]?.level || 1);
                                                                    setResult({ type: 'victory', summary });
                                                                    onVictory?.(summary);
                                                                    return { ...newState, status: COMBAT_STATUS.VICTORY };
                                                          }
                                                  if (endResult === COMBAT_STATUS.DEFEAT) {
                                                            setResult({ type: 'defeat' });
                                                            onDefeat?.();
                                                            return { ...newState, status: COMBAT_STATUS.DEFEAT };
                                                  }

                                                          // Resume ATB
                                                          setTimeout(() => setWaitingForPlayer(false), 200);
                                                  return newState;
                                          });
  }, [addLog, onVictory, onDefeat, party]);

  // ─── PLAYER ACTION HANDLER ─────────────────────────────────────────────────
  const handlePlayerAction = useCallback((action) => {
        setWaitingForPlayer(false);
        setActiveActorId(null);

                                             setCombat(prev => {
                                                     const actor = prev.partyMembers.find(p => p.id === action.actorId);
                                                     if (!actor) return prev;

                                                             const aliveEnemies = prev.enemies.filter(e => e.hp > 0);
                                                     if (aliveEnemies.length === 0) return prev;

                                                             const target = aliveEnemies[0]; // TODO: enemy targeting UI
                                                             const logEntries = [];
                                                     let newParty   = [...prev.partyMembers];
                                                     let newEnemies = [...prev.enemies];

                                                             if (action.type === 'attack') {
                                                                       const dmg = calcPhysicalDamage(
                                                                         { stats: actor.base_stats || { STR: 12 } },
                                                                         { stats: { defense: target.stats?.defense || 5 } }
                                                                                 );
                                                                       newEnemies = newEnemies.map(e => e.id === target.id ? { ...e, hp: Math.max(0, e.hp - dmg.damage) } : e);
                                                                       newParty   = newParty.map(p => p.id === actor.id ? addWardCharge(p, Math.floor(dmg.damage * 0.2)) : p);
                                                                       logEntries.push({ type: 'damage', message: `${actor.name} attacks ${target.name} for ${dmg.damage}${dmg.isCrit ? ' (CRIT!)' : ''}!` });
                                                             }

                                                             if (action.type === 'ward') {
                                                                       const wardDef = wards[action.wardId];
                                                                       if (wardDef && actor.mp >= (wardDef.combat?.mp_cost || 0)) {
                                                                                   const dmg = calcWardDamage(
                                                                                     { stats: actor.base_stats || { WRD: 14 } },
                                                                                                 target,
                                                                                                 wardDef,
                                                                                                 action.mastery || 'C'
                                                                                               );
                                                                                   newEnemies = newEnemies.map(e => e.id === target.id ? { ...e, hp: Math.max(0, e.hp - dmg.damage) } : e);
                                                                                   newParty   = newParty.map(p => {
                                                                                                 if (p.id !== actor.id) return p;
                                                                                                 const mpUsed = Math.floor((wardDef.combat?.mp_cost || 8));
                                                                                                 const charged = addWardCharge({ ...p, mp: Math.max(0, p.mp - mpUsed) }, Math.floor(dmg.damage * 0.15));
                                                                                                 return charged;
                                                                                   });
                                                                                   const tag = dmg.isWeakness ? ' ⚡WEAKNESS!' : dmg.isResisted ? ' (resisted)' : '';
                                                                                   logEntries.push({ type: 'damage', message: `${actor.name} casts ${wardDef.name || action.wardId} for ${dmg.damage}${dmg.isCrit ? ' (CRIT!)' : ''}${tag}` });
                                                                                   // Apply status effect
                                                                         if (wardDef.combat?.effect && wardDef.combat.effect !== 'barrier' && wardDef.combat.effect !== 'heal') {
                                                                                       newEnemies = newEnemies.map(e => e.id === target.id ? applyStatus(e, wardDef.combat.effect) : e);
                                                                         }
                                                                       } else {
                                                                                   logEntries.push({ type: 'system', message: 'Not enough MP!' });
                                                                       }
                                                             }

                                                             if (action.type === 'grand_ward') {
                                                                       newParty = newParty.map(p => p.id === actor.id ? consumeWardCharge(p) : p);
                                                                       const totalDmg = Math.floor((actor.base_stats?.WRD || 14) * 5.0 * (0.9 + Math.random() * 0.2));
                                                                       newEnemies = newEnemies.map(e => ({ ...e, hp: Math.max(0, e.hp - Math.floor(totalDmg / aliveEnemies.length)) }));
                                                                       logEntries.push({ type: 'system', message: `✨ ${actor.name} unleashes their GRAND WARD! All enemies take ${totalDmg} total damage!` });
                                                             }

                                                             addLog(logEntries);

                                                             const newState = { ...prev, partyMembers: newParty, enemies: newEnemies };
                                                     const endResult = checkCombatEnd(newState);

                                                             if (endResult === COMBAT_STATUS.VICTORY) {
                                                                       const summary = buildVictorySummary(newState, party[0]?.level || 1);
                                                                       setResult({ type: 'victory', summary });
                                                                       onVictory?.(summary);
                                                                       return { ...newState, status: COMBAT_STATUS.VICTORY };
                                                             }

                                                             return newState;
                                             });
  }, [wards, addLog, onVictory, party]);

  // ─── FLEE HANDLER ──────────────────────────────────────────────────────────
  const handleFlee = useCallback(() => {
        const fleeResult = attemptFlee(combat.partyMembers, combat.enemies, isBoss);
        addLog({ type: 'system', message: fleeResult.message });
        if (fleeResult.success) {
                setResult({ type: 'fled' });
                setWaitingForPlayer(false);
                onFled?.();
        } else {
                setWaitingForPlayer(false);
        }
  }, [combat, isBoss, addLog, onFled]);

  // ─── RESULT OVERLAYS ───────────────────────────────────────────────────────
  if (result?.type === 'victory') {
        const { summary } = result;
        return (
                <View style={styles.resultOverlay}>
                  <Text style={styles.victoryTitle}>⚔️ VICTORY!</Text>
            <Text style={styles.resultSubtitle}>The corelings retreat before dawn.</Text>
            <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>XP Gained: <Text style={styles.resultValue}>+{summary.xp}</Text></Text>
                    <Text style={styles.resultLabel}>Loot:</Text>
    {summary.loot.map((d, i) => (
                  <Text key={i} style={styles.resultLoot}>  • {d.item} x{d.quantity}</Text>
              ))}
    </View>
          <TouchableOpacity style={styles.resultBtn} onPress={() => onVictory?.(summary)} activeOpacity={0.8}>
              <Text style={styles.resultBtnText}>Continue</Text>
    </TouchableOpacity>
    </View>
      );
}

  if (result?.type === 'defeat') {
        return (
                <View style={[styles.resultOverlay, styles.defeatOverlay]}>
                  <Text style={styles.defeatTitle}>💀 DEFEATED</Text>
            <Text style={styles.resultSubtitle}>The darkness claims you... for now.</Text>
            <Text style={styles.resultSubtitle}>The Warded Echo returns you to the last ward post.</Text>
            <TouchableOpacity style={[styles.resultBtn, styles.defeatBtn]} onPress={onDefeat} activeOpacity={0.8}>
                    <Text style={styles.resultBtnText}>Respawn</Text>
          </TouchableOpacity>
          </View>
        );
  }

  // ─── ACTIVE CHARACTER ──────────────────────────────────────────────────────
  const activeCharacter = combat.partyMembers.find(p => p.id === activeActorId);

  return (
        <View style={styles.screen}>
  {/* Enemy Zone */}
      <View style={styles.enemyZone}>
        <Text style={styles.zoneLabel}>⚡ NIGHT — WAVE {combat.turn + 1}</Text>
        <View style={styles.enemyRow}>
  {combat.enemies.map(enemy => (
                <CombatantTile key={enemy.id} combatant={enemy} isActive={false} isEnemy={true} />
              ))}
</View>
  </View>

{/* Combat Log */}
      <CombatLog entries={combatLog} />

      {/* Party Zone */}
      <View style={styles.partyZone}>
        <View style={styles.partyRow}>
      {combat.partyMembers.map(member => (
                    <CombatantTile
                                             key={member.id}
              combatant={member}
              isActive={member.id === activeActorId}
              isEnemy={false}
            />
                          ))}
                </View>
                </View>

{/* Action Menu */}
      <ActionMenu
        activeCharacter={activeCharacter}
        wards={wards}
        items={items}
        onAction={handlePlayerAction}
        onFlee={handleFlee}
        disabled={!waitingForPlayer || !activeCharacter}
      />
          </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    screen:           { flex: 1, backgroundColor: '#0A0A14' },
    zoneLabel:        { color: '#AAA', fontSize: 11, textAlign: 'center', paddingTop: 4 },
    enemyZone:        { flex: 0.35, paddingHorizontal: 8, paddingTop: 8 },
    enemyRow:         { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8 },
    partyZone:        { flex: 0.28, paddingHorizontal: 8 },
    partyRow:         { flexDirection: 'row', justifyContent: 'space-around' },
    combatantTile:    { alignItems: 'center', width: 80, padding: 4, borderRadius: 8,
                                             backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: '#333' },
    enemyTile:        { borderColor: '#550000' },
    activeTile:       { borderColor: '#FFD700', borderWidth: 2, backgroundColor: 'rgba(255,215,0,0.08)' },
    deadTile:         { opacity: 0.3 },
    spritePlaceholder:{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center',
                                             backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6 },
    spriteDead:       { opacity: 0.3 },
    spriteEmoji:      { fontSize: 26 },
    combatantName:    { color: '#DDD', fontSize: 10, marginTop: 2, textAlign: 'center', fontWeight: '600' },
    hpText:           { color: '#AAA', fontSize: 9, marginTop: 1 },
    hpTrack:          { width: '90%', height: 5, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden', marginTop: 2 },
    hpFill:           { height: '100%', borderRadius: 3 },
    atbTrack:         { width: '90%', height: 3, backgroundColor: '#222', borderRadius: 2, overflow: 'hidden', marginTop: 2 },
    atbFill:          { height: '100%', borderRadius: 2 },
    wardTrack:        { width: '90%', height: 3, backgroundColor: '#222', borderRadius: 2, overflow: 'hidden', marginTop: 1 },
    wardTrackReady:   { borderColor: '#FFD700', borderWidth: 1 },
    wardFill:         { height: '100%', backgroundColor: '#6644FF', borderRadius: 2 },
    wardFillReady:    { backgroundColor: '#FFD700' },
    statusRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 2, justifyContent: 'center' },
    statusBadge:      { borderRadius: 3, paddingHorizontal: 3, paddingVertical: 1 },
    statusBadgeText:  { fontSize: 7, color: '#FFF', fontWeight: '700' },
    logContainer:     { flex: 0.15, paddingHorizontal: 12, backgroundColor: 'rgba(0,0,0,0.4)' },
    logEntry:         { color: '#AAA', fontSize: 11, paddingVertical: 1 },
    logDamage:        { color: '#FF6644' },
    logHeal:          { color: '#44FF66' },
    logSystem:        { color: '#FFD700', fontStyle: 'italic' },
    actionPanel:      { flex: 0.22, backgroundColor: '#111122', borderTopWidth: 1, borderTopColor: '#333',
                                             padding: 8, gap: 6 },
    actionRow:        { flexDirection: 'row', gap: 8, justifyContent: 'center' },
    actionBtn:        { flex: 1, backgroundColor: '#1A1A2E', borderWidth: 1, borderColor: '#444',
                                             borderRadius: 8, padding: 14, alignItems: 'center', minHeight: 52 },
    actionBtnText:    { color: '#EEE', fontSize: 14, fontWeight: '700' },
    fleeBtn:          { borderColor: '#664422' },
    grandWardBtn:     { backgroundColor: '#1A0A2E', borderColor: '#FFD700', borderWidth: 2 },
    grandWardText:    { color: '#FFD700', fontSize: 13, fontWeight: '800', textAlign: 'center' },
    waitingText:      { color: '#555', textAlign: 'center', fontSize: 14, paddingVertical: 16 },
    subMenuTitle:     { color: '#FFD700', fontSize: 13, fontWeight: '700', marginBottom: 4 },
    subMenuBtn:       { backgroundColor: '#1A1A2E', borderWidth: 1, borderColor: '#333', borderRadius: 6,
                                             padding: 10, marginBottom: 4, minHeight: 44 },
    subMenuBtnText:   { color: '#EEE', fontSize: 13, fontWeight: '600' },
    subMenuBtnSub:    { color: '#777', fontSize: 11, marginTop: 1 },
    backBtn:          { padding: 10, alignItems: 'center' },
    backBtnText:      { color: '#888', fontSize: 13 },
    emptyText:        { color: '#555', textAlign: 'center', fontSize: 12, paddingVertical: 8 },
    resultOverlay:    { flex: 1, backgroundColor: '#0A1A0A', justifyContent: 'center', alignItems: 'center', padding: 24 },
    defeatOverlay:    { backgroundColor: '#1A0A0A' },
    victoryTitle:     { color: '#FFD700', fontSize: 32, fontWeight: '900', marginBottom: 8 },
    defeatTitle:      { color: '#FF3333', fontSize: 32, fontWeight: '900', marginBottom: 8 },
    resultSubtitle:   { color: '#AAA', fontSize: 14, textAlign: 'center', marginBottom: 16 },
    resultCard:       { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16,
                                             width: '100%', marginBottom: 20 },
    resultLabel:      { color: '#CCC', fontSize: 14, marginBottom: 4 },
    resultValue:      { color: '#FFD700', fontWeight: '700' },
    resultLoot:       { color: '#AAA', fontSize: 13 },
    resultBtn:        { backgroundColor: '#1A2A1A', borderWidth: 1, borderColor: '#44AA44',
                                             borderRadius: 10, padding: 16, width: '100%', alignItems: 'center', minHeight: 52 },
    defeatBtn:        { borderColor: '#AA4444', backgroundColor: '#2A1A1A' },
    resultBtnText:    { color: '#EEE', fontSize: 16, fontWeight: '700' },
});
