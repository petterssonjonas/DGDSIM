import { useAppStore } from '@/store/app-store';

export function ThrowPanel() {
  const velocityMps = useAppStore((s) => s.velocityMps);
  const hyzerAngleDeg = useAppStore((s) => s.hyzerAngleDeg);
  const launchAngleDeg = useAppStore((s) => s.launchAngleDeg);
  const releaseHeightM = useAppStore((s) => s.releaseHeightM);
  const spinLevel = useAppStore((s) => s.spinLevel);
  const weightG = useAppStore((s) => s.weightG);
  const pronouncedDome = useAppStore((s) => s.pronouncedDome);
  const wornIn = useAppStore((s) => s.wornIn);
  const setThrow = useAppStore((s) => s.setThrow);
  const setModifiers = useAppStore((s) => s.setModifiers);

  // Convert m/s to mph for display
  const velocityMph = Math.round(velocityMps * 2.237);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Throw Configuration
      </h3>

      <Slider
        label={`Throw Speed: ${velocityMps} m/s (${velocityMph} mph)`}
        min={12}
        max={38}
        step={0.5}
        value={velocityMps}
        onChange={(v) => setThrow({ velocityMps: v })}
      />

      <Slider
        label={`Hyzer Angle: ${hyzerAngleDeg > 0 ? '+' : ''}${hyzerAngleDeg}°`}
        min={-30}
        max={30}
        step={1}
        value={hyzerAngleDeg}
        onChange={(v) => setThrow({ hyzerAngleDeg: v })}
      />

      <Slider
        label={`Launch Angle: ${launchAngleDeg}°`}
        min={-5}
        max={25}
        step={1}
        value={launchAngleDeg}
        onChange={(v) => setThrow({ launchAngleDeg: v })}
      />

      <Slider
        label={`Release Height: ${releaseHeightM.toFixed(1)}m`}
        min={0.3}
        max={1.8}
        step={0.1}
        value={releaseHeightM}
        onChange={(v) => setThrow({ releaseHeightM: v })}
      />

      <div>
        <label className="text-xs text-slate-500">Spin</label>
        <div className="flex gap-1 mt-1">
          {(['low', 'normal', 'high'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setThrow({ spinLevel: level })}
              className={`flex-1 rounded px-2 py-1 text-xs capitalize transition-colors ${
                spinLevel === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-200" />

      <h4 className="text-xs font-semibold text-slate-500 uppercase">Disc Modifiers</h4>

      <Slider
        label={`Weight: ${weightG}g`}
        min={130}
        max={180}
        step={1}
        value={weightG}
        onChange={(v) => setModifiers({ weightG: v })}
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={pronouncedDome}
            onChange={(e) => setModifiers({ pronouncedDome: e.target.checked })}
            className="rounded"
          />
          Domed
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={wornIn}
            onChange={(e) => setModifiers({ wornIn: e.target.checked })}
            className="rounded"
          />
          Beat-in
        </label>
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 mt-1 accent-blue-500"
      />
    </div>
  );
}
