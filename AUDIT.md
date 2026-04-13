# Codebase Audit Report — Disc Golf Flight Simulator

**Date:** 2026-03-26
**Auditors:** React Specialist, TypeScript Pro, Security Auditor (Claude Opus 4.6)

---

## Security Audit — Overall: GOOD

**0 Critical, 0 High, 1 Medium, 3 Low, 3 Informational**

The app is client-side only with no backend, no API calls, no user data persistence, and no user-generated HTML content. Attack surface is minimal.

| # | Severity | Finding |
|---|----------|---------|
| 1 | **Medium** | No Content Security Policy (CSP) in `index.html` or Vite config |
| 2 | Low | `?test` URL param exposes `TestSceneViewer` in production — gate behind `import.meta.env.DEV` |
| 3 | Low | `isPremium` client-side paywall is trivially bypassable via devtools |
| 4 | Low | `document.getElementById('root')!` — no null guard on DOM element |
| 5 | Info+ | External link correctly uses `rel="noopener noreferrer"` |
| 6 | Info+ | All dependencies current, no known CVEs, minimal dependency tree |
| 7 | Info+ | No secrets, API keys, `.env` files, or network calls found anywhere |

---

## React Audit — 15 findings

### High Priority

| # | File | Issue |
|---|------|-------|
| 1 | `AnimatedDisc.tsx:28-51` | **Stale closure** — `hasCompleted` state read inside `useFrame` (60fps) can fire `onComplete` multiple times. Should be a ref. |
| 2 | `App.tsx:25-35` | **New objects every render** — `sceneTrajectories` and `animatingTrajectory` create new array refs each render, breaking `React.memo`. Wrap in `useMemo`. |
| 3 | `Scene.tsx:84-90` | **Unmemoized mapping inside Canvas** — `flightPathData` rebuilt every frame during animation. Needs `useMemo`. |
| 4 | `main.tsx:4` | **`TestSceneViewer` statically imported** — always bundled + fires `useGLTF.preload()` in production. Use `React.lazy`. |

### Medium Priority

| # | File | Issue |
|---|------|-------|
| 5 | All files | **No error boundaries** — a NaN in physics corrupts Three.js matrices and crashes the entire Canvas with no recovery. |
| 6 | 3 files | **`FLIGHT_COLORS` defined 3 times** — `app-store.ts`, `Scene.tsx`, `FlightPaths.tsx`. Store-assigned color is silently overridden. |
| 7 | `Ground.tsx:10-32` | **GPU memory leak** — `PlaneGeometry` created in `useMemo` is never `.dispose()`d on unmount. |
| 8 | `FlightPaths.tsx:51` | **Index as key** — `TrajectoryData` has an `id` field but uses array index as key. |
| 9 | `ThrowPanel.tsx`, `EnvPanel.tsx`, `SimControls.tsx` | **Coarse Zustand subscriptions** — 14 separate `useAppStore` calls in `ThrowPanel` cause full re-render on any single value change. Use `useShallow` or split into sub-components. |

### Low Priority

| # | File | Issue |
|---|------|-------|
| 10 | `App.tsx:19-22` | `eslint-disable-next-line` for `runSimulation` — use `useAppStore.getState().runSimulation()` instead. |
| 11 | `ThrowPanel.tsx`, `EnvPanel.tsx` | Duplicated `Slider` component — extract to `src/ui/Slider.tsx`. |
| 12 | `Basket.tsx:63-81` | Inline trig calculations recreated every frame — pre-compute as module constant. |
| 13 | `SimControls.tsx:29` | `parseInt` without radix. |

---

## TypeScript Audit — 38 findings

### High Priority

