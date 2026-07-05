const GLOW_COLOR = '#a3e635';

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    d += ` Q ${p0.x} ${p0.y} ${(p0.x + p1.x) / 2} ${(p0.y + p1.y) / 2}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

/** Small glowing trend line, ending in a highlighted dot on the most recent value. */
export function Sparkline({ data, width = 96, height = 32 }: { data: number[]; width?: number; height?: number }) {
  if (data.length === 0) return null;

  const max = Math.max(1, ...data);
  const padding = 4;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1 || 1)) * width,
    y: height - padding - (v / max) * (height - padding * 2),
  }));
  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path
        d={buildSmoothPath(points)}
        fill="none"
        stroke={GLOW_COLOR}
        strokeWidth={1.5}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 3px ${GLOW_COLOR})` }}
      />
      <circle cx={last.x} cy={last.y} r={2.5} fill={GLOW_COLOR} style={{ filter: `drop-shadow(0 0 4px ${GLOW_COLOR})` }} />
    </svg>
  );
}
