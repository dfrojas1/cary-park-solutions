# Cary Park Solutions — Project Context

## Who you're working with
Stay-at-home dad / freelance web builder based in the Raleigh-Clayton, NC area.
Building Cary Park Solutions as a web services business targeting local small businesses,
medical practices, and community services (swim lessons, etc.).

## Business context
- **Cary Park Solutions** — web design & dev agency, pitching to local businesses
- Typical client: small medical practice, local service business, HOA community
- Target: clean, modern, mobile-first sites; demo-first sales approach
- Email: info@caryparksolutions.com

## Active projects & files

| File | Purpose | Status |
|------|---------|--------|
| `cary-park-v2/medical/index.html` | Medical practice demo (Triangle Hand & Shoulder) | Live on branch |
| `swim.html` | Summer swim lessons signup (Clayton, NC) | Needs form backend |
| `index.html` | Cary Park Solutions main site | Exists, needs redesign |
| `web.html` | Web services page | Exists |
| `euc.html` | Unknown | Exists |
| `travel.html` | Unknown | Exists |

## Branch
All active work: `claude/medical-practice-demo-OKKKd`
Always push to this branch. Never push to main without asking.

## Design system rules (medical demo)
- Fonts: `Source Serif 4` (headings) + `DM Sans` (body)
- Colors: `--blue: #1a5fa8`, `--teal: #0d9488`, `--text: #1a1a2e`
- **NEVER use external image URLs** — Unsplash/picsum both fail from file:// on iOS.
  Use CSS gradient panels + inline SVG instead.
- CSS-only animations (`@keyframes slideUp` + `animation-fill-mode:both`).
  **NEVER** use IntersectionObserver for opacity reveals — causes white sections on iOS Chrome.
- Mobile: 44px tap targets, `max-height` hamburger (not display:none), `100svh` hero,
  `-webkit-backdrop-filter`, `touch-action:manipulation`, `@media(hover:hover)` guards

## Known gotchas
1. `opacity:0` in JS → white screen on iOS Chrome. Always use CSS animation with `fill-mode:both`.
2. Unsplash: blocks requests with no referrer (file:// protocol). picsum.photos also blocked from
   some networks. Solution: always use CSS gradient + inline SVG for self-contained files.
3. Test with `python3 -m http.server 8888` + Playwright, not curl (curl gets SSL blocks from CDNs).
4. Playwright: use specific element selectors, not `:first-of-type`.

## Priorities (as of May 2026)
1. **Swim intake form** — needs real form submission backend (currently mailto: fallback)
2. **Main Cary Park site redesign** — 3 design targets (do during daughter's nap, midday)
3. **Medical demo** — ongoing refinements, use as sales tool

## Session startup checklist
- Read `data/context.md` if it exists (updated daily notes)
- Read `data/active-task.md` for current sprint focus
- Check git log: `git log --oneline -10`

## Placeholder content
- Phone: (919) 000-0000
- Address: 3701 Wake Forest Rd Suite 100, Raleigh NC 27609
- All doctor names (Post, Messer, Erickson) are placeholders
