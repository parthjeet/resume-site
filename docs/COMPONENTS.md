# Component Documentation

> **Project**: MyRes Site
> **Generated**: 2026-01-08
> **Source**: `/home/parth/ws/myres-site`
> **Related Docs**: [OVERVIEW.md](./OVERVIEW.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [UI-PATTERNS.md](./UI-PATTERNS.md)

---

## Table of Contents

- [Component Overview](#component-overview)
- [Layout Components](#layout-components)
- [Screen Components](#screen-components)
- [UI Components](#ui-components)
- [Component Patterns](#component-patterns)
- [Props Reference](#props-reference)

---

## Component Overview

The application is organized into three main component categories:

| Category | Location | Count | Purpose |
|----------|----------|-------|---------|
| **Layout Components** | `src/components/` | 4 | Core application structure and navigation |
| **Screen Components** | `src/components/screens/` | 5 | Portfolio content screens |
| **UI Components** | `src/components/ui/` | 35+ | Reusable shadcn/ui components |

### Component Size Statistics

```
Total Lines of Code in Screens: 482 lines
Average Screen Size: ~96 lines

Component Breakdown:
- ProjectsScreen.tsx:   120 lines (largest)
- EducationScreen.tsx:  110 lines
- AboutScreen.tsx:       94 lines
- ExperienceScreen.tsx:  91 lines
- SkillsScreen.tsx:      67 lines (smallest)
```

---

## Layout Components

These components form the structural foundation of the application.

### BootSequence

**Location**: `src/components/BootSequence.tsx:9`

**Purpose**: Displays a boot animation on initial page load, creating an OS-like startup experience.

**Interface**:
```typescript
interface BootSequenceProps {
  children: ReactNode;      // Content to display after boot
  onComplete: () => void;   // Callback when boot animation finishes
}
```

**Behavior**:
1. Shows "INITIALIZING PORTFOLIO.SYS..." text for 600ms
2. Fades in with framer-motion animation
3. Calls `onComplete` callback after timeout
4. Transitions to display children with fade-in animation

**Animation Timeline**:
```
0ms     Component mounts
        └─> Initial text fades in (opacity 0 → 1)

600ms   Boot complete
        └─> onComplete() callback fires
        └─> Children content fades in with scale animation
```

**Usage Example**:
```tsx
<BootSequence onComplete={() => setBootComplete(true)}>
  <MainInterface />
</BootSequence>
```

**Key Features**:
- **One-time display**: Only shown on initial page load
- **Customizable duration**: Modify timeout value (currently 600ms)
- **Smooth transitions**: Uses framer-motion for GPU-accelerated animations
- **Themed text**: Uses `text-amber` color for retro feel

**Styling**:
- Full-screen centered layout (`w-full h-screen flex items-center justify-center`)
- Monospace font for terminal aesthetic (`font-mono`)
- Background matches application theme (`bg-background`)

---

### WindowContainer

**Location**: `src/components/WindowContainer.tsx:27`

**Purpose**: Wraps content in a desktop window metaphor with title bar and controls.

**Interface**:
```typescript
interface WindowContainerProps {
  title: string;            // Window title text
  icon?: string;            // Icon identifier (default: "terminal")
  children: ReactNode;      // Content to display in window
  isTransitioning: boolean; // Disables interactions during transitions
}
```

**Structure**:
```
WindowContainer
├── Title Bar
│   ├── Icon (lucide-react icon)
│   ├── Title Text (with flicker effect)
│   └── Window Controls (decorative dots)
└── Content Area
    └── AnimatePresence wrapper
        └── Children (with fade transition)
```

**Icon Map**:
```typescript
const iconMap: Record<string, ReactNode> = {
  terminal: <Terminal />,
  building: <Building2 />,
  settings: <Settings />,
  folder: <FolderOpen />,
  disc: <Disc />,
  cloud: <Cloud />,
  container: <Box />,
  chart: <BarChart3 />,
  wrench: <Wrench />
};
```

**Title Flicker Effect**:

When the title changes, a flicker animation occurs:
```typescript
// src/components/WindowContainer.tsx:36
useEffect(() => {
  if (title !== displayTitle) {
    setIsFlickering(true);              // Start flicker
    setTimeout(() => {
      setDisplayTitle(title);           // Update title after 200ms
      setTimeout(() => setIsFlickering(false), 150);  // End flicker after 150ms
    }, 200);
  }
}, [title, displayTitle]);
```

Timeline:
```
0ms     Title prop changes
        └─> isFlickering = true (opacity animation)

200ms   Display title updates
        └─> New title shows

350ms   Flicker ends
        └─> isFlickering = false
```

**Content Transition**:

Uses AnimatePresence for smooth content changes:
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={title}                    // Re-mount on title change
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Styling Classes**:
- `.window-title-bar`: Custom title bar styling with charcoal background
- `.window-control-dot`: Decorative window control buttons (amber/gold colors)
- `.bg-cream`: Light cream background for content area
- `.shadow-window`: Custom shadow effect

**Responsive Behavior**:
- Full width up to max-w-6xl
- Height: `calc(100vh - 8rem)` (accounts for taskbar)
- Content area scrollable on overflow

---

### Taskbar

**Location**: `src/components/Taskbar.tsx:13`

**Purpose**: Bottom navigation bar with screen navigation buttons, social links, and live clock.

**Interface**:
```typescript
interface TaskbarProps {
  currentScreen: ScreenId;     // Currently active screen
  onNavigate: (screenId: ScreenId) => void;  // Navigation callback
  isTransitioning: boolean;    // Disables navigation during transitions
}
```

**Structure**:
```
Taskbar (fixed bottom)
├── Left Section
│   ├── Start Button (decorative)
│   ├── Divider
│   └── Navigation Buttons (dynamically generated)
└── Right Section (System Tray)
    ├── GitHub Link
    ├── LinkedIn Link
    ├── Email Link
    ├── Divider
    └── Clock (live updating)
```

**Navigation Button Generation**:

Buttons are generated from the `screens` array:
```typescript
// src/components/Taskbar.tsx:49
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

This means:
- Adding a screen to `data/content.ts:screens` automatically adds it to the taskbar
- No manual button configuration needed
- Active state styling applied automatically

**Live Clock Implementation**:

```typescript
// src/components/Taskbar.tsx:16
useEffect(() => {
  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    setCurrentTime(`${displayHours}:${minutes} ${ampm}`);
  };

  updateTime();                          // Immediate update
  const interval = setInterval(updateTime, 60000);  // Update every minute
  return () => clearInterval(interval);  // Cleanup
}, []);
```

**Social Links**:

Links are pulled from `personalInfo` in `data/content.ts`:
```tsx
<a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
  <Github />
</a>
```

Security attributes:
- `target="_blank"`: Opens in new tab
- `rel="noopener noreferrer"`: Prevents security vulnerabilities

**Animation**:

Taskbar slides up from bottom on page load:
```tsx
<motion.div
  initial={{ y: "100%" }}      // Start off-screen
  animate={{ y: 0 }}           // Slide to position
  transition={{
    delay: 0.8,                // Wait 800ms after page load
    duration: 0.25,            // 250ms animation
    ease: [0, 0, 0.2, 1]      // Custom easing
  }}
>
```

**Styling Classes**:
- `.taskbar`: Fixed positioning, charcoal background, top border
- `.taskbar-start`: Start button with icon and text
- `.taskbar-nav-btn`: Navigation button with hover/active states
- `.taskbar-icon`: Icon button for social links
- `.taskbar-clock`: Clock display styling
- `.taskbar-divider`: Visual separator

**Accessibility**:
- Proper `aria-label` attributes on icon buttons
- `aria-current="page"` on active navigation button
- Disabled state during transitions

---

### NavLink

**Location**: `src/components/NavLink.tsx`

**Purpose**: Custom navigation link component (if applicable for routing).

**Note**: This component exists but isn't currently used due to the screen-based navigation system. It may be intended for future traditional routing implementation.

---

## Screen Components

All screen components follow consistent patterns:

### Common Patterns

**1. Animation Container**:
```tsx
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="show"
>
  {/* Content with staggered children */}
</motion.div>
```

**2. Section Title**:
```tsx
<motion.div variants={fadeSlideUp} className="text-center mb-12">
  <h2 className="section-title">Section Name</h2>
  <div className="section-title-underline mx-auto mt-4" />
</motion.div>
```

**3. Data Import**:
```tsx
import { dataArray } from "@/data/content";
```

**4. Responsive Layout**:
```tsx
<div className="grid md:grid-cols-2 gap-6">
  {/* Content */}
</div>
```

---

### AboutScreen

**Location**: `src/components/screens/AboutScreen.tsx:11`
**Lines**: 94

**Purpose**: Landing screen introducing the portfolio owner with headline, bio, and call-to-action.

**Interface**:
```typescript
interface AboutScreenProps {
  onNavigate: (screenId: ScreenId) => void;  // Navigation callback
}
```

**Layout**:
```
Two-Column Layout (flex-col on mobile, flex-row on lg+)
├── Left Column (Text Content)
│   ├── Role Badge (with icon)
│   ├── Headline (2 lines, accent on line 2)
│   ├── Bio Paragraph
│   └── CTA Button → Projects
└── Right Column (Visual)
    └── Profile Image with Terminal Overlay
        ├── Gradient Background
        └── Terminal Commands (decorative)
```

**Key Features**:

**1. Role Badge**:
```tsx
<span className="role-badge">
  <Settings className="w-4 h-4 role-badge-icon" />
  {personalInfo.title}
</span>
```

**2. Split Headline**:
```tsx
<span className="hero-display">{personalInfo.headline.line1}</span>
<span className="hero-display-accent">{personalInfo.headline.line2}</span>
```
Allows for styled emphasis on second line.

**3. Terminal Overlay**:
```tsx
<div className="terminal-overlay">
  <div className="terminal-line">
    <span className="terminal-prompt">&gt;</span> ssh root@server
  </div>
  {/* More commands... */}
</div>
```
Decorative terminal commands overlay on profile area.

**4. CTA Navigation**:
```tsx
<button onClick={() => onNavigate("projects")} className="btn-primary">
  View Projects
  <ArrowRight />
</button>
```

**Stagger Animation Sequence**:
1. Role badge fades in + slides up
2. Headline line 1 fades in + slides up
3. Headline line 2 fades in + slides up
4. Bio paragraph fades in + slides up
5. CTA button fades in + slides up
6. Profile image fades in + slides up

Delay between each: 100ms (defined in `staggerContainer` variant)

---

### ExperienceScreen

**Location**: `src/components/screens/ExperienceScreen.tsx:6`
**Lines**: 91

**Purpose**: Displays work experience in a timeline format.

**Data Source**: `experiences` array from `data/content.ts:14`

**Layout**:
```
Vertical Timeline (centered)
├── Timeline Line (vertical, hidden on mobile)
├── Timeline Dots (at each experience)
└── Experience Cards (alternating left/right)
    ├── Card Header
    │   ├── Job Title
    │   ├── Company Name (with icon)
    │   └── Period Badge
    ├── Achievements List
    └── Technology Tags
```

**Alternating Layout**:
```typescript
className={`relative md:flex items-start ${
  index % 2 === 0 ? "md:flex-row-reverse" : ""
}`}
```

Even-indexed items: right side
Odd-indexed items: left side

**Timeline Components**:

**1. Vertical Line**:
```tsx
<motion.div
  variants={timelineVariants}
  style={{ originY: 0 }}            // Scale from top
  className="timeline-line absolute left-1/2 -translate-x-1/2 top-0 h-full hidden md:block"
/>
```

Animation: Scales from height 0 to full height (600ms duration)

**2. Timeline Dots**:
```tsx
<motion.div
  variants={dotVariants}
  className="timeline-dot hidden md:block absolute left-1/2 -translate-x-1/2 top-6 z-10"
/>
```

Animation: Spring animation from scale 0 to 1

**Experience Card Structure**:
```tsx
<div className="content-card-accent">
  {/* Header */}
  <h3>{exp.title}</h3>
  <span className="company-name">{exp.company}</span>
  <span className="date-badge">{exp.period}</span>

  {/* Achievements */}
  <ul>
    {exp.achievements.map(achievement => (
      <li>• {achievement}</li>
    ))}
  </ul>

  {/* Technologies */}
  <div className="flex flex-wrap gap-2">
    {exp.technologies.map(tech => (
      <span className="tech-tag">{tech}</span>
    ))}
  </div>
</div>
```

**Icon Logic**:
```typescript
{index === 0 ? (
  <Building2 className="w-4 h-4 text-burgundy" />  // Current job
) : (
  <Cloud className="w-4 h-4 text-burgundy" />     // Past jobs
)}
```

First experience gets Building2 icon, others get Cloud icon.

**Responsive Behavior**:
- **Mobile**: Stacked cards, no timeline line or dots
- **Desktop (md+)**: Alternating left/right layout with central timeline

---

### SkillsScreen

**Location**: `src/components/screens/SkillsScreen.tsx:21`
**Lines**: 67

**Purpose**: Displays technical skills grouped by category.

**Data Source**: `skillCategories` array from `data/content.ts:56`

**Layout**:
```
Two-Column Grid (stacks on mobile)
├── Category Panel 1
│   ├── Category Header (icon + title)
│   └── Skill Tags (wrapped)
├── Category Panel 2
│   └── ...
└── ...
```

**Icon Mapping**:

Two separate icon maps:

```typescript
// Category icons (larger, 5x5)
const categoryIcons: Record<string, ReactNode> = {
  cloud: <Cloud className="w-5 h-5" />,
  container: <Box className="w-5 h-5" />,
  terminal: <Terminal className="w-5 h-5" />,
  chart: <BarChart3 className="w-5 h-5" />,
};

// Skill icons (smaller, 4x4)
const skillIcons: Record<string, ReactNode> = {
  check: <Check className="w-4 h-4" />,
  box: <Box className="w-4 h-4" />,
  terminal: <Terminal className="w-4 h-4" />,
  chart: <BarChart3 className="w-4 h-4" />,
};
```

**Category Panel Structure**:
```tsx
<div className="category-panel">
  {/* Header */}
  <div className="category-header">
    <span className="category-icon">
      {categoryIcons[category.icon]}
    </span>
    <span>{category.title}</span>
  </div>

  {/* Skills */}
  <div className="flex flex-wrap gap-2">
    {category.skills.map((skill) => (
      <span className="skill-tag">
        <span className="skill-tag-icon">
          {skillIcons[skill.icon]}
        </span>
        {skill.name}
      </span>
    ))}
  </div>
</div>
```

**Styling Classes**:
- `.category-panel`: Card-like container for each category
- `.category-header`: Flex layout with icon and title
- `.category-icon`: Icon container
- `.skill-tag`: Individual skill badge
- `.skill-tag-icon`: Icon within skill tag

**Data Structure Expected**:
```typescript
{
  id: string,
  title: string,          // e.g., "CLOUD & INFRASTRUCTURE"
  icon: string,           // Key from categoryIcons
  skills: [
    { name: string, icon: string }  // icon key from skillIcons
  ]
}
```

---

### ProjectsScreen

**Location**: `src/components/screens/ProjectsScreen.tsx`
**Lines**: 120 (largest screen component)

**Purpose**: Displays portfolio projects in a grid layout.

**Data Source**: `projects` array from `data/content.ts:108`

**Layout** (inferred structure):
```
Grid Layout
├── Project Card 1
│   ├── Filename (styled as file)
│   ├── Title
│   ├── Description
│   ├── Technology Tags
│   └── CTA Link
├── Project Card 2
└── ...
```

**Typical Project Card Pattern**:
```tsx
<div className="project-card">
  <div className="project-filename">{project.filename}</div>
  <h3>{project.title}</h3>
  <p>{project.description}</p>

  <div className="tech-tags">
    {project.technologies.map(tech => (
      <span className="tech-tag">{tech}</span>
    ))}
  </div>

  <a href={project.cta.url} className="project-cta">
    {project.cta.text}
    <Icon />  {/* Based on project.cta.icon */}
  </a>
</div>
```

**Unique Feature**: File-system aesthetic with filenames like:
- `cloud_migration.v2`
- `kube_autoscaler.yml`
- `pipeline_v4.jenkins`
- `security_audit.log`

This reinforces the OS/developer theme.

---

### EducationScreen

**Location**: `src/components/screens/EducationScreen.tsx`
**Lines**: 110

**Purpose**: Displays education history and professional certifications.

**Data Sources**:
- `education` array from `data/content.ts:159`
- `certifications` array from `data/content.ts:178`

**Layout** (inferred):
```
Two Sections
├── Education Section
│   └── Education Cards (chronological)
│       ├── Institution
│       ├── Degree
│       ├── Period
│       ├── Location
│       └── Description
└── Certifications Section
    └── Certification Cards (grid)
        ├── Name
        ├── Level
        ├── Issuer
        └── Icon
```

**Typical Structure**:
```tsx
<section>
  <h2>Education</h2>
  {education.map(edu => (
    <div className="education-card">
      <h3>{edu.degree}</h3>
      <p>{edu.institution}</p>
      <span>{edu.period}</span>
      <p>{edu.description}</p>
    </div>
  ))}
</section>

<section>
  <h2>Certifications</h2>
  <div className="certifications-grid">
    {certifications.map(cert => (
      <div className="cert-card">
        <Icon />  {/* Based on cert.icon */}
        <h3>{cert.name}</h3>
        <p>{cert.level}</p>
        <p>{cert.issuer}</p>
      </div>
    ))}
  </div>
</section>
```

---

## UI Components

### shadcn/ui Component Library

**Location**: `src/components/ui/`
**Count**: 35+ components

The project uses the shadcn/ui component library, which provides:
- **Accessible**: Built on Radix UI primitives with ARIA support
- **Customizable**: Full control over styling with Tailwind CSS
- **Copy-paste**: Components are part of the codebase, not a package dependency

### Available UI Components

#### Form Components
- `input.tsx` - Text input field
- `select.tsx` - Dropdown select
- `checkbox.tsx` - Checkbox input
- `switch.tsx` - Toggle switch
- `slider.tsx` - Range slider
- `radio-group.tsx` - Radio button group
- `input-otp.tsx` - One-time password input
- `form.tsx` - Form wrapper with react-hook-form integration
- `label.tsx` - Form label

#### Layout Components
- `tabs.tsx` - Tabbed interface
- `accordion.tsx` - Collapsible sections
- `collapsible.tsx` - Single collapsible section
- `resizable.tsx` - Resizable panels
- `separator.tsx` - Visual divider
- `scroll-area.tsx` - Custom scrollbar styling

#### Overlay Components
- `dialog.tsx` - Modal dialog
- `alert-dialog.tsx` - Confirmation dialog
- `sheet.tsx` - Side sheet/drawer
- `drawer.tsx` - Bottom drawer (mobile-friendly)
- `popover.tsx` - Popover menu
- `hover-card.tsx` - Hover tooltip card
- `tooltip.tsx` - Simple tooltip

#### Navigation Components
- `menubar.tsx` - Menu bar
- `navigation-menu.tsx` - Navigation component
- `context-menu.tsx` - Right-click menu
- `dropdown-menu.tsx` - Dropdown menu

#### Feedback Components
- `toast.tsx` - Toast notification component
- `toaster.tsx` - Toast container
- `sonner.tsx` - Alternative toast implementation
- `progress.tsx` - Progress bar

#### Display Components
- `table.tsx` - Data table
- `avatar.tsx` - User avatar
- `badge.tsx` - Status badge
- `card.tsx` - Card container
- `carousel.tsx` - Image carousel

### Using UI Components

**Basic Import**:
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
```

**Example Usage**:
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <p>Content here</p>
  </DialogContent>
</Dialog>
```

**Adding New Components**:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add calendar
```

This downloads the component source into `src/components/ui/`.

---

## Component Patterns

### Pattern 1: Staggered Animation

Used in all screen components for sequential element appearance.

```tsx
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="show"
>
  <motion.div variants={fadeSlideUp}>Element 1</motion.div>
  <motion.div variants={fadeSlideUp}>Element 2</motion.div>
  <motion.div variants={fadeSlideUp}>Element 3</motion.div>
</motion.div>
```

Each child animates 100ms after the previous one.

### Pattern 2: Icon Mapping

Used to dynamically select icons based on string identifiers.

```typescript
const iconMap: Record<string, ReactNode> = {
  terminal: <Terminal />,
  building: <Building2 />,
  // ...
};

// Usage
{iconMap[screen.icon]}
```

Benefits:
- Data-driven icon selection
- Easy to add new icons
- Type-safe with TypeScript

### Pattern 3: Responsive Grid

Used in SkillsScreen, ProjectsScreen, and EducationScreen.

```tsx
<div className="grid md:grid-cols-2 gap-6">
  {/* Cards */}
</div>
```

Behavior:
- Mobile: 1 column (stacked)
- Desktop (md+): 2 columns

Variations:
- `lg:grid-cols-3` for 3 columns
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for progressive enhancement

### Pattern 4: Conditional Layout

Used in ExperienceScreen for alternating timeline items.

```tsx
{items.map((item, index) => (
  <div className={index % 2 === 0 ? "md:flex-row-reverse" : ""}>
    {/* Content */}
  </div>
))}
```

Creates alternating left/right layout on desktop.

### Pattern 5: Section Title with Underline

Consistent pattern across all screens.

```tsx
<motion.div variants={fadeSlideUp} className="text-center mb-12">
  <h2 className="section-title">Section Name</h2>
  <div className="section-title-underline mx-auto mt-4" />
</motion.div>
```

Provides visual consistency and rhythm.

---

## Props Reference

### Common Prop Patterns

#### Navigation Props
```typescript
interface ScreenProps {
  onNavigate: (screenId: ScreenId) => void;  // Navigate to screen
}
```

Used by: AboutScreen

#### State Props
```typescript
interface LayoutProps {
  currentScreen: ScreenId;      // Current active screen
  isTransitioning: boolean;     // Prevents interactions during transitions
}
```

Used by: Taskbar, WindowContainer (partially)

#### Display Props
```typescript
interface DisplayProps {
  title: string;                // Display text
  icon?: string;                // Icon identifier
  children: ReactNode;          // Child content
}
```

Used by: WindowContainer

#### Callback Props
```typescript
interface CallbackProps {
  onComplete: () => void;       // Completion callback
}
```

Used by: BootSequence

### Type Definitions

**ScreenId**:
```typescript
export type ScreenId = "about" | "experience" | "skills" | "projects" | "education";
```

**Location**: `src/hooks/useScreenNavigation.ts:4`

This type must be updated when adding new screens.

---

## Component Testing Considerations

### Testable Components

Components are designed to be easily testable:

**1. Pure Presentation**: Screen components receive data as props or imports
```tsx
// Easy to test with mock data
<AboutScreen onNavigate={mockNavigate} />
```

**2. Isolated State**: State management in custom hooks
```tsx
// Test hook separately
const { currentScreen, goToScreen } = useScreenNavigation();
expect(currentScreen).toBe("about");
goToScreen("skills");
expect(currentScreen).toBe("skills");
```

**3. Data Separation**: Content in separate file
```tsx
// Can mock data module
jest.mock("@/data/content", () => ({
  personalInfo: mockPersonalInfo,
  experiences: mockExperiences
}));
```

### Testing Utilities

Recommended testing setup:

```typescript
import { render, screen } from "@testing-library/react";
import { MotionConfig } from "framer-motion";

// Disable animations for testing
function renderWithoutAnimation(component) {
  return render(
    <MotionConfig reducedMotion="always">
      {component}
    </MotionConfig>
  );
}
```

---

## Performance Considerations

### Component Optimization

**1. Memoization Opportunities**:

Currently not implemented, but potential optimizations:

```tsx
// Memoize expensive screen components
const AboutScreen = memo(AboutScreenComponent);

// Memoize icon maps (already static)
const iconMap = useMemo(() => ({
  terminal: <Terminal />,
  // ...
}), []);
```

**2. Lazy Loading**:

Currently all components load upfront. For optimization:

```tsx
const AboutScreen = lazy(() => import("./screens/AboutScreen"));
const ExperienceScreen = lazy(() => import("./screens/ExperienceScreen"));
// ...

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  {renderScreen()}
</Suspense>
```

**3. Animation Performance**:

Framer Motion already optimizes animations using:
- GPU-accelerated transforms
- RequestAnimationFrame scheduling
- Layout animations (when needed)

**4. Re-render Prevention**:

Use `useCallback` for navigation functions (already implemented):
```typescript
const goToScreen = useCallback((screenId: ScreenId) => {
  // ...
}, [dependencies]);
```

---

## Accessibility Features

### Keyboard Navigation

**Taskbar Navigation**:
- Tab key navigates between buttons
- Enter/Space activates buttons
- Disabled state during transitions

**WindowContainer**:
- Focusable elements within content
- Scroll area keyboard accessible

### Screen Reader Support

**ARIA Attributes**:
```tsx
<button aria-label="GitHub" aria-current={currentScreen === "github"}>
```

**Semantic HTML**:
```tsx
<nav>              {/* Taskbar navigation */}
<main>             {/* Main content area */}
<article>          {/* Individual cards/sections */}
```

### Focus Management

During screen transitions:
- Navigation buttons disabled (`disabled={isTransitioning}`)
- Prevents focus trap issues
- Visual feedback on disabled state

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design patterns
- [UI-PATTERNS.md](./UI-PATTERNS.md) - shadcn/ui patterns and customization
- [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) - State management deep dive
- [DATA-MODELS.md](./DATA-MODELS.md) - Data structures and types

---

**Last Updated**: 2026-01-08
