import DunneStars from "./DunneStars";

export default function DunneBadge() {
  return (
    <div className="relative" style={{ width: 150, height: 150 }}>
      <DunneStars />
      <span
        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white uppercase text-[22px] leading-5"
        style={{ fontFamily: "var(--font-labil)" }}
      >
        100%
        <br />
        Dunne
      </span>
    </div>
  );
}
