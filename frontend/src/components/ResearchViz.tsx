import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { useReducedMotion } from '../lib/motion';

/*
 * Result visualizations for the Research section. Each one sits in a
 * resting, undrawn state and animates in when `active` turns on: on hover or
 * focus where there is a pointer, or on scroll into view on touch screens.
 * All numbers come from the paper / project write-ups.
 */

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Counts from 0 to `target` while active; snaps back to 0 when inactive. */
const useCountUp = (target: number, active: boolean, delay = 0, duration = 900): number => {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setValue(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, delay, duration, reduced]);

  return value;
};

const transition = (property: string, delay: number, duration = 900): CSSProperties => ({
  transition: `${property} ${duration}ms ${EASE} ${delay}ms`,
});

const Panel: React.FC<{ title: string; active: boolean; children: ReactNode; label: string }> = ({
  title,
  active,
  children,
  label,
}) => (
  <figure
    aria-label={label}
    className={`rounded-[var(--radius-card)] border bg-surface p-4 transition-[border-color,box-shadow] duration-[var(--dur)] ${
      active ? 'border-line-strong shadow-[0_0_0_4px_var(--brand-soft)]' : 'border-line'
    }`}
  >
    <figcaption className="sr-only">{title}</figcaption>
    <div className="flex flex-col gap-4">{children}</div>
  </figure>
);

/** Two-bar before/after comparison; widths are relative to the larger value. */
const CompareBars: React.FC<{
  active: boolean;
  title: string;
  delay: number;
  rows: { name: string; value: number; display: (v: number) => string; ours?: boolean }[];
  max: number;
  note?: string;
}> = ({ active, title, delay, rows, max, note }) => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <p className="text-xs font-medium text-ink">{title}</p>
      {note ? (
        <span
          className="text-xs font-semibold tabular-nums text-brand"
          style={{ opacity: active ? 1 : 0, ...transition('opacity', delay + 700, 400) }}
        >
          {note}
        </span>
      ) : null}
    </div>
    <div className="mt-2 flex flex-col gap-1.5">
      {rows.map((row, index) => (
        <BarRow key={row.name} active={active} delay={delay + index * 140} max={max} {...row} />
      ))}
    </div>
  </div>
);

