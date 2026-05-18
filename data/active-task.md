# Active Task

## NOW — Swim Intake Form
File: `swim.html`
Current state: form uses `mailto:` which opens the device email app — unreliable on mobile.

### What "finish" means:
- Connect to Formspree (free tier, no backend needed) OR Netlify Forms
- On submit: POST to form endpoint, show success state
- Keep the existing success UI (`#success-state`)
- Add: child's swimming ability detail, preferred session days
- Fix: Unsplash hero image (same file:// problem as medical demo)

### Next steps:
1. Sign up for Formspree at formspree.io, get form endpoint
2. Replace mailto: with fetch() POST
3. Add `action="https://formspree.io/f/YOUR_ID"` OR use fetch API

## NEXT — Main Site Redesign (3 concepts)
File: `index.html` (current), create new mockups
Context: Cary Park Solutions, dad/freelancer brand, serving Triangle NC
Reference: LinkedIn profile + recent job search context (ask user for details)
Timing: daughter's nap, midday tomorrow
