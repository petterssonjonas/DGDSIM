import { create } from 'zustand';
import { airDensityFromConditions } from '@/physics/atmosphere';
import { getAeroCoefficients } from '@/physics/coefficients';
import { simulate } from '@/physics/simulation';
import type {
  FlightNumbers,
  ModifierParams,
  WindConfig,
  SimulationResult,
  Vec3,
  ThrowType,
  PlasticType,
} from '@/physics/types';
import type { Disc } from '@/data/disc-types';
import { DISC_DATABASE, getDiscById } from '@/data/discs';

// --- Trajectory result with metadata for rendering ---

export interface TrajectoryEntry {
  id: string;
  points: Vec3[];
  color: string;
  isSelected: boolean;
  landingPoint: Vec3;
  totalDistanceM: number;
  maxHeightM: number;
  lateralDriftM: number;
  hangTimeS: number;
}

// --- Flight path colors ---

const PATH_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#a855f7',
];

// --- Store state ---

interface AppState {
  // Disc selection
  selectedDiscId: string;
  selectedDisc: Disc | null;

  // Throw config
  velocityMps: number;        // 12-38 m/s
  hyzerAngleDeg: number;      // -30 to +30
  launchAngleDeg: number;     // -5 to 25
  noseAngleDeg: number;       // -5 to +15 (nose up/down relative to flight path)
  releaseHeightM: number;     // 0.3 to 1.8
  spinLevel: 'low' | 'normal' | 'high';
  throwType: ThrowType;       // RHBH, RHFH, LHBH, LHFH
  wobble: number;             // 0-1 off-axis torque

  // Disc modifiers
  weightG: number;
  pronouncedDome: boolean;
  wornIn: boolean;
  plasticType: PlasticType;   // TPE (soft/base) or TPU (hard/premium)

  // Environment
  windSpeedMps: number;
  windHeadingDeg: number;
  altitudeM: number;
  tempCelsius: number;
  humidityPercent: number;
  groundElevationM: number;   // positive = uphill from tee

  // Simulation results
  trajectories: TrajectoryEntry[];
  isSimulating: boolean;

  // Animation
  isAnimating: boolean;
  animatingIndex: number;

  // Premium (soft gate)
  isPremium: boolean;
  maxFlightLines: number;
  numFlightLines: number;

  // Actions
  selectDisc: (discId: string) => void;
  setThrow: (params: Partial<{
    velocityMps: number;
    hyzerAngleDeg: number;
    launchAngleDeg: number;
    noseAngleDeg: number;
    releaseHeightM: number;
    spinLevel: 'low' | 'normal' | 'high';
    throwType: ThrowType;
    wobble: number;
  }>) => void;
  setModifiers: (params: Partial<{
    weightG: number;
    pronouncedDome: boolean;
    wornIn: boolean;
    plasticType: PlasticType;
  }>) => void;
  setEnvironment: (params: Partial<{
    windSpeedMps: number;
    windHeadingDeg: number;
    altitudeM: number;
    tempCelsius: number;
    humidityPercent: number;
    groundElevationM: number;
  }>) => void;
  setNumFlightLines: (n: number) => void;
  runSimulation: () => void;
  startAnimation: () => void;
  stopAnimation: () => void;
}

function spinMultiplier(level: 'low' | 'normal' | 'high'): number {
  switch (level) {
    case 'low': return 0.6;
    case 'high': return 1.4;
    default: return 1.0;
  }
}

/** Generate slight variations for multi-line spread */
function varyAngle(base: number, index: number, total: number): number {
  if (total <= 1) return base;
  const spread = 8; // degrees total spread
  const step = spread / (total - 1);
  return base - spread / 2 + step * index;
}

// Default to a popular disc
const DEFAULT_DISC_ID = 'innova-destroyer';

