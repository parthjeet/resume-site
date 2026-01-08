# Architecture Documentation

> **Project**: MyRes Site
> **Generated**: 2026-01-08
> **Source**: `/home/parth/ws/myres-site`
> **Related Docs**: [OVERVIEW.md](./OVERVIEW.md), [COMPONENTS.md](./COMPONENTS.md), [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md)

---

## Table of Contents

- [System Architecture Overview](#system-architecture-overview)
- [Design Patterns](#design-patterns)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Animation System](#animation-system)
- [Routing Strategy](#routing-strategy)
- [State Management](#state-management)
- [Styling Architecture](#styling-architecture)

---

## System Architecture Overview

MyRes Site follows a **component-based single-page application (SPA)** architecture with a unique desktop OS metaphor. The application prioritizes smooth user experience through custom navigation, animations, and a cohesive visual design system.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Application Shell (App.tsx)                               │ │
│  │  • QueryClientProvider (React Query)                       │ │
│  │  • TooltipProvider (Radix UI)                             │ │
│  │  • Toast Systems (2 implementations)                       │ │
│  │  • BrowserRouter (React Router)                           │ │
│  └─────────────────┬──────────────────────────────────────────┘ │
│                    │                                              │
│  ┌─────────────────▼──────────────────────────────────────────┐ │
│  │  Route Container (pages/Index.tsx)                         │ │
│  │  • Boot Sequence Gate                                      │ │
│  │  • Screen Navigation State                                 │ │
│  │  • Screen Renderer                                         │ │
│  └─────────────────┬──────────────────────────────────────────┘ │
│                    │                                              │
│      ┌─────────────┴─────────────┐                               │
│      │                           │                               │
│  ┌───▼───────────┐     ┌────────▼──────────┐                    │
│  │ Boot Sequence │────>│  Main Interface   │                    │
│  │  (First Load) │     │  ┌──────────────┐ │                    │
│  └───────────────┘     │  │ Window       │ │                    │
│                        │  │ Container    │ │                    │
│                        │  │ ┌──────────┐ │ │                    │
│                        │  │ │ Screen   │ │ │                    │
│                        │  │ │ Content  │ │ │                    │
│                        │  │ └──────────┘ │ │                    │
│                        │  └──────────────┘ │                    │
│                        │  ┌──────────────┐ │                    │
│                        │  │   Taskbar    │ │                    │
│                        │  └──────────────┘ │                    │
│                        └───────────────────┘                    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  Static Data Layer (data/content.ts)                            │
│  • Personal Information                                          │
│  • Experiences, Skills, Projects, Education                      │
│  • Screen Metadata                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Core Architectural Principles

1. **Desktop OS Metaphor**: Entire interface modeled after a desktop operating system
2. **Component Isolation**: Each component is self-contained and reusable
3. **Data Separation**: Content separated from presentation logic
4. **Animation-First**: Smooth transitions between states and screens
5. **Accessibility**: Built on Radix UI primitives for keyboard and screen reader support
6. **Type Safety**: Full TypeScript coverage with strict type checking

---

## Design Patterns

### 1. Container/Presentation Pattern

The application separates **container components** (logic) from **presentation components** (UI).

**Container Component Example**: `pages/Index.tsx:13`
```typescript
// Manages state and navigation logic
const Index = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const { currentScreen, goToScreen, ... } = useScreenNavigation();

  // Delegates rendering to presentation components
  return <WindowContainer>{renderScreen()}</WindowContainer>;
};
```

**Presentation Component Example**: `components/screens/AboutScreen.tsx:11`
```typescript
// Pure presentation, receives data and callbacks as props
export function AboutScreen({ onNavigate }: AboutScreenProps) {
  return <motion.div>{/* UI content */}</motion.div>;
}
```

### 2. Custom Hook Pattern

Complex state logic is encapsulated in custom hooks for reusability.

**Navigation Hook**: `hooks/useScreenNavigation.ts:17`
```typescript
export function useScreenNavigation(
  initialScreen: ScreenId = "about",
  transitionDuration: number = 400
): UseScreenNavigationReturn {
  // Encapsulates navigation state and logic
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(initialScreen);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToScreen = useCallback((screenId: ScreenId) => {
    // Navigation logic with transition management
  }, [dependencies]);

  return { currentScreen, goToScreen, ... };
}
```

### 3. Compound Component Pattern

The `WindowContainer` component uses a compound component pattern where parent and children work together.

**Source**: `components/WindowContainer.tsx:27`
```typescript
export function WindowContainer({ title, icon, children, isTransitioning }) {
  return (
    <div className="window">
      <div className="title-bar">{/* Title bar with icon */}</div>
      <div className="content">
        <AnimatePresence mode="wait">
          {children} {/* Children control their own content */}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

### 4. Configuration-Driven UI

Screen definitions and personal data are configuration-driven, making updates simple.

**Source**: `data/content.ts:209`
```typescript
export const screens = [
  { id: "about", label: "About", windowTitle: "ALEX_CHEN_PORTFOLIO.EXE", icon: "terminal" },
  { id: "experience", label: "Experience", windowTitle: "EXPERIENCE_LOG.TXT", icon: "building" },
  // ...
];
```

The `screens` array drives:
- Taskbar navigation buttons (`components/Taskbar.tsx:49`)
- Window title display (`hooks/useScreenNavigation.ts:55`)
- Screen order and navigation

### 5. Render Props Pattern

Some components accept render functions for flexible rendering.

**Example**: AnimatePresence with mode="wait" ensures smooth transitions:
```typescript
<AnimatePresence mode="wait">
  <motion.div key={title}>
    {children}
  </motion.div>
</AnimatePresence>
```

---

## Component Architecture

### Component Hierarchy

```
App (src/App.tsx:11)
├── QueryClientProvider
│   └── TooltipProvider
│       ├── Toaster (shadcn/ui)
│       ├── Sonner (alternative toaster)
│       └── BrowserRouter
│           └── Routes
│               ├── Route "/" → Index
│               │   ├── BootSequence (conditional, first load only)
│               │   │   └── MotionDiv (fade-in animation)
│               │   │       └── Loading text
│               │   │
│               │   └── Main Interface (after boot)
│               │       ├── WindowContainer
│               │       │   ├── Title Bar
│               │       │   │   ├── Icon (from iconMap)
│               │       │   │   └── Window Controls (dots)
│               │       │   └── Content Area (AnimatePresence)
│               │       │       └── [Current Screen Component]
│               │       │           ├── AboutScreen
│               │       │           ├── ExperienceScreen
│               │       │           ├── SkillsScreen
│               │       │           ├── ProjectsScreen
│               │       │           └── EducationScreen
│               │       │
│               │       └── Taskbar
│               │           ├── Start Button
│               │           ├── Navigation Buttons (generated from screens array)
│               │           └── System Tray
│               │               ├── Social Links
│               │               └── Clock
│               │
│               └── Route "*" → NotFound
```

### Component Layers

The application is organized into distinct layers:

#### Layer 1: Application Shell
**Location**: `src/App.tsx:11`

Provides global context and routing:
- React Query client for server state (future-proofing)
- Tooltip provider for UI tooltips
- Toast notification systems
- React Router for navigation

#### Layer 2: Page Layer
**Location**: `src/pages/`

Page components that correspond to routes:
- `Index.tsx:13` - Main portfolio page (single page, multiple screens)
- `NotFound.tsx` - 404 error page

#### Layer 3: Layout Components
**Location**: `src/components/`

Core layout components:
- `BootSequence.tsx:9` - Initial boot animation
- `WindowContainer.tsx:27` - Desktop window wrapper
- `Taskbar.tsx:13` - Bottom navigation bar

#### Layer 4: Screen Components
**Location**: `src/components/screens/`

Content screens within the window container:
- `AboutScreen.tsx:11` - Personal introduction
- `ExperienceScreen.tsx` - Work history
- `SkillsScreen.tsx` - Technical skills
- `ProjectsScreen.tsx` - Project portfolio
- `EducationScreen.tsx` - Education and certifications

#### Layer 5: UI Components
**Location**: `src/components/ui/`

Reusable shadcn/ui components (35+ components):
- Form components (input, select, checkbox, etc.)
- Layout components (tabs, accordion, etc.)
- Overlay components (dialog, popover, etc.)
- Navigation components (dropdown-menu, etc.)

---

## Data Flow

### Unidirectional Data Flow

The application follows a unidirectional data flow pattern:

```
┌─────────────────────────────────────────────────────────────┐
│  Static Data Source (data/content.ts)                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Page Component (pages/Index.tsx)                           │
│  • Imports data from content.ts                             │
│  • Manages navigation state via useScreenNavigation hook    │
│  • Determines which screen to render                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Layout Components (WindowContainer, Taskbar)               │
│  • Receive current state and callbacks as props             │
│  • Taskbar receives: currentScreen, onNavigate, isTransitioning│
│  • WindowContainer receives: title, icon, isTransitioning   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Screen Components (AboutScreen, ExperienceScreen, etc.)    │
│  • Import data directly from content.ts                     │
│  • Receive navigation callbacks as props                    │
│  • Pure presentation, no state management                   │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Event Flow

When a user clicks a navigation button:

```
1. User clicks taskbar button
   └─> Taskbar.tsx:52 (onClick event)

2. Taskbar calls onNavigate callback
   └─> Passed from Index.tsx:64 → goToScreen function

3. useScreenNavigation hook updates state
   └─> useScreenNavigation.ts:28 (goToScreen function)
       ├─> Sets isTransitioning = true
       ├─> Sets transition direction (forward/backward)
       ├─> Updates currentScreen state
       └─> Schedules isTransitioning = false after 400ms

4. Index.tsx re-renders with new currentScreen
   └─> Index.tsx:24 (renderScreen function)
       └─> Returns appropriate screen component

5. WindowContainer detects title change
   └─> WindowContainer.tsx:36 (useEffect)
       └─> Triggers flicker animation on title bar

6. AnimatePresence handles screen transition
   └─> WindowContainer.tsx:80 (AnimatePresence)
       └─> Exit animation → New screen entry animation

7. isTransitioning resets to false
   └─> Navigation buttons re-enable
```

### Data Import Pattern

Screen components import data directly (no prop drilling):

```typescript
// In any screen component
import { personalInfo, experiences } from "@/data/content";

export function SomeScreen() {
  return <div>{personalInfo.name}</div>;
}
```

This pattern:
- Avoids deep prop drilling
- Makes components easier to test (data is predictable)
- Simplifies refactoring (change data structure in one place)

---

## Animation System

### Animation Architecture

The application uses **Framer Motion** for declarative animations with a consistent easing system.

**Source**: `src/lib/animations.ts:1`

#### Animation Variants

All animations use predefined variants for consistency:

```typescript
// Container variant for staggered children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // 100ms delay between children
      delayChildren: 0.1      // Initial 100ms delay
    }
  }
};

// Individual element variant
export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 12 },  // Start 12px below
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }  // Custom easing
  }
};
```

#### Animation Layers

**1. Page-Level Animations**

Boot sequence and initial page load:
- `BootSequence.tsx:25` - Fade in boot text
- `BootSequence.tsx:37` - Fade in main content after boot
- `Taskbar.tsx:32` - Slide up from bottom with delay

**2. Container Animations**

Window container entrance:
- `WindowContainer.tsx:48` - Fade in + scale up on mount
- `WindowContainer.tsx:57` - Flicker effect on title change
- `WindowContainer.tsx:81` - Fade transition between screens

**3. Content Animations**

Screen content stagger animations:
- `AboutScreen.tsx:14` - Stagger container for all elements
- `AboutScreen.tsx:22` onwards - Each element uses fadeSlideUp variant

### Animation Timeline

When the page loads:

```
Time    Event
────────────────────────────────────────────────────────
0ms     Boot sequence appears (fade in)
        └─> BootSequence.tsx:25

600ms   Boot complete, main interface mounts
        └─> BootSequence.tsx:14

600ms   WindowContainer animates in (fade + scale)
        └─> WindowContainer.tsx:48

700ms   Screen content begins staggered animation
        └─> First child animates (100ms delay)

800ms   Second child animates
        └─> Each subsequent child +100ms

800ms   Taskbar slides up from bottom (with 800ms delay)
        └─> Taskbar.tsx:32 (delay: 0.8s)
```

### Transition Management

The `isTransitioning` state prevents navigation spam:

```typescript
// Navigation disabled during transition
<button
  onClick={() => !isTransitioning && onNavigate(screenId)}
  disabled={isTransitioning}
>
```

Transition duration is configurable:
- Default: 400ms (`useScreenNavigation.ts:19`)
- Can be customized per instance

---

## Routing Strategy

### Single-Page Application Approach

Unlike traditional multi-page apps, MyRes Site uses a **screen-based navigation** system:

**Traditional Routing**:
```
/about     → AboutPage component
/skills    → SkillsPage component
/projects  → ProjectsPage component
```

**MyRes Site Approach**:
```
/          → Index page
            └─> Renders AboutScreen | SkillsScreen | ProjectsScreen
                based on currentScreen state
```

### Why Screen-Based Navigation?

1. **Smooth Transitions**: Full control over animations between screens
2. **State Preservation**: Window container and taskbar persist across screen changes
3. **Performance**: No page re-mounts, only content area updates
4. **User Experience**: Mimics desktop OS behavior (single window, changing content)

### Route Configuration

**Source**: `src/App.tsx:17`

```typescript
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

Only two routes:
- `/` - Main application (all screens)
- `*` - Catch-all for 404 errors

### Future Routing Considerations

If traditional routing is needed in the future:

```typescript
// Potential enhancement
<Routes>
  <Route path="/" element={<Index />}>
    <Route index element={<Navigate to="/about" />} />
    <Route path="about" element={<AboutScreen />} />
    <Route path="skills" element={<SkillsScreen />} />
    // ...
  </Route>
</Routes>
```

Benefits:
- Deep linking to specific screens
- Browser back/forward navigation
- Shareable URLs

Trade-offs:
- More complex animation coordination
- Need to sync URL with screen state

---

## State Management

### State Architecture

The application uses **local component state** with **custom hooks** for state management. No global state library (Redux, Zustand) is needed due to the simple state requirements.

### State Layers

#### 1. Application-Level State

**Location**: `src/pages/Index.tsx:14`

```typescript
const [bootComplete, setBootComplete] = useState(false);
```

- Controls whether boot sequence is shown or main interface
- Set once on mount, never changes again

#### 2. Navigation State

**Location**: `src/hooks/useScreenNavigation.ts:21`

```typescript
const [currentScreen, setCurrentScreen] = useState<ScreenId>(initialScreen);
const [isTransitioning, setIsTransitioning] = useState(false);
const [transitionDirection, setTransitionDirection] = useState<"forward" | "backward">("forward");
```

- `currentScreen`: Which screen is currently active
- `isTransitioning`: Prevents navigation during transitions
- `transitionDirection`: For potential directional animations (forward/backward)

#### 3. UI State

**Location**: `src/components/WindowContainer.tsx:33`

```typescript
const [displayTitle, setDisplayTitle] = useState(title);
const [isFlickering, setIsFlickering] = useState(false);
```

- `displayTitle`: Shown title (for flicker animation delay)
- `isFlickering`: Triggers CSS flicker effect

**Location**: `src/components/Taskbar.tsx:14`

```typescript
const [currentTime, setCurrentTime] = useState("");
```

- `currentTime`: Current time string for taskbar clock
- Updated every 60 seconds via setInterval

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Index Component                                          │
│                                                           │
│  bootComplete ──────────────> (Conditional Render)      │
│                                     │                     │
│                        ┌────────────┴────────────┐       │
│                        │                         │       │
│                  BootSequence              Main Interface│
│                                                           │
│  useScreenNavigation ──────────> (Navigation Logic)     │
│    • currentScreen                      │                │
│    • isTransitioning                    │                │
│    • goToScreen()              ┌────────┴────────┐       │
│                                │                 │       │
│                           WindowContainer    Taskbar     │
│                                │                 │       │
│                    Receives: title, icon    currentScreen│
│                    Derives: displayTitle    isTransitioning│
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Why No Global State?

The application doesn't need Redux or similar because:

1. **Limited Shared State**: Only navigation state is shared between components
2. **Prop Drilling is Shallow**: Maximum depth is 2 levels (Index → Taskbar/WindowContainer)
3. **Data is Static**: Portfolio content doesn't change during runtime
4. **Custom Hook Suffices**: `useScreenNavigation` provides all needed logic

### Future State Considerations

If the application grows, consider:
- **Zustand** for global state (lightweight, TypeScript-friendly)
- **React Context** for theme preferences (dark/light mode)
- **React Query** for server data (already installed, currently unused)

---

## Styling Architecture

### Tailwind CSS + CSS Variables

The project uses **Tailwind CSS** with **CSS custom properties** for theming.

**Configuration**: `tailwind.config.ts:1`

### Color System

Colors are defined as CSS variables in `src/index.css`:

```css
:root {
  --background: 42 39 34;      /* Warm beige background */
  --foreground: 26 24 21;      /* Dark brown text */
  --cream: 250 248 245;        /* Light cream for containers */
  --charcoal: 42 39 34;        /* Charcoal gray */
  --amber: 251 191 36;         /* Amber accent */
  /* ... more variables ... */
}
```

Tailwind references these variables:

```javascript
// tailwind.config.ts
colors: {
  background: "rgb(var(--background))",
  cream: "rgb(var(--cream))",
  amber: "rgb(var(--amber))",
  // ...
}
```

### Component Styling Strategy

**1. Utility-First with Tailwind**

Most styling uses Tailwind utility classes:

```tsx
<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber hover:bg-gold transition-colors">
```

**2. Custom CSS Classes for Complex Components**

Complex components use custom CSS classes in `src/index.css`:

```css
/* Window Container */
.window-title-bar {
  @apply flex items-center justify-between px-5 py-3 bg-charcoal border-b border-gray-400/20;
}

/* Taskbar */
.taskbar {
  @apply fixed bottom-0 left-0 right-0 h-14 bg-charcoal border-t border-gray-400/20;
}
```

Benefits:
- Keeps JSX clean
- Easier to maintain complex styles
- Can use Tailwind's `@apply` directive

**3. Responsive Design**

Mobile-first responsive breakpoints:

```tsx
<div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
  {/* Stacked on mobile, side-by-side on large screens */}
</div>
```

Standard breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Typography System

**Source**: `tailwind.config.ts` + `src/index.css`

Custom typography classes:

```css
.hero-display {
  @apply text-5xl md:text-6xl font-bold text-charcoal tracking-tight;
}

.text-body {
  @apply text-base md:text-lg;
}

.terminal-prompt {
  @apply text-amber font-semibold;
}
```

### Animation Classes

Custom animation utilities in `src/index.css`:

```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.animate-flicker {
  animation: flicker 0.3s ease-in-out;
}
```

---

## Integration Points

### External Service Integration

Currently, the application is entirely client-side with no external API calls. However, it's structured to easily add integrations:

#### React Query Setup

**Source**: `src/App.tsx:9`

```typescript
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  {/* app */}
</QueryClientProvider>
```

React Query is installed and ready for:
- API data fetching
- Caching
- Background refetching
- Optimistic updates

#### Potential Integration Points

1. **CMS Integration**: Fetch portfolio data from a headless CMS
   ```typescript
   // Future implementation
   const { data: experiences } = useQuery({
     queryKey: ['experiences'],
     queryFn: fetchExperiences
   });
   ```

2. **Analytics**: Add analytics tracking
   ```typescript
   // Track screen navigation
   useEffect(() => {
     analytics.track('screen_view', { screen: currentScreen });
   }, [currentScreen]);
   ```

3. **Contact Form**: Add email submission
   ```typescript
   const mutation = useMutation({
     mutationFn: submitContactForm,
     onSuccess: () => toast.success("Message sent!")
   });
   ```

---

## Performance Considerations

### Current Optimizations

1. **Code Splitting**: Vite automatically splits code by route
2. **Animation Performance**: Framer Motion uses GPU-accelerated transforms
3. **Image Optimization**: Placeholder gradients instead of heavy images
4. **Minimal JavaScript**: No heavy external dependencies

### Performance Metrics

Target metrics:
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.0s
- **Cumulative Layout Shift (CLS)**: < 0.1

### Future Optimizations

1. **Lazy Loading Screens**: Load screen components on demand
   ```typescript
   const AboutScreen = lazy(() => import('./screens/AboutScreen'));
   ```

2. **Image Optimization**: Use optimized image formats (WebP, AVIF)
3. **Bundle Analysis**: Use `vite-bundle-analyzer` to identify large dependencies
4. **Service Worker**: Add offline support with Workbox

---

## Security Considerations

### Current Security Posture

1. **No Server-Side Code**: Client-only application reduces attack surface
2. **No User Input**: No forms or user-generated content (currently)
3. **External Links**: Uses `rel="noopener noreferrer"` on external links
   - Source: `Taskbar.tsx:67`
4. **TypeScript**: Type safety prevents many common bugs

### Future Security Considerations

If adding server integration:

1. **Input Validation**: Use Zod schemas for all user input
2. **XSS Prevention**: Sanitize any user-generated content
3. **CSRF Protection**: Add CSRF tokens for form submissions
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Content Security Policy (CSP)**: Add CSP headers

---

## Extensibility

### Adding New Screens

To add a new screen (e.g., "Contact"):

**Step 1**: Create screen component

```typescript
// src/components/screens/ContactScreen.tsx
export function ContactScreen() {
  return <div>Contact content</div>;
}
```

**Step 2**: Update data configuration

```typescript
// src/data/content.ts
export const screens = [
  // ... existing screens
  { id: "contact", label: "Contact", windowTitle: "CONTACT_FORM.EXE", icon: "mail" }
];
```

**Step 3**: Update ScreenId type

```typescript
// src/hooks/useScreenNavigation.ts
export type ScreenId = "about" | "experience" | "skills" | "projects" | "education" | "contact";
```

**Step 4**: Add to renderScreen function

```typescript
// src/pages/Index.tsx
case "contact":
  return <ContactScreen />;
```

That's it! The new screen will automatically appear in the taskbar and be navigable.

### Adding New UI Components

To add a new shadcn/ui component:

```bash
npx shadcn@latest add [component-name]
```

This adds the component to `src/components/ui/`.

### Customizing Animations

Create new animation variants in `src/lib/animations.ts`:

```typescript
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easeOut }
  }
};
```

Use in components:

```tsx
<motion.div variants={slideInLeft} initial="hidden" animate="show">
  Content
</motion.div>
```

---

## Related Documentation

- [COMPONENTS.md](./COMPONENTS.md) - Detailed component documentation
- [UI-PATTERNS.md](./UI-PATTERNS.md) - shadcn/ui patterns and usage
- [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) - Deep dive into state management
- [DATA-MODELS.md](./DATA-MODELS.md) - Data structures and types
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow and guidelines

---

**Last Updated**: 2026-01-08
