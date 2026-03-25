import { useState } from 'react';

/**
 * Small info icon with hover tooltip for explaining UI controls.
 */
export function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex ml-1 cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg
        className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 transition-colors"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A1.5 1.5 0 019.5 6.25v0a1 1 0 01-1 1H8a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.07A2.5 2.5 0 006.5 6.25v0zM8 11a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 px-2.5 py-1.5 text-xs text-white bg-slate-800 rounded-md shadow-lg leading-relaxed pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}
