import * as THREE from 'three';
import { useMemo } from 'react';

interface GroundProps {
  size?: number;
  fairwayWidth?: number;
}

export function Ground({ size = 300, fairwayWidth = 30 }: GroundProps) {
  const mainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, 80, 80);
    const posAttr = geo.getAttribute('position');
    const positions = posAttr.array as Float32Array;

    const seeded = (seed: number) => {
      const v = Math.sin(seed) * 10000;
      return v - Math.floor(v);
    };

    for (let i = 0; i < positions.length; i += 3) {
      const px = positions[i] ?? 0;
      const pz = positions[i + 2] ?? 0;
      const bump = (seeded(px * 0.1 + pz * 0.1) - 0.5) * 0.05;
      if (i + 1 < positions.length) {
        positions[i + 1] = (positions[i + 1] ?? 0) + bump;
      }
    }

    posAttr.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [size]);

  return (
    <>
      <mesh geometry={mainGeometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color={0x4a7c3f} roughness={0.8} />
      </mesh>

      <mesh position={[size / 4, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size * 0.8, fairwayWidth]} />
        <meshStandardMaterial color={0x5a9c4f} roughness={0.75} />
      </mesh>
    </>
  );
}
