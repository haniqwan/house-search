import { useState } from 'react';
import { C } from '../tokens';
import Icon from '../components/Icon';
import PrioritySlider from '../components/PrioritySlider';

const results = [
  { name: 'Hackney', score: 94, crime: 'Low', schools: 'Outstanding', price: '£550k avg', trend: '+8%' },
  { name: 'Stoke Newington', score: 89, crime: 'Low', schools: 'Good', price: '£620k avg', trend: '+5%' },
  { name: 'Walthamstow', score: 86, crime: 'Low', schools: 'Outstanding', price: '£480k avg', trend: '+6%' },
  { name: 'Peckham', score: 82, crime: 'Medium', schools: 'Good', price: '£510k avg', trend: '+12%' },
];

export default function AreaSearchScreen() {
  const [priorities, setPriorities] = useState({ crime: 3, schools: 2, transport: 3, amenities: 1, prices: 2, distance: 2 });
  const [amenities, setAmenities] = useState({ supermarket: true, gym: false, cafes: true, restaurants: true });
  const [transport, setTransport] = useState({ tube: true, thameslink: false });
  const [spots, setSpots] = useState([{ label: 'Work — Canary Wharf', time: '22 min' }]);
  const [tab, setTab] = useState('filters');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ padding: '56px 20px 0', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 26, color: C.text, marginBottom: 4 }}>Area Search</h1>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Set your priorities, we'll find the best match</p>
        <div style={{ display: 'flex', background: C.bgAlt, borderRadius: 12, padding: 3, marginBottom: 4 }}>
          {[['filters', 'Priorities'], ['results', 'Results']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans', fontSize: 14, fontWeight: 600,
              background: tab === id ? C.card : 'transparent',
              color: tab === id ? C.text : C.muted,
              boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 90px' }}>
        {tab === 'filters' ? (
          <>
            <div style={{ background: C.card, borderRadius: 16, padding: '16px', marginBottom: 14, border: `1px solid ${C.faint}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Priority Levels</h3>
              <PrioritySlider label="Low Crime" icon="shield" value={priorities.crime} onChange={v => setPriorities(p => ({...p, crime: v}))} color={C.accent} />
              <PrioritySlider label="School Quality" icon="school" value={priorities.schools} onChange={v => setPriorities(p => ({...p, schools: v}))} color={C.teal} />
              <PrioritySlider label="Transport Links" icon="bus" value={priorities.transport} onChange={v => setPriorities(p => ({...p, transport: v}))} color={C.gold} />
              <PrioritySlider label="Amenities" icon="star" value={priorities.amenities} onChange={v => setPriorities(p => ({...p, amenities: v}))} color="#8b5cf6" />
              <PrioritySlider label="Rising Prices" icon="trend" value={priorities.prices} onChange={v => setPriorities(p => ({...p, prices: v}))} color="#ef4444" />
              <PrioritySlider label="Distance from Spots" icon="pin" value={priorities.distance} onChange={v => setPriorities(p => ({...p, distance: v}))} color="#f97316" />
            </div>

            <div style={{ background: C.card, borderRadius: 16, padding: '16px', marginBottom: 14, border: `1px solid ${C.faint}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Important Amenities</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[['supermarket','🛒','Supermarket'],['gym','💪','Gym'],['cafes','☕','Cafés'],['restaurants','🍽️','Restaurants']].map(([key, emoji, label]) => (
                  <button key={key} onClick={() => setAmenities(a => ({...a, [key]: !a[key]}))} style={{
                    padding: '8px 14px', borderRadius: 20, border: `1.5px solid ${amenities[key] ? C.accent : C.faint}`,
                    background: amenities[key] ? C.accentLight : 'transparent',
                    color: amenities[key] ? C.accent : C.muted,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}><span>{emoji}</span>{label}</button>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, borderRadius: 16, padding: '16px', marginBottom: 14, border: `1px solid ${C.faint}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Transport Needed</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['tube','🚇','Tube'],['thameslink','🚆','Thameslink']].map(([key, emoji, label]) => (
                  <button key={key} onClick={() => setTransport(t => ({...t, [key]: !t[key]}))} style={{
                    flex: 1, padding: '10px', borderRadius: 12, border: `1.5px solid ${transport[key] ? C.teal : C.faint}`,
                    background: transport[key] ? C.tealLight : 'transparent',
                    color: transport[key] ? C.teal : C.muted,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans',
                  }}><span style={{ fontSize: 18, display: 'block' }}>{emoji}</span>{label}</button>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, borderRadius: 16, padding: '16px', marginBottom: 14, border: `1px solid ${C.faint}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Regular Spots</h3>
              {spots.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.faint}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: C.accentLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="pin" size={15} color={C.accent} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>Max {s.time} away</div>
                    </div>
                  </div>
                  <button onClick={() => setSpots(ss => ss.filter((_, ii) => ii !== i))} style={{ border: 'none', background: 'none', color: C.muted, cursor: 'pointer', fontSize: 18 }}>×</button>
                </div>
              ))}
              <button onClick={() => setSpots(ss => [...ss, { label: 'New spot', time: '30 min' }])} style={{
                marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', color: C.accent, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                <Icon name="plus" size={16} color={C.accent} /> Add a spot
              </button>
            </div>

            <button onClick={() => setTab('results')} style={{
              width: '100%', padding: '14px', background: C.accent, color: 'white',
              border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'DM Sans',
            }}>Find my areas →</button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>4 areas match your priorities</p>
            {results.map((r, i) => (
              <div key={i} style={{
                background: C.card, borderRadius: 16, padding: 16, marginBottom: 12,
                border: `1px solid ${i === 0 ? C.accent + '40' : C.faint}`,
                boxShadow: i === 0 ? `0 4px 20px ${C.accent}15` : '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{r.name}</span>
                      {i === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, background: C.accentLight, padding: '2px 8px', borderRadius: 10 }}>BEST MATCH</span>}
                    </div>
                    <span style={{ fontSize: 13, color: C.muted }}>{r.price} · Prices {r.trend} ↑</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: i === 0 ? C.accent : i === 1 ? C.teal : C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{r.score}</span>
                    </div>
                    <span style={{ fontSize: 10, color: C.muted }}>score</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[`🛡️ ${r.crime} crime`, `🏫 ${r.schools}`, `🚇 Tube nearby`].map(tag => (
                    <span key={tag} style={{ fontSize: 11, color: C.muted, background: C.bgAlt, padding: '4px 8px', borderRadius: 8, fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
