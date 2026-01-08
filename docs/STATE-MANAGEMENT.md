# State Management Documentation

> **Project**: MyRes Site
> **Generated**: 2026-01-08
> **Source**: `/home/parth/ws/myres-site`
> **Related Docs**: [OVERVIEW.md](./OVERVIEW.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [COMPONENTS.md](./COMPONENTS.md), [UI-PATTERNS.md](./UI-PATTERNS.md)

---

## Table of Contents

- [State Management Philosophy](#state-management-philosophy)
- [State Architecture Overview](#state-architecture-overview)
- [Navigation State](#navigation-state)
- [UI State Management](#ui-state-management)
- [Data Flow Patterns](#data-flow-patterns)
- [State Update Lifecycle](#state-update-lifecycle)
- [State Debugging](#state-debugging)
- [Testing State Logic](#testing-state-logic)
- [Future State Considerations](#future-state-considerations)
- [Performance Considerations](#performance-considerations)

---

## State Management Philosophy

### Why No Redux/Zustand?

MyRes Site intentionally avoids external state management libraries like Redux, Zustand, or MobX. This decision is grounded in several architectural principles:

#### 1. Application Complexity Profile

The application has a **simple state complexity profile**:
- **5 screens** with linear navigation
- **No user-generated content** or complex forms
- **Static data** (portfolio content doesn't change at runtime)
- **Minimal shared state** (only navigation state)

```typescript
// The entire shared state fits in one custom hook
const {
  currentScreen,      // Current active screen
  isTransitioning,    // Navigation lock
  goToScreen          // Navigation function
} = useScreenNavigation();
```

#### 2. Shallow Component Tree

The component hierarchy is only **3 levels deep** at most:

```
Index (Page)
├── WindowContainer (Layout)
│   └── AboutScreen (Content)
└── Taskbar (Layout)
```

**Prop drilling is minimal**:
- Index → WindowContainer: `title`, `icon`, `isTransitioning`
- Index → Taskbar: `currentScreen`, `onNavigate`, `isTransitioning`
- Index → Screens: `onNavigate` (only AboutScreen)

With such shallow nesting, prop drilling is not a problem that requires solving.

#### 3. Performance is Not a Bottleneck

React's built-in state management with `useState` and `useCallback` provides:
- **Sub-millisecond re-renders** for small component trees
- **Automatic batching** of state updates (React 18)
- **Sufficient memoization** with `useCallback`

No performance issues have been observed that would justify the added complexity of a state library.

#### 4. Code Maintainability

Using React's built-in primitives:
- **Reduces bundle size** by ~10-50KB (Redux + middleware)
- **Eliminates learning curve** for contributors familiar with React
- **Reduces indirection** - no actions, reducers, or selectors to track
- **Simplifies debugging** - state lives where it's defined

#### 5. Type Safety

TypeScript provides full type safety without additional configuration:

```typescript
// Type-safe navigation with discriminated union
export type ScreenId = "about" | "experience" | "skills" | "projects" | "education";

// Invalid screens are compile-time errors
goToScreen("invalid"); // ❌ TypeScript error
goToScreen("about");   // ✅ Valid
```

### When to Add Global State

Consider adding Zustand or Context when:

1. **Shared state exceeds 3-4 distinct pieces** (e.g., theme, auth, notifications, user preferences)
2. **Prop drilling exceeds 4 levels** deep
3. **Multiple unrelated components** need the same state
4. **State updates become performance bottlenecks** (profile first!)

**Current threshold**: The application would need to grow **3-4x in complexity** before global state becomes justified.

---

## State Architecture Overview

### State Taxonomy

MyRes Site uses a **layered state architecture** with three distinct state layers:

```
┌────────────────────────────────────────────────────────────┐
│  Layer 1: Application-Level State                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  bootComplete: boolean                               │  │
│  │  Location: pages/Index.tsx:14                        │  │
│  │  Scope: Controls boot sequence display              │  │
│  │  Lifetime: Set once, never changes                  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Layer 2: Navigation State (Custom Hook)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  currentScreen: ScreenId                             │  │
│  │  isTransitioning: boolean                            │  │
│  │  transitionDirection: "forward" | "backward"         │  │
│  │  Location: hooks/useScreenNavigation.ts:21-23        │  │
│  │  Scope: Shared between Index, Taskbar, WindowContainer│
│  │  Lifetime: Persists for session                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Layer 3: UI State (Component-Local)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WindowContainer:                                     │  │
│  │    displayTitle: string                              │  │
│  │    isFlickering: boolean                             │  │
│  │  Location: components/WindowContainer.tsx:33-34      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Taskbar:                                             │  │
│  │    currentTime: string                               │  │
│  │  Location: components/Taskbar.tsx:14                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  BootSequence:                                        │  │
│  │    showContent: boolean                              │  │
│  │  Location: components/BootSequence.tsx:10            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Layer 4: Static Data (No State)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  screens, personalInfo, experiences, skills,         │  │
│  │  projects, education, certifications                 │  │
│  │  Location: data/content.ts                           │  │
│  │  Nature: Immutable configuration                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### State Ownership Principles

1. **State lives at the lowest common ancestor** of components that need it
2. **Derived state is computed, not stored** (e.g., `currentIndex` is derived from `currentScreen`)
3. **UI state stays local** (flicker animation, clock display)
4. **Business logic lives in hooks** (navigation logic in `useScreenNavigation`)

### State Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
│  (Click taskbar button, boot complete, title change, etc.)  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Event Handler / Callback                        │
│  (onNavigate, onComplete, useEffect, setInterval)           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                State Update Function                         │
│  (setCurrentScreen, setBootComplete, setIsFlickering)       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Re-render                            │
│  (Only affected components re-render)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 Side Effects (useEffect)                     │
│  (Animations, timers, cleanup)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Navigation State

### useScreenNavigation Hook Deep Dive

The `useScreenNavigation` hook is the **core state management primitive** for the entire application. It encapsulates all navigation logic and transition management.

**Location**: `src/hooks/useScreenNavigation.ts`

#### Hook Signature

```typescript
export type ScreenId = "about" | "experience" | "skills" | "projects" | "education";

interface UseScreenNavigationReturn {
  currentScreen: ScreenId;              // Active screen
  currentIndex: number;                 // Index in screens array (derived)
  isTransitioning: boolean;             // Navigation lock
  transitionDirection: "forward" | "backward"; // Animation hint
  goToScreen: (screenId: ScreenId) => void;    // Direct navigation
  goNext: () => void;                   // Navigate forward
  goPrevious: () => void;               // Navigate backward
  getWindowTitle: () => string;         // Get current window title
}

export function useScreenNavigation(
  initialScreen: ScreenId = "about",
  transitionDuration: number = 400
): UseScreenNavigationReturn
```

#### Internal State

The hook manages three pieces of state:

```typescript
// State 1: Current active screen
const [currentScreen, setCurrentScreen] = useState<ScreenId>(initialScreen);

// State 2: Navigation lock (prevents spamming)
const [isTransitioning, setIsTransitioning] = useState(false);

// State 3: Animation direction hint (for future use)
const [transitionDirection, setTransitionDirection] = useState<"forward" | "backward">("forward");
```

#### Derived Values

Some values are **derived** rather than stored as state:

```typescript
// Derived: List of all screen IDs from configuration
const screenIds = screens.map(s => s.id) as ScreenId[];

// Derived: Current screen index in the array
const currentIndex = screenIds.indexOf(currentScreen);

// Derived: Window title for current screen
const getWindowTitle = useCallback(() => {
  const screen = screens.find(s => s.id === currentScreen);
  return screen?.windowTitle || "PORTFOLIO.EXE";
}, [currentScreen]);
```

**Why derive instead of store?**
- **Single source of truth**: `currentScreen` is the only source
- **Consistency**: Derived values can't get out of sync
- **Performance**: Cheap calculations (array lookup) don't justify state

#### Core Navigation Logic: goToScreen

The `goToScreen` function is the heart of navigation:

```typescript
const goToScreen = useCallback((screenId: ScreenId) => {
  // Guard 1: Prevent navigation during transitions
  if (isTransitioning) return;

  // Guard 2: Prevent navigating to current screen (no-op)
  if (screenId === currentScreen) return;

  // Calculate animation direction
  const newIndex = screenIds.indexOf(screenId);
  const direction = newIndex > currentIndex ? "forward" : "backward";

  // Update state in sequence
  setIsTransitioning(true);           // Lock navigation
  setTransitionDirection(direction);  // Set animation hint
  setCurrentScreen(screenId);         // Change screen

  // Schedule transition unlock
  setTimeout(() => {
    setIsTransitioning(false);        // Unlock navigation
  }, transitionDuration);

}, [isTransitioning, currentScreen, currentIndex, screenIds, transitionDuration]);
```

**Key implementation details**:

1. **Guards prevent invalid states**:
   - Can't navigate during transitions (prevents animation conflicts)
   - Can't navigate to the current screen (avoids unnecessary re-renders)

2. **Atomic state updates**:
   - All state updates happen synchronously
   - React batches them into a single re-render (React 18)

3. **Timed transition lock**:
   - `isTransitioning` acts as a mutex
   - Unlocked after `transitionDuration` (default: 400ms)
   - Prevents navigation button spam

4. **Direction calculation**:
   - Forward: new index > current index
   - Backward: new index < current index
   - Used for future directional slide animations

#### Helper Navigation Functions

```typescript
// Navigate to next screen (boundary-aware)
const goNext = useCallback(() => {
  if (currentIndex < screenIds.length - 1) {
    goToScreen(screenIds[currentIndex + 1]);
  }
  // At last screen: do nothing (no wrap-around)
}, [currentIndex, screenIds, goToScreen]);

// Navigate to previous screen (boundary-aware)
const goPrevious = useCallback(() => {
  if (currentIndex > 0) {
    goToScreen(screenIds[currentIndex - 1]);
  }
  // At first screen: do nothing (no wrap-around)
}, [currentIndex, screenIds, goToScreen]);
```

**Design decisions**:
- **No wrap-around**: Reaching the end stops navigation (UX choice)
- **Reuses goToScreen**: Single source of navigation logic
- **Boundary checks**: Prevents invalid array access

#### Hook Dependencies and Memoization

All functions are wrapped in `useCallback` to prevent unnecessary re-renders:

```typescript
const goToScreen = useCallback(
  (screenId: ScreenId) => { /* ... */ },
  [isTransitioning, currentScreen, currentIndex, screenIds, transitionDuration]
);
```

**Dependency analysis**:
- `isTransitioning`: Must include (guards against concurrent navigation)
- `currentScreen`: Must include (guards against same-screen navigation)
- `currentIndex`: Must include (used in direction calculation)
- `screenIds`: Stable reference (derived from static `screens` array)
- `transitionDuration`: Stable (hook parameter)

**Re-render triggers**:
- `currentScreen` change → All functions re-create (expected)
- `isTransitioning` change → All functions re-create (necessary for guards)
- Other dependencies are stable → No unnecessary re-creation

### Navigation State Usage

#### In Index Component

```typescript
// pages/Index.tsx:15
const {
  currentScreen,      // Used to render correct screen
  isTransitioning,    // Passed to Taskbar and WindowContainer
  goToScreen,         // Passed to Taskbar and AboutScreen
  getWindowTitle      // Used for WindowContainer title
} = useScreenNavigation();

// Find screen metadata
const currentScreenData = screens.find(s => s.id === currentScreen);

// Render appropriate screen
const renderScreen = () => {
  switch (currentScreen) {
    case "about":
      return <AboutScreen onNavigate={goToScreen} />;
    case "experience":
      return <ExperienceScreen />;
    // ... other screens
  }
};
```

#### In Taskbar Component

```typescript
// components/Taskbar.tsx:13
interface TaskbarProps {
  currentScreen: ScreenId;        // Highlight active button
  onNavigate: (screenId: ScreenId) => void;  // Navigation callback
  isTransitioning: boolean;       // Disable buttons during transitions
}

// Navigation button rendering
{screens.map((screen) => (
  <button
    key={screen.id}
    onClick={() => !isTransitioning && onNavigate(screen.id as ScreenId)}
    disabled={isTransitioning}
    className={`taskbar-nav-btn ${currentScreen === screen.id ? "active" : ""}`}
  >
    {screen.label}
  </button>
))}
```

**Guard pattern**: `!isTransitioning && onNavigate(...)` ensures button clicks during transitions are no-ops.

#### In WindowContainer Component

```typescript
// components/WindowContainer.tsx:27
interface WindowContainerProps {
  title: string;              // Window title from getWindowTitle()
  icon?: string;             // Icon name from currentScreenData
  children: ReactNode;       // Current screen component
  isTransitioning: boolean;  // Passed to AnimatePresence
}
```

### Navigation State Lifecycle

Complete lifecycle of a navigation event:

```
Time    Event                              State Changes
────────────────────────────────────────────────────────────────────
0ms     User clicks "Experience" button    (none)
        └─> Taskbar.tsx:52 onClick fires

1ms     onClick handler executes            (none)
        └─> Calls onNavigate("experience")
        └─> Propagates to goToScreen("experience")

2ms     goToScreen executes                 isTransitioning: true
        ├─> Guard checks pass              transitionDirection: "forward"
        ├─> Sets isTransitioning = true    currentScreen: "experience"
        ├─> Sets transitionDirection       [React batches these updates]
        ├─> Sets currentScreen
        └─> Schedules timeout (400ms)

3ms     React re-renders                    (state committed)
        ├─> Index.tsx re-renders
        │   └─> renderScreen() returns <ExperienceScreen />
        ├─> WindowContainer re-renders
        │   └─> title prop changes
        │   └─> useEffect detects title change
        │   └─> Flicker animation triggers
        ├─> Taskbar re-renders
        │   └─> "Experience" button gets "active" class
        │   └─> All buttons disabled (isTransitioning=true)
        └─> AnimatePresence detects key change
            └─> Exit animation starts for AboutScreen

203ms   Exit animation completes            (none)
        └─> AnimatePresence removes AboutScreen from DOM

204ms   Entry animation starts              (none)
        └─> ExperienceScreen fades in

402ms   Timeout callback executes           isTransitioning: false
        └─> setIsTransitioning(false)

403ms   React re-renders                    (state committed)
        ├─> Index.tsx re-renders
        ├─> Taskbar re-renders
        │   └─> All buttons enabled
        └─> WindowContainer re-renders
```

**Total transition time**: ~403ms (400ms lock + 3ms render overhead)

---

## UI State Management

### Boot Sequence State

The boot sequence is the simplest state in the application - a one-way flag that controls initial content visibility.

**Location**: `src/components/BootSequence.tsx`

#### Component Structure

```typescript
interface BootSequenceProps {
  children: ReactNode;          // Main content to show after boot
  onComplete: () => void;       // Callback when boot completes
}

export function BootSequence({ children, onComplete }: BootSequenceProps) {
  // Local state: Controls content visibility
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Boot timer: 600ms delay
    const timer = setTimeout(() => {
      setShowContent(true);    // Show main content
      onComplete();            // Notify parent (Index.tsx)
    }, 600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Render boot text or main content
  if (!showContent) {
    return (
      <div className="boot-screen">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          INITIALIZING PORTFOLIO.SYS...
        </motion.span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

#### State Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Component Mounts                                            │
│  ├─> showContent = false                                    │
│  └─> useEffect runs                                         │
│      └─> setTimeout(600ms) scheduled                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Initial Render                                              │
│  └─> Conditional: if (!showContent)                         │
│      └─> Render boot text with fade-in animation           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ (600ms delay)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Timer Callback Executes                                     │
│  ├─> setShowContent(true)                                   │
│  └─> onComplete() called                                    │
│      └─> Index.tsx: setBootComplete(true)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Re-render                                                   │
│  └─> Conditional: if (!showContent) = false                 │
│      └─> Render children with fade-in animation            │
└─────────────────────────────────────────────────────────────┘
```

#### Usage in Index Component

```typescript
// pages/Index.tsx:14
const [bootComplete, setBootComplete] = useState(false);

if (!bootComplete) {
  return (
    <BootSequence onComplete={() => setBootComplete(true)}>
      <div className="min-h-screen bg-background" />
    </BootSequence>
  );
}

// After boot: render main interface
return <div>...</div>;
```

**Design notes**:
- **One-way flag**: `bootComplete` never resets to `false`
- **Local + parent state**: Both components track boot status
  - Local (`showContent`): Controls BootSequence internal rendering
  - Parent (`bootComplete`): Controls Index rendering
- **Callback coordination**: `onComplete` synchronizes both states

### Window Container State

WindowContainer manages UI state for the title bar flicker animation.

**Location**: `src/components/WindowContainer.tsx:33-45`

#### State Variables

```typescript
const [displayTitle, setDisplayTitle] = useState(title);   // Currently shown title
const [isFlickering, setIsFlickering] = useState(false);  // Flicker animation active
```

#### Flicker Animation Logic

```typescript
useEffect(() => {
  // Only trigger when title prop changes
  if (title !== displayTitle) {
    // Phase 1: Start flicker
    setIsFlickering(true);

    // Phase 2: Update title after 200ms delay
    const timer = setTimeout(() => {
      setDisplayTitle(title);

      // Phase 3: Stop flicker after additional 150ms
      setTimeout(() => setIsFlickering(false), 150);
    }, 200);

    return () => clearTimeout(timer);
  }
}, [title, displayTitle]);
```

#### Flicker Timeline

```
Time    State                          Visual Effect
──────────────────────────────────────────────────────────────
0ms     title changes (prop update)    (none yet)
        └─> useEffect detects change

1ms     isFlickering = true            Flicker animation starts
        displayTitle = old title       (opacity flickers)

200ms   displayTitle = new title       Title text changes
        isFlickering = true            (still flickering)

350ms   isFlickering = false           Flicker animation stops
                                       (smooth to full opacity)
```

**Total effect duration**: 350ms (200ms delay + 150ms flicker)

#### Rendering with State

```typescript
<div className="window-title-bar">
  {/* Icon with flicker */}
  <motion.span
    animate={{ opacity: isFlickering ? 0 : 1 }}
    transition={{ duration: 0.1 }}
  >
    {iconMap[icon]}
  </motion.span>

  {/* Title with flicker CSS class */}
  <motion.span
    className={`window-title-text ${isFlickering ? 'animate-flicker' : ''}`}
  >
    {displayTitle}
  </motion.span>
</div>
```

**Animation strategy**:
- **Icon**: Framer Motion controls opacity (programmatic)
- **Title**: CSS keyframe animation (`.animate-flicker` class)

**CSS animation**:
```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.animate-flicker {
  animation: flicker 0.3s ease-in-out;
}
```

### Taskbar Clock State

The taskbar displays a real-time clock that updates every minute.

**Location**: `src/components/Taskbar.tsx:14-29`

#### Clock State Management

```typescript
const [currentTime, setCurrentTime] = useState("");

useEffect(() => {
  // Update function: Formats current time
  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;  // Convert to 12-hour format
    setCurrentTime(`${displayHours}:${minutes} ${ampm}`);
  };

  // Initial update
  updateTime();

  // Schedule updates every 60 seconds
  const interval = setInterval(updateTime, 60000);

  // Cleanup on unmount
  return () => clearInterval(interval);
}, []);  // Empty deps: Run once on mount
```

#### Clock Update Lifecycle

```
Time         Event                        State
──────────────────────────────────────────────────────────────
0ms          Component mounts             currentTime = ""
             └─> useEffect runs

1ms          updateTime() called          currentTime = "3:45 PM"
             └─> Initial time set

60,000ms     Interval callback #1         currentTime = "3:46 PM"
             └─> Time updates

120,000ms    Interval callback #2         currentTime = "3:47 PM"
             └─> Time updates

∞            (continues every 60s)        (updates every minute)

Unmount      Cleanup function             interval cleared
             └─> clearInterval(interval)
```

#### Rendering

```typescript
<span className="taskbar-clock">{currentTime}</span>
```

**Design considerations**:
- **60-second interval**: Reduces unnecessary updates (seconds not shown)
- **Immediate initial update**: Shows time instantly, no loading state
- **12-hour format**: User-friendly time display
- **Cleanup**: Prevents memory leaks on unmount

### UI State Coordination

All UI states are **independent and isolated**:

```
┌─────────────────────────────────────────────────────────┐
│  BootSequence State                                      │
│  ├─> showContent (local)                                │
│  └─> No interaction with other components               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  WindowContainer State                                   │
│  ├─> displayTitle (local)                               │
│  ├─> isFlickering (local)                               │
│  └─> Reacts to title prop changes only                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Taskbar Clock State                                     │
│  ├─> currentTime (local)                                │
│  └─> Updates independently via setInterval              │
└─────────────────────────────────────────────────────────┘
```

**Benefits of isolation**:
- **No coupling**: Components can be tested independently
- **Easy to reason about**: Each state has a single purpose
- **Performance**: State changes don't cascade
- **Maintainability**: Changes to one don't affect others

---

## Data Flow Patterns

### Unidirectional Data Flow

MyRes Site follows strict unidirectional data flow (Flux-inspired, without Flux):

```
┌──────────────────────────────────────────────────────────────┐
│  Static Data Layer (data/content.ts)                         │
│  • Configuration objects (immutable)                         │
│  • No runtime modifications                                  │
└────────────────┬─────────────────────────────────────────────┘
                 │ (imported directly)
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  State Layer (useState in components/hooks)                  │
│  • Navigation state (useScreenNavigation)                    │
│  • UI state (WindowContainer, Taskbar, BootSequence)        │
└────────────────┬─────────────────────────────────────────────┘
                 │ (props down)
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  Component Layer (React components)                          │
│  • Receive state and callbacks as props                     │
│  • Render UI based on props                                 │
│  • Trigger callbacks on user interaction                    │
└────────────────┬─────────────────────────────────────────────┘
                 │ (callbacks up)
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  Event Handlers (useCallback functions)                      │
│  • Process user interactions                                 │
│  • Call setState functions                                   │
└────────────────┬─────────────────────────────────────────────┘
                 │ (triggers re-render)
                 │
                 └─────────────────┐
                                   │
                                   ▼
                 ┌─────────────────────────────────┐
                 │  React Re-render Cycle          │
                 │  (back to Component Layer)      │
                 └─────────────────────────────────┘
```

### Data Import Pattern

Screen components import data **directly** from the data layer:

```typescript
// components/screens/AboutScreen.tsx:3
import { personalInfo } from "@/data/content";

export function AboutScreen({ onNavigate }: AboutScreenProps) {
  return (
    <div>
      <h1>{personalInfo.name}</h1>
      <p>{personalInfo.bio}</p>
    </div>
  );
}
```

**Advantages**:
1. **No prop drilling**: Data doesn't pass through intermediate components
2. **Type safety**: TypeScript knows exact data shape
3. **Predictable**: Data is immutable, no runtime changes
4. **Testable**: Easy to mock `data/content` in tests

**Trade-offs**:
- **Tight coupling**: Components depend on data structure
- **Can't override**: No way to inject different data per instance
- **Acceptable for this use case**: Data is truly static

### Callback Prop Pattern

User interactions flow upward via callback props:

```typescript
// Index.tsx passes callback down
<AboutScreen onNavigate={goToScreen} />

// AboutScreen calls callback up
<button onClick={() => onNavigate("projects")}>
  View Projects
</button>
```

**Flow diagram**:

```
User clicks button
    ↓
AboutScreen's onClick handler
    ↓
Calls onNavigate("projects")
    ↓
Propagates to Index's goToScreen
    ↓
useScreenNavigation's goToScreen
    ↓
State update (setCurrentScreen)
    ↓
React re-render
    ↓
New screen displayed
```

### State Update Patterns

#### Pattern 1: Direct State Update

Simple state updates with no dependencies:

```typescript
// BootSequence.tsx:15
setShowContent(true);  // Simple boolean toggle

// Taskbar.tsx:23
setCurrentTime(`${displayHours}:${minutes} ${ampm}`);  // Simple string update
```

#### Pattern 2: Coordinated State Updates

Multiple state updates that must happen together:

```typescript
// useScreenNavigation.ts:34-36
setIsTransitioning(true);
setTransitionDirection(direction);
setCurrentScreen(screenId);

// React 18 automatically batches these into one re-render
```

**Why batching matters**:
- **Performance**: Single re-render instead of three
- **Consistency**: All state changes committed atomically
- **No intermediate renders**: Components never see partial state

#### Pattern 3: Delayed State Update

State updates scheduled for the future:

```typescript
// useScreenNavigation.ts:38-40
setTimeout(() => {
  setIsTransitioning(false);
}, transitionDuration);
```

**Use cases**:
- Animation coordination
- Transition locks
- Debouncing/throttling

#### Pattern 4: Effect-Driven State Update

State updates triggered by other state changes:

```typescript
// WindowContainer.tsx:36-44
useEffect(() => {
  if (title !== displayTitle) {
    setIsFlickering(true);
    const timer = setTimeout(() => {
      setDisplayTitle(title);
      setTimeout(() => setIsFlickering(false), 150);
    }, 200);
    return () => clearTimeout(timer);
  }
}, [title, displayTitle]);
```

**When to use**:
- Reacting to prop changes
- Side effects from state changes
- Cleanup logic needed

### State Derivation Pattern

Some values are **computed** from state instead of stored:

```typescript
// useScreenNavigation.ts:25-26
const screenIds = screens.map(s => s.id) as ScreenId[];
const currentIndex = screenIds.indexOf(currentScreen);
```

**Decision matrix**: Store as state vs. derive?

| Scenario | Store | Derive | Reason |
|----------|-------|--------|--------|
| Cheap to compute (<1ms) | ❌ | ✅ | Avoid unnecessary state |
| Depends on other state | ❌ | ✅ | Single source of truth |
| Needs persistence | ✅ | ❌ | State survives re-renders |
| Updates frequently | ✅ | ❌ | Avoid recomputation |
| Complex calculation | ❌ | ✅ + useMemo | Cache expensive computation |

**Example: currentIndex derivation**

```typescript
// ❌ BAD: Store as state (can get out of sync)
const [currentScreen, setCurrentScreen] = useState("about");
const [currentIndex, setCurrentIndex] = useState(0);

// Must update both when changing screens
setCurrentScreen("experience");
setCurrentIndex(1);  // Easy to forget!

// ✅ GOOD: Derive from state (always in sync)
const [currentScreen, setCurrentScreen] = useState("about");
const currentIndex = screenIds.indexOf(currentScreen);

// Only one update needed
setCurrentScreen("experience");  // currentIndex automatically updates
```

---

## State Update Lifecycle

### Complete Navigation Lifecycle

Let's trace a full navigation event from user click to final render:

#### Phase 1: User Interaction (0-1ms)

```typescript
// User clicks "Experience" button in Taskbar
// Taskbar.tsx:50-54

<button
  onClick={() => !isTransitioning && onNavigate(screen.id as ScreenId)}
  disabled={isTransitioning}
>
  Experience
</button>

// Event fires:
1. Browser calls onClick handler
2. Guard check: !isTransitioning (true, navigation allowed)
3. Calls onNavigate("experience")
```

#### Phase 2: Callback Propagation (1-2ms)

```typescript
// onNavigate is goToScreen from Index.tsx:19
const { goToScreen } = useScreenNavigation();

// Passes to Taskbar
<Taskbar onNavigate={goToScreen} />

// Callback chain:
onClick → onNavigate → goToScreen (from hook)
```

#### Phase 3: State Updates (2-3ms)

```typescript
// useScreenNavigation.ts:28-40
const goToScreen = useCallback((screenId: ScreenId) => {
  // Guards
  if (isTransitioning) return;  // ✅ Pass
  if (screenId === currentScreen) return;  // ✅ Pass

  // Calculate direction
  const newIndex = screenIds.indexOf("experience");  // 1
  const direction = 1 > 0 ? "forward" : "backward";  // "forward"

  // State updates (batched by React 18)
  setIsTransitioning(true);
  setTransitionDirection("forward");
  setCurrentScreen("experience");

  // Schedule unlock
  setTimeout(() => {
    setIsTransitioning(false);
  }, 400);
}, [...]);

// State changes queued:
// • isTransitioning: false → true
// • transitionDirection: "forward" (no change)
// • currentScreen: "about" → "experience"
```

#### Phase 4: React Render (3-5ms)

React commits state changes and re-renders affected components:

```
Index.tsx
├─> currentScreen changed: "about" → "experience"
├─> isTransitioning changed: false → true
├─> Re-render triggered
│
├─> Derived values recalculated
│   ├─> renderScreen() returns <ExperienceScreen />
│   ├─> getWindowTitle() returns "EXPERIENCE_LOG.TXT"
│   └─> currentScreenData = { id: "experience", ... }
│
├─> Child components receive new props
│   ├─> WindowContainer
│   │   ├─> title: "ALEX_CHEN_PORTFOLIO.EXE" → "EXPERIENCE_LOG.TXT"
│   │   ├─> icon: "terminal" → "building"
│   │   └─> isTransitioning: false → true
│   │
│   ├─> Taskbar
│   │   ├─> currentScreen: "about" → "experience"
│   │   └─> isTransitioning: false → true
│   │
│   └─> Screen Component
│       └─> AboutScreen unmounts (AnimatePresence exit)
│       └─> ExperienceScreen mounts (AnimatePresence enter)
```

#### Phase 5: Side Effects (5-10ms)

useEffect hooks run after render:

```typescript
// WindowContainer.tsx:36-44
useEffect(() => {
  if (title !== displayTitle) {  // "EXPERIENCE_LOG.TXT" !== "ALEX_CHEN_PORTFOLIO.EXE"
    setIsFlickering(true);

    const timer = setTimeout(() => {
      setDisplayTitle("EXPERIENCE_LOG.TXT");
      setTimeout(() => setIsFlickering(false), 150);
    }, 200);

    return () => clearTimeout(timer);
  }
}, [title, displayTitle]);

// Timeline:
// 5ms:   setIsFlickering(true) → Re-render
// 205ms: setDisplayTitle("EXPERIENCE_LOG.TXT") → Re-render
// 355ms: setIsFlickering(false) → Re-render
```

#### Phase 6: Animation Execution (5-205ms)

Framer Motion animations execute:

```typescript
// WindowContainer.tsx:80-91
<AnimatePresence mode="wait">
  <motion.div
    key={title}  // Key changed: triggers animation
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
</AnimatePresence>

// Animation timeline:
// 5-205ms:   AboutScreen opacity: 1 → 0 (exit)
// 205-405ms: ExperienceScreen opacity: 0 → 1 (enter)
```

#### Phase 7: Transition Unlock (402ms)

```typescript
// useScreenNavigation.ts:38-40
setTimeout(() => {
  setIsTransitioning(false);
}, 400);

// State change:
// • isTransitioning: true → false

// Effect:
// • Taskbar buttons re-enable
// • Navigation allowed again
```

### Complete Timeline Visualization

```
Time     Component          State Changes                    Visual Effect
──────────────────────────────────────────────────────────────────────────────
0ms      Taskbar            (none)                          Button click
         └─> onClick fires

1ms      Hook               (none)                          (processing)
         └─> goToScreen runs

2ms      Hook               isTransitioning: true           (batched)
                           transitionDirection: "forward"
                           currentScreen: "experience"

3ms      React              (commit)                        (render phase)

5ms      All Components     (re-render complete)            New screen appears

5ms      WindowContainer    isFlickering: true              Title starts flicker
         └─> useEffect

5ms      AnimatePresence    (animation starts)              AboutScreen fades out

205ms    AnimatePresence    (exit complete)                 AboutScreen removed

205ms    WindowContainer    displayTitle: "EXPERIENCE..."   Title text changes

205ms    AnimatePresence    (enter starts)                  ExperienceScreen fades in

355ms    WindowContainer    isFlickering: false             Title stops flicker

402ms    Hook               isTransitioning: false          Buttons re-enable

405ms    AnimatePresence    (enter complete)                Transition complete
```

**Total duration**: 405ms from click to completion

---

## State Debugging

### Debugging Strategies

#### 1. React DevTools

**Installation**: Chrome/Firefox extension "React Developer Tools"

**Key features for state debugging**:

```
Components Tab:
├─> Select Index component
│   ├─> Props: (none)
│   ├─> Hooks:
│   │   ├─> State(0): bootComplete = true
│   │   └─> Memo(1): { currentScreen: "about", isTransitioning: false, ... }
│
├─> Select Taskbar component
│   ├─> Props:
│   │   ├─> currentScreen: "about"
│   │   ├─> onNavigate: ƒ goToScreen()
│   │   └─> isTransitioning: false
│   └─> Hooks:
│       └─> State(0): currentTime = "3:45 PM"
│
└─> Select WindowContainer component
    ├─> Props:
    │   ├─> title: "ALEX_CHEN_PORTFOLIO.EXE"
    │   ├─> icon: "terminal"
    │   └─> isTransitioning: false
    └─> Hooks:
        ├─> State(0): displayTitle = "ALEX_CHEN_PORTFOLIO.EXE"
        └─> State(1): isFlickering = false
```

**Profiler Tab**:
- Records component render times
- Identifies expensive re-renders
- Highlights wasted renders (props didn't change)

#### 2. Console Logging

Add debug logs to state updates:

```typescript
const goToScreen = useCallback((screenId: ScreenId) => {
  console.log('[Navigation] Attempting:', {
    from: currentScreen,
    to: screenId,
    isTransitioning,
    direction: newIndex > currentIndex ? 'forward' : 'backward'
  });

  if (isTransitioning) {
    console.log('[Navigation] Blocked: Transition in progress');
    return;
  }

  if (screenId === currentScreen) {
    console.log('[Navigation] Blocked: Same screen');
    return;
  }

  setIsTransitioning(true);
  setTransitionDirection(direction);
  setCurrentScreen(screenId);

  console.log('[Navigation] State updated:', {
    currentScreen: screenId,
    isTransitioning: true
  });

  setTimeout(() => {
    console.log('[Navigation] Transition unlocked');
    setIsTransitioning(false);
  }, transitionDuration);
}, [...]);
```

**Console output**:
```
[Navigation] Attempting: { from: "about", to: "experience", isTransitioning: false, direction: "forward" }
[Navigation] State updated: { currentScreen: "experience", isTransitioning: true }
[Navigation] Transition unlocked  (after 400ms)
```

#### 3. useDebugValue Hook

Add debug info to custom hooks:

```typescript
export function useScreenNavigation(
  initialScreen: ScreenId = "about",
  transitionDuration: number = 400
): UseScreenNavigationReturn {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(initialScreen);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Shows in React DevTools
  useDebugValue(`${currentScreen} (${isTransitioning ? 'transitioning' : 'idle'})`);

  // ... rest of hook
}
```

**DevTools display**:
```
Hooks:
├─> Memo(1): useScreenNavigation
│   └─> DebugValue: "experience (idle)"
```

#### 4. State Invariant Checks

Add assertions to catch invalid state:

```typescript
const goToScreen = useCallback((screenId: ScreenId) => {
  // Invariant: screenId must be valid
  if (!screenIds.includes(screenId)) {
    console.error('[Navigation] Invalid screenId:', screenId);
    return;
  }

  // Invariant: currentScreen must be valid
  if (!screenIds.includes(currentScreen)) {
    console.error('[Navigation] Invalid currentScreen:', currentScreen);
    return;
  }

  // ... rest of function
}, [...]);
```

### Common State Issues and Solutions

#### Issue 1: Navigation Buttons Don't Respond

**Symptoms**:
- Clicking navigation buttons does nothing
- No console errors

**Debug steps**:

```typescript
// 1. Check if isTransitioning is stuck
console.log('isTransitioning:', isTransitioning);

// 2. Check if onClick handler is firing
<button onClick={() => {
  console.log('Button clicked');
  !isTransitioning && onNavigate(screen.id as ScreenId);
}}>
```

**Common causes**:
- `isTransitioning` stuck at `true` (timeout never fired)
- `disabled` attribute set incorrectly
- Event handler not attached

**Solution**:
```typescript
// Add cleanup to useEffect
useEffect(() => {
  const timer = setTimeout(() => {
    setIsTransitioning(false);
  }, transitionDuration);

  // ✅ Cleanup if component unmounts during transition
  return () => clearTimeout(timer);
}, [transitionDuration]);
```

#### Issue 2: Screen Doesn't Update

**Symptoms**:
- `currentScreen` state changes
- Component doesn't re-render with new screen

**Debug steps**:

```typescript
// 1. Check if currentScreen is updating
useEffect(() => {
  console.log('currentScreen changed:', currentScreen);
}, [currentScreen]);

// 2. Check if renderScreen is returning correct component
const renderScreen = () => {
  console.log('Rendering screen:', currentScreen);
  switch (currentScreen) {
    case "about":
      return <AboutScreen onNavigate={goToScreen} />;
    // ...
  }
};
```

**Common causes**:
- Missing case in `switch` statement
- AnimatePresence `mode` not set correctly

**Solution**:
```typescript
// ✅ Use "wait" mode for proper exit/enter sequence
<AnimatePresence mode="wait">
  <motion.div key={title}>
    {children}
  </motion.div>
</AnimatePresence>
```

#### Issue 3: Flicker Animation Doesn't Trigger

**Symptoms**:
- Title changes instantly without animation
- No flicker effect

**Debug steps**:

```typescript
// Add logs to useEffect
useEffect(() => {
  console.log('Title prop:', title);
  console.log('Display title:', displayTitle);
  console.log('Should flicker:', title !== displayTitle);

  if (title !== displayTitle) {
    console.log('Starting flicker animation');
    setIsFlickering(true);
    // ...
  }
}, [title, displayTitle]);
```

**Common causes**:
- `displayTitle` state not initialized correctly
- CSS animation not applied
- Timing too fast to see

**Solution**:
```typescript
// ✅ Initialize displayTitle from title prop
const [displayTitle, setDisplayTitle] = useState(title);

// ✅ Ensure CSS class is applied conditionally
<span className={`window-title-text ${isFlickering ? 'animate-flicker' : ''}`}>
  {displayTitle}
</span>
```

#### Issue 4: Clock Not Updating

**Symptoms**:
- Clock shows initial time but doesn't update
- Time is incorrect

**Debug steps**:

```typescript
// Check if interval is running
useEffect(() => {
  const updateTime = () => {
    console.log('Clock updating:', new Date().toLocaleTimeString());
    // ... time calculation
  };

  updateTime();
  const interval = setInterval(updateTime, 60000);

  console.log('Interval started:', interval);

  return () => {
    console.log('Interval cleared:', interval);
    clearInterval(interval);
  };
}, []);
```

**Common causes**:
- Interval not started
- Component unmounted (interval cleared)
- Time format incorrect

**Solution**:
```typescript
// ✅ Call updateTime immediately, then set interval
updateTime();  // Initial call
const interval = setInterval(updateTime, 60000);  // Subsequent calls
```

### State Debugging Checklist

When debugging state issues:

- [ ] Check React DevTools for current state values
- [ ] Verify state updates in console logs
- [ ] Confirm useEffect dependencies are correct
- [ ] Check for stale closures (outdated state in callbacks)
- [ ] Verify conditional rendering logic
- [ ] Inspect animation timings and transitions
- [ ] Check for memory leaks (unmounted components updating state)
- [ ] Validate state invariants (impossible states)

---

## Testing State Logic

### Testing Philosophy

**What to test**:
1. **State transitions**: Correct state changes on actions
2. **Edge cases**: Boundary conditions and guards
3. **Side effects**: Timers, intervals, async operations
4. **Integration**: Components working together

**What not to test**:
- Implementation details (exact useState calls)
- React internals (re-render count)
- Visual appearance (use visual regression tests)

### Testing useScreenNavigation Hook

#### Setup: Test Environment

```typescript
// hooks/__tests__/useScreenNavigation.test.ts
import { renderHook, act } from '@testing-library/react';
import { useScreenNavigation } from '../useScreenNavigation';

// Mock screens data
jest.mock('@/data/content', () => ({
  screens: [
    { id: 'about', windowTitle: 'About' },
    { id: 'experience', windowTitle: 'Experience' },
    { id: 'skills', windowTitle: 'Skills' }
  ]
}));
```

#### Test 1: Initial State

```typescript
describe('useScreenNavigation', () => {
  test('initializes with default screen', () => {
    const { result } = renderHook(() => useScreenNavigation());

    expect(result.current.currentScreen).toBe('about');
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.transitionDirection).toBe('forward');
  });

  test('initializes with custom screen', () => {
    const { result } = renderHook(() => useScreenNavigation('skills'));

    expect(result.current.currentScreen).toBe('skills');
    expect(result.current.currentIndex).toBe(2);
  });
});
```

#### Test 2: goToScreen Function

```typescript
describe('goToScreen', () => {
  jest.useFakeTimers();

  test('navigates to new screen', () => {
    const { result } = renderHook(() => useScreenNavigation());

    act(() => {
      result.current.goToScreen('experience');
    });

    expect(result.current.currentScreen).toBe('experience');
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.isTransitioning).toBe(true);
    expect(result.current.transitionDirection).toBe('forward');
  });

  test('unlocks transition after duration', () => {
    const { result } = renderHook(() => useScreenNavigation('about', 400));

    act(() => {
      result.current.goToScreen('experience');
    });

    expect(result.current.isTransitioning).toBe(true);

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(result.current.isTransitioning).toBe(false);
  });

  test('blocks navigation during transition', () => {
    const { result } = renderHook(() => useScreenNavigation());

    act(() => {
      result.current.goToScreen('experience');
    });

    // Attempt second navigation while transitioning
    act(() => {
      result.current.goToScreen('skills');
    });

    // Should still be on 'experience'
    expect(result.current.currentScreen).toBe('experience');
    expect(result.current.currentIndex).toBe(1);
  });

  test('blocks navigation to current screen', () => {
    const { result } = renderHook(() => useScreenNavigation('about'));

    act(() => {
      result.current.goToScreen('about');
    });

    // Should not set isTransitioning
    expect(result.current.isTransitioning).toBe(false);
  });

  test('sets backward direction correctly', () => {
    const { result } = renderHook(() => useScreenNavigation('skills'));

    act(() => {
      result.current.goToScreen('about');
    });

    expect(result.current.transitionDirection).toBe('backward');
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
```

#### Test 3: goNext and goPrevious

```typescript
describe('goNext and goPrevious', () => {
  test('goNext navigates to next screen', () => {
    const { result } = renderHook(() => useScreenNavigation('about'));

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentScreen).toBe('experience');
  });

  test('goNext does nothing at last screen', () => {
    const { result } = renderHook(() => useScreenNavigation('skills'));

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentScreen).toBe('skills');
    expect(result.current.isTransitioning).toBe(false);
  });

  test('goPrevious navigates to previous screen', () => {
    const { result } = renderHook(() => useScreenNavigation('experience'));

    act(() => {
      result.current.goPrevious();
    });

    expect(result.current.currentScreen).toBe('about');
  });

  test('goPrevious does nothing at first screen', () => {
    const { result } = renderHook(() => useScreenNavigation('about'));

    act(() => {
      result.current.goPrevious();
    });

    expect(result.current.currentScreen).toBe('about');
    expect(result.current.isTransitioning).toBe(false);
  });
});
```

#### Test 4: getWindowTitle

```typescript
describe('getWindowTitle', () => {
  test('returns correct title for current screen', () => {
    const { result } = renderHook(() => useScreenNavigation('about'));

    expect(result.current.getWindowTitle()).toBe('About');
  });

  test('updates title after navigation', () => {
    const { result } = renderHook(() => useScreenNavigation('about'));

    act(() => {
      result.current.goToScreen('experience');
    });

    expect(result.current.getWindowTitle()).toBe('Experience');
  });

  test('returns default title for invalid screen', () => {
    // Mock screens array to be empty
    jest.mock('@/data/content', () => ({ screens: [] }));

    const { result } = renderHook(() => useScreenNavigation());

    expect(result.current.getWindowTitle()).toBe('PORTFOLIO.EXE');
  });
});
```

### Testing Component State

#### Testing BootSequence

```typescript
// components/__tests__/BootSequence.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BootSequence } from '../BootSequence';

describe('BootSequence', () => {
  jest.useFakeTimers();

  test('shows boot text initially', () => {
    const onComplete = jest.fn();
    render(
      <BootSequence onComplete={onComplete}>
        <div>Main Content</div>
      </BootSequence>
    );

    expect(screen.getByText('INITIALIZING PORTFOLIO.SYS...')).toBeInTheDocument();
    expect(screen.queryByText('Main Content')).not.toBeInTheDocument();
  });

  test('calls onComplete after 600ms', () => {
    const onComplete = jest.fn();
    render(
      <BootSequence onComplete={onComplete}>
        <div>Main Content</div>
      </BootSequence>
    );

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('shows children after boot', async () => {
    const onComplete = jest.fn();
    render(
      <BootSequence onComplete={onComplete}>
        <div>Main Content</div>
      </BootSequence>
    );

    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });
  });

  test('cleans up timer on unmount', () => {
    const onComplete = jest.fn();
    const { unmount } = render(
      <BootSequence onComplete={onComplete}>
        <div>Main Content</div>
      </BootSequence>
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Should not call onComplete after unmount
    expect(onComplete).not.toHaveBeenCalled();
  });
});
```

#### Testing WindowContainer Flicker

```typescript
// components/__tests__/WindowContainer.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { WindowContainer } from '../WindowContainer';

describe('WindowContainer flicker animation', () => {
  jest.useFakeTimers();

  test('displays initial title immediately', () => {
    render(
      <WindowContainer title="Initial Title" icon="terminal" isTransitioning={false}>
        <div>Content</div>
      </WindowContainer>
    );

    expect(screen.getByText('Initial Title')).toBeInTheDocument();
  });

  test('triggers flicker when title changes', () => {
    const { rerender } = render(
      <WindowContainer title="Title 1" icon="terminal" isTransitioning={false}>
        <div>Content</div>
      </WindowContainer>
    );

    // Change title prop
    rerender(
      <WindowContainer title="Title 2" icon="terminal" isTransitioning={false}>
        <div>Content</div>
      </WindowContainer>
    );

    // Should still show old title briefly
    expect(screen.getByText('Title 1')).toBeInTheDocument();

    // After 200ms, should show new title
    act(() => {
      jest.advanceTimersByTime(200);
    });

    waitFor(() => {
      expect(screen.getByText('Title 2')).toBeInTheDocument();
    });
  });

  test('applies flicker animation class', () => {
    const { container, rerender } = render(
      <WindowContainer title="Title 1" icon="terminal" isTransitioning={false}>
        <div>Content</div>
      </WindowContainer>
    );

    rerender(
      <WindowContainer title="Title 2" icon="terminal" isTransitioning={false}>
        <div>Content</div>
      </WindowContainer>
    );

    const titleElement = container.querySelector('.window-title-text');
    expect(titleElement).toHaveClass('animate-flicker');

    // After animation completes
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(titleElement).not.toHaveClass('animate-flicker');
  });
});
```

#### Testing Taskbar Clock

```typescript
// components/__tests__/Taskbar.test.tsx
import { render, screen, act } from '@testing-library/react';
import { Taskbar } from '../Taskbar';

describe('Taskbar clock', () => {
  jest.useFakeTimers();

  beforeEach(() => {
    // Mock Date to fixed time
    jest.setSystemTime(new Date('2026-01-08T15:45:00'));
  });

  test('displays current time on mount', () => {
    render(
      <Taskbar currentScreen="about" onNavigate={jest.fn()} isTransitioning={false} />
    );

    expect(screen.getByText('3:45 PM')).toBeInTheDocument();
  });

  test('updates time every minute', () => {
    render(
      <Taskbar currentScreen="about" onNavigate={jest.fn()} isTransitioning={false} />
    );

    expect(screen.getByText('3:45 PM')).toBeInTheDocument();

    // Advance time by 1 minute
    jest.setSystemTime(new Date('2026-01-08T15:46:00'));
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(screen.getByText('3:46 PM')).toBeInTheDocument();
  });

  test('clears interval on unmount', () => {
    const { unmount } = render(
      <Taskbar currentScreen="about" onNavigate={jest.fn()} isTransitioning={false} />
    );

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
```

### Integration Testing

Test multiple components working together:

```typescript
// pages/__tests__/Index.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Index from '../Index';

describe('Index page integration', () => {
  jest.useFakeTimers();

  test('completes boot sequence and shows main interface', async () => {
    render(<Index />);

    // Boot screen visible
    expect(screen.getByText('INITIALIZING PORTFOLIO.SYS...')).toBeInTheDocument();

    // Advance boot timer
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Main interface visible
    await waitFor(() => {
      expect(screen.getByText(/Architecting/i)).toBeInTheDocument();
    });
  });

  test('navigates between screens via taskbar', async () => {
    render(<Index />);

    // Complete boot
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Click Experience button
    const experienceButton = screen.getByRole('button', { name: /Experience/i });
    fireEvent.click(experienceButton);

    // Window title changes
    await waitFor(() => {
      expect(screen.getByText('EXPERIENCE_LOG.TXT')).toBeInTheDocument();
    });

    // Experience content visible
    expect(screen.getByText(/TECHFLOW SYSTEMS/i)).toBeInTheDocument();
  });

  test('disables navigation during transition', async () => {
    render(<Index />);

    act(() => {
      jest.advanceTimersByTime(600);
    });

    const experienceButton = screen.getByRole('button', { name: /Experience/i });
    const skillsButton = screen.getByRole('button', { name: /Skills/i });

    // Start navigation to Experience
    fireEvent.click(experienceButton);

    // Try to navigate to Skills immediately
    fireEvent.click(skillsButton);

    // Should be on Experience (second click ignored)
    await waitFor(() => {
      expect(screen.getByText('EXPERIENCE_LOG.TXT')).toBeInTheDocument();
    });

    // Should NOT be on Skills
    expect(screen.queryByText('TECHNICAL_SKILLS_MATRIX.EXE')).not.toBeInTheDocument();
  });
});
```

### Test Coverage Goals

**Minimum coverage targets**:
- **Hooks**: 90%+ (critical business logic)
- **Components**: 80%+ (UI logic)
- **Utils**: 95%+ (pure functions)

**What 100% coverage doesn't guarantee**:
- Correct behavior (logic bugs)
- Good UX (visual issues)
- Performance (re-render issues)

**Balance**: Aim for high coverage of **state logic**, moderate coverage of **UI rendering**.

---

## Future State Considerations

### When to Add Global State

The application should remain state-library-free unless these conditions are met:

#### Threshold 1: State Complexity

Add global state when:

```typescript
// Current: 3 pieces of shared state
{
  currentScreen,
  isTransitioning,
  bootComplete
}

// Future threshold: 6+ pieces of shared state
{
  currentScreen,
  isTransitioning,
  bootComplete,
  theme,              // NEW: Dark/light mode
  notifications,      // NEW: Toast notification queue
  user,               // NEW: User authentication state
  preferences,        // NEW: User settings
  sidebarOpen        // NEW: Sidebar toggle
}
```

**Rule of thumb**: When shared state exceeds **5-6 distinct pieces**, consider Zustand or Context.

#### Threshold 2: Component Depth

Add global state when:

```typescript
// Current: 2-3 level prop drilling
Index
└─> Taskbar (receives onNavigate)

// Future threshold: 4+ level prop drilling
Index
└─> Layout
    └─> Sidebar
        └─> UserMenu
            └─> ThemeToggle (needs theme setter)
```

**Rule of thumb**: When prop drilling exceeds **4 levels**, consider Context or Zustand.

#### Threshold 3: Update Frequency

Add global state when:

```typescript
// Current: Infrequent updates
// - Navigation: A few times per session
// - Boot: Once per session
// - Clock: Once per minute

// Future threshold: High-frequency updates
// - Websocket messages: Multiple per second
// - Scroll position: 60+ times per second
// - Mouse tracking: 100+ times per second
```

**Rule of thumb**: When state updates exceed **10 times per second**, consider external state management or debouncing.

### Recommended State Libraries

#### Option 1: Zustand (Recommended)

**Best for**: Simple to medium complexity state

```typescript
// store/navigationStore.ts
import { create } from 'zustand';

interface NavigationState {
  currentScreen: ScreenId;
  isTransitioning: boolean;
  goToScreen: (screenId: ScreenId) => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentScreen: 'about',
  isTransitioning: false,

  goToScreen: (screenId: ScreenId) => {
    if (get().isTransitioning) return;

    set({ isTransitioning: true, currentScreen: screenId });

    setTimeout(() => {
      set({ isTransitioning: false });
    }, 400);
  }
}));

// Usage in component
function Taskbar() {
  const { currentScreen, goToScreen, isTransitioning } = useNavigationStore();
  // ... use state
}
```

**Pros**:
- Minimal boilerplate
- TypeScript-first
- No providers needed
- Devtools support

**Cons**:
- Less ecosystem than Redux
- No middleware (minimal impact)

#### Option 2: React Context + useReducer

**Best for**: Medium complexity with clear action patterns

```typescript
// context/NavigationContext.tsx
type Action =
  | { type: 'GO_TO_SCREEN'; screenId: ScreenId }
  | { type: 'START_TRANSITION' }
  | { type: 'END_TRANSITION' };

interface State {
  currentScreen: ScreenId;
  isTransitioning: boolean;
}

function navigationReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GO_TO_SCREEN':
      return { ...state, currentScreen: action.screenId };
    case 'START_TRANSITION':
      return { ...state, isTransitioning: true };
    case 'END_TRANSITION':
      return { ...state, isTransitioning: false };
    default:
      return state;
  }
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, {
    currentScreen: 'about',
    isTransitioning: false
  });

  const goToScreen = useCallback((screenId: ScreenId) => {
    if (state.isTransitioning) return;

    dispatch({ type: 'START_TRANSITION' });
    dispatch({ type: 'GO_TO_SCREEN', screenId });

    setTimeout(() => {
      dispatch({ type: 'END_TRANSITION' });
    }, 400);
  }, [state.isTransitioning]);

  return (
    <NavigationContext.Provider value={{ ...state, goToScreen }}>
      {children}
    </NavigationContext.Provider>
  );
}
```

**Pros**:
- No external dependencies
- Clear action patterns
- Easy to test reducer

**Cons**:
- More boilerplate than Zustand
- Provider wrapping needed
- Performance optimization needed (memoization)

#### Option 3: Redux Toolkit

**Best for**: Large applications with complex state interactions

```typescript
// store/navigationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  currentScreen: ScreenId;
  isTransitioning: boolean;
}

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    currentScreen: 'about' as ScreenId,
    isTransitioning: false
  },
  reducers: {
    goToScreen: (state, action: PayloadAction<ScreenId>) => {
      state.currentScreen = action.payload;
    },
    startTransition: (state) => {
      state.isTransitioning = true;
    },
    endTransition: (state) => {
      state.isTransitioning = false;
    }
  }
});

export const { goToScreen, startTransition, endTransition } = navigationSlice.actions;
export default navigationSlice.reducer;
```

**Pros**:
- Industry standard
- Excellent devtools
- Middleware ecosystem
- Time-travel debugging

**Cons**:
- Largest bundle size
- Steepest learning curve
- Overkill for simple apps

### Feature-Based State Additions

#### Adding Theme State

```typescript
// Current approach (no global state needed yet)
// Use CSS variables + localStorage

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
}

// Use in root component
function App() {
  const { theme, setTheme } = useTheme();
  // Pass to components that need it
}
```

**When to use global state**: If theme needs to be accessed in **5+ unrelated components**.

#### Adding Authentication State

```typescript
// If authentication is needed, use Context (small surface area)
interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth logic...

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Reasoning**: Auth state is needed app-wide but updates infrequently → Context is perfect.

#### Adding Form State

```typescript
// For complex forms, use React Hook Form (not global state)
import { useForm } from 'react-hook-form';

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Send data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      {errors.email && <span>Email is required</span>}
    </form>
  );
}
```

**Reasoning**: Form state is component-local → No global state needed.

### Migration Strategy

If migrating to global state:

**Step 1: Identify shared state**
```typescript
// List all state that crosses component boundaries
const sharedState = {
  currentScreen,     // Used in: Index, Taskbar, WindowContainer
  isTransitioning,   // Used in: Index, Taskbar, WindowContainer
  // Don't include:
  // bootComplete (only used in Index)
  // displayTitle (only used in WindowContainer)
  // currentTime (only used in Taskbar)
};
```

**Step 2: Choose appropriate tool**
- 1-2 pieces of state → Keep as is or use Context
- 3-5 pieces → Zustand
- 6+ pieces or complex logic → Redux Toolkit

**Step 3: Migrate incrementally**
```typescript
// Before: Custom hook
const { currentScreen, goToScreen } = useScreenNavigation();

// After: Zustand
const { currentScreen, goToScreen } = useNavigationStore();

// Same API → minimal code changes
```

**Step 4: Update tests**
```typescript
// Before: Mock custom hook
jest.mock('@/hooks/useScreenNavigation');

// After: Mock Zustand store
jest.mock('@/store/navigationStore');
```

---

## Performance Considerations

### Current Performance Profile

#### Render Frequency Analysis

```typescript
// Low-frequency updates (✅ Good)
bootComplete:       1 update per session
currentScreen:      ~5-10 updates per session
isTransitioning:    ~10-20 updates per session (2 per navigation)

// Medium-frequency updates (✅ Acceptable)
displayTitle:       ~5-10 updates per session
isFlickering:       ~10-20 updates per session (2 per title change)

// High-frequency updates (⚠️ Monitor)
currentTime:        60 updates per hour
```

**Current verdict**: No performance issues. All updates are infrequent enough that React's built-in optimization is sufficient.

#### Component Re-render Analysis

**Navigation event triggers**:
```
User clicks taskbar button
  ├─> Index re-renders (1x)
  ├─> Taskbar re-renders (1x)
  ├─> WindowContainer re-renders (1x)
  └─> Screen component changes (1x unmount + 1x mount)

Total: 5 renders per navigation
```

**With React 18 batching**:
```typescript
// These three updates trigger ONE render
setIsTransitioning(true);
setTransitionDirection("forward");
setCurrentScreen("experience");

// Not three separate renders ✅
```

### Optimization Techniques (Current)

#### 1. useCallback for Stable References

```typescript
// useScreenNavigation.ts:28
const goToScreen = useCallback(
  (screenId: ScreenId) => {
    // Navigation logic
  },
  [isTransitioning, currentScreen, currentIndex, screenIds, transitionDuration]
);
```

**Why this matters**:
- `goToScreen` reference stays stable across renders (when deps don't change)
- Components receiving `goToScreen` as prop won't re-render unnecessarily
- Especially important for `Taskbar` (receives `onNavigate = goToScreen`)

#### 2. Derived State (Not Stored)

```typescript
// Computed on every render, but cheap
const currentIndex = screenIds.indexOf(currentScreen);
const screenIds = screens.map(s => s.id) as ScreenId[];
```

**Performance cost**: ~0.01ms (array lookup + map)

**Why not useMemo**?
```typescript
// ❌ Unnecessary: useMemo overhead > computation cost
const currentIndex = useMemo(() =>
  screenIds.indexOf(currentScreen),
  [screenIds, currentScreen]
);

// ✅ Better: Just compute directly
const currentIndex = screenIds.indexOf(currentScreen);
```

**Rule**: Only `useMemo` if computation takes >1ms.

#### 3. Conditional Rendering

```typescript
// Index.tsx:41
if (!bootComplete) {
  return <BootSequence onComplete={() => setBootComplete(true)} />;
}

// Main interface not mounted during boot
return <div>...</div>;
```

**Benefits**:
- Main interface doesn't mount until needed
- Smaller initial render tree
- Faster boot sequence

#### 4. AnimatePresence Optimization

```typescript
// WindowContainer.tsx:80
<AnimatePresence mode="wait">
  <motion.div key={title}>
    {children}
  </motion.div>
</AnimatePresence>
```

**Why `mode="wait"`**:
- Old screen exits **before** new screen enters
- Only one screen in DOM at a time
- Reduces memory usage during transition

### Performance Bottlenecks to Watch

#### Potential Issue 1: Too Many Screens

**Current**: 5 screens (about, experience, skills, projects, education)

**Scale threshold**: 20+ screens

**Symptoms**:
- Slow `renderScreen()` switch statement
- Large taskbar with many buttons

**Solution**: Lazy load screens
```typescript
const AboutScreen = lazy(() => import('./screens/AboutScreen'));
const ExperienceScreen = lazy(() => import('./screens/ExperienceScreen'));

function renderScreen() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {currentScreen === 'about' && <AboutScreen onNavigate={goToScreen} />}
      {currentScreen === 'experience' && <ExperienceScreen />}
      {/* ... */}
    </Suspense>
  );
}
```

#### Potential Issue 2: Frequent Navigation

**Current**: ~5-10 navigations per session

**Scale threshold**: 100+ navigations per session (unlikely)

**Symptoms**:
- Janky animations
- Delayed button clicks

**Solution**: Optimize animation performance
```typescript
// Use GPU-accelerated properties only
<motion.div
  animate={{
    opacity: 1,
    // ✅ GPU-accelerated
    transform: 'translateX(0)',

    // ❌ Avoid (triggers layout)
    // width: '100%',
    // height: '100vh'
  }}
/>
```

#### Potential Issue 3: Large Screen Content

**Current**: Small, mostly text content

**Scale threshold**: Images, videos, or 1000+ DOM nodes per screen

**Symptoms**:
- Slow screen transitions
- High memory usage

**Solution**: Virtual scrolling for long lists
```typescript
import { FixedSizeList } from 'react-window';

function ExperienceScreen() {
  return (
    <FixedSizeList
      height={600}
      itemCount={experiences.length}
      itemSize={200}
    >
      {({ index, style }) => (
        <div style={style}>
          <ExperienceCard data={experiences[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Performance Monitoring

#### Metrics to Track

**1. Time to Interactive (TTI)**
```bash
# Lighthouse audit
npm run build
npx lighthouse http://localhost:4173 --view
```

**Target**: < 3 seconds

**2. Component Render Time**
```typescript
// Use React DevTools Profiler
// 1. Open React DevTools
// 2. Go to Profiler tab
// 3. Click record
// 4. Navigate between screens
// 5. Stop recording
// 6. Analyze flame graph
```

**Target**: < 16ms per render (60 FPS)

**3. Animation Frame Rate**
```typescript
// Monitor with Chrome DevTools
// 1. Open Chrome DevTools
// 2. Go to Performance tab
// 3. Click record
// 4. Navigate between screens
// 5. Stop recording
// 6. Check FPS chart
```

**Target**: Stable 60 FPS during transitions

#### Performance Budget

```typescript
// Current bundle sizes (production)
{
  "main.js": "~150KB (gzipped)",
  "vendor.js": "~100KB (gzipped)",
  "total": "~250KB (gzipped)"
}

// Performance budget
{
  "main.js": "< 200KB",
  "vendor.js": "< 150KB",
  "total": "< 350KB",
  "initialLoad": "< 3s on 3G"
}
```

**Monitor with**:
```bash
npm run build
npx vite-bundle-analyzer dist
```

### When to Optimize

**Premature optimization is the root of all evil** - Donald Knuth

**Optimization priority**:
1. ✅ **Correct behavior** (does it work?)
2. ✅ **Clean code** (is it maintainable?)
3. ⚠️ **Perceived performance** (does it feel fast?)
4. ⏰ **Measured performance** (profile first!)

**Profile before optimizing**:
- Use React DevTools Profiler
- Use Chrome DevTools Performance tab
- Measure real user metrics (Lighthouse, Core Web Vitals)

**Current verdict**: No optimization needed. Application is fast enough for its current scope.

---

## Best Practices Summary

### State Management Principles

1. **Start simple**: Use `useState` and `useCallback` by default
2. **Lift state up**: Only to the lowest common ancestor
3. **Keep state local**: UI state stays in components
4. **Derive when possible**: Don't store what you can compute
5. **Avoid premature optimization**: Profile before adding complexity

### Code Organization

```
src/
├─> hooks/
│   └─> useScreenNavigation.ts       # Business logic
├─> components/
│   ├─> BootSequence.tsx             # UI state
│   ├─> WindowContainer.tsx          # UI state
│   └─> Taskbar.tsx                  # UI state
├─> pages/
│   └─> Index.tsx                    # Application state
└─> data/
    └─> content.ts                   # Static configuration
```

### Testing Guidelines

- **Test state transitions**, not implementation
- **Test edge cases**: Guards, boundaries, invalid input
- **Test side effects**: Timers, intervals, async operations
- **Test integration**: Components working together
- **Don't test**: React internals, implementation details

### Performance Guidelines

- **Measure first**: Use React DevTools Profiler
- **Optimize late**: Only when measurements show issues
- **Batch updates**: Let React 18 auto-batch
- **Memoize expensive**: Only if computation > 1ms
- **Lazy load**: Only if initial bundle > 500KB

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design patterns
- [COMPONENTS.md](./COMPONENTS.md) - Component documentation
- [UI-PATTERNS.md](./UI-PATTERNS.md) - UI component patterns
- [OVERVIEW.md](./OVERVIEW.md) - Project overview

---

**Last Updated**: 2026-01-08
