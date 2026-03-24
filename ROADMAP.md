# DGDSIM Product Roadmap

> All dates are TBD. Priorities may shift based on user feedback and market signals.

---

## Phase 1: MVP — Core Simulator

**Goal**: A working disc flight simulator with real disc data, 3D visualization, and a single configurable hole.

- Single flight line per simulation (free tier)
- Disc selector with ~200 popular discs (searchable by name/manufacturer)
- Flight numbers displayed (Speed, Glide, Turn, Fade)
- Throw configuration (velocity, hyzer, launch angle, spin, release height)
- Environmental conditions (wind speed/direction, altitude, temperature, humidity)
- Low-poly 3D course with tee pad, basket, trees, ground, distance markers
- Disc throw animation
- Flight path rendering (colored tube/line)
- Results display (distance, max height, lateral drift, hang time)
- Desktop-first responsive layout
- Cloudflare Pages deployment with custom domain

---

## Phase 2: Premium & Polish

**Goal**: Monetization-ready with premium features and polished UX.

- Premium subscription (Stripe integration)
- Multiple flight lines (up to 10 per simulation for premium users)
- Disc comparison mode (overlay two discs' paths)
- Camera follow mode (track disc during flight)
- Camera presets (overhead, side view, behind disc)
- Ad integration for free tier (non-intrusive)
- Flight statistics panel (velocity decay, spin rate, altitude graph)
- Shot shape presets (hyzer flip, spike hyzer, roller, turnover, etc.)
- Disc bag / favorites (save commonly used discs)
- Save & share simulation links (permalink with encoded config)
- Mobile-responsive bottom sheet UI

---

## Phase 3: Community & Content

**Goal**: Build the user base and become a known tool in the disc golf community.

- Full PDGA-certified disc database (1000+ discs)
- User accounts (save configurations, disc bags, history)
- Community disc reviews / ratings integration
- Course templates (par 3 wooded, open bomber, etc.)
- Social sharing (screenshot/GIF export of flight paths)
- SEO landing pages per disc (e.g., /discs/innova-destroyer)
- Blog / educational content on disc flight physics
- Discord or community integration

---

## Phase 4: Embeddable Widget (B2B)

**Goal**: Revenue stream from disc manufacturers and online retailers.

- Embeddable 3D flight path widget (`<iframe>` or web component)
- Lightweight bundle (minimal Three.js, no full app chrome)
- Configurable: disc pre-selected, optional branding, size variants
- Widget dashboard for partners (usage analytics, customization)
- API for programmatic flight path generation
- Pricing tiers for retailers (per-widget, per-store, enterprise)
- Partnership outreach to major disc golf retailers:
  - InfiniteDiscs, OTBDiscs, DiscGolfCenter, Marshall Street
  - Manufacturer direct: Innova, Discraft, MVP, Discmania
- "Powered by DGDSIM" branding with link back to main site

---

## Phase 5: Advanced Simulation

**Goal**: Best-in-class physics accuracy, approaching CFD-lite territory.

- Wind gust model (Dryden turbulence)
- Ground effect near landing
- Roller physics (disc rolling on ground after landing)
- Skip/skip-roller behavior
- Terrain interaction (elevation changes, slopes)
- Temperature effect on plastic flexibility (stiffness → stability)
- Disc wear simulation (beat-in over time)
- Multiple throw types (backhand, forehand, overhand, thumber, tomahawk)
- Player skill profiles (arm speed, release consistency)

---

## Phase 6: Game Mode

**Goal**: Gamify the simulator for engagement and retention.

- Play a hole: try to land the disc in the basket
- Score tracking (par, birdie, etc.)
- Multi-hole rounds (9 or 18 hole courses)
- Community-designed courses
- Leaderboards
- Challenges (closest to pin, longest drive, most accurate)
- Multiplayer (async turn-based)

---

## Premium Feature Tracking

Features marked for premium gating. This list may evolve.

| Feature | Tier | Notes |
|---------|------|-------|
| Multiple flight lines (2-10) | Premium | Free gets 1 line |
| Disc comparison mode | Premium | Overlay two discs |
| Ad-free experience | Premium | Free tier shows non-intrusive ads |
| Save/share configurations | Premium | Free can use but not save |
| Export flight data (CSV) | Premium | Full trajectory export |
| Disc bag / favorites | Premium | Quick access to saved discs |
| Shot shape presets | Premium | Hyzer flip, roller, etc. |
| Advanced wind model | Premium | Gusts, variable direction |
| Detailed flight statistics | Premium | Graphs, full metrics |
| Custom color themes | Premium | Personalize the 3D view |
| Course templates | Premium | Multiple hole layouts |
