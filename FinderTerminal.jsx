// =========================================================================
// FinderTerminal.jsx — the Finder-style project browser and the Terminal.
// Both are window contents; Desktop mounts them via openItem().
// =========================================================================
// Finder-style project browser — sidebar of favorites + all projects,
// content pane switches in place like a real Finder window.
// =========================================================================

function FinderProjectContent({ initialId, onRetitle }) {
  const [view, setView] = React.useState({ kind: 'project', id: initialId });
  const projects = window.PROJECTS || [];
  function pick(v, title) {
    setView(v);
    onRetitle && onRetitle(title);
  }
  const proj = view.kind === 'project' ? projects.find((p) => p.id === view.id) : null;
  return (
    <div className="finder-root">
      <div className="finder-sidebar">
        <div className="finder-group-label">Favorites</div>
        <div className={`finder-item ${view.kind === 'about' ? 'active' : ''}`} onClick={() => pick({ kind: 'about' }, 'About')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5" strokeLinecap="round"/></svg>
          <span>About me</span>
        </div>
        <div className={`finder-item ${view.kind === 'contact' ? 'active' : ''}`} onClick={() => pick({ kind: 'contact' }, 'Contact')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
          <span>Contact</span>
        </div>
        <div className="finder-group-label">Projects</div>
        {projects.map((p) => (
          <div key={p.id} className={`finder-item ${view.kind === 'project' && view.id === p.id ? 'active' : ''}`} onClick={() => pick({ kind: 'project', id: p.id }, p.name)}>
            <img src={p.icon} alt="" draggable="false"/>
            <span>{p.shortName || p.name}</span>
          </div>
        ))}
      </div>
      <div className="finder-main">
        {proj && <ProjectWindowContent project={proj}/>}
        {view.kind === 'about' && <AboutWindowContent/>}
        {view.kind === 'contact' && <ContactWindowContent/>}
      </div>
    </div>
  );
}

// =========================================================================
// Terminal — types `show tech stack`, then prints the aggregated stack
// from data.js the way a CLI table would.
// =========================================================================

const TERM_STACK = [
  ['Languages', 'C , C++ , Kotlin , Dart , TypeScript , Python , C#'],
  ['Frontend',  'React 19 , Next.js 14 / 15 , Flutter , Tailwind CSS v4 , TanStack Query / Virtual , Framer Motion , MapLibre'],
  ['Backend',   'Node.js , Fastify , ASP.NET Core , FastAPI'],
  ['Data',      'PostgreSQL , Supabase , SQLAlchemy , Alembic , MySQL , BigQuery , SQLite , Redis , IndexedDB / Dexie'],
  ['DevOps',    'Docker Compose , ARQ , MinIO , NGINX , Cloud Build , Azure , Vercel cron'],
  ['Systems',   'epoll , raycasting (DDA) , readline , fork / execve'],
];

const TERM_COMMANDS = [
  ['help',             "you're looking at it"],
  ['ls',               `list all ${(window.PROJECTS || []).length} projects`],
  ['open <project>',   'opens one. try: open quanta'],
  ['stack',            'the arsenal'],
  ['about',            'the lore'],
  ['contact',          'slide into the inbox'],
  ['wallpaper <name>', 'graphite | sequoia | sunset | forest. redecorate.'],
  ['whoami',           'existential, but ok'],
  ['pwd',              'you are here'],
  ['date',             'time is a construct'],
  ['echo <text>',      'says it back. groundbreaking.'],
  ['clear',            'crime scene cleanup'],
];

// Interactive micro-shell. Auto-types `help` on open, then hands you the
// prompt: command history with arrow keys, and a few real actions (open
// projects, change the wallpaper) wired back into the desktop.
function TerminalContent({ onOpenProject, onWallpaper }) {
  const [history, setHistory] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [booted, setBooted] = React.useState(false);
  const cmdHist = React.useRef([]);
  const histIdx = React.useRef(-1);
  const inputRef = React.useRef(null);
  const rootRef = React.useRef(null);
  const keyRef = React.useRef(0);
  const handle = (window.ABOUT && window.ABOUT.handle) || 'guest';

  function Prompt() {
    return (
      <span>
        <span className="term-prompt-host">{handle}@macbook</span>
        <span className="term-prompt-path"> ~ % </span>
      </span>
    );
  }

  function print(node) {
    keyRef.current += 1;
    const k = keyRef.current;
    setHistory((h) => [...h, <div key={k}>{node}</div>]);
  }

  function guide() {
    return (
      <div>
        <div className="term-line" style={{ marginTop: 6 }}>commands. use them or don't:</div>
        <div className="term-help">
          {TERM_COMMANDS.map(([c, d]) => (
            <React.Fragment key={c}>
              <span className="term-key">{c}</span>
              <span className="term-dim">{d}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  function stackTable() {
    return (
      <div>
        <div className="term-line" style={{ marginTop: 6 }}>{'    '}<span style={{ fontWeight: 700 }}>Categories</span>{'        '}<span style={{ fontWeight: 700 }}>Technologies</span></div>
        <div className="term-line term-dim">{'─'.repeat(66)}</div>
        <div className="term-table">
          {TERM_STACK.map(([k, v]) => (
            <React.Fragment key={k}>
              <span className="term-ok">✓</span>
              <span className="term-key">{k}</span>
              <span className="term-val">{v}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="term-line term-dim">{'─'.repeat(66)}</div>
        <div className="term-line"><span className="term-ok">✓ {TERM_STACK.length} categories. yes, all of them get used.</span></div>
      </div>
    );
  }

  function runCommand(raw) {
    print(<div className="term-line"><Prompt/><span className="term-cmd">{raw}</span></div>);
    const cmd = raw.trim();
    if (!cmd) return;
    const parts = cmd.split(/\s+/);
    const name = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');
    const projects = window.PROJECTS || [];
    switch (name) {
      case 'help':
        print(guide());
        break;
      case 'ls': {
        print(
          <div className="term-help" style={{ marginTop: 4 }}>
            {projects.map((p) => (
              <React.Fragment key={p.id}>
                <span className="term-key">{p.id}</span>
                <span className="term-dim">{p.name} · {p.type} · {p.year}</span>
              </React.Fragment>
            ))}
          </div>
        );
        print(<div className="term-line term-dim">{projects.length} projects. open one: open &lt;id&gt;. go on.</div>);
        break;
      }
      case 'open': {
        if (!arg) { print(<div className="term-line term-dim">open what? try: open quanta</div>); break; }
        const q = arg.toLowerCase();
        const p = projects.find((x) => x.id === q) ||
                  projects.find((x) => x.name.toLowerCase().includes(q) || (x.shortName || '').toLowerCase().includes(q));
        if (p) {
          print(<div className="term-line"><span className="term-ok">✓</span> opening {p.name}. good pick.</div>);
          onOpenProject && onOpenProject(p);
        } else {
          print(<div className="term-line term-dim">no project called “{arg}”. ls exists for a reason.</div>);
        }
        break;
      }
      case 'stack':
        print(stackTable());
        break;
      case 'about': {
        const a = window.ABOUT || {};
        print(
          <div>
            <div className="term-line"><span className="term-key">{a.name}</span> — {a.role}. allegedly.</div>
            <div className="term-line term-dim">{a.school} · {a.location} · forged in the 1337 grind, not a weekend bootcamp</div>
            <div className="term-line" style={{ maxWidth: '58ch' }}>{a.bio}</div>
            <div className="term-line term-dim">tl;dr: touches the metal, still ships. rare combo.</div>
          </div>
        );
        break;
      }
      case 'contact': {
        const a = window.ABOUT || {};
        print(
          <div className="term-help" style={{ marginTop: 4 }}>
            <span className="term-key">email</span><a href={`mailto:${a.email}`} style={{ color: '#79c0ff' }}>{a.email}</a>
            <span className="term-key">github</span><a href={a.github} target="_blank" rel="noreferrer" style={{ color: '#79c0ff' }}>{(a.github || '').replace(/^https?:\/\//, '')}</a>
            <span className="term-key">linkedin</span><a href={a.linkedin} target="_blank" rel="noreferrer" style={{ color: '#79c0ff' }}>{(a.linkedin || '').replace(/^https?:\/\//, '')}</a>
          </div>
        );
        break;
      }
      case 'wallpaper': {
        const valid = ['graphite', 'sequoia', 'sunset', 'forest'];
        if (valid.includes(arg.toLowerCase())) {
          onWallpaper && onWallpaper(arg.toLowerCase());
          print(<div className="term-line"><span className="term-ok">✓</span> {arg.toLowerCase()}. interior design skills: confirmed.</div>);
        } else {
          print(<div className="term-line term-dim">pick one: graphite | sequoia | sunset | forest</div>);
        }
        break;
      }
      case 'whoami':
        print(<div className="term-line">me? {handle}. you? a visitor with elite taste.</div>);
        break;
      case 'pwd':
        print(<div className="term-line">/Users/{handle}</div>);
        break;
      case 'date':
        print(<div className="term-line">{new Date().toString()}</div>);
        break;
      case 'echo':
        print(<div className="term-line">{arg}</div>);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
        print(<div className="term-line term-dim">the red button is right there.</div>);
        break;
      case 'rm':
        print(<div className="term-line term-dim">nice try. the portfolio stays.</div>);
        break;
      case 'sudo':
        print(<div className="term-line term-dim">{handle} is not in the sudoers file. This incident will be reported.</div>);
        break;
      default:
        print(<div className="term-line term-dim">zsh: command not found: {name}. bold of you to freestyle. try help.</div>);
    }
  }

  // Auto-type `help` once so visitors see the guide immediately.
  React.useEffect(() => {
    print(<div className="term-line term-dim">Last login: {new Date().toDateString()} on ttys001</div>);
    const CMD = 'help';
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setInput(CMD.slice(0, i));
      if (i >= CMD.length) {
        clearInterval(t);
        setTimeout(() => {
          runCommand(CMD);
          setInput('');
          setBooted(true);
          setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
        }, 350);
      }
    }, 90);
    return () => clearInterval(t);
  }, []);

  // Keep scrolled to the bottom
  React.useEffect(() => {
    const sc = rootRef.current && rootRef.current.closest('.win-body');
    if (sc) sc.scrollTop = sc.scrollHeight;
  }, [history, booted]);

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      const raw = input;
      setInput('');
      if (raw.trim()) {
        cmdHist.current.push(raw);
        histIdx.current = cmdHist.current.length;
      }
      runCommand(raw);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx.current > 0) {
        histIdx.current -= 1;
        setInput(cmdHist.current[histIdx.current] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx.current < cmdHist.current.length) {
        histIdx.current += 1;
        setInput(cmdHist.current[histIdx.current] || '');
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className="term-root"
      onMouseUp={() => {
        // refocus unless the visitor is selecting output text
        if (!String(window.getSelection && window.getSelection()) && inputRef.current) inputRef.current.focus();
      }}
    >
      {history}
      <div className="term-line term-input-row">
        <Prompt/>
        {booted ? (
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoComplete="off"
          />
        ) : (
          <span><span className="term-cmd">{input}</span><span className="term-cursor"></span></span>
        )}
      </div>
    </div>
  );
}

window.FinderProjectContent = FinderProjectContent;
window.TerminalContent = TerminalContent;
