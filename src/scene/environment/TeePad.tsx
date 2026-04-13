interface TeePadProps {
  width?: number;
  depth?: number;
  elevation?: number;
  position?: [number, number, number];
}

export function TeePad({
  width = 1.75,
  depth = 4,
  elevation = 0.1,
  position,
}: TeePadProps) {
  const pos = position || [0, elevation, 0];
  return (
    <group position={pos}>
      {/* Main concrete pad */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[depth, 0.03, width]} />
        <meshStandardMaterial color={0x888888} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Darker border for visual definition */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[depth + 0.1, 0.01, width + 0.1]} />
        <meshStandardMaterial color={0x555555} roughness={0.7} />
      </mesh>
    </group>
  );
}
