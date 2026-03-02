/**
 * DayNightEngine.js - Real-time day/night cycle with phase detection
 * The most critical system - drives sky, spawning, and gameplay
 */

import { PHASES, PHASE_BOUNDARIES, MINUTES_PER_REAL_SECOND, MINUTES_PER_DAY } from './GameEngine';

/**
 * Get current phase based on game minute (0-1440)
 */
export function getPhaseAtMinute(minute) {
  if (minute >= PHASE_BOUNDARIES.NIGHT_START || minute < PHASE_BOUNDARIES.DAWN_START) {
    return PHASES.NIGHT;
  }
  if (minute >= PHASE_BOUNDARIES.DUSK_START) {
    return PHASES.DUSK;
  }
  if (minute >= PHASE_BOUNDARIES.DAY_START) {
    return PHASES.DAY;
  }
  if (minute >= PHASE_BOUNDARIES.DAWN_START) {
    return PHASES.DAWN;
  }
  return PHASES.NIGHT;
}

/**
 * Advance game time by delta (real seconds)
 * Returns new { minute, day, phase }
 */
export function advanceTime(currentMinute, currentDay, deltaSeconds) {
  const minutesToAdd = deltaSeconds * 60 * MINUTES_PER_REAL_SECOND;
  let newMinute = currentMinute + minutesToAdd;
  let newDay = currentDay;

  while (newMinute >= MINUTES_PER_DAY) {
    newMinute -= MINUTES_PER_DAY;
    newDay += 1;
  }
  while (newMinute < 0) {
    newMinute += MINUTES_PER_DAY;
    newDay -= 1;
  }

  const phase = getPhaseAtMinute(newMinute);
  return { minute: newMinute, day: newDay, phase };
}

/**
 * Get phase progress 0-1 for smooth sky transitions
 */
export function getPhaseProgress(minute) {
  if (minute >= PHASE_BOUNDARIES.NIGHT_START || minute < PHASE_BOUNDARIES.DAWN_START) {
    const nightStart = PHASE_BOUNDARIES.NIGHT_START;
    const nightEnd = PHASE_BOUNDARIES.DAWN_START + MINUTES_PER_DAY;
    const nightDuration = nightEnd - nightStart;
    const m = minute >= nightStart ? minute : minute + MINUTES_PER_DAY;
    return (m - nightStart) / nightDuration;
  }
  if (minute >= PHASE_BOUNDARIES.DUSK_START) {
    return (minute - PHASE_BOUNDARIES.DUSK_START) / (PHASE_BOUNDARIES.NIGHT_START - PHASE_BOUNDARIES.DUSK_START);
  }
  if (minute >= PHASE_BOUNDARIES.DAY_START) {
    return (minute - PHASE_BOUNDARIES.DAY_START) / (PHASE_BOUNDARIES.DUSK_START - PHASE_BOUNDARIES.DAY_START);
  }
  if (minute >= PHASE_BOUNDARIES.DAWN_START) {
    return (minute - PHASE_BOUNDARIES.DAWN_START) / (PHASE_BOUNDARIES.DAY_START - PHASE_BOUNDARIES.DAWN_START);
  }
  return 0;
}

/**
 * Get interpolated sky color based on minute
 */
export function getSkyColorAtMinute(minute, SKY_COLORS) {
  const phase = getPhaseAtMinute(minute);
  const progress = getPhaseProgress(minute);

  let fromColor, toColor;
  switch (phase) {
    case PHASES.DAWN:
      fromColor = SKY_COLORS.NIGHT;
      toColor = SKY_COLORS.DAWN;
      break;
    case PHASES.DAY:
      fromColor = SKY_COLORS.DAWN;
      toColor = SKY_COLORS.DAY;
      break;
    case PHASES.DUSK:
      fromColor = SKY_COLORS.DAY;
      toColor = SKY_COLORS.DUSK;
      break;
    case PHASES.NIGHT:
      fromColor = SKY_COLORS.DUSK;
      toColor = SKY_COLORS.NIGHT;
      break;
    default:
      return SKY_COLORS.NIGHT;
  }

  return {
    r: Math.round(fromColor.r + (toColor.r - fromColor.r) * progress),
    g: Math.round(fromColor.g + (toColor.g - fromColor.g) * progress),
    b: Math.round(fromColor.b + (toColor.b - fromColor.b) * progress),
  };
}

/**
 * Is it safe to travel? (Day or Dawn)
 */
export function canTravel(phase) {
  return phase === PHASES.DAY || phase === PHASES.DAWN;
}

/**
 * Do Corelings spawn? (Night only)
 */
export function corelingsSpawn(phase) {
  return phase === PHASES.NIGHT;
}

/**
 * Sunset danger progress 0-1: how close to night (for HUD bar)
 * 0 = safe (day start), 1 = dusk or night
 */
export function getSunsetDangerProgress(minute) {
  if (minute >= PHASE_BOUNDARIES.DUSK_START) return 1;
  if (minute < PHASE_BOUNDARIES.DAY_START) return 0;
  return (minute - PHASE_BOUNDARIES.DAY_START) / (PHASE_BOUNDARIES.DUSK_START - PHASE_BOUNDARIES.DAY_START);
}

/**
 * Format minute as HH:MM
 */
export function formatTime(minute) {
  const hours = Math.floor(minute / 60) % 24;
  const mins = Math.floor(minute % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
