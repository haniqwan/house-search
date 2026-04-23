import { C } from '../tokens';
import Icon from './Icon';

const tabs = [
  { id: 'home',    label: 'Home',     icon: 'home' },
  { id: 'areas',   label: 'Areas',    icon: 'map' },
  { id: 'swipe',   label: 'Discover', icon: 'swipe' },
  { id: 'finder',  label: 'Finder',   icon: 'camera' },
  { id: 'tracker', label: 'Tracker',  icon: 'check' },
  { id: 'together',label: 'Together', icon: 'users' },
];

export default function Header({ screen, onNav }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(250,248,244,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.faint}`,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        padding: '0 28px', height: 60,
        gap: 40,
      }}>
        {/* Logo */}
        <button onClick={() => onNav('home')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="home" size={16} color="white" />
          </div>
          <span style={{
            fontFamily: 'DM Serif Display', fontSize: 22,
            color: C.text, letterSpacing: '-0.02em',
          }}>Nest</span>
        </button>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => onNav(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              border: 'none', cursor: 'pointer',
              background: screen === t.id ? C.accentLight : 'transparent',
              color: screen === t.id ? C.accent : C.muted,
              fontSize: 14, fontWeight: screen === t.id ? 600 : 400,
              fontFamily: 'DM Sans',
              transition: 'all 0.15s',
            }}>
              <Icon name={t.icon} size={15} color={screen === t.id ? C.accent : C.muted} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: C.accentLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Icon name="bell" size={16} color={C.accent} />
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'white',
          }}>H</div>
        </div>
      </div>
    </header>
  );
}
