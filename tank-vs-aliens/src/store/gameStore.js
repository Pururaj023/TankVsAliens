import { create } from 'zustand';

let alienIdCounter = 0;
let projectileIdCounter = 0;

export const useGameStore = create((set, get) => ({
  // Game state
  gameState: 'idle', // 'idle' | 'playing' | 'gameover'
  score: 0,
  wave: 1,
  lives: 3,

  // Tank state
  tankPosition: [0, 0.5, 0],
  tankRotation: 0,
  turretRotation: 0,

  // Aliens
  aliens: [],

  // Projectiles
  projectiles: [],

  // Explosions
  explosions: [],

  // Actions
  startGame: () => set({
    gameState: 'playing',
    score: 0,
    wave: 1,
    lives: 3,
    aliens: [],
    projectiles: [],
    explosions: [],
    tankPosition: [0, 0.5, 0],
    tankRotation: 0,
    turretRotation: 0,
  }),

  endGame: () => set({ gameState: 'gameover' }),

  addScore: (pts) => set((s) => ({ score: s.score + pts })),

  setTankPosition: (pos) => set({ tankPosition: pos }),
  setTankRotation: (rot) => set({ tankRotation: rot }),
  setTurretRotation: (rot) => set({ turretRotation: rot }),

  spawnAlien: (position, velocity, type = 'ufo') => {
    const id = ++alienIdCounter;
    set((s) => ({
      aliens: [...s.aliens, {
        id,
        position: [...position],
        velocity: [...velocity],
        type,
        hp: type === 'boss' ? 3 : 1,
        age: 0,
      }]
    }));
    return id;
  },

  removeAlien: (id) => set((s) => ({
    aliens: s.aliens.filter(a => a.id !== id)
  })),

  updateAlien: (id, updates) => set((s) => ({
    aliens: s.aliens.map(a => a.id === id ? { ...a, ...updates } : a)
  })),

  fireProjectile: (position, direction) => {
    const id = ++projectileIdCounter;
    set((s) => ({
      projectiles: [...s.projectiles, {
        id,
        position: [...position],
        direction: [...direction],
        age: 0,
      }]
    }));
    return id;
  },

  removeProjectile: (id) => set((s) => ({
    projectiles: s.projectiles.filter(p => p.id !== id)
  })),

  updateProjectile: (id, updates) => set((s) => ({
    projectiles: s.projectiles.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  addExplosion: (position) => {
    const id = Date.now() + Math.random();
    set((s) => ({
      explosions: [...s.explosions, { id, position: [...position], age: 0 }]
    }));
    setTimeout(() => {
      set((s) => ({ explosions: s.explosions.filter(e => e.id !== id) }));
    }, 1000);
  },

  loseLife: () => {
    const { lives } = get();
    if (lives <= 1) {
      set({ lives: 0, gameState: 'gameover' });
    } else {
      set((s) => ({ lives: s.lives - 1 }));
    }
  },

  incrementWave: () => set((s) => ({ wave: s.wave + 1 })),
}));
