// =========================================================================
// DesktopIcon.jsx — draggable desktop icon with contributor badge
// Drag: mousedown → move > 5px → free drag; mouseup → save position
// Click: first click selects, second click on selected opens
// Double-click: always opens
// =========================================================================

function DesktopIcon({ project, position, selected, onSelect, onOpen, onPositionChange }) {
  const [dragPos, setDragPos] = React.useState(null);
  const drag = React.useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0, hasMoved: false });

  const currentPos = dragPos || position || { x: 0, y: 0 };
  const isDragging = !!dragPos;
  const isContrib = project.role === 'Contributor';

  function handleMouseDown(e) {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    const wasSelected = selected;
    const orig = position || { x: 0, y: 0 };

    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: orig.x,
      origY: orig.y,
      hasMoved: false,
    };

    onSelect && onSelect(project.id);

    function onMove(ev) {
      if (!drag.current.active) return;
      const dx = ev.clientX - drag.current.startX;
      const dy = ev.clientY - drag.current.startY;
      if (!drag.current.hasMoved && Math.hypot(dx, dy) < 5) return;
      drag.current.hasMoved = true;
      setDragPos({ x: drag.current.origX + dx, y: drag.current.origY + dy });
    }

    function onUp(ev) {
      if (!drag.current.active) return;
      drag.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);

      if (drag.current.hasMoved) {
        const dx = ev.clientX - drag.current.startX;
        const dy = ev.clientY - drag.current.startY;
        const newPos = { x: drag.current.origX + dx, y: drag.current.origY + dy };
        setDragPos(null);
        onPositionChange && onPositionChange(project.id, newPos);
      } else {
        setDragPos(null);
        if (wasSelected) onOpen && onOpen(project);
      }
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function handleDoubleClick(e) {
    e.stopPropagation();
    onOpen && onOpen(project);
  }

  return (
    <div
      className={`d-icon ${selected ? 'selected' : ''}`}
      style={{
        left: `calc(50% + ${currentPos.x}px - 42px)`,
        top:  `calc(50% + ${currentPos.y}px - 50px)`,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: isDragging ? 999 : undefined,
        transform: isDragging ? 'scale(1.08)' : undefined,
        filter: isDragging ? 'brightness(1.12)' : undefined,
        transition: isDragging ? 'none' : undefined,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      title={project.tagline || project.name}
    >
      <div className="d-icon-img-wrap">
        <img src={project.icon} alt="" className="d-icon-img" />
        {isContrib && (
          <div className="d-icon-badge" title="Contributor">
            <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 8.5 L8.5 3.5"/>
              <path d="M4 3.5 H8.5 V8"/>
            </svg>
          </div>
        )}
      </div>
      <div className="d-icon-label">{project.name}</div>
    </div>
  );
}

window.DesktopIcon = DesktopIcon;
