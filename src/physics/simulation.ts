/**
 * Core flight simulation engine for disc golf.
 * Implements RK4 numerical integration with 11-element state vector:
 * [x, y, z, vx, vy, vz, roll, pitch, spin, rollRate, pitchRate]
 *
 * Coordinate system:
 * X = downrange (direction of throw)
 * Y = lateral right (RHBH convention)
 * Z = vertical (up)
 *
 * State includes:
 * - Position: x, y, z (meters)
 * - Velocity: vx, vy, vz (m/s)
 * - Attitude: roll, pitch (radians, relative to horizontal)
 * - Rotation: spin (rad/s), rollRate, pitchRate (rad/s)
 */

import type { Vec3, ThrowConfig, SimParams, SimulationResult } from './types';
import { applyWind } from './wind';
import {
  DISC_DIAMETER_M,
  DISC_AREA,
  GRAVITY_MPS2,
  SIM_DT_S,
  MAX_SIM_ITERATIONS,
  VELOCITY_THRESHOLD,
  SPIN_DECAY_FACTOR,
  BASE_SPIN_RPS,
  momentOfInertia,
} from './constants';

/** State vector: [x, y, z, vx, vy, vz, roll, pitch, spin, rollRate, pitchRate] */
type State = readonly [
  number, number, number,
  number, number, number,
  number, number, number,
  number, number
];

/**
 * Compute Euclidean norm of a 3D vector.
 * @param v Vector
 * @returns Magnitude
 */
