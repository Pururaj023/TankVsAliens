import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export default function GameLogic() {
  const spawnTimer = useRef(0);
  const waveTimer = useRef(0);

  useFrame((state, delta) => {
    // Always use getState() to avoid stale closures
    const { gameState, wave, aliens, tankPosition, spawnAlien, updateAlien, removeAlien, incrementWave, loseLife } = useGameStore.getState();

    if (gameState !== 'playing') return;

    spawnTimer.current += delta;
    waveTimer.current += delta;

    // Wave every 30s
    if (waveTimer.current > 30) {
      waveTimer.current = 0;
      incrementWave();
    }

    // Spawn
    const spawnInterval = Math.max(0.7, 3.5 - wave * 0.25);
    if (spawnTimer.current >= spawnInterval) {
      spawnTimer.current = 0;
      const angle = Math.random() * Math.PI * 2;
      const dist = 28 + Math.random() * 18;
      const height = 12 + Math.random() * 12;
      const sx = Math.cos(angle) * dist;
      const sz = Math.sin(angle) * dist;

      const [tx, , tz] = tankPosition;
      const toTank = new THREE.Vector3(tx - sx, 0, tz - sz).normalize();
      const speed = 1.8 + Math.random() * 1.5 + wave * 0.2;

      spawnAlien(
        [sx, height, sz],
        [
          (toTank.x + (Math.random() - 0.5) * 0.4) * speed,
          -(0.4 + Math.random() * 0.4),
          (toTank.z + (Math.random() - 0.5) * 0.4) * speed,
        ],
        wave >= 3 && Math.random() < 0.08 + wave * 0.015 ? 'boss' : 'ufo'
      );
    }

    // Move aliens
    for (const alien of aliens) {
      const [px, py, pz] = alien.position;
      const [vx, vy, vz] = alien.velocity;
      const [tx, , tz] = tankPosition;

      // Gentle steering toward tank
      const steerX = (tx - px) * 0.4 * delta;
      const steerZ = (tz - pz) * 0.4 * delta;

      const newPos = [px + vx * delta + steerX, py + vy * delta, pz + vz * delta + steerZ];

      const distToTank = Math.sqrt((newPos[0] - tx) ** 2 + (newPos[2] - tz) ** 2);

      if (newPos[1] < 1.0 || distToTank < 3) {
        loseLife();
        removeAlien(alien.id);
        continue;
      }

      const distFromOrigin = Math.sqrt(newPos[0] ** 2 + newPos[2] ** 2);
      if (distFromOrigin > 130) {
        removeAlien(alien.id);
        continue;
      }

      updateAlien(alien.id, { position: newPos });
    }
  });

  return null;
}
