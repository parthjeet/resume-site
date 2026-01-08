# Development Guide

> **Document Type**: Development Guide
> **Last Updated**: 2026-01-08
> **For**: Contributors and Developers
> **Project**: MyRes Site - Portfolio Web Application

---

## Table of Contents

1. [Development Environment Setup](#1-development-environment-setup)
2. [Project Scripts and Commands](#2-project-scripts-and-commands)
3. [Development Workflow](#3-development-workflow)
4. [Coding Standards](#4-coding-standards)
5. [Component Development Guide](#5-component-development-guide)
6. [Styling Guidelines](#6-styling-guidelines)
7. [Testing Guidelines](#7-testing-guidelines)
8. [Build and Deployment](#8-build-and-deployment)
9. [Troubleshooting Common Issues](#9-troubleshooting-common-issues)
10. [Contributing Guidelines](#10-contributing-guidelines)

---

## 1. Development Environment Setup

### 1.1 Prerequisites

Before starting development, ensure you have the following installed:

| Tool | Minimum Version | Recommended Version | Purpose |
|------|----------------|---------------------|---------|
| Node.js | 16.x | 20.x or later | JavaScript runtime |
| npm | 8.x | 10.x or later | Package manager |
| Git | 2.x | Latest | Version control |
| VS Code | - | Latest | IDE (recommended) |

**Verify installations:**

```bash
node --version  # Should be 16.x or higher
npm --version   # Should be 8.x or higher
git --version   # Should be 2.x or higher
```

**Installing Node.js:**

If you don't have Node.js installed, use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install latest LTS version
nvm install --lts
nvm use --lts
```

### 1.2 Installation Steps

**Step 1: Clone the repository**

```bash
git clone <repository-url>
cd myres-site
```

**Step 2: Install dependencies**

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- React 18.3.1 for UI development
- Vite 5.4.19 for build tooling
- TypeScript 5.8.3 for type safety
- Tailwind CSS 3.4.17 for styling
- 35+ shadcn/ui components
- Framer Motion for animations

**Step 3: Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:8080` (configured in `vite.config.ts`).

### 1.3 IDE Setup Recommendations

#### VS Code (Recommended)

Install the following extensions for the best development experience:

**Essential Extensions:**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint integration
    "esbenp.prettier-vscode",           // Code formatting
    "bradlc.vscode-tailwindcss",        // Tailwind CSS IntelliSense
    "ms-vscode.vscode-typescript-next", // TypeScript support
    "dsznajder.es7-react-js-snippets",  // React snippets
    "formulahendry.auto-rename-tag",    // Auto rename paired HTML tags
    "christian-kohler.path-intellisense" // Path autocomplete
  ]
}
```

**VS Code Settings:**

Create or update `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

**Keyboard Shortcuts:**

- `Ctrl+Shift+P` (Cmd+Shift+P on Mac): Command palette
- `Ctrl+P` (Cmd+P): Quick file open
- `Ctrl+Shift+F` (Cmd+Shift+F): Search across files
- `F2`: Rename symbol
- `Ctrl+.` (Cmd+.): Quick fix

### 1.4 Environment Configuration

The project uses Vite for configuration. Key settings are in `vite.config.ts`:

```typescript
{
  server: {
    host: "::",      // Listen on all network interfaces
    port: 8080,      // Development server port
  },
  plugins: [react()],  // React SWC plugin for fast refresh
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Path alias
    },
  },
}
```

**Path Aliases:**

The project uses TypeScript path aliases configured in `tsconfig.json`:

```typescript
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]  // Import from src using @/
  }
}
```

**Usage example:**

```typescript
// Instead of: import { Button } from "../../components/ui/button"
import { Button } from "@/components/ui/button"
```

**shadcn/ui Configuration:**

Component aliases are defined in `components.json`:

```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## 2. Project Scripts and Commands

All scripts are defined in `package.json`. Here's what each does and when to use them:

### 2.1 Development Scripts

#### `npm run dev`

**Purpose**: Start the Vite development server with hot module replacement (HMR)

**What it does:**
- Starts development server on `http://localhost:8080`
- Enables hot reload (instant updates without full page refresh)
- Provides detailed error messages and stack traces
- Opens developer tools integration

**When to use:**
- During active development
- When you need instant feedback on code changes
- For testing features in development mode

**Example output:**
```
VITE v5.4.19  ready in 1234 ms

➜  Local:   http://localhost:8080/
➜  Network: http://192.168.1.100:8080/
```

#### `npm run build`

**Purpose**: Build the application for production deployment

**What it does:**
- Compiles TypeScript to JavaScript
- Bundles all assets (JS, CSS, images)
- Minifies and optimizes code
- Generates source maps
- Creates optimized chunks for lazy loading
- Outputs to `dist/` directory

**When to use:**
- Before deploying to production
- To verify production build works correctly
- To analyze bundle size

**Example output:**
```
vite v5.4.19 building for production...
✓ 1234 modules transformed.
dist/index.html                  0.45 kB │ gzip: 0.30 kB
dist/assets/index-abc123.css    12.34 kB │ gzip:  3.45 kB
dist/assets/index-xyz789.js    123.45 kB │ gzip: 45.67 kB
✓ built in 5.67s
```

#### `npm run build:dev`

**Purpose**: Build with development mode settings

**What it does:**
- Creates a build similar to production but with development optimizations
- Useful for debugging production issues with better error messages
- Skips some production optimizations for faster builds

**When to use:**
- Debugging production-specific issues
- Testing build process during development

#### `npm run lint`

**Purpose**: Run ESLint to check code quality and style

**What it does:**
- Scans all TypeScript/TSX files for linting errors
- Checks against ESLint rules defined in `eslint.config.js`
- Reports warnings and errors
- Enforces React Hooks rules
- Checks for unused variables and imports

**When to use:**
- Before committing code
- During code review
- To maintain code quality standards

**Example output:**
```
/src/components/Example.tsx
  12:7  error  'useState' is defined but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

**Auto-fix issues:**
```bash
# Most linting issues can be auto-fixed
npx eslint . --fix
```

#### `npm run preview`

**Purpose**: Preview the production build locally

**What it does:**
- Serves the `dist/` folder on a local server
- Simulates production environment
- Uses production build artifacts
- Runs on port 4173 by default

**When to use:**
- After running `npm run build`
- To verify production build before deployment
- To test production-specific features (e.g., code splitting, lazy loading)

**Usage:**
```bash
npm run build    # Build first
npm run preview  # Then preview
```

### 2.2 Command Chaining

You can chain commands for common workflows:

```bash
# Lint and then build
npm run lint && npm run build

# Build and preview
npm run build && npm run preview

# Clean, install, and dev
rm -rf node_modules package-lock.json && npm install && npm run dev
```

---

## 3. Development Workflow

### 3.1 Branch Strategy

**Main Branches:**

- `main` - Production-ready code, always stable
- `develop` - Integration branch for features

**Feature Branches:**

```bash
# Create a new feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Naming conventions:
# feature/add-contact-form
# bugfix/fix-navigation-error
# refactor/improve-animation-performance
# docs/update-readme
```

### 3.2 Feature Development Process

**Step 1: Create a branch**

```bash
git checkout -b feature/new-component
```

**Step 2: Make changes**

Follow the coding standards (see Section 4) and make your changes.

**Step 3: Test locally**

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build to verify production compatibility
npm run build
```

**Step 4: Commit changes**

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add contact form component with validation"
```

**Commit message format:**
```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Formatting, missing semicolons, etc.
- `docs`: Documentation changes
- `test`: Adding tests
- `chore`: Maintenance tasks

**Step 5: Push and create pull request**

```bash
git push origin feature/new-component
```

### 3.3 Testing Workflow

Before submitting code:

1. **Manual Testing**: Test all changed functionality in the browser
2. **Linting**: Run `npm run lint` and fix all errors
3. **Build Test**: Run `npm run build` to ensure production build works
4. **Visual Testing**: Check responsive design on different screen sizes
5. **Cross-browser Testing**: Test on Chrome, Firefox, Safari (if possible)

**Testing checklist:**
- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] ESLint passes with no errors
- [ ] Production build completes successfully
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Animations are smooth and performant
- [ ] No TypeScript errors

### 3.4 Code Review Process

**For Authors:**

1. Create a pull request with clear description
2. Link related issues
3. Add screenshots/videos for UI changes
4. Request review from team members
5. Address feedback promptly

**For Reviewers:**

1. Check code follows project standards
2. Verify functionality works as described
3. Look for potential bugs or edge cases
4. Ensure proper error handling
5. Check for performance implications
6. Approve or request changes

---

## 4. Coding Standards

### 4.1 TypeScript Conventions

**Type Annotations:**

```typescript
// ✅ Good: Explicit types for function parameters and returns
function calculateTotal(items: Item[], tax: number): number {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 + tax);
}

// ✅ Good: Interface for component props
interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

// ❌ Avoid: Using 'any' type
function processData(data: any) { // Bad
  // ...
}

// ✅ Better: Use proper types or 'unknown'
function processData(data: unknown) {
  // Type guard to narrow type
  if (typeof data === "object" && data !== null) {
    // ...
  }
}
```

**Type Inference:**

```typescript
// ✅ Good: Let TypeScript infer simple types
const name = "Alex Chen";  // string (inferred)
const count = 42;          // number (inferred)

// ✅ Good: Explicit types for complex objects
const config: AppConfig = {
  theme: "dark",
  apiUrl: "https://api.example.com",
  timeout: 5000
};
```

**Enums vs Union Types:**

```typescript
// ✅ Prefer string literal unions over enums
type ScreenId = "about" | "experience" | "skills" | "projects" | "education";

// ❌ Avoid enums unless specifically needed
enum ScreenId {
  About = "about",
  Experience = "experience",
  // ...
}
```

### 4.2 Component Structure Guidelines

**Functional Components:**

```typescript
// ✅ Recommended structure
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScreenId } from "@/hooks/useScreenNavigation";

// 1. Type definitions
interface ExampleComponentProps {
  title: string;
  onAction: (id: string) => void;
  items?: Item[];
}

// 2. Component definition
export function ExampleComponent({
  title,
  onAction,
  items = []
}: ExampleComponentProps) {
  // 3. Hooks
  const [isActive, setIsActive] = useState(false);

  // 4. Event handlers
  const handleClick = () => {
    setIsActive(!isActive);
    onAction("example");
  };

  // 5. Render helpers (if needed)
  const renderItems = () => {
    return items.map(item => (
      <div key={item.id}>{item.name}</div>
    ));
  };

  // 6. Return JSX
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>{title}</h2>
      <Button onClick={handleClick}>
        {isActive ? "Active" : "Inactive"}
      </Button>
      {renderItems()}
    </motion.div>
  );
}
```

**Component Organization:**

```
Component file structure:
1. Imports (external → internal → types)
2. Type/Interface definitions
3. Constants (if any)
4. Component definition
5. Helper functions (below component or in separate file)
6. Default export (if needed)
```

### 4.3 Naming Conventions

**Components:**

```typescript
// ✅ PascalCase for components
export function AboutScreen() { }
export function WindowContainer() { }
export function NavLink() { }

// File names match component names
// AboutScreen.tsx, WindowContainer.tsx, NavLink.tsx
```

**Functions and Variables:**

```typescript
// ✅ camelCase for functions, variables, and hooks
const handleNavigation = () => { };
const screenTitle = "About";
const useScreenNavigation = () => { };

// ✅ Descriptive names
const isLoading = true;  // Not: const loading
const hasError = false;  // Not: const error

// ✅ Event handlers prefixed with 'handle'
const handleClick = () => { };
const handleSubmit = () => { };
const handleChange = () => { };
```

**Constants:**

```typescript
// ✅ UPPER_SNAKE_CASE for true constants
const MAX_ITEMS = 100;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_TIMEOUT = 5000;

// ✅ Regular camelCase for configuration objects
const animationConfig = {
  duration: 0.3,
  ease: "easeOut"
};
```

**Types and Interfaces:**

```typescript
// ✅ PascalCase for types and interfaces
interface UserProfile {
  name: string;
  email: string;
}

type ScreenId = "about" | "experience";

// ✅ Suffix Props interfaces with 'Props'
interface ButtonProps {
  variant: "primary" | "secondary";
}

// ✅ Prefix boolean types with 'is', 'has', 'should'
interface FeatureFlags {
  isEnabled: boolean;
  hasAccess: boolean;
  shouldRender: boolean;
}
```

### 4.4 File Organization

**Directory Structure:**

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated)
│   ├── screens/         # Screen components (AboutScreen.tsx, etc.)
│   ├── BootSequence.tsx # Standalone components
│   ├── WindowContainer.tsx
│   └── Taskbar.tsx
├── hooks/               # Custom hooks (use*.ts)
├── lib/                 # Utilities and helpers
│   ├── utils.ts        # General utilities
│   └── animations.ts   # Animation configurations
├── data/               # Static content and mock data
│   └── content.ts      # Portfolio data
├── pages/              # Route components
│   ├── Index.tsx
│   └── NotFound.tsx
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

**File Naming:**

- Components: `PascalCase.tsx` (e.g., `AboutScreen.tsx`)
- Hooks: `camelCase.ts` or `use-kebab-case.tsx` (e.g., `useScreenNavigation.ts`, `use-mobile.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`, `animations.ts`)
- Types: `camelCase.ts` or `PascalCase.ts` (e.g., `types.ts`, `ScreenTypes.ts`)

### 4.5 Import Order

Organize imports in the following order:

```typescript
// 1. External libraries (React, third-party)
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, ArrowRight } from "lucide-react";

// 2. Internal components (using @ alias)
import { Button } from "@/components/ui/button";
import { WindowContainer } from "@/components/WindowContainer";

// 3. Hooks
import { useScreenNavigation } from "@/hooks/useScreenNavigation";
import { useMobile } from "@/hooks/use-mobile";

// 4. Utilities and helpers
import { cn } from "@/lib/utils";
import { fadeSlideUp, staggerContainer } from "@/lib/animations";

// 5. Data and constants
import { personalInfo, experiences } from "@/data/content";

// 6. Types (if not inline)
import type { ScreenId } from "@/types";

// 7. Styles (rarely needed with Tailwind)
import "./styles.css";
```

### 4.6 Comment Guidelines

**When to Comment:**

```typescript
// ✅ Good: Complex business logic
// Calculate compound interest with monthly contributions
// Formula: A = P(1 + r/n)^(nt) + PMT × (((1 + r/n)^(nt) - 1) / (r/n))
const calculateInvestment = (principal, rate, years, monthlyContribution) => {
  // Implementation
};

// ✅ Good: Non-obvious workarounds
// Workaround for Safari bug with backdrop-filter
// See: https://bugs.webkit.org/show_bug.cgi?id=123456
const backdropStyle = isSafari ? { background: "rgba(0,0,0,0.5)" } : {};

// ✅ Good: JSDoc for public APIs
/**
 * Navigates to a specific screen with transition animation
 * @param screenId - The ID of the screen to navigate to
 * @param options - Optional navigation options
 * @returns Promise that resolves when navigation is complete
 */
export const navigateToScreen = async (
  screenId: ScreenId,
  options?: NavigationOptions
): Promise<void> => {
  // Implementation
};

// ❌ Avoid: Obvious comments
// Increment counter by 1
setCount(count + 1);

// ❌ Avoid: Commented-out code (use git instead)
// const oldFunction = () => {
//   // old implementation
// };
```

**TODO Comments:**

```typescript
// TODO: Add loading state when fetching data
// FIXME: Animation stutters on mobile devices
// HACK: Temporary workaround for API limitation
// NOTE: This behavior is intentional, see issue #123
```

---

## 5. Component Development Guide

### 5.1 Creating New Components

**Step 1: Choose the right location**

```
src/components/
├── ui/              # Don't create here (managed by shadcn CLI)
├── screens/         # Screen components (AboutScreen, ExperienceScreen)
├── [Component.tsx]  # Shared/reusable components
```

**Step 2: Create component file**

```bash
# For a screen component
touch src/components/screens/ContactScreen.tsx

# For a shared component
touch src/components/ContactForm.tsx
```

**Step 3: Use the component template**

```typescript
// src/components/screens/ContactScreen.tsx
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { staggerContainer, fadeSlideUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";

interface ContactScreenProps {
  onNavigate?: (screenId: string) => void;
}

export function ContactScreen({ onNavigate }: ContactScreenProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fadeSlideUp}>
        <h1 className="text-h1 flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Get in Touch
        </h1>
      </motion.div>

      <motion.div variants={fadeSlideUp}>
        {/* Component content */}
      </motion.div>
    </motion.div>
  );
}
```

**Step 4: Export from parent (if needed)**

```typescript
// src/components/screens/index.ts
export { AboutScreen } from "./AboutScreen";
export { ExperienceScreen } from "./ExperienceScreen";
export { ContactScreen } from "./ContactScreen"; // Add new export
```

### 5.2 Creating New Screens

Screens are full-page components displayed in the `WindowContainer`. Follow these steps:

**Step 1: Create screen component**

```typescript
// src/components/screens/NewScreen.tsx
import { motion } from "framer-motion";
import { ScreenId } from "@/hooks/useScreenNavigation";
import { staggerContainer, fadeSlideUp } from "@/lib/animations";

interface NewScreenProps {
  onNavigate: (screenId: ScreenId) => void;
}

export function NewScreen({ onNavigate }: NewScreenProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Screen content */}
    </motion.div>
  );
}
```

**Step 2: Add screen metadata to content.ts**

```typescript
// src/data/content.ts
export const screens = [
  { id: "about", title: "About", icon: User },
  { id: "experience", title: "Experience", icon: Briefcase },
  { id: "newscreen", title: "New Screen", icon: Star }, // Add this
  // ...
];
```

**Step 3: Update ScreenId type**

```typescript
// src/hooks/useScreenNavigation.ts
export type ScreenId =
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "newscreen"; // Add this
```

**Step 4: Add route in Index.tsx**

```typescript
// src/pages/Index.tsx
const renderScreen = () => {
  switch (currentScreen) {
    case "about":
      return <AboutScreen onNavigate={navigateToScreen} />;
    case "newscreen":
      return <NewScreen onNavigate={navigateToScreen} />; // Add this
    // ...
  }
};
```

### 5.3 Adding New UI Components from shadcn

The project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. Add new components using the CLI:

**Step 1: Browse available components**

Visit https://ui.shadcn.com/docs/components or run:

```bash
npx shadcn@latest add --help
```

**Step 2: Add a component**

```bash
# Add a single component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add card dialog form

# List all available components
npx shadcn@latest add
```

**Step 3: Component is auto-installed**

The CLI will:
1. Download the component to `src/components/ui/`
2. Install any required dependencies
3. Configure the component with your theme

**Step 4: Use the component**

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a shadcn card component</p>
      </CardContent>
    </Card>
  );
}
```

**Available Components:**

The project already includes 35+ shadcn components. Check `src/components/ui/` for installed components:

```bash
ls src/components/ui/
```

**Customizing Components:**

shadcn components are meant to be customized. Edit them directly in `src/components/ui/`:

```typescript
// src/components/ui/button.tsx
// Modify variants, add new styles, etc.
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground...",
        custom: "bg-purple-500 text-white...", // Add custom variant
      },
    },
  }
);
```

### 5.4 Animation Patterns to Follow

The project uses **Framer Motion** for animations. Follow these established patterns:

**Pattern 1: Stagger Container**

Use for lists or groups of elements that should animate in sequence:

```typescript
import { motion } from "framer-motion";
import { staggerContainer, fadeSlideUp } from "@/lib/animations";

