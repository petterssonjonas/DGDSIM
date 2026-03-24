import { useAppStore } from '@/store/app-store';

export function ResultsPanel() {
  const trajectories = useAppStore((s) => s.trajectories);

  if (trajectories.length === 0) return null;

  const primary = trajectories[0]!;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Results
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="Distance"
          value={`${primary.totalDistanceM.toFixed(1)}m`}
          sublabel={`${(primary.totalDistanceM * 3.281).toFixed(0)}ft`}
        />
        <StatCard
          label="Max Height"
          value={`${primary.maxHeightM.toFixed(1)}m`}
          sublabel={`${(primary.maxHeightM * 3.281).toFixed(0)}ft`}
        />
        <StatCard
          label="Lateral Drift"
          value={`${primary.lateralDriftM > 0 ? '+' : ''}${primary.lateralDriftM.toFixed(1)}m`}
          sublabel={primary.lateralDriftM > 0 ? 'Right' : primary.lateralDriftM < 0 ? 'Left' : 'Center'}
        />
        <StatCard
          label="Hang Time"
          value={`${primary.hangTimeS.toFixed(1)}s`}
          sublabel=""
        />
      </div>

      {trajectories.length > 1 && (
        <div className="mt-2">
          <h4 className="text-xs text-slate-400 mb-1">All Lines</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {trajectories.map((t, i) => (
              <div key={t.id} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-slate-600">
                  #{i + 1}: {t.totalDistanceM.toFixed(0)}m, drift {t.lateralDriftM > 0 ? '+' : ''}{t.lateralDriftM.toFixed(1)}m
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-center">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-lg font-bold text-slate-800">{value}</div>
      {sublabel && <div className="text-xs text-slate-400">{sublabel}</div>}
    </div>
  );
}
