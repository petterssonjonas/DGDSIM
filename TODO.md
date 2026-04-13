# DGDSIM — TODO

## Product Features

- [ ] **Disc comparison mode** — simulate two discs side-by-side on the same canvas
- [ ] **Top-down 2D flight map** — SVG overlay showing bird's-eye trajectory (great for lateral drift)
- [ ] **URL sharing** — encode full throw config in URL params; paste link = same throw
- [ ] **Camera presets** — follow-cam, side view, top-down (orbit is fine but limited)
- [ ] **Premium UI** — upgrade prompt + soft paywall screen, even if payment is mocked for now
- [ ] **Course mode** ⛔ BLOCKED — needs custom Blender assets (holes, baskets, terrain); Jonas to build custom courses later
- [x] Sponsor spot - Buy here button for DG stores to sponsor.

## UI / UX

- [x] **UI/UX overhaul** — dark sidebar (zinc-950), emerald accent, collapsible sections
- [x] **Disc search/filter** — pill type filters, flight number visualization, clear button
- [x] **Wobble slider** — already implemented, now properly styled in overhaul

## Code Health (from AUDIT.md 2026-03-26)

### High priority
- [ ] **AnimatedDisc stale closure** — `onComplete` can fire multiple times; `hasCompleted` should be a ref (`AnimatedDisc.tsx:28-51`)
- [ ] **`useMemo` in `App.tsx` + `Scene.tsx`** — trajectory mappings create new objects every render (already done in App.tsx, verify Scene.tsx)
- [ ] **Error boundary around Canvas** — NaN in physics crashes entire R3F canvas with no recovery
- [ ] Simulate flight should simulate the disc and the line should follow after the disc, at a 1m distance lagging behind.

### Medium priority
- [ ] **`Ground.tsx` GPU memory leak** — `PlaneGeometry` never `.dispose()`d on unmount
- [ ] **Deduplicate `FLIGHT_COLORS`** — defined in 3 places; extract to `src/ui/constants.ts`
- [ ] **CSP header** — add Content-Security-Policy in `index.html` or Vite config (security finding)

### Low priority
- [ ] **Physics unit tests** — `src/physics/*.test.ts`; all functions are pure, easy to test
- [ ] **`parseInt` radix** — `SimControls.tsx:29`, `EnvPanel.tsx:43` missing radix 10
- [ ] **`DISC_DATABASE` readonly** — `discs.ts:10` should be `readonly Disc[]`
- [ ] **`TestSceneViewer`** — already lazy-loaded and dev-only gated (done)
