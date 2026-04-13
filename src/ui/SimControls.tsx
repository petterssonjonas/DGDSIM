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
    <div className="px-4 py-3 space-y-2">
      {/* Premium: flight lines control */}
      {isPremium && (
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Flight Lines — {numFlightLines}
          </label>
          <input
            type="range"
            min={1}
            max={maxFlightLines}
            step={1}
            value={numFlightLines}
            onChange={(e) => setNumFlightLines(parseInt(e.target.value, 10))}
            className="w-full mt-1"
          />
        </div>
      )}

      {/* Free tier notice */}
      {!isPremium && (
        <div className="flex items-center justify-between rounded-md bg-amber-500/5 border border-amber-500/15 px-3 py-1.5">
          <span className="text-[10px] text-amber-500/80">Free — 1 flight line</span>
          <button className="text-[10px] text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Upgrade →
          </button>
        </div>
      )}

      {/* Simulate button */}
      <button
        onClick={runSimulation}
        disabled={isSimulating}
        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 px-4 py-2.5 text-sm font-bold text-white transition-colors shadow-lg shadow-emerald-900/30"
      >
        {isSimulating ? 'Simulating...' : 'Simulate Flight'}
      </button>

      {/* Animation controls */}
      {trajectories.length > 0 && (
        <button
          onClick={isAnimating ? stopAnimation : startAnimation}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {isAnimating ? '■ Stop Animation' : '▶ Play Animation'}
        </button>
      )}
    </div>
  );
}
