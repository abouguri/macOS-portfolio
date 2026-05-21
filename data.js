// =========================================================================
// data.js — abouguri portfolio data
// =========================================================================

window.ABOUT = {
  name: "abouguri",
  handle: "abouguri",
  role: "Software Engineer",
  school: "1337 Coding School (42 Network — Morocco)",
  location: "Morocco",
  email: "abdelaadim2000@gmail.com",
  github: "https://github.com/abouguri",
  linkedin: "https://www.linkedin.com/in/abdelaadim-bougurine",
  bio:
    "Systems-leaning engineer comfortable from C++ network servers and 3D raycasters up to Next.js LLM products. I like projects that touch the metal — and ship a polished surface.",
};

window.PROJECTS = [
  // ───────────── Author ─────────────
  {
    id: "quanta",
    slug: "quanta",
    name: "Quanta",
    tagline: "Truth, measured. A credibility instrument for the internet.",
    role: "Author",
    year: "2025",
    type: "AI Product",
    stack: ["Next.js 14", "TypeScript", "Tailwind", "Groq · llama-3.3-70b", "Cheerio", "Vercel Edge"],
    repo: "https://github.com/abouguri/Quanta",
    live: "https://factnews-six.vercel.app",
    icon: "assets/icons/projects/quanta.svg",
    position: { x: -420, y: -180 },
    images: [
      { c: "linear-gradient(135deg,#0d1f2d 0%,#1b3a52 100%)", label: "Landing — paste a URL" },
      { c: "linear-gradient(150deg,#13283a 0%,#264f73 100%)", label: "Analysis result · 78 / 100" },
    ],
    what:
      "Paste a URL or article text and Quanta runs a four-pass LLM review — fact risk, bias & framing, sensationalism, red flags — then returns a calibrated 0–100 credibility score with a written explanation. History is stored locally, output is copy-as-markdown, with dark/light mode and EN + AR.",
    why:
      "The model wrapping is the trick. Splitting a single credibility judgment across four orthogonal passes prevents the score from being dominated by any one failure mode. Server-side scraping with Cheerio, edge-deployed on Vercel; single-call latency is dominated by Groq's llama-3.3-70b throughput.",
  },
  {
    id: "inception",
    slug: "inception",
    name: "Inception",
    tagline: "A full containerized web stack — NGINX, WordPress, MariaDB, Adminer — orchestrated from scratch.",
    role: "Author",
    year: "2025",
    type: "DevOps",
    stack: ["Docker", "Docker Compose", "NGINX", "WordPress", "MariaDB", "Bash", "Debian"],
    repo: "https://github.com/abouguri/Inception",
    icon: "assets/icons/projects/inception.svg",
    position: { x: -380, y: 60 },
    images: [
      { c: "linear-gradient(140deg,#16202a 0%,#283744 100%)", label: "Service topology" },
      { c: "linear-gradient(150deg,#1c2731 0%,#34495f 100%)", label: "Portfolio sub-site · dark" },
    ],
    what:
      "Five Docker containers — NGINX with TLS termination + reverse proxy, WordPress + PHP-FPM, MariaDB, Adminer, and a static portfolio site — on a custom bridge network with persistent volumes, all built from debian:bullseye. No pre-built images, no latest tags.",
    why:
      "A 1337/42 capstone, but I went past the brief: self-signed TLS with HSTS/CSP, a Mermaid-documented service topology, and a dark/light themed bonus portfolio served from its own container. A demonstration that I read the spec, then asked what the spec was really for.",
  },
  {
    id: "cub3d",
    slug: "cub3d",
    name: "cub3D",
    tagline: "A Wolfenstein-style raycasting engine in C — with enemy AI, health, and a minimap.",
    role: "Author",
    year: "2024",
    type: "Game Engine",
    stack: ["C", "MinilibX", "Raycasting (DDA)", "Linux / X11"],
    repo: "https://github.com/abouguri/cub3d",
    icon: "assets/icons/projects/cub3d.svg",
    position: { x: -180, y: 180 },
    images: [
      { c: "linear-gradient(180deg,#3a1a0e 0%,#0e0806 70%)", label: "Textured walls · 60fps" },
      { c: "linear-gradient(180deg,#241208 0%,#0e0806 60%)", label: "Minimap + health HUD" },
    ],
    what:
      "Wolfenstein 3D-style first-person engine in C, rendering with raycasting (DDA) onto MinilibX. WASD + mouse-look, textured walls per cardinal direction, animated sprites, configurable floor and ceiling colors via .cub map files.",
    why:
      "Past the mandatory spec I added enemy AI (detect → follow → attack), a player health system with damage cooldown, a red-flash damage feedback frame, and a win/lose game-state machine. Runs 60+ FPS at 1280×720, valgrind-clean.",
  },
  {
    id: "geobrief",
    slug: "geobrief",
    name: "GEObrief",
    tagline: "Lightweight geospatial briefing tool — point at a place, get a structured summary.",
    role: "Author",
    year: "2025",
    type: "Geo · AI",
    stack: ["TypeScript", "React", "MapLibre", "LLM summarisation"],
    repo: "https://github.com/abouguri/GEObrief",
    icon: "assets/icons/projects/geobrief.svg",
    position: { x: 220, y: -200 },
    images: [
      { c: "linear-gradient(150deg,#0e2218 0%,#1d4030 100%)", label: "Map · point of interest" },
      { c: "linear-gradient(160deg,#102a1f 0%,#1f4533 100%)", label: "Briefing card" },
    ],
    what:
      "TODO — paste the real summary from the README. Keep the same shape as the others: what it does, why it's interesting, the deployed/repo links.",
    why:
      "TODO — fill in the angle that makes this project sit alongside the rest. Tweak this paragraph from the Tweaks panel once the README copy is finalised.",
    todo: true,
  },

  // ───────────── Contributor ─────────────
  {
    id: "transcendence",
    slug: "transcendence",
    name: "Transcendence",
    tagline:
      "Real-time multiplayer Pong on an event-driven microservices stack — under 30s from load to a fair online match.",
    role: "Contributor",
    year: "2025",
    type: "Microservices",
    stack: [
      "TypeScript", "Node.js 22", "Fastify", "Socket.IO",
      "RabbitMQ", "SQLite", "Redis",
      "HashiCorp Vault", "Nginx + ModSecurity", "Docker Compose",
      "pnpm workspaces", "Hexagonal Architecture",
    ],
    repo: "https://github.com/NourMellal/transcendence",
    icon: "assets/icons/projects/transcendence.svg",
    position: { x: 380, y: 40 },
    images: [
      { c: "linear-gradient(150deg,#1a1130 0%,#3a2566 100%)", label: "Architecture · 5 services" },
      { c: "linear-gradient(180deg,#0e0820 0%,#231447 100%)", label: "Match lobby" },
    ],
    what:
      "Real-time multiplayer Pong as event-driven microservices. An API Gateway fans out to four services (user, game, chat, tournament), all communicating asynchronously over RabbitMQ. Secrets in HashiCorp Vault, ModSecurity WAF at the edge, 2FA + JWT auth, SQLite per service, Redis for sessions. Goal: under 30 seconds from page load to a fair online match.",
    contributions:
      "TODO — one paragraph in your own words. Which service(s) did you own? Which integration events crossed the bus through your code? If you wired Vault, the WAF, or a specific domain (user / game / chat / tournament), name it. Be specific — credit is for the work that's actually yours.",
    why:
      "Real Hexagonal Architecture across five services with proper domain / application / infrastructure separation, plus a working integration-event bus — not architecture-diagram theatre. Vault integration means zero secrets in env files or git history.",
  },
  {
    id: "ircserver",
    slug: "irc-server",
    name: "IRC Server",
    tagline:
      "A from-scratch IRC server in C++ using the Reactor pattern over epoll — multi-client, channels, ops, the lot.",
    role: "Contributor",
    year: "2024",
    type: "Systems",
    stack: ["C++", "epoll", "Reactor / Dispatcher", "Factory (commands)", "Singleton"],
    repo: "https://github.com/yabdoul/IRC_server",
    icon: "assets/icons/projects/ircserver.svg",
    position: { x: 200, y: 200 },
    images: [
      { c: "linear-gradient(180deg,#0b0f12 0%,#1a2129 100%)", label: "irssi connected · #general" },
      { c: "linear-gradient(150deg,#11171c 0%,#1f2a34 100%)", label: "Reactor · dispatcher sketch" },
    ],
    what:
      "RFC-style IRC server in C++. A single-threaded epoll-driven Reactor multiplexes all client sockets; a Dispatcher routes parsed messages to per-command handlers (PASS, NICK, USER, JOIN, PRIVMSG, PART, QUIT, LIST, KICK, INVITE, MODE, PING). Channel ops, invites, modes — all there. Numeric reply templates configurable in config/numericReplies.txt.",
    contributions:
      "TODO — one paragraph. Which commands and handlers did you own (channel ops, PRIVMSG routing, mode logic)? Did you write the parser, the dispatcher, or the connection lifecycle? Replace this with a specific list.",
    why:
      "Clean application of Reactor + Dispatcher with a Factory for command handlers and Singletons for Server / Reactor. Tested live against nc, irssi, weechat, and HexChat — the parts of UNIX that don't lie.",
  },
];

