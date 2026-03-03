/**
 * explorationStore.js - Zustand store for tile-based exploration
 * Per mega prompt: "Zustand for game state"
 */

import { create } from 'zustand';

const OVERWORLD = require('../../content/zones/tibbet_brook/overworld.json');
const TOWN = require('../../content/zones/tibbet_brook/town.json');

export const useExplorationStore = create((set) => ({
  currentMap: 'overworld',
  playerX: OVERWORLD.spawn.x,
  playerY: OVERWORLD.spawn.y,
  facing: 'down',
  npcDialogue: null,

  setPosition: (x, y) => set({ playerX: x, playerY: y }),
  setFacing: (facing) => set({ facing }),
  setMap: (map) => set({ currentMap: map }),
  setNpcDialogue: (npc) => set({ npcDialogue: npc }),

  transition: (to, toX, toY) =>
    set({
      currentMap: to.includes('town') ? 'town' : 'overworld',
      playerX: toX,
      playerY: toY,
    }),
}));