const BarRow: React.FC<{
  active: boolean;
  delay: number;
  max: number;
  name: string;
  value: number;
  display: (v: number) => string;
  ours?: boolean;
}> = ({ active, delay, max, name, value, display, ours }) => {
  const shown = useCountUp(value, active, delay);

  return (
    <div className="grid grid-cols-[5.5rem_1fr_3.25rem] items-center gap-2 text-[11px]">
      <span className={ours ? 'font-medium text-ink' : 'text-muted'}>{name}</span>
      <span className="h-2 overflow-hidden rounded-full bg-surface-soft">
        <span
          className={`block h-full origin-left rounded-full ${ours ? 'bg-brand' : 'bg-line-strong'}`}
          style={{
            width: `${(value / max) * 100}%`,
            transform: `scaleX(${active ? 1 : 0})`,
            ...transition('transform', delay),
          }}
        />
      </span>
      <span className={`text-right tabular-nums ${ours ? 'font-semibold text-ink' : 'text-muted'}`}>
        {display(shown)}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* KV-cache paper                                                      */
/* ------------------------------------------------------------------ */

const fateSegments = [
  { name: 'Compaction', pct: 50.1, color: 'var(--brand)' },
  { name: 'Session ended', pct: 37.5, color: 'color-mix(in srgb, var(--brand) 60%, var(--surface))' },
  { name: 'Other orphans', pct: 11.4, color: 'color-mix(in srgb, var(--brand) 30%, var(--surface))' },
  { name: 'Read again', pct: 1.0, color: 'var(--text)' },
];

export const KvCacheViz: React.FC<{ active: boolean }> = ({ active }) => {
  const wasted = useCountUp(99, active, 0, 1300);
  let offset = 0;

  return (
    <Panel
      active={active}
      title="Results"
      label="99% of KV-cache blocks offloaded to SSD were never read again: 50.1% invalidated by conversation compaction, 37.5% by session end, 11.4% other orphaned blocks. System write amplification fell from 1.229 to 0.870, and avoidable recomputation from 375 to 220 tokens per turn."
    >
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums tracking-[-0.03em] text-ink">
            {Math.round(wasted)}%
          </span>
          <span className="text-xs text-muted">of SSD writes were never read again</span>
        </div>

        {/* Each segment slides in from where the previous one ends. */}
        <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-surface-soft">
          {fateSegments.map((segment, index) => {
            const left = offset;
            offset += segment.pct;
            return (
              <span
                key={segment.name}
                className="absolute inset-y-0 origin-left"
                style={{
                  left: `${left}%`,
                  width: `${segment.pct}%`,
                  background: segment.color,
                  transform: `scaleX(${active ? 1 : 0})`,
                  ...transition('transform', index * 260, 700),
                }}
              />
            );
          })}
        </div>

        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted">
          {fateSegments.map((segment, index) => (
            <li
              key={segment.name}
              className="flex items-center gap-1.5"
              style={{ opacity: active ? 1 : 0.35, ...transition('opacity', index * 260, 500) }}
            >
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: segment.color }} />
              <span>
                {segment.name} <span className="tabular-nums text-subtle">{segment.pct}%</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <CompareBars
        active={active}
        title="System write amplification"
        delay={900}
        max={1.229}
        note="−29.2%"
        rows={[
          { name: 'LMCache', value: 1.229, display: (v) => v.toFixed(3) },
          { name: 'Ours', value: 0.87, display: (v) => v.toFixed(3), ours: true },
        ]}
      />

      <CompareBars
        active={active}
        title="Avoidable recompute (tokens / turn)"
        delay={1200}
        max={375}
        note="−41%"
        rows={[
          { name: 'LMCache', value: 375, display: (v) => Math.round(v).toString() },
          { name: 'Ours', value: 220, display: (v) => Math.round(v).toString(), ours: true },
        ]}
      />
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Creative-writing project                                            */
/* ------------------------------------------------------------------ */

// Mean story length (tokens) per on-policy SDPO round; round 0 is the base model.
const sdpoRounds = [726, 688, 612, 503];

const W = 280;
const H = 84;
const PAD = { left: 8, right: 34, top: 14, bottom: 16 };
const yMin = 450;
const yMax = 760;
const px = (i: number) => PAD.left + (i / (sdpoRounds.length - 1)) * (W - PAD.left - PAD.right);
const py = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom);

const ShrinkLine: React.FC<{ active: boolean }> = ({ active }) => {
  const path = useRef<SVGPolylineElement>(null);
  const [length, setLength] = useState(400);

  useEffect(() => {
    if (path.current) setLength(path.current.getTotalLength());
  }, []);

  const points = sdpoRounds.map((v, i) => `${px(i)},${py(v)}`).join(' ');

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium text-ink">SDPO story length per round</p>
        <span
          className="text-xs font-semibold tabular-nums text-brand"
          style={{ opacity: active ? 1 : 0, ...transition('opacity', 1100, 400) }}
        >
          shrinking
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full overflow-visible" role="presentation">
        {/* base-model reference */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={py(726)}
          y2={py(726)}
          stroke="var(--border-strong)"
          strokeDasharray="3 4"
          strokeWidth={1}
        />
        <text x={W - PAD.right + 4} y={py(726) + 3} fontSize="9" fill="var(--text-subtle)">
          base
        </text>

        <polyline
          ref={path}
          points={points}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: length,
            strokeDashoffset: active ? 0 : length,
            ...transition('stroke-dashoffset', 0, 1200),
          }}
        />

        {sdpoRounds.map((v, i) => {
          const delay = (i / (sdpoRounds.length - 1)) * 1000;
          return (
            <g
              key={i}
              style={{ opacity: active ? 1 : 0, ...transition('opacity', delay, 300) }}
            >
              <circle cx={px(i)} cy={py(v)} r={3} fill="var(--surface)" stroke="var(--brand)" strokeWidth={2} />
              <text
                x={px(i)}
                y={py(v) - 7}
                fontSize="9"
                textAnchor="middle"
                fill="var(--text)"
                className="tabular-nums"
              >
                {v}
              </text>
              <text x={px(i)} y={H - 4} fontSize="9" textAnchor="middle" fill="var(--text-subtle)">
                {i === 0 ? 'Base' : `R${i}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const WritingViz: React.FC<{ active: boolean }> = ({ active }) => (
  <Panel
    active={active}
    title="Results"
    label="Under SDPO, mean story length fell from 726 tokens to 688, 612 and 503 over three rounds. After three rounds, stories kept 72.1% of their length under SDPO versus 95.9% with Anchored Polarity Contrast. Criticized passages were pushed down in 30 of 63 stories under SDPO versus 50 of 64 with Anchored Polarity Contrast."
  >
    <ShrinkLine active={active} />

    <CompareBars
      active={active}
      title="Length kept after 3 rounds"
      delay={900}
      max={100}
      rows={[
        { name: 'SDPO', value: 72.1, display: (v) => `${v.toFixed(1)}%` },
        { name: 'APC (ours)', value: 95.9, display: (v) => `${v.toFixed(1)}%`, ours: true },
      ]}
    />

    <CompareBars
      active={active}
      title="Stories where criticized text went down"
      delay={1200}
      max={100}
      rows={[
        { name: 'SDPO', value: (30 / 63) * 100, display: (v) => `${Math.round((v / 100) * 63)}/63` },
        { name: 'APC (ours)', value: (50 / 64) * 100, display: (v) => `${Math.round((v / 100) * 64)}/64`, ours: true },
      ]}
    />
  </Panel>
);
