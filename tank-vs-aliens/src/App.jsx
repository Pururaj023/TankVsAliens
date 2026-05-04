import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import MenuScreen from './components/MenuScreen';
import './App.css';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000', cursor: 'crosshair', position: 'relative' }}>
      {/* Canvas fills the whole screen, always rendered */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <GameCanvas />
      </div>
      {/* HUD on top */}
      <HUD />
      {/* Menu screen on top of everything, pointer-events only when visible */}
      <MenuScreen />
    </div>
  );
}
