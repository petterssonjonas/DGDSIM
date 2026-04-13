/**
 * Sponsor configuration for the "Buy It" ad spot.
 *
 * Placement priority (highest to lowest):
 *   1. DISC_SPONSORS   — disc-specific (highest value, e.g. manufacturer promoting that exact mold)
 *   2. MANUFACTURER_SPONSORS — all discs from a brand
 *   3. No entry → spot renders nothing
 *
 * To sell a placement: add an entry below with the sponsor's affiliate/tracking URL.
 * The `discUrl` field should be the deep-link to the specific product page when available.
 */

export interface SponsorEntry {
  storeName: string;
  storeUrl: string;       // fallback / homepage
  discUrl?: string;       // deep-link to the specific disc page (preferred)
  tagline?: string;       // short merchandising line, max ~40 chars
  cta?: string;           // button label — defaults to "Buy Now"
}

/** Keyed by disc id (e.g. "innova-destroyer") */
export const DISC_SPONSORS: Record<string, SponsorEntry> = {
  // DEMO — remove or replace with real affiliate URL
  'innova-destroyer': {
    storeName: 'Infinite Discs',
    storeUrl: 'https://infinitediscs.com',
    discUrl: 'https://infinitediscs.com/Innova-Destroyer',
    tagline: 'Free shipping over $50',
    cta: 'Shop Destroyer',
  },
};

/** Keyed by manufacturer name exactly as it appears in disc data */
export const MANUFACTURER_SPONSORS: Record<string, SponsorEntry> = {
  // Example — replace with real affiliate URLs when sold:
  // 'Innova': {
  //   storeName: 'Innova Shop',
  //   storeUrl: 'https://www.innovadiscs.com/shop',
  //   tagline: 'Official Innova store',
  // },
};

export function getSponsor(discId: string, manufacturer: string): SponsorEntry | null {
  return DISC_SPONSORS[discId] ?? MANUFACTURER_SPONSORS[manufacturer] ?? null;
}
