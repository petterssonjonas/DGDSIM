import { useAppStore } from '@/store/app-store';
import { Tooltip } from './Tooltip';
import { Slider } from './Slider';
import { Section } from './Section';

function windDirectionLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(deg / 45) % 8;
  return dirs[idx] ?? 'N';
}

function WindCompass({ heading }: { heading: number }) {
  return (
    <div className="relative w-7 h-7 rounded-full border border-zinc-700 bg-zinc-900 flex-shrink-0 flex items-center justify-center">
      <div
        className="absolute w-0.5 h-2.5 bg-emerald-500 bottom-1/2 left-1/2 origin-bottom rounded-full"
        style={{ transform: `translateX(-50%) rotate(${heading}deg)` }}
      />
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-zinc-600">N</span>
    </div>
  );
}

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
    <Section title="Environment" defaultOpen={false}>
      <Slider
        label={`Wind — ${windSpeedMps.toFixed(1)} m/s (${windSpeedKmh} km/h)`}
        tooltip="Wind speed. Headwind adds lift to overstable discs. Tailwind reduces effective airspeed."
        min={0}
        max={15}
        step={0.5}
        value={windSpeedMps}
        onChange={(v) => setEnvironment({ windSpeedMps: v })}
      />

      <div>
        <label className="text-xs text-zinc-500 flex items-center gap-0.5 mb-1.5">
          Wind Direction — {windHeadingDeg}° (from {windDir})
          <Tooltip text="0° = headwind (into the throw), 90° = crosswind from right, 180° = tailwind, 270° = crosswind from left." />
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={350}
            step={10}
            value={windHeadingDeg}
            onChange={(e) => setEnvironment({ windHeadingDeg: parseInt(e.target.value, 10) })}
            className="flex-1"
          />
          <WindCompass heading={windHeadingDeg} />
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <Slider
        label={`Altitude — ${altitudeM}m (${Math.round(altitudeM * 3.281)}ft)`}
        tooltip="Elevation above sea level. Higher = thinner air = discs fly farther but less predictably."
        min={0}
        max={3000}
        step={50}
        value={altitudeM}
        onChange={(v) => setEnvironment({ altitudeM: v })}
      />

      <Slider
        label={`Temperature — ${tempCelsius}°C (${Math.round(tempCelsius * 1.8 + 32)}°F)`}
        tooltip="Hotter air is thinner — similar effect to higher altitude."
        min={-10}
        max={45}
        step={1}
        value={tempCelsius}
        onChange={(v) => setEnvironment({ tempCelsius: v })}
      />

      <div className="h-px bg-zinc-800" />

      <Slider
        label={`Ground Elevation — ${groundElevationM > 0 ? '+' : ''}${groundElevationM}m`}
        tooltip="Height difference tee to landing zone. Positive = uphill. Negative = downhill (disc flies farther)."
        min={-30}
        max={30}
        step={1}
        value={groundElevationM}
        onChange={(v) => setEnvironment({ groundElevationM: v })}
      />
    </Section>
  );
}
