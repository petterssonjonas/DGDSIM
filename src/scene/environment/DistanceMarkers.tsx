import { Text } from '@react-three/drei';
import { useMemo } from 'react';

interface DistanceMarkersProps {
  maxDistance?: number;
  interval?: number;
}

export function DistanceMarkers({
  maxDistance = 150,
  interval = 25,
}: DistanceMarkersProps) {
  const markers = useMemo(() => {
    const result = [];
    for (let distance = interval; distance <= maxDistance; distance += interval) {
      // Determine color based on distance (closer = green, farther = blue)
      const ratio = distance / maxDistance;
      const color = ratio < 0.5 ? '#4a9d4f' : ratio < 0.75 ? '#4a8fd9' : '#2d5aa3';

      result.push({ distance, color });
    }
    return result;
  }, [maxDistance, interval]);

  return (
    <group>
      {markers.map((marker) => (
        <group key={`marker-${marker.distance}`} position={[marker.distance, 0, 0]}>
          {/* Flag post */}
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.2, 6]} />
            <meshStandardMaterial color={0x666666} />
          </mesh>

          {/* Flag */}
          <mesh position={[0.2, 0.7, 0]} castShadow>
            <boxGeometry args={[0.4, 0.3, 0.1]} />
            <meshStandardMaterial color={marker.color} />
          </mesh>

          {/* Distance label text */}
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.8}
            color={marker.color}
            anchorX="center"
            anchorY="bottom"
          >
            {marker.distance}m
          </Text>
        </group>
      ))}
    </group>
  );
}
