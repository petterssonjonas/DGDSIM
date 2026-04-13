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
      result.push({ distance });
    }
    return result;
  }, [maxDistance, interval]);

  return (
    <group>
      {markers.map((marker) => (
        <group key={`marker-${marker.distance}`} position={[marker.distance, 0.5, 5]}>
          {/* Distance label text on the ground */}
          <Text
            rotation={[-Math.PI / 2, 0, -Math.PI / 4]}
            fontSize={3}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#222"
          >
            {marker.distance}m
          </Text>
        </group>
      ))}
    </group>
  );
}
