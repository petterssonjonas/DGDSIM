import { useAppStore } from '@/store/app-store';

export function ResultsPanel() {
  const trajectories = useAppStore((s) => s.trajectories);

  if (trajectories.length === 0) return null;

  const primary = trajectories[0]!;
  const driftDir =
    primary.lateralDriftM > 0 ? 'R' : primary.lateralDriftM < 0 ? 'L' : '—';

  return (
    <div className="px-4 pb-4 space-y-2 border-t border-zinc-800 pt-3">
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
        Results
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <StatCard
          label="Distance"
          value={`${primary.totalDistanceM.toFixed(1)}m`}
          sub={`${(primary.totalDistanceM * 3.281).toFixed(0)} ft`}
          accent
        />
        <StatCard
          label="Max Height"
          value={`${primary.maxHeightM.toFixed(1)}m`}
          sub={`${(primary.maxHeightM * 3.281).toFixed(0)} ft`}
        />
        <StatCard
          label="Lateral Drift"
          value={`${Math.abs(primary.lateralDriftM).toFixed(1)}m ${driftDir}`}
          sub={primary.lateralDriftM === 0 ? 'Straight' : primary.lateralDriftM > 0 ? 'Right' : 'Left'}
        />
        <StatCard
          label="Hang Time"
          value={`${primary.hangTimeS.toFixed(1)}s`}
        />
      </div>

      {trajectories.length > 1 && (
        <div className="mt-2 rounded-md border border-zinc-800 overflow-hidden">
          {trajectories.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center gap-2 px-3 py-1.5 border-b border-zinc-800/50 last:border-0 text-xs"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-zinc-400">#{i + 1}</span>
              <span className="text-zinc-200 tabular-nums">{t.totalDistanceM.toFixed(0)}m</span>
              <span className="text-zinc-600 tabular-nums ml-auto">
                drift {t.lateralDriftM > 0 ? '+' : ''}{t.lateralDriftM.toFixed(1)}m
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-center">
      <div className="text-[9px] text-zinc-600 uppercase tracking-wide">{label}</div>
      <div className={`text-base font-bold mt-0.5 ${accent ? 'text-emerald-400' : 'text-zinc-100'}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-zinc-600 mt-0.5">{sub}</div>}
    </div>
  );
}
