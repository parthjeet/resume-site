# MyRes Site - Project Overview

> **Project Type**: Web Application (Portfolio/Resume Site)
> **Primary Language**: TypeScript
> **Framework**: React 18 + Vite 5
> **Generated**: 2026-01-08
> **Source**: `/home/parth/ws/myres-site`

---

## What is MyRes Site?

MyRes Site is a modern, interactive portfolio/resume web application that presents professional information through a unique desktop operating system-inspired interface. The project features a boot sequence animation, windowed UI components, and a taskbar navigation system that creates an immersive, nostalgic computing experience.

## Key Features

- **Desktop OS Interface**: Complete with boot sequence, windowed containers, and taskbar navigation
- **Portfolio Sections**: Dedicated screens for About, Experience, Skills, Projects, and Education
- **Modern UI Components**: Built with shadcn/ui component library (35+ components)
- **Smooth Transitions**: Framer Motion animations for screen navigation and UI interactions
- **Theme Support**: Dark/light mode capability with next-themes
- **Responsive Design**: Mobile-friendly with custom hooks for device detection
- **Type Safety**: Full TypeScript implementation with strict type checking

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend Framework | React 18.3.1 | Component-based UI development |
| Build Tool | Vite 5.4.19 | Fast development and optimized production builds |
| Language | TypeScript 5.8.3 | Type-safe JavaScript with enhanced tooling |
| Styling | Tailwind CSS 3.4.17 | Utility-first CSS framework |
| UI Components | shadcn/ui (Radix UI) | Accessible, customizable component primitives |
| State Management | @tanstack/react-query 5.83 | Server state management and caching |
| Routing | react-router-dom 6.30.1 | Client-side routing |
| Forms | react-hook-form 7.61.1 + zod 3.25.76 | Form handling with schema validation |
| Animations | framer-motion 12.24.10 | Declarative animations and transitions |
| Icons | lucide-react 0.462.0 | Icon library |
| Notifications | sonner 1.7.4 | Toast notifications |

## Project Structure

```
myres-site/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui component library (35+ components)
│   │   ├── screens/         # Portfolio screen components
│   │   │   ├── AboutScreen.tsx
│   │   │   ├── ExperienceScreen.tsx
│   │   │   ├── SkillsScreen.tsx
│   │   │   ├── ProjectsScreen.tsx
│   │   │   └── EducationScreen.tsx
│   │   ├── BootSequence.tsx # Boot animation component
│   │   ├── WindowContainer.tsx # Desktop window wrapper
│   │   ├── Taskbar.tsx      # Bottom navigation bar
│   │   └── NavLink.tsx      # Navigation link component
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx   # Mobile detection hook
│   │   ├── useScreenNavigation.ts # Screen navigation state
│   │   └── use-toast.ts     # Toast notification hook
│   ├── data/                # Static content data
│   │   └── content.ts       # Portfolio data (experience, skills, etc.)
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route page components
│   │   ├── Index.tsx        # Main portfolio page
│   │   └── NotFound.tsx     # 404 error page
│   ├── App.tsx              # Root application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── docs/                    # Project documentation
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── components.json          # shadcn/ui configuration
└── README.md                # Project readme

```

## Quick Start

### Prerequisites
- Node.js 16+ and npm installed

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd myres-site

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with hot reload |
| `npm run build` | Build for production (optimized) |
| `npm run build:dev` | Build with development mode |
| `npm run lint` | Run ESLint code quality checks |
| `npm run preview` | Preview production build locally |

## Architecture Overview

The application follows a component-based architecture with clear separation of concerns:

### Component Hierarchy

```
App (src/App.tsx:11)
└── QueryClientProvider + TooltipProvider + Toasters
    └── BrowserRouter
        └── Routes
            ├── / → Index (src/pages/Index.tsx:13)
            │   ├── BootSequence (if not booted)
            │   └── Main Interface (after boot)
            │       ├── WindowContainer
            │       │   └── [Current Screen Component]
            │       └── Taskbar
            └── * → NotFound
```

### Key Architectural Patterns

