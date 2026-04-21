import { useState } from 'react';
import { C } from '../tokens';

const sharedAreas = ['Hackney', 'Walthamstow', 'Stoke Newington'];
const suggestions = ['Emma (flatmate)', 'Partner', 'Mum'];

export default function TogetherScreen({ partners, setPartners }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState([]);

  const invite = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!email.trim()) return;
    setSent(s => [...s, email]);
    setEmail('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ padding: '56px 20px 16px', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 26, color: C.text }}>Search Together</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Find your perfect home as a team</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 90px' }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14, border: `1px solid ${C.faint}` }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Your search group</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white' }}>Y</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>You</div>
              <div style={{ fontSize: 12, color: C.muted }}>12 areas saved · 3 properties tracked</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 11, background: C.accentLight, color: C.accent, padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>Admin</span>
          </div>

          {partners.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: [C.teal, C.gold][i % 2], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white' }}>{p.name[0]}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{p.areas} areas saved · Active today</div>
              </div>
              <button onClick={() => setPartners(ps => ps.filter((_, ii) => ii !== i))} style={{ marginLeft: 'auto', fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}

          {sent.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, opacity: 0.6 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✉️</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.muted }}>{e}</div>
                <div style={{ fontSize: 12, color: C.muted }}>Invite sent — awaiting response</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14, border: `1px solid ${C.faint}` }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Invite someone</h3>
          <form onSubmit={invite}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"
                style={{ flex: 1, border: `1.5px solid ${C.faint}`, borderRadius: 12, padding: '12px 14px', fontSize: 14, fontFamily: 'DM Sans', background: C.bg, color: C.text, outline: 'none' }}
              />
              <button type="submit" style={{ padding: '12px 18px', background: C.text, color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}>Invite</button>
            </div>
          </form>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => setEmail(s)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 20, border: `1px solid ${C.faint}`, background: C.bgAlt, color: C.muted, cursor: 'pointer', fontFamily: 'DM Sans' }}>+ {s}</button>
            ))}
          </div>
        </div>

        {partners.length > 0 && (
          <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14, border: `1px solid ${C.faint}` }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Areas you both like ❤️</h3>
            {sharedAreas.map((a, i) => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < sharedAreas.length - 1 ? `1px solid ${C.faint}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{'🏙️🌳🏘️'[i]}</span>
                  <span style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{a}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  {['Y', ...partners.map(p => p.name[0])].map((init, j) => (
                    <div key={j} style={{ width: 24, height: 24, borderRadius: '50%', background: [C.accent, C.teal, C.gold][j % 3], border: '2px solid white', marginLeft: j > 0 ? -6 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>{init}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: C.card, borderRadius: 16, padding: 16, border: `1px solid ${C.faint}` }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Shared access</h3>
          {[["See each other's saved areas", true], ['View purchase tracker', true], ['Edit priorities', false]].map(([label, on]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.faint}` }}>
              <span style={{ fontSize: 14, color: C.text }}>{label}</span>
              <div style={{ width: 44, height: 26, borderRadius: 13, background: on ? C.accent : C.faint, position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: on ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
