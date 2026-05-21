// =========================================================================
// IntroAnimation.jsx — cursive "hello" reveals left-to-right via clip-path,
// then fades. Uses Caveat webfont rendered as SVG text for crisp scaling.
// =========================================================================

function IntroAnimation({ onDone }) {
  const [phase, setPhase] = React.useState('drawing'); // drawing → holding → leaving → done

  React.useEffect(() => {
    // Drawing: 0 → 2.0s
    // Hold: 2.0 → 2.9s
    // Fade out: 2.9 → 3.6s
    const t1 = setTimeout(() => setPhase('holding'), 2000);
    const t2 = setTimeout(() => setPhase('leaving'), 2900);
    const t3 = setTimeout(() => { setPhase('done'); onDone && onDone(); }, 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  if (phase === 'done') return null;

  return (
    <div className={`intro-root intro-${phase}`}>
      <div className="intro-hello-wrap">
        <div className="intro-hello">hi</div>
      </div>
    </div>
  );
}

window.IntroAnimation = IntroAnimation;
