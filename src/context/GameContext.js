/**
 * GameContext.js - Shared game state across the app
 */

import React, { createContext, useContext } from 'react';
import { useGameState } from '../hooks/useGameState';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const gameState = useGameState();
  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
