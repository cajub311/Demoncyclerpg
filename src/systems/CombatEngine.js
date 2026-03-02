/**
 * Demon Cycle RPG - Combat Engine
 * ATB (Active Time Battle) system inspired by Final Fantasy
 * Handles: turn order, damage calculation, ward powers, status effects,
 *          ward charge meter, enemy AI, flee attempts, XP/loot distribution
 */

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const COMBAT_STATUS = {
    IDLE: 'idle',
    PLAYER_TURN: 'player_turn',
    ENEMY_TURN: 'enemy_turn',
    ANIMATING: 'animating',
    VICTORY: 'victory',
    DEFEAT: 'defeat',
    FLED: 'fled',
};

export const STATUS_EFFECTS = {
    BURN:    { id: 'burn',    name: 'Burn',    damagePerTurn: 5,  duration: 3, color: '#FF4400' },
    FREEZE:  { id: 'freeze',  name: 'Freeze',  skipTurn: true,    duration: 2, color: '#00AAFF' },
    POISON:  { id: 'poison',  name: 'Poison',  damagePerTurn: 4,  duration: 5, color: '#44FF00' },
    STUN:    { id: 'stun',    name: 'Stun',    skipTurn: true,    duration: 1, color: '#FFFF00' },
    CONFUSE: { id: 'confuse', name: 'Confuse', randomAction: true,duration: 3, color: '#FF00FF' },
    SLOW:    { id: 'slow',    name: 'Slow',    atbRate: 0.5,      duration: 3, color: '#888888' },
};

export const MASTERY_MULTIPLIERS = {
    F: { damage: 0.5, mp_cost: 1.5 },
    D: { damage: 0.7, mp_cost: 1.3 },
    C: { damage: 1.0, mp_cost: 1.0 },
    B: { damage: 1.3, mp_cost: 0.8 },
    A: { damage: 1.6, mp_cost: 0.6 },
    S: { damage: 2.0, mp_cost: 0.4 },
};

// ATB bar fills at 100; speed determines fill rate (higher speed = faster)
export const ATB_TICK_INTERVAL_MS = 100;
export const ATB_MAX = 100;

// ─── DAMAGE CALCULATION ────────────────────────────────────────────────────────

/**
 * Calculate physical attack damage
 * Formula: floor(STR * weaponMult * (100 / (100 + enemyDEF)) * randomVariance)
 */
export function calcPhysicalDamage(attacker, defender, weaponMult = 1.0) {
    const str = attacker.stats.STR || 10;
    const def = defender.stats.defense || 0;
    const variance = 0.9 + Math.random() * 0.2; // 0.9 - 1.1
  const raw = str * weaponMult * (100 / (100 + def)) * variance;

  // Critical hit
  const isCrit = Math.random() < 0.05;
    const damage = Math.floor(raw * (isCrit ? 2.0 : 1.0));

  return { damage: Math.max(1, damage), isCrit };
}

/**
 * Calculate ward damage
 * Formula: floor(WRD * wardBaseDmg * masteryMult * (100 / (100 + enemyDEF*0.5)) * variance)
 */
export function calcWardDamage(attacker, defender, ward, mastery = 'C') {
    const wrd = attacker.stats.WRD || 10;
    const def = defender.stats.defense || 0;
    const masteryMult = MASTERY_MULTIPLIERS[mastery]?.damage || 1.0;
    const wardDmg = ward.combat?.damage || 0;
    const scalingStat = ward.combat?.scaling?.stat === 'WRD' ? wrd :
                            ward.combat?.scaling?.stat === 'STR' ? (attacker.stats.STR || 10) :
                            ward.combat?.scaling?.stat === 'INT' ? (attacker.stats.INT || 10) : wrd;
    const scalingMult = ward.combat?.scaling?.multiplier || 1.0;
    const variance = 0.85 + Math.random() * 0.3; // 0.85 - 1.15

  // Check weakness / resistance
  const damageType = ward.combat?.damage_type || 'neutral';
    const weaknessMult = defender.weaknesses?.includes(damageType) ? 1.5 : 1.0;
    const resistMult   = defender.resistances?.includes(damageType) ? 0.5 : 1.0;

  const raw = scalingStat * scalingMult * wardDmg * masteryMult *
                  (100 / (100 + def * 0.5)) * variance * weaknessMult * resistMult;

  const isCrit = Math.random() < 0.05;
    const damage = Math.floor(raw * (isCrit ? 2.0 : 1.0));

  return {
        damage: Math.max(0, damage),
        isCrit,
        isWeakness: weaknessMult > 1,
        isResisted: resistMult < 1,
        type: damageType,
  };
}

