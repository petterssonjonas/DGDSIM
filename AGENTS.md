# Agent Guidelines for Disc Golf Disc Simulator

This document provides instructions and guidelines for AI agents working on the Disc Golf Disc Simulator project.

## Project Overview

- **Stack**: React, Vite, TypeScript, Zustand, React Three Fiber (R3F).
- **Core Domain**: 3D disc golf flight simulation based on aerodynamic models (Hummel 2003, Crowther & Potts 2007).
- **License**: Proprietary (not open-source).
- **Target Platform**: Desktop-first (mobile later), hosted on Cloudflare Pages.
- **Audience**: Domain experts (no need to over-explain flight numbers).

## Architecture Guidelines

### Physics Engine (`src/physics/`)
- All physics code must be pure TypeScript. No React, DOM, or external dependencies.
- Use the RK4 integrator for simulations (`simulation.ts`).
- Coordinate system: X = downrange, Y = lateral right (RHBH), Z = up.
- Spin sign: RHBH/LHFH -> positive spin (clockwise from above) -> turns right at speed, fades left at end.
- Flight numbers to aerodynamics mapping:
  - Turn (negative) -> negative `CM0`
  - Fade (positive) -> negative `CM_alpha`
  - Glide -> `CL0`
  - Speed -> `CD0`
- Tests go in `src/physics/*.test.ts`.

### State Management (`src/store/app-store.ts`)
- Use Zustand for the single global store (`useAppStore`).
- The premium gate (`isPremium`) lives entirely here. Do not scatter hard-coded checks in components.
- Any change to disc, throw, or environment parameters must clear `trajectories: []` in the store.

### 3D Scene (`src/scene/`)
- Use React Three Fiber (R3F) and `@react-three/drei`.
- Keep environment geometry low-poly and stylized (no textures).
- The basket is fixed at `[75, 0, 0]`.
- Flight paths are rendered as tube geometry (`FlightPaths.tsx`).
- Disc throw animation is handled by `AnimatedDisc.tsx` walking along trajectory points.

### Disc Database (`src/data/`)
- Add new discs by appending to the `DISC_DATABASE` array in `src/data/discs.ts`.
- Ensure IDs use kebab-case (e.g., `innova-destroyer`).
- No code changes are required when adding new data entries.

## Coding Standards

- **Imports**: Use the `@/` path alias for the `src/` directory (e.g., `@/physics/types`).
- **Testing**: Write pure unit tests for physics functions using Vitest.
- **Commands**: 
  - `npm run dev` (dev server)
  - `npm run build` (tsc + vite build)
  - `npm run lint` (ESLint)
  - `npm run test` (Vitest)