export function ListComponent() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {items.map(item => (
        <motion.div key={item.id} variants={fadeSlideUp}>
          {item.name}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

**Pattern 2: Fade and Slide Up**

Use for individual elements entering the screen:

```typescript
import { motion } from "framer-motion";
import { fadeSlideUp } from "@/lib/animations";

export function Card() {
  return (
    <motion.div
      variants={fadeSlideUp}
      initial="hidden"
      animate="show"
    >
      Card content
    </motion.div>
  );
}
```

**Pattern 3: Custom Animations**

For unique animations, define in `src/lib/animations.ts`:

```typescript
// src/lib/animations.ts
export const slideInFromLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: easeOut }
  }
};

// Use in component
<motion.div variants={slideInFromLeft} initial="hidden" animate="show">
  Content
</motion.div>
```

**Animation Utilities Available:**

From `src/lib/animations.ts`:

- `staggerContainer` - Container that staggers child animations
- `fadeSlideUp` - Fade in while sliding up
- `timelineVariants` - Scale animation for timelines
- `dotVariants` - Spring animation for dots
- `rowVariants` - Fade in for table rows

**Performance Best Practices:**

```typescript
// ✅ Good: Use transform properties (x, y, scale, rotate)
<motion.div animate={{ x: 100, scale: 1.2 }} />

// ✅ Good: Use opacity
<motion.div animate={{ opacity: 1 }} />

// ❌ Avoid: Animating width, height, top, left (causes reflow)
<motion.div animate={{ width: "100%" }} /> // Bad for performance

// ✅ Better: Use scaleX/scaleY instead
<motion.div animate={{ scaleX: 2 }} />
```

**Conditional Animations:**

```typescript
export function Component() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  );
}
```

---

## 6. Styling Guidelines

### 6.1 Tailwind CSS Usage

This project uses **Tailwind CSS** as the primary styling solution. All styling should be done with Tailwind utility classes.

**Basic Usage:**

```typescript
// ✅ Good: Use Tailwind utilities
<div className="flex items-center gap-4 p-6 bg-cream rounded-lg shadow-card">
  <h2 className="text-h2 text-text-primary">Title</h2>
  <p className="text-body text-text-secondary">Description</p>
</div>

// ❌ Avoid: Inline styles
<div style={{ display: "flex", padding: "24px" }}>  // Bad
  Content
</div>
```

**Responsive Design:**

```typescript
// Mobile-first approach
<div className="
  w-full                    // Base (mobile)
  md:w-1/2                  // Medium screens and up
  lg:w-1/3                  // Large screens and up
  xl:w-1/4                  // Extra large screens
">
  Responsive content
</div>

// Common breakpoints:
// sm:  640px  (tablet)
// md:  768px  (small laptop)
// lg:  1024px (desktop)
// xl:  1280px (large desktop)
// 2xl: 1536px (extra large)
```

**Conditional Classes:**

```typescript
import { cn } from "@/lib/utils";

// ✅ Good: Use cn() utility for conditional classes
<button className={cn(
  "px-4 py-2 rounded-lg",
  isActive && "bg-primary text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  Button
</button>

// ❌ Avoid: String concatenation
<button className={
  "px-4 py-2 " + (isActive ? "bg-primary" : "bg-secondary")
}>
  Button
</button>
```

### 6.2 Custom CSS - When to Use

Use custom CSS **only** when Tailwind utilities are insufficient:

**Use Case 1: Complex animations**

```css
/* src/index.css */
@keyframes complexAnimation {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateX(100px) rotate(180deg);
    opacity: 0.5;
  }
}

.complex-animation {
  animation: complexAnimation 2s ease-in-out infinite;
}
```

**Use Case 2: Global styles**

```css
/* src/index.css */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

**Use Case 3: Component-specific classes (rare)**

```css
/* src/index.css */
@layer components {
  .terminal-overlay {
    @apply absolute bottom-0 left-0 right-0 bg-black/80 p-4;
    backdrop-filter: blur(8px);
    font-family: 'IBM Plex Mono', monospace;
  }
}
```

### 6.3 Responsive Design Patterns

**Pattern 1: Mobile-First Layout**

```typescript
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col lg:flex-row gap-6">
  <div className="flex-1">Left content</div>
  <div className="flex-1">Right content</div>
</div>
```

**Pattern 2: Conditional Rendering**

```typescript
import { useMobile } from "@/hooks/use-mobile";

export function ResponsiveComponent() {
  const isMobile = useMobile();

  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

**Pattern 3: Responsive Typography**

```typescript
// Smaller text on mobile, larger on desktop
<h1 className="text-display-mobile lg:text-display">
  Hero Heading
</h1>

<p className="text-small lg:text-body">
  Body text
</p>
```

**Pattern 4: Hidden Elements**

```typescript
// Hide on mobile, show on desktop
<div className="hidden lg:block">
  Desktop only content
</div>

// Show on mobile, hide on desktop
<div className="block lg:hidden">
  Mobile only content
</div>
```

### 6.4 Theming and Color Usage

**Color System:**

The project uses CSS variables for theming (defined in `src/index.css`):

```typescript
// ✅ Good: Use semantic color classes
<div className="bg-background text-foreground">
  <h1 className="text-text-primary">Title</h1>
  <p className="text-text-secondary">Description</p>
  <span className="text-text-accent">Highlight</span>
</div>

// ✅ Good: Use custom portfolio colors
<div className="bg-cream border border-border-card">
  <span className="text-amber">Accent text</span>
</div>

// ❌ Avoid: Hardcoded colors
<div className="bg-[#f5f0e6]">  // Bad - use bg-cream instead
  Content
</div>
```

**Available Color Tokens:**

| Token | Usage | Example |
|-------|-------|---------|
| `bg-background` | Main background | Page background |
| `bg-cream` | Content panels | Cards, sections |
| `bg-surface` | Card surfaces | Elevated elements |
| `text-text-primary` | Primary text | Headings, important text |
| `text-text-secondary` | Secondary text | Body text, descriptions |
| `text-text-accent` | Accent text | Highlights, links |
| `text-amber` | Amber accent | Special highlights |
| `text-burgundy` | Burgundy accent | Alternative highlights |
| `border-border-card` | Card borders | Subtle dividers |

**Typography Classes:**

Custom font sizes defined in `tailwind.config.ts`:

```typescript
// Display text (large, decorative)
<h1 className="text-display font-display">Large Heading</h1>
<h1 className="text-display-mobile lg:text-display">Responsive</h1>

// Headings
<h1 className="text-h1">Main Heading</h1>
<h2 className="text-h2">Subheading</h2>
<h3 className="text-h3">Section Title</h3>

// Body text
<p className="text-body">Regular paragraph text</p>
<p className="text-small">Smaller text</p>
<p className="text-caption">Caption or label</p>
```

**Font Families:**

```typescript
// Sans-serif (default)
<p className="font-sans">Inter font</p>

// Display (serif)
<h1 className="font-display">Playfair Display font</h1>

// Monospace
<code className="font-mono">IBM Plex Mono font</code>
```

**Shadows:**

```typescript
// Predefined shadows from tailwind.config.ts
<div className="shadow-card">Card shadow</div>
<div className="shadow-card-hover">Hover shadow</div>
<div className="shadow-window">Window shadow (larger)</div>
```

**Custom Properties in Components:**

```typescript
// Access CSS variables directly when needed
<div style={{
  backgroundColor: "hsl(var(--accent-primary))",
  borderColor: "hsl(var(--border-card))"
}}>
  Custom styled element
</div>
```

---

## 7. Testing Guidelines

### 7.1 Testing Strategy

Currently, the project focuses on **manual testing** and **code quality checks**. Future testing may include:

- **Unit Testing**: Test individual functions and utilities
- **Component Testing**: Test React components in isolation
- **Integration Testing**: Test component interactions
- **E2E Testing**: Test user workflows

**Current Testing Approach:**

1. **ESLint**: Code quality and style checking
2. **TypeScript**: Type checking and compile-time errors
3. **Manual Testing**: Browser-based testing during development
4. **Build Verification**: Ensuring production builds succeed

### 7.2 Unit Testing Approach

While unit tests are not yet implemented, here's the recommended approach:

**Tools to Use:**
- **Vitest**: Fast unit test framework (Vite-native)
- **Testing Library**: React component testing

**Example Unit Test Structure:**

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'active')).toBe('base active');
    expect(cn('base', false && 'active')).toBe('base');
  });
});
```

### 7.3 Component Testing

**Recommended Approach:**

```typescript
// src/components/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    const { container } = render(
      <Button variant="secondary">Secondary</Button>
    );
    expect(container.firstChild).toHaveClass('bg-secondary');
  });
});
```

### 7.4 Integration Testing

**Testing Screen Navigation:**

```typescript
// src/pages/__tests__/Index.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Index } from '../Index';

