export function PlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 4l14 8-14 8V4z" />
    </svg>
  );
}

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function MenuIcon({ open = false }: { open?: boolean }) {
  return open ? (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ) : (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
}

export function SectionLabel({
  kicker,
  title,
  small,
}: {
  kicker: string;
  title?: string;
  small?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-bluegray">
        <span className="h-px w-8 bg-navy/30" />
        {kicker}
      </div>
      {title ? (
        <h2
          className={
            'mt-5 font-display text-navy ' +
            (small ? 'text-3xl lg:text-4xl' : 'text-4xl lg:text-6xl')
          }
        >
          {title}
        </h2>
      ) : null}
    </div>
  );
}
