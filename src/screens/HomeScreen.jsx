import { C } from '../tokens';
import Icon from '../components/Icon';

const areas = [
  { name: 'Hackney', match: 94, trend: '+8%', crime: 'Low', schools: '★★★★' },
  { name: 'Peckham', match: 87, trend: '+12%', crime: 'Med', schools: '★★★' },
  { name: 'Walthamstow', match: 83, trend: '+6%', crime: 'Low', schools: '★★★★' },
];

export default function HomeScreen({ onTab, searchPartners }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <div style={{ padding: '60px 20px 0', background: C.bg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 4 }}>Good morning</p>
            <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 28, color: C.text, lineHeight: 1.1 }}>
              Find your<br /><em>perfect nest</em>
            </h1>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bell" size={18} color={C.accent} />
          </div>
        </div>

        <div onClick={() => onTab('areas')} style={{
          marginTop: 20, background: C.card, border: `1.5px solid ${C.faint}`,
          borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <Icon name="search" size={18} color={C.muted} />
          <span style={{ color: C.muted, fontSize: 15 }}>Search areas, postcodes…</span>
        </div>
      </div>

      {searchPartners.length > 0 && (
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.tealLight}, #e8f4f2)`,
            borderRadius: 14, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            border: `1px solid ${C.teal}30`,
          }}>
            <div style={{ display: 'flex' }}>
              {searchPartners.map((p, i) => (
                <div key={i} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: [C.teal, C.gold, C.accent][i % 3],
                  border: '2px solid white', marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white',
                }}>{p.name[0]}</div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>Searching with {searchPartners.map(p => p.name).join(' & ')}</p>
              <p style={{ fontSize: 11, color: C.muted }}>3 areas in common • 2 new matches</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text }}>Top area matches</h2>
          <button onClick={() => onTab('areas')} style={{ fontSize: 13, color: C.accent, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}>See all</button>
        </div>
        {areas.map((a, i) => (
          <div key={i} style={{
            background: C.card, borderRadius: 14, padding: '14px 16px',
            marginBottom: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', gap: 14,
            border: `1px solid ${C.faint}`,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: i === 0 ? C.accentLight : i === 1 ? C.tealLight : C.goldLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 20 }}>{i === 0 ? '🏙️' : i === 1 ? '🌳' : '🏘️'}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{a.name}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: i === 0 ? C.accent : i === 1 ? C.teal : C.gold,
                  background: i === 0 ? C.accentLight : i === 1 ? C.tealLight : C.goldLight,
                  padding: '2px 8px', borderRadius: 20,
                }}>{a.match}% match</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 12, color: C.muted }}>Prices {a.trend} <span style={{ color: '#22c55e', fontWeight: 600 }}>↑</span></span>
                <span style={{ fontSize: 12, color: C.muted }}>Crime: {a.crime}</span>
                <span style={{ fontSize: 12, color: C.muted }}>{a.schools}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '4px 20px 0' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 14 }}>Quick actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Spot a house', sub: 'Search nearby listings', icon: 'camera', tab: 'finder', color: C.accent },
            { label: 'Discover areas', sub: 'Swipe to explore', icon: 'swipe', tab: 'swipe', color: C.teal },
            { label: 'Purchase tracker', sub: '4 steps complete', icon: 'check', tab: 'tracker', color: C.gold },
            { label: 'Search together', sub: 'Invite co-searchers', icon: 'users', tab: 'together', color: '#8b5cf6' },
          ].map(q => (
            <button key={q.tab} onClick={() => onTab(q.tab)} style={{
              background: C.card, border: `1px solid ${C.faint}`,
              borderRadius: 14, padding: '14px', textAlign: 'left',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: q.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 8,
              }}>
                <Icon name={q.icon} size={18} color={q.color} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{q.label}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{q.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