1. **Desktop OS Metaphor**: The entire UI is designed around a desktop operating system concept
   - Boot sequence on initial load (`src/components/BootSequence.tsx`)
   - Windowed interface for content (`src/components/WindowContainer.tsx`)
   - Taskbar for navigation (`src/components/Taskbar.tsx`)

2. **Screen-Based Navigation**: Instead of traditional routing, the app uses a screen navigation system
   - Single-page application with screen switching
   - Custom `useScreenNavigation` hook manages state
   - Smooth transitions between screens with framer-motion

3. **Component Library Integration**: Extensive use of shadcn/ui components
   - 35+ pre-built accessible components
   - Customized with Tailwind CSS utilities
   - Located in `src/components/ui/`

4. **Data-Driven Content**: Portfolio content separated from presentation
   - All content in `src/data/content.ts`
   - Easy to update without modifying components
   - Type-safe data structures

## Core Concepts

### Screen Navigation System

The application uses a custom screen navigation system instead of traditional routing:

**Source**: `src/hooks/useScreenNavigation.ts`

```typescript
type ScreenId = "about" | "experience" | "skills" | "projects" | "education"
```

The `useScreenNavigation` hook manages:
- Current active screen
- Transition states
- Screen title resolution
- Navigation functions

### Window Container Abstraction

**Source**: `src/components/WindowContainer.tsx`

Every screen is rendered within a `WindowContainer` that provides:
- Desktop window chrome (title bar, borders)
- Consistent styling and spacing
- Icon display
- Transition handling

### Boot Sequence

**Source**: `src/components/BootSequence.tsx`

The boot sequence creates an authentic OS boot experience:
- Displays on first load
- Animated text sequences
- Callback when complete
- Sets the stage for the desktop interface

## Data Structure

Portfolio content is organized in `src/data/content.ts:1`:

| Export | Description | Usage |
|--------|-------------|-------|
| `personalInfo` | Name, title, bio, contact info | About screen header |
| `experiences` | Work history array | Experience screen |
| `skillCategories` | Grouped skills array | Skills screen |
| `projects` | Project portfolio array | Projects screen |
| `education` | Education history array | Education screen |
| `certifications` | Professional certifications | Education screen |
| `screens` | Screen metadata | Navigation configuration |

## UI Component Library

The project uses **shadcn/ui**, a collection of re-usable components built with:
- Radix UI primitives (accessibility)
- Tailwind CSS (styling)
- class-variance-authority (variant management)

### Available Components

Located in `src/components/ui/`, the library includes:

**Form Components**: input, select, checkbox, switch, slider, radio-group, input-otp, form
**Layout Components**: tabs, accordion, collapsible, resizable, separator, scroll-area
**Overlay Components**: dialog, alert-dialog, sheet, drawer, popover, hover-card, tooltip
**Navigation Components**: menubar, navigation-menu, context-menu, dropdown-menu
**Feedback Components**: toast, toaster, sonner, progress
**Display Components**: table, avatar, badge, card, carousel

## Development Workflow

### Adding New Content

1. Update data in `src/data/content.ts`
2. Components automatically reflect changes
3. No component modifications needed

### Adding New Screens

1. Create screen component in `src/components/screens/`
2. Add screen metadata to `screens` array in `src/data/content.ts`
3. Add route case in `src/pages/Index.tsx:24` renderScreen function
4. Update ScreenId type in `src/hooks/useScreenNavigation.ts`

### Styling

The project uses Tailwind CSS with custom configuration in `tailwind.config.ts:1`:

- Custom color scheme with CSS variables
- Typography plugin enabled
- Animation utilities
- Responsive breakpoints

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system architecture and design patterns
- [COMPONENTS.md](./COMPONENTS.md) - Complete component documentation
- [UI-PATTERNS.md](./UI-PATTERNS.md) - shadcn/ui usage and patterns
- [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) - State management and navigation
- [DATA-MODELS.md](./DATA-MODELS.md) - Data structures and types
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide for contributors

---

**For Contributors**: This project welcomes contributions. See [DEVELOPMENT.md](./DEVELOPMENT.md) for setup instructions and coding guidelines.
