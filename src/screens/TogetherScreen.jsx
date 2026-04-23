import { useState } from 'react';
import { C } from '../tokens';
import LONDON_AREAS from '../data/londonAreas';

const SHARED_AREAS = ['Hackney', 'Walthamstow', 'Stoke Newington'];
const SUGGESTIONS = ['Partner', 'Emma (flatmate)', 'Mum', 'Dad'];

export default function TogetherScreen({ partners, setPartners }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState([]);

  const invite = (e) => {
    e?.preventDefault();
    if (!email.trim()) return;
    setSent(s => [...s, email.trim()]);
    setEmail('');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Search Together</h1>
        <p>Share your search with a partner, flatmate or family member and find areas you both love.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Your group */}
          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Your search group</h3>

            {/* You */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, padding: '0 0 14px', borderBottom: `1px solid ${C.faint}` }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white', flexShrink: 0 }}>Y</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>You</div>
                <div style={{ fontSize: 12, color: C.muted }}>12 areas saved · 3 properties tracked</div>
              </div>
              <span style={{ fontSize: 11, background: C.accentLight, color: C.accent, padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>Admin</span>
            </div>

            {partners.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, padding: '0 0 14px', borderBottom: `1px solid ${C.faint}` }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: [C.teal, C.gold][i % 2], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white', flexShrink: 0 }}>{p.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{p.areas} areas saved · Active today</div>
                </div>
                <button onClick={() => setPartners(ps => ps.filter((_, ii) => ii !== i))} style={{ fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
              </div>
            ))}

            {sent.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, opacity: 0.6 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: C.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✉️</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.muted }}>{e}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Invite sent — awaiting response</div>
                </div>
              </div>
            ))}
          </div>

          {/* Invite */}
          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Invite someone</h3>
            <form onSubmit={invite} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                style={{ flex: 1, border: `1.5px solid ${C.faint}`, borderRadius: 10, padding: '11px 14px', fontSize: 14, fontFamily: 'DM Sans', background: C.bg, color: C.text, outline: 'none' }}
              />
              <button type="submit" style={{ padding: '11px 20px', background: C.text, color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}>Invite</button>
            </form>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setEmail(s)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 20, border: `1px solid ${C.faint}`, background: C.bgAlt, color: C.muted, cursor: 'pointer', fontFamily: 'DM Sans' }}>+ {s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Shared areas */}
          {partners.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Areas you both like ❤️</h3>
              {SHARED_AREAS.map((name, i) => {
                const area = LONDON_AREAS.find(a => a.name === name);
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < SHARED_AREAS.length - 1 ? `1px solid ${C.faint}` : 'none' }}>
                    <span style={{ fontSize: 22 }}>{area?.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{area?.vibe} · £{area ? (area.avgPrice / 1000).toFixed(0) : '—'}k avg</div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      {['Y', ...partners.map(p => p.name[0])].map((init, j) => (
                        <div key={j} style={{ width: 26, height: 26, borderRadius: '50%', background: [C.accent, C.teal, C.gold][j % 3], border: '2px solid white', marginLeft: j > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>{init}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {partners.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: C.muted }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>👥</div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: C.text, marginBottom: 8 }}>Invite someone to start</h3>
              <p style={{ fontSize: 14 }}>Once they join, you'll see areas you both like and can share your purchase tracker.</p>
            </div>
          )}

          {/* Permissions */}
          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Shared access</h3>
            {[
              ["See each other's saved areas", true],
              ['View purchase tracker', true],
              ['Edit priorities', false],
            ].map(([label, on]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.faint}` }}>
                <span style={{ fontSize: 14, color: C.text }}>{label}</span>
                <div style={{ width: 46, height: 26, borderRadius: 13, background: on ? C.accent : C.faint, position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: on ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
