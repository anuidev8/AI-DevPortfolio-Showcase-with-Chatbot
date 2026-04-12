Angel Arrieta – AI Landing UI Elements Catalog
Catalog of UI components, styles, animations, and microinteractions for your AI consulting landing, with Dribbble/Framer references. Use this as a design spec for Figma/Framer/Next.js.

Core Components List
Buttons / CTAs

Types: primary (solid gradient), secondary (outline/ghost), text link.

Pattern: rounded full, medium height, strong contrast on dark backgrounds.

Angel usage:

Primary: “Book a free 20‑minute AI strategy call” (large, gradient, glow).

Secondary: “View mentoring plans” (outline, subtle glow).

References:

AI Consulting Dark Futuristic Landing Page – CTA buttons with gradient and glow.

Artificial Intelligence Dark Futuristic Framer Landing Page – pill CTAs with motion.

Navigation / Header

Structure: logo left, nav links center/right, CTA button right.

Behavior: sticky on scroll, active link with gradient underline.

Angel sections: “Services”, “Plans”, “Process”, “Results”, “About”, “Contact”.

References:

AI Consulting Dark Futuristic Landing Page – compact dark nav with CTA.

Velocity AI Services consulting template – sticky dark nav, accent underline.

Hero Layout

Large headline, subheadline, primary & secondary CTAs.

Visual: gradient orb / halo behind text, subtle animated shapes.

Optional right side: abstract AI illustration or “dashboard” mock.

References:

AI Consulting Dark Futuristic Landing Page – split hero with floating panels.

Artificial Intelligence Dark Futuristic Landing Page – central headline and glowing background.

Cards (Plans, Use Cases, Metrics)

Style: dark card, soft gradient overlay, thin 1px border with gradient on hover, 12–16px radius.

Content patterns:

Plan card: name, short description, 3–5 bullets, price, CTA.

Use‑case card: icon, title, short benefit line.

Metric card: number + label (“7+ years”, “Clients in X industries”).

References:

Dark futuristic landing shots with feature cards and glow borders.

Dribbble card micro‑interaction gallery – hover lift & glow.

Inputs / Forms

Email / contact form: floating label fields, pill submit button with gradient.

Search / small input: subtle glassmorphism on dark background.

References:

AI landing forms in dark templates (Velocity AI).

Dark futuristic website inspirations with minimal inputs.

Sections / Content Blocks

“Who this is for” – two‑column text + bullets or small icons.

“What we can build” – responsive grid of cards.

“Process” – 3–4 step timeline with icons and connecting gradient line.

“Testimonials” – horizontal scroll of cards.

References:

AI Consulting Dark Futuristic Landing Page – service grid + process section.

AI consulting templates (Velocity AI) – step timeline and testimonials.

Styles and Typography
Colors (Angel brand)

Background:

Main: #010102 or #020617 (near‑black, subtle blue tint).

Section alt: very dark navy #02091F.

Primary accent: electric blue #1C58BC.

Secondary accent: magenta #9C6487, soft lilac #B3A1B2 for gradients.

Text:

Primary: #EBEBEB.

Muted: #9CA3AF / #B3A1B2.

Gradients:

Hero: radial #032791 → #1C58BC → #9C6487 behind content.

Buttons: linear #1C58BC → #9C6487.

References:

AI Consulting Dark Futuristic Landing Page – deep blue/magenta gradient scheme.

AI futuristic web inspirations with neon accents on dark.

Typography

Heading font: geometric sans (e.g. Poppins, Sora, Space Grotesk).

Body font: modern sans (Inter, DM Sans).

Scale:

H1: 42–56 px desktop, 28–32 px mobile.

H2: 28–32 px.

Body: 16–18 px.

References:

Stylin Studio AI landing typography – high contrast headings.

Futuristic web examples with large, tight headings.

Shapes / Shadows / Borders

Radius: 12–16px for cards, full for buttons and pills.

Shadows: soft outer glow for key elements, very subtle drop shadows otherwise.

Borders: 1px semi‑transparent (rgba(148,163,184,0.3)), with gradient on hover for important cards.

References:

Dark futuristic cards with glow borders.

Card micro‑interaction shots with subtle strokes.

Animations and Transitions
Screen / Section Transitions

Scroll‑triggered fades and slides (upwards), 200–400 ms, ease‑out.

Optional parallax for hero background gradient.

References:

Artificial Intelligence Dark Futuristic Framer Landing Page – smooth section transitions.

