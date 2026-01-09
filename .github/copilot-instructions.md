# Copilot Coding Agent Instructions

## Repository Overview

**MyRes Site** is a portfolio/resume web application with a desktop OS-inspired interface featuring boot sequences, windowed UI components, and taskbar navigation.

| Attribute | Value |
|-----------|-------|
| Type | Single-Page Web Application |
| Language | TypeScript 5.8.3 |
| Framework | React 18.3.1 + Vite 6.4.1 |
| Styling | Tailwind CSS 3.4.17 + shadcn/ui |
| Testing | Vitest 4.0.16 + React Testing Library |
| Node.js | v20.x (CI uses v24) |

---

## Build, Test, and Lint Commands

**Always run `npm ci` before any other command** to ensure dependencies are installed.

| Command | Purpose | Status |
|---------|---------|--------|
| `npm ci` | Install dependencies (clean install) | ✅ Works (~11s) |
| `npm run build` | Production build to `dist/` | ✅ Works (~4s) |
| `npm run test:run` | Run all tests once | ✅ Works (113 tests pass) |
| `npm run lint` | ESLint check | ⚠️ Pre-existing errors in shadcn/ui files |
| `npm run dev` | Start dev server on port 8080 | ✅ Works |
| `npm run preview` | Preview production build | ✅ Works |

### Important Notes

1. **Lint has pre-existing errors** in `src/components/ui/` (shadcn-generated files) and test files. These are NOT blocking for builds or tests.
2. **Build shows a CSS warning** about `@import` order in `index.css` - this is non-blocking.
3. **Always run tests with `npm run test:run`** (not `npm run test` which runs in watch mode).

---

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (DO NOT manually edit)
│   │   ├── screens/         # Portfolio screens (AboutScreen, ExperienceScreen, etc.)
│   │   ├── BootSequence.tsx # Boot animation
│   │   ├── WindowContainer.tsx
│   │   └── Taskbar.tsx
│   ├── hooks/               # Custom React hooks (useScreenNavigation, use-mobile)
│   ├── lib/                 # Utilities (utils.ts, animations.ts)
│   ├── data/content.ts      # All portfolio content data
│   ├── pages/               # Route components (Index.tsx, NotFound.tsx)
│   ├── test/setup.ts        # Vitest setup
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── .github/workflows/deploy.yml  # Cloudflare Pages deployment
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Test configuration
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind CSS config
├── eslint.config.js         # ESLint config
└── components.json          # shadcn/ui config
```

### Key Files for Common Tasks

| Task | Files to Modify |
|------|-----------------|
| Add portfolio content | `src/data/content.ts` |
| Add new screen | `src/components/screens/`, `src/data/content.ts`, `src/pages/Index.tsx`, `src/hooks/useScreenNavigation.ts` |
| Add shadcn component | Run `npx shadcn@latest add <component>` |
| Modify animations | `src/lib/animations.ts` |
| Update styles/theme | `tailwind.config.ts`, `src/index.css` |

---

## CI/CD Pipeline

**GitHub Workflow**: `.github/workflows/deploy.yml`
- Triggers on push to `master` branch (paths: `src/**`)
- Uses Node.js 24
- Runs: `npm ci` → `npm run build` → Deploy to Cloudflare Pages

**Validation before PR**:
1. `npm ci`
2. `npm run build` (must pass)
3. `npm run test:run` (must pass)

---

## Path Aliases

Use `@/` for imports from `src/`:
```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

---

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/`. Do not manually create files there.

---

## PR Review Comments - Critical Requirement

**If a PR is created by the `google-labs-jules` bot, you MUST include `@google-labs-jules` in each and every review comment you make.**

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm ci` and restart dev server |
| Port 8080 in use | Kill process or change port in `vite.config.ts` |
| Lint errors in ui/ files | These are pre-existing in shadcn files; ignore them |
| CSS @import warning | Non-blocking; can be ignored |

---

## Trust These Instructions

These instructions have been validated by running all commands. Only search the codebase if information here is incomplete or found to be incorrect.
