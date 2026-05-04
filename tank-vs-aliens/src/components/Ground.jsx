import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarField() {
  const points = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 400;
      arr[i * 3 + 1] = 20 + Math.random() * 180;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.3} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

function Trees() {
  const positions = useMemo(() => {
    const trees = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 20;
      trees.push([
        Math.cos(angle) * dist,
        0,
        Math.sin(angle) * dist,
      ]);
    }
    return trees;
  }, []);

  return (
    <>
      {positions.map((pos, i) => {
        const h = 2 + Math.random() * 3;
        const r = 0.8 + Math.random() * 0.6;
        return (
          <group key={i} position={pos}>
            <mesh position={[0, h / 2, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.25, h, 6]} />
              <meshStandardMaterial color="#5a3a1a" roughness={1} />
            </mesh>
            <mesh position={[0, h + r * 0.5, 0]} castShadow>
              <coneGeometry args={[r, r * 2, 7]} />
              <meshStandardMaterial color={`hsl(${110 + (i % 5) * 8}, 50%, ${25 + (i % 3) * 5}%)`} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

export default function Ground() {
  const gridRef = useRef();

  return (
    <>
      {/* Sky */}
      <mesh>
        <sphereGeometry args={[200, 32, 16]} />
        <meshStandardMaterial color="#0a0a1a" side={THREE.BackSide} />
      </mesh>

      {/* Stars */}
      <StarField />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 40, 40]} />
        <meshStandardMaterial
          color="#1a3a0a"
          roughness={0.95}
          metalness={0.0}
          wireframe={false}
        />
      </mesh>

      {/* Grid overlay */}
      <gridHelper args={[100, 40, '#1a4a0a', '#1a4a0a']} position={[0, 0.01, 0]} />

      {/* Perimeter wall feel - low hills */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 50, 0.5, Math.sin(angle) * 50]} castShadow>
            <sphereGeometry args={[3 + Math.random() * 2, 8, 6]} />
            <meshStandardMaterial color="#162a08" roughness={1} />
          </mesh>
        );
      })}

      {/* Rocks */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 10 + Math.random() * 35;
        return (
          <mesh key={i} position={[Math.cos(angle) * dist, 0.3, Math.sin(angle) * dist]} castShadow
            rotation={[Math.random(), Math.random(), Math.random()]}>
            <dodecahedronGeometry args={[0.4 + Math.random() * 0.8, 0]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Trees at perimeter */}
      <Trees />

      {/* Base platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.2, 16]} />
        <meshStandardMaterial color="#2a4a1a" roughness={0.8} />
      </mesh>
    </>
  );
}
