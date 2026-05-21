// =========================================================================
// MenuBar.jsx — wired dropdowns, click handlers, real menu actions
// =========================================================================

function MenuBar({ activeApp, openWindows, onAction, onSpotlight }) {
  const [now, setNow] = React.useState(new Date());
  const [openMenu, setOpenMenu] = React.useState(null);

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    function onDocDown(e) {
      // close menus on outside click
      if (!e.target.closest('.mb-menu')) setOpenMenu(null);
    }
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, []);

  const timeStr = now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  // Build dynamic Window menu items
  const dynamicWindowItems = openWindows && openWindows.length
    ? openWindows.map((w) => ({ label: w.title, action: 'focus-window', target: w.id }))
    : [{ label: 'No open windows', disabled: true }];

  function renderMenu(m) {
    let items = m.items;
    if (m.name === 'Window') {
      items = [...dynamicWindowItems];
    }
    return (
      <div className="mb-dropdown" onMouseDown={(e) => e.stopPropagation()}>
        {items.map((it, i) => {
          if (it === '—') return <div key={i} className="mb-divider"/>;
          return (
            <div
              key={i}
              className={`mb-item ${it.disabled ? 'disabled' : ''}`}
              onMouseDown={() => {
                if (it.disabled) return;
                setOpenMenu(null);
                if (it.action) onAction && onAction(it);
              }}
            >
              <span>{it.label}</span>
              {it.shortcut && <span className="mb-item-shortcut">{it.shortcut}</span>}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="menubar">
      <svg className="mb-apple" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 1.3c.1 1.5-.5 2.9-1.4 3.9-.9 1-2.4 1.7-3.7 1.6-.2-1.4.5-2.9 1.4-3.8.9-1 2.4-1.7 3.7-1.7zM21 17.7c-.4 1.3-.9 2.4-1.7 3.5-1 1.5-2.4 3.3-4.2 3.3-1.6 0-2-1-4.2-1-2.1 0-2.6 1-4.2 1-1.8 0-3.1-1.6-4.1-3.1-2.8-4.3-3.1-9.4-1.4-12.1 1.2-1.9 3.2-3 5-3 1.6 0 3.1.9 4.1.9 1 0 2.7-1 4.5-.9.8 0 3 .3 4.4 2.4-.1.1-2.6 1.5-2.6 4.5 0 3.6 3.1 4.8 3.1 4.9-.1 0-.2.2-.7.6z"/>
      </svg>
      {window.MENU_STRUCTURE.map((m) => (
        <div
          key={m.name}
          className={`mb-menu ${m.primary ? 'primary' : ''} ${openMenu === m.name ? 'open' : ''}`}
          onMouseDown={(e) => {
            e.stopPropagation();
            setOpenMenu(openMenu === m.name ? null : m.name);
          }}
          onMouseEnter={() => { if (openMenu) setOpenMenu(m.name); }}
        >
          {m.primary ? (activeApp || m.name) : m.name}
          {openMenu === m.name && renderMenu(m)}
        </div>
      ))}
      <div className="mb-spacer"></div>
      <div className="mb-right">
        {/* battery */}
        <div className="mb-glyph mb-battery">
          <svg viewBox="0 0 26 12">
            <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1"/>
            <rect x="23" y="3.5" width="1.5" height="5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="2" width="16" height="8" rx="1.2" fill="currentColor"/>
          </svg>
          <span className="mb-battery-pct">82%</span>
        </div>
        {/* wifi */}
        <svg className="mb-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 12.5 a 2 2 0 0 1 0 -3 a 8 8 0 0 1 14 0 a 2 2 0 0 1 0 3"/>
          <path d="M8.5 15 a 4 4 0 0 1 7 0"/>
          <circle cx="12" cy="18.2" r="1" fill="currentColor"/>
        </svg>
        {/* spotlight */}
        <button className="mb-glyph mb-search" onClick={onSpotlight} aria-label="Spotlight">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="6"/>
            <path d="m20 20 -4 -4"/>
          </svg>
        </button>
        <div className="mb-clock" title={dateStr}>{dateStr} &nbsp; {timeStr}</div>
      </div>
    </div>
  );
}

window.MenuBar = MenuBar;
