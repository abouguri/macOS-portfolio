# Portfolio product audit

**Date:** 5 September 2026  
**Baseline:** `2af248c` plus the icon improvements in this working tree  
**Product reviewed:** the macOS-style portfolio, not the implementation quality of every linked project

The portfolio is a memorable demonstration of interface engineering, but it currently makes visitors work too hard to inspect the projects. The most urgent work is reliable mobile browsing, keyboard access, and preserving the state of project windows. The desktop metaphor should remain an optional way to explore the work; the work itself needs a direct, readable entry point.

This assessment combines source review and local Chromium testing. It identifies confirmed failures, code-level findings, and product recommendations separately. It does not estimate conversion loss or claim a Lighthouse score, formal accessibility certification, or a complete security assessment.

## What was completed in this change

All 14 project icons were reviewed and updated. Quanta, TaskFlow, GEObrief, Enterprise Task Manager, seen and Mori now use their source project marks with appropriate tile treatment. Transcendence uses the paddle from its existing logo. Projects without a dedicated mark found in the reviewed sources use simpler, more readable illustrations.

- [Interactive-size icon review page](icon-preview.html)
- [Source provenance and adaptation notes](icon-sources.md)
- [Full icon contact sheet](audit/icon-preview.png)
- [Updated desktop screenshot](audit/desktop.png)

The product findings below remain work to do. This change implements the icon request and supplies the audit; it does not silently redesign navigation or change portfolio claims.

## Scope and evidence

Reviewed all runtime JSX files, project data, the four stylesheets, entry HTML, README, and icon assets. Checked local source logos and public repository trees where local projects were unavailable.

Browser checks covered desktop at 1440×900, widths of 1024 and 800, a 390×844 touch viewport, keyboard Spotlight navigation, Finder navigation and minimize/restore, and OS reduced-motion emulation. All 14 project panes opened; all 56 icon instances in the preview loaded. No uncaught page errors appeared in the recorded scenario. That is a smoke-test result, not proof that every interaction works.

Evidence files:

- [Browser measurements](audit/checks.json)
- [Demo-link HTTP checks](audit/links.json)
- [Mobile desktop](audit/mobile-desktop.png)
- [Mobile project pane](audit/mobile-project.png)
- [Finder restore mismatch](audit/restore-mismatch.png)
- [Keyboard selection outside search viewport](audit/spotlight-keyboard.png)

One cold local load reached the login screen after approximately **6.7 seconds** with public CDN dependencies. The boot itself intentionally takes 4.4 seconds plus a 550ms exit delay. This is one local observation, not a production performance benchmark. Public resource sizes reported as zero through Resource Timing are unavailable cross-origin measurements, not zero-byte downloads.

Not tested: real iOS Safari/Android hardware, Firefox/WebKit, screen readers, deployed portfolio response headers, authenticated workflows inside the linked apps, and production traffic or field performance. HTTP 200 on a demo only establishes that its landing response was available.

## What is already working well

- The desktop, dock, wallpaper and window chrome form a recognizable visual identity.
- A shared project data array feeds desktop icons, Finder and Spotlight. New projects do not require separate page implementations.
- Search includes technology tags, useful for visitors looking for a particular skill.
- Most project write-ups explain technical decisions rather than just listing tools.
- Eight projects have real screenshots, and the assets are served locally.
- Storage reads/writes are guarded so unavailable localStorage does not immediately prevent the app from running.
- External script URLs are pinned and have integrity hashes. External links generally use `noreferrer` or `noopener`.
- The site can be hosted as static files. Improving delivery does not require adding a backend.

## Priorities

P1 means fix before treating the site as ready for broad sharing. P2 means the next improvement cycle. P3 means polish or longer-term maintenance. Effort is relative: S is a localized change, M spans components, L changes a core navigation or delivery model. These are sizing estimates, not deadlines.