describe('Index page integration', () => {
  it('navigates between screens', () => {
    render(<Index />);

    // Initially shows About screen
    expect(screen.getByText(/Architecting/i)).toBeInTheDocument();

    // Click Experience in taskbar
    fireEvent.click(screen.getByText(/Experience/i));

    // Should show Experience screen
    expect(screen.getByText(/Senior DevOps Engineer/i)).toBeInTheDocument();
  });
});
```

**Current Manual Testing Checklist:**

- [ ] All screens render correctly
- [ ] Navigation works between screens
- [ ] Animations are smooth
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors or warnings
- [ ] Boot sequence plays correctly
- [ ] Taskbar updates active state
- [ ] Window container displays properly

---

## 8. Build and Deployment

### 8.1 Build Process

**Development Build:**

```bash
npm run build:dev
```

**Production Build:**

```bash
npm run build
```

**What Happens During Build:**

1. **TypeScript Compilation**: All `.ts` and `.tsx` files compiled to JavaScript
2. **Module Bundling**: Vite bundles all modules into optimized chunks
3. **CSS Processing**:
   - Tailwind processes utility classes
   - Unused CSS is purged
   - CSS is minified
4. **Asset Optimization**:
   - Images optimized and copied to `dist/`
   - SVGs inlined when beneficial
5. **Code Splitting**: Creates separate chunks for lazy-loaded routes
6. **Minification**: JavaScript minified with Terser
7. **Source Maps**: Generated for debugging (optional)

**Build Output:**

```
dist/
├── index.html              # Entry HTML file
├── assets/
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── index-[hash].css   # Compiled CSS
│   └── [asset]-[hash].ext # Images, fonts, etc.
└── vite.svg               # Static assets
```

### 8.2 Production Optimization

**Automatic Optimizations:**

Vite automatically applies these optimizations in production mode:

1. **Tree Shaking**: Removes unused code
2. **Code Minification**: Reduces file sizes
3. **Asset Hashing**: Cache-busting with content hashes
4. **Lazy Loading**: Code splitting for routes
5. **CSS Purging**: Removes unused Tailwind classes
6. **Compression**: Gzip/Brotli compatible

**Manual Optimizations:**

**1. Lazy Load Components:**

```typescript
// ✅ Good: Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**2. Optimize Images:**

