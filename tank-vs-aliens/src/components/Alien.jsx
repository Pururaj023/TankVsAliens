import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';

function UFOMesh({ type }) {
  const lightsRef = useRef([]);
  const isBoss = type === 'boss';
  const bodyColor = isBoss ? '#ff3300' : '#00ffaa';

  useFrame((state) => {
    // Animate lights
  });

  return (
    <group scale={isBoss ? [1.8, 1.8, 1.8] : [1, 1, 1]}>
      {/* Disc body */}
      <mesh castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.32, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.8} emissive={bodyColor} emissiveIntensity={0.3} />
      </mesh>
      {/* Rim ring */}
      <mesh>
        <torusGeometry args={[1.5, 0.18, 8, 24]} />
        <meshStandardMaterial color={bodyColor} roughness={0.1} metalness={0.9} emissive={bodyColor} emissiveIntensity={0.25} />
      </mesh>
      {/* Cockpit dome */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.62, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#aaffff" roughness={0.05} metalness={0.1} transparent opacity={0.72} emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      {/* Alien face inside */}
      <mesh position={[0, 0.26, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color={isBoss ? '#ff8800' : '#88ff44'} emissive={isBoss ? '#ff4400' : '#44ff00'} emissiveIntensity={0.9} />
      </mesh>
      {/* Belly lights */}
      {[0,1,2,3,4,5].map(i => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.9, -0.17, Math.sin(a) * 0.9]}>
            <sphereGeometry args={[0.11, 6, 6]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#ffff00' : '#ff00ff'} emissive={i % 2 === 0 ? '#ffff00' : '#ff00ff'} emissiveIntensity={2} />
          </mesh>
        );
      })}
      <pointLight color={isBoss ? '#ff6600' : '#00ff88'} intensity={2.5} distance={8} />
    </group>
  );
}

export default function Alien({ alien }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    // Bob and spin in place (position is controlled by GameLogic via store)
    const bob = Math.sin(state.clock.elapsedTime * 2 + alien.id * 0.7) * 0.25;
    const [px, py, pz] = alien.position;
    groupRef.current.position.set(px, py + bob, pz);
    groupRef.current.rotation.y = state.clock.elapsedTime * (alien.type === 'boss' ? 1.6 : 0.9);
  });

  return (
    <group ref={groupRef}>
      <UFOMesh type={alien.type} />
    </group>
  );
}
