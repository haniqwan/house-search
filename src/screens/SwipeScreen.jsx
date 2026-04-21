import { useState } from 'react';
import { C } from '../tokens';
import Icon from '../components/Icon';

const areaCards = [
  { name: 'Hackney', emoji: '🏙️', price: '£550k avg', school: 'Outstanding', crime: 'Low', vibe: 'Creative & vibrant', trend: '+8% this year', tags: ['Tube', 'Great cafés', 'Parks'], color: '#f97316' },
  { name: 'Peckham', emoji: '🌳', price: '£510k avg', school: 'Good', crime: 'Medium', vibe: 'Up & coming', trend: '+12% this year', tags: ['Overground', 'Restaurants', 'Art scene'], color: C.teal },
  { name: 'Walthamstow', emoji: '🏘️', price: '£480k avg', school: 'Outstanding', crime: 'Low', vibe: 'Leafy & community', trend: '+6% this year', tags: ['Victoria Line', 'Market', 'Parks'], color: C.gold },
  { name: 'Brixton', emoji: '🎵', price: '£530k avg', school: 'Good', crime: 'Medium', vibe: 'Buzzing & diverse', trend: '+9% this year', tags: ['Victoria Line', 'Market', 'Nightlife'], color: '#8b5cf6' },
];

export default function SwipeScreen() {
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const [liked, setLiked] = useState([]);
  const [passed, setPassed] = useState([]);
  const [animDir, setAnimDir] = useState(null);
  const [gone, setGone] = useState(false);

  const card = areaCards[idx % areaCards.length];
  const nextCard = areaCards[(idx + 1) % areaCards.length];

  const act = (dir) => {
    setAnimDir(dir);
    setGone(true);
    setTimeout(() => {
      if (dir === 'right') setLiked(l => [...l, card.name]);
      else setPassed(p => [...p, card.name]);
      setIdx(i => i + 1);
      setDrag(0);
      setAnimDir(null);
      setGone(false);
    }, 350);
  };

  const cardStyle = {
    position: 'absolute', inset: 0,
    transform: gone
      ? `translateX(${animDir === 'right' ? 400 : -400}px) rotate(${animDir === 'right' ? 20 : -20}deg)`
      : `translateX(${drag}px) rotate(${drag * 0.05}deg)`,
    transition: gone ? 'transform 0.35s cubic-bezier(0.4,0,0.2,1)' : 'none',
    cursor: 'grab',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ padding: '56px 20px 0', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 26, color: C.text }}>Discover Areas</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Swipe right to save, left to pass</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 12, color: C.accent, background: C.accentLight, padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>❤️ {liked.length} saved</span>
          <span style={{ fontSize: 12, color: C.muted, background: C.bgAlt, padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>✗ {passed.length} passed</span>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', padding: '16px 20px 0', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 20, right: 20, top: 16, bottom: 0,
          transform: 'scale(0.95) translateY(12px)',
          borderRadius: 24, overflow: 'hidden',
          background: nextCard.color + '30', border: `1px solid ${C.faint}`,
        }}>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 60 }}>{nextCard.emoji}</span>
          </div>
        </div>

        <div style={cardStyle}
          onMouseDown={e => {
            const sx = e.clientX;
            const move = ev => setDrag(ev.clientX - sx);
            const up = () => {
              document.removeEventListener('mousemove', move);
              document.removeEventListener('mouseup', up);
              if (Math.abs(drag) > 80) act(drag > 0 ? 'right' : 'left');
              else setDrag(0);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
          }}
        >
          <div style={{
            height: '100%', borderRadius: 24, overflow: 'hidden',
            background: C.card, boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            border: `1px solid ${C.faint}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              height: 200, background: `linear-gradient(160deg, ${card.color}30, ${card.color}10)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', flexShrink: 0,
            }}>
              <span style={{ fontSize: 72 }}>{card.emoji}</span>
              {drag > 20 && <div style={{ position: 'absolute', top: 16, left: 16, background: '#22c55e', color: 'white', fontWeight: 800, fontSize: 18, padding: '6px 14px', borderRadius: 12, opacity: Math.min(drag / 80, 1), transform: 'rotate(-12deg)', border: '3px solid #16a34a' }}>SAVE ♥</div>}
              {drag < -20 && <div style={{ position: 'absolute', top: 16, right: 16, background: '#ef4444', color: 'white', fontWeight: 800, fontSize: 18, padding: '6px 14px', borderRadius: 12, opacity: Math.min(-drag / 80, 1), transform: 'rotate(12deg)', border: '3px solid #dc2626' }}>PASS ✗</div>}
            </div>
            <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, fontFamily: 'DM Serif Display' }}>{card.name}</h2>
                  <p style={{ fontSize: 14, color: C.muted }}>{card.vibe}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{card.price}</div>
                  <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>↑ {card.trend}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {card.tags.map(t => <span key={t} style={{ fontSize: 12, background: C.bgAlt, color: C.muted, padding: '5px 10px', borderRadius: 20, fontWeight: 500 }}>{t}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['Crime', card.crime], ['Schools', card.school]].map(([k, v]) => (
                  <div key={k} style={{ background: C.bgAlt, borderRadius: 12, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24, zIndex: 10 }}>
          <button onClick={() => act('left')} style={{ width: 58, height: 58, borderRadius: '50%', background: 'white', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.2)' }}>
            <Icon name="x" size={24} color="#ef4444" />
          </button>
          <button onClick={() => act('right')} style={{ width: 58, height: 58, borderRadius: '50%', background: '#22c55e', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' }}>
            <Icon name="heart" size={24} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
