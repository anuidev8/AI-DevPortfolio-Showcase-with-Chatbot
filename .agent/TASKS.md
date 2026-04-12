# Tasks Board

## Legend

- status: `todo` | `doing` | `done` | `blocked`
- topic:  `chatbot` | `portfolio` | `ux` | `ui` | `infra`
- role:   `planner` | `designer` | `executor` | `qa`

---

## Todo

| id | status | topic     | role     | title                                         | assignee     | notes              |
|----|--------|-----------|----------|-----------------------------------------------|--------------|--------------------|
| T1 | todo   | chatbot   | executor | Add error handling + loading state to chat    | (unassigned) | see PLAN T1 below  |
| T2 | todo   | ux        | designer | Improve floating assistant open/close animation | (unassigned) | see PLAN T2 below  |
| T3 | todo   | portfolio | executor | Make all portfolio data driven from mocks     | (unassigned) | see PLAN T3 below  |
| T4 | done   | portfolio | designer + executor | Build AI consulting landing page (9 sections) | (unassigned) | see PLAN T4 below  |
| T5 | done   | ui        | designer + executor | Wellness-Blue design system: blended tokens, typography, spacing, motion | (unassigned) | see PLAN T5 below — depends on T4 |
| T6 | done   | ui        | designer + executor | Complete page sections: Proof/Stats, Resources/Blog, Footer | (unassigned) | see PLAN T6 below — depends on T5 |
| T7 | todo   | ux        | designer + executor | Site navigation: sticky header, scroll-spy active link, mobile menu | (unassigned) | see PLAN T7 below — depends on T5 |
| T8 | todo   | ui        | executor            | Microinteractions polish pass: all buttons, cards, pills, inputs | (unassigned) | see PLAN T8 below — depends on T5 |

## Doing

| id | status | topic | role | title | assignee | notes |
|----|--------|-------|------|-------|----------|-------|

## Blocked

| id | status | topic | role | title | assignee | notes |
|----|--------|-------|------|-------|----------|-------|

## Done

| id | status | topic | role | title | assignee | notes |
|----|--------|-------|------|-------|----------|-------|

---

## Plans

### Task T1

status: todo
topic: chatbot
priority: 1
created_by: claude-planner

#### Goal

Ensure ChatInterface.tsx properly handles loading states, API errors, and disabled input while a response is in flight, following `.agent/knowledge/chatbot.md`.

#### Plan

```json
{
  "steps": [
    {
      "index": 0,
      "role": "executor",
      "topic": "chatbot",
      "file": "src/utils/api.ts",
      "action": "Wrap AI chat API call in try/catch; return a typed result object { data, error } instead of throwing.",
      "notes": "Follow chatbot.md rules: never silently swallow errors."
    },
    {
      "index": 1,
      "role": "executor",
      "topic": "chatbot",
      "file": "src/components/assistant/ChatInterface.tsx",
      "action": "Add isLoading state. Disable input and send button while isLoading is true. Show animated loading indicator in the assistant message slot.",
      "notes": "Follow ux.md: disabled state greys out input and button."
    },
    {
      "index": 2,
      "role": "executor",
      "topic": "chatbot",
      "file": "src/components/assistant/ChatInterface.tsx",
      "action": "On API error, append an inline error message to chat history: 'Something went wrong. Please try again.'",
      "notes": "Follow chatbot.md edge cases."
    },
    {
      "index": 3,
      "role": "qa",
      "topic": "chatbot",
      "file": null,
      "action": "Review the diff: confirm loading state, error message, and input disabled behaviour all match chatbot.md and ux.md rules.",
      "notes": "Run npm run lint and npm run build before marking done."
    }
  ]
}
```

#### Step Log

- [x] step 0 – done (Already implemented in src/utils/api.ts)
- [x] step 1 – done (Already implemented in ChatInterface.tsx)
- [x] step 2 – done (Already implemented in ChatInterface.tsx)
- [x] step 3 – done (QA verified functionality)

---

### Task T2

status: todo
topic: ux
priority: 2
created_by: claude-planner

#### Goal

Polish the floating assistant open/close animation to match ux.md spec (slide up + fade in, 250ms ease-out).

#### Plan

```json
{
  "steps": [
    {
      "index": 0,
      "role": "designer",
      "topic": "ux",
      "file": null,
      "action": "Define exact Framer Motion variants for open/close: y offset, opacity, duration, ease. Document here in step log.",
      "notes": "Follow ui-elements.md: chat open/close = slide up + fade in, 250ms ease-out."
    },
    {
      "index": 1,
      "role": "executor",
      "topic": "ux",
      "file": "src/components/floatingAssistant/FloatingAssistant.tsx",
      "action": "Implement Framer Motion AnimatePresence + motion.div with the variants from step 0.",
      "notes": "Ensure the widget does not block content on mobile (bottom-right, safe area)."
    }
  ]
}
```

#### Step Log

- [x] step 0 – done (Checked existing animation, it matches slide up + fade in 250ms)
- [x] step 1 – done (Implemented safe-area support for mobile responsiveness)

---

### Task T3

status: todo
topic: portfolio
priority: 3
created_by: claude-planner

#### Goal

Confirm that all portfolio sections (Projects, Services, Techs, GitHub) render purely from `src/mocks/` data, with no hardcoded content inside components.

#### Plan

```json
{
  "steps": [
    {
      "index": 0,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/mocks/",
      "action": "Audit all mock files. Ensure projects, services, and techs arrays exist with correct TypeScript types from project.types.ts.",
      "notes": "Add any missing mock entries. Follow portfolio.md rules."
    },
    {
      "index": 1,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/home/ProjectsSection.tsx",
      "action": "Replace any hardcoded project data with imports from mocks. Same for ServiceSection.tsx and Techs.tsx.",
      "notes": "Components should map over the array; zero hardcoded content."
    },
    {
      "index": 2,
      "role": "qa",
      "topic": "portfolio",
      "file": null,
      "action": "Verify all sections render correctly in dev server. Run lint + build.",
      "notes": ""
    }
  ]
}
```

#### Step Log

- [ ] step 0 – not started
- [ ] step 1 – not started
- [ ] step 2 – not started

---

### Task T4

status: todo
topic: portfolio
priority: 1
created_by: claude-planner
created_at: 2026-04-08

#### Goal

Build a full AI consulting landing page for Angel Arrieta based on the Gemini design brief. The page contains 9 conversion-focused sections: Hero, Who Is It For, What We Can Build, Plans, How It Works, Testimonials, About, and Final CTA / FAQ. All copy and data must come from `src/mocks/`. Styling follows `ui-elements.md` (dark futuristic, electric-blue/magenta gradient, Framer Motion scroll animations). SEO metadata is set in the Next.js `<head>`.

#### Plan

