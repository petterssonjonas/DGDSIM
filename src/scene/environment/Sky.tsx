import * as THREE from 'three';

export default function Sky() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[500, 32, 32]} />
        <meshBasicMaterial color={0x87ceeb} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
