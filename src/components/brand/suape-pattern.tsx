import { cn } from "@/lib/utils";

export interface SuapePatternProps {
  className?: string;
  tone?: "light" | "dark";
}

/** Pattern geométrico repetitivo, inspirado no padrão de losangos da identidade SUAPE. */
export function SuapePattern({ className, tone = "light" }: SuapePatternProps) {
  const color = tone === "light" ? "#FFFFFF" : "var(--color-primary-700)";

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="suape-tile"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <rect width="64" height="64" fill="transparent" />
          <polygon
            points="32,8 48,32 32,56 16,32"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.5"
          />
          <circle cx="32" cy="32" r="4" fill={color} opacity="0.6" />
          <polygon points="0,32 8,32 0,40" fill={color} opacity="0.25" />
          <polygon points="64,32 56,32 64,24" fill={color} opacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#suape-tile)" />
    </svg>
  );
}
