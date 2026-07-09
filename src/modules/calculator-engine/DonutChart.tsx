interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  slices: DonutSlice[];
}

export function DonutChart({ title, slices }: DonutChartProps) {
  const total = slices.reduce((sum, s) => sum + Math.abs(s.value), 0);
  if (total === 0) {
    return (
      <div className="rounded-xl border border-navy-100 bg-white p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">{title}</p>
        <p className="text-center text-xs text-navy-300 py-6">Fill in values to see chart</p>
      </div>
    );
  }

  const SIZE = 120;
  const RADIUS = 40;
  const STROKE = 14;
  const CENTER = SIZE / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Build stroked circle segments
  let offset = 0;
  const segments = slices.map((slice) => {
    const pct = Math.abs(slice.value) / total;
    const dash = pct * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const seg = { ...slice, pct, dash, gap, offset };
    offset += dash;
    return seg;
  });

  // Rotation so first segment starts at top
  const rotation = -90;

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">{title}</p>
      <div className="flex items-center gap-4">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="shrink-0">
          {/* Background circle */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={-seg.offset}
              transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="flex flex-col gap-1.5 min-w-0">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: seg.color }} />
              <span className="text-navy-600 truncate">{seg.label}</span>
              <span className="ml-auto font-semibold text-navy-800 shrink-0">{seg.pct > 0 ? `${(seg.pct * 100).toFixed(1)}%` : '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
