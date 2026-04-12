# Topic: portfolio

## Concepts

- Portfolio Sections:
  - `Hero`      → Above-the-fold introduction: name, title, CTA buttons.
  - `Projects`  → Showcase of selected work with links and tech tags.
  - `Services`  → What the owner offers (e.g., web dev, UI/UX, APIs).
  - `Techs`     → Technology/skills grid.
  - `GitHub`    → Snippet or live stats from GitHub profile (`SnnipedGitHub.tsx`).
- Mock Data:
  - All portfolio content is stored in `src/mocks/` as TypeScript arrays/objects.
  - Types are defined in `src/types/project.types.ts`.

## Rules

- All portfolio content (projects, services, skills) must come from `src/mocks/` – do not hardcode content inside components.
- Adding a new project: add an entry to the projects mock array, following the type in `project.types.ts`.
- Images and media: store in `public/` and reference with a root-relative path (`/images/...`).
- The GitHub section may use either live GitHub API data or static mock data – document which is active here when decided.
- Links to live projects must open in a new tab (`target="_blank" rel="noopener noreferrer"`).

## Flows

### Adding a New Project

1. Define the project object following `project.types.ts`.
2. Add it to the projects array in `src/mocks/`.
3. The `ProjectsSection.tsx` component will render it automatically.

### Adding a New Service

1. Add a service entry to the services mock array.
2. `ServiceSection.tsx` renders from that array.

### Updating the Tech Grid

1. Add or remove entries in the techs mock array.
2. `Techs.tsx` renders from that array.

## References

- Type definitions: `src/types/project.types.ts`
- Mock data: `src/mocks/`
- Sections:
  - `src/components/home/HeroSection.tsx`
  - `src/components/home/ProjectsSection.tsx`
  - `src/components/home/ServiceSection.tsx`
  - `src/components/home/Techs.tsx`
  - `src/components/home/SnnipedGitHub.tsx`
- Live site: `https://anuidev.vercel.app/`
