import { useState } from 'react';
import { C } from '../tokens';
import { lookupPostcode } from '../api/postcodes';

const MOCK_LISTING = {
  address: '14 Albion Drive, Hackney, E8 4ET',
  price: '£625,000',
  beds: 3, baths: 2,
  sqft: '1,180 sq ft',
  agent: 'Foxtons',
  listed: '3 days ago',
  type: 'Victorian terrace',
  match: 91,
};

export default function FinderScreen() {
  const [step, setStep] = useState('ready');
  const [postcode, setPostcode] = useState('');
  const [locating, setLocating] = useState(false);
  const [foundPostcode, setFoundPostcode] = useState('');

  const scanWithLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocating(false);
        const result = await lookupPostcode(`${pos.coords.latitude},${pos.coords.longitude}`);
        setFoundPostcode(result?.postcode || 'E8 1EA');
        runScan();
      },
      () => {
        setLocating(false);
        setFoundPostcode('E8 1EA');
        runScan();
      }
    );
  };

  const runScan = () => {
    setStep('scanning');
    setTimeout(() => setStep('found'), 2800);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>House Finder</h1>
        <p>Standing outside a house you love? We'll find the listing in seconds.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

        {/* Left: input + how it works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {step === 'ready' && (
            <>
              <div className="card" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>📍</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>I'm next to a house I love</h2>
                <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>We'll use your location to find nearby listings on Rightmove, Zoopla & OnTheMarket</p>
                <button
                  onClick={scanWithLocation}
                  disabled={locating}
                  style={{
                    width: '100%', padding: '14px',
                    background: locating ? C.faint : C.accent,
                    color: 'white', border: 'none', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: locating ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans',
                  }}
                >
                  {locating ? '📡 Getting location…' : '📡 Use my location now'}
                </button>
              </div>

              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 14 }}>Or enter a postcode</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={postcode}
                    onChange={e => setPostcode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && postcode && runScan()}
                    placeholder="e.g. E8 1EA"
                    style={{
                      flex: 1, border: `1.5px solid ${C.faint}`, borderRadius: 10,
                      padding: '12px 14px', fontSize: 16, fontFamily: 'DM Sans',
                      background: C.bg, color: C.text, outline: 'none',
                    }}
                  />
                  <button
                    onClick={runScan}
                    disabled={!postcode}
                    style={{
                      padding: '12px 20px',
                      background: postcode ? C.text : C.faint,
                      color: 'white', border: 'none', borderRadius: 10,
                      fontSize: 14, fontWeight: 700,
                      cursor: postcode ? 'pointer' : 'default', fontFamily: 'DM Sans',
                    }}
                  >Search</button>
                </div>
              </div>
            </>
          )}

          {step !== 'ready' && (
            <button onClick={() => { setStep('ready'); setPostcode(''); }} style={{
              padding: '10px 16px', background: C.bgAlt, border: `1px solid ${C.faint}`,
              borderRadius: 10, fontSize: 14, fontWeight: 600, color: C.muted,
              cursor: 'pointer', fontFamily: 'DM Sans', display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content',
            }}>
              ← Search again
            </button>
          )}

          {/* How it works */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16 }}>How it works</h3>
            {[
              ['📡', 'Detect location', 'Browser GPS or postcode you enter'],
              ['🔍', 'Search portals', 'Scans Rightmove, Zoopla & OnTheMarket within 50m'],
              ['🏠', 'Surface listing', 'Returns full details: price, beds, agent, tenure'],
              ['📊', 'Match score', 'Scores against your Area Search priorities'],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, background: C.accentLight, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{title}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: result */}
        <div>
          {step === 'ready' && (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: C.muted }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🏡</div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: C.text, marginBottom: 8 }}>
                Found a house you like?
              </h3>
              <p style={{ fontSize: 15 }}>Use your location or enter the postcode to find the listing instantly.</p>
            </div>
          )}

          {step === 'scanning' && (
            <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ fontSize: 52, marginBottom: 20, animation: 'pulse 1s infinite' }}>🔍</div>
              <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: C.text, marginBottom: 10 }}>
                Searching nearby listings…
              </h2>
              <p style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>
                Scanning Rightmove, Zoopla & OnTheMarket within 50m
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                {[
                  `📡 GPS locked: ${foundPostcode || postcode || 'E8 1EA'}`,
                  '🔎 Searching within 50m radius',
                  '📋 Checking 3 property portals…',
                ].map((s, i) => (
                  <div key={i} style={{
                    background: C.bgAlt, borderRadius: 10, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.text,
                  }}>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'found' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                background: '#f0fdf4', borderRadius: 12, padding: '14px 18px',
                display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #bbf7d0',
              }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#16a34a' }}>Listing found nearby!</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Matched via Rightmove · 28m away</div>
                </div>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  height: 180, background: `linear-gradient(135deg, ${C.accentLight}, #f0ede8)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                }}>
                  <span style={{ fontSize: 72 }}>🏠</span>
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    background: C.accent, color: 'white',
                    fontWeight: 800, fontSize: 13, padding: '6px 14px', borderRadius: 20,
                  }}>{MOCK_LISTING.match}% match</div>
                </div>
                <div style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 4 }}>{MOCK_LISTING.price}</h2>
                  <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>{MOCK_LISTING.address}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                    {[[`${MOCK_LISTING.beds} beds`, '🛏️'], [`${MOCK_LISTING.baths} baths`, '🛁'], [MOCK_LISTING.sqft, '📐']].map(([v, e]) => (
                      <div key={v} style={{ background: C.bgAlt, borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: 20 }}>{e}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 4 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.muted, marginBottom: 20 }}>
                    <span>{MOCK_LISTING.type}</span>
                    <span>Listed {MOCK_LISTING.listed}</span>
                    <span>via {MOCK_LISTING.agent}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{ flex: 1, padding: '13px', background: C.accent, color: 'white', border: 'none', borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}>View full listing</button>
                    <button style={{ flex: 1, padding: '13px', background: C.bgAlt, color: C.text, border: 'none', borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}>Save to tracker</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
