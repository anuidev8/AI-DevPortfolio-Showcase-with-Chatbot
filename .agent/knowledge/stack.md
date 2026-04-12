# Topic: stack

## Frontend

- Framework: Next.js 15 (App Router).
- Language: TypeScript (strict mode preferred).
- Styling: Tailwind CSS v3.
- Animations: Framer Motion v11.
- Icons: Lucide React.
- Rich UI: Headless UI (`@headlessui/react`) for accessible primitives.
- Lottie: `@lottiefiles/react-lottie-player` + `lottie-web`.
- 3D Avatar: `@avaturn/sdk`.

## State Management

- Local component state: React `useState` / `useReducer`.
- Shared state: React Context (for chat state, mode toggling, etc.).
- No external state library currently – add Zustand if state grows complex.
- Server state / API fetching: `fetch` in server components or `useEffect` in client components; migrate to React Query if needed.

## Routing

- Next.js App Router (file-based, `src/app/`).
- Single-page portfolio: all main content on `src/app/page.tsx`.
- Additional routes (if any): add pages under `src/app/<route>/page.tsx`.

## API Integration

- All API calls centralised in `src/utils/api.ts`.
- ElevenLabs TTS: HTTP POST to ElevenLabs endpoint with `ELEVENLABS_API_KEY`.
- AI chat backend: document the endpoint/provider here when confirmed.
- Environment variables: `.env.local` (never committed).

## Data & Types

- Mock/static content: `src/mocks/` (TypeScript arrays/objects).
- Type definitions: `src/types/project.types.ts`.
- Use Zod for runtime validation of external API responses (add if not present).

## Testing

- No test setup yet – add when ready:
  - Unit: Vitest or Jest.
  - E2E: Playwright.
- Before any task is marked Done, at minimum run `npm run lint` and `npm run build`.

## Build & Deploy

- Build: `npm run build`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Deploy: Vercel (auto-deploy from main branch).
- Live URL: `https://anuidev.vercel.app/`

## Conventions

- File naming: kebab-case for files/folders (except components: PascalCase).
- Component naming: PascalCase (`ChatInterface.tsx`).
- Hooks: camelCase prefixed with `use` (`useChat.ts`).
- Utilities: camelCase (`formatTime.ts`).
- Feature-based co-location is preferred as the project grows (group related files under `src/features/<name>/`).
