/**
 * useGameState.js - Central state management for Demon Cycle RPG
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { advanceTime, getPhaseAtMinute, corelingsSpawn } from '../systems/DayNightEngine';
import { PHASES, SKY_COLORS } from '../systems/GameEngine';
import { getSkyColorAtMinute } from '../systems/DayNightEngine';

const INITIAL_STATE = {
  // Day/Night
  gameMinute: 7 * 60, // Start at 7 AM (DAY)
  gameDay: 1,
  phase: PHASES.DAY,
  lastUpdateTime: null,

  // Party
  activeCharacter: 'arlen',
  partyMembers: ['arlen', 'leesha', 'rojer'],

  // Moral path (-100 to 100)
  moralScore: 0,

  // Inventory
  inventory: {
    food: 5,
    water: 3,
    ward_stone: 3,
    healing_herbs: 2,
    demon_flesh: 0,
  },

  // Location
  currentTown: 'miln',
  isTraveling: false,

  // Corelings
  corelings: [],
  corelingIdCounter: 0,

  // Warded Echo
  echoCharges: 1,
  lastSafeLocation: 'miln',

  // First launch
  hasSeenMoralPath: false,

  // Character HP (simplified)
  characterHp: {
    arlen: 100,
    leesha: 80,
    rojer: 70,
  },
};

export function useGameState() {
  const [state, setState] = useState(INITIAL_STATE);
  const lastTimeRef = useRef(null);
  const spawnIntervalRef = useRef(null);

  // Sky color derived from game minute
  const skyColor = getSkyColorAtMinute(state.gameMinute, SKY_COLORS);
  const skyColorHex = `rgb(${skyColor.r}, ${skyColor.g}, ${skyColor.b})`;

  // Time advancement loop
  useEffect(() => {
    const tick = () => {
      const now = Date.now() / 1000;
      const lastTime = lastTimeRef.current ?? now;
      const delta = now - lastTime;
      lastTimeRef.current = now;

      setState((prev) => {
        const { minute, day, phase } = advanceTime(
          prev.gameMinute,
          prev.gameDay,
          delta
        );
        return {
          ...prev,
          gameMinute: minute,
          gameDay: day,
          phase,
          lastUpdateTime: now,
        };
      });
    };

    const interval = setInterval(tick, 100); // 10 FPS for smooth time
    return () => clearInterval(interval);
  }, []);

  // Coreling spawning at night
  useEffect(() => {
    if (!corelingsSpawn(state.phase)) {
      spawnIntervalRef.current = null;
      return;
    }

    // Spread-out positions so corelings don't overlap
    const SPAWN_POSITIONS = [
      [12, 18], [35, 15], [58, 25], [75, 18],
      [18, 42], [42, 48], [65, 45], [28, 55],
    ];

    const spawnCoreling = () => {
      setState((prev) => {
        if (prev.corelings.length >= 8) return prev; // Cap spawns
        const usedPositions = prev.corelings.map((c) => `${c.x},${c.y}`);
        const available = SPAWN_POSITIONS.filter(
          ([px, py]) => !usedPositions.includes(`${px},${py}`)
        );
        if (available.length === 0) return prev;
        const [x, y] = available[Math.floor(Math.random() * available.length)];
        const id = prev.corelingIdCounter + 1;
        // Field = small/fast (early days), Rock = large/slow (day 3+)
        const type = prev.gameDay >= 3 && Math.random() < 0.3 ? 'rock' : 'field';
        const baseHp = type === 'rock' ? 80 : 30;
        const hp = baseHp + Math.floor(prev.gameDay * 2);
        return {
          ...prev,
          corelingIdCounter: id,
          corelings: [
            ...prev.corelings,
            { id, type, hp, maxHp: hp, x, y },
          ],
        };
      });
    };

    spawnCoreling();
    const interval = setInterval(spawnCoreling, 3000 + state.gameDay * 500);
    spawnIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [state.phase, state.gameDay]);

  const setActiveCharacter = useCallback((charId) => {
    setState((prev) => ({ ...prev, activeCharacter: charId }));
  }, []);

  const attackCoreling = useCallback((corelingId, damage) => {
    setState((prev) => {
      const corelings = prev.corelings.map((c) =>
        c.id === corelingId
          ? { ...c, hp: Math.max(0, c.hp - damage), dying: (c.hp - damage) <= 0 }
          : c
      );
      return { ...prev, corelings };
    });
  }, []);

  const removeCoreling = useCallback((corelingId) => {
    setState((prev) => ({
      ...prev,
      corelings: prev.corelings.filter((c) => c.id !== corelingId),
    }));
  }, []);

  const setMoralPathSeen = useCallback(() => {
    setState((prev) => ({ ...prev, hasSeenMoralPath: true }));
  }, []);

  const setMoralScore = useCallback((score) => {
    setState((prev) => ({
      ...prev,
      moralScore: Math.max(-100, Math.min(100, score)),
    }));
  }, []);

  const setCurrentTown = useCallback((townId) => {
    setState((prev) => ({
      ...prev,
      currentTown: townId,
      lastSafeLocation: townId,
      isTraveling: false,
    }));
  }, []);

  const startTravel = useCallback((destinationTown) => {
    setState((prev) => ({
      ...prev,
      isTraveling: true,
      travelDestination: destinationTown,
    }));
  }, []);

  const useEcho = useCallback(() => {
    setState((prev) => {
      if (prev.echoCharges <= 0) return prev;
      return {
        ...prev,
        echoCharges: prev.echoCharges - 1,
        currentTown: prev.lastSafeLocation,
        corelings: [],
        characterHp: {
          ...prev.characterHp,
          [prev.activeCharacter]: Math.floor(
            (prev.characterHp[prev.activeCharacter] ?? 100) * 0.5
          ),
        },
      };
    });
  }, []);

  const updateInventory = useCallback((itemId, delta) => {
    setState((prev) => {
      const current = prev.inventory[itemId] ?? 0;
      const next = Math.max(0, Math.min(20, current + delta));
      return {
        ...prev,
        inventory: { ...prev.inventory, [itemId]: next },
      };
    });
  }, []);

  return {
    state,
    skyColor,
    skyColorHex,
    setActiveCharacter,
    attackCoreling,
    removeCoreling,
    setMoralPathSeen,
    setMoralScore,
    setCurrentTown,
    startTravel,
    useEcho,
    updateInventory,
  };
}
