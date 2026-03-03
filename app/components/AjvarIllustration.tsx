"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  svgContent: string;
}

export default function AjvarIllustration({ svgContent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGyroBtn, setShowGyroBtn] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      typeof DeviceOrientationEvent !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    );
  });
  const registerGyroRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const bodyLayer = container.querySelector<SVGGElement>("#layer-body");
    const mediumLayer = container.querySelector<SVGGElement>("#layer-medium");
    const seedsLayer = container.querySelector<SVGGElement>("#layer-seeds");

    const svg = container.querySelector("svg");
    if (svg) {
      // setAttribute overrides the SVG width/height attributes — iOS Safari
      // ignores style.width/height when explicit attributes are present.
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.width = "100%";
      svg.style.height = "100%";
    }

    // ── Blur clear ──────────────────────────────────────────────────
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.filter = "blur(0px)";
        });
      });
    }

    // ── Mouse parallax + idle drift ─────────────────────────────────
    let lastMouseMove = 0;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      lastMouseMove = Date.now();
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onMouseLeave = () => {
      lastMouseMove = 0;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const t = performance.now() / 1000;
      const isIdle = Date.now() - lastMouseMove > 800;

      if (isIdle) {
        targetX = Math.sin(t * 0.35) * 2.0;
        targetY = Math.cos(t * 0.25) * 1.5;
      }

      const speed = isIdle ? 0.022 : 0.07;
      currentX = lerp(currentX, targetX, speed);
      currentY = lerp(currentY, targetY, speed);

      // Use setAttribute — CSS style.transform on SVG <g> elements is
      // unreliable on iOS Safari. SVG transform attributes work universally.
      if (bodyLayer)
        bodyLayer.setAttribute("transform", `translate(${currentX * 6} ${currentY * 5})`);
      if (mediumLayer)
        mediumLayer.setAttribute("transform", `translate(${currentX * 14} ${currentY * 11})`);
      if (seedsLayer)
        seedsLayer.setAttribute("transform", `translate(${currentX * 24} ${currentY * 18})`);

      raf = requestAnimationFrame(tick);
    };

    // ── Gyroscope parallax (mobile) ─────────────────────────────────
    // betaRef calibrates the neutral hold angle on first reading.
    let betaRef: number | null = null;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      if (betaRef === null) betaRef = e.beta;
      lastMouseMove = Date.now(); // suppress idle drift
      targetX = Math.max(-1, Math.min(1, e.gamma / 30));
      targetY = Math.max(-1, Math.min(1, (e.beta - betaRef) / 30));
    };

    const registerGyro = () => {
      window.addEventListener("deviceorientation", onOrientation);
    };

    // Expose registerGyro so the button click handler (outside useEffect) can call it
    registerGyroRef.current = registerGyro;

    if (showGyroBtn) {
      // iOS 13+: button is shown; gyro will be registered when user taps it.
    } else if (typeof DeviceOrientationEvent !== "undefined") {
      // Android / desktop with gyro — no prompt needed
      registerGyro();
    }

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("deviceorientation", onOrientation);
      cancelAnimationFrame(raf);
    };
  }, [showGyroBtn]);

  const handleGyroRequest = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (DeviceOrientationEvent as any)
      .requestPermission()
      .then((state: string) => { if (state === "granted") registerGyroRef.current(); })
      .catch(() => {});
    setShowGyroBtn(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-x-[15%] inset-y-[-5%] z-10 pointer-events-none"
        style={{
          filter: "blur(28px)",
          transition: "filter 1.6s ease-out",
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {showGyroBtn && (
        <button
          onClick={handleGyroRequest}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full border-2 border-white text-white uppercase text-sm tracking-wide"
          style={{ fontFamily: "var(--font-labil)" }}
        >
          Enable tilt
        </button>
      )}
    </>
  );
}
