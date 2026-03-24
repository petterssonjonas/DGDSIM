import { Line, Sphere } from '@react-three/drei';
import { useMemo } from 'react';

interface TrajectoryData {
  id: string;
  points: { x: number; y: number; z: number }[];
  color: string;
  isSelected: boolean;
  landingPoint: { x: number; y: number; z: number };
}

interface FlightPathsProps {
  trajectories: TrajectoryData[];
}

/**
 * Convert physics coordinates to Three.js coordinates:
 * Physics: X = downrange, Y = lateral right, Z = up
 * Three.js: X = downrange, Y = up, Z = lateral right
 */
function toThree(p: { x: number; y: number; z: number }): [number, number, number] {
  return [p.x, p.z, p.y];
}

const FLIGHT_COLORS = [
  '#22c55e', // green (flat)
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
  '#a855f7', // purple
];

export function FlightPaths({ trajectories }: FlightPathsProps) {
  const pathsData = useMemo(() => {
    return trajectories.map((traj, idx) => ({
      points: traj.points.map(toThree),
      landingPoint: toThree(traj.landingPoint),
      color: traj.color || FLIGHT_COLORS[idx % FLIGHT_COLORS.length]!,
      isSelected: traj.isSelected,
    }));
  }, [trajectories]);

  return (
    <group>
      {pathsData.map((path, idx) => (
        <group key={`trajectory-${idx}`}>
          {path.points.length > 1 && (
            <Line
              points={path.points}
              color={path.color}
              lineWidth={path.isSelected ? 3 : 1.5}
              dashed={false}
            />
          )}
          <Sphere args={[0.3, 8, 8]} position={path.landingPoint}>
            <meshStandardMaterial
              color={path.color}
              emissive={path.color}
              emissiveIntensity={path.isSelected ? 0.8 : 0.3}
            />
          </Sphere>
        </group>
      ))}
    </group>
  );
}
