/**
 * Manufacturer website map.
 *
 * `searchTpl`: URL template with `{name}` replaced by the disc name (URL-encoded).
 *   - WordPress sites use `/?s={name}` (most disc golf brands)
 *   - Shopify sites use `/search?q={name}`
 *
 * If `searchTpl` is absent, the link goes to the homepage only.
 * If the manufacturer isn't listed at all, falls back to a Google search.
 */

export interface ManufacturerSite {
  website: string;
  searchTpl?: string; // {name} = URL-encoded disc name
}

export const MANUFACTURER_SITES: Record<string, ManufacturerSite> = {
  'Innova':                 { website: 'https://www.innovadiscs.com',         searchTpl: 'https://www.innovadiscs.com/?s={name}' },
  'Discraft':               { website: 'https://www.discraft.com',             searchTpl: 'https://www.discraft.com/search?q={name}' },
  'Dynamic Discs':          { website: 'https://www.dynamicdiscs.com',         searchTpl: 'https://www.dynamicdiscs.com/?s={name}' },
  'Discmania':              { website: 'https://discmania.net',                searchTpl: 'https://discmania.net/?s={name}' },
  'Latitude 64':            { website: 'https://www.latitude64.se',            searchTpl: 'https://www.latitude64.se/?s={name}' },
  'Westside Discs':         { website: 'https://www.westsidediscs.com',        searchTpl: 'https://www.westsidediscs.com/?s={name}' },
  'MVP':                    { website: 'https://mvpdiscsports.com',             searchTpl: 'https://mvpdiscsports.com/?s={name}' },
  'Axiom Discs':            { website: 'https://mvpdiscsports.com',             searchTpl: 'https://mvpdiscsports.com/?s={name}' },
  'Streamline':             { website: 'https://streamlinediscs.com',          searchTpl: 'https://streamlinediscs.com/?s={name}' },
  'Kastaplast':             { website: 'https://kastaplast.se',                searchTpl: 'https://kastaplast.se/?s={name}' },
  'Prodigy':                { website: 'https://www.prodigydisc.com',          searchTpl: 'https://www.prodigydisc.com/?s={name}' },
  'Gateway':                { website: 'https://www.gatewaydiscgolf.com',      searchTpl: 'https://www.gatewaydiscgolf.com/?s={name}' },
  'Legacy':                 { website: 'https://legacydiscs.com',              searchTpl: 'https://legacydiscs.com/?s={name}' },
  'Millennium':             { website: 'https://www.millenniumdiscs.com',      searchTpl: 'https://www.millenniumdiscs.com/?s={name}' },
  'DGA':                    { website: 'https://www.dgadisc.com',              searchTpl: 'https://www.dgadisc.com/?s={name}' },
  'Thought Space Athletics':{ website: 'https://thoughtspaceathletics.com',    searchTpl: 'https://thoughtspaceathletics.com/?s={name}' },
  'EV-7':                   { website: 'https://ev-7.com',                     searchTpl: 'https://ev-7.com/?s={name}' },
  'Mint Discs':             { website: 'https://mintdiscs.com',                searchTpl: 'https://mintdiscs.com/?s={name}' },
  'Lone Star Discs':        { website: 'https://lonestardiscs.com',            searchTpl: 'https://lonestardiscs.com/?s={name}' },
  'RPM':                    { website: 'https://www.rpmdiscs.com',             searchTpl: 'https://www.rpmdiscs.com/?s={name}' },
  'Infinite Discs':         { website: 'https://infinitediscs.com',            searchTpl: 'https://infinitediscs.com/search?q={name}' },
  'Prodiscus':              { website: 'https://prodiscus.com',                searchTpl: 'https://prodiscus.com/?s={name}' },
  'Clash Discs':            { website: 'https://clashdiscs.com',               searchTpl: 'https://clashdiscs.com/?s={name}' },
  'Viking':                 { website: 'https://vikingdiscs.com',              searchTpl: 'https://vikingdiscs.com/?s={name}' },
  'Løft Discs':             { website: 'https://loftdiscs.com',                searchTpl: 'https://loftdiscs.com/?s={name}' },
  'Daredevil Discs':        { website: 'https://www.daredevildiscs.com',       searchTpl: 'https://www.daredevildiscs.com/?s={name}' },
  'Dino Discs':             { website: 'https://dinodiscs.com',                searchTpl: 'https://dinodiscs.com/?s={name}' },
  'Lightning':              { website: 'https://www.lightningdiscs.com',       searchTpl: 'https://www.lightningdiscs.com/?s={name}' },
  'Vibram':                 { website: 'https://www.vibram.com/gb/run/disc-golf/' },
  'Yikun':                  { website: 'https://www.yikundiscs.com',           searchTpl: 'https://www.yikundiscs.com/?s={name}' },
  'Above Ground Level':     { website: 'https://abovegroundleveldiscgolf.com', searchTpl: 'https://abovegroundleveldiscgolf.com/?s={name}' },
  'Trash Panda':            { website: 'https://trashpandadiscgolf.com',       searchTpl: 'https://trashpandadiscgolf.com/?s={name}' },
};

/**
 * Returns the best buy URL for a given disc.
 *
 * Priority:
 *   1. Manufacturer's disc search page (if searchTpl known)
 *   2. Manufacturer's website homepage
 *   3. Google search fallback
 */
export function getBuyUrl(discName: string, manufacturer: string): string {
  const site = MANUFACTURER_SITES[manufacturer];
  const encoded = encodeURIComponent(discName);

  if (site?.searchTpl) {
    return site.searchTpl.replace('{name}', encoded);
  }
  if (site?.website) {
    return site.website;
  }
  // Fallback: Google search with high purchase intent
  return `https://www.google.com/search?q=${encodeURIComponent(`buy ${discName} ${manufacturer} disc golf`)}`;
}
