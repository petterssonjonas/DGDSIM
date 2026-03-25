import { useAppStore } from '@/store/app-store';
import { Tooltip } from './Tooltip';
import type { ThrowType, PlasticType } from '@/physics/types';

/** Speed comparison labels shown under throw speed slider */
function speedLabel(mps: number): string {
  if (mps <= 14) return 'Youth / Casual';
  if (mps <= 18) return 'Recreational';
  if (mps <= 22) return 'Intermediate';
  if (mps <= 26) return 'Advanced';
  if (mps <= 30) return 'Club / Semi-Pro';
  return 'Pro / Elite';
}

const THROW_TYPES: { value: ThrowType; label: string; short: string }[] = [
  { value: 'RHBH', label: 'Right Hand Backhand', short: 'RHBH' },
  { value: 'RHFH', label: 'Right Hand Forehand', short: 'RHFH' },
  { value: 'LHBH', label: 'Left Hand Backhand', short: 'LHBH' },
  { value: 'LHFH', label: 'Left Hand Forehand', short: 'LHFH' },
];

const PLASTIC_TYPES: { value: PlasticType; label: string; desc: string }[] = [
  { value: 'TPU', label: 'Premium', desc: 'Hard, overstable, durable' },
  { value: 'TPE', label: 'Base', desc: 'Soft, understable, breaks in fast' },
];

export function ThrowPanel() {
  const velocityMps = useAppStore((s) => s.velocityMps);
  const hyzerAngleDeg = useAppStore((s) => s.hyzerAngleDeg);
  const launchAngleDeg = useAppStore((s) => s.launchAngleDeg);
  const noseAngleDeg = useAppStore((s) => s.noseAngleDeg);
  const releaseHeightM = useAppStore((s) => s.releaseHeightM);
  const spinLevel = useAppStore((s) => s.spinLevel);
  const throwType = useAppStore((s) => s.throwType);
  const wobble = useAppStore((s) => s.wobble);
  const weightG = useAppStore((s) => s.weightG);
  const pronouncedDome = useAppStore((s) => s.pronouncedDome);
  const wornIn = useAppStore((s) => s.wornIn);
  const plasticType = useAppStore((s) => s.plasticType);
  const setThrow = useAppStore((s) => s.setThrow);
  const setModifiers = useAppStore((s) => s.setModifiers);

  const velocityMph = Math.round(velocityMps * 2.237);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Throw Configuration
      </h3>

      {/* Throw Type */}
      <div>
        <label className="text-xs text-slate-500 flex items-center">
          Throw Type
          <Tooltip text="Determines spin direction. Forehand and lefty backhand reverse the turn/fade curve." />
        </label>
        <div className="grid grid-cols-4 gap-1 mt-1">
          {THROW_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setThrow({ throwType: t.value })}
              title={t.label}
              className={`rounded px-1.5 py-1 text-xs font-medium transition-colors ${
                throwType === t.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.short}
            </button>
          ))}
        </div>
      </div>

      {/* Throw Speed */}
      <div>
        <Slider
          label={`Throw Speed: ${velocityMps} m/s (${velocityMph} mph)`}
          tooltip="Initial disc release speed. Higher speed activates the disc's high-speed turn characteristics."
          min={10}
          max={38}
          step={0.5}
          value={velocityMps}
          onChange={(v) => setThrow({ velocityMps: v })}
        />
        <div className="text-[10px] text-blue-500 mt-0.5 font-medium">
          {speedLabel(velocityMps)}
        </div>
      </div>

      {/* Hyzer Angle */}
      <Slider
        label={`Hyzer: ${hyzerAngleDeg > 0 ? '+' : ''}${hyzerAngleDeg}°`}
        tooltip="Disc tilt at release. Positive = hyzer (left edge down for RHBH). Negative = anhyzer (right edge down)."
        min={-30}
        max={30}
        step={1}
        value={hyzerAngleDeg}
        onChange={(v) => setThrow({ hyzerAngleDeg: v })}
      />

      {/* Launch Angle */}
      <Slider
        label={`Launch Angle: ${launchAngleDeg}°`}
        tooltip="Trajectory angle above horizontal at release. The direction the disc is moving, not the disc's pitch."
        min={-5}
        max={25}
        step={1}
        value={launchAngleDeg}
        onChange={(v) => setThrow({ launchAngleDeg: v })}
      />

      {/* Nose Angle */}
      <Slider
        label={`Nose Angle: ${noseAngleDeg > 0 ? '+' : ''}${noseAngleDeg}°`}
        tooltip="Disc pitch RELATIVE to flight path. Nose up (+) = disc stalls/balloons. Nose down (-) = disc stays fast. Separate from launch angle."
        min={-5}
        max={15}
        step={0.5}
        value={noseAngleDeg}
        onChange={(v) => setThrow({ noseAngleDeg: v })}
      />

      {/* Release Height */}
      <Slider
        label={`Release Height: ${releaseHeightM.toFixed(1)}m`}
        tooltip="Height of the disc at the moment of release. Taller players release higher."
        min={0.3}
        max={1.8}
        step={0.1}
        value={releaseHeightM}
        onChange={(v) => setThrow({ releaseHeightM: v })}
      />

      {/* Spin Level */}
      <div>
        <label className="text-xs text-slate-500 flex items-center">
          Spin
          <Tooltip text="Spin rate multiplier. Higher spin = more gyroscopic stability = disc holds its line longer before fading." />
        </label>
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

      {/* Wobble / OAT */}
      <Slider
        label={`Wobble (OAT): ${wobble === 0 ? 'Clean' : (wobble * 100).toFixed(0) + '%'}`}
        tooltip="Off-axis torque — wobble from a bad release. Bleeds spin energy faster, reducing stability. 0 = perfect release."
        min={0}
        max={1}
        step={0.05}
        value={wobble}
        onChange={(v) => setThrow({ wobble: v })}
      />

      <hr className="border-slate-200" />

      <h4 className="text-xs font-semibold text-slate-500 uppercase">Disc Modifiers</h4>

      {/* Weight */}
      <Slider
        label={`Weight: ${weightG}g`}
        tooltip="Heavier discs resist wind better and carry more momentum. Lighter discs get more lift relative to mass."
        min={130}
        max={180}
        step={1}
        value={weightG}
        onChange={(v) => setModifiers({ weightG: v })}
      />

      {/* Plastic Type */}
      <div>
        <label className="text-xs text-slate-500 flex items-center">
          Plastic
          <Tooltip text="Base/soft plastics (DX, Pro-D, K1 Soft) are slightly less stable. Premium/hard plastics (Star, ESP, Neutron) hold stability longer." />
        </label>
        <div className="flex gap-1 mt-1">
          {PLASTIC_TYPES.map((p) => (
            <button
              key={p.value}
              onClick={() => setModifiers({ plasticType: p.value })}
              title={p.desc}
              className={`flex-1 rounded px-2 py-1 text-xs transition-colors ${
                plasticType === p.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={pronouncedDome}
            onChange={(e) => setModifiers({ pronouncedDome: e.target.checked })}
            className="rounded"
          />
          Domed
          <Tooltip text="Pronounced dome increases lift but shifts stability slightly understable." />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={wornIn}
            onChange={(e) => setModifiers({ wornIn: e.target.checked })}
            className="rounded"
          />
          Beat-in
          <Tooltip text="Worn/seasoned disc. Rounded edges reduce drag and shift flight slightly understable." />
        </label>
      </div>
    </div>
  );
}

function Slider({
  label,
  tooltip,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  tooltip?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
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
