# 🛸 Tank vs Aliens

A 3D browser game built with React, Three.js (@react-three/fiber), and Zustand.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Controls

| Key | Action |
|-----|--------|
| W / ↑ | Move forward |
| S / ↓ | Move backward |
| A / ← | Rotate left |
| D / → | Rotate right |
| Mouse | Aim turret |
| Left Click / Space | Fire |

## Game Mechanics

- **Aliens** spawn from random directions and descend toward your tank
- Each **UFO destroyed** = 100 points
- **Boss UFOs** (red, larger) appear from Wave 3+ and take 3 hits = 500 points
- **Waves** escalate every 30 seconds — aliens get faster and more frequent
- **You lose a life** when an alien reaches your tank or the ground
- **Game over** when all 3 lives are lost

## Tech Stack

- React 18
- Three.js via @react-three/fiber
- @react-three/drei
- Zustand (state management)
- Vite (build tool)

## Project Structure

```
src/
├── components/
│   ├── GameCanvas.jsx   # Main Canvas setup & scene
│   ├── Tank.jsx         # Player tank + movement + turret
│   ├── Alien.jsx        # UFO alien ships
│   ├── Projectile.jsx   # Tank shells + collision
│   ├── Explosion.jsx    # Particle explosion effects
│   ├── Ground.jsx       # Environment (ground, trees, stars)
│   ├── GameLogic.jsx    # Spawn system + wave management
│   ├── HUD.jsx          # Score/wave/lives overlay
│   └── MenuScreen.jsx   # Start/game-over screens
├── store/
│   └── gameStore.js     # Zustand global state
└── App.jsx
```