| ID | Priority | Finding | Evidence | Effort |
| --- | --- | --- | --- | --- |
| 01 | P1 | Projects clip off-screen on tablets and phones | Browser + source | M |
| 02 | P1 | Mobile Finder gives content only 198px | Browser | M |
| 03 | P1 | Core controls are not keyboard-operable | Browser + source | M |
| 04 | P1 | Minimize/restore loses view state and mismatches title | Browser + source | M |
| 05 | P1 | TaskManager API demo is disabled | HTTP check | S, deployment dependent |
| 06 | P2 | Boot and fake login delay access to work | Browser; product recommendation | S |
| 07 | P2 | Search selection disappears outside the result viewport | Browser | S |
| 08 | P2 | Dialog, search and control semantics are incomplete | Source | M |
| 09 | P2 | Reduced motion does not stop dock magnification | Browser + source | M |
| 10 | P2 | Small labels and link colors need contrast corrections | CSS inspection | S |
| 11 | P2 | Finder navigation retains the previous page's scroll | Browser | S |
| 12 | P2 | Window identity and close behavior disagree with visible content | Source | M |
| 13 | P2 | No direct project URLs or browser-history integration | Source | M |
| 14 | P2 | Runtime development builds and Babel are production dependencies | Source | M |
| 15 | P2 | Animations keep working when the desktop is idle | Browser + source | M |
| 16 | P2 | No useful HTML fallback, social metadata or project indexing surface | Source | M |
| 17 | P2 | Four contributor entries omit personal contributions | Data | Owner input + S |
| 18 | P2 | Six projects show empty screenshot panels | Data + UI | Content dependent |
| 19 | P2 | Portfolio source links point to the profile | Data + source | S |
| 20 | P2 | Visitors lack clear positioning and a recommended starting point | Product recommendation | M |
| 21 | P3 | Pointer-only gestures and stored positions lack recovery paths | Source | M |
| 22 | P3 | Design tokens, styles and docs have drifted | Source | M |
| 23 | P3 | Automated verification is not reproducible from the repository | Repository inspection | M |
| 24 | P3 | Simulated system controls add distraction and ambiguity | Source; product recommendation | S |
| 25 | P3 | Content cannot generally be selected, printed or inspected as images | Source + UI | S–M |

## Findings and completion criteria

### 01 — Responsive desktop layout clips projects

**Confirmed.** At 1024px, six icon tiles were outside the viewport horizontally. At 800px, twelve were outside. At 390px, the mobile grid's scroll width was 452px; its fourth column is visibly clipped. The document itself remained 390px wide, so checking only page overflow would miss this failure.

Desktop offsets reach ±560px in `data.js`. The responsive switch is at 768px in `portfolio-extras.css:484`; its `repeat(4, 1fr)` tracks retain intrinsic minimum sizes. `body` and wallpaper overflow rules prevent a normal recovery by page scrolling.

**Improve:** use a viewport-aware desktop arrangement; switch to a scrollable project grid earlier; use `minmax(0, 1fr)` and explicit wrapping/truncation for grid children. Provide a reset-layout action for persisted positions.

