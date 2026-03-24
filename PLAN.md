# DGDSIM Engineering Plan

> **Project**: Disc Golf Disc Simulator (DGDSIM)
> **Owner**: Jonas Pettersson (jpettersson@gmail.com)
> **Repo**: github.com/petterssonjonas/DGDSIM (private)
> **Hosting**: Cloudflare Pages (domain TBD)
> **Last Updated**: 2026-03-25

---

## 1. Project Vision

A web-based disc golf disc flight simulator. NOT a game — a visualization/simulation tool.
Users select a real disc (by name, from PDGA-certified list), configure environmental conditions
(wind, altitude, temperature, humidity), set throw parameters (velocity, hyzer angle, launch angle,
spin), and see realistic 3D flight paths rendered in a low-poly stylized 3D course.

**Core differentiator**: Real disc data, real physics, beautiful low-poly visualization.
Multiple flight lines per simulation showing expected trajectory spread.

**Revenue model**: Freemium + ads on free tier. Premium unlocks additional simulation lines,
advanced features, and removes ads. Future B2B: embeddable 3D flight path widgets for disc
manufacturer product pages (major revenue opportunity).

---

## 2. Architecture Overview

```
DGDSIM/
├── public/                    # Static assets, favicon, disc images
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Root layout
│   ├── physics/              # Pure simulation engine (no React deps)
│   │   ├── simulation.ts     # RK4 integrator, state vector, flight sim
│   │   ├── coefficients.ts   # Flight numbers → aero coefficients mapping
│   │   ├── atmosphere.ts     # Air density, pressure, humidity modeling
│   │   ├── wind.ts           # Wind model (constant + gust + crosswind)
│   │   ├── modifiers.ts      # Disc modifiers (weight, dome, wear)
│   │   └── types.ts          # Shared physics types
│   ├── data/
│   │   ├── discs.ts          # Disc database (name, manufacturer, flight numbers)
│   │   └── disc-types.ts     # Type definitions for disc data
│   ├── scene/                # Three.js 3D components (R3F)
│   │   ├── Scene.tsx         # Canvas, camera, lighting, sky
│   │   ├── FlightPaths.tsx   # 3D flight path line rendering
│   │   ├── AnimatedDisc.tsx  # Disc model with throw animation
│   │   ├── Thrower.tsx       # Player figure at tee pad
│   │   └── environment/
│   │       ├── Ground.tsx    # Terrain mesh (low-poly grass)
│   │       ├── TeePad.tsx    # Tee pad geometry
│   │       ├── Basket.tsx    # Disc golf basket model
│   │       ├── Trees.tsx     # Low-poly tree placement
│   │       ├── DistanceMarkers.tsx  # Distance flags/markers
│   │       └── Fairway.tsx   # Fairway texture/coloring
│   ├── ui/                   # React UI components
│   │   ├── DiscSelector.tsx  # Disc search + selection panel
│   │   ├── ThrowPanel.tsx    # Velocity, hyzer, launch angle, spin
│   │   ├── EnvPanel.tsx      # Wind, altitude, temp, humidity
│   │   ├── ResultsPanel.tsx  # Distance, max height, flight stats
│   │   ├── SceneControls.tsx # Camera presets, animation controls
│   │   └── PremiumGate.tsx   # Premium feature wrapper component
│   ├── store/                # Zustand state management
│   │   ├── disc-store.ts     # Disc selection state
│   │   ├── throw-store.ts    # Throw configuration state
│   │   ├── env-store.ts      # Environment state
│   │   ├── sim-store.ts      # Simulation results state
│   │   └── user-store.ts     # User/premium state (future)
│   └── utils/
│       ├── constants.ts      # Physical constants, app defaults
│       └── math.ts           # Vector math helpers
├── tests/                    # Vitest test files
│   ├── physics/              # Physics engine unit tests
│   └── integration/          # Integration tests
├── PLAN.md                   # This file
├── ROADMAP.md                # Product roadmap
├── README.md                 # Project README
├── LICENSE                   # Proprietary license
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts        # (if needed beyond v4 defaults)
```

---

