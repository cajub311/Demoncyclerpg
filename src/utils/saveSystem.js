/**
 * saveSystem.js - Save/load via AsyncStorage (Phase 9)
 * 3 slots + 1 auto-save
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVE_KEYS = ['save_1', 'save_2', 'save_3', 'autosave'];

export async function saveGame(slot, data) {
  const key = slot === 'auto' ? 'autosave' : SAVE_KEYS[slot - 1];
  await AsyncStorage.setItem(key, JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }));
}

export async function loadGame(slot) {
  const key = slot === 'auto' ? 'autosave' : SAVE_KEYS[slot - 1];
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export async function getSaveSlots() {
  const slots = await Promise.all(
    SAVE_KEYS.map(async (key, i) => {
      const raw = await AsyncStorage.getItem(key);
      const data = raw ? JSON.parse(raw) : null;
      return {
        slot: i === 3 ? 'auto' : i + 1,
        exists: !!data,
        timestamp: data?.timestamp,
      };
    })
  );
  return slots;
}
