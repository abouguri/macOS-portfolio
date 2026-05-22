// =========================================================================
// WindowContent.jsx — content for project / about / contact windows
// =========================================================================

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3 H13 V6"/>
      <path d="M13 3 L8 8"/>
      <path d="M11 9.5 V12 Q11 13 10 13 H4 Q3 13 3 12 V6 Q3 5 4 5 H7"/>
    </svg>
  );
}

function GitHubGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}

function ProjectWindowContent({ project }) {
  const isAuthor = project.role === 'Author';
  const hasContributionCopy = project.contributions && !project.contributions.startsWith('TODO');
  const showContribs = !isAuthor && hasContributionCopy;

  return (
    <div className="pw-root">
      {/* Sticky header */}
      <div className="pw-sticky">
        <div className="pw-title-row">
          <h1 className="pw-title">{project.name}</h1>
          <span className={`pw-role-pill ${isAuthor ? 'author' : 'contributor'}`}>
            {project.role}
          </span>
        </div>
        <p className="pw-tagline">{project.tagline}</p>
        <div className="pw-meta">
          <div className="pw-meta-col">
            <div className="pw-meta-label">Year</div>
            <div className="pw-meta-value">{project.year}</div>
          </div>
          <div className="pw-meta-col">
            <div className="pw-meta-label">Type</div>
            <div className="pw-meta-value">{project.type}</div>
          </div>
          <div className="pw-meta-col">
            <div className="pw-meta-label">Stack</div>
            <div className="pw-meta-value">{project.stack.length} technologies</div>
          </div>
          <div className="pw-meta-col">
            <div className="pw-meta-label">Links</div>
            <div className="pw-meta-links">
              <a className="pw-meta-link" href={project.repo} target="_blank" rel="noreferrer">
                Repo <ExternalIcon/>
              </a>
              {project.live && (
                <a className="pw-meta-link" href={project.live} target="_blank" rel="noreferrer">
                  Live <ExternalIcon/>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pw-content">
        {/* Stack chips */}
        <div className="pw-stack">
          {project.stack.map((t) => (
            <span key={t} className="pw-chip">{t}</span>
          ))}
        </div>

        {/* Hero grid */}
        <div className="pw-grid">
          {project.images.slice(0, 2).map((img, i) => (
            <div
              key={i}
              className="pw-img-block"
              style={{ background: img.c }}
            >
              <div className="pw-img-label">{img.label}</div>
            </div>
          ))}
        </div>

        {/* What it does */}
        <div className="pw-section">
          <div className="pw-section-label">What it does</div>
          <p className={`pw-prose ${project.todo ? 'todo' : ''}`}>{project.what}</p>
        </div>

        {/* My contributions (contributor projects only) */}
        {showContribs && (
          <div className="pw-section">
            <div className="pw-section-label">My contributions</div>
            <p className="pw-prose">
              {project.contributions}
            </p>
          </div>
        )}

        {/* Why it's interesting */}
        <div className="pw-section">
          <div className="pw-section-label">Why it's interesting</div>
          <p className={`pw-prose ${project.todo ? 'todo' : ''}`}>{project.why}</p>
        </div>

        {/* CTAs */}
        <div className="pw-cta-row">
          {project.live && (
            <a className="pw-cta primary" href={project.live} target="_blank" rel="noreferrer">
              Live demo <ExternalIcon/>
            </a>
          )}
          <a className={`pw-cta ${project.live ? 'secondary' : 'primary'}`} href={project.repo} target="_blank" rel="noreferrer">
            <GitHubGlyph/> Repository
          </a>
        </div>
      </div>
    </div>
  );
}

function AboutWindowContent() {
  const a = window.ABOUT;
  return (
    <div className="aw-root">
      <div className="aw-header">
        <div className="aw-photo">
          <div className="aw-photo-letter">A</div>
        </div>
        <div className="aw-fields">
          <div className="aw-label">Name</div>
          <div className="aw-value">{a.name}</div>
          <div className="aw-label">Role</div>
          <div className="aw-value">{a.role}</div>
          <div className="aw-label">School</div>
          <div className="aw-value">{a.school}</div>
          <div className="aw-label">Handle</div>
          <div className="aw-value">@{a.handle}</div>
          <div className="aw-label">Mail</div>
          <div className="aw-value"><a className="aw-link" href={`mailto:${a.email}`}>{a.email}</a></div>
        </div>
      </div>
      <p className="aw-bio">{a.bio}</p>
    </div>
  );
}

function ContactWindowContent() {
  const a = window.ABOUT;
  const rows = [
    {
      label: 'Email',
      value: a.email,
      href: `mailto:${a.email}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <path d="m3 7 9 6 9-6"/>
        </svg>
      ),
    },
    {
      label: 'GitHub',
      value: 'github.com/abouguri',
      href: a.github,
      icon: <GitHubGlyph/>,
    },
    {
      label: 'LinkedIn',
      value: 'in/abdelaadim-bougurine',
      href: a.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3v-11zm6 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V20.5H17.4v-4.78c0-1.14-.02-2.6-1.59-2.6-1.59 0-1.83 1.24-1.83 2.52V20.5H9V9.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="cw-root">
      <h2 className="cw-title">Get in touch</h2>
      <p className="cw-sub">
        Email is best. I read everything and usually reply within a few days. For code stuff, GitHub. For professional things, LinkedIn.
      </p>
      <div className="cw-list">
        {rows.map((r) => (
          <a key={r.label} className="cw-row" href={r.href} target={r.href.startsWith('mailto') ? '_self' : '_blank'} rel="noreferrer">
            <div className="cw-row-icon">{r.icon}</div>
            <div className="cw-row-text">
              <span className="cw-row-label">{r.label}</span>
              <span className="cw-row-value">{r.value}</span>
            </div>
            <span className="cw-arrow">›</span>
          </a>
        ))}
      </div>
    </div>
  );
}

window.ProjectWindowContent = ProjectWindowContent;
window.AboutWindowContent = AboutWindowContent;
window.ContactWindowContent = ContactWindowContent;
