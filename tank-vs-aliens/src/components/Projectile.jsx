import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const PROJECTILE_LIFETIME = 4;
const HIT_RADIUS = 2.4;

export default function Projectile({ projectile }) {
  const meshRef = useRef();
  const localPos = useRef([...projectile.position]);
  const localAge = useRef(0);
  const dead = useRef(false);

  useFrame((state, delta) => {
    if (dead.current || !meshRef.current) return;

    const { gameState, aliens, removeProjectile, removeAlien, addScore, addExplosion, updateAlien } = useGameStore.getState();
    if (gameState !== 'playing') return;

    const [px, py, pz] = localPos.current;
    const [dx, dy, dz] = projectile.direction;

    const newPos = [px + dx * delta, py + dy * delta, pz + dz * delta];
    localPos.current = newPos;
    localAge.current += delta;

    meshRef.current.position.set(...newPos);

    if (localAge.current > PROJECTILE_LIFETIME || newPos[1] < -2 || newPos[1] > 100) {
      dead.current = true;
      removeProjectile(projectile.id);
      return;
    }

    // Collision
    const projVec = new THREE.Vector3(...newPos);
    for (const alien of aliens) {
      const alienVec = new THREE.Vector3(...alien.position);
      const dist = projVec.distanceTo(alienVec);
      const hitR = alien.type === 'boss' ? HIT_RADIUS * 1.8 : HIT_RADIUS;
      if (dist < hitR) {
        addExplosion(alien.position);
        const newHp = (alien.hp || 1) - 1;
        if (newHp <= 0) {
          removeAlien(alien.id);
          addScore(alien.type === 'boss' ? 500 : 100);
        } else {
          updateAlien(alien.id, { hp: newHp });
        }
        dead.current = true;
        removeProjectile(projectile.id);
        break;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={projectile.position}>
      <sphereGeometry args={[0.2, 6, 6]} />
      <meshStandardMaterial color="#ffcc00" emissive="#ff8800" emissiveIntensity={3} />
      <pointLight color="#ff8800" intensity={5} distance={5} />
    </mesh>
  );
}