function norm(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Angle of attack: angle between velocity vector and disc plane normal.
 * Positive alpha means velocity pointing above the disc (nose up).
 * @param velocity Velocity vector
 * @param roll Disc roll angle (radians)
 * @param pitch Disc pitch angle (radians)
 * @returns Angle of attack in radians
 */
function angleOfAttack(velocity: Vec3, roll: number, pitch: number): number {
  const v = norm(velocity);
  if (v < VELOCITY_THRESHOLD) return 0;

  // Disc normal (pointing up from disc surface)
  const nx = Math.sin(pitch);
  const ny = -Math.sin(roll) * Math.cos(pitch);
  const nz = Math.cos(roll) * Math.cos(pitch);

  // Component of velocity along disc normal
  const vn = velocity.x * nx + velocity.y * ny + velocity.z * nz;

  // Angle between velocity and normal
  return -Math.asin(Math.max(-1, Math.min(1, vn / v)));
}

/**
 * Compute lift direction perpendicular to velocity in plane of velocity and disc normal.
 * This is the direction of the lift force.
 * @param velocity Velocity vector
 * @param roll Disc roll angle
 * @param pitch Disc pitch angle
 * @returns Unit vector in lift direction
 */
function liftDirection(velocity: Vec3, roll: number, pitch: number): Vec3 {
  const v = norm(velocity);
  if (v < 1e-6) return { x: 0, y: 0, z: 1 };

  // Disc normal
  const nx = Math.sin(pitch);
  const ny = -Math.sin(roll) * Math.cos(pitch);
  const nz = Math.cos(roll) * Math.cos(pitch);

  // Component of normal along velocity
  const vn = velocity.x * nx + velocity.y * ny + velocity.z * nz;

  // Component of normal perpendicular to velocity (lift direction before normalization)
  const lx = nx - (vn / (v * v)) * velocity.x;
  const ly = ny - (vn / (v * v)) * velocity.y;
  const lz = nz - (vn / (v * v)) * velocity.z;

  // Normalize
  const L = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1;
  return { x: lx / L, y: ly / L, z: lz / L };
}

/**
 * Compute state derivatives (velocities and accelerations).
 * Implements aerodynamic forces (lift, drag), gravity, and gyroscopic effects.
 * @param state Current state vector
 * @param params Simulation parameters including coefficients, mass, air density, wind
 * @param throwHeadingDeg Reference heading for wind calculation
 * @returns State derivatives
 */
function derivative(
  state: State,
  params: SimParams,
  throwHeadingDeg: number
): State {
  const [, , , vx, vy, vz, roll, pitch, spin, rollRate, pitchRate] = state;

  // Current velocity in ground frame
  const groundVel: Vec3 = { x: vx, y: vy, z: vz };

  // Apply wind to get relative airspeed
  const relativeVel = applyWind(groundVel, params.wind, throwHeadingDeg);
  const v = norm(relativeVel);

  // If disc is nearly stationary, minimal aerodynamic forces
  if (v < VELOCITY_THRESHOLD) {
    return [
      vx, vy, vz,
      0, -GRAVITY_MPS2, 0,
      rollRate, pitchRate,
      spin * SPIN_DECAY_FACTOR,
      0, 0,
    ] as State;
  }

  // Aerodynamic calculations
  const alpha = angleOfAttack(relativeVel, roll, pitch);
  const { CL0, CL_alpha, CD0, CD_alpha, CM0, CM_alpha } = params.coeffs;

  // Dynamic pressure: q = 0.5 * ρ * v²
  const q = 0.5 * params.rho * v * v;

  // Lift and drag coefficients
  const CL = CL0 + CL_alpha * alpha;
  const CD = CD0 + CD_alpha * alpha * alpha;
  const CM = CM0 + CM_alpha * alpha;

  // Lift force (perpendicular to velocity in aerodynamic frame)
  const liftVec = liftDirection(relativeVel, roll, pitch);
  const L = q * CL * DISC_AREA;

  // Drag force (opposing relative velocity)
  const D = q * CD * DISC_AREA;
  const dragDir = v > 1e-6 ? { x: relativeVel.x / v, y: relativeVel.y / v, z: relativeVel.z / v } : { x: 0, y: 0, z: 0 };

  // Net aerodynamic forces
  const fx = (L * liftVec.x - D * dragDir.x) / params.massKg;
  const fy = (L * liftVec.y - D * dragDir.y) / params.massKg;
  const fz = (L * liftVec.z - D * dragDir.z) / params.massKg;

  // Gravity
  const ax = fx;
  const ay = fy;
  const az = fz - GRAVITY_MPS2;

  // Pitching moment (about lateral axis)
  const M = q * DISC_DIAMETER_M * CM * DISC_AREA;

  // Gyroscopic effects: moment causes changes in roll and pitch rates
  const J = momentOfInertia(params.massKg);
  const spinMag = Math.max(spin, 1); // Avoid division by zero
  const gyroPrec = M / (J * spinMag);

  // Spin decay: proportional to current spin
  const spinDelta = -spin * (1 - SPIN_DECAY_FACTOR);

  // Roll and pitch rate changes due to gyroscopic precession
  const rollRateAccel = gyroPrec * Math.cos(pitch);
  const pitchRateAccel = -gyroPrec * Math.sin(pitch);

  return [
    vx, vy, vz,
    ax, ay, az,
    rollRate, pitchRate,
    spinDelta,
    rollRateAccel,
    pitchRateAccel,
  ] as State;
}

/**
 * Single RK4 integration step.
 * Runge-Kutta 4th order method for numerical integration of ODEs.
 * @param state Current state
 * @param params Simulation parameters
 * @param dt Timestep in seconds
 * @param throwHeadingDeg Reference heading for wind
 * @returns Next state
 */
function rk4Step(
  state: State,
  params: SimParams,
  dt: number,
  throwHeadingDeg: number
): State {
  const k1 = derivative(state, params, throwHeadingDeg);

  // s2 = state + 0.5 * dt * k1
  const s2: State = [
    state[0] + 0.5 * dt * k1[0],
    state[1] + 0.5 * dt * k1[1],
    state[2] + 0.5 * dt * k1[2],
    state[3] + 0.5 * dt * k1[3],
    state[4] + 0.5 * dt * k1[4],
    state[5] + 0.5 * dt * k1[5],
    state[6] + 0.5 * dt * k1[6],
    state[7] + 0.5 * dt * k1[7],
    state[8] + 0.5 * dt * k1[8],
    state[9] + 0.5 * dt * k1[9],
    state[10] + 0.5 * dt * k1[10],
  ];
  const k2 = derivative(s2, params, throwHeadingDeg);

  // s3 = state + 0.5 * dt * k2
  const s3: State = [
    state[0] + 0.5 * dt * k2[0],
    state[1] + 0.5 * dt * k2[1],
    state[2] + 0.5 * dt * k2[2],
    state[3] + 0.5 * dt * k2[3],
    state[4] + 0.5 * dt * k2[4],
    state[5] + 0.5 * dt * k2[5],
    state[6] + 0.5 * dt * k2[6],
    state[7] + 0.5 * dt * k2[7],
    state[8] + 0.5 * dt * k2[8],
    state[9] + 0.5 * dt * k2[9],
    state[10] + 0.5 * dt * k2[10],
  ];
  const k3 = derivative(s3, params, throwHeadingDeg);

  // s4 = state + dt * k3
  const s4: State = [
    state[0] + dt * k3[0],
    state[1] + dt * k3[1],
    state[2] + dt * k3[2],
    state[3] + dt * k3[3],
    state[4] + dt * k3[4],
    state[5] + dt * k3[5],
    state[6] + dt * k3[6],
    state[7] + dt * k3[7],
    state[8] + dt * k3[8],
    state[9] + dt * k3[9],
    state[10] + dt * k3[10],
  ];
  const k4 = derivative(s4, params, throwHeadingDeg);

  // Combine weighted derivatives
  const next: State = [
    state[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    state[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    state[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
    state[3] + (dt / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]),
    state[4] + (dt / 6) * (k1[4] + 2 * k2[4] + 2 * k3[4] + k4[4]),
    state[5] + (dt / 6) * (k1[5] + 2 * k2[5] + 2 * k3[5] + k4[5]),
    state[6] + (dt / 6) * (k1[6] + 2 * k2[6] + 2 * k3[6] + k4[6]),
    state[7] + (dt / 6) * (k1[7] + 2 * k2[7] + 2 * k3[7] + k4[7]),
    state[8] + (dt / 6) * (k1[8] + 2 * k2[8] + 2 * k3[8] + k4[8]),
    state[9] + (dt / 6) * (k1[9] + 2 * k2[9] + 2 * k3[9] + k4[9]),
    state[10] + (dt / 6) * (k1[10] + 2 * k2[10] + 2 * k3[10] + k4[10]),
  ];

  return next;
}

/**
 * Run flight simulation from throw to landing.
 * Integrates disc flight path with RK4, stopping when disc lands (z <= 0).
 * Wind effects are applied throughout flight.
 *
 * @param config Throw configuration (velocity, angles, release height, spin)
 * @param params Simulation parameters (aero coeffs, mass, air density, wind)
 * @param throwHeadingDeg Throw direction for wind decomposition (default 0 = straight north)
 * @returns Complete flight simulation result with path, distance, hang time, etc.
 */
export function simulate(
  config: ThrowConfig,
  params: SimParams,
  throwHeadingDeg: number = 0
): SimulationResult {
  const { velocity: v0, hyzerRad, launchAngleRad, throwHeightM, spinMultiplier } = config;

  // Initial state setup
  // Hyzer is roll (positive = right edge up for RHBH)
  // Launch angle is pitch (positive = nose up)
  const roll0 = hyzerRad;
  const pitch0 = -launchAngleRad;

  // Initial velocity components (in throw direction frame)
  const vx0 = v0 * Math.cos(launchAngleRad);
  const vy0 = 0;
  const vz0 = v0 * Math.sin(launchAngleRad);

  // Initial spin rate (revolutions per second -> rad/s)
  // 1 revolution = 2π radians
  const spin0 = BASE_SPIN_RPS * spinMultiplier * 2 * Math.PI;

  const initialState: State = [
    0, 0, throwHeightM,
    vx0, vy0, vz0,
    roll0, pitch0, spin0,
    0, 0,
  ];

  // Collect flight path
  const path: Vec3[] = [{ x: 0, y: 0, z: throwHeightM }];
  let state = initialState;
  let time = 0;

  // Integrate until landing or max iterations
  for (let i = 0; i < MAX_SIM_ITERATIONS; i++) {
    state = rk4Step(state, params, SIM_DT_S, throwHeadingDeg);
    time += SIM_DT_S;

    path.push({ x: state[0], y: state[1], z: state[2] });

    // Stop if disc lands
    if (state[2] <= 0) {
      break;
    }
  }

  // Compute summary statistics
  let maxHeight = path[0]!.z;

  for (const point of path) {
    maxHeight = Math.max(maxHeight, point.z);
  }

  const landingPoint = path[path.length - 1] ?? { x: 0, y: 0, z: 0 };
  const totalDistance = Math.sqrt(landingPoint.x * landingPoint.x + landingPoint.y * landingPoint.y);
  const lateralDrift = landingPoint.y; // Y component is lateral drift
  const hangTime = time;

  return {
    points: path,
    totalDistanceM: totalDistance,
    maxHeightM: maxHeight,
    lateralDriftM: lateralDrift,
    hangTimeS: hangTime,
    landingPoint,
  };
}
