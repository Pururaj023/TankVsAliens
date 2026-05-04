import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

function PulsingButton({ onClick, children, color = '#00ff88' }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? color : 'transparent',
        color: hover ? '#000' : color,
        border: `2px solid ${color}`,
        padding: '14px 48px',
        fontSize: '18px',
        fontFamily: '"Courier New", monospace',
        letterSpacing: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: hover ? `0 0 30px ${color}` : `0 0 10px ${color}44`,
        borderRadius: '2px',
        marginTop: '12px',
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  );
}

export default function MenuScreen() {
  const gameState = useGameStore(s => s.gameState);
  const score = useGameStore(s => s.score);
  const wave = useGameStore(s => s.wave);
  const startGame = useGameStore(s => s.startGame);

  if (gameState === 'playing') return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #050a0a 0%, #000005 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      {/* Scan lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
      }} />

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(0,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.05) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      {/* UFO */}
      <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>
        🛸
      </div>

      {/* Title */}
      <div style={{
        fontSize: 'clamp(36px, 8vw, 72px)',
        fontWeight: '900',
        fontFamily: '"Courier New", monospace',
        letterSpacing: '6px',
        color: '#00ff88',
        textShadow: '0 0 30px #00ff88, 0 0 60px #00ff4488',
        lineHeight: 1.1,
        textAlign: 'center',
      }}>
        {gameState === 'gameover' ? 'GAME OVER' : 'TANK VS ALIENS'}
      </div>

      {/* Game over stats */}
      {gameState === 'gameover' && (
        <div style={{ marginTop: '24px', display: 'flex', gap: '40px', fontFamily: '"Courier New", monospace' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: '12px', letterSpacing: '3px' }}>FINAL SCORE</div>
            <div style={{ color: '#00ff88', fontSize: '36px', fontWeight: 'bold', textShadow: '0 0 15px #00ff88' }}>
              {score.toString().padStart(6, '0')}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: '12px', letterSpacing: '3px' }}>WAVE REACHED</div>
            <div style={{ color: '#ff8800', fontSize: '36px', fontWeight: 'bold', textShadow: '0 0 15px #ff8800' }}>
              {wave}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {gameState === 'idle' && (
        <div style={{
          marginTop: '28px',
          color: 'rgba(0,255,136,0.55)',
          fontFamily: '"Courier New", monospace',
          fontSize: '13px',
          letterSpacing: '2px',
          textAlign: 'center',
          lineHeight: 2.2,
        }}>
          <div>WASD / ARROWS &nbsp;—&nbsp; MOVE TANK</div>
          <div>MOUSE &nbsp;—&nbsp; AIM TURRET</div>
          <div>CLICK / SPACE &nbsp;—&nbsp; FIRE</div>
          <div style={{ color: '#ff8800', marginTop: '6px' }}>DESTROY ALIEN SHIPS FOR POINTS</div>
          <div style={{ color: '#ff3366' }}>DON'T LET THEM REACH YOUR TANK!</div>
        </div>
      )}

      {/* Button */}
      <PulsingButton onClick={startGame}>
        {gameState === 'gameover' ? '[ PLAY AGAIN ]' : '[ START MISSION ]'}
      </PulsingButton>

      <div style={{
        position: 'absolute', bottom: '20px',
        color: 'rgba(255,255,255,0.2)',
        fontFamily: '"Courier New", monospace',
        fontSize: '11px', letterSpacing: '3px',
      }}>
        TANK VS ALIENS — DEFEND EARTH
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