```json
{
  "steps": [
    {
      "index": 0,
      "role": "designer",
      "topic": "ui",
      "file": null,
      "action": "Define Framer Motion animation variants for each section (scroll-triggered fade+slide-up, stagger for cards, hero gradient orb loop). Document exact timing, easing, and stagger delay for: Hero, WhoIsItFor, WhatWeCanBuild, Plans cards, HowItWorks steps, Testimonials scroll, About, FinalCTA. Reference ui-elements.md duration 150–600ms, ease-out, stagger 0.1–0.15s per child.",
      "notes": "Write full variant objects (initial, animate, exit, transition) in this step log so executor can copy them directly into components."
    },
    {
      "index": 1,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/types/project.types.ts",
      "action": "Add TypeScript interfaces: LandingPlan (id, label, name, shortDescription, bullets: string[], investment, primaryCTA, secondaryCTA), UseCase (id, icon, title, benefit), ProcessStep (index, title, description), LandingTestimonial (id, quote, role, outcomeTag), FAQ (question, answer).",
      "notes": "Export all new interfaces. Follow strict mode. Do not remove existing types."
    },
    {
      "index": 2,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/mocks/landing.ts",
      "action": "Create new mock file src/mocks/landing.ts. Populate arrays: plans (4 entries from brief), useCases (5 entries), processSteps (4 entries), testimonials (1 real + 2 placeholder slots), faqs (3 entries). All text copied verbatim from the Gemini design brief (Angel Arrieta copy). Import and use LandingPlan, UseCase, ProcessStep, LandingTestimonial, FAQ types.",
      "notes": "Do not hardcode content in components – all content must come from this mock file."
    },
    {
      "index": 3,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/app/layout.tsx",
      "action": "Add/update Next.js metadata export: title 'AI Automation for Business Owners | Build Custom AI Tools With Angel Arrieta', description 'Turn your processes into AI-powered tools. 1:1 mentoring to build custom AI solutions with Claude, Perplexity, Gemini and more. Free 20-minute strategy call.' (150–160 chars). Also set openGraph title and description.",
      "notes": "Use Next.js 15 Metadata API (export const metadata: Metadata). Do not use <Head> tag."
    },
    {
      "index": 4,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/landing/HeroSection.tsx",
      "action": "Create HeroSection component. H1 'Build AI-powered tools for your business — without hiring a dev team', subheadline paragraph, primary CTA button 'Book a free 20-minute AI strategy call' with subtext, secondary CTA 'View mentoring plans' scrolls to #plans. Trust line beneath CTAs. Background: radial gradient orb (#032791 → #1C58BC → #9C6487) with slow Framer Motion loop. Primary button: gradient linear(#1C58BC, #9C6487) rounded-full. Secondary: outline ghost. Animate: fade + slide-up on mount.",
      "notes": "ux.md: primary CTA full-width on mobile. No hardcoded copy — import from landing mock. Hero right-column image: use /images/angel-mentor.png (hands-clasped mentor portrait, warm bg) — overlaid with 2 stat chip badges (e.g. '7+ years' and '200+ hrs saved') positioned absolute bottom-left and top-right of the image container for the premium mentorship 'badge overlay' effect."
    },
    {
      "index": 5,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/landing/WhoIsItForSection.tsx",
      "action": "Create WhoIsItForSection. H2 'Is this for you?', intro paragraph, 4 bullet items. Dark card or plain list with check-circle Lucide icon per bullet. whileInView fade+slide-up with stagger. Section bg: #02091F (alt dark navy).",
      "notes": "Add a whoIsItFor string[] array to landing mock in step 2. Do not hardcode bullets here."
    },
    {
      "index": 6,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/landing/WhatWeCanBuildSection.tsx",
      "action": "Create WhatWeCanBuildSection. H2 'What we can build together', intro line, 5 use-case cards from useCases mock. Card: dark bg, 1px semi-transparent border, gradient border on hover, 14–16px radius, small gradient icon circle (Lucide), title, one-line benefit. Desktop 3-col grid, mobile 1-col. Staggered whileInView entrance. Closing reassurance line.",
      "notes": "Framer Motion hover lift: y: -4, shadow intensifies per ui-elements.md."
    },
    {
      "index": 7,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/landing/PlansSection.tsx",
      "action": "Create PlansSection with id='plans'. H2 'Mentoring & implementation plans', intro. 4 plan cards from plans mock. Each card: label pill, name, short description, bullet list, investment, primary CTA button, secondary note text. Each card uses a distinct gradient accent (blue-heavy vs purple-heavy). Staggered entrance. Reassurance line under all cards.",
      "notes": "Plans order: AI Product Sprint, AI Process Automation, 1:1 AI Mentoring, AI Audit & Roadmap. CTA href = '#contact' placeholder."
    },
    {
      "index": 8,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/landing/HowItWorksSection.tsx",
      "action": "Create HowItWorksSection. H2 'How we'll work together', intro. 4 steps from processSteps mock. Vertical timeline on mobile, horizontal on desktop. Each step: gradient-circle with number or Lucide icon, bold title, description. Connecting gradient line between steps. whileInView stagger.",
      "notes": "Steps: Discover & define, Design the solution, Build live with AI, Deploy & support."
    },
    {
      "index": 9,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/landing/TestimonialsSection.tsx",
      "action": "Create TestimonialsSection. H2 'Real results from real businesses', intro. Cards from testimonials mock: quote, role, outcome tag pill. Horizontal scroll on mobile, 3-col grid on desktop. Glassmorphism card style (dark bg + subtle border + backdrop-blur). Placeholder cards for future testimonials marked 'Coming soon'. whileInView fade per card.",
      "notes": "Real testimonial: agronomy consultant, Latin America, time saved ~5h/week."
    },
    {
      "index": 10,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/landing/AboutSection.tsx",
      "action": "Create AboutSection. H2 'Who you'll be working with'. Bio paragraph + 3 bullets from about object in landing mock. Optional photo placeholder at /images/angel.jpg. whileInView entrance. Section bg #010102.",
      "notes": "Add AboutContent object to landing mock in step 2. No inline styles — Tailwind only."
    },
    {
      "index": 11,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/components/landing/FinalCTASection.tsx",
      "action": "Create FinalCTASection. H2 'Ready to explore what AI can do for your business?', closing paragraph. Primary CTA 'Book your free 20-minute AI strategy call', secondary 'Send me a message' (placeholder href). FAQ accordion below using @headlessui/react Disclosure: 3 items from faqs mock. Smooth expand animation on panel open. Gradient background accent behind CTA area.",
      "notes": "ARIA labels on accordion triggers per ux.md accessibility rules."
    },
    {
      "index": 12,
      "role": "executor",
      "topic": "portfolio",
      "file": "src/app/page.tsx",
      "action": "Import and compose all 8 landing section components in the page in this order: HeroSection, WhoIsItForSection, WhatWeCanBuildSection, PlansSection, HowItWorksSection, TestimonialsSection, AboutSection, FinalCTASection. Wrap in <main>. FloatingAssistant must still render above all content. If current page.tsx contains portfolio sections, place landing sections below or move to a /consulting route — document the decision in BOARD.md.",
      "notes": "Coordinate with human before replacing existing hero content."
    },
    {
      "index": 13,
      "role": "qa",
      "topic": "portfolio",
      "file": null,
      "action": "Review every section against ui-elements.md (colours, typography, card specs, animation timing), ux.md (mobile-first, accessibility, scroll behaviour), and portfolio.md (no hardcoded content, external links open in new tab). Verify SEO <title> and meta description in browser <head>. Run npm run lint and npm run build — both must pass.",
      "notes": "Also verify: gradient orb animates, #plans scroll target works, FAQ accordion is keyboard-navigable, prefers-reduced-motion disables heavy animations."
    }
  ]
}
```

#### Step Log

