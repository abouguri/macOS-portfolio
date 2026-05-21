// =========================================================================
// Dock.jsx — bottom glass dock with cursor magnification + tooltips
// =========================================================================

function Dock({ apps, onAppClick, openIds = [] }) {
  const [mouseX, setMouseX] = React.useState(null);
  const dockRef = React.useRef(null);
  const [hovered, setHovered] = React.useState(null);

  function onMove(e) {
    if (!dockRef.current) return;
    const r = dockRef.current.getBoundingClientRect();
    setMouseX(e.clientX - r.left);
  }

  function onLeave() {
    setMouseX(null);
    setHovered(null);
  }

  function magScale(centerX) {
    if (mouseX == null) return 1;
    const d = Math.abs(centerX - mouseX);
    const max = 90; // influence range
    if (d > max) return 1;
    const t = 1 - d / max;
    return 1 + t * 0.5; // 1.0 → 1.5
  }

  function magLift(centerX) {
    if (mouseX == null) return 0;
    const d = Math.abs(centerX - mouseX);
    const max = 90;
    if (d > max) return 0;
    const t = 1 - d / max;
    return -t * 16;
  }

  const ICON = 54;
  const GAP = 8;

  return (
    <div className="dock-wrap">
      <div
        className="dock"
        ref={dockRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {apps.map((app, i) => {
          // center x of this icon within the dock
          const centerX = 10 + ICON / 2 + i * (ICON + GAP);
          const scale = magScale(centerX);
          const lift = magLift(centerX);
          const open = openIds.includes(app.id);
          return (
            <div key={app.id} className="dock-item">
              {hovered === app.id && (
                <div
                  className="dock-tooltip"
                  style={{ bottom: `${ICON * scale + 14 - lift}px` }}
                >
                  {app.name}
                </div>
              )}
              <img
                src={app.icon}
                alt={app.name}
                className="dock-icon"
                style={{
                  width: ICON,
                  height: ICON,
                  transform: `translateY(${lift}px) scale(${scale})`,
                  transformOrigin: 'bottom center',
                }}
                onClick={() => onAppClick && onAppClick(app)}
                onMouseEnter={() => setHovered(app.id)}
              />
              <div className={`dock-dot ${open ? 'on' : ''}`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.Dock = Dock;
