interface BasketProps {
  position?: [number, number, number];
}

export function Basket({ position = [75, 0, 0] }: BasketProps) {
  const poleHeight = 1.5;
  const cageRadius = 0.3;
  const cageHeight = 0.6;
  const bandHeight = 0.9;
  const bandRadius = 0.5;

  return (
    <group position={position}>
      {/* Base (small concrete pad) */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.1, 16]} />
        <meshStandardMaterial
          color={0x666666}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Pole */}
      <mesh
        position={[0, poleHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.04, 0.04, poleHeight, 8]} />
        <meshStandardMaterial
          color={0x777777}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Catching band (torus at mid-height) */}
      <mesh position={[0, bandHeight, 0]} castShadow receiveShadow>
        <torusGeometry args={[bandRadius, 0.08, 8, 16]} />
        <meshStandardMaterial
          color={0xdd6633}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Cage/chains zone (cone at top) */}
      <mesh
        position={[0, poleHeight - cageHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[cageRadius, cageHeight, 12]} />
        <meshStandardMaterial
          color={0xffd700}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Chain strands visual - simple cylinders from basket ring to cone */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * (bandRadius - 0.1);
        const z = Math.sin(angle) * (bandRadius - 0.1);
        return (
          <mesh
            key={`chain-${i}`}
            position={[x, bandHeight, z]}
            castShadow
          >
            <cylinderGeometry args={[0.01, 0.01, cageHeight / 2, 4]} />
            <meshStandardMaterial
              color={0xcccccc}
              roughness={0.5}
              metalness={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}
