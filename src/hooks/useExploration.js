/**
 * useExploration.js - Tile-based overworld/town movement state
 */

import { useState, useCallback, useRef, useEffect } from 'react';

const OVERWORLD = require('../../content/zones/tibbet_brook/overworld.json');
const TOWN = require('../../content/zones/tibbet_brook/town.json');

export function useExploration() {
  const [currentMap, setCurrentMap] = useState('overworld');
  const [playerX, setPlayerX] = useState(OVERWORLD.spawn.x);
  const [playerY, setPlayerY] = useState(OVERWORLD.spawn.y);
  const [facing, setFacing] = useState('down');
  const [npcDialogue, setNpcDialogue] = useState(null);
  const [direction, setDirection] = useState(null);
  const moveIntervalRef = useRef(null);

  const mapData = currentMap === 'overworld' ? OVERWORLD : TOWN;

  const canMove = useCallback(
    (dx, dy) => {
      const nx = playerX + dx;
      const ny = playerY + dy;
      if (nx < 0 || ny < 0 || nx >= mapData.width || ny >= mapData.height) return false;
      const collision = mapData.collision || [1, 2, 3];
      const tile = mapData.tiles[ny]?.[nx];
      return !collision.includes(tile);
    },
    [playerX, playerY, mapData]
  );

  const move = useCallback(
    (dx, dy) => {
      if (!canMove(dx, dy)) return;
      setPlayerX((p) => p + dx);
      setPlayerY((p) => p + dy);
      if (dx > 0) setFacing('right');
      if (dx < 0) setFacing('left');
      if (dy > 0) setFacing('down');
      if (dy < 0) setFacing('up');
    },
    [canMove]
  );

  useEffect(() => {
    if (!direction) {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
      return;
    }
    const dx = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const dy = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
    move(dx, dy);
    const id = setInterval(() => move(dx, dy), 150);
    moveIntervalRef.current = id;
    return () => clearInterval(id);
  }, [direction, move]);

  const onDirection = useCallback((dir) => {
    setDirection(dir);
  }, []);

  const checkTransition = useCallback(() => {
    const transitions = currentMap === 'overworld' ? mapData.transitions : mapData.exits;
    const t = transitions?.find((tr) => tr.x === playerX && tr.y === playerY);
    if (t) {
      setCurrentMap(t.to.includes('town') ? 'town' : 'overworld');
      setPlayerX(t.toX);
      setPlayerY(t.toY);
    }
  }, [currentMap, playerX, playerY, mapData]);

  const checkNpcInteract = useCallback(() => {
    const npcs = mapData.npcs || [];
    const front = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[facing];
    const checkX = playerX + front[0];
    const checkY = playerY + front[1];
    const npc = npcs.find((n) => n.x === checkX && n.y === checkY);
    if (npc) {
      setNpcDialogue(npc);
      return true;
    }
    return false;
  }, [playerX, playerY, facing, mapData.npcs]);

  const interact = useCallback(() => {
    if (checkNpcInteract()) return;
    checkTransition();
  }, [checkNpcInteract, checkTransition]);

  const closeDialogue = useCallback(() => setNpcDialogue(null), []);

  return {
    mapData,
    playerX,
    playerY,
    facing,
    npcDialogue,
    onDirection,
    interact,
    closeDialogue,
  };
}
