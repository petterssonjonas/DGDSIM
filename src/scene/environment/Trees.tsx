import { useMemo } from 'react';

interface TreesProps {
  seed?: number;
  count?: number;
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
  seed = 84,
  count = 200,
}: TreesProps) {
  const trees = useMemo(() => {
    const result: TreeData[] = [];
    
    // We want trees from X = -120 to X = 120
    const minX = -120;
    const maxX = 120;
    const rangeX = maxX - minX;

    // Ground is 250x250, so Z goes from -125 to 125
    // Fairway is around 0.
    // Halfway from the end of the map (125) to the fairway is around 65-70.
    // We'll spread the trees in a band centered around that halfway point.
    const treeLineCenter = 65;
    const treeBandWidth = 60; // Spread them +/- 30m from the center line

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(seed + i * 0.1);
      const r2 = seededRandom(seed + i * 0.2);
      const r3 = seededRandom(seed + i * 0.3);

      const x = minX + r1 * rangeX;
      
      let z: number;
      if (r2 < 0.5) {
        // Left side
        z = -treeLineCenter + (r3 - 0.5) * treeBandWidth;
      } else {
        // Right side
        z = treeLineCenter + (r3 - 0.5) * treeBandWidth;
      }

      result.push({
        position: [x, 0, z],
        scale: 1 + (seededRandom(seed + i * 0.5) - 0.5) * 0.4,
        color: seededRandom(seed + i * 0.7) < 0.5 ? '#2d5a1d' : '#3a6b2a',
      });
    }

    return result;
  }, [seed, count]);

  return (
    <group>
      {trees.map((tree, idx) => (
        <group key={`tree-${idx}`} position={tree.position}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3 * tree.scale, 0.35 * tree.scale, 6, 8]} />
            <meshStandardMaterial
              color={0x5c4033}
              roughness={0.8}
            />
          </mesh>

          <mesh
            position={[0, 5, 0]}
            castShadow
          >
            <coneGeometry args={[2.1 * tree.scale, 6, 8]} />
            <meshStandardMaterial
              color={tree.color}
              roughness={0.7}
            />
          </mesh>

          <mesh
            position={[0, 6, 0]}
            castShadow
          >
            <coneGeometry args={[1.9 * tree.scale, 5, 6]} />
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
