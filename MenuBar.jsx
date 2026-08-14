// =========================================================================
// MenuBar.jsx — wired dropdowns, click handlers, real menu actions
// =========================================================================

function Switch({ on, onToggle }) {
  return (
    <button className={`sw ${on ? 'on' : ''}`} onClick={onToggle} aria-label="Toggle">
      <span className="sw-knob"></span>
    </button>
  );
}

function CCSlider({ value, onChange, icon }) {
  const ref = React.useRef(null);
  function set(e) {
    const rect = ref.current.getBoundingClientRect();
    onChange(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
  }
  function down(e) {
    e.preventDefault();
    set(e);
    function mv(ev) { set(ev); }
    function up() { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); }
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
  }
  return (
    <div ref={ref} className="cc-slider" onMouseDown={down}>
      <div className="cc-slider-fill" style={{ width: `${value * 100}%` }}></div>
      <span className="cc-slider-icon">{icon}</span>
    </div>
  );
}

function WifiGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M5 12.5 a 2 2 0 0 1 0 -3 a 8 8 0 0 1 14 0 a 2 2 0 0 1 0 3"/>
      <path d="M8.5 15 a 4 4 0 0 1 7 0"/>
      <circle cx="12" cy="18.2" r="1" fill="currentColor"/>
    </svg>
  );
}

