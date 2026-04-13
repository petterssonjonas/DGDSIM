/**
 * Temporary dev component to preview the Spline GLB export in isolation.
 * Remove or replace once you've evaluated the scene.
 *
 * Note: Free tier Spline GLB has no materials (geometry only, gray).
 * Upgrade Spline or re-export with textures for the full look.
 *
 * Scale: Spline exports with large coordinate values.
 * Tweak SPLINE_SCALE until proportions look right.
 */

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

// anywhere from 0.5 to 1 looks good. setting 1, that should be good when camera is set where it should be, behind the thrower.
const SPLINE_SCALE = 1

function SplineModel() {
  const { scene } = useGLTF('/models/testscene.glb')
  return <primitive object={scene} />
}

function TestSceneContent() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <Environment preset="sunset" />
      <group scale={SPLINE_SCALE}>
        <SplineModel />
      </group>
      <OrbitControls makeDefault />
    </>
  )
}

export function TestSceneViewer() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <TestSceneContent />
        </Suspense>
      </Canvas>

      {/* Dev overlay */}
      <div style={{
        position: 'absolute', top: 16, left: 16,
        color: 'white', fontFamily: 'monospace', fontSize: 12,
        background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: 6,
        pointerEvents: 'none'
      }}>
        <div>🧪 Spline Test Scene (GLB)</div>
        <div style={{ opacity: 0.6, marginTop: 4 }}>scale = {SPLINE_SCALE} — adjust in TestSceneViewer.tsx</div>
        <div style={{ opacity: 0.6 }}>Gray = no materials on free Spline tier</div>
      </div>
    </div>
  )
}

useGLTF.preload('/models/testscene.glb')
