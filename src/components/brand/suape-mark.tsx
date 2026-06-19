function starPoints(
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  rotationDeg = 0,
): string {
  const cx = 50;
  const cy = 50;
  const step = Math.PI / spikes;
  let angle = ((rotationDeg - 90) * Math.PI) / 180;
  const points: string[] = [];

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    angle += step;
  }

  return points.join(" ");
}

const PINWHEEL_POINTS = starPoints(8, 46, 21);
const CENTER_CUTOUT_POINTS = starPoints(4, 19, 19, 45);
const SUN_POINTS = starPoints(16, 12, 7);

export interface SuapeMarkProps {
  className?: string;
  background?: string;
  title?: string;
}

/** Marca geométrica inspirada no símbolo institucional SUAPE (sol + losango). */
export function SuapeMark({
  className,
  background = "var(--color-surface)",
  title = "SUAPE",
}: SuapeMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title}
    >
      <polygon points={PINWHEEL_POINTS} fill="var(--color-primary-600)" />
      <polygon points={CENTER_CUTOUT_POINTS} fill={background} />
      <polygon points={SUN_POINTS} fill="var(--color-accent-500)" />
    </svg>
  );
}