| # | File | Issue |
|---|------|-------|
| 1 | `main.tsx:4` | `TestSceneViewer` always bundled (same as React #4). |

### Medium Priority

| # | File | Issue |
|---|------|-------|
| 2 | `eslint.config.js` | No type-aware lint rules — `strictTypeChecked` not used, no `parserOptions.project`. |
| 3 | `simulation.ts:124` | `_wobbleDecayFactor` internal detail leaks into public `SimParams` via ad-hoc intersection. |
| 4 | `simulation.ts:141,195` | `as State` cast suppresses tuple element-count verification — use a helper function. |
| 5 | `simulation.ts:307-311` | Default values in destructuring for **required** `ThrowConfig` fields — misleading, unreachable. |
| 6 | `discs.ts:10` | `DISC_DATABASE: Disc[]` should be `readonly Disc[]` to prevent mutation. |
| 7 | `discs.ts:1175` | `getDiscsByManufacturer` returns mutable reference to internal cache — callers can corrupt it. |
| 8 | `app-store.ts:84-107` | Action param types are repeated inline `Partial<{...}>` — extract named types. |
| 9 | `app-store.ts` (3 locations) | `SpinLevel` union literal `'low' \| 'normal' \| 'high'` written 3 times inline. |
| 10 | `app-store.ts:193` | `isSimulating` flag is functionally dead — sync simulation never renders `true`. |
| 11 | `Scene.tsx:15-22` | `TrajectoryInput` duplicates `TrajectoryEntry` shape — use `Pick`/`Omit`. |
| 12 | Multiple scene files | `{ x: number; y: number; z: number }` inline instead of imported `Vec3` type. |
| 13 | `DiscSelector.tsx:93` | **Unsafe cast** `as DiscType \| 'all'` on `e.target.value` — needs type guard. |
| 14 | `DistanceMarkers.tsx:14` | `result = []` inferred as `never[]` — needs explicit type annotation. |
| 15 | `EnvPanel.tsx:88-92` | `dirs[idx]` can be `undefined` with `noUncheckedIndexedAccess` — add fallback. |

### Low Priority

| # | File | Issue |
|---|------|-------|
| 16 | `tsconfig.node.json` | Missing `noUncheckedIndexedAccess` (inconsistent with app config). |
| 17 | `simulation.ts:343` | `?? 0` on required field `groundElevationM` — dead branch, misleading. |
| 18 | `simulation.ts:369` | `path[0]!` non-null assertion where `?? fallback` is safer. |
| 19 | `coefficients.ts:165` | Unreachable `return coeffs` after exhaustive union branches. |
| 20 | `app-store.ts:43` | `selectedDisc: Disc \| null` despite invariant that it's always set. |
| 21 | `disc-types.ts` | No `isDiscType` runtime guard — forces unsafe casts. |
| 22 | `ResultsPanel.tsx:61` | `sublabel: string` should be `sublabel?: string`. |
| 23 | `SimControls.tsx:28`, `EnvPanel.tsx:43` | `parseInt` without radix `10`. |
| 24 | Various | Inconsistent color format (numeric hex vs string hex). |

---

## Cross-Cutting Themes

1. **`TestSceneViewer` in production** — flagged by all 3 audits. Lazy-load or gate behind `import.meta.env.DEV`.
2. **Triplicated `FLIGHT_COLORS`** — extract to a shared constants file.
3. **Duplicated `Slider` component** — extract to `src/ui/Slider.tsx`.
4. **Missing memoization in R3F render loop** — `App.tsx`, `Scene.tsx` create new objects every frame.
5. **Stale closure in `AnimatedDisc`** — use refs for values read inside `useFrame`.
6. **Mutable data exports** — `DISC_DATABASE` and `getDiscsByManufacturer` expose mutable internals.

---

## Recommended Fix Order

1. **TestSceneViewer** lazy-load (security + bundle + React)
2. **AnimatedDisc** stale closure fix (correctness bug)
3. **useMemo** for `App.tsx` and `Scene.tsx` trajectory mappings (performance)
4. **Error boundary** around Canvas (resilience)
5. **Ground.tsx** geometry disposal (memory leak)
6. **Extract shared constants** (`FLIGHT_COLORS`, `Slider`, `Vec3` reuse)
7. **Type safety** — readonly arrays, type guards, named action types
