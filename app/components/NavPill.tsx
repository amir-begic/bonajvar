interface Props {
  label: string;
  href: string;
  animationDelay?: string;
}

export default function NavPill({ label, href, animationDelay = "0s" }: Props) {
  return (
    <a
      href={href}
      className="reveal-up group relative overflow-hidden flex items-center justify-center h-9 px-6 rounded-full border-2 border-[#1d1d1b] uppercase tracking-wide text-[22px] leading-none"
      style={{ fontFamily: "var(--font-labil)", animationDelay }}
    >
      {/* bottom-up fill */}
      <span className="absolute inset-0 bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
      {/* text – turns blue on hover */}
      <span className="relative text-white transition-colors duration-300 group-hover:text-[#505fde]">
        {label}
      </span>
    </a>
  );
}
