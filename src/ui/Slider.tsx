import { Tooltip } from './Tooltip';

export function Slider({
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
      <label className="text-xs text-zinc-400 flex items-center gap-0.5 mb-1.5">
        <span>{label}</span>
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
