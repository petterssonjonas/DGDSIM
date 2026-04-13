import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';

interface AnimatedDiscProps {
  /** Trajectory points in physics coordinates: X=downrange, Y=lateral, Z=up */
  trajectoryPoints: { x: number; y: number; z: number }[];
  isAnimating: boolean;
  onComplete?: () => void;
}

const DISC_RADIUS = 0.135;
const DISC_THICKNESS = 0.02;

/** Physics: X=downrange, Y=lateral, Z=up → Three: X=downrange, Y=up, Z=lateral */
function toThree(p: { x: number; y: number; z: number }): THREE.Vector3 {
  return new THREE.Vector3(p.x, p.z, p.y);
}

export function AnimatedDisc({
  trajectoryPoints,
  isAnimating,
  onComplete,
}: AnimatedDiscProps) {
  const groupRef = useRef<THREE.Group>(null);
  const discRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    progressRef.current = 0;
    hasCompletedRef.current = false;
  }, [isAnimating, trajectoryPoints]);

  useFrame((_state, delta) => {
    if (!isAnimating || !groupRef.current || !discRef.current || trajectoryPoints.length < 2) {
      return;
    }

    // Advance based on real time — ~2x real-time playback
    const totalPoints = trajectoryPoints.length;
    const realFlightTimeS = totalPoints * 0.005; // 5ms per point
    const playbackSpeed = 2.0;
    progressRef.current += (delta * playbackSpeed) / realFlightTimeS;

    if (progressRef.current >= 1) {
      progressRef.current = 1;
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
      }
    }

    // Interpolate position
    const totalSegments = totalPoints - 1;
    const targetSegment = progressRef.current * totalSegments;
    const segIdx = Math.min(Math.floor(targetSegment), totalSegments - 1);
    const localT = targetSegment - segIdx;

    const p0 = trajectoryPoints[segIdx]!;
    const p1 = trajectoryPoints[Math.min(segIdx + 1, totalSegments)]!;

    const pos = toThree({
      x: p0.x + (p1.x - p0.x) * localT,
      y: p0.y + (p1.y - p0.y) * localT,
      z: p0.z + (p1.z - p0.z) * localT,
    });

    groupRef.current.position.copy(pos);

    // Spin the disc
    discRef.current.rotation.y += delta * 40;

    // Tilt based on flight direction
    if (segIdx + 1 < totalPoints) {
      const dx = p1.x - p0.x;
      const dz = p1.z - p0.z; // physics Z = up
      const pitchAngle = Math.atan2(dz, Math.abs(dx));
      discRef.current.rotation.x = pitchAngle * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={discRef} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[DISC_RADIUS, DISC_RADIUS, DISC_THICKNESS, 24]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}