// ─── ATB SYSTEM ───────────────────────────────────────────────────────────────

/**
 * Calculate how much ATB fills per tick for a combatant
 * Base fill rate: speed * 0.5 per 100ms tick
 */
export function getAtbFillRate(speed) {
    return (speed || 10) * 0.5;
}

/**
 * Advance ATB bars for all combatants
 * Returns the updated combatants array and the ID of whoever is ready to act (or null)
 */
export function tickAtb(combatants) {
    const updated = combatants.map(c => {
          if (c.hp <= 0) return c;

                                       // Status effects that pause ATB fill
                                       const hasFreeze = c.statusEffects?.some(e => e.id === 'freeze');
          const hasStun   = c.statusEffects?.some(e => e.id === 'stun');
          if (hasFreeze || hasStun) return c;

                                       const slowEffect = c.statusEffects?.find(e => e.id === 'slow');
          const rateMult   = slowEffect ? 0.5 : 1.0;
          const speed      = c.stats?.SPD || c.stats?.speed || 10;
          const fillRate   = getAtbFillRate(speed) * rateMult;
          const newAtb     = Math.min(ATB_MAX, (c.atb || 0) + fillRate);

                                       return { ...c, atb: newAtb };
    });

  // Find the first combatant whose ATB is full and who hasn't acted yet
  const ready = updated.find(c => c.atb >= ATB_MAX && c.hp > 0 && !c.acted);
    return { combatants: updated, readyId: ready?.id || null };
}

// ─── STATUS EFFECT MANAGEMENT ─────────────────────────────────────────────────

/**
 * Apply a status effect to a combatant
 */
export function applyStatus(combatant, effectId) {
    const effect = STATUS_EFFECTS[effectId.toUpperCase()];
    if (!effect) return combatant;

  // Don't stack the same status
  const existing = combatant.statusEffects?.find(e => e.id === effectId);
    if (existing) {
          // Refresh duration instead
      return {
              ...combatant,
              statusEffects: combatant.statusEffects.map(e =>
                        e.id === effectId ? { ...e, turnsLeft: effect.duration } : e
                                                               ),
      };
    }

  return {
        ...combatant,
        statusEffects: [
                ...(combatant.statusEffects || []),
          { ...effect, turnsLeft: effect.duration },
              ],
  };
}

/**
 * Process status effects at the start of a combatant's turn
 * Returns: { combatant, log: [] }
 */
export function processStatusEffects(combatant) {
    const log = [];
    let c = { ...combatant, statusEffects: [] };

  for (const effect of (combatant.statusEffects || [])) {
        if (effect.turnsLeft <= 0) continue;

      // Apply DoT
      if (effect.damagePerTurn) {
              c = { ...c, hp: Math.max(0, c.hp - effect.damagePerTurn) };
              log.push({ type: 'status_damage', target: c.id, damage: effect.damagePerTurn, effect: effect.id });
      }

      // Decrement duration
      const remaining = effect.turnsLeft - 1;
        if (remaining > 0) {
                c = { ...c, statusEffects: [...c.statusEffects, { ...effect, turnsLeft: remaining }] };
        }
  }

  return { combatant: c, log };
}

/**
 * Clear all status effects from a combatant (e.g., Leesha's cure ability)
 */
export function clearAllStatus(combatant) {
    return { ...combatant, statusEffects: [] };
}

// ─── WARD CHARGE METER ────────────────────────────────────────────────────────

/**
 * Add ward charge to a character (fills on dealing/taking damage)
 * Returns updated character
 */
export function addWardCharge(character, amount) {
    const current = character.wardCharge || 0;
    const max     = character.wardChargeMax || 100;
    return { ...character, wardCharge: Math.min(max, current + amount) };
}