```typescript
// ✅ Use appropriate image formats
// - WebP for photos (better compression)
// - SVG for icons (scalable)
// - PNG for images with transparency

// ✅ Specify image dimensions
<img
  src="/hero.jpg"
  width={800}
  height={600}
  alt="Hero image"
  loading="lazy"  // Native lazy loading
/>
```

**3. Minimize Bundle Size:**

```bash
# Analyze bundle size
npm run build -- --mode production

# Check build output
ls -lh dist/assets/

# Use Vite's bundle visualizer (install first)
npm install -D rollup-plugin-visualizer
```

### 8.3 Environment Variables

**Creating Environment Files:**

```bash
# Development
.env.development

# Production
.env.production

# Local overrides (gitignored)
.env.local
```

**Example `.env` file:**

```bash
# .env.production
VITE_API_URL=https://api.production.com
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
VITE_ENVIRONMENT=production
```

**Usage in Code:**

```typescript
// ✅ Access environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// ✅ Type-safe environment variables
// Create vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Important Notes:**

- Prefix all custom env vars with `VITE_` to expose them to client
- Never commit `.env.local` or secrets to git
- Environment variables are embedded at build time

### 8.4 Deployment Checklist

Before deploying to production:

- [ ] **Code Quality**
  - [ ] Run `npm run lint` - no errors
  - [ ] All TypeScript errors resolved
  - [ ] Code reviewed and approved

- [ ] **Testing**
  - [ ] Manual testing completed
  - [ ] All features work as expected
  - [ ] Tested on multiple browsers
  - [ ] Responsive design verified

- [ ] **Build**
  - [ ] `npm run build` completes successfully
  - [ ] No build warnings or errors
  - [ ] Bundle size is reasonable
  - [ ] `npm run preview` works correctly

- [ ] **Configuration**
  - [ ] Environment variables configured
  - [ ] API endpoints point to production
  - [ ] Analytics configured (if applicable)

- [ ] **Assets**
  - [ ] Images optimized
  - [ ] Fonts loaded correctly
  - [ ] Favicons present

- [ ] **SEO & Meta**
  - [ ] Page titles set
  - [ ] Meta descriptions added
  - [ ] Open Graph tags configured

- [ ] **Performance**
  - [ ] Lighthouse score > 90
  - [ ] Core Web Vitals pass
  - [ ] No console errors in production

**Deployment Platforms:**

The built `dist/` folder can be deployed to:

- **Vercel**: `vercel deploy --prod`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **AWS S3**: Upload `dist/` contents to S3 bucket
- **Cloudflare Pages**: Connect git repository

---

## 9. Troubleshooting Common Issues

### 9.1 Development Server Issues

**Issue: Port 8080 already in use**

```bash
# Error: Port 8080 is already in use

