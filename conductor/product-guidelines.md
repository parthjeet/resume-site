# Product Guidelines - MyRes Site

## Prose Style
- **Tone:** Professional and Conversational.
- **Voice:** Clear, engaging, and direct. Avoid overly formal or detached academic language.
- **Perspective:** First-person ("I", "my") for personal bio and experience; active voice for project descriptions (e.g., "Built a responsive UI..." rather than "A responsive UI was built...").
- **Clarity:** Prioritize readability and concise communication of technical concepts.

## Design Language
- **Aesthetic:** "Professional Retro-Tech Fusion".
- **Visual Metaphor:** Desktop operating system (Windows 95 era).
- **Color Palette:**
  - **Backgrounds:** Deep charcoal (`#1a1a2e`) for the desktop, Cream (`#f5f0e6`) for content windows.
  - **Accents:** Burgundy (`#8b4557`) for title bars/active states, Amber (`#d4a574`) for highlights and buttons.
- **Typography:**
  - **Headings:** Serif or Geometric Sans for display.
  - **Body:** System Sans-Serif for readability.
  - **Code/Technical:** Monospace for file names, paths, and code snippets.
- **Components:** Beveled edges, drop shadows, and window controls to mimic a desktop OS environment.

## User Experience (UX) Principles
- **Immersion:** The interface should feel like a cohesive operating system, from the boot sequence to window interactions.
- **Responsiveness:** Ensure a seamless experience across desktop, tablet, and mobile devices, adapting the desktop metaphor appropriately (e.g., simplified taskbar on mobile).
- **Accessibility:** Maintain high contrast ratios (AAA/AA), provide clear focus states, and ensure keyboard navigability.
- **Performance:** Prioritize smooth animations (Framer Motion) and fast load times (Vite) to maintain the illusion of a responsive native application.

## Content Strategy
- **Structure:** Content should be modular and data-driven (`src/data/content.ts`).
- **File Naming:** Use OS-themed file names for sections to reinforce the metaphor (e.g., `ABOUT_ME.TXT`, `PROJECTS_DIR`).
- **Technical Depth:** Descriptions should highlight specific technologies and architectural decisions to appeal to technical recruiters.
