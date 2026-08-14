// =========================================================================
// FabricBackground.jsx — dark silk background with cursor parallax
// =========================================================================

function FabricBackground({ children, reducedMotion: reducedMotionPref, wallpaper = 'graphite' }) {
  const [drift, setDrift] = React.useState({ x: 0, y: 0 });
  const systemReduced = React.useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  // The View menu can only ask for less motion, never more than the OS allows.
  const reducedMotion = systemReduced || !!reducedMotionPref;

  React.useEffect(() => {
    // Settle back to centre rather than freezing wherever the cursor left it.
    if (reducedMotion) { setDrift({ x: 0, y: 0 }); return; }
    let raf = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    function onMove(e) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      target = {
        x: ((e.clientX - cx) / cx) * 15,
        y: ((e.clientY - cy) / cy) * 15,
      };
    }
    function tick() {
      // critically damped easing toward target
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      setDrift({ x: current.x, y: current.y });
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div className={`wallpaper-root wp-theme-${wallpaper}`}>
      <div
        className="wallpaper-layer"
        style={{
          transform: `translate3d(${drift.x}px, ${drift.y}px, 0) scale(1.06)`,
        }}
      >
        <div className="wp-base"></div>
        <div className="wp-wave wp-wave-1"></div>
        <div className="wp-wave wp-wave-2"></div>
        <div className="wp-ridge"></div>
        <div className="wp-glow"></div>
      </div>
      {children}
    </div>
  );
}

window.FabricBackground = FabricBackground;