## 3. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 19 | Mature, large ecosystem, R3F integration |
| Language | TypeScript 5.x | Type safety for complex physics code |
| 3D Engine | Three.js via React Three Fiber | Best React-Three integration |
| 3D Helpers | @react-three/drei | Camera controls, sky, environment presets |
| State | Zustand | Lightweight, no boilerplate, works with R3F |
| Styling | Tailwind CSS v4 | Rapid UI development, utility-first |
| Build | Vite 7 | Fast HMR, excellent DX |
| Testing | Vitest | Native Vite integration, fast |
| Hosting | Cloudflare Pages | Edge deployment, fast globally |
| Linting | ESLint 9 | Flat config, TypeScript-aware |

---

## 4. Physics Engine Design

### 4.1 Core Model

Based on the aerodynamic disc flight model described by Hummel (2003) and adapted by
Crowther & Potts (2007). The simulation uses a 4th-order Runge-Kutta (RK4) integrator
with an 11-element state vector:

```
State = [x, y, z, vx, vy, vz, roll, pitch, spin, rollRate, pitchRate]
```

**Coordinate system**: X = downrange (toward basket), Y = lateral (right positive for RHBH), Z = up.

### 4.2 Forces Modeled

1. **Gravity**: Constant 9.81 m/s² downward
2. **Aerodynamic Lift**: CL(α) = CL₀ + CLα·α — lift coefficient varies with angle of attack
3. **Aerodynamic Drag**: CD(α) = CD₀ + CDα·α² — quadratic drag model
4. **Pitching Moment**: CM(α) = CM₀ + CMα·α — drives gyroscopic precession
5. **Gyroscopic Precession**: Pitching moment couples with spin → roll/pitch rate changes
6. **Spin Decay**: Exponential decay at ~0.15%/step (tunable per disc type)
7. **Wind**: Constant vector + optional gust model (Dryden-style turbulence, future)

### 4.3 Flight Number Mapping

Flight numbers (Speed, Glide, Turn, Fade) are manufacturer-assigned ratings that describe
a disc's flight characteristics. The simulator maps these to aerodynamic coefficients:

| Flight Number | Aero Effect | Mapping |
|---------------|-------------|---------|
| Speed (1-14) | Base drag, optimal velocity | Higher speed → more CD₀, needs more velocity |
| Glide (1-7) | Lift coefficient CL₀ | Higher glide → more CL₀ → floatier flight |
| Turn (-5 to +1) | High-speed stability CM₀ | Negative turn → negative CM₀ → rolls right at speed (RHBH) |
| Fade (0-5) | Low-speed stability CMα | More fade → more negative CMα → hooks left at end (RHBH) |

### 4.4 Environmental Modeling

- **Air density**: Full thermodynamic model — barometric formula for altitude, Magnus formula
  for saturation vapor pressure, accounts for humidity effect on density
- **Wind**: Headwind/crosswind components modify relative airspeed and direction
- **Altitude**: Affects air pressure → air density → all aerodynamic forces scale with ρ
- **Temperature**: Affects air density and disc plastic flexibility (minor, future)
- **Humidity**: Small effect on air density (humid air is less dense)

### 4.5 Disc Modifiers

- **Weight** (130-180g): Affects F=ma; lighter discs turn more, affected more by wind
- **Pronounced dome**: Increases CL₀ (+12%) and understability (+25% CM₀ effect)
- **Worn/beat-in**: Reduces drag (-8%) and shifts understable (CM₀ shift -0.015)

### 4.6 Multiple Flight Lines (Premium Feature)

The simulator generates multiple trajectories per run to show realistic outcome spread.
Each line varies slightly in hyzer angle and launch angle around the configured values,
simulating the natural variance in a real throw.

| Tier | Lines per simulation | Description |
|------|---------------------|-------------|
| Free | 1 | Single best-estimate trajectory |
| Premium | Up to 10 | Configurable spread showing realistic outcome variance |

---

## 5. Disc Database

### 5.1 Data Source

