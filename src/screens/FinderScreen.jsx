import { useState } from 'react';
import { C } from '../tokens';

const listing = {
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

  const scan = () => {
    setStep('scanning');
    setTimeout(() => setStep('found'), 2500);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ padding: '56px 20px 16px', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 26, color: C.text }}>House Finder</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Spotted a house you love? We'll find the listing</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 90px' }}>
        {step === 'ready' && (
          <>
            <div style={{
              background: `linear-gradient(145deg, ${C.accentLight}, #fff)`,
              borderRadius: 24, padding: 24, textAlign: 'center',
              border: `2px dashed ${C.accent}40`, marginBottom: 20,
            }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>📍</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6 }}>I'm next to a house I love</h2>
              <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>We'll use your location to search active listings nearby</p>
              <button onClick={scan} style={{ width: '100%', padding: '14px', background: C.accent, color: 'white', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}>📡 Use my location now</button>
            </div>

            <div style={{ background: C.card, borderRadius: 16, padding: 16, border: `1px solid ${C.faint}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Or enter nearby postcode</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={postcode} onChange={e => setPostcode(e.target.value.toUpperCase())} placeholder="E.g. E8 1EA"
                  style={{ flex: 1, border: `1.5px solid ${C.faint}`, borderRadius: 12, padding: '12px 14px', fontSize: 16, fontFamily: 'DM Sans', background: C.bg, color: C.text, outline: 'none' }}
                />
                <button onClick={scan} disabled={!postcode} style={{ padding: '12px 18px', background: postcode ? C.text : C.faint, color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: postcode ? 'pointer' : 'default', fontFamily: 'DM Sans' }}>Search</button>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>How it works</h3>
              {[['📡','We detect your location or postcode'],['🔍','We search Rightmove, Zoopla & OnTheMarket'],['🏠','We surface the exact listing with full details']].map(([em, txt]) => (
                <div key={em} style={{ display: 'flex', gap: 14, marginBottom: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 24 }}>{em}</span>
                  <span style={{ fontSize: 14, color: C.muted }}>{txt}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'scanning' && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 56, marginBottom: 20, animation: 'pulse 1s infinite' }}>🔍</div>
            <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: C.text, marginBottom: 10 }}>Searching nearby listings…</h2>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>Scanning Rightmove, Zoopla & OnTheMarket within 50m</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {['📡 GPS locked: Hackney E8','🔎 Searching within 50m radius','📋 Checking 3 property portals…'].map((s, i) => (
                <div key={i} style={{ background: C.card, borderRadius: 12, padding: '12px 16px', border: `1px solid ${C.faint}`, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.text }}>
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'found' && (
          <>
            <div style={{ background: '#22c55e10', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', border: '1px solid #22c55e30' }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#16a34a' }}>Listing found nearby!</div>
                <div style={{ fontSize: 12, color: C.muted }}>Matched via Rightmove · 28m away</div>
              </div>
            </div>

            <div style={{ background: C.card, borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.faint}`, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <div style={{ height: 160, background: `linear-gradient(135deg, ${C.accentLight}, #f0ede8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: 64 }}>🏠</span>
                <div style={{ position: 'absolute', top: 12, right: 12, background: C.accent, color: 'white', fontWeight: 800, fontSize: 13, padding: '5px 12px', borderRadius: 20 }}>{listing.match}% match</div>
              </div>
              <div style={{ padding: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>{listing.price}</h2>
                <p style={{ fontSize: 14, color: C.muted, marginBottom: 16 }}>{listing.address}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[[`${listing.beds} bed`,'🛏️'],[`${listing.baths} bath`,'🛁'],[listing.sqft,'📐']].map(([v, e]) => (
                    <div key={v} style={{ background: C.bgAlt, borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18 }}>{e}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 4 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.muted, marginBottom: 20 }}>
                  <span>{listing.type}</span>
                  <span>Listed {listing.listed}</span>
                  <span>via {listing.agent}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{ flex: 1, padding: '12px', background: C.accent, color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}>View full listing</button>
                  <button style={{ flex: 1, padding: '12px', background: C.bgAlt, color: C.text, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}>Save to tracker</button>
                </div>
              </div>
            </div>
            <button onClick={() => setStep('ready')} style={{ marginTop: 14, width: '100%', padding: '12px', background: 'none', border: `1.5px solid ${C.faint}`, borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: C.muted, fontFamily: 'DM Sans' }}>Search again</button>
          </>
        )}
      </div>
    </div>
  );
}