# Solution 1: Kill the process using the port
# On macOS/Linux:
lsof -ti:8080 | xargs kill -9

# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Solution 2: Use a different port
# Edit vite.config.ts
server: {
  port: 3000,  // Change to different port
}
```

**Issue: Module not found errors**

```bash
# Error: Cannot find module '@/components/ui/button'

# Solution 1: Restart dev server
# Stop server (Ctrl+C) and restart
npm run dev

# Solution 2: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Solution 3: Check path aliases in tsconfig.json
# Ensure this is present:
"paths": {
  "@/*": ["./src/*"]
}
```

**Issue: Hot reload not working**

```bash
# Changes not reflecting automatically

# Solution 1: Check file is saved (common mistake!)

# Solution 2: Restart dev server
# Stop and restart npm run dev

# Solution 3: Clear browser cache
# Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)

# Solution 4: Check for syntax errors
# Look in terminal for error messages
```

### 9.2 Build Issues

**Issue: Build fails with TypeScript errors**

```bash
# Error: Type 'string | undefined' is not assignable to type 'string'

# Solution: Fix TypeScript errors
# Check terminal output for specific file and line number
# Add proper type guards or optional chaining

# Example fix:
// ❌ Error
const name: string = user.name;  // user.name might be undefined

// ✅ Fixed
const name: string = user.name ?? "Unknown";
const name: string | undefined = user.name;
```

**Issue: Build succeeds but app doesn't work**

```bash
# App builds but shows blank screen or errors

