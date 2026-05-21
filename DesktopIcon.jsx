// =========================================================================
// DesktopIcon.jsx — desktop icon, organic positioning, contributor badge
// =========================================================================

function DesktopIcon({ project, selected, onSelect, onOpen }) {
  // position is { x, y } in px relative to viewport center. Falls back to
  // the original CSS left/top format if present.
  const style = project.position && typeof project.position.x === 'number'
    ? {
        left: `calc(50% + ${project.position.x}px - 42px)`,
        top:  `calc(50% + ${project.position.y}px - 50px)`,
      }
    : {
        left: project.position?.left,
        top:  project.position?.top,
      };

  const isContrib = project.role === 'Contributor';

  return (
    <div
      className={`d-icon ${selected ? 'selected' : ''}`}
      style={style}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect && onSelect(project.id);
      }}
      onClick={(e) => {
        // single click on already-selected → open (closer to mobile-friendly)
        if (selected) {
          e.stopPropagation();
          onOpen && onOpen(project);
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen && onOpen(project);
      }}
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
