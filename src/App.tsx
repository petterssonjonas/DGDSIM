import { useState, useEffect, useMemo } from 'react';
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

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    useAppStore.getState().runSimulation();
  }, []);

  const animatingTrajectory = useMemo(
    () => (trajectories.length > 0 ? trajectories[0]!.points : []),
    [trajectories],
  );

  const sceneTrajectories = useMemo(
    () =>
      trajectories.map((t) => ({
        points: t.points,
        landingPoint: t.landingPoint,
        totalDistanceM: t.totalDistanceM,
        maxHeightM: t.maxHeightM,
        lateralDriftM: t.lateralDriftM,
        hangTimeS: t.hangTimeS,
      })),
    [trajectories],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950">
      {/* 3D Viewport */}
      <div className="flex-1 min-w-0 relative">
        <Scene
          trajectories={sceneTrajectories}
          isAnimating={isAnimating}
          animatingTrajectory={animatingTrajectory}
          onAnimationComplete={stopAnimation}
        />

        {/* Title overlay */}
        <div className="absolute top-4 left-4 pointer-events-none select-none">
          <div className="text-white font-black text-xl tracking-tight leading-none drop-shadow-lg">
            DGDSIM
          </div>
          <div className="text-white/40 text-[10px] mt-0.5 tracking-widest uppercase drop-shadow">
            Flight Simulator
          </div>
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="absolute top-4 right-4 z-10 rounded-md bg-black/40 backdrop-blur-sm border border-white/10 px-2.5 py-1.5 text-xs text-white/60 hover:text-white hover:border-white/20 hover:bg-black/60 transition-all"
        >
          {sidebarOpen ? 'Hide' : 'Panel'}
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-76 flex-shrink-0 bg-zinc-950 border-l border-zinc-800 flex flex-col overflow-hidden">
          {/* Scrollable panels */}
          <div className="flex-1 overflow-y-auto">
            <DiscSelector />
            <ThrowPanel />
            <EnvPanel />
          </div>

          {/* Simulate + results — always visible at bottom */}
          <div className="border-t border-zinc-800 flex-shrink-0">
            <SimControls />
            <ResultsPanel />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
