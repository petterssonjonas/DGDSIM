import { useMemo } from 'react';

interface TreesProps {
  seed?: number;
  count?: number;
  fairwayMargin?: number;
}

interface TreeData {
  position: [number, number, number];
  scale: number;
  color: string;
}

/**
 * Seeded random number generator for consistent tree placement
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function Trees({
  seed = 42,
  count = 40,
  fairwayMargin = 20,
}: TreesProps) {
  const trees = useMemo(() => {
    const result: TreeData[] = [];
    const fieldSize = 300;
    const fairwayWidth = 30;

    // Generate trees with seeded random
    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(seed + i * 0.1);
      const r2 = seededRandom(seed + i * 0.2);
      const r3 = seededRandom(seed + i * 0.3);

      // Place trees along edges, avoiding fairway
      let x: number;
      let z: number;

      if (r1 < 0.4) {
        // Left side (negative Z)
        x = r2 * fieldSize - fieldSize / 2;
        z = -fairwayWidth / 2 - fairwayMargin - r3 * 60;
      } else if (r1 < 0.6) {
        // Right side (positive Z)
        x = r2 * fieldSize - fieldSize / 2;
        z = fairwayWidth / 2 + fairwayMargin + r3 * 60;
      } else if (r1 < 0.8) {
        // Behind tee (negative X)
        x = -(50 + r2 * 40);
        z = (r3 - 0.5) * fairwayWidth * 2;
      } else {
        // Far field (beyond basket)
        x = 100 + r2 * 100;
        z = (r3 - 0.5) * fieldSize * 0.6;
      }

      // Bounds check
      if (
        Math.abs(x) < fieldSize / 2 &&
        Math.abs(z) < fieldSize / 2
      ) {
        result.push({
          position: [x, 0, z],
          scale: 1 + (seededRandom(seed + i * 0.5) - 0.5) * 0.4,
          color: seededRandom(seed + i * 0.7) < 0.5 ? '#2d5a1d' : '#3a6b2a',
        });
      }
    }

    return result;
  }, [seed, count, fairwayMargin]);

  return (
    <group>
      {trees.map((tree, idx) => (
        <group key={`tree-${idx}`} position={tree.position}>
          {/* Trunk */}
          <mesh castShadow>
            <cylinderGeometry args={[0.3 * tree.scale, 0.35 * tree.scale, 6, 8]} />
            <meshStandardMaterial
              color={0x5c4033}
              roughness={0.8}
            />
          </mesh>

          {/* Canopy (cone) */}
          <mesh
            position={[0, 5, 0]}
            castShadow
          >
            <coneGeometry args={[3 * tree.scale, 7, 8]} />
            <meshStandardMaterial
              color={tree.color}
              roughness={0.7}
            />
          </mesh>

          {/* Secondary canopy layer for depth */}
          <mesh
            position={[0, 6, 0]}
            castShadow
          >
            <coneGeometry args={[2.5 * tree.scale, 5, 8]} />
            <meshStandardMaterial
              color={tree.color}
              roughness={0.7}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
