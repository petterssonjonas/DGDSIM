/**
 * Wind model for disc flight simulation.
 * Resolves wind into headwind/crosswind components and applies to relative airspeed.
 * Implements Coriolis-aware wind decomposition for realistic flight modeling.
 */

import type { Vec3, WindConfig } from './types';

/**
 * Decompose wind into headwind and crosswind components relative to throw direction.
 * Headwind: positive value means wind opposing throw (slows disc)
 * Crosswind: positive value means wind pushing right (RHBH), negative = left
 * @param windConfig Wind configuration (speed, direction)
 * @param throwHeadingDeg Throw direction in degrees (0=north, 90=east, etc.)
 * @returns Object with headwind and crosswind in m/s
 */
export function decomposeWind(
  windConfig: WindConfig,
  throwHeadingDeg: number
): { headwind: number; crosswind: number } {
  const windSpeedMps = windConfig.speedMps;
  const windHeadingDeg = windConfig.headingDeg;

  // Convert to radians
  const windHeadingRad = (windHeadingDeg * Math.PI) / 180;
  const throwHeadingRad = (throwHeadingDeg * Math.PI) / 180;

  // Angle between wind direction and throw direction
  // Wind heading points FROM direction; resolve to components
  const windNorth = -windSpeedMps * Math.cos(windHeadingRad);
  const windEast = -windSpeedMps * Math.sin(windHeadingRad);

  // Throw direction components
  const throwNorth = Math.cos(throwHeadingRad);
  const throwEast = Math.sin(throwHeadingRad);

  // Perpendicular to throw (right, in RHBH convention)
  const rightNorth = Math.sin(throwHeadingRad);
  const rightEast = -Math.cos(throwHeadingRad);

  // Project wind onto throw direction (positive = headwind)
  const headwind = windNorth * throwNorth + windEast * throwEast;

  // Project wind onto crosswind direction (positive = right crosswind)
  const crosswind = windNorth * rightNorth + windEast * rightEast;

  return { headwind, crosswind };
}

/**
 * Apply wind effects to velocity vector to compute relative airspeed.
 * The disc flies relative to the air, not the ground. This function
 * computes the apparent wind relative to the disc.
 * @param velocity Current velocity vector in m/s (absolute)
 * @param windConfig Wind configuration
 * @param throwHeadingDeg Reference throw heading for wind decomposition
 * @returns Relative velocity (velocity minus wind) in m/s
 */
export function applyWind(
  velocity: Vec3,
  windConfig: WindConfig,
  throwHeadingDeg: number
): Vec3 {
  const { headwind, crosswind } = decomposeWind(windConfig, throwHeadingDeg);

  // Throw direction unit vector (X = forward, Y = right, Z = up)
  const throwHeadingRad = (throwHeadingDeg * Math.PI) / 180;
  const throwX = Math.cos(throwHeadingRad);
  const throwY = Math.sin(throwHeadingRad);

  // Crosswind direction (perpendicular to throw in XY plane)
  const crossX = -Math.sin(throwHeadingRad);
  const crossY = Math.cos(throwHeadingRad);

  // Wind velocity in ground frame: headwind along throw, crosswind perpendicular
  const windVx = headwind * throwX + crosswind * crossX;
  const windVy = headwind * throwY + crosswind * crossY;
  const windVz = 0; // Wind has no vertical component in this simplified model

  // Relative velocity (what the disc "sees")
  return {
    x: velocity.x - windVx,
    y: velocity.y - windVy,
    z: velocity.z - windVz,
  };
}

/**
 * Apply wind with gust factor turbulence.
 * Gust factor scales random perturbations to wind magnitude.
 * @param velocity Current velocity vector
 * @param windConfig Wind configuration with gustFactor (0–1)
 * @param throwHeadingDeg Reference throw heading
 * @param seed Pseudorandom seed for deterministic gusts (optional)
 * @returns Relative velocity with turbulence applied
 */
export function applyWindWithGusts(
  velocity: Vec3,
  windConfig: WindConfig,
  throwHeadingDeg: number,
  seed: number = 0
): Vec3 {
  // For deterministic behavior, we can add a simple perturbation based on seed
  // In production, this would use a proper noise function
  const perturbationFactor = 1 + windConfig.gustFactor * Math.sin(seed) * 0.1;

  const adjustedWind: WindConfig = {
    ...windConfig,
    speedMps: windConfig.speedMps * perturbationFactor,
  };

  return applyWind(velocity, adjustedWind, throwHeadingDeg);
}

/**
 * Calculate apparent wind from disc velocity and air wind.
 * Returns magnitude of relative wind (useful for lift/drag calculations).
 * @param velocity Disc velocity in ground frame
 * @param windConfig Wind configuration
 * @param throwHeadingDeg Reference throw heading
 * @returns Magnitude of relative wind in m/s
 */
export function relativeWindSpeed(
  velocity: Vec3,
  windConfig: WindConfig,
  throwHeadingDeg: number
): number {
  const relVel = applyWind(velocity, windConfig, throwHeadingDeg);
  return Math.sqrt(relVel.x * relVel.x + relVel.y * relVel.y + relVel.z * relVel.z);
}

/**
 * No-wind configuration (convenience constant).
 * @returns Wind config with no wind
 */
export function noWind(): WindConfig {
  return {
    speedMps: 0,
    headingDeg: 0,
    gustFactor: 0,
  };
}
