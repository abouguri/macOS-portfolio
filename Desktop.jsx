// =========================================================================
// Desktop.jsx — main composer. Owns windows, selection, spotlight, menubar
// actions. Dock / desktop / spotlight all open through openItem().
// =========================================================================

function Desktop() {
  const [intro, setIntro] = React.useState(() => {
    return sessionStorage.getItem('introSeen') !== '1';
  });
  const [selected, setSelected] = React.useState(null);
  const [windows, setWindows] = React.useState([]);
  const [iconPositions, setIconPositions] = React.useState(() => {
    const map = {};
    (window.PROJECTS || []).forEach(p => { map[p.id] = p.position || { x: 0, y: 0 }; });
    try {
      const saved = JSON.parse(localStorage.getItem('desktopIconPositions') || '{}');
      return { ...map, ...saved };
    } catch {
      return map;
    }
  });

  function onIconPositionChange(id, pos) {
    setIconPositions(prev => {
      const next = { ...prev, [id]: pos };
      try {
        localStorage.setItem('desktopIconPositions', JSON.stringify(next));
      } catch {
        // Non-critical: dragging should still work if storage is unavailable.
      }
      return next;
    });
  }
  const [zCounter, setZCounter] = React.useState(10);
  const [spotOpen, setSpotOpen] = React.useState(false);
  const [spotFilter, setSpotFilter] = React.useState(null);

  function markIntroDone() {
    sessionStorage.setItem('introSeen', '1');
    setIntro(false);
  }

  // Look up a project by id
  function findProject(id) {
    return (window.PROJECTS || []).find((p) => p.id === id);
  }

  // ── Window management ────────────────────────────────────────────────
  function openWindow(spec) {
    // If already open: focus
    const existing = windows.find((w) => w.id === spec.id);
    if (existing) {
      focusWindow(spec.id);
      return;
    }
    const offset = (windows.length % 6) * 30;
    const newZ = zCounter + 1;
    setZCounter(newZ);
    setWindows((ws) => [
      ...ws,
      {
        ...spec,
        z: newZ,
        position: spec.position || { x: 200 + offset, y: 90 + offset },
      },
    ]);
  }

  function closeWindow(id) {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }

  function updateWindowPosition(id, position) {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, position } : w)));
  }

  function focusWindow(id) {
    setWindows((ws) => {
      const next = zCounter + 1;
      setZCounter(next);
      return ws.map((w) => (w.id === id ? { ...w, z: next } : w));
    });
  }

  // ── Single open-anything dispatcher (dock, desktop, spotlight all use it) ──
  function openItem(item) {
    // External link
    if (item.kind === 'link' && item.href) {
      window.open(item.href, '_blank', 'noopener');
      return;
    }
    // Spotlight (Projects dock tile)
    if (item.kind === 'spotlight') {
      setSpotFilter(item.filter || null);
      setSpotOpen(true);
      return;
    }
    // Project (from desktop or spotlight)
    const proj = item.kind === 'project' || item._ref?.kind === 'project'
      ? (item._ref || item)
      : (findProject(item.id) || null);

    if (proj) {
      openWindow({
        id: proj.id,
        title: proj.name,
        kind: 'project',
        size: { w: 820, h: 600 },
        content: <ProjectWindowContent project={proj} />,
      });
      return;
    }

    // Static windows (About, Contact)
    const target = item.target || item.id;
    if (target === 'about') {
      openWindow({
        id: 'about',
        title: 'About',
        kind: 'about',
        size: { w: 520, h: 380 },
        content: <AboutWindowContent />,
      });
      return;
    }
    if (target === 'contact') {
      openWindow({
        id: 'contact',
        title: 'Contact',
        kind: 'contact',
        size: { w: 480, h: 420 },
        content: <ContactWindowContent />,
      });
      return;
    }
  }

  // ── Keyboard shortcuts ───────────────────────────────────────────────
  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSpotFilter(null);
        setSpotOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        if (spotOpen) setSpotOpen(false);
        else setSelected(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        const top = [...windows].sort((a, b) => b.z - a.z)[0];
        if (top) closeWindow(top.id);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [windows, spotOpen, zCounter]);

  // ── Spotlight item set ───────────────────────────────────────────────
  const spotItems = React.useMemo(() => {
    const projs = (window.PROJECTS || []).map((p) => ({
      id: p.id,
      name: p.name,
      icon: p.icon,
      kind: 'project',
      _ref: p,
    }));
    const pages = [
      { id: 'about',   name: 'About',   icon: 'assets/icons/dock/about.svg',    kind: 'page', _ref: { description: 'Background, school, contact' } },
      { id: 'contact', name: 'Contact', icon: 'assets/icons/dock/contact.svg',  kind: 'page', _ref: { description: 'Email and social links' } },
      { id: 'resume',  name: 'Resume',  icon: 'assets/icons/dock/contact.svg',  kind: 'page', _ref: { description: 'Curriculum vitae · PDF' } },
    ];
    const ext = [
      { id: 'github',   name: 'GitHub',   icon: 'assets/icons/dock/github.svg',   kind: 'link', _ref: { href: 'https://github.com/abouguri' } },
      { id: 'linkedin', name: 'LinkedIn', icon: 'assets/icons/dock/linkedin.svg', kind: 'link', _ref: { href: 'https://www.linkedin.com/in/abdelaadim-bougurine' } },
      { id: 'source',   name: 'Portfolio source', icon: 'assets/icons/dock/github.svg', kind: 'link', _ref: { href: 'https://github.com/abouguri' } },
    ];
    return [...projs, ...pages, ...ext];
  }, []);

  function onSpotPick(it) {
    setSpotOpen(false);
    if (it.kind === 'link') {
      window.open(it._ref?.href, '_blank', 'noopener');
      return;
    }
    if (it.kind === 'project') {
      openItem({ kind: 'project', _ref: it._ref });
      return;
    }
    if (it.kind === 'page') {
      openItem({ target: it.id });
    }
  }

  // ── Menu bar actions ─────────────────────────────────────────────────
  function handleMenuAction(it) {
    switch (it.action) {
      case 'open':
        openItem({ target: it.target });
        break;
      case 'spotlight':
        setSpotFilter(null);
        setSpotOpen(true);
        break;
      case 'random-project': {
        const all = window.PROJECTS || [];
        const random = all[Math.floor(Math.random() * all.length)];
        if (random) openItem({ kind: 'project', _ref: random });
        break;
      }
      case 'close-top': {
        const top = [...windows].sort((a, b) => b.z - a.z)[0];
        if (top) closeWindow(top.id);
        break;
      }
      case 'focus-window':
        if (it.target) focusWindow(it.target);
        break;
      case 'link':
        if (it.href) window.open(it.href, '_blank', 'noopener');
        break;
      case 'list-windows':
        // no-op: the dropdown itself is the list
        break;
      default:
        break;
    }
  }

  const topWindow = windows.length
    ? windows.reduce((a, b) => (b.z > a.z ? b : a))
    : null;
  const activeAppName = topWindow ? topWindow.title : 'abouguri';

  function onDesktopMouseDown() {
    setSelected(null);
  }

  return (
    <FabricBackground>
      {intro && <IntroAnimation onDone={markIntroDone} />}

      <MenuBar
        activeApp={activeAppName}
        openWindows={windows}
        onAction={handleMenuAction}
        onSpotlight={() => { setSpotFilter(null); setSpotOpen(true); }}
      />

      <div className="desktop" onMouseDown={onDesktopMouseDown}>
        {/* center monogram */}
        <img className="desktop-monogram" src="assets/monogram.svg" alt="" />

        <div className="desktop-icons-layer">
          {(window.PROJECTS || []).map((p) => (
            <DesktopIcon
              key={p.id}
              project={p}
              position={iconPositions[p.id]}
              selected={selected === p.id}
              onSelect={setSelected}
              onOpen={(proj) => openItem({ kind: 'project', _ref: proj })}
              onPositionChange={onIconPositionChange}
            />
          ))}
        </div>

        {/* windows */}
        {windows.map((w) => (
          <Window
            key={w.id}
            win={w}
            zIndex={w.z}
            focused={topWindow && topWindow.id === w.id}
            onFocus={focusWindow}
            onClose={closeWindow}
            onPositionChange={updateWindowPosition}
          />
        ))}
      </div>

      <Spotlight
        open={spotOpen}
        onClose={() => setSpotOpen(false)}
        onPick={onSpotPick}
        items={spotItems}
        initialFilter={spotFilter}
      />

      <Dock
        apps={window.DOCK_APPS}
        onAppClick={openItem}
        openIds={windows.map((w) => w.id)}
      />
    </FabricBackground>
  );
}

window.Desktop = Desktop;