# Solution 1: Check browser console for errors
# Open DevTools → Console

# Solution 2: Check network tab for 404s
# Missing assets or incorrect base URL

# Solution 3: Set correct base path in vite.config.ts
export default defineConfig({
  base: '/myres-site/',  // For GitHub Pages subdirectory
})

# Solution 4: Check environment variables
# Ensure VITE_ prefix is used
# Rebuild after changing .env files
```

**Issue: Bundle size too large**

```bash
# Warning: Large bundle size affecting performance

# Solution 1: Analyze bundle
npm run build
# Check dist/assets/ folder sizes

# Solution 2: Lazy load heavy components
import { lazy } from 'react';
const HeavyComponent = lazy(() => import('./HeavyComponent'));

# Solution 3: Check for duplicate dependencies
npm ls <package-name>

# Solution 4: Remove unused dependencies
npm uninstall <unused-package>
```

### 9.3 Styling Issues

**Issue: Tailwind classes not working**

```tsx
// Classes not applying styles

// Solution 1: Check class name spelling
<div className="flex items-center">  ✅
<div className="flex item-center">   ❌ (typo)

// Solution 2: Ensure Tailwind CSS is imported
// Check src/main.tsx or src/index.css includes:
import './index.css'

// Solution 3: Check Tailwind config content paths
// In tailwind.config.ts:
content: [
  "./src/**/*.{ts,tsx}",  // Should match your file paths
]

