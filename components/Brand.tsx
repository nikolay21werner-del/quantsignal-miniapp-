export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative grid place-items-center rounded-2xl"
      style={{ width: size, height: size }}
    >
      <div className="brand-ring absolute inset-0 rounded-2xl opacity-90 blur-[1px]" />
      <div className="absolute inset-[2px] rounded-[14px] bg-bg-900" />
      <svg
        viewBox="0 0 24 24"
        width={size * 0.58}
        height={size * 0.58}
        className="relative"
        fill="none"
        aria-hidden
      >
        <path
          d="M3 16.5 8 11l3.5 3.5L17 8l4 4.5"
          stroke="#22E1D9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="17" cy="8" r="1.8" fill="#22E1D9" />
      </svg>
    </div>
  );
}

export function BrandWord({ small = false }: { small?: boolean }) {
  return (
    <div className="leading-none">
      <div
        className={`font-extrabold tracking-tight ${small ? "text-[15px]" : "text-[17px]"}`}
      >
        <span className="text-ink-100">QUANT</span>
        <span className="bg-brand-grad bg-clip-text text-transparent">SIGNAL</span>
      </div>
      <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-ink-300">
        AI · Trading Intelligence
      </div>
    </div>
  );
}
