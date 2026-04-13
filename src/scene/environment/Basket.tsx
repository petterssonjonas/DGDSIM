interface BasketProps {
  position?: [number, number, number];
}

export function Basket({ position = [65, 0, 0] }: BasketProps) {
  const poleHeight = 1.5;
  const plateY = poleHeight / 2;        // 0.75m — mid-pole plate
  const lowerRingY = plateY + 0.20;     // 0.95m — 20cm above plate, 60cm diam
  const upperRingY = lowerRingY + 0.50; // 1.45m — 50cm above lower ring, 40cm diam
  const lowerRingRadius = 0.30;         // 60cm diameter
  const upperRingRadius = 0.25;

  // Chains: from pole at lower ring height, angled out to upper ring
  const chainCount = 12;
  const vertDist = upperRingY - lowerRingY;
  const horizDist = upperRingRadius;
  const chainLength = Math.sqrt(vertDist ** 2 + horizDist ** 2);
  const tiltAngle = Math.atan2(horizDist, vertDist);

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, poleHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, poleHeight, 8]} />
        <meshStandardMaterial color={0x888888} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Deflector plate at mid-pole */}
      <mesh position={[0, plateY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
        <meshStandardMaterial color={0xaaaaaa} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Lower ring — thin, 60cm diam, horizontal */}
      <mesh position={[0, lowerRingY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[lowerRingRadius, 0.015, 8, 32]} />
        <meshStandardMaterial color={0x666666} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Upper ring — thicker, 40cm diam, horizontal */}
      <mesh position={[0, upperRingY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[upperRingRadius, 0.020, 8, 32]} />
        <meshStandardMaterial color={0xF2D000} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Chains: bottom at pole (lower ring height), angled up to upper ring perimeter */}
      {Array.from({ length: chainCount }, (_, i) => {
        const a = (i / chainCount) * Math.PI * 2;
        return (
          <group key={`chain-${i}`} rotation={[0, a, 0]}>
            <mesh
              position={[horizDist / 1.8, (lowerRingY + upperRingY) / 2, 0]}
              rotation={[0, 0, -tiltAngle]}
            >
              <cylinderGeometry args={[0.004, 0.004, chainLength, 3]} />
              <meshStandardMaterial color={0xbbbbbb} roughness={0.4} metalness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
