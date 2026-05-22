// =========================================================================
// Window.jsx — single draggable window with traffic-light chrome
// =========================================================================

function TrafficLights({ onClose, onMinimize, onMaximize }) {
  return (
    <div className="tl-group">
      <button
        className="tl tl-red"
        onClick={(e) => { e.stopPropagation(); onClose && onClose(); }}
        aria-label="Close"
      >
        <svg viewBox="0 0 8 8"><path d="M1.5 1.5 L6.5 6.5 M6.5 1.5 L1.5 6.5" stroke="#5a0e0a" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </button>
      <button
        className="tl tl-yel"
        onClick={(e) => { e.stopPropagation(); onMinimize && onMinimize(); }}
        aria-label="Minimize"
      >
        <svg viewBox="0 0 8 8"><path d="M1.5 4 L6.5 4" stroke="#7a4d00" strokeWidth="1.4" strokeLinecap="round"/></svg>
      </button>
      <button
        className="tl tl-grn"
        onClick={(e) => { e.stopPropagation(); onMaximize && onMaximize(); }}
        aria-label="Maximize"
      >
        <svg viewBox="0 0 8 8"><path d="M1.5 4 L6.5 4 M4 1.5 L4 6.5" stroke="#0d4f1f" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

function Window({
  win,
  zIndex,
  focused,
  onFocus,
  onClose,
  onPositionChange,
}) {
  const [pos, setPos] = React.useState(win.position || { x: 200, y: 90 });
  const [size] = React.useState(win.size || { w: 720, h: 480 });
  const [maximized, setMaximized] = React.useState(false);
  const [opening, setOpening] = React.useState(true);
  const [closing, setClosing] = React.useState(false);
  const posRef = React.useRef(pos);

  React.useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  React.useEffect(() => {
    const t = setTimeout(() => setOpening(false), 280);
    return () => clearTimeout(t);
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(() => onClose && onClose(win.id), 220);
  }

  function toggleMaximize() {
    onFocus && onFocus(win.id);
    setMaximized((v) => !v);
  }

  // drag
  const dragRef = React.useRef({ active: false, dx: 0, dy: 0 });
  function onTitlebarDown(e) {
    if (e.button !== 0) return;
    if (e.detail === 2) {
      toggleMaximize();
      return;
    }
    if (maximized) return;
    onFocus && onFocus(win.id);
    dragRef.current = {
      active: true,
      dx: e.clientX - pos.x,
      dy: e.clientY - pos.y,
    };
    function move(ev) {
      if (!dragRef.current.active) return;
      const margin = 16;
      const nx = Math.min(
        window.innerWidth - margin,
        Math.max(-size.w + 96, ev.clientX - dragRef.current.dx)
      );
      const ny = Math.min(
        window.innerHeight - 60,
        Math.max(28, ev.clientY - dragRef.current.dy)
      );
      const next = { x: nx, y: ny };
      posRef.current = next;
      setPos(next);
    }
    function up() {
      dragRef.current.active = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      onPositionChange && onPositionChange(win.id, posRef.current);
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  const transformClass = opening ? 'win-opening' : closing ? 'win-closing' : '';
  const frameStyle = maximized
    ? {
        left: 10,
        top: 38,
        width: 'calc(100vw - 20px)',
        height: 'calc(100vh - 122px)',
        zIndex,
      }
    : {
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex,
      };

  return (
    <div
      className={`win-root ${transformClass} ${focused ? 'win-focused' : 'win-unfocused'} ${maximized ? 'win-maximized' : ''}`}
      style={frameStyle}
      onMouseDown={() => onFocus && onFocus(win.id)}
    >
      <div className="win-titlebar" onMouseDown={onTitlebarDown}>
        <TrafficLights
          onClose={handleClose}
          onMinimize={handleClose}
          onMaximize={toggleMaximize}
        />
        <div className="win-title">{win.title}</div>
      </div>
      <div className="win-body">{win.content}</div>
    </div>
  );
}

window.Window = Window;
window.TrafficLights = TrafficLights;
