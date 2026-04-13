interface ThrowerProps {
  position?: [number, number, number];
}

export function Thrower({ position = [-75, 0, 0] }: ThrowerProps) {
  const bodyHeight = 1.75;
  const headRadius = 0.15;

  return (
    <group position={position}>
      {/* Body (capsule/cylinder) */}
      <mesh position={[0, bodyHeight / 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, bodyHeight * 0.6, 8]} />
        <meshStandardMaterial color={0x1a3a52} roughness={0.7} />
      </mesh>

      {/* Head */}
      <mesh position={[0, bodyHeight - headRadius, 0]} castShadow>
        <sphereGeometry args={[headRadius, 8, 8]} />
        <meshStandardMaterial color={0xd4a574} roughness={0.6} />
      </mesh>

      <mesh position={[0, bodyHeight * 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 6]} />
        <meshStandardMaterial color={0x1a3a52} roughness={0.7} />
      </mesh>

      {/* Right arm (extended in throwing pose) */}
      <group position={[0.25, bodyHeight * 0.65, 0]}>
        {/* Upper arm */}
        <mesh
          position={[0.2, 0, 0]}
          rotation={[0, 0, 0.75]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.08, 0.5, 6]} />
          <meshStandardMaterial color={0x1a3a52} roughness={0.7} />
        </mesh>
      </group>

      {/* Left leg */}
      <mesh position={[-0.15, bodyHeight * 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.1, bodyHeight * 0.4, 6]} />
        <meshStandardMaterial color={0x2c2c2c} roughness={0.8} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.15, bodyHeight * 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.1, bodyHeight * 0.4, 6]} />
        <meshStandardMaterial color={0x2c2c2c} roughness={0.8} />
      </mesh>
    </group>
  );
}
