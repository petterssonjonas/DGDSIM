/**
 * Atmospheric model for air density and pressure calculations.
 * Implements barometric formula, vapor pressure (Magnus), and thermodynamic
 * air density calculation for accurate flight simulation across conditions.
 */

import {
  STANDARD_PRESSURE_PA,
  STANDARD_TEMP_K,
  TEMPERATURE_LAPSE_RATE,
  GRAVITY_BAROMETRIC,
  AIR_MOLAR_MASS,
  GAS_CONSTANT_DRY_AIR,
  GAS_CONSTANT_VAPOR,
} from './constants';

/**
 * Calculate saturation vapor pressure at given temperature using Magnus formula.
 * Valid range: 0–100°C
 * Formula: Psat = 611.2 * exp(17.67 * T / (T + 243.5))
 * @param tempKelvin Temperature in Kelvin
 * @returns Saturation vapor pressure in Pascals
 */
export function saturationVaporPressure(tempKelvin: number): number {
  const tempCelsius = tempKelvin - 273.15;
  // Magnus formula (high accuracy for meteorological purposes)
  return 611.2 * Math.exp((17.67 * tempCelsius) / (tempCelsius + 243.5));
}

/**
 * Calculate atmospheric pressure at given altitude using barometric formula.
 * Assumes standard atmosphere with temperature lapse rate in troposphere.
 * Formula: P = P0 * (1 - L*h/T0)^(g*M/(R*L))
 * @param altitudeM Altitude above sea level in meters
 * @returns Pressure in Pascals
 */
export function pressureAtAltitude(altitudeM: number): number {
  const tempRatio = 1 - (TEMPERATURE_LAPSE_RATE * altitudeM) / STANDARD_TEMP_K;
  const exponent = (GRAVITY_BAROMETRIC * AIR_MOLAR_MASS) / (GAS_CONSTANT_DRY_AIR * TEMPERATURE_LAPSE_RATE);
  return STANDARD_PRESSURE_PA * Math.pow(tempRatio, exponent);
}

/**
 * Calculate air density from pressure, temperature, and humidity.
 * Uses ideal gas law for dry and moist air components.
 * Formula: ρ = (Pd/(Rd*T)) + (Pv/(Rv*T))
 * where Pd = partial pressure of dry air, Pv = partial pressure of vapor
 * @param pressurePa Total pressure in Pascals
 * @param tempKelvin Temperature in Kelvin
 * @param relativeHumidity Relative humidity as fraction (0–1)
 * @returns Air density in kg/m³
 */
export function airDensity(
  pressurePa: number,
  tempKelvin: number,
  relativeHumidity: number
): number {
  // Saturation vapor pressure at this temperature
  const Psat = saturationVaporPressure(tempKelvin);

  // Actual vapor pressure (partial pressure of water vapor)
  const Pv = relativeHumidity * Psat;

  // Partial pressure of dry air
  const Pd = pressurePa - Pv;

  // Density components: ρ_dry + ρ_vapor
  const rhoDry = Pd / (GAS_CONSTANT_DRY_AIR * tempKelvin);
  const rhoVapor = Pv / (GAS_CONSTANT_VAPOR * tempKelvin);

  return rhoDry + rhoVapor;
}

/**
 * Convenience function: calculate air density from user-friendly parameters.
 * Converts altitude to pressure using barometric formula if needed.
 * @param altitudeM Altitude above sea level in meters
 * @param tempCelsius Temperature in degrees Celsius
 * @param humidityFraction Relative humidity as fraction (0–1, e.g. 0.7 = 70%)
 * @param pressureHPa Optional pressure override in hectoPascals; if provided, altitude is ignored for pressure
 * @returns Air density in kg/m³
 */
export function airDensityFromConditions(
  altitudeM: number,
  tempCelsius: number,
  humidityFraction: number,
  pressureHPa?: number
): number {
  // Determine pressure from altitude or override
  const pressurePa = pressureHPa != null ? pressureHPa * 100 : pressureAtAltitude(altitudeM);

  // Convert temperature to Kelvin
  const tempKelvin = tempCelsius + 273.15;

  // Clamp humidity to valid range
  const humidity = Math.max(0, Math.min(1, humidityFraction));

  return airDensity(pressurePa, tempKelvin, humidity);
}
