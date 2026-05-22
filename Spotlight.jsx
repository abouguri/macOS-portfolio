// =========================================================================
// Spotlight.jsx — ⌘K search with grouped results (Projects / Pages / External)
// Searches by name, tagline, type, AND stack tags (so "rabbit" finds
// Transcendence via "RabbitMQ").
// =========================================================================

function SpotlightIcon({ src }) {
  return <img src={src} alt="" />;
}

function Spotlight({ open, onClose, onPick, items, initialFilter }) {
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);
  const resultsRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    }
  }, [open]);

  // Build searchable haystack per item
  const indexed = React.useMemo(() => {
    return items.map((it) => {
      const r = it._ref || {};
      const stack = (r.stack || []).join(' ');
      const haystack = [
        it.name,
        r.tagline || '',
        r.type || '',
        r.role || '',
        stack,
      ].join(' ').toLowerCase();
      return { ...it, _haystack: haystack };
    });
  }, [items]);

  const filtered = React.useMemo(() => {
    let pool = indexed;
    if (initialFilter === 'project') {
      pool = pool.filter((it) => it.kind === 'project');
    }
    if (!q) return pool.slice(0, 10);
    const needle = q.toLowerCase();
    return pool
      .filter((it) =>
        it._haystack.includes(needle) ||
        it.name.toLowerCase().includes(needle)
      )
      .slice(0, 10);
  }, [q, indexed, initialFilter]);

  // Group results
  const groups = React.useMemo(() => {
    const g = { Projects: [], Pages: [], External: [] };
    filtered.forEach((it) => {
      if (it.kind === 'project') g.Projects.push(it);
      else if (it.kind === 'link') g.External.push(it);
      else g.Pages.push(it);
    });
    // Flatten with group markers for index-based selection
    const flat = [];
    Object.entries(g).forEach(([name, arr]) => {
      if (arr.length === 0) return;
      flat.push({ kind: 'group', name });
      arr.forEach((it) => flat.push({ kind: 'item', it }));
    });
    return flat;
  }, [filtered]);

  const selectableCount = filtered.length;

  function onKey(e) {
    if (e.key === 'Escape') { onClose && onClose(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, Math.max(0, selectableCount - 1))); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[sel];
      if (target) onPick && onPick(target);
    }
  }

  if (!open) return null;

  return (
    <div className="spot-overlay" onMouseDown={onClose}>
      <div
        className="spot-panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="spot-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="6"/>
            <path d="m20 20 -4 -4"/>
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            placeholder={
              initialFilter === 'project'
                ? 'Search projects — try "rabbit", "next.js", "C++"…'
                : 'Search projects, pages, links — try "rabbit"…'
            }
          />
          <span className="spot-kbd">esc</span>
        </div>
        <div className="spot-results" ref={resultsRef}>
          {filtered.length === 0 && (
            <div className="spot-empty">No results for "{q}"</div>
          )}
          {(() => {
            let itemCounter = -1;
            return groups.map((g, gi) => {
              if (g.kind === 'group') {
                return <div key={`grp-${g.name}`} className="spot-group-label">{g.name}</div>;
              }
              itemCounter += 1;
              const selectableIndex = itemCounter;
              const it = g.it;
              const isSel = sel === selectableIndex;
              const r = it._ref || {};
              const sub = it.kind === 'project'
                ? (r.role + ' · ' + r.year + ' · ' + r.type)
                : (it.kind === 'link' ? (r.href || '').replace(/^https?:\/\//, '') : (r.description || ''));
              return (
                <div
                  key={it.id + '-' + it.kind}
                  className={`spot-result ${isSel ? 'sel' : ''}`}
                  onMouseEnter={() => setSel(selectableIndex)}
                  onMouseDown={() => onPick && onPick(it)}
                >
                  <SpotlightIcon src={it.icon} />
                  <div className="spot-name-wrap">
                    <div className="spot-name-line">
                      <span className="spot-name">{it.name}</span>
                      {it.kind === 'project' && r.role && (
                        <span className="spot-tag">{r.role}</span>
                      )}
                    </div>
                    <div className="spot-sub">{sub}</div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}

window.Spotlight = Spotlight;