/**
 * Check if character can use their Grand Ward (limit break)
 */
export function canUseGrandWard(character) {
    return (character.wardCharge || 0) >= (character.wardChargeMax || 100);
}

/**
 * Consume ward charge after using Grand Ward
 */
export function consumeWardCharge(character) {
    return { ...character, wardCharge: 0 };
}

// ─── ENEMY AI ─────────────────────────────────────────────────────────────────

/**
 * Determine enemy action based on behavior pattern
 * Returns: { action: 'attack'|'ability', targetId, abilityId? }
 */
export function getEnemyAction(enemy, partyMembers) {
    const alive = partyMembers.filter(p => p.hp > 0);
    if (alive.length === 0) return null;

  const behavior = enemy.behavior || 'aggressive_melee';

  // Self-Ignite type: use explosive ability at low HP
  const selfDestructAbility = enemy.abilities?.find(
        a => a.trigger === 'hp_below_25pct' && enemy.hp <= enemy.maxHp * 0.25
      );
    if (selfDestructAbility) {
          return {
                  action: 'ability',
                  abilityId: selfDestructAbility.name,
                  targetId: alive[0].id,
                  abilityData: selfDestructAbility,
          };
    }

  // Ranged enemies: prefer lowest HP target
  if (behavior === 'aggressive_ranged' || behavior === 'evasive_ranged') {
        const lowestHp = alive.reduce((prev, curr) =>
                (prev.hp / (prev.maxHp || 100)) < (curr.hp / (curr.maxHp || 100)) ? prev : curr
                                          );
        const rangedAbility = enemy.abilities?.find(a => a.range > 1 && !a.trigger);
        return {
                action: rangedAbility ? 'ability' : 'attack',
                abilityId: rangedAbility?.name,
                targetId: lowestHp.id,
                abilityData: rangedAbility,
        };
  }

  // Tactical commander: attack + buff allies
  if (behavior === 'tactical_commander') {
        const rng = Math.random();
        if (rng < 0.4) {
                const buffAbility = enemy.abilities?.find(a => a.effect === 'buff_nearby_corelings');
                if (buffAbility) {
                          return { action: 'ability', abilityId: buffAbility.name, targetId: 'all_enemies', abilityData: buffAbility };
                }
        }
  }

  // Default: attack party member with highest HP (melee intimidation tactic)
  if (behavior === 'charge_melee') {
        const highestHp = alive.reduce((prev, curr) => prev.hp > curr.hp ? prev : curr);
        const chargeAbility = enemy.abilities?.find(a => !a.trigger && a.range > 1);
        return {
                action: chargeAbility ? 'ability' : 'attack',
                abilityId: chargeAbility?.name,
                targetId: highestHp.id,
                abilityData: chargeAbility,
        };
  }

  // Generic fallback: random party target
  const target = alive[Math.floor(Math.random() * alive.length)];
    const randomAbility = enemy.abilities?.filter(a => !a.trigger)[Math.floor(Math.random() * enemy.abilities.filter(a => !a.trigger).length)];
    return {
          action: randomAbility && Math.random() < 0.4 ? 'ability' : 'attack',
          abilityId: randomAbility?.name,
          targetId: target.id,
          abilityData: randomAbility,
    };
}

// ─── FLEE LOGIC ───────────────────────────────────────────────────────────────

/**
 * Attempt to flee from combat
 * Success based on party average SPD vs enemy average SPD
 */
export function attemptFlee(party, enemies, isBoss = false) {
    if (isBoss) return { success: false, message: "You cannot flee from this battle!" };

  const partySpd  = party.reduce((sum, p) => sum + (p.stats?.SPD || 10), 0) / party.length;
    const enemySpd  = enemies.reduce((sum, e) => sum + (e.stats?.speed || 10), 0) / enemies.length;
    const chance    = Math.max(0.1, Math.min(0.9, 0.5 + (partySpd - enemySpd) * 0.02));
    const success   = Math.random() < chance;

  return {
        success,
        message: success
          ? "You escaped into the darkness!"
                : "Can't escape! The corelings surround you!",
  };
}

// ─── XP & LOOT DISTRIBUTION ───────────────────────────────────────────────────

