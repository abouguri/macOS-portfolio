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
    "I build things at most levels of the stack, from C++ servers and raycasters to Next.js apps with LLMs. I like projects that get close to the hardware but still ship something clean.",
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
    position: { x: -560, y: -215 },
    images: [
      { c: "linear-gradient(135deg,#0d1f2d 0%,#1b3a52 100%)", label: "Landing screen" },
      { c: "linear-gradient(150deg,#13283a 0%,#264f73 100%)", label: "Analysis result · 78 / 100" },
    ],
    what:
      "You paste a URL or some article text and it runs four separate LLM checks: fact risk, bias and framing, sensationalism, and red flags. Each check is independent and you get a 0 to 100 score with a written breakdown. History is saved locally, you can copy the output as markdown, and it works in both English and Arabic.",
    why:
      "Running four separate checks instead of one big prompt is the key part. If you lump everything into one call, one bad signal can drag the whole score down. Keeping them separate means each check stays honest. Scraping runs server-side with Cheerio, the whole thing is deployed on Vercel, and speed is mostly just Groq being fast.",
  },
  {
    id: "taskflow",
    slug: "taskflow",
    name: "TaskFlow",
    tagline: "A task manager built around one idea: a list you can read at a glance.",
    role: "Author",
    year: "2026",
    type: "Mobile App",
    stack: ["Flutter 3.44", "Dart 3.12", "provider", "SQLite · sqflite", "Android · iOS · web", "Vercel"],
    repo: "https://github.com/abouguri/TaskFlow-AI",
    live: "https://task-flow-ai-blush.vercel.app",
    icon: "assets/icons/projects/taskflow.svg",
    position: { x: -560, y: -45 },
    images: [
      { c: "linear-gradient(150deg,#123a4d 0%,#1d6a63 100%)", label: "Today · what's due" },
      { c: "linear-gradient(160deg,#0f2f3e 0%,#22b3a0 100%)", label: "Task open in place" },
    ],
    what:
      "Six lists that each mean something: Inbox, Today, Upcoming grouped by day, Anytime, Someday, and a Logbook. Areas hold projects, projects divide into headings you name, and you can drag a to-do between sections. Quick capture opens over whatever you were doing, and typing \"call the dentist tomorrow\" or \"water the plants every friday\" gets the date and the repeat out of the sentence. Notes, checklists, tags, a scheduled date and a separate deadline. One Flutter codebase for Android, iOS and web.",
    why:
      "Rows stay one line no matter how much a task carries, and opening one expands it in place instead of pushing a new screen, so you never lose your position in the list. Colour, elevation and the type scale live in one themed extension rather than being hard-coded per screen. The checkbox, section header and completion ring are purpose-built widgets (the ring is a CustomPainter) instead of Material components bent into shape. Storage sits behind an interface, so 40 tests drive the whole state layer against an in-memory store, and SQLite has come through eight schema versions with each upgrade preserving what's already on the device.",
  },
  {
    id: "etm-android",
    slug: "enterprise-task-manager",
    name: "Enterprise Task Manager",
    shortName: "Enterprise TM",
    tagline: "Offline-first Android task manager with a real sync queue and server-enforced conflict resolution.",
    role: "Author",
    year: "2026",
    type: "Mobile · Enterprise",
    stack: ["Kotlin", "Jetpack Compose", "Clean Architecture + MVVM", "Hilt", "Room", "WorkManager", "Retrofit", "MSAL · Entra ID"],
    repo: "https://github.com/abouguri/enterprise-task-manager",
    icon: "assets/icons/projects/etm-android.svg",
    position: { x: -560, y: 125 },
    images: [
      { c: "linear-gradient(150deg,#3d2a63 0%,#6b46c1 100%)", label: "Task list · Compose" },
      { c: "linear-gradient(160deg,#241a3d 0%,#7b52d1 100%)", label: "Sync queue · offline" },
    ],
    what:
      "Every create, edit and delete is instant and local to Room, then queued and pushed by a WorkManager SyncWorker. It works fully offline; reconnecting drains the queue on its own with nothing for the user to press. Sign-in goes through MSAL against a real Microsoft Entra ID App Registration, with silent token refresh so a background sync doesn't re-prompt anyone. It talks to a separate ASP.NET Core backend, also in this portfolio.",
    why:
      "The conflict handling is the part that actually got verified end to end rather than unit-tested in isolation: edit the same task from two places while one is offline, and the server rejects the stale write with a 409 carrying its own row, which the client adopts in place of the local edit. Clean Architecture is enforced rather than aspired to, with zero Android imports in domain/ and strictly inward dependencies. The one deliberate deviation, SyncWorker reaching the DAO and API directly, is documented as a policy exception instead of quietly left in.",
  },
  {
    id: "taskmanager-api",
    slug: "taskmanager-api",
    name: "TaskManager API",
    shortName: "TaskMgr API",
    tagline: "The ASP.NET Core backend behind the Android client, with real Entra ID auth and a conflict rule the server enforces.",
    role: "Author",
    year: "2026",
    type: "Backend API",
    stack: ["C#", ".NET 10", "ASP.NET Core", "EF Core + Npgsql", "PostgreSQL", "Microsoft.Identity.Web", "Azure App Service"],
    repo: "https://github.com/abouguri/enterprise-task-manager-api",
    live: "https://taskmanager-api.azurewebsites.net/health",
    icon: "assets/icons/projects/taskmanager-api.svg",
    position: { x: -410, y: 125 },
    images: [
      { c: "linear-gradient(150deg,#0e3a63 0%,#2f7fd6 100%)", label: "Swagger · /api/tasks" },
      { c: "linear-gradient(160deg,#08243d 0%,#1c5f9e 100%)", label: "409 · stale write rejected" },
    ],
    what:
      "A REST API for tasks, every endpoint scoped to the caller's oid claim from an Entra ID bearer token. Reaching for someone else's task returns 404 rather than 403, so the response doesn't leak which task IDs exist. PUT compares the request's UpdatedAt against the stored value: newer wins and the server stamps its own timestamp, stale or equal is rejected with 409 and the server's current row in the body, so the client can reconcile without a second round-trip. Runs on Azure App Service against Azure Database for PostgreSQL.",
    why:
      "One trap here is worth the whole project: in Microsoft.Identity.Web, [RequiredScope] is inert metadata unless AddRequiredScopeAuthorization() is also registered. Skip that line and the attribute silently no-ops, still returning 200 with no scope required, and nothing tells you. Beyond that it's deliberately conventional: controllers stay thin translators between HTTP and a service layer that was introduced only once real logic showed up, and request DTOs never carry Id or UserId because both are server-set.",
  },
  {
    id: "inception",
    slug: "inception",
    name: "Inception",
    tagline: "A full containerized web stack (NGINX, WordPress, MariaDB, Adminer) built from scratch with no pre-built images.",
    role: "Author",
    year: "2025",
    type: "DevOps",
    stack: ["Docker", "Docker Compose", "NGINX", "WordPress", "MariaDB", "Bash", "Debian"],
    repo: "https://github.com/abouguri/Inception",
    icon: "assets/icons/projects/inception.svg",
    position: { x: 410, y: 125 },
    images: [
      { c: "linear-gradient(140deg,#16202a 0%,#283744 100%)", label: "Service topology" },
      { c: "linear-gradient(150deg,#1c2731 0%,#34495f 100%)", label: "Portfolio sub-site · dark" },
    ],
    what:
      "Five Docker containers: NGINX (TLS + reverse proxy), WordPress + PHP-FPM, MariaDB, Adminer, and a static portfolio site. All on a custom bridge network with persistent volumes, all built from debian:bullseye. No pre-built images, no latest tags.",
    why:
      "It started as a 1337/42 school project but I did more than what was asked. Added self-signed TLS with HSTS and CSP headers, documented the whole service topology with Mermaid, and built a dark/light themed portfolio site in its own container. I try to understand why a spec exists before I just follow it.",
  },
  {
    id: "cub3d",
    slug: "cub3d",
    name: "cub3D",
    tagline: "A Wolfenstein-style raycasting engine in C, with enemy AI, a health system, and a minimap.",
    role: "Author",
    year: "2024",
    type: "Game Engine",
    stack: ["C", "MinilibX", "Raycasting (DDA)", "Linux / X11"],
    repo: "https://github.com/abouguri/cub3d",
    icon: "assets/icons/projects/cub3d.svg",
    position: { x: 410, y: -215 },
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
    tagline: "A lightweight geospatial briefing tool. Point at a place on the map, get a quick structured summary.",
    role: "Author",
    year: "2025",
    type: "Geo · AI",
    stack: ["TypeScript", "React", "MapLibre", "LLM summarisation"],
    repo: "https://github.com/abouguri/GEObrief",
    icon: "assets/icons/projects/geobrief.svg",
    position: { x: -410, y: -215 },
    images: [
      { c: "linear-gradient(150deg,#0e2218 0%,#1d4030 100%)", label: "Map · point of interest" },
      { c: "linear-gradient(160deg,#102a1f 0%,#1f4533 100%)", label: "Briefing card" },
    ],
    what:
      "A React and MapLibre interface for turning a selected place into a compact, structured brief. The project combines map interaction with LLM summarisation so a user can move from a geographic point of interest to a readable overview without leaving the map context.",
    why:
      "The interesting part is the product shape: geospatial interfaces are great at showing where things are, but they often leave the interpretation to the user. GEObrief experiments with making location context immediately digestible while keeping the map as the primary surface.",
  },

  {
    id: "bigquery-etl",
    slug: "mysql-bigquery-etl",
    name: "BigQuery ETL",
    tagline: "An incremental MySQL to BigQuery pipeline where the tables and their transforms are configuration, not code.",
    role: "Author",
    year: "2025",
    type: "Data Engineering",
    stack: ["Python 3.11", "MySQL", "BigQuery", "Docker", "Google Secret Manager", "Cloud Build"],
    repo: "https://github.com/abouguri/mysql-bigquery-etl",
    icon: "assets/icons/projects/bigquery-etl.svg",
    position: { x: 560, y: 125 },
    images: [
      { c: "linear-gradient(150deg,#123049 0%,#2b7fb8 100%)", label: "Pipeline run · incremental" },
      { c: "linear-gradient(160deg,#1a2b1e 0%,#c98a2e 100%)", label: "BigQuery · loaded tables" },
    ],
    what:
      "Extracts from MySQL, runs the rows through transformations, and loads them into BigQuery, doing either incremental or full loads. Which tables move and what happens to them on the way is declared in an etl_tables config entry, so adding a table is an edit to configuration rather than to the pipeline. Config resolves from a .env file locally or Google Secret Manager in production, and the same image runs by hand, under Docker, or from Cloud Build.",
    why:
      "The useful constraint is that nothing about a table lives in the pipeline body: transformations are registered by key, the secrets backend is a single get_secret function you can swap, and the table list is data. That's what keeps local and production the same code path with different configuration, instead of a script that quietly grows a special case per table. It also tracks metadata and logs per run, so a failed load leaves something to read afterwards.",
  },

  // ───────────── Contributor ─────────────
  {
    id: "transcendence",
    slug: "transcendence",
    name: "Transcendence",
    tagline:
      "Real-time multiplayer Pong on an event-driven microservices stack. Under 30 seconds from page load to an actual online match.",
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
    position: { x: 560, y: -45 },
    images: [
      { c: "linear-gradient(150deg,#1a1130 0%,#3a2566 100%)", label: "Architecture · 5 services" },
      { c: "linear-gradient(180deg,#0e0820 0%,#231447 100%)", label: "Match lobby" },
    ],
    what:
      "Real-time multiplayer Pong as event-driven microservices. An API Gateway fans out to four services (user, game, chat, tournament), all communicating asynchronously over RabbitMQ. Secrets in HashiCorp Vault, ModSecurity WAF at the edge, 2FA + JWT auth, SQLite per service, Redis for sessions. Goal: under 30 seconds from page load to a fair online match.",
    contributions:
      "TODO: one paragraph in your own words. Which service(s) did you own? Which integration events went through your code? If you wired Vault, the WAF, or a specific domain (user / game / chat / tournament), say so. Be specific.",
    why:
      "It uses proper Hexagonal Architecture across five services with clean domain/application/infrastructure separation, and the integration-event bus actually works in production, not just on a diagram. Vault means no secrets end up in env files or git.",
  },
  {
    id: "ircserver",
    slug: "irc-server",
    name: "IRC Server",
    tagline:
      "A from-scratch IRC server in C++ using the Reactor pattern over epoll. Multi-client, channels, ops, all of it.",
    role: "Contributor",
    year: "2024",
    type: "Systems",
    stack: ["C++", "epoll", "Reactor / Dispatcher", "Factory (commands)", "Singleton"],
    repo: "https://github.com/yabdoul/IRC_server",
    icon: "assets/icons/projects/ircserver.svg",
    position: { x: 410, y: -45 },
    images: [
      { c: "linear-gradient(180deg,#0b0f12 0%,#1a2129 100%)", label: "irssi connected · #general" },
      { c: "linear-gradient(150deg,#11171c 0%,#1f2a34 100%)", label: "Reactor · dispatcher sketch" },
    ],
    what:
      "An RFC-style IRC server in C++. A single-threaded epoll-driven Reactor handles all client sockets and a Dispatcher routes parsed messages to per-command handlers (PASS, NICK, USER, JOIN, PRIVMSG, PART, QUIT, LIST, KICK, INVITE, MODE, PING). Channel ops, invites, and modes all work. Numeric reply templates are configurable in config/numericReplies.txt.",
    contributions:
      "TODO: one paragraph. Which commands and handlers did you own? Did you write the parser, the dispatcher, or the connection lifecycle? Replace this with specifics.",
    why:
      "Good clean use of Reactor + Dispatcher, with a Factory for command handlers and Singletons for Server and Reactor. Tested live against nc, irssi, weechat, and HexChat. If it works with all of those it actually works.",
  },
  {
    id: "minishell",
    slug: "minishell",
    name: "minishell",
    tagline: "A bash-like shell in C: lexer, parse tree, pipes, redirections, here-docs, and no leaks.",
    role: "Contributor",
    year: "2025",
    type: "Systems",
    stack: ["C", "readline", "fork / execve", "Pipes & file descriptors", "Signals", "Makefile"],
    repo: "https://github.com/abouguri/minishell",
    icon: "assets/icons/projects/minishell.svg",
    position: { x: 560, y: -215 },
    images: [
      { c: "linear-gradient(160deg,#1b2b24 0%,#2f6b4d 100%)", label: "Interactive prompt" },
      { c: "linear-gradient(150deg,#0d1712 0%,#255f42 100%)", label: "Pipeline · ls | grep | wc" },
    ],
    contributions:
      "TODO: one paragraph in your own words. Did you own the lexer and tree construction, the executor and process handling, or the built-ins and environment? Say which side of the parser/executor split was yours, and be specific.",
    what:
      "An interactive shell with readline history and a custom prompt. Single quotes stay literal while double quotes expand, $VAR and $? both resolve, and redirections cover input, output, append and here-docs. Pipelines chain to arbitrary length. The built-ins are implemented in-process, PATH resolution finds external binaries, and ctrl-C, ctrl-D and ctrl-\\ each behave the way a shell should rather than killing the session.",
    why:
      "Parsing produces a hybrid tree rather than a flat token list: sibling nodes chain the stages of a pipeline while child nodes hold a command's arguments and redirections. That means the executor walks one structure instead of special-casing each syntactic form, and a new node type slots in without touching the traversal. Lexer, executor, built-ins and environment are separate modules, and the whole thing is built to run leak-free.",
  },
  {
    id: "neo",
    slug: "neo-risk-visualizer",
    name: "NEO Risk Visualizer",
    shortName: "NEO Risk",
    tagline: "Asteroid impact assessment and deflection planning, built for NASA Space Apps 2025.",
    role: "Contributor",
    year: "2025",
    type: "Simulation",
    stack: ["React", "FastAPI", "Python", "Monte Carlo", "NASA CNEOS", "Tailwind", "Docker Compose"],
    repo: "https://github.com/abouguri/neo-risk-visualizer",
    icon: "assets/icons/projects/neo.svg",
    position: { x: -410, y: -45 },
    images: [
      { c: "linear-gradient(160deg,#161d3d 0%,#3f7fd0 100%)", label: "Impact site · blast radii" },
      { c: "linear-gradient(150deg,#20182e 0%,#c9713c 100%)", label: "Deflection · lead time" },
    ],
    contributions:
      "TODO: one paragraph. Did you write the physics modules, the FastAPI layer, or the React front end? Name the parts that were yours, in your own words.",
    what:
      "Click anywhere on Earth to simulate an impact and get crater formation, blast overpressure, thermal radiation radii and seismic effects, with a Monte Carlo pass putting confidence ranges around the numbers instead of a single false-precision answer. You can then model deflection missions, kinetic impactor, gravity tractor or nuclear standoff, against the real NASA CNEOS catalogue, with USGS population density deciding what an impact would actually cost.",
    why:
      "The physics is split into modules, impact effects, deflection and the Monte Carlo pass, sitting behind a FastAPI layer with typed Pydantic request and response models, so the simulation can be driven from the UI or straight from curl. Uncertainty is treated as part of the answer rather than a footnote, which is the honest way to present impact risk to anyone making a decision on it. The whole stack comes up with one docker compose up.",
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
