import { useState } from 'react';
import { C } from '../tokens';

const INITIAL_STEPS = [
  { id: 0, label: 'Mortgage in Principle', icon: '📄', done: true, sub: 'Completed 12 Apr', tasks: ['Get MIP from lender ✓', 'Upload proof of income ✓', 'Credit check passed ✓'] },
  { id: 1, label: 'Offer Accepted', icon: '🤝', done: true, sub: 'Accepted 18 Apr', tasks: ['Offer made at £610k ✓', 'Counter-offer at £618k ✓', 'Accepted ✓'] },
  { id: 2, label: 'Survey & Searches', icon: '🔍', done: false, sub: 'Booked 28 Apr', tasks: ['Book surveyor ✓', 'Local authority search — pending', 'Environmental search — pending'] },
  { id: 3, label: 'Exchange of Contracts', icon: '📝', done: false, sub: 'Est. mid-May', tasks: ['Solicitor review', 'Sign contracts', 'Pay 10% deposit'] },
  { id: 4, label: 'Completion', icon: '🔑', done: false, sub: 'Target: 1 Jun', tasks: ['Final mortgage draw-down', 'Keys collected', 'Move in!'] },
];

function TaskRow({ task, onToggle, disabled }) {
  const done = task.endsWith(' ✓');
  return (
    <div onClick={disabled ? undefined : onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
      cursor: disabled ? 'default' : 'pointer',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: done ? '#22c55e' : 'white',
        border: done ? 'none' : `1.5px solid ${C.faint}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {done && <span style={{ fontSize: 12, color: 'white', fontWeight: 800 }}>✓</span>}
      </div>
      <span style={{ fontSize: 14, color: done ? C.muted : C.text, textDecoration: done ? 'line-through' : 'none' }}>
        {task.replace(' ✓', '')}
      </span>
    </div>
  );
}

export default function TrackerScreen() {
  const [expanded, setExpanded] = useState(null);
  const [steps, setSteps] = useState(INITIAL_STEPS);

  const toggleTask = (stepId, taskIdx) => {
    setSteps(ss => ss.map(s => {
      if (s.id !== stepId) return s;
      const tasks = [...s.tasks];
      tasks[taskIdx] = tasks[taskIdx].endsWith(' ✓') ? tasks[taskIdx].slice(0, -2) : tasks[taskIdx] + ' ✓';
      return { ...s, tasks };
    }));
  };

  const done = steps.filter(s => s.done).length;
  const pct = (done / steps.length) * 100;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Purchase Tracker</h1>
        <p>14 Albion Drive, Hackney E8 4ET · Agreed at £618,000</p>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ marginBottom: 32, maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{done} of {steps.length} stages complete</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{Math.round(pct)}%</span>
        </div>
        <div style={{ height: 10, background: C.faint, borderRadius: 5, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            height: '100%', borderRadius: 5,
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{ fontSize: 13, color: C.muted }}>Next: Survey booked for 28 April</p>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {steps.map((s, i) => (
          <div key={s.id}>
            {/* Step header */}
            <div
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 20,
                padding: '16px 0', cursor: 'pointer', borderBottom: `1px solid ${C.faint}`,
              }}
            >
              {/* Step icon */}
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: s.done ? C.accent : expanded === s.id ? C.accentLight : C.card,
                border: `2px solid ${s.done ? C.accent : C.faint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: s.done ? 18 : 20,
              }}>
                {s.done ? '✓' : s.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: s.done ? C.text : C.muted }}>{s.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: C.muted }}>{s.sub}</span>
                    {s.done
                      ? <span style={{ fontSize: 11, background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: 10, fontWeight: 700 }}>Done</span>
                      : i === done
                      ? <span style={{ fontSize: 11, background: C.accentLight, color: C.accent, padding: '3px 8px', borderRadius: 10, fontWeight: 700 }}>In progress</span>
                      : null}
                  </div>
                </div>

                {/* Task chips */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {s.tasks.map((t, ti) => (
                    <span key={ti} style={{
                      fontSize: 11, padding: '3px 9px', borderRadius: 10, fontWeight: 500,
                      background: t.endsWith(' ✓') ? '#dcfce7' : C.bgAlt,
                      color: t.endsWith(' ✓') ? '#16a34a' : C.muted,
                    }}>{t.replace(' ✓', '')} {t.endsWith(' ✓') ? '✓' : ''}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Expanded tasks */}
            {expanded === s.id && (
              <div style={{
                marginLeft: 64, marginBottom: 8, padding: '8px 20px',
                background: C.card, borderRadius: 12, border: `1px solid ${C.faint}`,
              }}>
                {s.tasks.map((t, ti) => (
                  <div key={ti} style={{ borderBottom: ti < s.tasks.length - 1 ? `1px solid ${C.faint}` : 'none' }}>
                    <TaskRow
                      task={t}
                      disabled={s.done}
                      onToggle={() => toggleTask(s.id, ti)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
