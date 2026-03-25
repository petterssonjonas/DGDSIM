import { useAppStore } from '@/store/app-store';
import { Tooltip } from './Tooltip';

export function EnvPanel() {
  const windSpeedMps = useAppStore((s) => s.windSpeedMps);
  const windHeadingDeg = useAppStore((s) => s.windHeadingDeg);
  const altitudeM = useAppStore((s) => s.altitudeM);
  const tempCelsius = useAppStore((s) => s.tempCelsius);
  const groundElevationM = useAppStore((s) => s.groundElevationM);
  const setEnvironment = useAppStore((s) => s.setEnvironment);

  const windSpeedKmh = Math.round(windSpeedMps * 3.6);
  const windDir = windDirectionLabel(windHeadingDeg);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Environment
      </h3>

      <Slider
        label={`Wind: ${windSpeedMps.toFixed(1)} m/s (${windSpeedKmh} km/h)`}
        tooltip="Wind speed. Headwind adds lift and distance to overstable discs. Tailwind reduces effective airspeed."
        min={0}
        max={15}
        step={0.5}
        value={windSpeedMps}
        onChange={(v) => setEnvironment({ windSpeedMps: v })}
      />

      <div>
        <label className="text-xs text-slate-500 flex items-center">
          Wind Direction: {windHeadingDeg}° ({windDir})
          <Tooltip text="0° = headwind (into the throw), 90° = crosswind from right, 180° = tailwind, 270° = crosswind from left." />
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="range"
            min={0}
            max={350}
            step={10}
            value={windHeadingDeg}
            onChange={(e) => setEnvironment({ windHeadingDeg: parseInt(e.target.value) })}
            className="flex-1 h-1.5 accent-blue-500"
          />
          <WindCompass heading={windHeadingDeg} />
        </div>
      </div>

      <hr className="border-slate-200" />

      <Slider
        label={`Altitude: ${altitudeM}m (${Math.round(altitudeM * 3.281)}ft)`}
        tooltip="Elevation above sea level. Higher altitude = thinner air = less lift and drag = discs fly farther but less predictably."
        min={0}
        max={3000}
        step={50}
        value={altitudeM}
        onChange={(v) => setEnvironment({ altitudeM: v })}
      />

      <Slider
        label={`Temperature: ${tempCelsius}°C (${Math.round(tempCelsius * 1.8 + 32)}°F)`}
        tooltip="Air temperature affects density. Hotter air is thinner — similar effect to higher altitude."
        min={-10}
        max={45}
        step={1}
        value={tempCelsius}
        onChange={(v) => setEnvironment({ tempCelsius: v })}
      />

      <hr className="border-slate-200" />

      <Slider
        label={`Ground Elevation: ${groundElevationM > 0 ? '+' : ''}${groundElevationM}m`}
        tooltip="Height difference from tee to landing zone. Positive = uphill (disc lands sooner). Negative = downhill (disc flies farther)."
        min={-30}
        max={30}
        step={1}
        value={groundElevationM}
        onChange={(v) => setEnvironment({ groundElevationM: v })}
      />

    </div>
  );
}

function windDirectionLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(deg / 45) % 8;
  return `from ${dirs[idx]}`;
}

function WindCompass({ heading }: { heading: number }) {
  return (
    <div className="relative w-8 h-8 rounded-full border border-slate-300 bg-white flex-shrink-0">
      <div
        className="absolute w-0.5 h-3 bg-blue-500 left-1/2 bottom-1/2 origin-bottom rounded"
        style={{ transform: `translateX(-50%) rotate(${heading}deg)` }}
      />
      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-[8px] text-slate-400">N</span>
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
