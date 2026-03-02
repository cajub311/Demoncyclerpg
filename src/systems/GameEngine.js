/**
 * GameEngine.js - All game constants for Demon Cycle RPG
 * Based on Peter V. Brett's Warded Man series
 */

// ============ DAY/NIGHT CYCLE ============
export const PHASES = {
  DAWN: 'DAWN',
  DAY: 'DAY',
  DUSK: 'DUSK',
  NIGHT: 'NIGHT',
};

// Real-time cycle: 1 game minute = X real seconds (accelerated for gameplay)
export const MINUTES_PER_REAL_SECOND = 2; // 2 game minutes per real second
export const MINUTES_PER_DAY = 24 * 60; // 1440 game minutes per day
export const REAL_SECONDS_PER_DAY = MINUTES_PER_DAY / (60 * MINUTES_PER_REAL_SECOND); // ~12 real seconds per game day

// Phase boundaries (game minutes from midnight, 0-1440)
export const PHASE_BOUNDARIES = {
  DAWN_START: 5 * 60,   // 5:00 AM
  DAY_START: 7 * 60,    // 7:00 AM
  DUSK_START: 18 * 60,  // 6:00 PM
  NIGHT_START: 20 * 60, // 8:00 PM
};

// Sky colors per phase [R, G, B] 0-255
export const SKY_COLORS = {
  DAWN: { r: 255, g: 120, b: 60 },   // Warm orange
  DAY: { r: 100, g: 150, b: 255 },   // Bright blue
  DUSK: { r: 180, g: 50, b: 50 },    // Blood red
  NIGHT: { r: 5, g: 5, b: 15 },      // Pitch black
};

// ============ MORAL PATH ============
export const MORAL_BOUNDS = { MIN: -100, MAX: 100 };
export const PATHS = {
  WARD_BEARER: 'WARD_BEARER',
  DEMON_EATER: 'DEMON_EATER',
};

// ============ PARTY ============
export const CHARACTERS = {
  ARLEN: { id: 'arlen', name: 'Arlen Bales', role: 'Ward Fighter', emoji: '⚔️' },
  LEESHA: { id: 'leesha', name: 'Leesha Paper', role: 'Healer', emoji: '🌿' },
  ROJER: { id: 'rojer', name: 'Rojer Halfgrip', role: 'Jongleur', emoji: '🎻' },
  JARDIR: { id: 'jardir', name: 'Ahmann Jardir', role: 'Warrior', emoji: '🏹' },
};

export const STARTING_PARTY = ['arlen', 'leesha', 'rojer'];

// ============ CORELINGS (Demons) ============
export const CORELING_TYPES = {
  FIELD: { id: 'field', name: 'Field Demon', hp: 30, damage: 5, speed: 1.2 },
  ROCK: { id: 'rock', name: 'Rock Demon', hp: 80, damage: 15, speed: 0.6 },
  WOOD: { id: 'wood', name: 'Wood Demon', hp: 45, damage: 8, speed: 1.0 },
  WIND: { id: 'wind', name: 'Wind Demon', hp: 25, damage: 6, speed: 1.5 },
  FLAME: { id: 'flame', name: 'Flame Demon', hp: 40, damage: 12, speed: 1.0 },
};

export const NIGHT_SPAWN_TYPES = ['field']; // Start with field demons only

// ============ TOWNS ============
export const TOWNS = {
  MILN: { id: 'miln', name: 'Miln', wardStrength: 80, population: 340, unlocked: true },
  TIBBETS: { id: 'tibbets', name: "Tibbet's Brook", wardStrength: 30, population: 80, unlocked: true },
  ANGIERS: { id: 'angiers', name: 'Angiers', wardStrength: 75, population: 1200, unlocked: false },
  KRASIA: { id: 'krasia', name: 'Krasia', wardStrength: 95, population: 5000, unlocked: false },
};

// ============ INVENTORY ============
export const ITEMS = {
  FOOD: { id: 'food', name: 'Food', max: 20 },
  WATER: { id: 'water', name: 'Water', max: 10 },
  WARD_STONE: { id: 'ward_stone', name: 'Ward Stone', max: 15 },
  HEALING_HERBS: { id: 'healing_herbs', name: 'Healing Herbs', max: 10 },
  DEMON_FLESH: { id: 'demon_flesh', name: 'Demon Flesh', max: 5 },
};

// ============ WARDED ECHO ============
export const ECHO_CHARGES_START = 1;
export const ECHO_HP_PERCENT = 0.5;

// ============ COMBAT ============
export const TAP_DAMAGE = 15;
export const MIN_TAP_TARGET_PX = 44; // Mobile accessibility

// ============ COLORS (Dark theme) ============
export const COLORS = {
  background: '#0a0a12',
  surface: '#12121f',
  surfaceLight: '#1a1a2e',
  text: '#e8e6e3',
  textMuted: '#8b8685',
  wardBlue: '#4a6fa5',
  bloodRed: '#8b2635',
  demonPurple: '#4a2c6a',
  danger: '#c41e3a',
  safe: '#2d5a27',
};
