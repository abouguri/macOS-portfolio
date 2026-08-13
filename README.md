<div align="center">

# macOS Portfolio

**A personal portfolio that behaves like a desktop.**

Draggable icons, a real cosine-magnification dock, stacking windows with focus
states, and ⌘K search that indexes your tech stack. No build step, no framework
CLI, no `node_modules` — just open `index.html`.

</div>

![The desktop](docs/screenshots/desktop.png)

---

## Contents

- [What it is](#what-it-is)
- [The pieces](#the-pieces)
  - [Dock](#dock--cosine-magnification)
  - [Windows](#windows--stacking-focus-and-drag)
  - [Spotlight](#spotlight--k)
  - [Menu bar](#menu-bar)
- [Running it](#running-it)
- [Project structure](#project-structure)
- [Making it yours](#making-it-yours)
- [How the tricky parts work](#how-the-tricky-parts-work)
- [Known gaps](#known-gaps)

---

## What it is

A portfolio site built as a macOS desktop. Each project is an icon you can drag
around; double-click one and it opens in a window with the stack, a writeup, and
links to the repo and live demo. The layout you arrange persists across reloads.

It runs entirely in the browser with **zero build tooling**. React and Babel come
from a CDN, JSX is transpiled in the page, and every component registers itself on
`window`. That is a deliberate constraint: the whole thing is six CSS/JS files you
can read top to bottom, and deploying is copying a folder.

| | |
|---|---|
| **Stack** | React 18 (UMD) · Babel Standalone · vanilla CSS |
| **Build step** | None |
| **Dependencies** | None installed — 3 CDN `<script>` tags |
| **Total size** | ~107 KB of source, 88 KB of SVG assets |
| **Projects** | 12, each one object in `data.js` |

---

## The pieces

### Dock — cosine magnification

![Dock magnification](docs/screenshots/dock.png)

The real macOS magnification curve, not a CSS `:hover { transform: scale() }`
approximation. Icon scale follows a cosine falloff around the cursor, so
neighbours swell smoothly instead of popping, and the pill re-flows its width
every frame to fit them.

The whole animation runs in a `requestAnimationFrame` loop that writes `left` /
`width` / `height` **directly to the DOM** through refs. React never re-renders
during the animation — it only re-renders when the hover tooltip changes. Icon
size, max scale, and falloff width are all computed from viewport size, so the
dock scales sensibly from phone to ultrawide.

Open windows get a dot under their tile. Clicking bounces the icon.

### Windows — stacking, focus, and drag

![Multiple windows open](docs/screenshots/windows.png)

Windows cascade as they open, drag by the title bar, and raise on click via a
monotonic z-counter. The focused window gets full-strength chrome; the ones
behind it fade back. Traffic lights work — red and yellow both close, green
toggles maximize (double-clicking the title bar does too). Opening a project
that is already open focuses the existing window instead of duplicating it.

Every project window is generated from one data object:

![A project window](docs/screenshots/project-window.png)

Role pill (Author / Contributor), year, type, stack chip row, screenshots of the
project itself, a *What it does* / *Why it's interesting* writeup, and CTAs to
the repo and the live demo. Contributor projects get an extra *My contributions*
section — but only once you've actually written it (see
[Making it yours](#making-it-yours)).

Screenshots are pulled from each project's own repo, downscaled and served as
WebP from `assets/screenshots/`. A project with no captures yet falls back to its
gradient panel rather than breaking the layout, and one with a single capture
spans the full row instead of leaving a hole.

### Spotlight — ⌘K

![Spotlight search](docs/screenshots/spotlight.png)

Press <kbd>⌘</kbd><kbd>K</kbd> (or <kbd>Ctrl</kbd><kbd>K</kbd>) anywhere. Results
group into **Projects / Pages / External** and are fully keyboard-driven — arrows
to move, Enter to open, Esc to dismiss.

The search index covers name, tagline, type, role, **and every stack tag**. So
typing `rabbit` finds Transcendence through "RabbitMQ", `entra` finds both halves
of the Enterprise Task Manager, `monte` finds the NEO visualizer through "Monte
Carlo", and `C++` finds the IRC server. That makes the search useful to a
recruiter who is scanning for a technology rather than a project name.

The Projects tile in the dock opens the same panel pre-filtered to projects only.

### Menu bar

![Menu bar dropdown](docs/screenshots/menubar.png)

Live clock and date, battery and Wi-Fi glyphs, a Spotlight button, and working
dropdowns. The app-name slot tracks the focused window, exactly like the real
thing. The Window menu lists open windows and focuses the one you pick; File has
a "random project" roll for anyone who wants a tour.

**Other details worth a look:** a cursive `hi` intro that reveals left-to-right on
first visit and then remembers it (`sessionStorage`), a silk-fabric background
that parallaxes against the cursor and respects `prefers-reduced-motion`, and a
contributor badge on icons for projects you didn't author.

---

## Running it

There is no build. But `index.html` loads the `.jsx` files over `fetch`, so
opening it as a `file://` URL will fail CORS — serve the folder:

```bash
git clone git@github.com:abouguri/macOS-portfolio.git
cd macOS-portfolio
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Any static server works (`npx serve`,
`php -S`, Live Server, whatever you have).

Deploying is the same idea: push the folder to GitHub Pages, Netlify, Vercel, or
any static host. No build command, no output directory.

> **A note on production:** the page loads React's *development* UMD builds and
> transpiles JSX in the browser on every load. That is great for hacking on it
> and costs a few hundred ms on first paint. If you care, swap in the
> `production.min.js` React builds and pre-compile the JSX with Babel.

---

## Project structure

```
index.html              Script tags, CDN deps, mounts <Desktop/>
data.js                 ← everything you edit lives here
├── ABOUT               Name, role, bio, links
├── PROJECTS[]          One object per project (icon, stack, writeup, position)
├── DOCK_APPS[]         Dock tiles: window / spotlight / external link
└── MENU_STRUCTURE[]    Menu bar dropdowns and their actions

Desktop.jsx             Composer. Owns windows, z-order, selection, shortcuts.
                        Everything opens through one openItem() dispatcher.
├── FabricBackground    Silk background + cursor parallax
├── IntroAnimation      First-visit "hi" reveal
├── MenuBar             Clock, glyphs, wired dropdowns
├── DesktopIcon         Drag, select, open; positions persisted
├── Window              Chrome, drag, focus, maximize, open/close animation
│   └── WindowContent   Project / About / Contact window bodies
├── Spotlight           ⌘K search, grouped + keyboard-driven
└── Dock                Cosine magnification via rAF

colors_and_type.css     Design tokens — colors, type scale, spacing, easing
portfolio.css           Layout: desktop, windows, dock, menu bar
portfolio-extras.css    Window content, spotlight, intro, icon states
assets/                 SVG monogram, dock icons, project icons
```

Adding a component means writing the file, assigning `window.Foo = Foo` at the
bottom, and adding one `<script type="text/babel">` tag to `index.html`.

---

## Making it yours

**Almost everything lives in [`data.js`](data.js).** Edit that file and reload.

<details>
<summary><b>Add a project</b></summary>

Push an object onto `window.PROJECTS`:

```js
{
  id: "myproject",              // unique; also the window id
  name: "My Project",
  shortName: "My Proj",         // optional — desktop label only, if the name is long
  tagline: "One line that makes someone want to click.",
  role: "Author",               // "Author" or "Contributor"
  year: "2025",
  type: "Systems",              // shown in meta + searchable
  stack: ["Rust", "tokio"],     // chips, and indexed by Spotlight
  repo: "https://github.com/…",
  live: "https://…",            // optional — adds a "Live demo" CTA
  icon: "assets/icons/projects/myproject.svg",
  position: { x: -200, y: 100 },     // offset from the centre of the desktop
  images: [                          // one or two panels above the writeup
    { src: "assets/screenshots/myproject/landing.webp",
      c: "linear-gradient(135deg,#123 0%,#456 100%)",   // shown while loading
      pos: "top",                                        // default "center"
      label: "Landing screen" },
    { c: "linear-gradient(150deg,#234 0%,#567 100%)",    // no src = placeholder
      label: "Detail view" },
  ],
  what: "What it does, plainly.",
  why:  "Why it's technically interesting.",
}
```

`role: "Contributor"` adds a badge to the desktop icon and unlocks a **My
contributions** section — which stays hidden until you fill in a `contributions`
field that doesn't start with `TODO`. That's intentional: an unwritten
contribution note never ships.

Icons are 1024×1024 SVGs in `assets/icons/projects/` — a full-bleed gradient
`<rect>` and a bold mark, with the corner radius applied in CSS. Copy an existing
one to stay in the set.

The desktop label is capped at 112px, so anything much past ~15 characters wants
a `shortName`. The window title always uses the full `name`.

For screenshots, drop WebP files in `assets/screenshots/<project>/`. Panels are
about 370×200, so downscale to ~900px wide — anything larger is wasted bytes.
`fit: "contain"` suits a wide diagram that shouldn't be cropped; `pos: "top"`
suits a portrait phone capture, where the top of the screen is the interesting
part. Give a contained image a light `c` if the image itself has a light
background, so the letterboxing doesn't fight it.
</details>

<details>
<summary><b>Change who you are</b></summary>

`window.ABOUT` in `data.js` drives the About window, the Contact window, the menu
bar name, and the `mailto:` links. Swap `assets/monogram.svg` for the letter
behind the desktop, and update the initial in `AboutWindowContent`.
</details>

<details>
<summary><b>Retheme it</b></summary>

`colors_and_type.css` is all CSS custom properties — surfaces, accents, traffic
lights, the fabric palette, type scale, spacing, easing curves. Change
`--color-accent` and the whole UI follows. The fabric background itself is four
stacked gradient layers in `portfolio.css` (`.fabric-conic`, `.fabric-sheen-*`).
</details>

<details>
<summary><b>Reshuffle the dock</b></summary>

`window.DOCK_APPS`. Each tile is one of three kinds:

| `kind` | Effect |
|---|---|
| `window` | Opens a built-in window (`target: "about"` / `"contact"`) |
| `spotlight` | Opens search, optionally pre-filtered (`filter: "project"`) |
| `link` | Opens `href` in a new tab |

Five tiles is the sweet spot — magnification starts to feel cramped past that.
</details>

---

## How the tricky parts work

**Dock magnification without dropping frames.** The obvious implementation puts
icon scale in React state and updates it on `mousemove`. That means a full
reconciliation per frame and visible stutter. Here the rAF loop owns `left`,
`width`, and `height` and mutates them straight on the DOM nodes — those
properties are deliberately *omitted* from the JSX so React can never overwrite
them. `useLayoutEffect` sets the resting geometry before first paint so there's
no flash of unpositioned icons. Scales are held in a `Float32Array` and eased
toward their target, which is what gives the dock its weight.

**Targets are computed from resting positions.** Each icon's distance to the
cursor uses its *un-magnified* centre, not its current one. Using live positions
creates a feedback loop where growing icons push their neighbours away from the
cursor, which shrinks them, which pulls them back — a visible shimmer.

**Click vs. drag vs. open.** Desktop icons resolve all three from one
`mousedown`: movement under 5px is a click, past that it's a drag. A click on an
unselected icon selects it; a second click on an already-selected icon opens it;
double-click always opens. Positions are written to `localStorage` on mouse-up
inside a `try/catch`, so dragging still works when storage is unavailable.

**One dispatcher for everything.** The dock, desktop icons, Spotlight, and menu
bar all route through `openItem()` in `Desktop.jsx`. Adding a new way to launch
something means constructing a descriptor, not writing new window logic.

---

## Known gaps

Honest list, since this is a live project:

- All four contributor projects (Transcendence, IRC Server, minishell, NEO Risk
  Visualizer) still have `TODO` placeholders in their `contributions` field. The
  UI hides the section until they're written, so nothing looks broken — but
  they're empty.
- Six of the twelve projects have real screenshots; the other six (Enterprise
  Task Manager, TaskManager API, GEObrief, BigQuery ETL, IRC Server, NEO Risk
  Visualizer) still show gradient placeholders, because their repos have no
  captures to pull from.
- Spotlight lists a **Resume** entry that has no window behind it yet.
- The View menu's *Dock magnification* and *Reduce motion* toggles are declared
  in `MENU_STRUCTURE` but not yet handled in `handleMenuAction`.
- Windows drag but don't resize, and minimize behaves the same as close.
- Layout targets desktop. It degrades on small screens (the dock adapts) but
  a phone will not enjoy dragging windows.

---

## Regenerating the screenshots

The images in `docs/screenshots/` are captured from the running app with
Playwright, so they never drift from reality:

```bash
python3 -m http.server 8765 &      # serve the project
npm i playwright && npx playwright install chromium
node docs/capture-screenshots.js
```

---

<div align="center">

Built by [**abouguri**](https://github.com/abouguri)
</div>
