export type DiscType = 'putter' | 'midrange' | 'fairway' | 'distance';

export interface Disc {
  id: string;              // kebab-case: "innova-destroyer"
  name: string;            // "Destroyer"
  manufacturer: string;    // "Innova"
  type: DiscType;
  speed: number;           // 1-14
  glide: number;           // 1-7
  turn: number;            // -5 to +1
  fade: number;            // 0-5
}
