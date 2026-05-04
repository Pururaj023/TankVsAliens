import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Tank from './Tank';
import Alien from './Alien';
import Projectile from './Projectile';
import Explosion from './Explosion';
import Ground from './Ground';
import GameLogic from './GameLogic';
import SceneWatcher from './SceneWatcher';

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#334455" />
      <directionalLight
        position={[20, 40, 20]}
        intensity={1.2}
        color="#8899ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={150}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <hemisphereLight skyColor="#1a1a3a" groundColor="#0a2a05" intensity={0.5} />
    </>
  );
}

export default function GameCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 9, 14], fov: 60, near: 0.1, far: 500 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <Lighting />
        <Ground />
        <GameLogic />
        {/* SceneWatcher reads store & conditionally renders game objects */}
        <SceneWatcher />
      </Suspense>
    </Canvas>
  );
}
