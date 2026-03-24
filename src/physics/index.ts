/**
 * Disc golf flight physics engine.
 * Pure TypeScript physics simulation with no React dependencies.
 * All exports are suitable for testing and server-side usage.
 */

// ============================================================================
// Types
// ============================================================================

export type { Vec3 } from './types';
export type { FlightNumbers } from './types';
export type { AeroCoefficients } from './types';
export type { ModifierParams } from './types';
export type { WindConfig } from './types';
export type { ThrowConfig } from './types';
export type { SimParams } from './types';
export type { SimulationResult } from './types';

// ============================================================================
// Constants
// ============================================================================

export {
  DISC_RADIUS_M,
  DISC_DIAMETER_M,
  DISC_AREA,
  GRAVITY_MPS2,
  GAS_CONSTANT_DRY_AIR,
  GAS_CONSTANT_VAPOR,
  TEMPERATURE_LAPSE_RATE,
  STANDARD_TEMP_K,
  STANDARD_PRESSURE_PA,
  SIM_DT_MS,
  SIM_DT_S,
  MAX_SIM_ITERATIONS,
  DEFAULT_DISC_MASS_G,
  DEFAULT_DISC_MASS_KG,
  momentOfInertia,
} from './constants';

// ============================================================================
// Atmosphere
// ============================================================================

export {
  saturationVaporPressure,
  pressureAtAltitude,
  airDensity,
  airDensityFromConditions,
} from './atmosphere';

// ============================================================================
// Coefficients
// ============================================================================

export {
  speedToCD0,
  glideToCL0,
  turnToCM0,
  fadeToCMAlpha,
  massGramsToKg,
  getAeroCoefficients,
  getNeutralCoefficients,
} from './coefficients';

// ============================================================================
// Wind
// ============================================================================

export {
  decomposeWind,
  applyWind,
  applyWindWithGusts,
  relativeWindSpeed,
  noWind,
} from './wind';

// ============================================================================
// Simulation
// ============================================================================

export { simulate } from './simulation';
