interface TeePadProps {
  width?: number;
  depth?: number;
  elevation?: number;
}

export function TeePad({
  width = 1.5,
  depth = 3,
  elevation = 0.02,
}: TeePadProps) {
  return (
    <group position={[0, elevation, 0]}>
      {/* Main concrete pad */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[depth, 0.05, width]} />
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
