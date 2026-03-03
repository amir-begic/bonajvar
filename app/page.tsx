import { readFileSync } from "fs";
import { join } from "path";
import AjvarIllustration from "./components/AjvarIllustration";
import DunneBadge from "./components/DunneBadge";
import NavPill from "./components/NavPill";

export default function Home() {
  const svgContent = readFileSync(
    join(process.cwd(), "public/assets/ajvar-grouped.svg"),
    "utf-8"
  );

  return (
    <main
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", backgroundColor: "#505fde" }}
    >
      {/* ── Nav pills – top left ── */}
      <nav className="absolute left-1.25 top-1.25 flex gap-2 z-20">
        <NavPill label="Contact" href="/contact" animationDelay="0s" />
        <NavPill label="T-Shirt" href="/merch" animationDelay="0.08s" />
      </nav>

      {/* ── 100% Dunne badge – desktop: top right ── */}
      <div
        className="reveal-up hidden md:block absolute right-4 top-1.5 z-20"
        style={{ animationDelay: "0.12s" }}
      >
        <DunneBadge />
      </div>

      {/* ── Giant title – pushed lower on mobile ── */}
      <div
        className="absolute inset-x-0 top-0 text-center uppercase leading-none select-none pointer-events-none z-30 pt-32 md:pt-[3vh]"
        style={{
          fontFamily: "var(--font-atilla)",
          fontSize: "clamp(100px, 22vw, 320px)",
          lineHeight: 0.88,
          color: "#111",
        }}
      >
        <span className="reveal-down block" style={{ animationDelay: "0.5s" }}>
          BON
        </span>
        <span className="reveal-down block" style={{ animationDelay: "0.68s" }}>
          AJVAR
        </span>
      </div>

      {/* ── 100% Dunne badge – mobile: below title ── */}
      <div
        className="reveal-up md:hidden absolute left-1/2 -translate-x-1/2 bottom-24 z-20"
        style={{ animationDelay: "0.12s" }}
      >
        <DunneBadge />
      </div>

      {/* ── Paprika SVG with mouse parallax + idle drift (z-10, behind title) ── */}
      <AjvarIllustration svgContent={svgContent} />

      {/* ── Bottom-left variant copy – hidden on mobile ── */}
      <div
        className="reveal-up hidden md:block absolute left-34.75 bottom-[10%] z-20"
        style={{ fontFamily: "var(--font-labil)", animationDelay: "0.15s" }}
      >
        <div className="relative p-3 w-77.25">
          <span className="absolute top-0 left-0 text-white text-[20px] leading-none">+</span>
          <span className="absolute top-0 right-0 text-white text-[20px] leading-none">+</span>
          <span className="absolute bottom-0 left-0 text-white text-[20px] leading-none">+</span>
          <span className="absolute bottom-0 right-0 text-white text-[20px] leading-none">+</span>
          <p className="text-white uppercase text-[42px] leading-10 text-center">
            Natural
            <br />
            pasteurized
            <br />
            roasted
          </p>
        </div>
      </div>

      {/* ── Bottom-right variant copy – hidden on mobile ── */}
      <div
        className="reveal-up hidden md:block absolute right-34.75 bottom-[10%] z-20"
        style={{ fontFamily: "var(--font-labil)", animationDelay: "0.22s" }}
      >
        <div className="relative p-3 w-77.25">
          <span className="absolute top-0 left-0 text-white text-[20px] leading-none">+</span>
          <span className="absolute top-0 right-0 text-white text-[20px] leading-none">+</span>
          <span className="absolute bottom-0 left-0 text-white text-[20px] leading-none">+</span>
          <span className="absolute bottom-0 right-0 text-white text-[20px] leading-none">+</span>
          <p className="text-white uppercase text-[42px] leading-10 text-center">
            Hot
            <br />
            original
            <br />
            spicy
          </p>
        </div>
      </div>
    </main>
  );
}
