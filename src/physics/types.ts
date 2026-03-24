/**
 * Shared physics types and interfaces for disc flight simulation.
 * All types are plain TypeScript with no React dependencies.
 */

/** 3D vector */
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Flight number characteristics (PDGA standard) */
export interface FlightNumbers {
  /** Speed: 1–14 (higher = more parasitic drag) */
  speed: number;
  /** Glide: 1–7 (higher = more lift) */
  glide: number;
  /** Turn: -5 to +1 (negative = understable/high-speed turn) */
  turn: number;
  /** Fade: 0–5 (higher = more stability/low-speed fade) */
  fade: number;
}

/** Aerodynamic coefficients from Hummel/Crowther model */
export interface AeroCoefficients {
  /** Lift coefficient at zero angle of attack */
  CL0: number;
  /** Lift coefficient slope (dCL/dα) */
  CL_alpha: number;
  /** Drag coefficient at zero angle of attack (parasitic drag) */
  CD0: number;
  /** Quadratic drag coefficient (dCD/dα²) */
  CD_alpha: number;
  /** Pitching moment coefficient at zero angle of attack */
  CM0: number;
  /** Pitching moment coefficient slope (dCM/dα) */
  CM_alpha: number;
}

/** Physical modifiers that affect flight behavior */
export interface ModifierParams {
  /** Weight in grams (default 175) */
  weightG: number;
  /** Pronounced dome increases lift but decreases stability */
  pronouncedDome: boolean;
  /** Worn-in reduces drag but affects moment characteristics */
  wornIn: boolean;
}

/** Wind configuration */
export interface WindConfig {
  /** Wind speed, meters per second */
  speedMps: number;
  /** Wind direction in degrees: 0=from north, 90=from east, etc. */
  headingDeg: number;
  /** Gust factor for turbulence (0–1; 0 = steady, 1 = gusting) */
  gustFactor: number;
}

/** Throw configuration */
export interface ThrowConfig {
  /** Initial velocity magnitude, m/s */
  velocity: number;
  /** Hyzer (positive) / anhyzer (negative) angle in radians; 0 = flat */
  hyzerRad: number;
  /** Launch angle above horizontal, radians (e.g. 0.1 = slight nose up) */
  launchAngleRad: number;
  /** Release height above ground, meters (0.5–1.6 typical) */
  throwHeightM: number;
  /** Spin rate multiplier (e.g. 0.5 = less, 1 = normal, 1.5 = more) */
  spinMultiplier: number;
}

/** Simulation parameters combining aerodynamics, mass, and environment */
export interface SimParams {
  /** Aerodynamic coefficients */
  coeffs: AeroCoefficients;
  /** Disc mass in kilograms */
  massKg: number;
  /** Air density in kg/m³ */
  rho: number;
  /** Wind configuration */
  wind: WindConfig;
}

/** Complete flight simulation result */
export interface SimulationResult {
  /** Array of (x, y, z) positions along flight path, meters */
  points: Vec3[];
  /** Total distance traveled downrange, meters */
  totalDistanceM: number;
  /** Maximum height reached, meters */
  maxHeightM: number;
  /** Lateral drift from intended heading, meters (positive = right) */
  lateralDriftM: number;
  /** Total flight time, seconds */
  hangTimeS: number;
  /** Final landing position (x, y, z) */
  landingPoint: Vec3;
}
