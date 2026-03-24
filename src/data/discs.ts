import { Disc } from './disc-types';

export const DISC_DATABASE: Disc[] = [
  // Innova - Distance Drivers (11-14)
  { id: 'innova-destroyer', name: 'Destroyer', manufacturer: 'Innova', type: 'distance', speed: 12, glide: 4, turn: -1, fade: 2 },
  { id: 'innova-wraith', name: 'Wraith', manufacturer: 'Innova', type: 'distance', speed: 11, glide: 4, turn: -1, fade: 2 },
  { id: 'innova-shryke', name: 'Shryke', manufacturer: 'Innova', type: 'distance', speed: 12, glide: 4, turn: -1, fade: 2 },
  { id: 'innova-tern', name: 'Tern', manufacturer: 'Innova', type: 'fairway', speed: 10, glide: 5, turn: -2, fade: 1 },
  { id: 'innova-orc', name: 'Orc', manufacturer: 'Innova', type: 'distance', speed: 11, glide: 3, turn: 0, fade: 2 },
  { id: 'innova-boss', name: 'Boss', manufacturer: 'Innova', type: 'distance', speed: 13, glide: 4, turn: -1, fade: 2 },
  { id: 'innova-mamba', name: 'Mamba', manufacturer: 'Innova', type: 'distance', speed: 11, glide: 5, turn: -4, fade: 1 },
  { id: 'innova-roadrunner', name: 'Roadrunner', manufacturer: 'Innova', type: 'fairway', speed: 9, glide: 5, turn: -4, fade: 1 },
  { id: 'innova-sidewinder', name: 'Sidewinder', manufacturer: 'Innova', type: 'fairway', speed: 9, glide: 5, turn: -2, fade: 1 },
  { id: 'innova-avenger-ss', name: 'Avenger SS', manufacturer: 'Innova', type: 'distance', speed: 12, glide: 5, turn: -3, fade: 1 },

  // Innova - Fairway Drivers (7-10)
  { id: 'innova-thunderbird', name: 'Thunderbird', manufacturer: 'Innova', type: 'fairway', speed: 9, glide: 4, turn: 0, fade: 2 },
  { id: 'innova-firebird', name: 'Firebird', manufacturer: 'Innova', type: 'fairway', speed: 9, glide: 4, turn: 0, fade: 3 },
  { id: 'innova-teebird', name: 'Teebird', manufacturer: 'Innova', type: 'fairway', speed: 8, glide: 5, turn: -1, fade: 1 },
  { id: 'innova-leopard', name: 'Leopard', manufacturer: 'Innova', type: 'fairway', speed: 8, glide: 5, turn: -2, fade: 1 },
  { id: 'innova-valkyrie', name: 'Valkyrie', manufacturer: 'Innova', type: 'fairway', speed: 9, glide: 5, turn: -1, fade: 1 },
  { id: 'innova-beast', name: 'Beast', manufacturer: 'Innova', type: 'fairway', speed: 10, glide: 5, turn: -2, fade: 1 },

  // Innova - Midrange (4-6)
  { id: 'innova-roc3', name: 'Roc3', manufacturer: 'Innova', type: 'midrange', speed: 5, glide: 4, turn: -2, fade: 1 },
  { id: 'innova-mako3', name: 'Mako3', manufacturer: 'Innova', type: 'midrange', speed: 5, glide: 5, turn: 0, fade: 0 },
  { id: 'innova-shark', name: 'Shark', manufacturer: 'Innova', type: 'midrange', speed: 5, glide: 4, turn: 0, fade: 2 },
  { id: 'innova-stingray', name: 'Stingray', manufacturer: 'Innova', type: 'midrange', speed: 5, glide: 4, turn: -2, fade: 1 },
  { id: 'innova-eagle', name: 'Eagle', manufacturer: 'Innova', type: 'midrange', speed: 6, glide: 5, turn: -1, fade: 1 },

  // Innova - Putters (1-3)
  { id: 'innova-aviar', name: 'Aviar', manufacturer: 'Innova', type: 'putter', speed: 3, glide: 4, turn: 0, fade: 0 },
  { id: 'innova-aviarx3', name: 'AviarX3', manufacturer: 'Innova', type: 'putter', speed: 3, glide: 4, turn: 0, fade: 1 },
  { id: 'innova-pig', name: 'Pig', manufacturer: 'Innova', type: 'putter', speed: 3, glide: 3, turn: 0, fade: 1 },
  { id: 'innova-rhyno', name: 'Rhyno', manufacturer: 'Innova', type: 'putter', speed: 2, glide: 3, turn: 0, fade: 1 },
  { id: 'innova-dart', name: 'Dart', manufacturer: 'Innova', type: 'putter', speed: 2, glide: 3, turn: 0, fade: 0 },
  { id: 'innova-nova', name: 'Nova', manufacturer: 'Innova', type: 'putter', speed: 3, glide: 5, turn: 0, fade: 0 },
  { id: 'innova-jay', name: 'Jay', manufacturer: 'Innova', type: 'putter', speed: 2, glide: 4, turn: -1, fade: 0 },

  // Discraft - Distance Drivers (11-14)
  { id: 'discraft-zeus', name: 'Zeus', manufacturer: 'Discraft', type: 'distance', speed: 12, glide: 5, turn: -2, fade: 1 },
  { id: 'discraft-nuke', name: 'Nuke', manufacturer: 'Discraft', type: 'distance', speed: 13, glide: 5, turn: -2, fade: 1 },
  { id: 'discraft-force', name: 'Force', manufacturer: 'Discraft', type: 'distance', speed: 13, glide: 4, turn: 0, fade: 2 },
  { id: 'discraft-thrasher', name: 'Thrasher', manufacturer: 'Discraft', type: 'distance', speed: 12, glide: 5, turn: -3, fade: 1 },
  { id: 'discraft-anax', name: 'Anax', manufacturer: 'Discraft', type: 'distance', speed: 10, glide: 6, turn: -1, fade: 1 },
  { id: 'discraft-vulture', name: 'Vulture', manufacturer: 'Discraft', type: 'fairway', speed: 10, glide: 5, turn: -1, fade: 2 },

  // Discraft - Fairway Drivers (7-10)
  { id: 'discraft-crank', name: 'Crank', manufacturer: 'Discraft', type: 'fairway', speed: 9, glide: 5, turn: -1, fade: 1 },
  { id: 'discraft-heat', name: 'Heat', manufacturer: 'Discraft', type: 'fairway', speed: 8, glide: 6, turn: -3, fade: 1 },
  { id: 'discraft-machete', name: 'Machete', manufacturer: 'Discraft', type: 'fairway', speed: 9, glide: 5, turn: -3, fade: 1 },
  { id: 'discraft-hades', name: 'Hades', manufacturer: 'Discraft', type: 'fairway', speed: 10, glide: 5, turn: -2, fade: 1 },
  { id: 'discraft-scorch', name: 'Scorch', manufacturer: 'Discraft', type: 'fairway', speed: 9, glide: 5, turn: -2, fade: 1 },
  { id: 'discraft-undertaker', name: 'Undertaker', manufacturer: 'Discraft', type: 'fairway', speed: 9, glide: 5, turn: -1, fade: 1 },

  // Discraft - Midrange (4-6)
  { id: 'discraft-buzzz', name: 'Buzzz', manufacturer: 'Discraft', type: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 },
  { id: 'discraft-buzzz-ss', name: 'BuzzzSS', manufacturer: 'Discraft', type: 'midrange', speed: 5, glide: 4, turn: -2, fade: 0 },
  { id: 'discraft-comet', name: 'Comet', manufacturer: 'Discraft', type: 'midrange', speed: 5, glide: 5, turn: -2, fade: 0 },
  { id: 'discraft-meteor', name: 'Meteor', manufacturer: 'Discraft', type: 'midrange', speed: 5, glide: 4, turn: 0, fade: 1 },
  { id: 'discraft-stalker', name: 'Stalker', manufacturer: 'Discraft', type: 'midrange', speed: 6, glide: 5, turn: 0, fade: 0 },
  { id: 'discraft-wasp', name: 'Wasp', manufacturer: 'Discraft', type: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 },
  { id: 'discraft-raptor', name: 'Raptor', manufacturer: 'Discraft', type: 'midrange', speed: 5, glide: 4, turn: 0, fade: 2 },

  // Discraft - Putters (1-3)
  { id: 'discraft-luna', name: 'Luna', manufacturer: 'Discraft', type: 'putter', speed: 2, glide: 5, turn: -1, fade: 0 },
  { id: 'discraft-zone', name: 'Zone', manufacturer: 'Discraft', type: 'putter', speed: 3, glide: 2, turn: 0, fade: 2 },
  { id: 'discraft-roach', name: 'Roach', manufacturer: 'Discraft', type: 'putter', speed: 3, glide: 3, turn: -1, fade: 0 },
  { id: 'discraft-fierce', name: 'Fierce', manufacturer: 'Discraft', type: 'putter', speed: 3, glide: 3, turn: 1, fade: 0 },
  { id: 'discraft-passion', name: 'Passion', manufacturer: 'Discraft', type: 'putter', speed: 3, glide: 4, turn: 0, fade: 1 },
  { id: 'discraft-sting', name: 'Sting', manufacturer: 'Discraft', type: 'putter', speed: 3, glide: 3, turn: -1, fade: 0 },

  // MVP/Axiom/Streamline - Distance Drivers (11-14)
  { id: 'mvp-nomad', name: 'Nomad', manufacturer: 'MVP', type: 'distance', speed: 12, glide: 5, turn: -2, fade: 1 },
  { id: 'axiom-pyro', name: 'Pyro', manufacturer: 'Axiom', type: 'distance', speed: 12, glide: 5, turn: 0, fade: 2 },
  { id: 'axiom-fireball', name: 'Fireball', manufacturer: 'Axiom', type: 'distance', speed: 13, glide: 4, turn: 0, fade: 2 },

  // MVP/Axiom/Streamline - Fairway Drivers (7-10)
  { id: 'streamline-crave', name: 'Crave', manufacturer: 'Streamline', type: 'fairway', speed: 9, glide: 5, turn: -2, fade: 1 },
  { id: 'mvp-insanity', name: 'Insanity', manufacturer: 'MVP', type: 'fairway', speed: 8, glide: 5, turn: -3, fade: 1 },
  { id: 'axiom-tesla', name: 'Tesla', manufacturer: 'Axiom', type: 'fairway', speed: 9, glide: 5, turn: -2, fade: 1 },
  { id: 'axiom-photon', name: 'Photon', manufacturer: 'Axiom', type: 'fairway', speed: 10, glide: 5, turn: -1, fade: 1 },
  { id: 'axiom-octane', name: 'Octane', manufacturer: 'Axiom', type: 'fairway', speed: 10, glide: 5, turn: -1, fade: 2 },
  { id: 'axiom-mayhem', name: 'Mayhem', manufacturer: 'Axiom', type: 'fairway', speed: 10, glide: 5, turn: -2, fade: 1 },

  // MVP/Axiom/Streamline - Midrange (4-6)
  { id: 'mvp-atom', name: 'Atom', manufacturer: 'MVP', type: 'midrange', speed: 4, glide: 3, turn: -1, fade: 1 },
  { id: 'mvp-entropy', name: 'Entropy', manufacturer: 'MVP', type: 'midrange', speed: 5, glide: 5, turn: 0, fade: 0 },
  { id: 'mvp-hex', name: 'Hex', manufacturer: 'MVP', type: 'midrange', speed: 5, glide: 5, turn: -2, fade: 0 },
  { id: 'mvp-reactor', name: 'Reactor', manufacturer: 'MVP', type: 'midrange', speed: 6, glide: 5, turn: -1, fade: 1 },
  { id: 'mvp-paradox', name: 'Paradox', manufacturer: 'MVP', type: 'midrange', speed: 6, glide: 5, turn: 0, fade: 0 },
  { id: 'axiom-virus', name: 'Virus', manufacturer: 'Axiom', type: 'midrange', speed: 5, glide: 4, turn: 0, fade: 1 },
  { id: 'axiom-resistor', name: 'Resistor', manufacturer: 'Axiom', type: 'midrange', speed: 6, glide: 5, turn: -1, fade: 0 },

  // MVP/Axiom/Streamline - Putters (1-3)
  { id: 'mvp-envy', name: 'Envy', manufacturer: 'MVP', type: 'putter', speed: 3, glide: 4, turn: 0, fade: 1 },
  { id: 'mvp-proxy', name: 'Proxy', manufacturer: 'MVP', type: 'putter', speed: 3, glide: 3, turn: 0, fade: 1 },
  { id: 'streamline-wave', name: 'Wave', manufacturer: 'Streamline', type: 'putter', speed: 2, glide: 3, turn: 0, fade: 0 },
  { id: 'axiom-trace', name: 'Trace', manufacturer: 'Axiom', type: 'putter', speed: 3, glide: 3, turn: 0, fade: 1 },

  // Dynamic Discs/Latitude 64/Westside - Distance Drivers (11-14)
  { id: 'dd-escape', name: 'Escape', manufacturer: 'Dynamic Discs', type: 'distance', speed: 12, glide: 5, turn: -1, fade: 2 },
  { id: 'dd-trespass', name: 'Trespass', manufacturer: 'Dynamic Discs', type: 'distance', speed: 12, glide: 5, turn: -2, fade: 1 },
  { id: 'dd-raider', name: 'Raider', manufacturer: 'Dynamic Discs', type: 'distance', speed: 11, glide: 4, turn: -1, fade: 2 },

  // Dynamic Discs/Latitude 64/Westside - Fairway Drivers (7-10)
  { id: 'dd-felon', name: 'Felon', manufacturer: 'Dynamic Discs', type: 'fairway', speed: 9, glide: 4, turn: -1, fade: 2 },
  { id: 'dd-enforcer', name: 'Enforcer', manufacturer: 'Dynamic Discs', type: 'fairway', speed: 9, glide: 5, turn: -1, fade: 1 },
  { id: 'lat64-river', name: 'River', manufacturer: 'Latitude 64', type: 'fairway', speed: 9, glide: 5, turn: -2, fade: 1 },
  { id: 'lat64-grace', name: 'Grace', manufacturer: 'Latitude 64', type: 'fairway', speed: 9, glide: 5, turn: -1, fade: 1 },
  { id: 'westside-hatchet', name: 'Hatchet', manufacturer: 'Westside', type: 'fairway', speed: 9, glide: 5, turn: -2, fade: 1 },
  { id: 'westside-underworld', name: 'Underworld', manufacturer: 'Westside', type: 'fairway', speed: 10, glide: 5, turn: -1, fade: 2 },
  { id: 'westside-destiny', name: 'Destiny', manufacturer: 'Westside', type: 'fairway', speed: 10, glide: 5, turn: -2, fade: 1 },
  { id: 'westside-stag', name: 'Stag', manufacturer: 'Westside', type: 'fairway', speed: 9, glide: 5, turn: 0, fade: 2 },

  // Dynamic Discs/Latitude 64/Westside - Midrange (4-6)
  { id: 'dd-judge', name: 'Judge', manufacturer: 'Dynamic Discs', type: 'midrange', speed: 4, glide: 3, turn: 0, fade: 1 },
  { id: 'dd-truth', name: 'EMAC Truth', manufacturer: 'Dynamic Discs', type: 'midrange', speed: 5, glide: 4, turn: -2, fade: 1 },
  { id: 'lat64-compass', name: 'Compass', manufacturer: 'Latitude 64', type: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 },
  { id: 'westside-harp', name: 'Harp', manufacturer: 'Westside', type: 'midrange', speed: 4, glide: 3, turn: 0, fade: 2 },
  { id: 'westside-warship', name: 'Warship', manufacturer: 'Westside', type: 'midrange', speed: 5, glide: 4, turn: 0, fade: 2 },
  { id: 'lat64-ahti', name: 'Ahti', manufacturer: 'Latitude 64', type: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 },

  // Dynamic Discs/Latitude 64/Westside - Putters (1-3)
  { id: 'dd-pure', name: 'Pure', manufacturer: 'Dynamic Discs', type: 'putter', speed: 3, glide: 5, turn: -1, fade: 0 },
  { id: 'lat64-royal-rage', name: 'Royal Rage', manufacturer: 'Latitude 64', type: 'putter', speed: 3, glide: 3, turn: 0, fade: 1 },
  { id: 'westside-sword', name: 'Sword', manufacturer: 'Westside', type: 'putter', speed: 3, glide: 3, turn: 1, fade: 0 },

  // Kastaplast - Distance/Fairway Drivers
  { id: 'kasta-falk', name: 'Falk', manufacturer: 'Kastaplast', type: 'fairway', speed: 9, glide: 5, turn: -3, fade: 1 },
  { id: 'kasta-grym', name: 'Grym', manufacturer: 'Kastaplast', type: 'distance', speed: 12, glide: 4, turn: -1, fade: 2 },
  { id: 'kasta-grymx', name: 'GrymX', manufacturer: 'Kastaplast', type: 'distance', speed: 12, glide: 4, turn: -1, fade: 2 },
  { id: 'kasta-lots', name: 'Lots', manufacturer: 'Kastaplast', type: 'distance', speed: 11, glide: 5, turn: -2, fade: 1 },

  // Kastaplast - Midrange/Putter
  { id: 'kasta-kaxe', name: 'Kaxe', manufacturer: 'Kastaplast', type: 'fairway', speed: 9, glide: 5, turn: -1, fade: 1 },
  { id: 'kasta-kaxez', name: 'KaxeZ', manufacturer: 'Kastaplast', type: 'fairway', speed: 8, glide: 5, turn: -2, fade: 1 },
  { id: 'kasta-svea', name: 'Svea', manufacturer: 'Kastaplast', type: 'midrange', speed: 5, glide: 5, turn: -2, fade: 0 },
  { id: 'kasta-reko', name: 'Reko', manufacturer: 'Kastaplast', type: 'midrange', speed: 4, glide: 3, turn: -1, fade: 0 },
  { id: 'kasta-berg', name: 'Berg', manufacturer: 'Kastaplast', type: 'putter', speed: 1, glide: 4, turn: 0, fade: 0 },
  { id: 'kasta-stal', name: 'Stal', manufacturer: 'Kastaplast', type: 'midrange', speed: 4, glide: 4, turn: 0, fade: 0 },

  // Discmania - Distance/Fairway Drivers
  { id: 'dm-dd3', name: 'DD3', manufacturer: 'Discmania', type: 'distance', speed: 11, glide: 5, turn: -2, fade: 1 },
  { id: 'dm-cd2', name: 'CD2', manufacturer: 'Discmania', type: 'distance', speed: 10, glide: 5, turn: -1, fade: 1 },
  { id: 'dm-fd', name: 'FD', manufacturer: 'Discmania', type: 'fairway', speed: 8, glide: 5, turn: -1, fade: 1 },

  // Discmania - Midrange
  { id: 'dm-md3', name: 'MD3', manufacturer: 'Discmania', type: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 },
  { id: 'dm-method', name: 'Method', manufacturer: 'Discmania', type: 'midrange', speed: 5, glide: 4, turn: 0, fade: 1 },
  { id: 'dm-enigma', name: 'Enigma', manufacturer: 'Discmania', type: 'midrange', speed: 5, glide: 4, turn: -2, fade: 0 },
  { id: 'dm-logic', name: 'Logic', manufacturer: 'Discmania', type: 'midrange', speed: 5, glide: 5, turn: -2, fade: 0 },
  { id: 'dm-instinct', name: 'Instinct', manufacturer: 'Discmania', type: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 },
  { id: 'dm-essence', name: 'Essence', manufacturer: 'Discmania', type: 'midrange', speed: 5, glide: 5, turn: -2, fade: 0 },

  // Discmania - Putters
  { id: 'dm-p2', name: 'P2', manufacturer: 'Discmania', type: 'putter', speed: 2, glide: 4, turn: -1, fade: 0 },
  { id: 'dm-tactic', name: 'Tactic', manufacturer: 'Discmania', type: 'putter', speed: 2, glide: 3, turn: 0, fade: 0 },

  // Prodigy - Distance/Fairway Drivers
  { id: 'prodigy-d3', name: 'D3', manufacturer: 'Prodigy', type: 'distance', speed: 11, glide: 5, turn: -2, fade: 1 },
  { id: 'prodigy-d2', name: 'D2', manufacturer: 'Prodigy', type: 'distance', speed: 10, glide: 5, turn: -1, fade: 1 },
  { id: 'prodigy-d1', name: 'D1', manufacturer: 'Prodigy', type: 'distance', speed: 12, glide: 4, turn: -1, fade: 2 },
  { id: 'prodigy-f5', name: 'F5', manufacturer: 'Prodigy', type: 'fairway', speed: 9, glide: 5, turn: -1, fade: 1 },
  { id: 'prodigy-f3', name: 'F3', manufacturer: 'Prodigy', type: 'fairway', speed: 8, glide: 5, turn: -2, fade: 1 },
  { id: 'prodigy-f2', name: 'F2', manufacturer: 'Prodigy', type: 'fairway', speed: 7, glide: 5, turn: -2, fade: 1 },

  // Prodigy - Midrange/Putter
  { id: 'prodigy-m4', name: 'M4', manufacturer: 'Prodigy', type: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 },
  { id: 'prodigy-m2', name: 'M2', manufacturer: 'Prodigy', type: 'midrange', speed: 5, glide: 5, turn: -1, fade: 0 },
  { id: 'prodigy-h3v2', name: 'H3 V2', manufacturer: 'Prodigy', type: 'midrange', speed: 5, glide: 4, turn: 0, fade: 1 },
  { id: 'prodigy-pa3', name: 'PA-3', manufacturer: 'Prodigy', type: 'putter', speed: 3, glide: 4, turn: 0, fade: 1 },

  // Thought Space Athletics - Distance/Fairway Drivers
  { id: 'tsa-pathfinder', name: 'Pathfinder', manufacturer: 'Thought Space Athletics', type: 'distance', speed: 11, glide: 5, turn: -2, fade: 1 },
  { id: 'tsa-mantra', name: 'Mantra', manufacturer: 'Thought Space Athletics', type: 'fairway', speed: 9, glide: 5, turn: -1, fade: 1 },
  { id: 'tsa-omen', name: 'Omen', manufacturer: 'Thought Space Athletics', type: 'fairway', speed: 9, glide: 5, turn: -2, fade: 1 },

  // Thought Space Athletics - Midrange
  { id: 'tsa-animus', name: 'Animus', manufacturer: 'Thought Space Athletics', type: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 },
  { id: 'tsa-construct', name: 'Construct', manufacturer: 'Thought Space Athletics', type: 'midrange', speed: 5, glide: 4, turn: 0, fade: 1 },
  { id: 'tsa-synapse', name: 'Synapse', manufacturer: 'Thought Space Athletics', type: 'midrange', speed: 5, glide: 5, turn: -2, fade: 0 },
  { id: 'tsa-ethos', name: 'Ethos', manufacturer: 'Thought Space Athletics', type: 'midrange', speed: 5, glide: 4, turn: -2, fade: 0 },

  // Thought Space Athletics - Putters
  { id: 'tsa-praxis', name: 'Praxis', manufacturer: 'Thought Space Athletics', type: 'putter', speed: 2, glide: 4, turn: 0, fade: 0 },
  { id: 'tsa-votum', name: 'Votum', manufacturer: 'Thought Space Athletics', type: 'putter', speed: 3, glide: 3, turn: 0, fade: 1 },
  { id: 'tsa-muse', name: 'Muse', manufacturer: 'Thought Space Athletics', type: 'putter', speed: 2, glide: 4, turn: -1, fade: 0 },
];

/**
 * Get a disc by its ID
 */
export function getDiscById(id: string): Disc | undefined {
  return DISC_DATABASE.find(disc => disc.id === id);
}

/**
 * Search discs by name or manufacturer (case-insensitive)
 */
export function searchDiscs(query: string): Disc[] {
  const lowerQuery = query.toLowerCase();
  return DISC_DATABASE.filter(disc =>
    disc.name.toLowerCase().includes(lowerQuery) ||
    disc.manufacturer.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all discs of a specific type
 */
export function getDiscsByType(type: string): Disc[] {
  return DISC_DATABASE.filter(disc => disc.type === type);
}

/**
 * Get all discs from a specific manufacturer
 */
export function getDiscsByManufacturer(manufacturer: string): Disc[] {
  return DISC_DATABASE.filter(disc =>
    disc.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
}

/**
 * Get all unique manufacturers (sorted alphabetically)
 */
export function getAllManufacturers(): string[] {
  const manufacturers = new Set(DISC_DATABASE.map(disc => disc.manufacturer));
  return Array.from(manufacturers).sort();
}
