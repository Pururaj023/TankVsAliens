import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 20;

function ExplosionParticle({ startPos, velocity, color }) {
  const meshRef = useRef();
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!meshRef.current) return;
    const t = (Date.now() - startTime.current) / 1000;
    meshRef.current.position.set(
      startPos[0] + velocity[0] * t,
      startPos[1] + velocity[1] * t - 4 * t * t,
      startPos[2] + velocity[2] * t
    );
    meshRef.current.scale.setScalar(Math.max(0, 1 - t * 1.2));
  });

  return (
    <mesh ref={meshRef} position={startPos}>
      <sphereGeometry args={[0.25, 6, 6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

export default function Explosion({ explosion }) {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const speed = 4 + Math.random() * 6;
      const vert = 3 + Math.random() * 5;
      const colors = ['#ff4400', '#ff8800', '#ffdd00', '#ffffff', '#ff2200'];
      return {
        id: i,
        velocity: [
          Math.cos(angle) * speed,
          vert,
          Math.sin(angle) * speed,
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
  }, []);

  return (
    <group>
      {particles.map(p => (
        <ExplosionParticle
          key={p.id}
          startPos={explosion.position}
          velocity={p.velocity}
          color={p.color}
        />
      ))}
      <pointLight
        position={explosion.position}
        color="#ff6600"
        intensity={20}
        distance={12}
        decay={2}
      />
    </group>
  );
}
