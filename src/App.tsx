import { useState, useEffect } from 'react';
import { Scene } from '@/scene/Scene';
import { DiscSelector } from '@/ui/DiscSelector';
import { ThrowPanel } from '@/ui/ThrowPanel';
import { EnvPanel } from '@/ui/EnvPanel';
import { ResultsPanel } from '@/ui/ResultsPanel';
import { SimControls } from '@/ui/SimControls';
import { useAppStore } from '@/store/app-store';

function App() {
  const trajectories = useAppStore((s) => s.trajectories);
  const isAnimating = useAppStore((s) => s.isAnimating);
  const stopAnimation = useAppStore((s) => s.stopAnimation);
  const runSimulation = useAppStore((s) => s.runSimulation);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Run initial simulation on mount
  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get first trajectory points for animation
  const animatingTrajectory = trajectories.length > 0 ? trajectories[0]!.points : [];

  // Map trajectories to scene format
  const sceneTrajectories = trajectories.map((t) => ({
    points: t.points,
    landingPoint: t.landingPoint,
    totalDistanceM: t.totalDistanceM,
    maxHeightM: t.maxHeightM,
    lateralDriftM: t.lateralDriftM,
    hangTimeS: t.hangTimeS,
  }));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900">
      {/* 3D Viewport */}
      <div className="flex-1 min-w-0 relative">
        <Scene
          trajectories={sceneTrajectories}
          isAnimating={isAnimating}
          animatingTrajectory={animatingTrajectory}
          onAnimationComplete={stopAnimation}
        />

        {/* Title overlay */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <h1 className="text-lg font-bold text-white drop-shadow-lg">
            DGDSIM
          </h1>
          <p className="text-xs text-white/70 drop-shadow">
            Disc Golf Disc Flight Simulator
          </p>
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="absolute top-4 right-4 z-10 rounded-lg bg-white/90 backdrop-blur px-3 py-1.5 text-sm text-slate-700 shadow hover:bg-white transition-colors"
        >
          {sidebarOpen ? 'Hide Panel' : 'Show Panel'}
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <DiscSelector />
            <ThrowPanel />
            <EnvPanel />
            <SimControls />
            <ResultsPanel />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
