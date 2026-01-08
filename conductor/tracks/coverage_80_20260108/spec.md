# Specification: Increase Test Coverage to >80%

## Context
The current test coverage for the project is reported at 4.5% by SonarQube, which is significantly below the project's quality standard of 80%. This low coverage poses a risk to the project's stability and maintainability.

## Objectives
- Increase the overall unit test coverage to at least 80%.
- Implement comprehensive tests for critical components, hooks, and utility functions.
- Ensure that the testing infrastructure (Vitest, React Testing Library) is correctly configured to report coverage accurately.

## Scope
- **Components:**
    - UI Components (`src/components/ui/`)
    - Screen Components (`src/components/screens/`)
    - Core Layout Components (`BootSequence`, `WindowContainer`, `Taskbar`)
- **Hooks:**
    - `src/hooks/useScreenNavigation.ts`
    - `src/hooks/use-mobile.tsx`
    - `src/hooks/use-toast.ts`
- **Utilities:**
    - `src/lib/utils.ts`
    - `src/lib/animations.ts` (if applicable)

## Success Criteria
- Running `npm run test:coverage` (or equivalent) reports a total coverage >80%.
- All new tests pass successfully.
- No regression in existing functionality.
