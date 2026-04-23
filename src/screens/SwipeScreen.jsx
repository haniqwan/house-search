import { useState, useRef } from 'react';
import { C } from '../tokens';
import Icon from '../components/Icon';
import LONDON_AREAS from '../data/londonAreas';

export default function SwipeScreen() {
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const [liked, setLiked] = useState([]);
  const [passed, setPassed] = useState([]);
  const [animDir, setAnimDir] = useState(null);
  const [gone, setGone] = useState(false);
  const isDragging = useRef(false);

  const card = LONDON_AREAS[idx % LONDON_AREAS.length];
  const nextCard = LONDON_AREAS[(idx + 1) % LONDON_AREAS.length];

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

  const cardTransform = gone
    ? `translateX(${animDir === 'right' ? 600 : -600}px) rotate(${animDir === 'right' ? 18 : -18}deg)`
    : `translateX(${drag}px) rotate(${drag * 0.04}deg)`;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Discover Areas</h1>
        <p>Swipe right to save an area, left to pass. We'll use your saves to refine recommendations.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 13, color: C.accent, background: C.accentLight, padding: '5px 14px', borderRadius: 20, fontWeight: 600 }}>❤️ {liked.length} saved</span>
        <span style={{ fontSize: 13, color: C.muted, background: C.bgAlt, padding: '5px 14px', borderRadius: 20, fontWeight: 600 }}>✕ {passed.length} passed</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

        {/* Card stack */}
        <div style={{ position: 'relative', height: 520, userSelect: 'none' }}>
          {/* Back card */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: 24, background: nextCard.color + '25',
            border: `1px solid ${C.faint}`,
            transform: 'scale(0.96) translateY(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 64, opacity: 0.4 }}>{nextCard.emoji}</span>
          </div>

          {/* Main card */}
          <div
            style={{
              position: 'absolute', inset: 0,
              transform: cardTransform,
              transition: gone ? 'transform 0.35s cubic-bezier(0.4,0,0.2,1)' : 'none',
              cursor: isDragging.current ? 'grabbing' : 'grab',
            }}
            onMouseDown={e => {
              isDragging.current = true;
              const sx = e.clientX;
              const onMove = ev => setDrag(ev.clientX - sx);
              const onUp = () => {
                isDragging.current = false;
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                setDrag(d => { if (Math.abs(d) > 100) { act(d > 0 ? 'right' : 'left'); return d; } return 0; });
              };
              document.addEventListener('mousemove', onMove);
              document.addEventListener('mouseup', onUp);
            }}
          >
            <div style={{
              height: '100%', borderRadius: 24, overflow: 'hidden',
              background: C.card, boxShadow: '0 12px 48px rgba(0,0,0,0.14)',
              border: `1px solid ${C.faint}`, display: 'flex', flexDirection: 'column',
            }}>
              {/* Visual header */}
              <div style={{
                height: 200, flexShrink: 0,
                background: `linear-gradient(160deg, ${card.color}30, ${card.color}10)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}>
                <span style={{ fontSize: 80 }}>{card.emoji}</span>
                {drag > 25 && <div style={{ position: 'absolute', top: 20, left: 20, background: '#22c55e', color: 'white', fontWeight: 800, fontSize: 18, padding: '8px 16px', borderRadius: 12, opacity: Math.min(drag / 100, 1), transform: 'rotate(-12deg)', border: '3px solid #16a34a' }}>SAVE ♥</div>}
                {drag < -25 && <div style={{ position: 'absolute', top: 20, right: 20, background: '#ef4444', color: 'white', fontWeight: 800, fontSize: 18, padding: '8px 16px', borderRadius: 12, opacity: Math.min(-drag / 100, 1), transform: 'rotate(12deg)', border: '3px solid #dc2626' }}>PASS ✕</div>}
              </div>

              <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, fontFamily: 'DM Serif Display' }}>{card.name}</h2>
                    <p style={{ fontSize: 14, color: C.muted }}>{card.vibe}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>£{(card.avgPrice / 1000).toFixed(0)}k avg</div>
                    <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>↑ +{card.priceChange}% YoY</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {card.tags.map(t => <span key={t} style={{ fontSize: 12, background: C.bgAlt, color: C.muted, padding: '5px 11px', borderRadius: 20, fontWeight: 500 }}>{t}</span>)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {[
                    ['Crime', '🛡️', `${card.schoolScore > 75 ? 'Low' : 'Medium'}`],
                    ['Schools', '🏫', `${card.schoolScore}% Good+`],
                    ['Borough', '🗺️', card.borough],
                  ].map(([k, e, v]) => (
                    <div key={k} style={{ background: C.bgAlt, borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 2 }}>{e} {k}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: controls + saved list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ textAlign: 'center', padding: 28 }}>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>Drag the card or use buttons</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              <button onClick={() => act('left')} style={{
                width: 64, height: 64, borderRadius: '50%', background: 'white',
                border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.2)', transition: 'transform 0.1s',
              }}>
                <Icon name="x" size={26} color="#ef4444" />
              </button>
              <button onClick={() => act('right')} style={{
                width: 64, height: 64, borderRadius: '50%', background: '#22c55e',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(34,197,94,0.3)', transition: 'transform 0.1s',
              }}>
                <Icon name="heart" size={26} color="white" />
              </button>
            </div>
          </div>

          {liked.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>❤️ Saved areas ({liked.length})</h3>
              {liked.map(name => {
                const a = LONDON_AREAS.find(x => x.name === name);
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.faint}` }}>
                    <span style={{ fontSize: 18 }}>{a?.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{a?.vibe}</div>
                    </div>
                    <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>+{a?.priceChange}%</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="card" style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            <strong style={{ color: C.text, display: 'block', marginBottom: 6 }}>💡 Tip</strong>
            Use <strong>Area Search</strong> for data-driven matching, or swipe here to explore by feel — both feed into your Tracker.
          </div>
        </div>
      </div>
    </div>
  );
}