// Dock holds navigation, not projects. Five tiles max so magnification feels good.
window.DOCK_APPS = [
  { id: "about",    name: "About",    icon: "assets/icons/dock/about.svg",    kind: "window", target: "about" },
  { id: "projects", name: "Projects", icon: "assets/icons/dock/projects.svg", kind: "spotlight", filter: "project" },
  { id: "github",   name: "GitHub",   icon: "assets/icons/dock/github.svg",   kind: "link", href: "https://github.com/abouguri" },
  { id: "linkedin", name: "LinkedIn", icon: "assets/icons/dock/linkedin.svg", kind: "link", href: "https://www.linkedin.com/in/abdelaadim-bougurine" },
  { id: "contact",  name: "Contact",  icon: "assets/icons/dock/contact.svg",  kind: "window", target: "contact" },
];

window.MENU_STRUCTURE = [
  {
    name: "abouguri",
    primary: true,
    items: [
      { label: "About this engineer", action: "open", target: "about" },
      "—",
      { label: "Contact", action: "open", target: "contact" },
      "—",
      { label: "Hide", action: "noop" },
    ],
  },
  {
    name: "File",
    items: [
      { label: "New tab · random project", action: "random-project" },
      { label: "Open Spotlight…", action: "spotlight", shortcut: "⌘K" },
      "—",
      { label: "Close window", action: "close-top", shortcut: "⌘W" },
    ],
  },
  {
    name: "View",
    items: [
      { label: "Dock magnification", action: "toggle-mag", toggle: "dockMag" },
      { label: "Reduce motion", action: "toggle-motion", toggle: "reducedMotion" },
    ],
  },
  {
    name: "Window",
    items: [
      { label: "List open windows", action: "list-windows" },
    ],
  },
  {
    name: "Help",
    items: [
      { label: "View portfolio source", action: "link", href: "https://github.com/abouguri" },
      { label: "Send an email", action: "link", href: "mailto:abdelaadim2000@gmail.com" },
    ],
  },
];
