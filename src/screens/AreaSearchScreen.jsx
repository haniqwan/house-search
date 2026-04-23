import { useState, useCallback } from 'react';
import { C } from '../tokens';
import Icon from '../components/Icon';
import PrioritySlider from '../components/PrioritySlider';
import { scoreAreas } from '../services/scorer';

// ── Loading overlay ────────────────────────────────────────
function SearchProgress({ pct, message }) {
  return (
    <div style={{
      background: C.card, borderRadius: 20, padding: '40px 32px',
      textAlign: 'center', border: `1px solid ${C.faint}`,
      boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🔍</div>
      <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: C.text, marginBottom: 8 }}>
        Finding your best areas…
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>{message}</p>
      <div style={{ height: 8, background: C.faint, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{
          height: '100%', borderRadius: 4,
          background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`,
          width: `${pct}%`, transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{ fontSize: 13, color: C.muted }}>{pct}% complete</span>
      <p style={{ fontSize: 12, color: C.faint, marginTop: 16 }}>
        Querying crime data, TfL stops, and local amenities for 30 London areas
      </p>
    </div>
  );
}

// ── Result card ────────────────────────────────────────────
function AreaResultCard({ area, rank }) {
  const [expanded, setExpanded] = useState(false);
  const isTop = rank === 0;

  const scoreColor = isTop ? C.accent : rank === 1 ? C.teal : C.gold;

  return (
    <div className="fade-in" style={{
      background: C.card, borderRadius: 16,
      border: `1.5px solid ${isTop ? C.accent + '50' : C.faint}`,
      boxShadow: isTop ? `0 6px 32px ${C.accent}18` : '0 2px 12px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: area.color + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}>{area.emoji}</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: 'DM Serif Display' }}>
              {area.name}
            </h3>
            {isTop && (
              <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, background: C.accentLight, padding: '3px 8px', borderRadius: 10, letterSpacing: '0.05em' }}>
                BEST MATCH
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: C.muted }}>{area.vibe} · {area.borough}</p>
        </div>

        {/* Score circle */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: scoreColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>{area.matchScore}</span>
          </div>
          <span style={{ fontSize: 10, color: C.muted, marginTop: 2, display: 'block' }}>score</span>
        </div>
      </div>

      {/* Key stats row */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <StatPill icon="💷" label={`£${(area.avgPrice / 1000).toFixed(0)}k avg`} />
        <StatPill icon="📈" label={`+${area.priceChange}% YoY`} color="#22c55e" />
        {area.crimeCount !== null && area.crimeCount !== undefined && (
          <StatPill icon="🛡️" label={`${area.crimeCount} crimes/mo`} />
        )}
        <StatPill icon="🏫" label={`${area.schoolScore}% Good+`} />
        {area.transportData?.lines?.slice(0, 2).map(l => (
          <StatPill key={l} icon="🚇" label={l} />
        ))}
        {(!area.transportData) && area.transportLines.slice(0, 2).map(l => (
          <StatPill key={l} icon="🚇" label={l} />
        ))}
      </div>

      {/* Tags */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {area.tags.map(t => (
          <span key={t} style={{
            fontSize: 12, color: C.muted, background: C.bgAlt,
            padding: '4px 10px', borderRadius: 20, fontWeight: 500,
          }}>{t}</span>
        ))}
      </div>

      {/* Expand toggle */}
      <button onClick={() => setExpanded(e => !e)} style={{
        width: '100%', padding: '10px 20px',
        background: C.bgAlt, border: 'none', borderTop: `1px solid ${C.faint}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', fontSize: 13, color: C.muted, fontFamily: 'DM Sans', fontWeight: 600,
      }}>
        <span>{expanded ? 'Hide details' : 'Show data breakdown'}</span>
        <Icon name={expanded ? 'chevronL' : 'chevronR'} size={16} color={C.muted} style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
      </button>

      {expanded && (
        <div style={{ padding: 20, borderTop: `1px solid ${C.faint}`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <DataBox label="Crime rate" value={area.crimeCount !== null ? `${area.crimeCount} reported` : 'N/A'} sub="last month" color="#ef4444" />
          <DataBox label="Avg price" value={`£${(area.avgPrice / 1000).toFixed(0)}k`} sub={`+${area.priceChange}% YoY`} color={C.accent} />
          <DataBox label="Schools" value={`${area.schoolScore}%`} sub="Good or Outstanding" color={C.teal} />
          {area.amenityData && (
            <>
              <DataBox label="Supermarkets" value={area.amenityData.supermarket ?? '?'} sub="within 800m" color={C.gold} />
              <DataBox label="Cafés" value={area.amenityData.cafes ?? '?'} sub="within 800m" color={C.gold} />
              <DataBox label="Restaurants" value={area.amenityData.restaurants ?? '?'} sub="within 800m" color={C.gold} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StatPill({ icon, label, color = C.muted }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12, color, background: C.bgAlt,
      padding: '4px 10px', borderRadius: 20, fontWeight: 500,
    }}>{icon} {label}</span>
  );
}

function DataBox({ label, value, sub, color }) {
  return (
    <div style={{ background: C.bgAlt, borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────
export default function AreaSearchScreen() {
  const [priorities, setPriorities] = useState({ crime: 3, schools: 2, transport: 3, amenities: 1, prices: 2, distance: 2 });
  const [amenities, setAmenities] = useState({ supermarket: true, gym: false, cafes: true, restaurants: true });
  const [transport, setTransport] = useState({ tube: true, thameslink: false });
  const [spots, setSpots] = useState([{ label: 'Canary Wharf, E14 4AB', time: '30 min' }]);
  const [newSpotLabel, setNewSpotLabel] = useState('');

  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [progress, setProgress] = useState({ pct: 0, message: '' });
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = useCallback(async () => {
    setStatus('loading');
    setResults([]);
    setErrorMsg('');
    try {
      const scored = await scoreAreas({
        priorities,
        selectedAmenities: amenities,
        selectedTransport: transport,
        spots,
        onProgress: (pct, message) => setProgress({ pct, message }),
      });
      setResults(scored);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong fetching live data. Check your connection and try again.');
      setStatus('error');
    }
  }, [priorities, amenities, transport, spots]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Area Search</h1>
        <p>Set your priorities — we'll score every London area against real crime, transport, school and amenity data.</p>
      </div>

      <div className="grid-2">
        {/* ── Left: filters ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Priority sliders */}
          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
              Priority Levels
            </h3>
            <PrioritySlider label="Low Crime" icon="shield" value={priorities.crime} onChange={v => setPriorities(p => ({...p, crime: v}))} color={C.accent} />
            <PrioritySlider label="School Quality" icon="school" value={priorities.schools} onChange={v => setPriorities(p => ({...p, schools: v}))} color={C.teal} />
            <PrioritySlider label="Transport Links" icon="bus" value={priorities.transport} onChange={v => setPriorities(p => ({...p, transport: v}))} color={C.gold} />
            <PrioritySlider label="Amenities" icon="star" value={priorities.amenities} onChange={v => setPriorities(p => ({...p, amenities: v}))} color="#8b5cf6" />
            <PrioritySlider label="Rising Prices" icon="trend" value={priorities.prices} onChange={v => setPriorities(p => ({...p, prices: v}))} color="#ef4444" />
            <PrioritySlider label="Proximity to Spots" icon="pin" value={priorities.distance} onChange={v => setPriorities(p => ({...p, distance: v}))} color="#f97316" />
          </div>

          {/* Amenities */}
          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Important Amenities</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[['supermarket','🛒','Supermarket'],['gym','💪','Gym'],['cafes','☕','Cafés'],['restaurants','🍽️','Restaurants']].map(([key, emoji, label]) => (
                <button key={key} onClick={() => setAmenities(a => ({...a, [key]: !a[key]}))} style={{
                  padding: '8px 14px', borderRadius: 20,
                  border: `1.5px solid ${amenities[key] ? C.accent : C.faint}`,
                  background: amenities[key] ? C.accentLight : 'transparent',
                  color: amenities[key] ? C.accent : C.muted,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}><span>{emoji}</span>{label}</button>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Transport Required</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['tube','🚇','Underground'],['thameslink','🚆','Thameslink']].map(([key, emoji, label]) => (
                <button key={key} onClick={() => setTransport(t => ({...t, [key]: !t[key]}))} style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: `1.5px solid ${transport[key] ? C.teal : C.faint}`,
                  background: transport[key] ? C.tealLight : 'transparent',
                  color: transport[key] ? C.teal : C.muted,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Regular spots */}
          <div className="card">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Regular Spots</h3>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
              Add postcodes of places you travel to regularly (work, family, gym). Include a postcode for accurate scoring.
            </p>
            {spots.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0', borderBottom: `1px solid ${C.faint}`,
              }}>
                <div style={{ width: 32, height: 32, background: C.accentLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="pin" size={15} color={C.accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Max {s.time} away</div>
                </div>
                <button onClick={() => setSpots(ss => ss.filter((_, ii) => ii !== i))} style={{ border: 'none', background: 'none', color: C.muted, cursor: 'pointer', fontSize: 18, padding: '4px' }}>×</button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                value={newSpotLabel}
                onChange={e => setNewSpotLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newSpotLabel.trim()) { setSpots(ss => [...ss, { label: newSpotLabel.trim(), time: '30 min' }]); setNewSpotLabel(''); } }}
                placeholder="e.g. Work, EC2A 4NE"
                style={{ flex: 1, border: `1.5px solid ${C.faint}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, fontFamily: 'DM Sans', background: C.bg, color: C.text, outline: 'none' }}
              />
              <button
                onClick={() => { if (newSpotLabel.trim()) { setSpots(ss => [...ss, { label: newSpotLabel.trim(), time: '30 min' }]); setNewSpotLabel(''); } }}
                style={{ padding: '9px 14px', background: C.accent, color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Data sources note */}
          <div style={{ background: C.bgAlt, borderRadius: 12, padding: '12px 14px', fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
            <strong style={{ color: C.text }}>Live data sources:</strong><br />
            🛡️ Crime: data.police.uk &nbsp;·&nbsp; 🚇 Transport: TfL API &nbsp;·&nbsp; ☕ Amenities: OpenStreetMap
          </div>

          <button
            onClick={handleSearch}
            disabled={status === 'loading'}
            style={{
              width: '100%', padding: '16px',
              background: status === 'loading' ? C.faint : C.accent,
              color: 'white', border: 'none', borderRadius: 14,
              fontSize: 16, fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans', transition: 'background 0.2s',
            }}
          >
            {status === 'loading' ? 'Searching…' : 'Find my areas →'}
          </button>
        </div>

        {/* ── Right: results ── */}
        <div>
          {status === 'idle' && (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: C.muted }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: C.text, marginBottom: 8 }}>Set your priorities</h3>
              <p style={{ fontSize: 15 }}>Adjust the sliders on the left, then hit <strong>Find my areas</strong> to score all 30 London areas against live data.</p>
            </div>
          )}

          {status === 'loading' && (
            <SearchProgress pct={progress.pct} message={progress.message} />
          )}

          {status === 'error' && (
            <div style={{ background: '#fef2f2', borderRadius: 16, padding: 24, border: '1px solid #fecaca', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
              <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: 8 }}>{errorMsg}</p>
              <button onClick={handleSearch} style={{ padding: '10px 20px', background: C.accent, color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600 }}>Try again</button>
            </div>
          )}

          {status === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>
                  <strong style={{ color: C.text }}>{results.length} areas</strong> scored across 6 dimensions
                </p>
                <button onClick={() => setStatus('idle')} style={{ fontSize: 13, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>← Adjust filters</button>
              </div>
              {results.slice(0, 10).map((area, i) => (
                <AreaResultCard key={area.id} area={area} rank={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
