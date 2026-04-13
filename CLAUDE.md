# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server (HMR)
npm run build        # tsc + vite build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

No test files exist yet. Physics engine tests go in `src/physics/` as `*.test.ts`. All physics functions are pure — test them with plain inputs/outputs, no DOM or React setup required.

## Path Aliases

`@/` maps to `src/`. Use `@/physics/types`, `@/store/app-store`, etc. throughout.

## Architecture

### Data Flow

1. User changes disc/throw/env in sidebar UI components
2. UI calls `useAppStore` actions (`setThrow`, `setEnvironment`, etc.)
3. Any param change clears `trajectories: []` in the store
4. User hits Simulate → `runSimulation()` in `app-store.ts`:
   - Pulls flight numbers from disc → `getAeroCoefficients()` → `AeroCoefficients`
   - Computes air density from altitude/temp/humidity → `airDensityFromConditions()`
   - Calls `simulate()` once per flight line (free: 1, premium: up to 10)
   - Multi-line spread: hyzer angle is varied ±4° across lines
5. `trajectories: TrajectoryEntry[]` written to store
6. `Scene` reads trajectories from props (passed from `App.tsx`), renders via `FlightPaths`

### Physics Engine (`src/physics/`)

Pure TypeScript, zero React dependencies. Key files:

- **`types.ts`** — all shared interfaces (`Vec3`, `ThrowConfig`, `SimParams`, `AeroCoefficients`, etc.)
- **`simulation.ts`** — RK4 integrator with 11-element state vector `[x,y,z, vx,vy,vz, roll,pitch, spin, rollRate,pitchRate]`
- **`coefficients.ts`** — maps flight numbers (Speed/Glide/Turn/Fade) → `AeroCoefficients`
- **`atmosphere.ts`** — full thermodynamic air density model (altitude + temp + humidity)
- **`wind.ts`** — decomposes wind vector into relative airspeed effect
- **`constants.ts`** — disc geometry, gravity, sim timestep, spin constants

Coordinate system: X = downrange, Y = lateral right (RHBH), Z = up.

Spin sign determines turn/fade direction: RHBH/LHFH → positive spin (clockwise from above) → turns right at speed, fades left at end.

Flight numbers → aero mapping:
- Turn (negative) → negative `CM0` → high-speed right turn (RHBH)
- Fade (positive) → negative `CM_alpha` → low-speed left fade (RHBH)
- Glide → `CL0` (lift)
- Speed → `CD0` (drag)

### State Management (`src/store/app-store.ts`)

Single Zustand store (`useAppStore`) holds everything: disc selection, throw config, disc modifiers, environment, simulation results, animation state, and premium gate.

Premium is a soft gate — `isPremium: false` by default, `maxFlightLines: 1`. Flip `isPremium` to unlock up to 10 flight lines. No hard-coded checks scattered in components.

### 3D Scene (`src/scene/`)

React Three Fiber (R3F) with `@react-three/drei`. `Scene.tsx` is the R3F `<Canvas>` wrapper. Scene controls (lighting, shadows) are live-tunable via Leva debug panel.

Flight paths rendered as tube geometry in `FlightPaths.tsx`. Disc throw animation handled by `AnimatedDisc.tsx` — walks along trajectory points over time.

Environment components (`Ground`, `TeePad`, `Basket`, `Trees`, `DistanceMarkers`, `Sky`) are all low-poly stylized geometry — no textures. Basket is fixed at `[75, 0, 0]` (75m from tee pad).

### Disc Database (`src/data/`)

- **`disc-types.ts`** — `Disc` interface (id, name, manufacturer, type, speed/glide/turn/fade, pdgaCertified)
- **`discs.ts`** — `DISC_DATABASE` array + `getDiscById()`. Adding a disc = adding a data entry, no code changes needed.

Disc IDs are kebab-case: `"innova-destroyer"`. Default disc on load: `innova-destroyer`.

## Key Decisions (from PLAN.md)

- Proprietary license — not GPL; no open-source obligations
- Freemium: 1 free flight line, up to 10 premium; premium gate lives entirely in `app-store.ts`
- Desktop-first; mobile is future work
- Physics based on Hummel (2003) + Crowther & Potts (2007) disc aerodynamics model
- Target hosting: Cloudflare Pages
- Owner (Jonas) knows disc golf deeply — don't over-explain flight numbers