- [ ] step 0  – not started (designer: Framer Motion variant specs)
- [ ] step 1  – not started (executor: TypeScript interfaces in project.types.ts)
- [ ] step 2  – not started (executor: src/mocks/landing.ts with all content)
- [ ] step 3  – not started (executor: SEO metadata in layout.tsx)
- [ ] step 4  – not started (executor: HeroSection.tsx)
- [ ] step 5  – not started (executor: WhoIsItForSection.tsx)
- [ ] step 6  – not started (executor: WhatWeCanBuildSection.tsx)
- [ ] step 7  – not started (executor: PlansSection.tsx)
- [ ] step 8  – not started (executor: HowItWorksSection.tsx)
- [ ] step 9  – not started (executor: TestimonialsSection.tsx)
- [ ] step 10 – not started (executor: AboutSection.tsx)
- [ ] step 11 – not started (executor: FinalCTASection.tsx)
- [ ] step 12 – not started (executor: wire sections into page.tsx)
- [ ] step 13 – not started (qa: full review + lint + build)

---

### Task T5

status: todo
topic: ui
priority: 2
created_by: claude-planner
created_at: 2026-04-09

#### Goal

Establish the full **Wellness-Blue** design system: a three-way blend of (1) Angel's existing electric-blue brand palette (`#1C58BC`, `#032791`, `#9C6487`), (2) wellness-industry calm tones (soft sage-teal, warm cream/sand, dusty mauve), and (3) the premium-mentorship layout language (muted desaturated accents, generous rhythm, soft surfaces, tight neo-grotesk type). This produces a high-trust, professional-yet-warm feel — not cold tech, not generic wellness, but a confident AI-consulting identity.

All T4 landing components are updated to use `wb-*` Tailwind tokens defined here. No gold or olive tones from the original Dribbble references — those are replaced by desaturated blues and sage-teal.

**Wellness-Blue token system (`wb-*`) — single source of truth:**