function MenuBar({ activeApp, openWindows, onAction, onSpotlight, prefs = {} }) {
  const [now, setNow] = React.useState(new Date());
  const [openMenu, setOpenMenu] = React.useState(null);
  const [openPanel, setOpenPanel] = React.useState(null); // 'wifi' | 'cc' | 'battery'
  const [wifiOn, setWifiOn] = React.useState(true);
  const [btOn, setBtOn] = React.useState(true);
  const [focusOn, setFocusOn] = React.useState(false);
  const [brightness, setBrightness] = React.useState(1);
  const [volume, setVolume] = React.useState(0.6);

  function togglePanel(name) {
    setOpenMenu(null);
    setOpenPanel((p) => (p === name ? null : name));
  }

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    function onDocDown(e) {
      // close menus on outside click
      if (!e.target.closest('.mb-menu')) setOpenMenu(null);
      if (!e.target.closest('.mb-popover') && !e.target.closest('.mb-glyph-btn')) setOpenPanel(null);
    }
    function onKey(e) {
      if (e.key === 'Escape') { setOpenMenu(null); setOpenPanel(null); }
    }
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
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
          const checked = it.toggle ? !!prefs[it.toggle] : it.radio ? prefs[it.radio] === it.value : false;
          return (
            <div
              key={i}
              className={`mb-item ${it.disabled ? 'disabled' : ''} ${it.toggle || it.radio ? 'checkable' : ''}`}
              onMouseDown={() => {
                if (it.disabled) return;
                // A toggle keeps its menu open so the tick is visible.
                if (!it.toggle && !it.radio) setOpenMenu(null);
                if (it.action) onAction && onAction(it);
              }}
            >
              <span className="mb-item-main">
                {(it.toggle || it.radio) && <span className="mb-check">{checked ? '✓' : ''}</span>}
                <span>{it.label}</span>
              </span>
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
        <div role="button" tabIndex={0} className={`mb-glyph-btn ${openPanel === 'battery' ? 'open' : ''}`} onClick={() => togglePanel('battery')} aria-label="Battery">
          <svg viewBox="0 0 26 12" style={{ width: 26, height: 12 }}>
            <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1"/>
            <rect x="23" y="3.5" width="1.5" height="5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="2" width="16" height="8" rx="1.2" fill="currentColor"/>
          </svg>
          <span className="mb-battery-pct">82%</span>
          {openPanel === 'battery' && (
            <div className="mb-popover" onClick={(e) => e.stopPropagation()}>
              <div className="pop-title">Battery <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>82%</span></div>
              <div className="pop-footer" style={{ paddingTop: 0 }}>Power Source: Battery</div>
              <div className="pop-divider"></div>
              <div className="pop-footer">No apps using significant energy</div>
            </div>
          )}
        </div>
        {/* wifi */}
        <div role="button" tabIndex={0} className={`mb-glyph-btn ${openPanel === 'wifi' ? 'open' : ''}`} onClick={() => togglePanel('wifi')} aria-label="Wi-Fi">
          <WifiGlyph style={{ width: 18, height: 15, opacity: wifiOn ? 1 : 0.45 }}/>
          {openPanel === 'wifi' && (
            <div className="mb-popover" onClick={(e) => e.stopPropagation()}>
              <div className="pop-title">Wi-Fi <Switch on={wifiOn} onToggle={() => setWifiOn(v => !v)}/></div>
              {wifiOn && (
                <React.Fragment>
                  <div className="pop-row">
                    <span className="pop-row-icon on"><WifiGlyph/></span>
                    <span className="pop-row-name">Home Fiber<div className="pop-row-sub">Connected · Secured</div></span>
                    <span className="pop-check">✓</span>
                  </div>
                  <div className="pop-divider"></div>
                  <div className="pop-footer" style={{ paddingBottom: 4 }}>Other Networks</div>
                  <div className="pop-row">
                    <span className="pop-row-icon"><WifiGlyph/></span>
                    <span className="pop-row-name">1337-Guest</span>
                  </div>
                  <div className="pop-row">
                    <span className="pop-row-icon"><WifiGlyph/></span>
                    <span className="pop-row-name">Chez_Vous_5G</span>
                  </div>
                </React.Fragment>
              )}
              {!wifiOn && <div className="pop-footer">Wi-Fi is off</div>}
            </div>
          )}
        </div>
        {/* spotlight */}
        <button className="mb-glyph mb-search" onClick={onSpotlight} aria-label="Spotlight">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="6"/>
            <path d="m20 20 -4 -4"/>
          </svg>
        </button>
        {/* control center */}
        <div role="button" tabIndex={0} className={`mb-glyph-btn ${openPanel === 'cc' ? 'open' : ''}`} onClick={() => togglePanel('cc')} aria-label="Control Center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 15, height: 15 }}>
            <rect x="3" y="4.5" width="18" height="6.5" rx="3.25"/>
            <circle cx="7" cy="7.75" r="2" fill="currentColor" stroke="none"/>
            <rect x="3" y="13" width="18" height="6.5" rx="3.25"/>
            <circle cx="17" cy="16.25" r="2" fill="currentColor" stroke="none"/>
          </svg>
          {openPanel === 'cc' && (
            <div className="mb-popover cc-pop" onClick={(e) => e.stopPropagation()}>
              <div className="cc-grid">
                <div className="cc-tile">
                  <div className="cc-tile-row" onClick={() => setWifiOn(v => !v)} style={{ cursor: 'default' }}>
                    <span className={`pop-row-icon ${wifiOn ? 'on' : ''}`}><WifiGlyph/></span>
                    <span><div className="cc-tile-name">Wi-Fi</div><div className="cc-tile-sub">{wifiOn ? 'Home Fiber' : 'Off'}</div></span>
                  </div>
                  <div className="cc-tile-row" onClick={() => setBtOn(v => !v)} style={{ cursor: 'default' }}>
                    <span className={`pop-row-icon ${btOn ? 'on' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7.5 L17 16.5 L12 21 V3 L17 7.5 L7 16.5"/></svg>
                    </span>
                    <span><div className="cc-tile-name">Bluetooth</div><div className="cc-tile-sub">{btOn ? 'On' : 'Off'}</div></span>
                  </div>
                </div>
                <div className="cc-tile">
                  <div className="cc-tile-row" onClick={() => setFocusOn(v => !v)} style={{ cursor: 'default' }}>
                    <span className={`pop-row-icon ${focusOn ? 'on' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 15.5A6.5 6.5 0 1 1 18.5 12 6.5 6.5 0 0 1 12 18.5z" opacity="0.5"/><circle cx="12" cy="12" r="3.5"/></svg>
                    </span>
                    <span><div className="cc-tile-name">Focus</div><div className="cc-tile-sub">{focusOn ? 'Do Not Disturb' : 'Off'}</div></span>
                  </div>
                  <div className="cc-tile-sub" style={{ paddingLeft: 2 }}>Reviewing this portfolio counts as deep work.</div>
                </div>
                <div className="cc-tile cc-slider-tile">
                  <div className="cc-slider-label">Display</div>
                  <CCSlider value={brightness} onChange={setBrightness} icon={
                    <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  }/>
                </div>
                <div className="cc-tile cc-slider-tile">
                  <div className="cc-slider-label">Sound</div>
                  <CCSlider value={volume} onChange={setVolume} icon={
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  }/>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mb-clock" title={dateStr}>{dateStr} &nbsp; {timeStr}</div>
      </div>
      {brightness < 0.999 && (
        <div className="brightness-veil" style={{ opacity: (1 - brightness) * 0.72 }}></div>
      )}
    </div>
  );
}

window.MenuBar = MenuBar;