Primary: PDGA certified disc list (https://www.pdga.com/technical-standards/equipment-certification/discs)
Supplementary: Community-sourced flight numbers (InfiniteDiscs, Marshall Street)

The PDGA list provides manufacturer + disc name + certification status but NOT flight numbers.
Flight numbers are assigned by manufacturers and aggregated by community sites.

### 5.2 Data Structure

```typescript
interface Disc {
  id: string;              // kebab-case unique id: "innova-destroyer"
  name: string;            // "Destroyer"
  manufacturer: string;    // "Innova"
  type: 'putter' | 'midrange' | 'fairway' | 'distance';
  speed: number;           // 1-14
  glide: number;           // 1-7
  turn: number;            // -5 to +1
  fade: number;            // 0-5
  pdgaCertified: boolean;  // Is it on the PDGA approved list
}
```

### 5.3 Initial Dataset

MVP ships with ~200 popular discs covering major manufacturers (Innova, Discraft, MVP/Axiom,
Dynamic Discs, Latitude 64, Westside, Kastaplast, Discmania, Prodigy, Streamline, Thought Space).
Full database expansion is a post-MVP task.

---

## 6. 3D Scene Design

### 6.1 Visual Style

Low-poly stylized — clean geometric shapes, flat/gradient colors, no photorealistic textures.
Think: Monument Valley meets disc golf. This gives us:
- Fast rendering (important for mobile/embed future)
- Distinctive visual identity
- Easy to maintain and iterate
- Works well at small embed sizes

### 6.2 Scene Elements

1. **Ground plane**: Flat green with subtle low-poly terrain variation
2. **Fairway**: Slightly different shade, defined by hole shape
3. **Tee pad**: Concrete-colored rectangle at origin
4. **Basket**: Simplified disc golf basket model (pole + chains + cage + band)
5. **Trees**: Low-poly triangular trees at edges, some randomized placement
6. **Distance markers**: Flags or posts at 25m/50m/75m intervals
7. **Sky**: Procedural sky dome with sun position
8. **Shadows**: Contact shadows for grounding

### 6.3 Camera System

- **Default**: Third-person behind-and-above tee pad
- **Follow**: Camera follows the disc during animation
- **Overhead**: Bird's eye view showing full flight paths
- **Free orbit**: User-controlled orbit around scene center

### 6.4 Flight Path Visualization

- Tube geometry or thick line for each trajectory
- Color-coded by hyzer angle (blue=hyzer, green=flat, orange/red=anhyzer)
- Landing point markers (small sphere or disc icon)
- Optional: fade opacity for altitude (brighter = higher)

---

## 7. UI Design

### 7.1 Layout

Desktop-first layout:
- 3D viewport takes ~75% of screen width
- Right sidebar (~25%) with collapsible panels
- Mobile: sidebar becomes bottom sheet (future)

### 7.2 Panels

1. **Disc Selector**: Search by name/manufacturer, shows flight numbers, type filter
2. **Throw Config**: Velocity slider (15-35 m/s), hyzer angle (-30° to +30°),
   launch angle (0°-20°), spin (low/normal/high), release height
3. **Environment**: Wind speed + direction, altitude, temperature, humidity
4. **Results**: Total distance, max height, lateral drift, hang time
5. **Scene Controls**: Camera preset buttons, animation play/reset

### 7.3 Premium Feature Ideas

Track these for monetization planning:

- **Multiple flight lines** (1 free, up to 10 premium)
- **Compare discs** (overlay two discs' flight paths)
- **Save/share configurations** (permalink to specific setups)
- **Custom color themes** (personalize the 3D view)
- **Advanced wind model** (gusts, variable direction)
- **Export flight data** (CSV of trajectory points)
- **Disc bag** (save favorite discs for quick access)
- **Shot shape library** (hyzer flip, spike hyzer, roller, etc. presets)
- **Ad-free experience**
- **Detailed statistics** (full flight metrics, spin rate graph, velocity decay)

---

## 8. Implementation Phases

### Phase 1: Foundation (Current Sprint)
- [x] Create PLAN.md, ROADMAP.md, README.md
- [x] Fix licensing (replace GPL v3 with proprietary)
- [ ] Scaffold project (Vite + React + TS + R3F + Tailwind)
- [ ] Build physics engine with tests
- [ ] Build initial disc database (~200 discs)
- [ ] Build 3D scene (ground, tee, basket, trees, sky)
- [ ] Build flight path rendering
- [ ] Build UI panels (disc selector, throw config, environment)
- [ ] Wire everything together
- [ ] Tag v0.1.0-alpha

### Phase 2: Polish & Premium
- [ ] Disc animation (throw + flight)
- [ ] Camera follow mode
- [ ] Premium gating (1 line free, up to 10 premium)
- [ ] Disc comparison mode
- [ ] Results panel with flight statistics
- [ ] Tag v0.2.0-beta

### Phase 3: Launch Prep
- [ ] Domain purchase + Cloudflare Pages deploy
- [ ] Ad integration (free tier)
- [ ] Payment integration (Stripe for premium)
- [ ] User accounts (optional, for saving configs)
- [ ] SEO + landing page
- [ ] Tag v1.0.0

---

## 9. Licensing Decision

**Problem**: Repo currently has GPL v3. This is incompatible with commercial goals:
- GPL v3 requires source distribution with any binary/deployment
- Prevents proprietary premium features
- Embeddable widgets would inherit GPL (copyleft)
- Any contributor could fork and compete

**Recommendation**: Switch to **proprietary/all-rights-reserved** license.
The repo is private. There are no external contributors. For a freemium product
with future B2B embeds, full IP control is essential.

If Jonas later wants to open-source parts (e.g., the physics engine),
a dual-license model can be adopted: MIT for the physics lib, proprietary for the app.

---

## 10. Deployment & Infrastructure

- **Hosting**: Cloudflare Pages (static site, edge CDN, free tier generous)
- **Domain**: TBD (Jonas to purchase; suggestions: dgdsim.com, flightsim.golf, discflightsim.com)
- **CI/CD**: GitHub Actions → build → deploy to Cloudflare Pages
- **Analytics**: Cloudflare Web Analytics (privacy-first, no cookies)
- **Payments**: Stripe (future, for premium subscriptions)

---

## 11. Agent Handoff Notes

**IMPORTANT**: This section is for AI agents continuing this work.

### Context
- This is a fresh build in `/sessions/friendly-kind-franklin/mnt/Disc Golf Disc Simulator/`
- A prototype exists at `/sessions/friendly-kind-franklin/mnt/disc-flight-viz/` — use it as REFERENCE ONLY, do not copy code
- The prototype's physics engine is solid but needs improvements (wind, ground effect)
- The prototype's UI is functional but rough

### Key Decisions Already Made
- React + Three.js (R3F) + Zustand + Vite + TypeScript + Tailwind
- Low-poly stylized 3D visual style
- Freemium model: 1 flight line free, up to 10 premium
- Desktop-first, mobile later
- Cloudflare Pages hosting
- Proprietary license (was GPL v3, changed)
- Physics based on Hummel/Crowther disc flight model
- Flight numbers mapped to aero coefficients

### Owner Preferences
- Jonas wants constructive criticism, not blind agreement
- Prefers best-tool-for-job over familiar-tool
- Fedora Linux + AMD hardware (test on this stack)
- Knowledgeable about disc golf — understands flight numbers deeply
- Wants this to be a real product, not just a toy project

### Quality Standards
- Physics engine must be unit tested (Vitest)
- All physics functions must be pure (no side effects, no React deps)
- 3D scene components should be lazy-loadable
- Disc database should be easily extensible (add new discs = add data, not code)
- Premium gates should be soft (easy to toggle, no hard-coded checks everywhere)

### Git Workflow
- main branch is protected (PRs only for significant features)
- Feature branches: feature/description
- Tags for milestones: v0.1.0-alpha, v0.2.0-beta, v1.0.0
- Agents may create PRs for code review by other agents
- Commit messages: conventional commits (feat:, fix:, docs:, refactor:, test:)

---

## 12. Physics References

1. Hummel, S.A. (2003). "Frisbee Flight Simulation and Throw Biomechanics." M.S. Thesis, UC Davis.
2. Crowther, W.J. & Potts, J.R. (2007). "Simulation of a spin-stabilised sports disc." Sports Engineering, 10(1), 3-12.
3. Potts, J.R. & Crowther, W.J. (2002). "Frisbee aerodynamics." AIAA Paper 2002-3150.
4. Lorenz, R.D. (2005). "Flight and attitude dynamics of an instrumented Frisbee." Measurement Science and Technology, 16(3), 738.
5. Morrison, V.R. (2005). "The Physics of Frisbees." Electronic Journal of Classical Mechanics and Relativity.
