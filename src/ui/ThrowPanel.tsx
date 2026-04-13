import { useAppStore } from '@/store/app-store';
import { Tooltip } from './Tooltip';
import { Slider } from './Slider';
import { Section } from './Section';
import type { ThrowType, PlasticType } from '@/physics/types';

function speedLabel(mps: number): string {
  if (mps <= 14) return 'Youth / Casual';
  if (mps <= 18) return 'Recreational';
  if (mps <= 22) return 'Intermediate';
  if (mps <= 26) return 'Advanced';
  if (mps <= 30) return 'Club / Semi-Pro';
  return 'Pro / Elite';
}

const THROW_TYPES: { value: ThrowType; label: string }[] = [
  { value: 'RHBH', label: 'RHBH' },
  { value: 'RHFH', label: 'RHFH' },
  { value: 'LHBH', label: 'LHBH' },
  { value: 'LHFH', label: 'LHFH' },
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
    <>
      <Section title="Throw">
        {/* Throw type */}
        <div>
          <label className="text-xs text-zinc-500 flex items-center gap-0.5 mb-1.5">
            Throw Type
            <Tooltip text="Determines spin direction. Forehand and lefty backhand reverse the turn/fade curve." />
          </label>
          <div className="grid grid-cols-4 gap-1">
            {THROW_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setThrow({ throwType: t.value })}
                title={t.label}
                className={`rounded px-1.5 py-1.5 text-xs font-semibold transition-colors ${
                  throwType === t.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div>
          <Slider
            label={`Speed — ${velocityMps} m/s (${velocityMph} mph)`}
            tooltip="Initial disc release speed. Higher speed activates the disc's high-speed turn characteristics."
            min={10}
            max={38}
            step={0.5}
            value={velocityMps}
            onChange={(v) => setThrow({ velocityMps: v })}
          />
          <div className="text-[10px] text-emerald-500 mt-1 font-medium">{speedLabel(velocityMps)}</div>
        </div>

        <Slider
          label={`Hyzer — ${hyzerAngleDeg > 0 ? '+' : ''}${hyzerAngleDeg}°`}
          tooltip="Disc tilt at release. Positive = hyzer (left edge down for RHBH). Negative = anhyzer."
          min={-30}
          max={30}
          step={1}
          value={hyzerAngleDeg}
          onChange={(v) => setThrow({ hyzerAngleDeg: v })}
        />

        <Slider
          label={`Launch Angle — ${launchAngleDeg}°`}
          tooltip="Trajectory angle above horizontal at release. The direction the disc is moving, not the disc's pitch."
          min={-5}
          max={25}
          step={1}
          value={launchAngleDeg}
          onChange={(v) => setThrow({ launchAngleDeg: v })}
        />

        <Slider
          label={`Nose Angle — ${noseAngleDeg > 0 ? '+' : ''}${noseAngleDeg}°`}
          tooltip="Disc pitch relative to flight path. Nose up (+) = stalls/balloons. Nose down (−) = disc stays fast."
          min={-5}
          max={15}
          step={0.5}
          value={noseAngleDeg}
          onChange={(v) => setThrow({ noseAngleDeg: v })}
        />

        <Slider
          label={`Release Height — ${releaseHeightM.toFixed(1)}m`}
          tooltip="Height of the disc at the moment of release."
          min={0.3}
          max={1.8}
          step={0.1}
          value={releaseHeightM}
          onChange={(v) => setThrow({ releaseHeightM: v })}
        />

        {/* Spin */}
        <div>
          <label className="text-xs text-zinc-500 flex items-center gap-0.5 mb-1.5">
            Spin
            <Tooltip text="Spin rate multiplier. Higher spin = more gyroscopic stability = disc holds its line longer before fading." />
          </label>
          <div className="flex gap-1">
            {(['low', 'normal', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setThrow({ spinLevel: level })}
                className={`flex-1 rounded py-1.5 text-xs font-medium capitalize transition-colors ${
                  spinLevel === level
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Wobble */}
        <div>
          <Slider
            label={`Wobble (OAT) — ${wobble === 0 ? 'Clean release' : (wobble * 100).toFixed(0) + '% off-axis'}`}
            tooltip="Off-axis torque from a bad release. Bleeds spin energy faster, reducing stability and distance."
            min={0}
            max={1}
            step={0.05}
            value={wobble}
            onChange={(v) => setThrow({ wobble: v })}
          />
          {wobble > 0.4 && (
            <div className="text-[10px] text-amber-500 mt-1">Heavy wobble — significantly reduces distance</div>
          )}
        </div>
      </Section>

      <Section title="Disc Modifiers" defaultOpen={false}>
        <Slider
          label={`Weight — ${weightG}g`}
          tooltip="Heavier discs resist wind better and carry more momentum. Lighter discs get more lift relative to mass."
          min={130}
          max={180}
          step={1}
          value={weightG}
          onChange={(v) => setModifiers({ weightG: v })}
        />

        <div>
          <label className="text-xs text-zinc-500 flex items-center gap-0.5 mb-1.5">
            Plastic
            <Tooltip text="Base plastics (DX, Pro-D) are slightly less stable. Premium plastics (Star, ESP, Neutron) hold stability longer." />
          </label>
          <div className="flex gap-1">
            {PLASTIC_TYPES.map((p) => (
              <button
                key={p.value}
                onClick={() => setModifiers({ plasticType: p.value })}
                title={p.desc}
                className={`flex-1 rounded py-1.5 text-xs font-medium transition-colors ${
                  plasticType === p.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={pronouncedDome}
              onChange={(e) => setModifiers({ pronouncedDome: e.target.checked })}
              className="rounded accent-emerald-500"
            />
            Domed
            <Tooltip text="Pronounced dome increases lift but shifts stability slightly understable." />
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={wornIn}
              onChange={(e) => setModifiers({ wornIn: e.target.checked })}
              className="rounded accent-emerald-500"
            />
            Beat-in
            <Tooltip text="Worn/seasoned disc. Rounded edges reduce drag and shift flight slightly understable." />
          </label>
        </div>
      </Section>
    </>
  );
}
