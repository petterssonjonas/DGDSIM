import { useState, type ReactNode } from 'react';

export function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          {title}
        </span>
        <svg
          className={`w-3 h-3 text-zinc-600 transition-transform duration-150 ${open ? '' : '-rotate-90'}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>
      {open && <div className="px-4 pb-5 space-y-3">{children}</div>}
    </div>
  );
}
