import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { searchDiscs, getAllManufacturers, getDiscsByManufacturer } from '@/data/discs';
import { getSponsor } from '@/data/sponsors';
import { getBuyUrl, MANUFACTURER_SITES } from '@/data/manufacturer-sites';
import { Section } from './Section';
import type { Disc, DiscType } from '@/data/disc-types';

const TOLERANCE = 0.5;

const TYPE_PILLS: { value: DiscType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'putter', label: 'Putter' },
  { value: 'midrange', label: 'Mid' },
  { value: 'fairway', label: 'Fairway' },
  { value: 'distance', label: 'Dist' },
];

const TYPE_DOT: Record<DiscType, string> = {
  putter: 'bg-violet-400',
  midrange: 'bg-sky-400',
  fairway: 'bg-amber-400',
  distance: 'bg-rose-400',
};

const TYPE_BADGE: Record<DiscType, string> = {
  putter: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  midrange: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  fairway: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  distance: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

const TYPE_LABEL: Record<DiscType, string> = {
  putter: 'Putter',
  midrange: 'Mid',
  fairway: 'Fairway',
  distance: 'Distance',
};

export function DiscSelector() {
  const selectedDisc = useAppStore((s) => s.selectedDisc);
  const selectDisc = useAppStore((s) => s.selectDisc);
  const selectCustomDisc = useAppStore((s) => s.selectCustomDisc);

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DiscType | 'all'>('all');
  const [mfgFilter, setMfgFilter] = useState<string>('all');

  // Flight number filter inputs (empty string = not filtering on that field)
  const [fnSpeed, setFnSpeed] = useState('');
  const [fnGlide, setFnGlide] = useState('');
  const [fnTurn, setFnTurn] = useState('');
  const [fnFade, setFnFade] = useState('');

  const manufacturers = useMemo(() => getAllManufacturers(), []);

  const fnValues = useMemo(() => ({
    speed: fnSpeed !== '' ? parseFloat(fnSpeed) : null,
    glide: fnGlide !== '' ? parseFloat(fnGlide) : null,
    turn: fnTurn !== '' ? parseFloat(fnTurn) : null,
    fade: fnFade !== '' ? parseFloat(fnFade) : null,
  }), [fnSpeed, fnGlide, fnTurn, fnFade]);

  const hasFnFilter = Object.values(fnValues).some((v) => v !== null && !isNaN(v));

  const results = useMemo(() => {
    let discs: Disc[];
    if (query.trim()) {
      discs = searchDiscs(query);
    } else if (mfgFilter !== 'all') {
      discs = getDiscsByManufacturer(mfgFilter);
    } else {
      discs = searchDiscs('');
    }
    if (typeFilter !== 'all') {
      discs = discs.filter((d) => d.type === typeFilter);
    }
    if (fnValues.speed !== null && !isNaN(fnValues.speed)) {
      discs = discs.filter((d) => Math.abs(d.speed - fnValues.speed!) <= TOLERANCE);
    }
    if (fnValues.glide !== null && !isNaN(fnValues.glide)) {
      discs = discs.filter((d) => Math.abs(d.glide - fnValues.glide!) <= TOLERANCE);
    }
    if (fnValues.turn !== null && !isNaN(fnValues.turn)) {
      discs = discs.filter((d) => Math.abs(d.turn - fnValues.turn!) <= TOLERANCE);
    }
    if (fnValues.fade !== null && !isNaN(fnValues.fade)) {
      discs = discs.filter((d) => Math.abs(d.fade - fnValues.fade!) <= TOLERANCE);
    }
    return discs.slice(0, 50);
  }, [query, typeFilter, mfgFilter, fnValues]);

  const allFnFilled =
    fnValues.speed !== null && !isNaN(fnValues.speed) &&
    fnValues.glide !== null && !isNaN(fnValues.glide) &&
    fnValues.turn !== null && !isNaN(fnValues.turn) &&
    fnValues.fade !== null && !isNaN(fnValues.fade);

  const showCustomButton = allFnFilled && results.length === 0;

  function handleSelectCustom() {
    selectCustomDisc({
      speed: fnValues.speed!,
      glide: fnValues.glide!,
      turn: fnValues.turn!,
      fade: fnValues.fade!,
    });
  }

  function clearFnFilters() {
    setFnSpeed('');
    setFnGlide('');
    setFnTurn('');
    setFnFade('');
  }

  return (
    <Section title="Disc">
      {/* Selected disc card */}
      {selectedDisc && (
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-zinc-100 truncate">
                {selectedDisc.name}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 truncate">
                {selectedDisc.manufacturer}
              </div>
            </div>
            <span
              className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded border ${TYPE_BADGE[selectedDisc.type]}`}
            >
              {TYPE_LABEL[selectedDisc.type]}
            </span>
          </div>

          {/* Flight numbers */}
          <div className="mt-3 grid grid-cols-4 gap-1">
            <FlightNum label="Speed" value={selectedDisc.speed} max={14} color="bg-emerald-500" />
            <FlightNum label="Glide" value={selectedDisc.glide} max={7} color="bg-sky-500" />
            <TurnNum value={selectedDisc.turn} />
            <FlightNum label="Fade" value={selectedDisc.fade} max={5} color="bg-rose-500" />
          </div>

          {/* DiscIt attribution */}
          <div className="mt-2 text-[10px] text-zinc-600">
            Data via{' '}
            <a
              href="https://github.com/cdleveille/discit-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-400 underline underline-offset-2"
            >
              DiscIt
            </a>
            {' '}· 1148 discs
          </div>
        </div>
      )}

      {/* Buy It spot */}
      {selectedDisc && (
        <BuyItSpot
          discId={selectedDisc.id}
          discName={selectedDisc.name}
          manufacturer={selectedDisc.manufacturer}
        />
      )}

      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <path d="M10 10l3 3" />
        </svg>
        <input
          type="text"
          placeholder="Search discs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-md pl-8 pr-8 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-600 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.707 4.293a1 1 0 00-1.414 1.414L6.586 9l-3.293 3.293a1 1 0 001.414 1.414L8 10.414l3.293 3.293a1 1 0 001.414-1.414L9.414 9l3.293-3.293a1 1 0 00-1.414-1.414L8 7.586 4.707 4.293z" />
            </svg>
          </button>
        )}
      </div>

      {/* Type pills */}
      <div className="flex gap-1">
        {TYPE_PILLS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTypeFilter(value)}
            className={`flex-1 rounded px-1 py-1 text-[11px] font-medium transition-colors ${
              typeFilter === value
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Brand filter */}
      <select
        value={mfgFilter}
        onChange={(e) => setMfgFilter(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-600 transition-colors"
      >
        <option value="all">All Brands</option>
        {manufacturers.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Flight number search */}
      <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Custom Flight Numbers
          </span>
          {hasFnFilter && (
            <button
              onClick={clearFnFilters}
              className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {([
            { label: 'Spd', value: fnSpeed, set: setFnSpeed, placeholder: '12', min: '1', max: '14' },
            { label: 'Gli', value: fnGlide, set: setFnGlide, placeholder: '5', min: '1', max: '7' },
            { label: 'Trn', value: fnTurn, set: setFnTurn, placeholder: '-1', min: '-5', max: '1' },
            { label: 'Fade', value: fnFade, set: setFnFade, placeholder: '3', min: '0', max: '5' },
          ] as const).map(({ label, value, set, placeholder }) => (
            <div key={label} className="text-center">
              <div className="text-[9px] text-zinc-600 uppercase tracking-wide mb-1">{label}</div>
              <input
                type="number"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-1.5 py-1 text-xs text-zinc-100 text-center focus:outline-none focus:border-emerald-600 transition-colors placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>
        {hasFnFilter && !showCustomButton && (
          <div className="text-[10px] text-zinc-500">
            {results.length} disc{results.length !== 1 ? 's' : ''} match
          </div>
        )}
        {showCustomButton && (
          <button
            onClick={handleSelectCustom}
            className="w-full rounded-md bg-emerald-600/15 border border-emerald-600/30 hover:bg-emerald-600/25 text-emerald-400 text-xs font-medium py-1.5 transition-colors"
          >
            Use Custom — {fnValues.speed}/{fnValues.glide}/{fnValues.turn}/{fnValues.fade}
          </button>
        )}
      </div>

      {/* Results list */}
      <div className="rounded-md border border-zinc-800 overflow-hidden max-h-48 overflow-y-auto">
        {results.map((disc) => (
          <button
            key={disc.id}
            onClick={() => { selectDisc(disc.id); setQuery(''); }}
            className={`w-full text-left px-3 py-2 flex items-center gap-2 border-b border-zinc-800/50 last:border-0 transition-colors ${
              disc.id === selectedDisc?.id
                ? 'bg-emerald-600/10 border-l-2 border-l-emerald-500'
                : 'hover:bg-zinc-800/60'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_DOT[disc.type]}`} />
            <span className="flex-1 min-w-0">
              <span className="text-xs text-zinc-200 font-medium truncate block">{disc.name}</span>
              <span className="text-[10px] text-zinc-500 truncate block">{disc.manufacturer}</span>
            </span>
            <span className="text-[10px] text-zinc-500 flex-shrink-0 tabular-nums">
              {disc.speed}/{disc.glide}/{disc.turn}/{disc.fade}
            </span>
          </button>
        ))}
        {results.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-zinc-600">No discs found</div>
        )}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Buy It ad spot
// ---------------------------------------------------------------------------

function BuyItSpot({
  discId,
  discName,
  manufacturer,
}: {
  discId: string;
  discName: string;
  manufacturer: string;
}) {
  // Custom disc has no manufacturer to link to
  if (discId === 'custom') return null;

  const sponsor = getSponsor(discId, manufacturer);
  const isSponsored = sponsor !== null;

  const href = sponsor?.discUrl ?? sponsor?.storeUrl ?? getBuyUrl(discName, manufacturer);
  const cta = sponsor?.cta ?? 'Buy Now';
  const storeName = sponsor?.storeName ?? manufacturer;
  const tagline = sponsor?.tagline ?? (MANUFACTURER_SITES[manufacturer]?.searchTpl
    ? `Search ${manufacturer} for this disc`
    : null);

  // Sponsored: warm amber premium card
  // Default: subtle zinc card — still useful, just not premium placement
  const borderColor = isSponsored ? 'rgba(180,130,40,0.25)' : 'rgba(63,63,70,0.8)';
  const bgGradient = isSponsored
    ? 'linear-gradient(135deg, rgba(120,80,20,0.18) 0%, rgba(30,27,24,0.95) 60%)'
    : 'rgba(24,24,27,0.6)';
  const stripeColor = isSponsored
    ? 'linear-gradient(180deg, rgba(200,160,60,0.6) 0%, rgba(160,100,20,0.3) 100%)'
    : 'linear-gradient(180deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.1) 100%)';
  const ctaColor = isSponsored ? 'rgba(210,165,60,0.9)' : 'rgba(113,113,122,0.9)';
  const ctaBg = isSponsored ? 'rgba(180,130,40,0.12)' : 'rgba(39,39,42,0.8)';
  const ctaBorder = isSponsored ? 'rgba(180,130,40,0.2)' : 'rgba(63,63,70,0.6)';
  const hoverBorder = isSponsored ? 'rgba(180,130,40,0.45)' : 'rgba(82,82,91,1)';
  const hoverGlow = isSponsored ? '0 0 16px 0 rgba(180,130,40,0.12)' : 'none';

  return (
    <a
      href={href}
      target="_blank"
      rel={`noopener noreferrer${isSponsored ? ' sponsored' : ''}`}
      className="group block rounded-lg overflow-hidden relative"
      style={{
        background: bgGradient,
        border: `1px solid ${borderColor}`,
        boxShadow: 'none',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = hoverGlow;
        (e.currentTarget as HTMLElement).style.borderColor = hoverBorder;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.borderColor = borderColor;
      }}
    >
      {/* Left accent stripe */}
      <div
        className="absolute inset-y-0 left-0 w-0.5 rounded-l-lg"
        style={{ background: stripeColor }}
      />

      <div className="px-3 py-2 pl-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div
              className="text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5"
              style={{ color: isSponsored ? 'rgba(180,130,40,0.5)' : 'rgba(113,113,122,0.5)' }}
            >
              {isSponsored ? 'Sponsored' : 'Buy'}
            </div>
            <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
              {storeName}
            </div>
            {tagline && (
              <div className="text-[10px] text-zinc-600 mt-0.5 truncate">{tagline}</div>
            )}
          </div>

          <div
            className="flex-shrink-0 flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold transition-all"
            style={{ background: ctaBg, color: ctaColor, border: `1px solid ${ctaBorder}` }}
          >
            {cta}
            <svg
              className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6h8M7 3l3 3-3 3" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------

function FlightNum({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, Math.max(4, (value / max) * 100));
  return (
    <div className="text-center">
      <div className="text-[9px] text-zinc-600 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-sm font-bold text-zinc-100">{value}</div>
      <div className="mt-1 h-0.5 rounded-full bg-zinc-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function TurnNum({ value }: { value: number }) {
  // Turn: negative = understable (turns right RHBH), positive = overstable at speed
  const isUnder = value < 0;
  const pct = Math.min(50, (Math.abs(value) / 5) * 50);
  return (
    <div className="text-center">
      <div className="text-[9px] text-zinc-600 uppercase tracking-wide mb-0.5">Turn</div>
      <div className={`text-sm font-bold ${isUnder ? 'text-emerald-400' : value > 0 ? 'text-orange-400' : 'text-zinc-100'}`}>
        {value}
      </div>
      <div className="mt-1 h-0.5 rounded-full bg-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-px h-full bg-zinc-700" />
        {isUnder && (
          <div
            className="absolute h-full right-1/2 bg-emerald-500 rounded-l-full"
            style={{ width: `${pct}%` }}
          />
        )}
        {value > 0 && (
          <div
            className="absolute h-full left-1/2 bg-orange-500 rounded-r-full"
            style={{ width: `${(value / 1) * 50}%` }}
          />
        )}
      </div>
    </div>
  );
}
