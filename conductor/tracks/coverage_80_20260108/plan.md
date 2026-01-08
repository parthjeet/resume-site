# Plan: Increase Test Coverage to >80%

## Phase 1: Infrastructure and Utility Testing [checkpoint: 6805609]
- [x] Task: Verify and configure Vitest coverage reporting. [commit: d86261a]
    - [ ] Subtask: Check `vitest.config.ts` for coverage settings (v8 or istanbul).
    - [ ] Subtask: Ensure a coverage script exists in `package.json` (e.g., `vitest run --coverage`).
    - [ ] Subtask: Run initial coverage to confirm the baseline.
- [x] Task: Implement tests for `src/lib/utils.ts`. [commit: 08e03d7]
    - [ ] Subtask: Write unit tests for `cn` and other utility functions.
- [x] Task: Implement tests for `src/lib/animations.ts`. [commit: 29d6a76]
    - [ ] Subtask: Write unit tests for animation constants or helper functions.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure and Utility Testing' (Protocol in workflow.md)

## Phase 2: Hook Testing
- [x] Task: Implement tests for `src/hooks/useScreenNavigation.ts`. [commit: f86318b]
    - [ ] Subtask: Test navigation state transitions.
    - [ ] Subtask: Test screen ID validation.
- [x] Task: Implement tests for `src/hooks/use-mobile.tsx`. [commit: 1a90142]
    - [ ] Subtask: Test mobile detection logic (mocking window.matchMedia).
- [x] Task: Implement tests for `src/hooks/use-toast.ts`. [commit: f8367c1]
    - [ ] Subtask: Test toast notification state management.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Hook Testing' (Protocol in workflow.md)

## Phase 3: Core Component Testing
- [ ] Task: Implement tests for `src/components/BootSequence.tsx`.
    - [ ] Subtask: Test rendering and animation completion callbacks.
- [ ] Task: Implement tests for `src/components/WindowContainer.tsx`.
    - [ ] Subtask: Test window rendering, title bar, and children projection.
- [ ] Task: Implement tests for `src/components/Taskbar.tsx`.
    - [ ] Subtask: Test button rendering and click interactions.
    - [ ] Subtask: Test active state handling.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Core Component Testing' (Protocol in workflow.md)

## Phase 4: Screen Component Testing
- [ ] Task: Implement tests for `src/components/screens/AboutScreen.tsx`.
- [ ] Task: Implement tests for `src/components/screens/ExperienceScreen.tsx`.
- [ ] Task: Implement tests for `src/components/screens/SkillsScreen.tsx`.
- [ ] Task: Implement tests for `src/components/screens/ProjectsScreen.tsx`.
- [ ] Task: Implement tests for `src/components/screens/EducationScreen.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Screen Component Testing' (Protocol in workflow.md)

## Phase 5: UI Component Testing (Sample)
- [ ] Task: Implement tests for high-usage UI components.
    - [ ] Subtask: Select top 5 used shadcn/ui components (e.g., Button, Card, Dialog).
    - [ ] Subtask: Write rendering and interaction tests for them.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: UI Component Testing (Sample)' (Protocol in workflow.md)
