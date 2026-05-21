// =========================================================================
// FabricBackground.jsx — dark silk background with cursor parallax
// =========================================================================

function FabricBackground({ children }) {
  const [drift, setDrift] = React.useState({ x: 0, y: 0 });
  const reducedMotion = React.useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  React.useEffect(() => {
    if (reducedMotion) return;
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
    <div className="fabric-root">
      <div
        className="fabric-layer"
        style={{
          transform: `translate3d(${drift.x}px, ${drift.y}px, 0) scale(1.04)`,
        }}
      >
        <div className="fabric-conic"></div>
        <div className="fabric-sheen-1"></div>
        <div className="fabric-sheen-2"></div>
        <div className="fabric-sheen-3"></div>
      </div>
      <div className="fabric-vignette"></div>
      {children}
    </div>
  );
}

window.FabricBackground = FabricBackground;