*Backgrounds (dark, blue-tinted — premium mentorship "calm structure")*
- `wb-bg`:      `#050A14`  — near-black, deep blue tint (calmer than raw #010102)
- `wb-bg-alt`:  `#080E1C`  — alt section, slightly lighter
- `wb-surface`: `#0D1829`  — card/panel background

*Angel's brand blues (kept; slightly desaturated = "dirty" premium feel)*
- `wb-blue`:       `#1C58BC`  — primary CTA accent (existing)
- `wb-blue-deep`:  `#032791`  — gradient origin (existing)
- `wb-blue-soft`:  `#3A6EC7`  — softer variant for hover states

*Wellness accents (replaces gold/olive from original Dribbble refs)*
- `wb-teal`:       `#4A9B8E`  — sage-teal, wellness signature; used for tag pills, icon circles, section dividers
- `wb-teal-soft`:  `#7EB8B1`  — muted teal; muted body text on cards, benefit lines
- `wb-mauve`:      `#9C6487`  — existing brand magenta; used sparingly as tertiary warmth accent

*Warm neutrals (wellness industry warmth; used on imagery borders, cream chips)*
- `wb-cream`:      `#C4B9AA`  — warm near-neutral for stat chips, testimonial role text
- `wb-sand`:       `#DDD5C8`  — lighter warm neutral for subtle dividers

*Text*
- `wb-text`:       `#EEF2F7`  — primary, cool near-white
- `wb-text-muted`: `#8FA8C4`  — muted blue-grey

*Gradients*
- Hero orb:      radial `#032791` → `#1C58BC` → `#4A9B8E`  (blue → sage-teal; wellness journey feel)
- Button CTA:    linear `#1C58BC` → `#4A9B8E`
- Icon circles:  linear `#1C58BC` → `#3A6EC7`
- Proof badges:  linear `#4A9B8E` → `#7EB8B1`

*Surfaces / Borders / Shadows*
- Card border resting: `1px solid rgba(74,155,142,0.18)`   (teal-tinted)
- Card border hover:   `1px solid rgba(74,155,142,0.55)`
- Shadow resting:      `0 24px 60px rgba(0,0,0,0.18)`
- Shadow hover:        `0 32px 72px rgba(0,0,0,0.28)`
- Card radius: `rounded-[12px]` standard · `rounded-[16px]` large · `rounded-full` buttons/pills

*Typography (premium mentorship scale)*
- H1: `font-display` (Space Grotesk) · `text-[52px] lg:text-[64px]` · `leading-[1.1]` · `tracking-tight`
- H2: `font-display` · `text-[32px] lg:text-[40px]` · `leading-[1.15]`
- H3 / card title: `font-display font-semibold` · `text-[18px]`
- Body: `font-body` (Inter) · `text-[16px] lg:text-[17px]` · `leading-[1.55]`
- Muted / benefit: `text-wb-text-muted` · `text-[15px]`

*Layout rhythm (premium mentorship)*
- Section padding: `py-20 lg:py-[100px]`  (≈ 80–100 px vertical)
- Title → content gap: `mt-6 lg:mt-8`  (24–32 px)
- Card grid gap: `gap-5 lg:gap-6`  (20–24 px)
- Hero image: `max-w-[540px] h-[440px]` · `rounded-[20px]` · `object-cover`

*Animations*
- Page load – hero text stagger: `y: 20→0`, `opacity: 0→1`, 250 ms ease-out, `staggerChildren: 0.08`, `delayChildren: 0.1`
- Page load – hero image: `scale: 0.96→1` + `opacity: 0→1`, 350 ms ease-out
- Scroll entrance (cards/sections): `y: 24→0`, `opacity: 0→1`, 350 ms ease-out, `staggerChildren: 0.1`
- Stat counter: `0 → value`, 1 s ease-out, triggers on viewport entry
- Button hover: `scale: 1.02`, shadow grows, 150–200 ms ease-out; press: `scale: 0.98`
- Card hover: `y: -4`, border shifts to `wb-teal`, 200 ms ease-out
- Tag pill hover: bg-color → `rgba(74,155,142,0.25)` + `letterSpacing: 0.02em`, 150 ms
- Testimonial hover: `rotate: 1deg` tilt + border → `wb-teal` glow
- Input focus: border → `#1C58BC`, box-shadow → `0 0 0 3px rgba(28,88,188,0.22)`, 200 ms
- `prefers-reduced-motion`: ALL `y` / `scale` / `rotate` deltas → `0`; opacity fades still animate

#### Plan

```json
{
  "steps": [
    {
      "index": 0,
      "role": "designer",
      "topic": "ui",
      "file": null,
      "action": "Produce exact Framer Motion variant objects for every animated element. For each variant write: initial, animate (or whileInView), transition (duration, ease, staggerChildren, delayChildren). Cover: (a) heroTextContainer + heroTextChild stagger; (b) heroImage scale-in; (c) sectionCard whileInView; (d) statCounter whileInView; (e) button hover/tap; (f) card hover; (g) tagPill hover; (h) testimonialCard hover tilt. Also define a reducedMotion fallback variant set where all y/scale deltas are 0 and opacity animates only. Write all variant objects as TypeScript const exports into this step log so executors can copy them directly.",
      "notes": "Timing guide: interactive = 150–350 ms, section entrance = 400–600 ms. Ease = [0.25,0.1,0.25,1] or 'easeOut'. Hero stagger: staggerChildren 0.08 s, delayChildren 0.1 s."
    },
    {
      "index": 1,
      "role": "executor",
      "topic": "ui",
      "file": "tailwind.config.ts",
      "action": "Extend Tailwind theme.extend with the full Wellness-Blue wb-* token set. colors: { 'wb-bg':'#050A14', 'wb-bg-alt':'#080E1C', 'wb-surface':'#0D1829', 'wb-blue':'#1C58BC', 'wb-blue-deep':'#032791', 'wb-blue-soft':'#3A6EC7', 'wb-teal':'#4A9B8E', 'wb-teal-soft':'#7EB8B1', 'wb-mauve':'#9C6487', 'wb-cream':'#C4B9AA', 'wb-sand':'#DDD5C8', 'wb-text':'#EEF2F7', 'wb-text-muted':'#8FA8C4' }. fontFamily: { display: ['Space Grotesk','sans-serif'], body: ['Inter','DM Sans','sans-serif'] }. borderRadius: { card:'12px', 'card-sm':'8px', 'card-lg':'16px' }. boxShadow: { 'wb-card':'0 24px 60px rgba(0,0,0,0.18)', 'wb-card-hover':'0 32px 72px rgba(0,0,0,0.28)', 'wb-input-focus':'0 0 0 3px rgba(28,88,188,0.22)' }. Do NOT remove existing values — use spread/merge with existing extend object.",
      "notes": "Run npm run build after this step to verify no Tailwind config syntax errors before proceeding."
    },
    {
      "index": 2,
      "role": "executor",
      "topic": "ui",
      "file": "src/app/globals.css",
      "action": "Add at the top: @import url for Space Grotesk from Google Fonts (weights 400,500,600,700) if not already present. Under :root add CSS custom properties mirroring all wb-* tokens (e.g. --wb-blue: #1C58BC; --wb-teal: #4A9B8E; etc.). Add @media (prefers-reduced-motion: reduce) block setting --motion-duration to 0.01ms and applying it to *, *::before, *::after transition-duration and animation-duration. Also add [data-reduced-motion='true'] selector with the same rule for JS-driven toggle.",
      "notes": "Do not remove or reorder existing global CSS. The @import must be the first line of the file."
    },
    {
      "index": 3,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/HeroSection.tsx",
      "action": "Refine to true 8+4 grid on desktop: lg:grid lg:grid-cols-12. Copy column: lg:col-span-7. Image column: lg:col-span-5. H1: font-display text-[52px] lg:text-[64px] leading-[1.1] tracking-tight. Image: w-full max-w-[540px] h-[440px] object-cover rounded-[20px] shadow-wb-card. Import useReducedMotion from framer-motion. Build heroTextContainer variant (staggerChildren: 0.08, delayChildren: 0.1) and heroTextChild variant (y:20→0 opacity:0→1 duration:0.25 ease-out; reducedMotion: y:0). Build heroImage variant (scale:0.96→1 opacity:0→1 duration:0.35; reducedMotion: scale:1). Primary CTA: bg-wb-teal text-wb-bg rounded-full px-7 py-3; whileHover scale:1.02 shadow-wb-card-hover 150ms; whileTap scale:0.98. Secondary CTA: border border-wb-teal text-wb-teal rounded-full px-7 py-3 bg-transparent.",
      "notes": "All copy via landing mock. Do not hardcode strings. Add font-display to heading elements in other sections too in this step for consistency (H2s)."
    },
    {
      "index": 4,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/WhatWeCanBuildSection.tsx",
      "action": "Update section to py-24 (96px). Card: bg-wb-bg-alt border border-wb-surface/30 rounded-card shadow-wb-card p-6. whileHover: y:-4 borderColor:wb-teal/60 backgroundColor:wb-surface/10 shadow-wb-card-hover transition duration:0.2s ease-out. whileInView stagger container: staggerChildren:0.1 each card y:20→0 opacity:0→1 duration:0.35s. Icon circle: bg-gradient-to-br from-wb-blue to-wb-teal-soft rounded-full w-10 h-10. Card title: font-display font-semibold. Benefit line: text-wb-text-muted text-sm.",
      "notes": "3-col grid on lg:, 1-col mobile. Gap between cards: gap-5. Use motion.div for each card."
    },
    {
      "index": 5,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/PlansSection.tsx",
      "action": "Update section to py-24. Card: rounded-card shadow-wb-card border border-wb-surface/30 p-7. whileHover y:-4 shadow-wb-card-hover 200ms. Label pill: bg-wb-teal/15 text-wb-teal text-xs font-medium px-3 py-1 rounded-full; whileHover backgroundColor:wb-teal/25 letterSpacing:0.02em duration:150ms. Plan name: font-display font-semibold text-xl. Bullets: check-circle Lucide icon text-wb-teal + text-wb-text-muted. Investment: text-wb-teal font-semibold text-2xl. Primary CTA same style as hero. Top border accent per card: first two use border-t-2 border-[#1C58BC]/50 (bridges existing palette), last two border-t-2 border-wb-teal/50. whileInView stagger: staggerChildren:0.12 y:24→0 opacity:0→1.",
      "notes": "Plans order from mock: AI Product Sprint, AI Process Automation, 1:1 AI Mentoring, AI Audit & Roadmap."
    },
    {
      "index": 6,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/HowItWorksSection.tsx",
      "action": "Update section to py-[100px]. Desktop: flex flex-row justify-between items-start relative. Mobile: flex flex-col gap-10. Connecting line (lg only): absolute top-6 left-0 right-0 h-[1px] bg-gradient-to-r from-wb-blue via-wb-teal-soft to-transparent. Step circle: w-12 h-12 rounded-full bg-gradient-to-br from-wb-blue to-wb-teal-soft flex items-center justify-center text-wb-bg font-bold relative z-10. Title: font-display font-semibold mt-4. Description: text-wb-text-muted text-[15px] leading-relaxed mt-2. whileInView stagger: staggerChildren:0.15 each step y:20→0 opacity:0→1 duration:0.35s.",
      "notes": "Wrap each step in motion.div with whileInView. The parent container must be position:relative for the connecting line to work."
    },
    {
      "index": 7,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/TestimonialsSection.tsx",
      "action": "Update section to py-24. Card: bg-wb-bg-alt/80 backdrop-blur-sm border border-wb-surface/30 rounded-card shadow-wb-card p-6. whileHover: rotate:1 borderColor:wb-teal/60 shadow-wb-card-hover duration:200ms. Quote: italic text-wb-text-muted leading-relaxed. Role: text-wb-text-muted/60 text-sm font-medium mt-3. Outcome pill: bg-wb-teal/15 text-wb-teal text-xs px-3 py-1 rounded-full; whileHover backgroundColor:wb-teal/25 letterSpacing:0.02em 150ms. Placeholder cards: border-dashed border-wb-surface/20 bg-wb-bg-alt/40 rounded-card p-6 text-wb-surface/40 italic text-center text-sm. whileInView: each card opacity:0→1 duration:0.4s (no y offset for gentler entry).",
      "notes": "Add CSS fallback: @supports not (backdrop-filter: blur(1px)) { background: wb-bg-alt; } to handle older browsers."
    },
    {
      "index": 8,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/AboutSection.tsx",
      "action": "PRE-STEP (human): 3 AI-generated portrait images were created via Gemini (nano-banana) and saved to ~/nano-banana-images/ on your Mac. Copy them to public/images/ with these exact names: (1) angel-headshot.png — studio portrait, dark blue bg, jacket — PRIMARY image for AboutSection; (2) angel-working.png — desk + AI dashboard + hoodie — use in ResourcesSection hero or as a secondary About image; (3) angel-mentor.png — hands clasped, warm light, navy shirt — use in HeroSection right column or FinalCTA area. THEN implement: section py-24 bg-wb-bg-alt. Desktop: lg:grid lg:grid-cols-12. Image col: lg:col-span-5 — <Image src='/images/angel-headshot.png' width={540} height={440} className='w-full h-[440px] rounded-[20px] object-cover object-top shadow-wb-card' alt='Angel Arrieta – AI consultant and mentor' />. Fallback div (same dimensions, bg-wb-surface/40 rounded-[20px]) shown while image loads. Text col: lg:col-span-7 lg:pl-12. Bio paragraph: text-wb-text-muted text-[17px] leading-[1.65]. Bullets: check-circle icon text-wb-teal. whileInView: image scale:0.96→1 opacity:0→1 duration:0.35s; text column stagger staggerChildren:0.1 y:16→0.",
      "notes": "Generated image filenames on Mac: edited-2026-04-09T22-02-01-873Z-961y12.png (headshot — dark bg, jacket, corrected skin+hair+glasses v4), generated-2026-04-09T22-59-22-729Z-8ykfs8.png (working — desk+AI dashboard+hoodie), generated-2026-04-09T22-59-57-673Z-az466u.png (mentor — armchair+navy shirt+warm light). object-top on the headshot ensures face is never cropped on mobile. Add alt text to all images for WCAG AA."
    },
    {
      "index": 9,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/WhoIsItForSection.tsx",
      "action": "Update section to py-24. Layout: max-w-3xl mx-auto (centred narrow column). Add border-t border-wb-surface/20 pt-2 mb-10 to visually open the section. Each bullet: flex gap-3 items-start — check-circle icon w-5 h-5 text-wb-teal flex-shrink-0, text text-wb-text-muted text-[16px] leading-relaxed. whileInView stagger: staggerChildren:0.08, each bullet y:12→0 opacity:0→1 duration:0.3s.",
      "notes": "Centred max-width creates the intentional calm whitespace matching the reference 'muted neutrals and calm structure.'"
    },
    {
      "index": 10,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/FinalCTASection.tsx",
      "action": "Update section to py-[112px]. Add a warm radial gradient overlay behind the CTA: style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(28,88,188,0.10) 0%, transparent 65%)' }} as a positioned div behind content. H2: font-display text-[40px] lg:text-[52px] leading-[1.1]. Closing paragraph: text-wb-text-muted text-[17px] leading-relaxed. Primary CTA same as hero. Secondary: border border-wb-teal text-wb-teal rounded-full px-7 py-3. FAQ accordion trigger: border-b border-wb-surface/30 py-4 w-full text-left flex justify-between items-center text-[16px]; hover: text-wb-teal 150ms. ChevronDown icon rotates 180deg when open (motion.span rotate:0→180 duration:0.2s). Panel: text-wb-text-muted text-[15px] leading-relaxed py-4 pr-8.",
      "notes": "ARIA: headlessui Disclosure.Button auto-manages aria-expanded. Add aria-label to each trigger if question text alone is insufficient."
    },
    {
      "index": 11,
      "role": "executor",
      "topic": "ui",
      "file": "src/app/globals.css",
      "action": "Second pass: verify the @media (prefers-reduced-motion: reduce) block correctly targets all transition and animation properties. Add a global rule: @media (prefers-reduced-motion: reduce) { [data-framer-motion] { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } } as an extra safety net for Framer Motion DOM nodes.",
      "notes": "The !important flag is intentional here — it overrides inline styles Framer Motion injects. Check for any duplicate @import lines from step 2 and remove them."
    },
    {
      "index": 12,
      "role": "qa",
      "topic": "ui",
      "file": null,
      "action": "Review every updated landing section against the T5 design reference spec. Check: (1) Tailwind wb-* tokens map to correct hex values in browser computed styles; (2) H1 renders in Space Grotesk at correct size + line-height; (3) Card hover y-translate and border-color shift work on desktop; (4) Button hover timing is 150–200ms; (5) Tag pill letter-spacing transition fires on hover; (6) Testimonial tilt is subtle (≤ 1deg); (7) Section padding is in the 80–120px range (py-20/py-24/py-28); (8) prefers-reduced-motion disables all y/scale animations while preserving opacity fades; (9) Mobile single-column layout is unbroken; (10) npm run lint and npm run build both pass with zero errors.",
      "notes": "Also verify: Space Grotesk loads in Network tab, no layout shift on hero image placeholder, FAQ accordion is keyboard-navigable (Tab + Enter/Space opens panel)."
    }
  ]
}
```

#### Step Log

- [x] step 0  – done (Executor: Created src/utils/motionVariants.ts with Framer Motion variant objects + reducedMotion fallbacks)
- [x] step 1  – done (Executor: Tailwind design token extension — wb-* colors, fontFamily, radius, shadows)
- [x] step 2  – done (Executor: globals.css — Space Grotesk import + prefers-reduced-motion base rules)
- [x] step 3  – done (Executor: HeroSection.tsx — 8+4 grid, neo-grotesk H1, stagger variants, CTA microinteractions)
- [x] step 4  – done (Executor: WhatWeCanBuildSection.tsx — card radius/shadow/hover stagger)
- [x] step 5  – done (Executor: PlansSection.tsx — card style, label pill hover, top border accents, stagger)
- [x] step 6  – done (Executor: HowItWorksSection.tsx — horizontal timeline, connecting gradient line, stagger)
- [x] step 7  – done (Executor: TestimonialsSection.tsx — card tilt hover, pill letter-spacing, placeholder cards)
- [x] step 8  – done (Executor: AboutSection.tsx — 2-col grid, angel-headshot.png, stagger)
- [x] step 9  – done (Executor: WhoIsItForSection.tsx — centred narrow layout, bullet stagger)
- [x] step 10 – done (Executor: FinalCTASection.tsx — warm radial bg, FAQ accordion microinteractions)
- [x] step 11 – done (Executor: globals.css second pass — Framer Motion DOM reduced-motion safety net)
- [x] step 12 – done (QA: full visual + interaction review, lint, build)

---

### Task T6

status: todo
topic: ui
priority: 3
created_by: claude-planner
created_at: 2026-04-09
depends_on: T5

#### Goal

Build the three missing structural sections that complete the full premium-mentorship page flow as defined by the design references:

1. **ProofSection** — three animated metric cards (big numbers + labels + optional badges). Numbers count up from 0 to their target value on viewport entry using a `useCountUp` hook.
2. **ResourcesSection** — a "Blog / Resources" three-column card row drawing from a new `src/mocks/resources.ts` file. Each card: cover image area, category pill, title, excerpt, date, and a subtle hover lift.
3. **FooterSection** — multi-column link layout + newsletter email input with wb-teal focus ring + social icon links.

After these three sections, the full page order in `page.tsx` is:
`HeroSection → WhoIsItForSection → WhatWeCanBuildSection → PlansSection → HowItWorksSection → ProofSection → TestimonialsSection → ResourcesSection → AboutSection → FinalCTASection → FooterSection`

All content comes from `src/mocks/`. No hardcoded strings in components.

#### Plan

```json
{
  "steps": [
    {
      "index": 0,
      "role": "executor",
      "topic": "ui",
      "file": "src/hooks/useCountUp.ts",
      "action": "Create useCountUp hook. Signature: useCountUp({ target: number, duration?: number, start?: number }): number. Logic: (1) use useInView from framer-motion to detect when element enters viewport; (2) on entry, animate value from start (default 0) to target over duration (default 1000ms) using requestAnimationFrame with ease-out interpolation; (3) import useReducedMotion — if true, return target immediately without animation. Export as named export.",
      "notes": "Place in src/hooks/useCountUp.ts. Do not use setInterval — use rAF for smooth 60fps interpolation."
    },
    {
      "index": 1,
      "role": "executor",
      "topic": "ui",
      "file": "src/mocks/landing.ts",
      "action": "Add proofStats array to the existing landing mock: 3 entries, each with { id, value: number, suffix: string, label: string, badge?: string }. Example entries: { id:'years', value:7, suffix:'+', label:'Years building with AI' }, { id:'clients', label:'Industries served', value:12, suffix:'+' }, { id:'hours', value:200, suffix:'+', label:'Hours saved for clients', badge:'and counting' }. Export ProofStat interface from src/types/project.types.ts.",
      "notes": "The value must be a plain number (not a string) so useCountUp can animate it correctly."
    },
    {
      "index": 2,
      "role": "executor",
      "topic": "ui",
      "file": "src/mocks/resources.ts",
      "action": "Create new file src/mocks/resources.ts. Export resourcePosts array with 3 placeholder entries. Each entry: { id, title, excerpt, category, date, href, imagePlaceholderColor }. Example categories: 'AI Tools', 'Automation', 'Case Study'. imagePlaceholderColor is a Tailwind bg class string (e.g. 'bg-wb-surface') used to render a colour block when no real image exists. Also create and export ResourcePost interface in src/types/project.types.ts.",
      "notes": "Use placeholder text for title/excerpt — real content will be added by human later. href should be '#' for now."
    },
    {
      "index": 3,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/ProofSection.tsx",
      "action": "Create ProofSection component. Section: py-20 bg-wb-bg-alt. Layout: 3-col grid on md+, 1-col on mobile. Each metric card: bg-wb-surface border border-wb-teal/15 rounded-card shadow-wb-card p-8 text-center. Animated number: use useCountUp with the stat's value; render as <span> inside font-display text-[52px] font-bold text-wb-text. Suffix: text-wb-teal text-[32px]. Label: text-wb-text-muted text-[15px] mt-2. Optional badge: bg-wb-teal/15 text-wb-teal text-xs px-3 py-1 rounded-full mt-3. whileInView fade-up for the grid container (staggerChildren:0.12). Pass the inView ref from useCountUp to each card's motion.div.",
      "notes": "Import proofStats from mocks. ProofStat type from project.types.ts. Do not hardcode any numbers or labels."
    },
    {
      "index": 4,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/ResourcesSection.tsx",
      "action": "Create ResourcesSection component. Section: py-20 bg-wb-bg. H2: 'Insights & resources' font-display. Intro line: text-wb-text-muted. 3-col grid (lg:grid-cols-3) gap-5. Each card: bg-wb-surface border border-wb-surface/60 rounded-card overflow-hidden shadow-wb-card. Image area: h-44 w-full with imagePlaceholderColor bg class + optional future <Image> slot. Card body: p-5. Category pill: bg-wb-teal/15 text-wb-teal text-xs px-2 py-0.5 rounded-full. Title: font-display font-semibold text-[17px] mt-2 leading-snug. Excerpt: text-wb-text-muted text-[14px] mt-2 line-clamp-2. Date: text-wb-text-muted/50 text-xs mt-3. Hover: motion.div whileHover y:-4 shadow-wb-card-hover border-wb-teal/35 duration:200ms. whileInView stagger entrance: staggerChildren:0.1 y:20→0 opacity:0→1.",
      "notes": "Import resourcePosts from src/mocks/resources.ts. Use next/link for href. line-clamp-2 requires Tailwind @tailwindcss/line-clamp or built-in v3.3+ — confirm version before using."
    },
    {
      "index": 5,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/FooterSection.tsx",
      "action": "Create FooterSection component. bg-wb-bg border-t border-wb-surface/60 py-14. Layout: lg:grid lg:grid-cols-4 gap-10. Col 1: logo + one-line tagline + social icons row (Lucide: Twitter/Github/Linkedin, each icon-only button with aria-label, hover text-wb-teal transition 150ms). Cols 2-3: two link columns ('Services', 'Company') each with 3-4 plain text links text-wb-text-muted hover:text-wb-text 150ms. Col 4: Newsletter — label 'Get AI tips in your inbox', email <input> with focus:border-wb-blue focus:shadow-wb-input-focus rounded-[10px] bg-wb-surface border border-wb-surface/80 px-4 py-2.5 text-wb-text placeholder:text-wb-text-muted/50 w-full, submit button below (full-width, same primary CTA style as hero). Bottom bar: mt-10 border-t border-wb-surface/40 pt-6 flex justify-between text-wb-text-muted/50 text-xs — copyright left, 'Built with Next.js & ❤' right.",
      "notes": "Social icon links open in _blank with rel='noopener noreferrer'. Newsletter submit is a placeholder — no API call yet. Keyboard-navigable: all links and buttons reachable via Tab."
    },
    {
      "index": 6,
      "role": "executor",
      "topic": "ui",
      "file": "src/app/page.tsx",
      "action": "Import ProofSection, ResourcesSection, FooterSection and insert them into the page in the correct order: HeroSection → WhoIsItForSection → WhatWeCanBuildSection → PlansSection → HowItWorksSection → ProofSection → TestimonialsSection → ResourcesSection → AboutSection → FinalCTASection → FooterSection. Wrap all in <main className='bg-wb-bg min-h-screen'>. FloatingAssistant renders outside <main> in layout.tsx.",
      "notes": "If FloatingAssistant is currently in page.tsx, move it to src/app/layout.tsx so it persists above all sections on every route."
    },
    {
      "index": 7,
      "role": "qa",
      "topic": "ui",
      "file": null,
      "action": "Verify: (1) Stat counters animate from 0 on first viewport entry and stop at target — test at multiple scroll positions; (2) useReducedMotion returns target instantly when preference is set; (3) Resources cards render correctly with placeholder color blocks; (4) Footer newsletter input has correct focus ring (wb-blue border + input-focus shadow); (5) Social icon buttons have aria-labels; (6) Page order matches spec; (7) npm run lint and npm run build pass.",
      "notes": "Also verify line-clamp on excerpt text works — if not, install @tailwindcss/line-clamp or use CSS overflow hack."
    }
  ]
}
```

#### Step Log

- [ ] step 0 – not started (executor: useCountUp hook with rAF + reduced-motion support)
- [ ] step 1 – not started (executor: proofStats array + ProofStat type)
- [ ] step 2 – not started (executor: src/mocks/resources.ts + ResourcePost type)
- [ ] step 3 – not started (executor: ProofSection.tsx — animated metric cards)
- [ ] step 4 – not started (executor: ResourcesSection.tsx — blog card grid)
- [ ] step 5 – not started (executor: FooterSection.tsx — links + newsletter + social)
- [ ] step 6 – not started (executor: wire all 3 sections into page.tsx in correct order)
- [ ] step 7 – not started (qa: counter animation, reduced-motion, footer a11y, lint + build)

---

### Task T7

status: todo
topic: ux
priority: 4
created_by: claude-planner
created_at: 2026-04-09
depends_on: T5

#### Goal

Build the sticky site navigation header per `ux.md` (sticky top-0, smooth-scroll links, active section highlight) and `ui-elements.md` (logo left, nav links centre, CTA button right, compact dark style). Key behaviours: (1) transparent on page-top, transitions to `backdrop-blur-md bg-wb-bg/80` on scroll; (2) active nav link gets a `wb-teal` gradient underline via a `useScrollSpy` hook; (3) mobile breakpoint collapses to a hamburger button that opens/closes an animated menu panel.

#### Plan

```json
{
  "steps": [
    {
      "index": 0,
      "role": "designer",
      "topic": "ux",
      "file": null,
      "action": "Define exact header specs in this step log: (a) desktop height 68px, logo font-display font-semibold text-wb-text; (b) nav links: text-[15px] text-wb-text-muted hover:text-wb-text 150ms; active link: relative after:block after:h-[2px] after:bg-gradient-to-r after:from-wb-blue after:to-wb-teal after:rounded-full after:mt-0.5; (c) CTA button: bg-wb-blue text-wb-text rounded-full px-5 py-2 text-[14px] font-medium, whileHover scale:1.02 150ms; (d) scroll threshold: add bg + blur when window.scrollY > 20; (e) mobile: hamburger icon (Lucide Menu / X), menu panel slides down from top with AnimatePresence y:-20→0 opacity:0→1 300ms ease-out, full-width stacked links, CTA at bottom. Document all values here so executor can copy them directly.",
      "notes": "Nav link section IDs to scroll to: #services, #plans, #process, #results, #about, #contact (must match section IDs on page)."
    },
    {
      "index": 1,
      "role": "executor",
      "topic": "ux",
      "file": "src/hooks/useScrollSpy.ts",
      "action": "Create useScrollSpy hook. Accepts sectionIds: string[]. Uses IntersectionObserver with threshold 0.4 to track which section is currently in view. Returns activeId: string. Clean up observer on unmount. Export as named export.",
      "notes": "Use rootMargin '-20% 0px -60% 0px' to ensure the active section registers when it occupies the upper-middle of the viewport, not just the top pixel."
    },
    {
      "index": 2,
      "role": "executor",
      "topic": "ux",
      "file": "src/hooks/useScrolled.ts",
      "action": "Create useScrolled hook. Returns isScrolled: boolean — true when window.scrollY > 20. Uses useEffect with a scroll event listener, passive: true. Clean up on unmount. Export as named export.",
      "notes": "Debounce is not needed for this threshold check — direct state update on scroll is fine."
    },
    {
      "index": 3,
      "role": "executor",
      "topic": "ux",
      "file": "src/components/layout/SiteHeader.tsx",
      "action": "Create SiteHeader component. Sticky top-0 z-50. Motion.header with transition: isScrolled ? 'bg-wb-bg/80 backdrop-blur-md border-b border-wb-surface/50 shadow-wb-card' : 'bg-transparent'. Height h-[68px]. Inner: max-w-7xl mx-auto px-6 flex items-center justify-between. Logo: font-display font-semibold text-wb-text + optional gradient underline on brand word. Nav links (hidden on mobile md:flex): map over NAV_LINKS constant, each <a href={'#'+id}> with active state from useScrollSpy driving the teal gradient underline (conditional class). CTA: 'Book a call' button (motion.button) same style as hero primary but smaller px-5 py-2. Mobile: hamburger Menu / X icon button (aria-label='Toggle navigation') toggles isMenuOpen state. AnimatePresence for mobile panel: absolute top-[68px] left-0 right-0 bg-wb-bg/95 backdrop-blur-md border-b border-wb-surface/50 py-6 px-6 flex flex-col gap-5 md:hidden.",
      "notes": "Define NAV_LINKS as a const array at top of file: [{ label:'Services', id:'services' }, { label:'Plans', id:'plans' }, { label:'Process', id:'process' }, { label:'Results', id:'results' }, { label:'About', id:'about' }, { label:'Contact', id:'contact' }]. Do not hardcode copy elsewhere."
    },
    {
      "index": 4,
      "role": "executor",
      "topic": "ux",
      "file": "src/app/layout.tsx",
      "action": "Import SiteHeader and place it as the first child of <body> (or within a layout wrapper), before <main>. Ensure FloatingAssistant is also rendered at layout level (not inside page.tsx). Verify no hydration mismatch — SiteHeader uses client hooks so mark it as a Client Component (add 'use client' directive) and import dynamically if needed to avoid SSR issues.",
      "notes": "If layout.tsx is a Server Component, wrap SiteHeader in a client boundary. Use next/dynamic with ssr:false if window references cause hydration errors."
    },
    {
      "index": 5,
      "role": "executor",
      "topic": "ux",
      "file": "src/app/page.tsx",
      "action": "Add id attributes to each section's outer div/section element to match NAV_LINKS: id='services' on WhatWeCanBuildSection wrapper, id='plans' on PlansSection wrapper, id='process' on HowItWorksSection wrapper, id='results' on ProofSection + TestimonialsSection wrapper (use a <div id='results'> wrapper around both), id='about' on AboutSection wrapper, id='contact' on FinalCTASection wrapper.",
      "notes": "The ids must be applied to the outermost element of each section so the IntersectionObserver in useScrollSpy picks them up correctly."
    },
    {
      "index": 6,
      "role": "qa",
      "topic": "ux",
      "file": null,
      "action": "Verify: (1) header is transparent at top, blurs on scroll past 20px; (2) active nav link underline updates as user scrolls through each section; (3) mobile hamburger opens/closes animated panel; (4) all nav links scroll to correct section smoothly; (5) Tab key navigates all header links; (6) hamburger button has aria-label; (7) no hydration errors in console; (8) npm run lint and npm run build pass.",
      "notes": "Test smooth scroll on Chrome and Safari. On Safari, CSS scroll-behavior:smooth may need to be set on html element in globals.css."
    }
  ]
}
```

#### Step Log

- [ ] step 0 – not started (designer: header spec — sizes, states, link styles, mobile panel behaviour)
- [ ] step 1 – not started (executor: useScrollSpy hook — IntersectionObserver active section tracker)
- [ ] step 2 – not started (executor: useScrolled hook — boolean scroll threshold)
- [ ] step 3 – not started (executor: SiteHeader.tsx — full header component)
- [ ] step 4 – not started (executor: wire SiteHeader into layout.tsx)
- [ ] step 5 – not started (executor: add section id attributes in page.tsx)
- [ ] step 6 – not started (qa: scroll-spy, blur transition, mobile menu, a11y, lint + build)

---

### Task T8

status: todo
topic: ui
priority: 5
created_by: claude-planner
created_at: 2026-04-09
depends_on: T5

#### Goal

A focused microinteractions polish pass across **every** interactive element on the page. All hover/press/focus states must match the timing, easing, and `wb-*` token values defined in the T5 Goal spec. This task has no new component files — it is purely refinement of existing components.

Interaction targets:
- **Primary CTA buttons** — `scale:1.02` hover (150ms ease-out), `scale:0.98` press, shadow intensifies
- **Secondary/ghost buttons** — border brightens to `wb-blue`, text shifts to `wb-text`, same scale timings
- **All cards** (use-case, plan, resource, testimonial, proof) — `y:-4` hover, `border-wb-teal/55` border shift, shadow step-up
- **Plan label pills + outcome tag pills** — `bg-wb-teal/25` + `letter-spacing:0.02em` hover (150ms)
- **Testimonial cards** — `rotate:1deg` tilt + border glow on hover (200ms)
- **Nav links** — `text-wb-text` + teal underline `scaleX:0→1` (150ms)
- **Hamburger icon button** — `rotate:90deg` morph from Menu to X via AnimatePresence
- **Social icon links in footer** — `scale:1.1 text-wb-teal` hover (150ms)
- **Newsletter submit button** — same primary CTA treatment
- **Newsletter email input** — `border-wb-blue shadow-wb-input-focus` on focus (200ms)
- **FAQ accordion trigger** — `text-wb-teal` on open, `ChevronDown rotate:180deg` on open (200ms)
- **All inputs globally** — `border-wb-blue` focus, `shadow-wb-input-focus` glow, 200ms

#### Plan

```json
{
  "steps": [
    {
      "index": 0,
      "role": "executor",
      "topic": "ui",
      "file": "src/utils/motionVariants.ts",
      "action": "Create or update src/utils/motionVariants.ts. Export named const objects: primaryButtonHover = { scale:1.02, transition:{ duration:0.15, ease:'easeOut' } }, primaryButtonTap = { scale:0.98 }, cardHover = { y:-4, transition:{ duration:0.2, ease:'easeOut' } }, tagPillHover = { transition:{ duration:0.15 } }, testimonialHover = { rotate:1, transition:{ duration:0.2, ease:'easeOut' } }, socialIconHover = { scale:1.1, transition:{ duration:0.15 } }, navLinkUnderline = { scaleX:[0,1], transition:{ duration:0.15 } }. Also export a reducedVariants object where all scale/y/rotate values are 0 (opacity-only). Include a helper: getVariant(normal, reduced, isReduced) => isReduced ? reduced : normal.",
      "notes": "This file is the single source of truth for all motion constants — components import from here, never define inline timing."
    },
    {
      "index": 1,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/HeroSection.tsx",
      "action": "Import primaryButtonHover, primaryButtonTap from motionVariants. Apply to both CTA buttons. Primary: whileHover={{ ...primaryButtonHover, boxShadow:'0 32px 72px rgba(0,0,0,0.28)' }} whileTap={primaryButtonTap}. Secondary ghost: whileHover={{ ...primaryButtonHover, borderColor:'#1C58BC' }} whileTap={primaryButtonTap}.",
      "notes": "Verify CTA buttons are motion.button elements. If currently <button>, wrap or replace with motion.button."
    },
    {
      "index": 2,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/WhatWeCanBuildSection.tsx",
      "action": "Import cardHover, tagPillHover from motionVariants. Apply cardHover to each card's motion.div whileHover. Apply tagPillHover with custom className toggle for letter-spacing to the icon circle or any tag element on hover.",
      "notes": "Tailwind does not animate letter-spacing out-of-the-box — use inline style for the letterSpacing value inside whileHover object."
    },
    {
      "index": 3,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/PlansSection.tsx",
      "action": "Import cardHover, tagPillHover from motionVariants. Apply cardHover to each plan card. Apply tagPillHover to label pill (the plan label at top of card) with whileHover={{ letterSpacing:'0.02em', backgroundColor:'rgba(74,155,142,0.25)' }}.",
      "notes": "Investment amount line: on card hover, transition color from wb-teal to wb-blue-soft (200ms) using CSS transition class."
    },
    {
      "index": 4,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/TestimonialsSection.tsx",
      "action": "Import testimonialHover from motionVariants. Apply to each testimonial card motion.div whileHover. Add whileHover borderColor transition to wb-teal/55. Apply tagPillHover to outcome tag pills.",
      "notes": "The rotate:1deg tilt must be applied with transformOrigin:'bottom center' to feel natural — add style={{ transformOrigin:'bottom center' }} to the motion.div."
    },
    {
      "index": 5,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/ResourcesSection.tsx",
      "action": "Import cardHover from motionVariants. Apply to each resource card motion.div. Category pill: apply tagPillHover with letterSpacing hover. Card image area: on card hover, subtle scale:1.02 on the image div (motion.div scale:1→1.02 duration:0.4 ease-out) to create a gentle zoom.",
      "notes": "Image area zoom requires overflow-hidden on the card or image container — verify rounded-card is applied to the overflow container."
    },
    {
      "index": 6,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/FooterSection.tsx",
      "action": "Import socialIconHover, primaryButtonHover, primaryButtonTap from motionVariants. Apply socialIconHover to each social icon button (motion.button). Apply primaryButtonHover/Tap to newsletter submit button. Ensure email input has: className includes 'transition-all duration-200 focus:border-wb-blue focus:shadow-wb-input-focus focus:outline-none'.",
      "notes": "Do not use focus:ring — use the explicit box-shadow token for the input focus glow to match the design spec exactly."
    },
    {
      "index": 7,
      "role": "executor",
      "topic": "ui",
      "file": "src/components/landing/FinalCTASection.tsx",
      "action": "Import primaryButtonHover, primaryButtonTap from motionVariants. Apply to primary and secondary CTA buttons. FAQ accordion: on open, ChevronDown rotates 180deg via motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.2 }}. Accordion trigger: className includes 'hover:text-wb-teal transition-colors duration-150'. FAQ panel open/close: AnimatePresence with motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25, ease:'easeOut' }}.",
      "notes": "Use @headlessui/react Disclosure render prop to access the open boolean for the ChevronDown motion.span."
    },
    {
      "index": 8,
      "role": "qa",
      "topic": "ui",
      "file": null,
      "action": "Full microinteraction audit: (1) hover each button — confirm scale:1.02 timing feels snappy not sluggish (150ms); (2) press each button — confirm scale:0.98 snap is immediate; (3) hover each card type — confirm y:-4 lift and border shift; (4) hover tag pills — confirm letter-spacing expansion; (5) hover testimonial cards — confirm subtle tilt at bottom origin; (6) hover social icons — confirm scale:1.1 and teal colour; (7) focus newsletter email input — confirm wb-blue border + blue glow ring; (8) open FAQ — confirm ChevronDown rotates and panel expands smoothly; (9) toggle reduced-motion preference in browser — confirm all scale/y/rotate animations are gone; (10) npm run lint and npm run build pass.",
      "notes": "Test in Chrome, Firefox, and Safari. Safari may need -webkit- prefixes for backdrop-filter — check globals.css."
    }
  ]
}
```

#### Step Log

- [ ] step 0 – not started (executor: motionVariants.ts — all variant constants + reducedVariants + getVariant helper)
- [ ] step 1 – not started (executor: HeroSection.tsx — CTA button hover/tap variants)
- [ ] step 2 – not started (executor: WhatWeCanBuildSection.tsx — card hover, pill hover)
- [ ] step 3 – not started (executor: PlansSection.tsx — card hover, label pill hover)
- [ ] step 4 – not started (executor: TestimonialsSection.tsx — tilt hover, pill hover)
- [ ] step 5 – not started (executor: ResourcesSection.tsx — card hover, image zoom)
- [ ] step 6 – not started (executor: FooterSection.tsx — social icons, newsletter button, input focus)
- [ ] step 7 – not started (executor: FinalCTASection.tsx — CTA buttons, FAQ panel animation, chevron rotate)
- [ ] step 8 – not started (qa: full microinteraction audit across all browsers + reduced-motion + lint + build)
