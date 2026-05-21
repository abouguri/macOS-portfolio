// =========================================================================
// Dock.jsx — glass dock with authentic macOS cosine magnification
// Based on 21st.dev mac-os-dock component (adapted for vanilla JSX/Babel)
// Uses a rAF animation loop with lerp for smooth spring-like motion.
// =========================================================================

function Dock({ apps, onAppClick, openIds = [] }) {
  const [currentScales, setCurrentScales] = React.useState(() => apps.map(() => 1));
  const [currentPositions, setCurrentPositions] = React.useState([]);
  const [hovered, setHovered] = React.useState(null);

  const dockRef = React.useRef(null);
  const iconRefs = React.useRef([]);
  const mouseXRef = React.useRef(null);
  const configRef = React.useRef(null);
  const lastMoveTime = React.useRef(0);

  // ── Responsive config ────────────────────────────────────────────────
  function computeConfig() {
    const dim = Math.min(window.innerWidth, window.innerHeight);
    if (dim < 480)  return { baseIconSize: Math.max(40, dim * 0.08), maxScale: 1.4, effectWidth: dim * 0.40 };
    if (dim < 768)  return { baseIconSize: Math.max(48, dim * 0.07), maxScale: 1.5, effectWidth: dim * 0.35 };
    if (dim < 1024) return { baseIconSize: Math.max(56, dim * 0.06), maxScale: 1.6, effectWidth: dim * 0.30 };
    return { baseIconSize: Math.max(64, Math.min(80, dim * 0.05)), maxScale: 1.8, effectWidth: 300 };
  }

  const [config, setConfig] = React.useState(computeConfig);
  React.useEffect(() => { configRef.current = config; }, [config]);
  React.useEffect(() => {
    configRef.current = computeConfig();
    const onResize = () => setConfig(computeConfig());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Animation loop (runs once, reads config via ref) ─────────────────
  React.useEffect(() => {
    const n = apps.length;
    const scales = apps.map(() => 1.0);

    function spacing(iconSize) { return Math.max(4, iconSize * 0.08); }

    function targetScale(index, mX) {
      const { baseIconSize, maxScale, effectWidth } = configRef.current || computeConfig();
      const sp = spacing(baseIconSize);
      if (mX === null) return 1.0;
      const center = index * (baseIconSize + sp) + baseIconSize / 2;
      const lo = mX - effectWidth / 2;
      const hi = mX + effectWidth / 2;
      if (center < lo || center > hi) return 1.0;
      const theta = ((center - lo) / effectWidth) * 2 * Math.PI;
      return 1.0 + ((1 - Math.cos(theta)) / 2) * (maxScale - 1.0);
    }

    function calcPositions(s) {
      const { baseIconSize } = configRef.current || computeConfig();
      const sp = spacing(baseIconSize);
      let x = 0;
      return s.map(sc => {
        const w = baseIconSize * sc;
        const c = x + w / 2;
        x += w + sp;
        return c;
      });
    }

    let rafId;
    function animate() {
      const mX = mouseXRef.current;
      const lerp = mX !== null ? 0.2 : 0.12;
      for (let i = 0; i < n; i++) {
        scales[i] += (targetScale(i, mX) - scales[i]) * lerp;
      }
      const positions = calcPositions(scales);
      setCurrentScales([...scales]);
      setCurrentPositions([...positions]);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [apps.length]); // eslint-disable-line

  // ── Mouse tracking ───────────────────────────────────────────────────
  function handleMouseMove(e) {
    const now = performance.now();
    if (now - lastMoveTime.current < 16) return;
    lastMoveTime.current = now;
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const pad = Math.max(8, config.baseIconSize * 0.12);
    mouseXRef.current = e.clientX - rect.left - pad;
  }

  function handleMouseLeave() {
    mouseXRef.current = null;
    setHovered(null);
  }

  // ── Bounce on click ──────────────────────────────────────────────────
  function handleClick(app, index) {
    const el = iconRefs.current[index];
    if (el) {
      const h = -(config.baseIconSize * 0.15);
      el.style.transition = 'transform 0.18s ease-out';
      el.style.transform = `translateY(${h}px)`;
      setTimeout(() => { el.style.transition = 'transform 0.18s ease-out'; el.style.transform = 'translateY(0)'; }, 180);
    }
    onAppClick && onAppClick(app);
  }

  // ── Layout math ──────────────────────────────────────────────────────
  const { baseIconSize } = config;
  const pad = Math.max(8, baseIconSize * 0.12);
  const contentWidth = currentPositions.length > 0
    ? Math.max(...currentPositions.map((p, i) => p + (baseIconSize * (currentScales[i] || 1)) / 2))
    : apps.length * (baseIconSize + Math.max(4, baseIconSize * 0.08));
  const radius = Math.max(16, baseIconSize * 0.35);

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 50,
      pointerEvents: 'none',
    }}>
      <div
        ref={dockRef}
        style={{
          pointerEvents: 'auto',
          width: `${contentWidth + pad * 2}px`,
          padding: `${pad}px`,
          background: 'rgba(28,28,30,0.62)',
          borderRadius: `${radius}px`,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.12) inset, 0 20px 40px -8px rgba(0,0,0,0.55), 0 8px 24px -12px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ position: 'relative', height: `${baseIconSize}px`, width: '100%' }}>
          {apps.map((app, i) => {
            const scale = currentScales[i] || 1;
            const pos   = currentPositions[i] || 0;
            const size  = baseIconSize * scale;
            const isOpen    = openIds.includes(app.id);
            const isHovered = hovered === app.id;

            return (
              <div
                key={app.id}
                ref={el => { iconRefs.current[i] = el; }}
                style={{
                  position: 'absolute',
                  left: `${pos - size / 2}px`,
                  bottom: 0,
                  width: `${size}px`,
                  height: `${size}px`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  zIndex: Math.round(scale * 10),
                }}
                onClick={() => handleClick(app, i)}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: `${size + 10}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 10px',
                    fontSize: 12,
                    color: '#fff',
                    background: 'rgba(60,60,62,0.85)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    pointerEvents: 'none',
                    zIndex: 100,
                  }}>
                    {app.name}
                  </div>
                )}

                {/* Icon image */}
                <img
                  src={app.icon}
                  alt={app.name}
                  style={{
                    width: size,
                    height: size,
                    objectFit: 'contain',
                    borderRadius: '22%',
                    display: 'block',
                    boxShadow: '0 4px 12px -2px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                />

                {/* Open indicator dot */}
                {isOpen && (
                  <div style={{
                    position: 'absolute',
                    bottom: -5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.7)',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.Dock = Dock;
