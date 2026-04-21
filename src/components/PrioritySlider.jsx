import { C } from '../tokens';
import Icon from './Icon';

const levels = ['Off', 'Low', 'Medium', 'High', 'Must'];

export default function PrioritySlider({ label, icon, value, onChange, color = C.accent }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: value > 0 ? color + '20' : C.bgAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={icon} size={15} color={value > 0 ? color : C.muted} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{label}</span>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, color: value > 0 ? color : C.muted,
          background: value > 0 ? color + '15' : C.bgAlt,
          padding: '3px 10px', borderRadius: 20,
        }}>{levels[value]}</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: C.faint, borderRadius: 3 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${(value / 4) * 100}%`, background: color, borderRadius: 3,
          transition: 'width 0.2s',
        }} />
        <input type="range" min={0} max={4} value={value} onChange={e => onChange(+e.target.value)}
          style={{
            position: 'absolute', inset: 0, width: '100%', opacity: 0,
            cursor: 'pointer', height: '100%', margin: 0,
          }}
        />
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} onClick={() => onChange(i)} style={{
            position: 'absolute', top: '50%', left: `${(i / 4) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: i === value ? 16 : 8, height: i === value ? 16 : 8,
            borderRadius: '50%', background: i <= value ? color : C.faint,
            border: i === value ? '2px solid white' : 'none',
            boxShadow: i === value ? `0 1px 4px ${color}60` : 'none',
            transition: 'all 0.2s', cursor: 'pointer', zIndex: 2,
          }} />
        ))}
      </div>
    </div>
  );
}
