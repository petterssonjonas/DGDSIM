import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { ReactNode, Suspense } from 'react';
import { useControls } from 'leva';
import { Ground } from './environment/Ground';
import { TeePad } from './environment/TeePad';
import { Basket } from './environment/Basket';
import { Trees } from './environment/Trees';
import { DistanceMarkers } from './environment/DistanceMarkers';
import { FlightPaths } from './FlightPaths';
import { AnimatedDisc } from './AnimatedDisc';
import { Thrower } from './Thrower';
import Sky from './environment/Sky';

interface TrajectoryInput {
  points: { x: number; y: number; z: number }[];
  landingPoint: { x: number; y: number; z: number };
  totalDistanceM: number;
  maxHeightM: number;
  lateralDriftM: number;
  hangTimeS: number;
}

interface SceneProps {
  trajectories?: TrajectoryInput[];
  isAnimating?: boolean;
  animatingTrajectory?: { x: number; y: number; z: number }[];
  onAnimationComplete?: () => void;
  children?: ReactNode;
}

const FLIGHT_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#a855f7',
];

/** Leva-controlled scene lighting and environment */
function SceneLighting() {
  const { ambientIntensity, sunIntensity, sunX, sunY, sunZ, shadowOpacity } = useControls(
    'Scene',
    {
      ambientIntensity: { value: 0.5, min: 0, max: 2, step: 0.05, label: 'Ambient' },
      sunIntensity: { value: 1.8, min: 0, max: 5, step: 0.1, label: 'Sun' },
      sunX: { value: 50, min: -100, max: 100, step: 5, label: 'Sun X' },
      sunY: { value: 60, min: 10, max: 120, step: 5, label: 'Sun Y' },
      sunZ: { value: 30, min: -100, max: 100, step: 5, label: 'Sun Z' },
      shadowOpacity: { value: 0.3, min: 0, max: 1, step: 0.05, label: 'Shadow' },
    },
  );

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[sunX, sunY, sunZ]}
        intensity={sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-50}
      />
      <ContactShadows
        position={[0, 0.001, 0]}
        scale={200}
        blur={2.5}
        far={50}
        opacity={shadowOpacity}
      />
    </>
  );
}

export function Scene({
  trajectories = [],
  isAnimating = false,
  animatingTrajectory = [],
  onAnimationComplete,
  children,
}: SceneProps) {
  // Map to FlightPaths format
  const flightPathData = trajectories.map((t, i) => ({
    id: `traj-${i}`,
    points: t.points,
    color: FLIGHT_COLORS[i % FLIGHT_COLORS.length]!,
    isSelected: i === 0,
    landingPoint: t.landingPoint,
  }));

  return (
    <Canvas
      camera={{
        position: [-3, 2, 0],
        fov: 50,
      }}
      shadows
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <Suspense fallback={null}>
        <Sky />
        <SceneLighting />

        <Ground />
        <TeePad />
        <Basket position={[75, 0, 0]} />
        <Trees seed={42} count={40} />
        <DistanceMarkers maxDistance={150} interval={25} />

        <FlightPaths trajectories={flightPathData} />

        {isAnimating && animatingTrajectory.length > 0 && (
          <AnimatedDisc
            trajectoryPoints={animatingTrajectory}
            isAnimating={isAnimating}
            onComplete={onAnimationComplete}
          />
        )}

        <Thrower position={[0, 0, 0]} />

        {children}
      </Suspense>

      <OrbitControls
        makeDefault
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={2}
        maxDistance={200}
        target={[40, 0, 0]}
      />
    </Canvas>
  );
}
