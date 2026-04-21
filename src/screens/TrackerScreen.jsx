import { useState } from 'react';
import { C } from '../tokens';

const initialSteps = [
  { id: 0, label: 'Mortgage in Principle', icon: '📄', done: true, sub: 'Completed 12 Apr', tasks: ['Get MIP from lender ✓', 'Upload proof of income ✓', 'Credit check passed ✓'] },
  { id: 1, label: 'Offer Accepted', icon: '🤝', done: true, sub: 'Accepted 18 Apr', tasks: ['Offer made at £610k ✓', 'Counter-offer at £618k ✓', 'Accepted ✓'] },
  { id: 2, label: 'Survey & Searches', icon: '🔍', done: false, sub: 'Booked for 28 Apr', tasks: ['Book surveyor ✓', 'Local authority search — pending', 'Environmental search — pending'] },
  { id: 3, label: 'Exchange of Contracts', icon: '📝', done: false, sub: 'Est. mid-May', tasks: ['Solicitor review', 'Sign contracts', 'Pay 10% deposit'] },
  { id: 4, label: 'Completion', icon: '🔑', done: false, sub: 'Target: 1 Jun', tasks: ['Final mortgage draw-down', 'Keys collected', 'Move in!'] },
];

export default function TrackerScreen() {
  const [expanded, setExpanded] = useState(null);
  const [steps, setSteps] = useState(initialSteps);

  const toggleTask = (stepId, taskIdx) => {
    setSteps(ss => ss.map(s => {
      if (s.id !== stepId) return s;
      const tasks = [...s.tasks];
      const t = tasks[taskIdx];
      tasks[taskIdx] = t.endsWith(' ✓') ? t.slice(0, -2) : t + ' ✓';
      return { ...s, tasks };
    }));
  };

  const done = steps.filter(s => s.done).length;
  const pct = (done / steps.length) * 100;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ padding: '56px 20px 16px', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 26, color: C.text }}>Purchase Tracker</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>14 Albion Drive, Hackney</p>

        <div style={{ marginTop: 16, background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.faint}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{done} of {steps.length} stages complete</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>{Math.round(pct)}%</span>
          </div>
          <div style={{ height: 8, background: C.faint, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`, borderRadius: 4, transition: 'width 0.5s' }} />
          </div>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Next: Survey booked for 28 April</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 90px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: C.faint }} />
          {steps.map((s) => (
            <div key={s.id} style={{ marginBottom: 4 }}>
              <div onClick={() => setExpanded(expanded === s.id ? null : s.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '14px 16px 14px 0', cursor: 'pointer' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: s.done ? C.accent : expanded === s.id ? C.accentLight : C.card,
                  border: `2px solid ${s.done ? C.accent : C.faint}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2, position: 'relative', fontSize: 18,
                }}>{s.done ? '✓' : s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: s.done ? C.text : C.muted }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{s.sub}</span>
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {s.tasks.map((t, ti) => (
                      <span key={ti} style={{
                        fontSize: 11, padding: '3px 8px', borderRadius: 10,
                        background: t.endsWith(' ✓') ? '#22c55e15' : C.bgAlt,
                        color: t.endsWith(' ✓') ? '#16a34a' : C.muted,
                        fontWeight: 500,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              {expanded === s.id && (
                <div style={{ marginLeft: 56, marginBottom: 8, background: C.card, borderRadius: 14, padding: '14px', border: `1px solid ${C.faint}` }}>
                  {s.tasks.map((t, ti) => (
                    <div key={ti} onClick={() => !s.done && toggleTask(s.id, ti)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                      borderBottom: ti < s.tasks.length - 1 ? `1px solid ${C.faint}` : 'none',
                      cursor: s.done ? 'default' : 'pointer',
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6,
                        background: t.endsWith(' ✓') ? '#22c55e' : C.bgAlt,
                        border: t.endsWith(' ✓') ? 'none' : `1.5px solid ${C.faint}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {t.endsWith(' ✓') && <span style={{ fontSize: 11, color: 'white', fontWeight: 800 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 13, color: C.text }}>{t.replace(' ✓', '')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
