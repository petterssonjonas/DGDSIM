import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { searchDiscs, getAllManufacturers, getDiscsByManufacturer } from '@/data/discs';
import type { Disc, DiscType } from '@/data/disc-types';

const DISC_TYPE_LABELS: Record<DiscType, string> = {
  putter: 'Putter',
  midrange: 'Midrange',
  fairway: 'Fairway',
  distance: 'Distance',
};

const DISC_TYPE_COLORS: Record<DiscType, string> = {
  putter: 'bg-green-100 text-green-800',
  midrange: 'bg-blue-100 text-blue-800',
  fairway: 'bg-amber-100 text-amber-800',
  distance: 'bg-red-100 text-red-800',
};

export function DiscSelector() {
  const selectedDisc = useAppStore((s) => s.selectedDisc);
  const selectDisc = useAppStore((s) => s.selectDisc);

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DiscType | 'all'>('all');
  const [mfgFilter, setMfgFilter] = useState<string>('all');

  const manufacturers = useMemo(() => getAllManufacturers(), []);

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
    return discs.slice(0, 50); // Limit for performance
  }, [query, typeFilter, mfgFilter]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Disc Selection{' '}
        <a
          href="https://github.com/cdleveille/discit-api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-normal text-blue-500 hover:text-blue-600 normal-case tracking-normal"
        >
          via DiscIt
        </a>
      </h3>

      {/* Selected disc display */}
      {selectedDisc && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900">{selectedDisc.name}</span>
              <span className="ml-2 text-sm text-slate-500">{selectedDisc.manufacturer}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${DISC_TYPE_COLORS[selectedDisc.type]}`}>
              {DISC_TYPE_LABELS[selectedDisc.type]}
            </span>
          </div>
          <div className="mt-2 flex gap-3 text-sm">
            <FlightNum label="Speed" value={selectedDisc.speed} />
            <FlightNum label="Glide" value={selectedDisc.glide} />
            <FlightNum label="Turn" value={selectedDisc.turn} />
            <FlightNum label="Fade" value={selectedDisc.fade} />
          </div>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search discs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
      />

      {/* Filters */}
      <div className="flex gap-2">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as DiscType | 'all')}
          className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs"
        >
          <option value="all">All Types</option>
          {(Object.keys(DISC_TYPE_LABELS) as DiscType[]).map((t) => (
            <option key={t} value={t}>{DISC_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select
          value={mfgFilter}
          onChange={(e) => setMfgFilter(e.target.value)}
          className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs"
        >
          <option value="all">All Brands</option>
          {manufacturers.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Results list */}
      <div className="max-h-48 overflow-y-auto rounded border border-slate-200">
        {results.map((disc) => (
          <button
            key={disc.id}
            onClick={() => { selectDisc(disc.id); setQuery(''); }}
            className={`w-full text-left px-3 py-1.5 text-sm border-b border-slate-100 last:border-0 hover:bg-blue-50 transition-colors ${
              disc.id === selectedDisc?.id ? 'bg-blue-50 font-medium' : ''
            }`}
          >
            <span className="text-slate-900">{disc.name}</span>
            <span className="ml-1.5 text-slate-400 text-xs">{disc.manufacturer}</span>
            <span className="float-right text-xs text-slate-500">
              {disc.speed}/{disc.glide}/{disc.turn}/{disc.fade}
            </span>
          </button>
        ))}
        {results.length === 0 && (
          <div className="px-3 py-4 text-center text-sm text-slate-400">No discs found</div>
        )}
      </div>
    </div>
  );
}

function FlightNum({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-bold text-slate-800">{value}</div>
    </div>
  );
}
