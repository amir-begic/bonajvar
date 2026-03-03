"use client";

const STARS = 12;
const ORBIT_R = 54;       // px from centre to star centre
const DURATION = 12;      // seconds per revolution
const SIZE = 150;
const CX = SIZE / 2;      // 75
const CY = SIZE / 2;      // 75

/** Five-pointed star path centred at (0, 0) */
function starPath(ro: number, ri: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a = ((i * 36 - 90) * Math.PI) / 180;
    pts.push(`${(r * Math.cos(a)).toFixed(3)},${(r * Math.sin(a)).toFixed(3)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

const STAR = starPath(9, 3.8);

export default function DunneStars() {
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      aria-hidden
    >
      {/*
        Each star sits at the origin of the ring-centre coordinate system.
        The animation:
          rotate(θ)          — sweeps the star around the centre
          translateY(-54px)  — places it on the orbit radius
          rotate(-θ)         — counter-rotates so the star shape stays upright
        Negative animation-delay positions each star evenly around the ring
        without needing 12 separate keyframe sets.
      */}
      <g transform={`translate(${CX} ${CY})`}>
        {Array.from({ length: STARS }).map((_, i) => (
          <g
            key={i}
            style={{
              transformOrigin: "0 0",
              animationName: reducedMotion ? "none" : "star-orbit",
              animationDuration: `${DURATION}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: `${-(i / STARS) * DURATION}s`,
            }}
          >
            <path d={STAR} fill="#1d1d1b" />
          </g>
        ))}
      </g>
    </svg>
  );
}
