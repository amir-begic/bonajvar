"use client";

import { useEffect, useRef } from "react";

interface Props {
  svgContent: string;
}

export default function AjvarIllustration({ svgContent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const bodyLayer = container.querySelector<SVGGElement>("#layer-body");
    const mediumLayer = container.querySelector<SVGGElement>("#layer-medium");
    const seedsLayer = container.querySelector<SVGGElement>("#layer-seeds");

    const svg = container.querySelector("svg");
    if (svg) {
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
    // lastMouseMove = 0 means "never moved" → idle animation starts immediately.
    // Moving the mouse resets it; after 2 s of no movement it drifts again.
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
        // Slow figure-8 drift when no mouse input (always active on mobile)
        targetX = Math.sin(t * 0.35) * 2.0;
        targetY = Math.cos(t * 0.25) * 1.5;
      }

      // Slower lerp during idle → dreamier feel
      const speed = isIdle ? 0.022 : 0.07;
      currentX = lerp(currentX, targetX, speed);
      currentY = lerp(currentY, targetY, speed);

      if (bodyLayer)
        bodyLayer.style.transform = `translate(${currentX * 6}px, ${currentY * 5}px)`;
      if (mediumLayer)
        mediumLayer.style.transform = `translate(${currentX * 14}px, ${currentY * 11}px)`;
      if (seedsLayer)
        seedsLayer.style.transform = `translate(${currentX * 24}px, ${currentY * 18}px)`;

      raf = requestAnimationFrame(tick);
    };

    // ── Gyroscope parallax (mobile) ─────────────────────────────────
    // beta/gamma → targetX/Y, suppressing idle drift while active.
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

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      // iOS 13+ — request inside a user gesture (first touch)
      const onFirstTouch = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then((state: string) => { if (state === "granted") registerGyro(); })
          .catch(() => {});
      };
      document.addEventListener("touchstart", onFirstTouch, { once: true });
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-[15%] inset-y-[-5%] z-10 pointer-events-none"
      style={{
        filter: "blur(28px)",
        transition: "filter 1.6s ease-out",
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
