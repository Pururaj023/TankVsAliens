import { useGameStore } from '../store/gameStore';

export default function HUD() {
  const gameState = useGameStore(s => s.gameState);
  const score = useGameStore(s => s.score);
  const wave = useGameStore(s => s.wave);
  const lives = useGameStore(s => s.lives);

  if (gameState !== 'playing') return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      pointerEvents: 'none',
      zIndex: 100,
      fontFamily: '"Courier New", monospace',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 20px' }}>
        {/* Score */}
        <div style={{
          background: 'rgba(0,0,0,0.75)', border: '1px solid #00ff88',
          borderRadius: '4px', padding: '10px 18px', boxShadow: '0 0 16px rgba(0,255,136,0.3)',
        }}>
          <div style={{ color: '#00ff88', fontSize: '11px', letterSpacing: '3px', marginBottom: '2px' }}>SCORE</div>
          <div style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold', textShadow: '0 0 10px #00ff88' }}>
            {score.toString().padStart(6, '0')}
          </div>
        </div>

        {/* Wave */}
        <div style={{
          background: 'rgba(0,0,0,0.75)', border: '1px solid #ff8800',
          borderRadius: '4px', padding: '10px 18px', textAlign: 'center', boxShadow: '0 0 16px rgba(255,136,0,0.3)',
        }}>
          <div style={{ color: '#ff8800', fontSize: '11px', letterSpacing: '3px', marginBottom: '2px' }}>WAVE</div>
          <div style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold', textShadow: '0 0 10px #ff8800' }}>{wave}</div>
        </div>

        {/* Lives */}
        <div style={{
          background: 'rgba(0,0,0,0.75)', border: '1px solid #ff3366',
          borderRadius: '4px', padding: '10px 18px', textAlign: 'right', boxShadow: '0 0 16px rgba(255,51,102,0.3)',
        }}>
          <div style={{ color: '#ff3366', fontSize: '11px', letterSpacing: '3px', marginBottom: '6px' }}>LIVES</div>
          <div style={{ display: 'flex', gap: '7px', justifyContent: 'flex-end' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '18px', height: '18px', borderRadius: '50%',
                background: i < lives ? '#ff3366' : '#333',
                boxShadow: i < lives ? '0 0 8px #ff3366' : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute', bottom: '-100vh', left: '50%', transform: 'translateX(-50%)',
      }} />
      <div style={{
        position: 'fixed', bottom: '18px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '4px', padding: '7px 16px', color: 'rgba(255,255,255,0.45)',
        fontSize: '11px', letterSpacing: '2px', whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>
        WASD — MOVE &nbsp;|&nbsp; MOUSE — AIM &nbsp;|&nbsp; CLICK / SPACE — FIRE
      </div>
    </div>
  );
}
