import { C } from '../tokens';
import Icon from '../components/Icon';
import LONDON_AREAS from '../data/londonAreas';

const TOP_AREAS = LONDON_AREAS.slice(0, 3);

export default function HomeScreen({ onTab, searchPartners }) {
  return (
    <div className="page-content">
      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 14, color: C.muted, fontWeight: 500, marginBottom: 8 }}>Good morning</p>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 44, color: C.text, lineHeight: 1.1, marginBottom: 16 }}>
          Find your <em>perfect nest</em>
        </h1>
        <div onClick={() => onTab('areas')} style={{
          maxWidth: 520, background: C.card, border: `1.5px solid ${C.faint}`,
          borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
        }}>
          <Icon name="search" size={18} color={C.muted} />
          <span style={{ color: C.muted, fontSize: 15 }}>Search areas, postcodes, neighbourhoods…</span>
        </div>
      </div>

      {/* Search partner banner */}
      {searchPartners.length > 0 && (
        <div style={{
          background: `linear-gradient(135deg, ${C.tealLight}, #e8f4f2)`,
          borderRadius: 16, padding: '16px 20px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 14,
          border: `1px solid ${C.teal}30`, maxWidth: 560,
        }}>
          <div style={{ display: 'flex' }}>
            {searchPartners.map((p, i) => (
              <div key={i} style={{
                width: 34, height: 34, borderRadius: '50%',
                background: [C.teal, C.gold, C.accent][i % 3],
                border: '2px solid white', marginLeft: i > 0 ? -10 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'white',
              }}>{p.name[0]}</div>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.teal }}>
              Searching with {searchPartners.map(p => p.name).join(' & ')}
            </p>
            <p style={{ fontSize: 12, color: C.muted }}>3 areas in common · 2 new matches</p>
          </div>
        </div>
      )}

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

        {/* Top area matches */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: C.text }}>Top area matches</h2>
            <button onClick={() => onTab('areas')} style={{ fontSize: 14, color: C.accent, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}>
              Run search →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TOP_AREAS.map((a, i) => (
              <div key={a.id} style={{
                background: C.card, borderRadius: 14, padding: '16px 18px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', gap: 14,
                border: `1px solid ${i === 0 ? C.accent + '30' : C.faint}`,
                cursor: 'pointer',
              }} onClick={() => onTab('areas')}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: a.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>{a.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{a.name}</span>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: i === 0 ? C.accent : i === 1 ? C.teal : C.gold,
                      background: i === 0 ? C.accentLight : i === 1 ? C.tealLight : C.goldLight,
                      padding: '3px 10px', borderRadius: 20,
                    }}>£{(a.avgPrice / 1000).toFixed(0)}k avg</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: C.muted }}>+{a.priceChange}% <span style={{ color: '#22c55e', fontWeight: 600 }}>↑</span></span>
                    <span style={{ fontSize: 12, color: C.muted }}>Schools: {a.schoolScore}%</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{a.transportLines[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 16 }}>Quick actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Search Areas', sub: 'Live crime & school data', icon: 'map', tab: 'areas', color: C.accent },
              { label: 'Discover', sub: 'Swipe to explore', icon: 'swipe', tab: 'swipe', color: C.teal },
              { label: 'Purchase Tracker', sub: '2 of 5 stages done', icon: 'check', tab: 'tracker', color: C.gold },
              { label: 'Search Together', sub: 'Invite co-searchers', icon: 'users', tab: 'together', color: '#8b5cf6' },
            ].map(q => (
              <button key={q.tab} onClick={() => onTab(q.tab)} style={{
                background: C.card, border: `1px solid ${C.faint}`,
                borderRadius: 14, padding: '18px', textAlign: 'left',
                cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: q.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                }}>
                  <Icon name={q.icon} size={20} color={q.color} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{q.label}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{q.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature callout */}
      <div style={{
        marginTop: 40, padding: '24px 28px',
        background: `linear-gradient(135deg, ${C.accentLight}, #fff8f5)`,
        borderRadius: 16, border: `1px solid ${C.accent}20`,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ fontSize: 40 }}>🔍</div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            Area Search uses live data
          </h3>
          <p style={{ fontSize: 14, color: C.muted }}>
            Crime figures from data.police.uk · Transport from TfL API · Amenities from OpenStreetMap
          </p>
        </div>
        <button onClick={() => onTab('areas')} style={{
          marginLeft: 'auto', padding: '10px 20px',
          background: C.accent, color: 'white', border: 'none',
          borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'DM Sans', flexShrink: 0,
        }}>Try it →</button>
      </div>
    </div>
  );
}