// Solution 4: Restart dev server
// Sometimes Tailwind needs restart to pick up new classes
```

**Issue: Custom CSS variables not working**

```css
/* Colors showing as fallback values */

/* Solution: Check CSS variable definition in index.css */
:root {
  --background: 240 28% 14%;  /* Should be HSL format without hsl() */
}

/* Use in Tailwind: */
.bg-background  /* Automatically applies hsl(var(--background)) */

/* Use in custom CSS: */
background-color: hsl(var(--background));
```

**Issue: Responsive classes not working**

```tsx
// Mobile styles applying on desktop

// Solution 1: Use correct breakpoint syntax
<div className="w-full md:w-1/2">  ✅
<div className="w-full md-w-1/2">  ❌ (missing colon)

// Solution 2: Understand mobile-first approach
// Base class = mobile, prefixed classes = larger screens
<div className="text-sm lg:text-lg">  ✅
// Small text on mobile, large on desktop

// Solution 3: Check browser width
// md: starts at 768px
// lg: starts at 1024px
// Resize browser to test
```

### 9.4 Animation Issues

**Issue: Framer Motion animations stuttering**

```typescript
// Animations not smooth

// Solution 1: Use transform properties
// ✅ Good (hardware accelerated)
<motion.div animate={{ x: 100, y: 50, scale: 1.2 }} />

// ❌ Bad (causes reflow)
<motion.div animate={{ width: "100%", top: "50px" }} />

// Solution 2: Add will-change CSS (sparingly)
<motion.div className="will-change-transform" />

// Solution 3: Reduce stagger delay
const staggerContainer = {
  show: {
    transition: {
      staggerChildren: 0.05,  // Reduced from 0.1
    }
  }
};
```

**Issue: Animations not triggering**

```typescript
// Animation doesn't play

// Solution 1: Check initial and animate props
<motion.div
  initial="hidden"   // Must match variant key
  animate="show"     // Must match variant key
  variants={fadeSlideUp}
>

// Solution 2: Ensure variants are defined
// Check that fadeSlideUp is imported from @/lib/animations

// Solution 3: Check parent-child relationship
// Child variants only work inside parent with variants
```

### 9.5 Dependency Issues

**Issue: npm install fails**

```bash
# Installation errors

# Solution 1: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Solution 2: Use correct Node version
node --version  # Check version
nvm use 20      # Switch to Node 20

# Solution 3: Check disk space
df -h

# Solution 4: Try with --legacy-peer-deps
npm install --legacy-peer-deps
```

**Issue: Version conflicts**

```bash
# Peer dependency warnings

# Solution 1: Check for incompatible versions
npm ls <package-name>

# Solution 2: Update dependencies
npm update

# Solution 3: Install specific compatible version
npm install <package>@<version>
```

### 9.6 Performance Issues

**Issue: Slow development server**

```bash
# Dev server taking long to start or reload

# Solution 1: Clear Vite cache
rm -rf node_modules/.vite

