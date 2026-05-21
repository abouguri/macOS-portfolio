// =========================================================================
// Dock.jsx — authentic macOS cosine magnification, GPU-smooth
//
// The animation loop writes directly to DOM via iconRefs — no setState
// on every frame. React only re-renders for hover (tooltip) changes.
// useLayoutEffect sets initial geometry before first paint (no flash).
// =========================================================================

function Dock({ apps, onAppClick, openIds = [] }) {
  const [hovered, setHovered] = React.useState(null);

  const wrapRef     = React.useRef(null);   // the glass pill
  const innerRef    = React.useRef(null);   // relative icon container
  const iconRefs    = React.useRef([]);
  const mouseXRef   = React.useRef(null);
  const configRef   = React.useRef(null);
  const lastMove    = React.useRef(0);

  // ── Config (responsive) ──────────────────────────────────────────────
  function computeConfig() {
    const dim = Math.min(window.innerWidth, window.innerHeight);
    if (dim < 480)  return { base: Math.max(40, dim * 0.08), maxScale: 1.4, fx: dim * 0.40 };
    if (dim < 768)  return { base: Math.max(48, dim * 0.07), maxScale: 1.5, fx: dim * 0.35 };
    if (dim < 1024) return { base: Math.max(56, dim * 0.06), maxScale: 1.6, fx: dim * 0.30 };
    return { base: Math.max(64, Math.min(80, dim * 0.05)), maxScale: 1.8, fx: 300 };
  }

  function sp(base) { return Math.max(4, base * 0.08); }
  function pad(base) { return Math.max(8, base * 0.12); }

  // ── Set geometry before first paint ──────────────────────────────────
  React.useLayoutEffect(() => {
    const cfg = computeConfig();
    configRef.current = cfg;
    const { base } = cfg;
    const spacing = sp(base);
    const padding = pad(base);

    let x = 0;
    apps.forEach((_, i) => {
      const el = iconRefs.current[i];
      if (!el) return;
      el.style.left   = `${x}px`;
      el.style.width  = `${base}px`;
      el.style.height = `${base}px`;
      x += base + spacing;
    });

    const totalW = x - spacing;
    if (innerRef.current) innerRef.current.style.height = `${base}px`;
    if (wrapRef.current)  wrapRef.current.style.width   = `${totalW + padding * 2}px`;
  }, [apps.length]);

  // ── Resize handler ───────────────────────────────────────────────────
  React.useEffect(() => {
    configRef.current = computeConfig();
    function onResize() { configRef.current = computeConfig(); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Animation loop — pure DOM mutation, zero setState ────────────────
  React.useEffect(() => {
    const n = apps.length;
    const scales = new Float32Array(n).fill(1.0);

    let rafId;
    function animate() {
      const { base, maxScale, fx } = configRef.current || computeConfig();
      const spacing = sp(base);
      const padding = pad(base);
      const mX  = mouseXRef.current;
      const lerp = mX !== null ? 0.20 : 0.10;

      let x = 0;
      for (let i = 0; i < n; i++) {
        // Target scale — cosine curve, based on resting (un-magnified) centers
        let target = 1.0;
        if (mX !== null) {
          const center = i * (base + spacing) + base / 2;
          const lo = mX - fx / 2;
          const hi = mX + fx / 2;
          if (center >= lo && center <= hi) {
            const theta = ((center - lo) / fx) * 2 * Math.PI;
            target = 1.0 + ((1 - Math.cos(theta)) / 2) * (maxScale - 1.0);
          }
        }

        scales[i] += (target - scales[i]) * lerp;
        const sc = scales[i];
        const w  = base * sc;

        const el = iconRefs.current[i];
        if (el) {
          el.style.left   = `${x}px`;
          el.style.width  = `${w}px`;
          el.style.height = `${w}px`;
          el.style.zIndex = (sc * 10) | 0;
        }
        x += w + spacing;
      }

      // Resize the pill to fit magnified icons
      const totalW = x - spacing;
      if (wrapRef.current) wrapRef.current.style.width = `${totalW + padding * 2}px`;

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [apps.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mouse handlers ───────────────────────────────────────────────────
  function handleMouseMove(e) {
    const now = performance.now();
    if (now - lastMove.current < 8) return;   // ~120 fps cap
    lastMove.current = now;
    if (!wrapRef.current) return;
    const rect    = wrapRef.current.getBoundingClientRect();
    const padding = pad(configRef.current?.base || 64);
    mouseXRef.current = e.clientX - rect.left - padding;
  }

  function handleMouseLeave() {
    mouseXRef.current = null;
    setHovered(null);
  }

  // ── Bounce on click ──────────────────────────────────────────────────
  function handleClick(app, i) {
    const el = iconRefs.current[i];
    if (el) {
      const h = -((configRef.current?.base || 64) * 0.15);
      el.style.transition = 'transform 0.15s cubic-bezier(0.32,0.72,0,1)';
      el.style.transform  = `translateY(${h}px)`;
      setTimeout(() => {
        el.style.transform = 'translateY(0)';
        setTimeout(() => { el.style.transition = ''; }, 150);
      }, 150);
    }
    onAppClick && onAppClick(app);
  }

  // ── Static layout values for JSX (animation loop takes over at runtime) ──
  const cfg     = configRef.current || computeConfig();
  const base    = cfg.base;
  const padding = pad(base);
  const radius  = Math.max(16, base * 0.35);
  const initW   = apps.length * (base + sp(base)) - sp(base);

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      zIndex: 50, pointerEvents: 'none',
    }}>
      <div
        ref={wrapRef}
        style={{
          pointerEvents: 'auto',
          width: `${initW + padding * 2}px`,      /* rAF updates this */
          padding: `${padding}px`,
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
        {/* height set by useLayoutEffect; icons are absolute children */}
        <div ref={innerRef} style={{ position: 'relative', height: `${base}px` }}>
          {apps.map((app, i) => {
            const isOpen    = openIds.includes(app.id);
            const isHovered = hovered === app.id;

            return (
              <div
                key={app.id}
                ref={el => { iconRefs.current[i] = el; }}
                style={{
                  /* left / width / height intentionally OMITTED from JSX —
                     the rAF loop owns them; React will never overwrite them. */
                  position: 'absolute',
                  bottom: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
                onClick={() => handleClick(app, i)}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Tooltip — 110% sits above the icon regardless of its magnified size */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: '110%',
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
                    marginBottom: 6,
                  }}>
                    {app.name}
                  </div>
                )}

                <img
                  src={app.icon}
                  alt={app.name}
                  draggable="false"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '22%',
                    display: 'block',
                    boxShadow: '0 4px 12px -2px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.3)',
                    pointerEvents: 'none',
                  }}
                />

                {isOpen && (
                  <div style={{
                    position: 'absolute',
                    bottom: -5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4, height: 4,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.7)',
                    pointerEvents: 'none',
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
