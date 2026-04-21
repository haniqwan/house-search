import { C } from '../tokens';
import Icon from './Icon';

const tabs = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'areas', label: 'Areas', icon: 'map' },
  { id: 'swipe', label: 'Discover', icon: 'swipe' },
  { id: 'finder', label: 'Finder', icon: 'camera' },
  { id: 'tracker', label: 'Tracker', icon: 'check' },
];

export default function TabBar({ active, onTab }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(250,248,244,0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${C.faint}`,
      display: 'flex', padding: '8px 0 28px', zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onTab(t.id)} style={{
          flex: 1, border: 'none', background: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          padding: '4px 0',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: active === t.id ? C.accentLight : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            <Icon name={t.icon} size={20} color={active === t.id ? C.accent : C.muted} />
          </div>
          <span style={{
            fontSize: 10, fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? C.accent : C.muted,
            fontFamily: 'DM Sans',
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