# Solution 2: Optimize dependencies
# Add to vite.config.ts:
optimizeDeps: {
  include: ['react', 'react-dom', 'framer-motion'],
}

# Solution 3: Reduce file watching
# Exclude unnecessary directories
```

**Issue: Slow production build**

```bash
# Build taking too long

# Solution 1: Disable source maps (in production)
# Add to vite.config.ts:
build: {
  sourcemap: false,
}

# Solution 2: Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Solution 3: Use faster machine or CI/CD
```

---

## 10. Contributing Guidelines

### 10.1 How to Contribute

We welcome contributions! Here's how to get started:

**Step 1: Fork the repository**

1. Go to the repository on GitHub
2. Click "Fork" button in the top-right
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/myres-site.git
cd myres-site
```

**Step 2: Set up development environment**

```bash
# Install dependencies
npm install

# Create a new branch
git checkout -b feature/your-feature-name

# Start dev server
npm run dev
```

**Step 3: Make your changes**

- Follow the [Coding Standards](#4-coding-standards)
- Write clear, self-documenting code
- Add comments for complex logic
- Test your changes thoroughly

**Step 4: Commit your changes**

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add contact form with validation"

# Push to your fork
git push origin feature/your-feature-name
```

**Step 5: Create a pull request**

1. Go to the original repository
2. Click "Pull Requests" → "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template
5. Submit for review

### 10.2 Pull Request Process

**PR Title Format:**

```
<type>: <short description>

Examples:
feat: add contact form component
fix: resolve navigation bug on mobile
docs: update development guide
refactor: improve animation performance
```

**PR Description Template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List specific changes
- Include component/file names
- Mention any new dependencies

## Screenshots (if applicable)
Add screenshots or GIFs for UI changes

## Testing Done
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested on different browsers
- [ ] No console errors
- [ ] Build succeeds

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] No new warnings
- [ ] Documentation updated (if needed)
```

**Review Process:**

1. **Automated Checks**: ESLint and build checks run automatically
2. **Code Review**: Maintainer reviews code quality and design
3. **Testing**: Reviewer tests functionality
4. **Feedback**: Address any requested changes
5. **Approval**: Once approved, PR is merged

**After PR is Merged:**

```bash
# Switch back to main branch
git checkout main

# Pull latest changes
git pull origin main

# Delete feature branch
git branch -d feature/your-feature-name
```

### 10.3 Code of Conduct

**Our Pledge:**

We are committed to providing a welcoming and inspiring community for all.

**Expected Behavior:**

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them learn
- ✅ Give and accept constructive feedback gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

**Unacceptable Behavior:**

- ❌ Harassment, trolling, or insulting comments
- ❌ Personal or political attacks
- ❌ Publishing others' private information
- ❌ Inappropriate sexual content or attention
- ❌ Other unprofessional conduct

**Reporting:**

If you experience or witness unacceptable behavior, please contact the project maintainers.

**Enforcement:**

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

### 10.4 Development Best Practices

**Before Starting:**

- [ ] Check existing issues to avoid duplicate work
- [ ] Comment on issue to express interest
- [ ] Ask questions if requirements unclear
- [ ] Create issue if one doesn't exist

**While Developing:**

- [ ] Keep changes focused and small
- [ ] Write descriptive commit messages
- [ ] Test thoroughly on multiple devices
- [ ] Follow coding standards
- [ ] Update documentation if needed

**Before Submitting:**

- [ ] Run `npm run lint` and fix errors
- [ ] Run `npm run build` successfully
- [ ] Test in production mode (`npm run preview`)
- [ ] Review your own code
- [ ] Update relevant documentation
- [ ] Add screenshots for UI changes

**Communication:**

- Ask questions in issues or discussions
- Be patient waiting for reviews
- Be open to feedback and suggestions
- Help others when you can

### 10.5 Getting Help

**Resources:**

- **Documentation**: Check `docs/` folder for detailed guides
  - [OVERVIEW.md](./OVERVIEW.md) - Project overview
  - [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
  - [COMPONENTS.md](./COMPONENTS.md) - Component documentation
  - [UI-PATTERNS.md](./UI-PATTERNS.md) - UI patterns and practices
- **Issues**: Search existing issues for similar problems
- **Discussions**: Ask questions in GitHub Discussions
- **Code**: Read existing code for examples

**Common Questions:**

**Q: I'm new to React/TypeScript. Can I still contribute?**

A: Absolutely! Start with small issues labeled "good first issue" or "documentation". The codebase is a great learning resource.

**Q: How do I add a new shadcn component?**

A: Run `npx shadcn@latest add <component-name>`. See [Section 5.3](#53-adding-new-ui-components-from-shadcn).

**Q: Can I refactor existing code?**

A: Yes, but create an issue first to discuss the changes. Ensure refactors don't break functionality.

**Q: How do I test my changes?**

A: Run `npm run dev` and test manually in the browser. Check responsive design and different browsers.

**Q: What if my PR conflicts with main?**

A: Rebase your branch:
```bash
git fetch origin
git rebase origin/main
# Resolve conflicts
git push --force-with-lease
```

---

## Related Documentation

- [OVERVIEW.md](./OVERVIEW.md) - High-level project overview and quick start
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system architecture and design patterns
- [COMPONENTS.md](./COMPONENTS.md) - Complete component API documentation
- [UI-PATTERNS.md](./UI-PATTERNS.md) - shadcn/ui usage patterns and best practices
- [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) - State management and navigation patterns
- [DATA-MODELS.md](./DATA-MODELS.md) - Data structures and type definitions

---

**Ready to contribute?**

Fork the repository, make your changes, and submit a pull request. We're excited to see what you build!

For questions or support, open an issue on GitHub or reach out to the maintainers.

Happy coding! 🚀