export const useAppStore = create<AppState>((set, get) => ({
  // Disc
  selectedDiscId: DEFAULT_DISC_ID,
  selectedDisc: getDiscById(DEFAULT_DISC_ID) ?? DISC_DATABASE[0]!,

  // Throw
  velocityMps: 24,
  hyzerAngleDeg: 5,
  launchAngleDeg: 8,
  noseAngleDeg: 0,
  releaseHeightM: 1.0,
  spinLevel: 'normal',
  throwType: 'RHBH',
  wobble: 0,

  // Modifiers
  weightG: 175,
  pronouncedDome: false,
  wornIn: false,
  plasticType: 'TPU',

  // Environment
  windSpeedMps: 0,
  windHeadingDeg: 0,
  altitudeM: 100,
  tempCelsius: 20,
  humidityPercent: 50,
  groundElevationM: 0,

  // Simulation
  trajectories: [],
  isSimulating: false,

  // Animation
  isAnimating: false,
  animatingIndex: 0,

  // Premium
  isPremium: false,
  maxFlightLines: 1, // Free tier: 1 line
  numFlightLines: 1,

  // Actions
  selectDisc: (discId: string) => {
    const disc = getDiscById(discId);
    if (disc) {
      set({ selectedDiscId: discId, selectedDisc: disc, trajectories: [] });
    }
  },

  setThrow: (params) => set({ ...params, trajectories: [] }),
  setModifiers: (params) => set({ ...params, trajectories: [] }),
  setEnvironment: (params) => set({ ...params, trajectories: [] }),

  setNumFlightLines: (n: number) => {
    const s = get();
    const max = s.isPremium ? 10 : 1;
    set({ numFlightLines: Math.min(Math.max(1, n), max), trajectories: [] });
  },

  runSimulation: () => {
    const s = get();
    if (!s.selectedDisc) return;

    set({ isSimulating: true, isAnimating: false });

    const disc = s.selectedDisc;
    const flight: FlightNumbers = {
      speed: disc.speed,
      glide: disc.glide,
      turn: disc.turn,
      fade: disc.fade,
    };
    const modifiers: ModifierParams = {
      weightG: s.weightG,
      pronouncedDome: s.pronouncedDome,
      wornIn: s.wornIn,
      plasticType: s.plasticType,
    };
    const coeffs = getAeroCoefficients(flight, modifiers);
    const massKg = s.weightG / 1000;
    const rho = airDensityFromConditions(
      s.altitudeM,
      s.tempCelsius,
      s.humidityPercent / 100,
    );
    const wind: WindConfig = {
      speedMps: s.windSpeedMps,
      headingDeg: s.windHeadingDeg,
      gustFactor: 0,
    };

    const numLines = s.isPremium ? s.numFlightLines : 1;
    const results: TrajectoryEntry[] = [];

    for (let i = 0; i < numLines; i++) {
      const hyzerRad = (varyAngle(s.hyzerAngleDeg, i, numLines) * Math.PI) / 180;
      const launchRad = (s.launchAngleDeg * Math.PI) / 180;
      const noseRad = (s.noseAngleDeg * Math.PI) / 180;

      const simResult: SimulationResult = simulate(
        {
          velocity: s.velocityMps,
          hyzerRad,
          launchAngleRad: launchRad,
          noseAngleRad: noseRad,
          throwHeightM: s.releaseHeightM,
          spinMultiplier: spinMultiplier(s.spinLevel),
          throwType: s.throwType,
          wobble: s.wobble,
        },
        { coeffs, massKg, rho, wind, groundElevationM: s.groundElevationM },
        0, // throw heading: 0 = straight down fairway
      );

      results.push({
        id: `line-${i}`,
        points: simResult.points,
        color: PATH_COLORS[i % PATH_COLORS.length]!,
        isSelected: i === 0,
        landingPoint: simResult.landingPoint,
        totalDistanceM: simResult.totalDistanceM,
        maxHeightM: simResult.maxHeightM,
        lateralDriftM: simResult.lateralDriftM,
        hangTimeS: simResult.hangTimeS,
      });
    }

    set({ trajectories: results, isSimulating: false });
  },

  startAnimation: () => set({ isAnimating: true, animatingIndex: 0 }),
  stopAnimation: () => set({ isAnimating: false }),
}));
