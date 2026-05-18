# Daily Context — Updated: 2026-05-18

## What happened today
- Built medical practice demo (Triangle Hand & Shoulder Center) from scratch
- Fixed iOS white-screen: replaced JS IntersectionObserver with CSS @keyframes
- Fixed broken images (3 iterations): Unsplash → picsum → CSS gradient art (final solution)
- CSS gradient + inline SVG is now the standard for self-contained demo files

## Active sprint
- [ ] Swim intake form: add real form backend (Formspree or Netlify Forms recommended)
- [ ] Main Cary Park site: 3 design mockups
- [ ] Medical demo: polish and use as sales tool

## Decisions made
- No external image CDNs in standalone HTML files. Period.
- CSS-only animations, always `animation-fill-mode: both`
- Always test image loading before shipping (grep for <img src="http)

## Tomorrow
- Morning: Finish swim intake form
- Midday (daughter's nap): 3 site design targets for Cary Park main site
