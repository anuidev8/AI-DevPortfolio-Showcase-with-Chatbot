# Topic: ux

## Design Rules

- Primary CTA:
  - Prominent, high-contrast colour (brand accent – see `ui-elements.md`).
  - Full width on mobile, auto width on desktop.
- Secondary CTA:
  - Outline or ghost style.
- Hover states:
  - All interactive elements must have a visible hover/focus state.
  - Use Framer Motion scale + shadow for cards and buttons (see `ui-elements.md`).

## Layout

- The portfolio is single-page with vertical scroll (sections stacked).
- Each section should be visually distinct but tonally consistent.
- Use generous padding/spacing between sections (min `py-16` or `py-24`).
- Mobile-first: design for small screens, then enhance for large.

## Navigation / Header

- Sticky header with smooth scroll links to sections.
- On mobile: hamburger menu or minimal nav (decide and document here when implemented).
- Active section should be highlighted in the nav.

## Floating Assistant UX

- The widget should appear in the bottom-right corner on all pages.
- It must not overlap important content on mobile (use safe-area insets if needed).
- Open/close animation: slide up + fade in, 250ms ease-out.
- Inside the chat: clear visual separation between user and assistant messages.
- User messages: right-aligned, accent colour bubble.
- Assistant messages: left-aligned, neutral/dark bubble.
- Timestamps: optional, subtle (e.g., `text-xs opacity-50`).

## Forms & Inputs

- Show placeholder text that disappears on focus.
- Chat input: auto-resize textarea (up to 3 lines), Enter to send, Shift+Enter for newline.
- Disabled state while a response is loading: grey out input and send button.

## Accessibility

- Keyboard navigable: all interactive elements reachable via Tab.
- Focus rings: visible, not removed globally.
- ARIA labels on icon-only buttons (e.g., close button, send button, mic button).
- Colour contrast: maintain WCAG AA minimum on all text.

## Dark Mode

- Default theme: dark background with light text.
- Gradients OK in hero/backgrounds; ensure text remains readable.
- Do not implement light mode unless explicitly requested.

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).

## References

- Live site: `https://anuidev.vercel.app/`
- Inspiration: Calm.com, Linear.app, Stripe.com
