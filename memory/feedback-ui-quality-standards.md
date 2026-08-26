---
name: feedback-ui-quality-standards
description: Feedback on UI quality — no generic AI slop, proper OG-level dashboards
metadata:
  type: feedback
---

The rider dashboard UI is boring, generic, and rushed. Not "OG" quality.

**Specific complaints that are always true:**
- Buttons should NOT be full-width on desktop. That's lazy mobile-first cargo-culting.
- Don't dump every API field into one card/div. Break information up with purpose — modals, dropdowns, breadcrumbs, segmented controls, etc.
- Every element needs a UX reason to exist. If a card feels fatiguing to look at, too much stuff is crammed in.
- Micro-interactions matter: toggles, transitions, hover states, modals, breadcrumbs, progress indicators.
- Loading = skeleton placeholders, not spinners everywhere.
- Empty states should feel intentional, not like "no data yet" template text.
- Typography needs hierarchy — leading, tracking, weight contrast.
- Spacing needs to breathe. Stop using p-4/gap-3 as the default answer.
- Color system needs to be coherent — one accent color, used consistently. Not teal+amber+blue+emerald in the same layout.
- Don't take feedback literally and regurgitate it as code. Design, don't template.

**Why:** User wants a dashboard that feels good to use and look at — clean, slick, well-structured, intentional. Not generic AI output that checks boxes without caring.

**How to apply:** Before writing UI, ask: "Does this feel good? Is this how Stripe/Linear/OG apps do it?" Prioritize UX depth over feature breadth. Every screen should feel considered.