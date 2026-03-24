import { useAppStore } from '@/store/app-store';

export function SimControls() {
  const runSimulation = useAppStore((s) => s.runSimulation);
  const startAnimation = useAppStore((s) => s.startAnimation);
  const stopAnimation = useAppStore((s) => s.stopAnimation);
  const isSimulating = useAppStore((s) => s.isSimulating);
  const isAnimating = useAppStore((s) => s.isAnimating);
  const trajectories = useAppStore((s) => s.trajectories);
  const numFlightLines = useAppStore((s) => s.numFlightLines);
  const setNumFlightLines = useAppStore((s) => s.setNumFlightLines);
  const isPremium = useAppStore((s) => s.isPremium);
  const maxFlightLines = useAppStore((s) => s.maxFlightLines);

  return (
    <div className="space-y-3">
      {/* Flight lines control */}
      {isPremium && (
        <div>
          <label className="text-xs text-slate-500">
            Flight Lines: {numFlightLines}
          </label>
          <input
            type="range"
            min={1}
            max={maxFlightLines}
            step={1}
            value={numFlightLines}
            onChange={(e) => setNumFlightLines(parseInt(e.target.value))}
            className="w-full h-1.5 mt-1 accent-blue-500"
          />
        </div>
      )}

      {!isPremium && (
        <div className="rounded bg-amber-50 border border-amber-200 p-2 text-xs text-amber-700">
          Free tier: 1 flight line per simulation.
          <button className="ml-1 underline font-medium">Upgrade for up to 10</button>
        </div>
      )}

      {/* Simulate button */}
      <button
        onClick={runSimulation}
        disabled={isSimulating}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors"
      >
        {isSimulating ? 'Simulating...' : 'Simulate Flight'}
      </button>

      {/* Animation controls */}
      {trajectories.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={isAnimating ? stopAnimation : startAnimation}
            className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {isAnimating ? 'Stop' : 'Play Animation'}
          </button>
        </div>
      )}
    </div>
  );
}
