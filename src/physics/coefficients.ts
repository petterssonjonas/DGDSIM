/**
 * Flight numbers to aerodynamic coefficients mapping.
 * Implements Hummel/Crowther-style model with flight numbers (Speed, Glide, Turn, Fade)
 * mapping to aerodynamic force and moment coefficients.
 * Physical basis: disc behaves as small airfoil with gyroscopic effects.
 */

import type { FlightNumbers, AeroCoefficients, ModifierParams } from './types';

// ============================================================================
// Base coefficient values (from literature / empirical fitting)
// ============================================================================

/** Neutral disc lift at zero angle of attack (typical value) */
const NEUTRAL_CL0 = 0.35;

/** Lift curve slope for disc-like wings (typical value) */
const NEUTRAL_CL_ALPHA = 1.2;

/** Neutral parasitic drag coefficient (baseline) */
const NEUTRAL_CD0 = 0.08;

/** Quadratic drag coefficient (induced + form drag) */
const NEUTRAL_CD_ALPHA = 0.8;

/** Neutral pitching moment slope (stability) */
const NEUTRAL_CM_ALPHA = -0.15;

// ============================================================================
// Modifier scaling factors
// ============================================================================

/** Pronounced dome increases lift (more volume = more area at angle) */
const DOME_CL_SCALE = 1.12;

/** Pronounced dome affects pitching moment */
const DOME_CM_SCALE = 1.25;

/** Worn-in discs have rounded edges, less drag */
const WORN_CD_SCALE = 0.92;

/** Worn-in discs shift moment characteristic slightly understable */
const WORN_CM_SHIFT = -0.015;

// ============================================================================
// Flight number to coefficient mappers
// ============================================================================

/**
 * Map Speed (1–14) to baseline parasitic drag CD0.
 * Higher speed numbers indicate discs with more area or higher design speed,
 * which translates to more drag at flight speeds.
 * Range: ~0.08 (speed 1, putters) to ~0.12 (speed 14, ultra-distance)
 * @param speed Speed rating 1–14
 * @returns CD0 value
 */
export function speedToCD0(speed: number): number {
  const t = (speed - 1) / 13; // Normalize to 0–1
  return NEUTRAL_CD0 + t * 0.04; // Linear interpolation: 0.08 to 0.12
}

/**
 * Map Glide (1–7) to baseline lift CL0.
 * Higher glide means more lift-generating capability at zero angle of attack.
 * This is partly a function of disc profile (camber, thickness).
 * Range: ~0.35 (glide 1, flippy) to ~0.55 (glide 7, floaty)
 * @param glide Glide rating 1–7
 * @returns CL0 value
 */
export function glideToCL0(glide: number): number {
  const t = (glide - 1) / 6; // Normalize to 0–1
  return NEUTRAL_CL0 + t * 0.2; // Linear interpolation: 0.35 to 0.55
}

/**
 * Map Turn (-5 to +1) to baseline pitching moment CM0.
 * Negative turn = understable = negative CM0 (disc rolls right in RHBH at high speed).
 * Positive turn = overstable = positive CM0 (resists rolling).
 * Range: ~-0.04 (turn -5, very understable) to 0 (turn +1, neutral)
 * @param turn Turn rating -5 to +1
 * @returns CM0 value
 */
export function turnToCM0(turn: number): number {
  const t = (turn + 5) / 6; // Normalize turn -5..+1 to 0..1
  return -0.04 + t * 0.04; // Linear interpolation: -0.04 to 0
}

/**
 * Map Fade (0–5) to pitching moment slope CM_alpha.
 * Higher fade means stronger pitch-down as spin decays (more stable in pitch).
 * This is encoded as more negative CM_alpha.
 * Range: ~-0.15 (fade 0, minimal pitch-down) to ~-0.23 (fade 5, strong pitch-down)
 * @param fade Fade rating 0–5
 * @returns CM_alpha value
 */
export function fadeToCMAlpha(fade: number): number {
  const t = fade / 5; // Normalize to 0–1
  return NEUTRAL_CM_ALPHA - t * 0.08; // More negative with fade
}

// ============================================================================
// Modifier application
// ============================================================================

/**
 * Convert disc mass (grams) to kilograms.
 * @param weightG Weight in grams
 * @returns Weight in kilograms
 */
export function massGramsToKg(weightG: number): number {
  return weightG / 1000;
}

/**
 * Apply dome modifier to coefficients.
 * Pronounced dome increases effective lifting surface and affects stability.
 * @param coeffs Coefficients to modify
 * @param modifiers Modifier parameters
 * @returns Modified coefficients
 */
function applyDomeModifier(coeffs: AeroCoefficients, modifiers: ModifierParams): AeroCoefficients {
  if (!modifiers.pronouncedDome) {
    return coeffs;
  }
  return {
    ...coeffs,
    CL0: coeffs.CL0 * DOME_CL_SCALE,
    CM0: coeffs.CM0 * DOME_CM_SCALE, // Makes disc more understable
  };
}

/**
 * Apply worn-in modifier to coefficients.
 * Worn discs have rounded edges, reducing drag but slightly shifting aerodynamic center.
 * @param coeffs Coefficients to modify
 * @param modifiers Modifier parameters
 * @returns Modified coefficients
 */
function applyWornModifier(coeffs: AeroCoefficients, modifiers: ModifierParams): AeroCoefficients {
  if (!modifiers.wornIn) {
    return coeffs;
  }
  return {
    ...coeffs,
    CD0: coeffs.CD0 * WORN_CD_SCALE, // Rounded edges = less drag
    CM0: coeffs.CM0 + WORN_CM_SHIFT, // Slightly more understable
  };
}

// ============================================================================
// Main interface
// ============================================================================

/**
 * Calculate aerodynamic coefficients from flight numbers and modifiers.
 * Implements Hummel/Crowther-style mapping with physical basis in disc aerodynamics.
 * @param flight Flight numbers (Speed, Glide, Turn, Fade)
 * @param modifiers Physical modifiers (dome, worn, mass)
 * @returns Aerodynamic coefficients for use in simulation
 */
export function getAeroCoefficients(
  flight: FlightNumbers,
  modifiers: ModifierParams
): AeroCoefficients {
  // Start with flight number mappings
  let coeffs: AeroCoefficients = {
    CL0: glideToCL0(flight.glide),
    CL_alpha: NEUTRAL_CL_ALPHA, // Constant across all discs
    CD0: speedToCD0(flight.speed),
    CD_alpha: NEUTRAL_CD_ALPHA, // Constant across all discs
    CM0: turnToCM0(flight.turn),
    CM_alpha: fadeToCMAlpha(flight.fade),
  };

  // Apply modifiers in sequence
  coeffs = applyDomeModifier(coeffs, modifiers);
  coeffs = applyWornModifier(coeffs, modifiers);

  return coeffs;
}

/**
 * Get baseline coefficients for a "neutral" disc (5/5/0/0).
 * Useful for testing and understanding the model.
 * @returns Baseline aerodynamic coefficients
 */
export function getNeutralCoefficients(): AeroCoefficients {
  return {
    CL0: NEUTRAL_CL0,
    CL_alpha: NEUTRAL_CL_ALPHA,
    CD0: NEUTRAL_CD0,
    CD_alpha: NEUTRAL_CD_ALPHA,
    CM0: 0, // Turn 0 would be -0.02, but for true neutral use 0
    CM_alpha: NEUTRAL_CM_ALPHA,
  };
}