**Done when:** every project is visible or reachable by ordinary scrolling at 320, 390, 768, 800, 1024 and 1440px, including after resizing and restoring saved positions. Validate zoom and text enlargement as well. The portfolio reading view should meet [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

### 02 — Mobile project reading is cramped and obstructed

**Confirmed.** On a 390px viewport the Finder sidebar occupies 190px, leaving 198px for content. The seen header alone is about 367px tall. The dock overlaps the bottom of the window. See the [mobile project capture](audit/mobile-project.png).

`realism.css:413` fixes sidebar width. Mobile rules enlarge the window but do not adapt its internal navigation. A first icon tap selected it; a second opened it. Touch is not wholly broken, but discovery requires an unexpected extra tap.

**Improve:** use a single-column project page or full-screen sheet on small screens, with collapsible project navigation, one-tap opening, a compact non-sticky header and a visible back action. Hide or reserve space for the dock while reading. Collapse the overflowing menu bar too.

**Done when:** a phone visitor can open a project with one tap, read its description and reach repo/contact links without horizontal clipping or persistent chrome covering content.

### 03 — Keyboard operation is incomplete

**Confirmed.** Desktop icons, dock items and top menu triggers expose no tab stops. Finder rows also had zero focusable elements after opening a project. `DesktopIcon.jsx`, `Dock.jsx` and `FinderTerminal.jsx` implement these as pointer-driven `div`s. Some status controls in `MenuBar.jsx` have `role="button"` and `tabIndex`, but lack corresponding Enter/Space behavior; sliders use only mouse events.

The Ctrl/⌘K search shortcut provides a partial route to projects, but does not make the other functions keyboard-accessible.

**Improve:** use real links/buttons for opening and navigating, native range inputs for sliders, and keyboard actions for movement/reset where appropriate. Add visible focus styles and avoid trapping users behind pointer-only interactions.

**Done when:** keyboard-only visitors can enter, browse, search, open, close, minimize, restore and contact without using a mouse. Test Enter, Space, Tab, Shift+Tab and Escape against [W3C keyboard guidance](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html).

### 04 — Minimize/restore discards window state

**Confirmed reproduction:** open Quanta → choose Mori in Finder → scroll → minimize → restore. Window title says **Mori**, content says **Quanta**, scroll resets to zero.

`Desktop.jsx:402` renders only `visibleWindows`. Minimizing unmounts the window and its local state; restoring mounts it from the original `initialId`. Finder view state lives in `FinderTerminal.jsx`, while title lives separately in Desktop. Window size/maximized state and Terminal history also live in unmounted components, so those are additional state-loss risks from the same design.

**Improve:** preserve mounted window state while hiding minimized windows with correct focus/accessibility handling, or lift serializable view, geometry and terminal state into the window model. Derive title and icon from the current view.

**Done when:** minimize/restore preserves selected project, title, icon, scroll, size, maximize state and Terminal history. Add one regression test that changes the Finder selection before minimizing.

### 05 — One live destination is disabled

**Confirmed on the audit date.** `https://taskmanager-api.azurewebsites.net/health` returned **403: Site Disabled**. Quanta, TaskFlow and Mori returned HTTP 200 HTML. See [link evidence](audit/links.json).

**Improve:** restore the API deployment or remove/disable its live CTA with honest status. If the health endpoint remains the public destination, label it “API health” rather than “Live demo.” Do not promise a working application based only on a successful landing response.

**Done when:** every advertised live destination is usable for its stated purpose; unavailable demos have a clear alternative such as source and a recorded walkthrough.

### 06 — Entry ceremony delays the portfolio

**Confirmed behavior; impact is a product hypothesis.** `BootLogin.jsx:45` deliberately waits 4.4 seconds and adds an exit delay, then asks for a password that is not checked. Reload repeats it. No conversion analytics were available to quantify abandonment.

**Improve:** enter the portfolio directly by default, or offer a prominent “Browse projects” action immediately. Keep the boot as an optional replay/experience. Replace the password field with an explicit enter button so the portfolio never encourages typing a real password. Current code does not submit that field to a server.

**Done when:** work and contact are available without waiting or typing; the decorative experience is still available by choice.

### 07 — Search moves selection out of view

**Confirmed.** Open Spotlight and press ArrowDown through the list. LinkedIn became selected at approximately y=1023 while the result viewport ended at y=505; scrollTop remained zero.

`Spotlight.jsx:80` updates selection without scrolling the selected result. `resultsRef` is attached but not used for this purpose.

**Improve:** scroll the active result into view with nearest alignment whenever selection changes. Keep the selected index aligned with the rendered group order. The current project/page/link order happens to match; a future mixed index may not.

**Done when:** arrows keep every selection visible, and Enter opens exactly the visibly selected result for both browse and filtered lists.

### 08 — Assistive-technology semantics and focus need a pass

**Source finding.** Project sections use visual labels instead of section headings. Windows lack a named region/dialog relationship. Spotlight lacks a labelled combobox/listbox relationship, active-descendant state and focus restoration. Opening windows does not move focus into them. Generic “Toggle” labels do not identify which setting they control.

**Improve:** add semantic headings and landmarks, identify windows by title, and deliberately manage focus on opening/closing. Use modal semantics only where interaction is actually modal. Implement Spotlight with a coherent [combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and announce empty results and active selection. Give each switch an accessible name and state.

**Done when:** a screen-reader pass can identify current project, navigate its headings, understand search selection, and return to the triggering control after closing. Automated checks alone are insufficient.

### 09 — Reduced motion is partial

**Confirmed.** With OS reduced-motion emulation, a dock icon still grew from 56px to approximately 89px on hover. `Desktop.jsx` passes only `prefs.dockMag` to Dock. CSS duration overrides do not stop JavaScript geometry updates. FabricBackground reads the OS preference once and does not subscribe to changes.

**Improve:** compute one effective preference from OS and in-app settings, subscribe to OS changes, and apply it to dock geometry, bounce, parallax, boot and window transitions. Skip decorative delays when reduced motion is active.

**Done when:** OS and app settings both prevent magnification and other spatial animation, including when changed during the session.

### 10 — Contrast and type need measured corrections

**CSS finding, not a full contrast certification.** Metadata/section labels use `#86868b` at 10px; links use `#0a84ff` at 13px; primary buttons use white on that blue. These opaque color pairs do not reach 4.5:1 even against pure white, and should not be assumed safe on the translucent light panels. Blurred/translucent states need separate rendered checks.

**Improve:** darken text/link tokens, choose a darker button background for white labels, enlarge small metadata, and test all wallpaper/focus/hover states. Use [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) as the acceptance reference.

**Done when:** ordinary text reaches 4.5:1, qualifying large text reaches 3:1, focus remains visible, and screenshots/labels remain readable on every supported surface.

### 11 — Switching Finder projects keeps old scroll position

**Confirmed.** Scrolling Mori to 500px and choosing seen retained scrollTop=500. `FinderTerminal.jsx:12` changes view/title but never resets or restores a per-project scroll position.

**Improve:** reset to the beginning for a new project, or save per-project positions deliberately.

**Done when:** choosing a project shows its title and introduction on first visit; any restored position is intentional and tied to that project.

### 12 — Window identity and close actions can target the wrong thing

**Source finding.** Switching projects updates the title but leaves the original window ID/icon. Reopening Quanta can therefore focus a window currently showing Mori. Separately, `close-top` and Ctrl/⌘W sort all windows, including minimized ones, whereas the displayed active app is calculated from visible windows.

**Improve:** decide whether Finder is one browser window or whether each project has a dedicated window. Model identity accordingly. Close the focused visible window. Avoid relying on Ctrl/⌘W as the only close shortcut because browsers reserve it.

**Done when:** reopen/focus/close actions consistently refer to the visible content, and minimizing a window cannot cause “Close window” to delete a hidden one instead.

### 13 — Projects cannot be shared or revisited directly

**Source finding.** Project slugs exist but opening a project does not update location/history. Reload resets to boot; a copied URL cannot point a recruiter to Mori or seen.

**Improve:** add stable project URLs, using hash routing if retaining simple static hosting. Support Back/Forward and direct entry that bypasses decoration.

**Done when:** copying a project URL, loading it in a new tab, refreshing and using Back all preserve expected navigation. Unknown IDs show a useful fallback.

### 14 — Production delivery compiles JSX in visitors' browsers

**Source finding.** `index.html` loads React/ReactDOM development builds plus Babel Standalone, then loads every JSX file through Babel. Failure of one external runtime dependency can leave an empty root. Integrity checks help integrity, not availability.

**Improve:** precompile JSX, deliver production React, bundle or self-host the required runtime, and preserve static hosting. A small build step is enough; there is no product need to introduce a server merely for this change. Retain readable source and pin dependencies in a lockfile.

**Done when:** the deployed page performs no JSX compilation, loads production assets, and has a useful fallback on runtime failure. Measure cold mobile performance before and after with a reproducible profile.

### 15 — Idle animation work is continuous

**Confirmed behavior.** A three-second idle sample recorded 360 style recalculations, approximately 64ms of script time and zero layouts. This does not establish a battery-drain estimate, but confirms unnecessary ongoing work.

`FabricBackground.jsx:28` updates React state every animation frame even at rest. `Dock.jsx:72` writes geometry every frame even when magnification is disabled or settled.

**Improve:** stop loops when settled; restart on pointer/resize/preference changes; avoid React state for per-frame wallpaper transforms; suspend animation when the page is hidden.

**Done when:** an idle desktop has no continuous wallpaper/dock updates, while hover and resizing remain smooth. Repeat the same idle measurement to verify the improvement.

### 16 — Search, sharing and failure fallbacks are weak

**Source finding.** Entry HTML has a title and favicon, but no description, social preview metadata, canonical URL or useful static portfolio content. `#root` is empty and there is no `noscript` message. This is a discovery/resilience gap, not proof that all search engines fail to index the site.

**Improve:** render a useful static overview and links, add description/Open Graph metadata and a share image, and use real project URLs. Set canonical metadata only after confirming the deployed domain. Provide a readable no-JavaScript/failure path.

**Done when:** link previews identify the engineer and work, the initial HTML contains meaningful portfolio content, and failed JavaScript still leaves project/contact links accessible.

### 17 — Personal contribution evidence is missing

**Confirmed.** Transcendence, IRC Server, minishell and NEO Risk Visualizer have `TODO` contributions in `data.js`; the UI hides them. Technical descriptions of the overall project do not establish the author's individual work.

**Improve:** supply specific owned components, decisions, tests and links to relevant code/PRs. Recheck strong claims such as frame rates, test counts and time-to-match against dated evidence; the [Transcendence source README](https://github.com/NourMellal/transcendence) describes its under-30-second target as a goal, while the portfolio presents it as an outcome.

**Done when:** all contributor entries distinguish personal work from team scope and every quantitative claim has a source or is clearly labelled as a goal. This requires owner input; do not invent contributions.

### 18 — Screenshot coverage and usefulness are uneven

**Confirmed.** Enterprise Task Manager, TaskManager API, GEObrief, BigQuery ETL, IRC Server and NEO Risk Visualizer use gradient-only image entries. Eight of fourteen projects have real screenshots. Empty panels are visually large without providing evidence.

**Improve:** add current captures, meaningful architecture/output examples, or omit the hero region until evidence exists. Do not label a gradient as though it were a screenshot. Allow full-size viewing; ensure captures match the currently described version and logo.

**Done when:** every visible media panel conveys real project evidence, captions state what it proves, and images can be inspected without cropping away important content.

### 19 — Portfolio source links are misdirected

**Confirmed in data.** Help → “View portfolio source” (`data.js:392`) and Spotlight → “Portfolio source” (`Desktop.jsx:244`) link to the GitHub profile.

**Improve:** point both to `https://github.com/abouguri/macOS-portfolio` and centralize the URL.

**Done when:** both actions open this repository, while the regular GitHub action still opens the profile.

### 20 — The first screen does not explain the engineer's value

**Product recommendation.** Visitors see fourteen evenly weighted icons, an initial and an account handle. Role and biography are hidden in About. There is no selected work sequence, availability statement or résumé link. The tone is personal, but “when I want pain” and “allergic to messy code” do not tell a hiring visitor which problems this engineer can solve.

**Improve:** add a short visible introduction, three or four selected projects, an obvious contact action, and an optional résumé if one exists. Keep technical detail in case studies. Separate system/language breadth from the strongest current product work. Use a brief problem → responsibility → result structure before architecture details.

**Done when:** a new visitor can identify role, strongest work and contact route without discovering hidden desktop conventions. Validate with a small observed usability session rather than assuming the copy works.

### 21 — Gesture and layout recovery need strengthening

**Source finding.** Icons, window resizing and sliders rely on mouse events. Saved icon positions are merged without shape/range validation. Icon dragging is not clamped, and there is no reset action. Mouse listeners installed during a gesture are removed on mouseup, not explicitly on unmount/cancellation.

**Improve:** adopt Pointer Events and pointer capture, handle cancellation/unmount, validate stored finite coordinates, and provide a safe reset. Keep a pointer-free alternative to drag actions.

**Done when:** mouse, touch and pen interactions have defined behavior; malformed/off-screen saved positions can be recovered; canceling a gesture leaves no active listeners or stuck state.

### 22 — The design system and documentation have drifted

**Source finding.** Many UI colors, spacing and animation constants bypass `colors_and_type.css`. The token file still names “Yemazar.” Old fabric/intro rules remain beside the current wallpaper/boot implementation. Fonts are requested from both the HTML and a CSS import, although the original cursive intro is no longer mounted. Terminal technology categories are manually maintained.

The README still claims roughly 163KB source/460KB assets and says “just open index.html” before later explaining the required server. Current logical on-disk totals in this audit are 172,220 bytes of top-level runtime source and 467,194 bytes of assets, excluding docs and CDN dependencies; filesystem `du` totals differ. README images predate the new projects.

**Improve:** consolidate active component styles and tokens, remove verified dead code/font requests, clarify display units, make setup instructions consistent, and distinguish automatic project-derived data from editorial summaries. The icon convention and review links have been corrected in this change; the remaining documentation drift still needs attention.

**Done when:** token changes affect the intended components, no unused fonts are fetched, documentation matches a clean checkout, and screenshots are dated or regenerated when UI changes.

### 23 — Verification and deployment checks are not reproducible

**Repository finding.** There is no package manifest, lockfile, CI workflow or automated regression suite in the portfolio. The screenshot script requires manually installing Playwright. This audit used tooling already present elsewhere on the machine; it is not a clean-checkout test setup.

**Improve:** add a minimal, pinned validation setup when introducing the build. Prioritize data/asset validation, desktop and mobile project opening, keyboard search, minimize/restore state and link checks. Define release checks for contrast and assistive technology separately. Review deployed cache and security headers once the actual portfolio host is known; local Python-server headers say nothing about production configuration.

**Done when:** a clean checkout has documented commands that build and exercise the main user journeys in CI, with screenshots or failure evidence. Test behavior, not just implementation details.

### 24 — Simulated system controls compete with the portfolio

**Source finding; product recommendation.** Battery is fixed at 82%; Wi-Fi/Bluetooth/Focus are simulated; the sound slider changes local state but is not connected to the startup chime. Brightness can dim the whole page substantially. These interactions demonstrate craft but may distract from project discovery.

**Improve:** simplify the default chrome and place the simulation behind a clearly labelled experience mode. If controls remain, make their effects consistent and provide a reset. Do not imply access to real device networking or battery status.

**Done when:** every exposed control has an understandable effect, and visitors can reliably return to a readable default view.

### 25 — Reading, copying and media access need web conventions

**Source finding.** `portfolio.css:13` disables selection across the body; only Terminal explicitly restores it. Project screenshots are CSS background images in `WindowContent.jsx`, so they lack image alternatives, native open/save behavior and loading hints. There is no dedicated print layout.

**Improve:** enable text selection in content, use semantic images with appropriate descriptions and dimensions, add an accessible full-size viewer, and supply a simple print/read-only project view. Keep selection disabled only on drag handles/chrome where needed.

**Done when:** descriptions can be copied, screenshots are understandable without seeing the bitmap, full-size captures can be inspected, and printing produces readable project content.

## Recommended implementation sequence

1. **Repair access and correctness:** fix the disabled demo/link labels, responsive grid and mobile reader; implement keyboard-operable primary controls; preserve window state and fix the focused-window model.
2. **Make browsing direct:** bypass decorative entry by default, add project URLs/history, fix search scrolling and Finder scroll behavior, and introduce visible role/selected work/contact.
3. **Complete accessible delivery:** finish focus/semantics, reduced motion, contrast, static fallback and production asset compilation. Make these changes with a small repeatable regression suite.
4. **Strengthen evidence:** fill contributor write-ups, add the six missing media sets, verify quantitative claims and current demos, and update README captures.
5. **Polish and maintain:** idle-loop optimization, token consolidation, pointer recovery, print/copy support and clearer simulation controls.

Keep the desktop experience as a distinctive presentation layer. A straightforward mobile and reading view can use the same project data, so this does not require maintaining two independent portfolios.

## Acceptance checklist for the next release

- Every project can be opened and read at 320–1440px without unreachable controls.
- Enter, Tab, arrows and Escape cover all primary navigation; focus is visible and restored appropriately.
- Minimizing/restoring preserves window content and state.
- Search selection is always visible and opens the expected result.
- OS and in-app reduced motion stop spatial animation.
- Live links are checked and labelled accurately; source links point to the correct repository.
- Each project has a stable shareable URL and a useful static/failure fallback.
- Personal contributions and major outcome claims have evidence.
- Production assets are precompiled, and cold mobile/idle behavior is measured using a repeatable setup.
- The introduction, selected work and contact route are obvious without learning the desktop metaphor.
