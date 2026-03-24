/**
 * Physical constants for disc golf flight simulation.
 * These values are used throughout the physics calculations.
 */

/** Disc radius in meters (~27cm diameter) */
export const DISC_RADIUS_M = 0.135;

/** Disc diameter in meters */
export const DISC_DIAMETER_M = 2 * DISC_RADIUS_M;

/** Disc planform area in square meters (π·r²) */
export const DISC_AREA = Math.PI * DISC_RADIUS_M * DISC_RADIUS_M;

/** Standard gravity, m/s² */
export const GRAVITY_MPS2 = 9.81;

/** Gas constant for dry air, J/(kg·K) */
export const GAS_CONSTANT_DRY_AIR = 287.058;

/** Gas constant for water vapor, J/(kg·K) */
export const GAS_CONSTANT_VAPOR = 461.495;

/** Temperature lapse rate in troposphere, K/m */
export const TEMPERATURE_LAPSE_RATE = 0.0065;

/** Sea-level standard temperature, K (15°C) */
export const STANDARD_TEMP_K = 288.15;

/** Sea-level standard pressure, Pa */
export const STANDARD_PRESSURE_PA = 101325;

/** Standard gravity (used in barometric formula), m/s² */
export const GRAVITY_BAROMETRIC = 9.80665;

/** Air molar mass, kg/mol (for barometric formula) */
export const AIR_MOLAR_MASS = 0.0289644;

/** Simulation timestep, milliseconds */
export const SIM_DT_MS = 5;

/** Simulation timestep, seconds */
export const SIM_DT_S = SIM_DT_MS / 1000;

/** Maximum simulation iterations (5ms * 8000 = 40 seconds) */
export const MAX_SIM_ITERATIONS = 8000;

/** Default disc mass, grams (PDGA regulation minimum) */
export const DEFAULT_DISC_MASS_G = 175;

/** Default disc mass, kilograms */
export const DEFAULT_DISC_MASS_KG = DEFAULT_DISC_MASS_G / 1000;

/**
 * Moment of inertia for disc (flat cylinder rotating about vertical axis).
 * Formula: J = (1/2) * m * r²
 * @param massKg Mass in kilograms
 * @returns Moment of inertia in kg·m²
 */
export function momentOfInertia(massKg: number): number {
  return 0.5 * massKg * DISC_RADIUS_M * DISC_RADIUS_M;
}

/** Velocity threshold below which lift/drag become negligible, m/s */
export const VELOCITY_THRESHOLD = 0.1;

/** Spin decay factor per timestep (empirical) */
export const SPIN_DECAY_FACTOR = 0.9985;

/** Base spin rate, revolutions per second at 1x multiplier */
export const BASE_SPIN_RPS = 80;