Framer animation search – scroll and reveal patterns.

Component‑level Motion

Buttons:

Hover: slight scale up (1.03), gradient shift, shadow intensifies.

Active: quick downscale (0.97) with timing 100–150 ms.

Cards:

Hover: lift 4–6 px, border gradient appears, slight tilt or glow.

Hero background:

Slow, looping gradient movement (Framer Motion or CSS animation).

References:

Card micro‑interaction designs on Dribbble – hover effects.

Framer animation gallery – gradient and layout animations.

Framer Motion Techniques (for your React/Next)

Use AnimatePresence for section entrances and modals.

Use layout and layoutId for card reordering and smooth layout shifts.

Stagger children in feature and plan sections for progressive reveal.

References:

Framer animation inspiration – motion patterns for cards and heroes.

AI Framer landing templates for timing/easing inspiration.

Microinteractions
Feedback on Actions

Button hover:

Gradient “wipes” from left to right, icon slides 2–4 px.

CTA click:

Brief ripple or inner glow, then subtle success state for a second if no navigation yet.

Form fields:

Border color shift to accent on focus, slight glow.

References:

Card/CTA micro‑interaction galleries on Dribbble.

Framer animation examples for hover and press states.

Passive Motion

Floating gradient orbs in hero background, moving slowly on a loop.

Tiny “noise” or grain overlay to avoid flat black feel (very subtle).

References:

Dark futuristic AI landings with floating holographic elements.

Guidelines

Duration: 150–300 ms for interactive elements, 400–600 ms for section entrances.

Easing: ease‑out / custom bezier with a slightly snappy end.

Respect prefers-reduced-motion – disable heavy animations for those users.

Page‑Specific Patterns for Angel’s Landing
Homepage / Hero
Elements:

H1 + subheadline (value proposition).

Primary CTA button + secondary CTA.

“Mini metrics” row (3 pill cards with short stats).

Abstract AI visual (dashboard mock, gradient shapes).

Style:

Large gradient glow behind text, subtle particle/floating shapes.

References:

AI Consulting Dark Futuristic Landing Page – hero composition.

Artificial Intelligence Dark Futuristic Landing Page – central focus and background light.

“What we can build” Grid
3–6 cards, each with:

Small gradient icon circle.

Title (“AI calculators”, “AI reports”, “AI sales assistant”, etc.).

One‑line benefit.

Layout:

3 columns on desktop, 1–2 on mobile.

References:

Dark futuristic feature grids on Stylin Studio shots.

Card micro‑interaction gallery for hover states.

Plans Section
3–4 larger cards with:

Top label pill (“Sprint”, “Automation”, “Mentoring”, “Audit”).

Short description, bullets, price, CTA.

Visual:

Each card with slightly different accent gradient (blue‑heavy, purple‑heavy, etc.).

References:

AI consulting templates in Aura / Velocity AI for plan layouts.

Framer AI landing with pricing cards.

Process Timeline
Horizontal or vertical 3–4 step flow:

Each step: icon in gradient circle, title, short description.

A connecting gradient line or dots showing progression.

References:

AI Consulting Dark Futuristic Landing Page – step/process pattern.

Futuristic web layouts with step timelines.

Testimonials
Horizontally scrollable row of cards.

Each card:

Quote, role, short outcome metric (time saved / speed).

Visual:

Glassmorphism effect on dark, soft gradient edge.

References:

AI SaaS landings with testimonial carousels in dark mode (Velocity AI).

Card gallery patterns.

Responsive Behavior
Desktop

Hero: two‑column (text + visual).

Grids: 3 columns for use cases, 3–4 plan cards in 2 rows if needed.

Tablet

Hero: stacked but keep image behind text or below.

Grids: 2 columns.

Mobile

Single column stacking, full‑width buttons, cards edge‑to‑edge with padding.

Sticky bottom CTA (optional): small bar “Book free AI strategy call”.

Sources / Inspiration
AI Consulting Dark Futuristic Landing Page – Stylin UI (overall look, hero, cards, nav).

Artificial Intelligence Dark Futuristic Landing Page – Stylin UI (color, gradients, cards).

Artificial Intelligence Dark Futuristic Framer Landing Page – Stylin Framer (motion patterns).

Dark futuristic design and gradient inspiration searches on Dribbble.

Velocity AI Services – AI consulting landing template (structure for consulting).

Futuristic websites gallery for general composition and contrast.