// =========================================================================
// BootLogin.jsx — boot screen (Apple logo + progress + chime) then the
// login screen over the blurred wallpaper. Replaces the old "hi" intro.
// =========================================================================

const APPLE_PATH = "M16.5 1.3c.1 1.5-.5 2.9-1.4 3.9-.9 1-2.4 1.7-3.7 1.6-.2-1.4.5-2.9 1.4-3.8.9-1 2.4-1.7 3.7-1.7zM21 17.7c-.4 1.3-.9 2.4-1.7 3.5-1 1.5-2.4 3.3-4.2 3.3-1.6 0-2-1-4.2-1-2.1 0-2.6 1-4.2 1-1.8 0-3.1-1.6-4.1-3.1-2.8-4.3-3.1-9.4-1.4-12.1 1.2-1.9 3.2-3 5-3 1.6 0 3.1.9 4.1.9 1 0 2.7-1 4.5-.9.8 0 3 .3 4.4 2.4-.1.1-2.6 1.5-2.6 4.5 0 3.6 3.1 4.8 3.1 4.9-.1 0-.2.2-.7.6z";

// Startup chime — a soft synthesized major chord (WebAudio). Browsers may
// block audio before the first gesture; we simply try and fail silently.
function playChime(volume = 1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') { ctx.resume().catch(() => {}); }
    const t0 = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, t0);
    master.gain.exponentialRampToValueAtTime(0.16 * volume, t0 + 0.09);
    master.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.2);
    master.connect(ctx.destination);
    [185.0, 233.08, 277.18, 369.99, 466.16].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.5 - i * 0.07;
      o.connect(g); g.connect(master);
      o.start(t0); o.stop(t0 + 3.4);
    });
    setTimeout(() => { try { ctx.close(); } catch (e) {} }, 3600);
  } catch (e) { /* audio unavailable */ }
}

// Boot: black screen → Apple logo fades in → progress bar fills (~4.5s with a
// mid-boot stall, like real firmware). Click anywhere to skip.
function BootSequence({ onDone }) {
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);
  const doneRef = React.useRef(false);

  React.useEffect(() => {
    playChime();
    const t0 = setTimeout(() => setVisible(true), 400);
    const start = performance.now();
    const DUR = 4400;
    let raf;
    function tick(now) {
      const t = Math.min(1, (now - start) / DUR);
      // two-speed fill with a stall around 55%, like a real boot
      let eased;
      if (t < 0.5) eased = t * 1.1;
      else if (t < 0.68) eased = 0.55 + (t - 0.5) * 0.28;
      else eased = 0.6 + (t - 0.68) * 1.25;
      setProgress(Math.min(1, eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    }
    raf = requestAnimationFrame(tick);
    return () => { clearTimeout(t0); cancelAnimationFrame(raf); };
  }, []);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    setTimeout(() => onDone && onDone(), 550);
  }

  return (
    <div className={`boot-root ${leaving ? 'boot-leaving' : ''}`} onClick={finish} title="Click to skip">
      <div className={`boot-center ${visible ? 'on' : ''}`}>
        <svg className="boot-apple" viewBox="0 0 24 24" fill="currentColor"><path d={APPLE_PATH}/></svg>
        <div className="boot-progress">
          <div className="boot-progress-fill" style={{ width: `${progress * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}

// Login avatar — the monkey emoji. Covers his eyes while you type your
// password; hover and he peeks out, dances and waves hi.
function MonkeyAvatar() {
  return (
    <div className="monkey-emoji" aria-hidden="true">
      <span className="me-idle">🙈</span>
      <span className="me-hi">🐵</span>
      <span className="me-hand">👋</span>
    </div>
  );
}

// Login screen over the blurred wallpaper. Any password (or none) unlocks.
function LoginScreen({ onDone }) {
  const [pw, setPw] = React.useState('');
  const [leaving, setLeaving] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 700);
    return () => clearTimeout(t);
  }, []);

  function unlock() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => onDone && onDone(), 620);
  }

  return (
    <div className={`login-root ${leaving ? 'leaving' : ''}`}>
      <div className="login-card">
        <div className="login-avatar" onClick={unlock}>
          <MonkeyAvatar/>
        </div>
        <div className="login-name">{(window.ABOUT && window.ABOUT.name) || 'guest'}</div>
        <div className="login-field">
          <input
            ref={inputRef}
            type="password"
            value={pw}
            placeholder="Enter Password"
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') unlock(); }}
          />
          <button className="login-go" onClick={unlock} aria-label="Log in">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6 h8 M6.5 2.5 L10 6 L6.5 9.5"/></svg>
          </button>
        </div>
        <div className="login-hint">Press Enter — any password works here</div>
      </div>
      <div className="login-bottom">This is a portfolio, not your Mac — log in to browse</div>
    </div>
  );
}

window.BootSequence = BootSequence;
window.LoginScreen = LoginScreen;
