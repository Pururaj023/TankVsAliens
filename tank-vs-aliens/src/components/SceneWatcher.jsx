import { useGameStore } from '../store/gameStore';
import Tank from './Tank';
import Alien from './Alien';
import Projectile from './Projectile';
import Explosion from './Explosion';

/**
 * Lives INSIDE the Canvas so it can render 3D objects,
 * but subscribes to the Zustand store so it re-renders
 * when gameState / aliens / projectiles change.
 */
export default function SceneWatcher() {
  const gameState = useGameStore(s => s.gameState);
  const aliens = useGameStore(s => s.aliens);
  const projectiles = useGameStore(s => s.projectiles);
  const explosions = useGameStore(s => s.explosions);

  if (gameState !== 'playing') return null;

  return (
    <>
      <Tank />
      {aliens.map(alien => (
        <Alien key={alien.id} alien={alien} />
      ))}
      {projectiles.map(proj => (
        <Projectile key={proj.id} projectile={proj} />
      ))}
      {explosions.map(exp => (
        <Explosion key={exp.id} explosion={exp} />
      ))}
    </>
  );
}
