# Project

name: ai-dev-portfolio-showcase
group: isolated
stack: Next.js 15 + TypeScript + Tailwind CSS + Framer Motion
repo_hint: github.com/angel/AI-DevPortfolio-Showcase-with-Chatbot
live_url: https://anuidev.vercel.app/

# Purpose

- Interactive AI-powered developer portfolio with a built-in chatbot assistant.
- Showcases projects, skills, services, and tech stack.
- Features a floating AI assistant with text and voice chat modes (ElevenLabs TTS).
- "Continue building" – actively under development.

# Code Structure

- `src/app/`              → Next.js App Router pages, layout, global styles, fonts.
- `src/app/assistant/`   → Assistant-related route/page (if any).
- `src/components/`      → All UI components, split by domain:
  - `assistant/`         → `ChatInterface.tsx`, `AudioResponse.tsx` – core chat logic.
  - `floatingAssistant/` → `FloatingAssistant.tsx` – floating chat widget/toggle.
  - `home/`              → `HeroSection.tsx`, `ProjectsSection.tsx`, `ServiceSection.tsx`, `SnnipedGitHub.tsx`, `Techs.tsx`.
  - `ui/`                → `Loader.tsx` and other shared UI primitives.
- `src/layout/`          → Layout wrappers / shell components.
- `src/mocks/`           → Mock data (projects, services, skills, etc.).
- `src/types/`           → TypeScript type definitions (`project.types.ts`).
- `src/utils/`           → Utility functions and API clients (`api.ts`).

# Conventions

- Language: TypeScript (strict preferred).
- Styling: Tailwind CSS utility classes; globals in `src/app/globals.css`.
- Animations: Framer Motion for transitions and micro-interactions.
- Icons: Lucide React.
- Routing: Next.js App Router (file-based, `src/app/`).
- Naming: PascalCase components, camelCase functions, kebab-case file/folder names.
- API calls: centralised in `src/utils/api.ts`.
- Types: defined in `src/types/project.types.ts`.
- No dedicated state management library – React state + props; extend with Zustand if needed.
