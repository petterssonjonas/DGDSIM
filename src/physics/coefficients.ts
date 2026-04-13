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

const NEUTRAL_CL0 = 0.35;
const NEUTRAL_CL_ALPHA = 1.2;
const NEUTRAL_CD0 = 0.08;
const NEUTRAL_CD_ALPHA = 0.4; // Reduce induced drag somewhat
const NEUTRAL_CM_ALPHA = 0.15; // Positive! Frisbees are statically unstable in pitch.

// ============================================================================
// Modifier scaling factors
// ============================================================================

const DOME_CL_SCALE = 1.12;
const DOME_CM_SCALE = 1.25;
const WORN_CD_SCALE = 0.92;
const WORN_CM_SHIFT = -0.015;

const TPE_CM_SHIFT = -0.008;
const TPE_CD_SCALE = 1.03;
const TPU_CM_SHIFT = 0.005;
const TPU_CD_SCALE = 0.98;

// ============================================================================
// Flight number to coefficient mappers
// ============================================================================

/**
 * Map Speed (1–14) to baseline parasitic drag CD0.
 * Higher speed numbers indicate discs with sharper rims, meaning LESS drag.
 * Range: ~0.15 (speed 1, putters) to ~0.06 (speed 14, ultra-distance)
 */
export function speedToCD0(speed: number): number {
  const t = (speed - 1) / 13;
  return 0.15 - t * 0.09;
}

/**
 * Map Glide (1–7) to baseline lift CL0, considering Speed.
 * Base lift: putter (speed 1) -> 0.45. Driver (speed 14) -> 0.25.
 * Glide acts as a modifier on this base. Say glide 4 is baseline.
 */
export function glideToCL0(glide: number, speed: number): number {
  const speedT = (speed - 1) / 13;
  const baseLift = 0.30 - speedT * 0.15; // Putter ~0.30, Driver ~0.15
  const glideDelta = (glide - 4) * 0.03;
  return baseLift + glideDelta;
}

/**
 * Map Turn (-5 to +1) to baseline pitching moment CM0.
 * Negative turn = understable = negative CM0 (disc pitches down, causing precession turn).
 */
export function turnToCM0(turn: number): number {
  const t = (turn + 5) / 6; // Normalize turn -5..+1 to 0..1
  return -0.02 + t * 0.03; // -5 -> -0.05, 0 -> 0.01, +1 -> 0.01
}

/**
 * Map Fade (0–5) to pitching moment slope CM_alpha.
 * Frisbees have a POSITIVE CM_alpha (center of pressure forward of CG).
 * Higher fade means stronger pitch-up moment as speed drops (positive alpha), causing strong fade (left roll).
 */
export function fadeToCMAlpha(fade: number): number {
  const t = fade / 5; // Normalize to 0–1
  return 0.10 + t * 0.25; // 0 -> 0.05, 5 -> 0.25
}

// ============================================================================
// Modifier application
// ============================================================================

export function massGramsToKg(weightG: number): number {
  return weightG / 1000;
}

function applyDomeModifier(coeffs: AeroCoefficients, modifiers: ModifierParams): AeroCoefficients {
  if (!modifiers.pronouncedDome) return coeffs;
  return {
    ...coeffs,
    CL0: coeffs.CL0 * DOME_CL_SCALE,
    CM0: coeffs.CM0 * DOME_CM_SCALE,
  };
}

function applyWornModifier(coeffs: AeroCoefficients, modifiers: ModifierParams): AeroCoefficients {
  if (!modifiers.wornIn) return coeffs;
  return {
    ...coeffs,
    CD0: coeffs.CD0 * WORN_CD_SCALE,
    CM0: coeffs.CM0 + WORN_CM_SHIFT,
  };
}

function applyPlasticModifier(coeffs: AeroCoefficients, modifiers: ModifierParams): AeroCoefficients {
  if (modifiers.plasticType === 'TPE') {
    return {
      ...coeffs,
      CM0: coeffs.CM0 + TPE_CM_SHIFT,
      CD0: coeffs.CD0 * TPE_CD_SCALE,
    };
  }
  if (modifiers.plasticType === 'TPU') {
    return {
      ...coeffs,
      CM0: coeffs.CM0 + TPU_CM_SHIFT,
      CD0: coeffs.CD0 * TPU_CD_SCALE,
    };
  }
  return coeffs;
}

// ============================================================================
// Main interface
// ============================================================================

export function getAeroCoefficients(
  flight: FlightNumbers,
  modifiers: ModifierParams
): AeroCoefficients {
  let coeffs: AeroCoefficients = {
    CL0: glideToCL0(flight.glide, flight.speed),
    CL_alpha: NEUTRAL_CL_ALPHA,
    CD0: speedToCD0(flight.speed),
    CD_alpha: NEUTRAL_CD_ALPHA,
    CM0: turnToCM0(flight.turn),
    CM_alpha: fadeToCMAlpha(flight.fade),
  };

  coeffs = applyDomeModifier(coeffs, modifiers);
  coeffs = applyWornModifier(coeffs, modifiers);
  coeffs = applyPlasticModifier(coeffs, modifiers);

  return coeffs;
}

export function getNeutralCoefficients(): AeroCoefficients {
  return {
    CL0: NEUTRAL_CL0,
    CL_alpha: NEUTRAL_CL_ALPHA,
    CD0: NEUTRAL_CD0,
    CD_alpha: NEUTRAL_CD_ALPHA,
    CM0: 0,
    CM_alpha: NEUTRAL_CM_ALPHA,
  };
}