/**
 * Generate loot drops from defeated enemies
 */
export function generateLoot(enemy) {
    const drops = [];
    for (const entry of (enemy.loot_table || [])) {
          if (Math.random() < entry.chance) {
                  if (entry.amount) {
                            const amount = typeof entry.amount === 'number'
                              ? entry.amount
                                        : Math.floor(entry.amount[0] + Math.random() * (entry.amount[1] - entry.amount[0]));
                            drops.push({ item: entry.item, quantity: amount });
                  } else {
                            drops.push({ item: entry.item, quantity: 1 });
                  }
          }
    }
    return drops;
}

/**
 * Calculate XP gain from defeated enemies
 * Applies level scaling penalty if player is much higher level
 */
export function calcXpGain(enemies, playerLevel) {
    return enemies.reduce((total, enemy) => {
          const baseXp  = enemy.stats?.xp_reward || 10;
          const enemyLvl = enemy.level || 1;
          const levelDiff = playerLevel - enemyLvl;
          // Penalty: -10% per level above enemy, min 10%
                              const scale = Math.max(0.1, 1.0 - (Math.max(0, levelDiff - 5) * 0.1));
          return total + Math.floor(baseXp * scale);
    }, 0);
}

// ─── COMBAT BATTLE INITIALIZER ────────────────────────────────────────────────

/**
 * Build the initial combat state from party + enemy group
 * party: array of companion data from companions.json + current HP/MP
 * enemies: array from coreling_types.json + runtime data
 */
export function initCombat(party, enemyGroup, isBoss = false) {
    const partyMembers = party.map((p, i) => ({
          ...p,
          id: p.id || `party_${i}`,
          hp: p.hp || p.base_stats?.hp_base || 40,
          maxHp: p.maxHp || p.base_stats?.hp_base || 40,
          mp: p.mp || p.base_stats?.mp_base || 20,
          maxMp: p.maxMp || p.base_stats?.mp_base || 20,
          atb: Math.random() * 30, // slight random start
          statusEffects: [],
          wardCharge: p.wardCharge || 0,
          wardChargeMax: 100,
          acted: false,
          isParty: true,
    }));

  const enemies = enemyGroup.map((e, i) => ({
        ...e,
        id: `${e.id}_${i}`,
        hp: e.stats.hp,
        maxHp: e.stats.hp,
        atb: Math.random() * 20,
        statusEffects: [],
        acted: false,
        isParty: false,
  }));

  return {
        status: COMBAT_STATUS.IDLE,
        turn: 0,
        partyMembers,
        enemies,
        isBoss,
        log: [],
        loot: [],
        xpGained: 0,
        wardChargeGained: 0,
        phase: 1, // for boss multi-phase
  };
}

// ─── COMBAT RESULT PROCESSOR ──────────────────────────────────────────────────

/**
 * Check if combat is over
 * Returns: 'ongoing' | 'victory' | 'defeat'
 */
export function checkCombatEnd(state) {
    const allEnemiesDead  = state.enemies.every(e => e.hp <= 0);
    const allPartyDead    = state.partyMembers.every(p => p.hp <= 0);

  if (allEnemiesDead)  return COMBAT_STATUS.VICTORY;
    if (allPartyDead)    return COMBAT_STATUS.DEFEAT;
    return COMBAT_STATUS.IDLE;
}

/**
 * Generate the combat summary after victory
 */
export function buildVictorySummary(state, playerLevel) {
    const deadEnemies = state.enemies.filter(e => e.hp <= 0);
    const xp   = calcXpGain(deadEnemies, playerLevel);
    const loot = deadEnemies.flatMap(e => generateLoot(e));

  // Consolidate duplicate loot items
  const consolidated = loot.reduce((acc, drop) => {
        const existing = acc.find(d => d.item === drop.item);
        if (existing) existing.quantity += drop.quantity;
        else acc.push({ ...drop });
        return acc;
  }, []);

  return {
        xp,
        loot: consolidated,
        partyHpRemaining: state.partyMembers.map(p => ({ id: p.id, hp: p.hp, maxHp: p.maxHp })),
        turnsElapsed: state.turn,
  };
}
