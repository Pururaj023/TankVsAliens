import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const TANK_SPEED = 8;
const ROTATION_SPEED = 2.2;
const PROJECTILE_SPEED = 45;
const SHOOT_COOLDOWN = 0.35;

const keys = {};
let shootCooldown = 0;
let mouseX = 0;
let mouseY = 0;

// Reusable objects — avoid allocating every frame
const _raycaster = new THREE.Raycaster();
const _aimTarget = new THREE.Vector3();
const _aimPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y=0 ground plane
const _turretWorldPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _shootDir = new THREE.Vector3();
const _muzzlePos = new THREE.Vector3();
const _camOffset = new THREE.Vector3();
const _desiredCam = new THREE.Vector3();

export default function Tank() {
  const tankRef = useRef();
  const turretRef = useRef();
  const barrelRef = useRef();
  const muzzleRef = useRef(); // invisible marker at barrel tip

  const { camera, gl } = useThree();

  useEffect(() => {
    const onKeyDown = (e) => { keys[e.code] = true; };
    const onKeyUp   = (e) => { keys[e.code] = false; };
    const onMove    = (e) => {
      mouseX = (e.clientX / window.innerWidth)  *  2 - 1;
      mouseY = (e.clientY / window.innerHeight) * -2 + 1;
    };
    const onDown = (e) => { if (e.button === 0) keys['Fire'] = true; };
    const onUp   = (e) => { if (e.button === 0) keys['Fire'] = false; };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    window.addEventListener('mousemove', onMove);
    gl.domElement.addEventListener('mousedown', onDown);
    gl.domElement.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      window.removeEventListener('mousemove', onMove);
      gl.domElement.removeEventListener('mousedown', onDown);
      gl.domElement.removeEventListener('mouseup',   onUp);
      Object.keys(keys).forEach(k => delete keys[k]);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const {
      gameState, tankPosition, tankRotation,
      setTankPosition, setTankRotation, fireProjectile,
    } = useGameStore.getState();

    if (gameState !== 'playing' || !tankRef.current || !turretRef.current) return;

    shootCooldown = Math.max(0, shootCooldown - delta);

    // ── Movement ──────────────────────────────────────────────────────────────
    let [px, py, pz] = tankPosition;
    let rot = tankRotation;

    if (keys['KeyA'] || keys['ArrowLeft'])  rot += ROTATION_SPEED * delta;
    if (keys['KeyD'] || keys['ArrowRight']) rot -= ROTATION_SPEED * delta;

    // Forward is -Z in local space, so world forward = (-sinR, 0, -cosR)
    if (keys['KeyW'] || keys['ArrowUp']) {
      px -= Math.sin(rot) * TANK_SPEED * delta;
      pz -= Math.cos(rot) * TANK_SPEED * delta;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
      px += Math.sin(rot) * TANK_SPEED * delta;
      pz += Math.cos(rot) * TANK_SPEED * delta;
    }

    px = Math.max(-45, Math.min(45, px));
    pz = Math.max(-45, Math.min(45, pz));
    py = 0.5;

    setTankPosition([px, py, pz]);
    setTankRotation(rot);
    tankRef.current.position.set(px, py, pz);
    tankRef.current.rotation.y = rot;

    // ── Turret aiming with lookAt ──────────────────────────────────────────
    // Cast mouse ray onto the ground plane (y = 0)
    _raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
    const hit = _raycaster.ray.intersectPlane(_aimPlane, _aimTarget);

    if (hit) {
      // Get turret's current world position
      turretRef.current.getWorldPosition(_turretWorldPos);

      // We want the turret to face the aim point, but only rotate on Y.
      // Set look target at same Y as turret so it stays level.
      _lookTarget.set(_aimTarget.x, _turretWorldPos.y, _aimTarget.z);

      // lookAt in world space, then convert to local (parent = tank body)
      turretRef.current.parent.updateMatrixWorld();
      const parentInverse = new THREE.Matrix4().copy(turretRef.current.parent.matrixWorld).invert();

      // Direction from turret toward aim point
      const worldDir = _lookTarget.clone().sub(_turretWorldPos).normalize();
      // +PI because the barrel mesh points toward -Z (Three.js default forward is +Z)
      const angle = Math.atan2(worldDir.x, worldDir.z) + Math.PI;

      // Apply as local rotation relative to tank body
      turretRef.current.rotation.y = angle - rot;
    }

    // ── Shoot ─────────────────────────────────────────────────────────────────
    if ((keys['Fire'] || keys['Space']) && shootCooldown <= 0) {
      shootCooldown = SHOOT_COOLDOWN;

      // Get muzzle world position from the invisible marker mesh
      if (muzzleRef.current) {
        muzzleRef.current.getWorldPosition(_muzzlePos);
      } else {
        _muzzlePos.set(px, py + 1.2, pz);
      }

      // Shoot direction = vector from tank center toward aim point, flat on XZ
      if (hit) {
        _shootDir.set(_aimTarget.x - px, 0, _aimTarget.z - pz).normalize();
      } else {
        // Fallback: shoot where tank faces
        _shootDir.set(-Math.sin(rot), 0, -Math.cos(rot));
      }
      _shootDir.y = 0.1; // slight upward arc to reach airborne aliens
      _shootDir.normalize();

      fireProjectile(
        [_muzzlePos.x, _muzzlePos.y, _muzzlePos.z],
        [_shootDir.x * PROJECTILE_SPEED, _shootDir.y * PROJECTILE_SPEED, _shootDir.z * PROJECTILE_SPEED]
      );

      // Barrel recoil
      if (barrelRef.current) {
        barrelRef.current.position.z = 0.25; // push back along local -Z
        setTimeout(() => { if (barrelRef.current) barrelRef.current.position.z = 0; }, 120);
      }
    }

    // ── Camera follow ─────────────────────────────────────────────────────────
    _camOffset.set(Math.sin(rot) * 14, 9, Math.cos(rot) * 14);
    _desiredCam.set(px, py, pz).add(_camOffset);
    camera.position.lerp(_desiredCam, 0.1);
    camera.lookAt(px, py + 1, pz);
  });

  return (
    <group ref={tankRef}>
      {/* Hull lower */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.45, 3.6]} />
        <meshStandardMaterial color="#3a6230" roughness={0.9} metalness={0.2} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.3, 0.65, 3.1]} />
        <meshStandardMaterial color="#4a7c3f" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* Left track */}
      <mesh position={[-1.35, -0.1, 0]} castShadow>
        <boxGeometry args={[0.42, 0.55, 3.7]} />
        <meshStandardMaterial color="#222" roughness={1} />
      </mesh>
      {/* Right track */}
      <mesh position={[1.35, -0.1, 0]} castShadow>
        <boxGeometry args={[0.42, 0.55, 3.7]} />
        <meshStandardMaterial color="#222" roughness={1} />
      </mesh>
      {/* Track bolts */}
      {[-1.4, -0.7, 0, 0.7, 1.4].map((z, i) => (
        <group key={i}>
          <mesh position={[-1.36, -0.08, z]}>
            <boxGeometry args={[0.44, 0.18, 0.22]} />
            <meshStandardMaterial color="#111" roughness={1} />
          </mesh>
          <mesh position={[1.36, -0.08, z]}>
            <boxGeometry args={[0.44, 0.18, 0.22]} />
            <meshStandardMaterial color="#111" roughness={1} />
          </mesh>
        </group>
      ))}

      {/* Turret — rotates independently on Y via ref */}
      <group ref={turretRef} position={[0, 0.6, -0.1]}>
        {/* Turret dome */}
        <mesh castShadow>
          <cylinderGeometry args={[0.78, 0.95, 0.7, 8]} />
          <meshStandardMaterial color="#5a8c4f" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Hatch */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.14, 8]} />
          <meshStandardMaterial color="#3a6230" roughness={0.7} />
        </mesh>

        {/* Barrel — points toward -Z (Three.js default forward) */}
        <group ref={barrelRef}>
          {/* Main tube: center at z=-1.2, length 2.4, so tip at z=-2.4 */}
          <mesh position={[0, 0.12, -1.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.17, 2.4, 8]} />
            <meshStandardMaterial color="#2d5025" roughness={0.5} metalness={0.6} />
          </mesh>
          {/* Muzzle brake at tip */}
          <mesh position={[0, 0.12, -2.42]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.19, 0.13, 0.28, 8]} />
            <meshStandardMaterial color="#1a3a18" metalness={0.7} />
          </mesh>
          {/* Invisible muzzle marker — world position read for projectile spawn */}
          <mesh ref={muzzleRef} position={[0, 0.12, -2.6]} visible={false}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial />
          </mesh>
        </group>
      </group>

      {/* Antenna */}
      <mesh position={[0.8, 0.95, -0.9]}>
        <cylinderGeometry args={[0.025, 0.025, 1.3, 5]} />
        <meshStandardMaterial color="#555" metalness={0.9} />
      </mesh>
    </group>
  );
}
