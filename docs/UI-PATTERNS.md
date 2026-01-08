# UI Patterns & Styling Guide

> **Framework**: shadcn/ui + Tailwind CSS
> **Base Color**: Slate
> **CSS Variables**: Enabled
> **Generated**: 2026-01-08
> **Source**: `/home/parth/ws/myres-site`

---

## Table of Contents

1. [shadcn/ui Overview](#shadcnui-overview)
2. [Configuration](#configuration)
3. [The cn() Utility Function](#the-cn-utility-function)
4. [Component Customization Patterns](#component-customization-patterns)
5. [Styling Patterns with Tailwind CSS](#styling-patterns-with-tailwind-css)
6. [Common UI Patterns](#common-ui-patterns)
7. [Creating New UI Components](#creating-new-ui-components)
8. [Theme Customization](#theme-customization)
9. [Variant Patterns with CVA](#variant-patterns-with-cva)
10. [Accessibility Features](#accessibility-features)

---

## shadcn/ui Overview

### Philosophy

shadcn/ui is not a traditional component library installed via npm. Instead, it's a collection of re-usable components that you **copy and paste** into your project. This approach provides several benefits:

- **Full Ownership**: You own the code and can modify it as needed
- **No Version Lock**: No dependency on package versions
- **Customization Freedom**: Complete control over component styling and behavior
- **Zero Runtime Overhead**: Components are copied, not imported from a package
- **Type Safety**: Full TypeScript support with proper type inference

### Core Principles

1. **Composition Over Configuration**: Components are composed from smaller primitives
2. **Accessibility First**: Built on Radix UI primitives with ARIA attributes
3. **CSS Variables**: Uses CSS custom properties for theming
4. **Utility-First Styling**: Leverages Tailwind CSS for styling
5. **Unstyled Primitives**: Start with accessible, unstyled components from Radix UI

### Architecture

```
shadcn/ui Component = Radix UI Primitive + Tailwind CSS + cn() utility
```

**Example Flow**:
1. Radix UI provides the accessible, headless component
2. Tailwind CSS classes define the visual appearance
3. cn() utility merges and deduplicates class names
4. CSS variables enable theme customization

---

## Configuration

### components.json

The `components.json` file at the project root defines how shadcn/ui components are generated and imported:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Configuration Breakdown

| Property | Value | Purpose |
|----------|-------|---------|
| `style` | `"default"` | Uses the default shadcn/ui design style |
| `rsc` | `false` | Not using React Server Components |
| `tsx` | `true` | Components use TypeScript (.tsx files) |
| `baseColor` | `"slate"` | Base color palette for default theme |
| `cssVariables` | `true` | Enable CSS custom properties for theming |
| `prefix` | `""` | No prefix for Tailwind utility classes |

### Path Aliases

The `aliases` configuration enables clean imports throughout the project:

```typescript
// Instead of:
import { Button } from "../../../components/ui/button"
import { cn } from "../../../lib/utils"

// Use:
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

**Vite Configuration** (`vite.config.ts`):
```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

---

## The cn() Utility Function

### Implementation

Located in `/home/parth/ws/myres-site/src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### What It Does

The `cn()` function is the **most important utility** in the shadcn/ui ecosystem. It combines two powerful libraries:

1. **clsx**: Constructs className strings conditionally
2. **tailwind-merge**: Intelligently merges Tailwind CSS classes

### Why It's Essential

**Problem**: Tailwind class conflicts when overriding styles:
```typescript
// Without cn() - both classes apply, causing conflicts
<div className="text-red-500 text-blue-500"> // Which color wins? 🤔
```

**Solution**: `cn()` merges classes intelligently:
```typescript
// With cn() - later class overrides earlier one
cn("text-red-500", "text-blue-500") // Returns: "text-blue-500" ✅
```

### Usage Patterns

#### 1. Basic Class Merging
```typescript
cn("px-4 py-2", "bg-primary text-white")
// Returns: "px-4 py-2 bg-primary text-white"
```

#### 2. Conditional Classes
```typescript
cn("base-class", {
  "active-class": isActive,
  "disabled-class": isDisabled
})
```

#### 3. Component Prop Overrides
```typescript
function Button({ className, ...props }) {
  return (
    <button
      className={cn("px-4 py-2 bg-primary", className)}
      {...props}
    />
  )
}

// Usage:
<Button className="bg-secondary" /> // bg-secondary overrides bg-primary
```

#### 4. Array Support
```typescript
cn([
  "base-class",
  isActive && "active-class",
  isDisabled && "disabled-class"
])
```

### Real-World Example

From `/home/parth/ws/myres-site/src/components/ui/button.tsx`:

```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Key Benefits**:
- Base styles from `buttonVariants` are applied first
- Custom `className` prop can override any style
- No class duplication or conflicts
- Conditional classes work seamlessly

---

## Component Customization Patterns

### Pattern 1: Extending shadcn/ui Components

#### Base Component Pattern

All shadcn/ui components follow this structure:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, ...props }, ref) => (
    <element
      ref={ref}
      className={cn("base-styles", className)}
      {...props}
    />
  )
)
Component.displayName = "Component"

export { Component }
```

#### Customization Example: Card Component

From `/home/parth/ws/myres-site/src/components/ui/card.tsx`:

```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
```

**Usage with Custom Styles**:
```typescript
// Default card
<Card>Content</Card>

// Custom card with additional styling
<Card className="border-2 border-amber shadow-lg">
  Content
</Card>

// Card with conditional styling
<Card className={cn(
  "hover:shadow-xl transition-shadow",
  isActive && "border-primary"
)}>
  Content
</Card>
```

### Pattern 2: Compound Components

shadcn/ui uses compound component patterns for complex UI elements:

#### Card Compound Components

```typescript
// All parts of the card exported separately
export {
  Card,           // Container
  CardHeader,     // Header section
  CardFooter,     // Footer section
  CardTitle,      // Title element
  CardDescription,// Description element
  CardContent     // Main content area
}
```

**Usage**:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Pattern 3: Composition with Radix UI

Components wrap Radix UI primitives and expose their API:

```typescript
import * as DialogPrimitive from "@radix-ui/react-dialog"

// Re-export primitives
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

// Styled components
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg...",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4...">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))

export { Dialog, DialogTrigger, DialogContent, DialogClose, ... }
```

### Pattern 4: The asChild Pattern

The `asChild` prop (from Radix UI's Slot) allows rendering a component as a different element:

```typescript
import { Slot } from "@radix-ui/react-slot"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

**Usage**:
```typescript
// Regular button
<Button>Click me</Button>

// Button as a Link
<Button asChild>
  <Link to="/about">About</Link>
</Button>

// Button as an anchor
<Button asChild>
  <a href="https://example.com">Visit</a>
</Button>
```

---

## Styling Patterns with Tailwind CSS

### CSS Variable-Based Theming

The project uses CSS custom properties mapped to Tailwind utilities for consistent theming.

#### Color System Architecture

```
CSS Variable → Tailwind Config → Utility Class
--primary → hsl(var(--primary)) → bg-primary
```

### Tailwind Configuration

From `/home/parth/ws/myres-site/tailwind.config.ts`:

```typescript
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // shadcn/ui semantic tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        // Custom portfolio colors
        cream: "hsl(var(--background-secondary))",
        surface: "hsl(var(--surface))",
        amber: "hsl(var(--accent-primary))",
        burgundy: "hsl(var(--accent-secondary))",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

### CSS Variable Definitions

From `/home/parth/ws/myres-site/src/index.css`:

```css
@layer base {
  :root {
    /* shadcn/ui Tokens */
    --background: 240 28% 14%;
    --foreground: 240 14% 20%;
    --primary: 30 50% 64%;
    --primary-foreground: 240 14% 20%;
    --secondary: 40 33% 93%;
    --secondary-foreground: 240 14% 20%;
    --muted: 40 20% 86%;
    --muted-foreground: 240 8% 38%;
    --accent: 345 34% 41%;
    --accent-foreground: 40 17% 90%;
    --border: 40 20% 86%;
    --input: 40 20% 86%;
    --ring: 30 50% 64%;

    /* Custom Variables */
    --accent-primary: 30 50% 64%;
    --accent-secondary: 345 34% 41%;
    --radius: 0.5rem;
  }
}
```

### Usage Patterns

#### 1. Semantic Color Usage
```typescript
// Use semantic tokens for consistency
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

#### 2. Custom Color Extensions
```typescript
// Project-specific colors defined in Tailwind config
<div className="bg-cream border-amber">
  <span className="text-burgundy">Accent text</span>
</div>
```

#### 3. Dynamic Theming
```typescript
// Colors automatically adapt to theme
<div className="bg-card text-card-foreground">
  Theme-aware content
</div>
```

### Typography System

```typescript
fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  display: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
  mono: ['IBM Plex Mono', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
},

fontSize: {
  'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  'display-mobile': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
  'h1-mobile': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
  'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
  'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
  'body': ['1rem', { lineHeight: '1.6' }],
  'small': ['0.875rem', { lineHeight: '1.5' }],
  'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
}
```

**Usage**:
```typescript
<h1 className="font-display text-display text-primary">
  Hero Title
</h1>
<p className="font-sans text-body text-muted-foreground">
  Body text with proper line height
</p>
```

### Animation System

#### Keyframes Definition
```typescript
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
  "fade-in": {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  "slide-up": {
    from: { opacity: "0", transform: "translateY(12px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
}
```

#### Animation Utilities
```typescript
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "fade-in": "fade-in 0.3s ease-out forwards",
  "slide-up": "slide-up 0.3s ease-out forwards",
}
```

**Usage**:
```typescript
<div className="animate-fade-in">
  Fades in on mount
</div>
<div className="animate-slide-up animation-delay-100">
  Slides up after delay
</div>
```

---

## Common UI Patterns

### Pattern 1: Custom Component Classes

The project defines reusable component classes in the `@layer components` section:

#### Window Components
```css
.window-title-bar {
  @apply h-12 px-5 flex items-center justify-between;
  background: linear-gradient(90deg, hsl(345 28% 52%) 0%, hsl(345 34% 41%) 100%);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.window-content {
  @apply p-10 overflow-y-auto;
  background: hsl(var(--background-secondary));
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}
```

**Usage**:
```typescript
<div className="window-container">
  <div className="window-title-bar">
    <span className="window-title-text">About Me</span>
    <div className="flex gap-2">
      <div className="window-control-dot window-control-dot-amber" />
      <div className="window-control-dot window-control-dot-gold" />
    </div>
  </div>
  <div className="window-content">
    {/* Content */}
  </div>
</div>
```

#### Card Variants
```css
.content-card {
  @apply relative bg-white rounded-lg p-6;
  border: 1px solid hsl(var(--border-card));
  box-shadow: var(--shadow-md);
}

.content-card-accent {
  @apply content-card;
  border-left: 4px solid hsl(var(--timeline-dot));
}

.project-card {
  @apply bg-white rounded-lg overflow-hidden;
  border: 1px solid hsl(var(--border-card));
  box-shadow: var(--shadow-md);
  transition: all var(--duration-moderate) var(--ease-out);
}

.project-card:hover {
  box-shadow: var(--shadow-lg);
  border-color: hsl(var(--accent-primary));
}
```

#### Tag/Badge Components
```css
.skill-tag {
  @apply inline-flex items-center gap-2 px-3 py-2 bg-white rounded text-sm;
  border: 1px solid hsl(var(--border-card));
  color: hsl(var(--text-secondary));
  transition: background var(--duration-normal) var(--ease-out);
}

.tech-tag {
  @apply inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium;
  background: hsl(var(--background-secondary));
  border: 1px solid hsl(var(--border-card));
  color: hsl(var(--text-secondary));
}
```

### Pattern 2: Button Styles

#### Custom Button Classes
```css
.btn-primary {
  @apply inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-semibold;
  background: hsl(var(--accent-primary));
  color: hsl(var(--text-primary));
  box-shadow: 0 2px 4px hsl(0 0% 0% / 0.1);
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-primary:hover {
  filter: brightness(0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px hsl(0 0% 0% / 0.15);
}

.btn-primary:active {
  transform: scale(0.97);
}
```

**Combining with shadcn/ui Button**:
```typescript
import { Button } from "@/components/ui/button"

// Use shadcn/ui variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Or use custom classes
<button className="btn-primary">Custom Primary</button>
<button className="btn-secondary">Custom Secondary</button>
```

### Pattern 3: Responsive Design

#### Mobile-First Approach
```typescript
// Base styles apply to mobile
<div className="px-4 py-6 md:px-8 md:py-12 lg:px-16">
  <h1 className="text-h1-mobile md:text-h1">
    Responsive Title
  </h1>
</div>
```

#### Conditional Rendering with Hooks
```typescript
import { useIsMobile } from "@/hooks/use-mobile"

function ResponsiveComponent() {
  const isMobile = useIsMobile()

  return (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : "grid-cols-3"
    )}>
      {/* Content */}
    </div>
  )
}
```

### Pattern 4: State-Based Styling

#### Data Attributes for State
```typescript
// Radix UI components use data-state attributes
<div className="
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=open]:fade-in-0
  data-[state=closed]:fade-out-0
">
  Animated content
</div>
```

#### Conditional Classes with State
```typescript
function NavButton({ isActive }) {
  return (
    <button className={cn(
      "taskbar-nav-btn",
      isActive && "active"
    )}>
      Navigation
    </button>
  )
}
```

---

## Creating New UI Components

### Step-by-Step Guide

#### 1. Install Component via CLI

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

This copies the component to `/home/parth/ws/myres-site/src/components/ui/`.

#### 2. Component Template

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

// Define props interface
interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary"
  customProp?: string
}

// Create component with forwardRef for ref access
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", customProp, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "rounded-lg border p-4",
          // Variant styles
          variant === "default" && "bg-background",
          variant === "secondary" && "bg-secondary",
          // Allow override
          className
        )}
        {...props}
      />
    )
  }
)

// Set display name for dev tools
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

#### 3. Using CVA for Complex Variants

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const myComponentVariants = cva(
  // Base styles applied to all variants
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    // Define variant options
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-lg",
      },
    },
    // Default values
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {
  asChild?: boolean
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

export { MyComponent, myComponentVariants }
```

#### 4. Wrapping Radix UI Primitives

```typescript
import * as React from "react"
import * as PrimitiveName from "@radix-ui/react-primitive-name"
import { cn } from "@/lib/utils"

// Re-export Root and other unstyled parts
const MyComponent = PrimitiveName.Root
const MyComponentTrigger = PrimitiveName.Trigger

// Style specific parts
const MyComponentContent = React.forwardRef<
  React.ElementRef<typeof PrimitiveName.Content>,
  React.ComponentPropsWithoutRef<typeof PrimitiveName.Content>
>(({ className, ...props }, ref) => (
  <PrimitiveName.Content
    ref={ref}
    className={cn(
      "rounded-lg border bg-popover p-4 shadow-md",
      className
    )}
    {...props}
  />
))
MyComponentContent.displayName = PrimitiveName.Content.displayName

export {
  MyComponent,
  MyComponentTrigger,
  MyComponentContent
}
```

### Best Practices

1. **Always use forwardRef**: Enables ref forwarding for parent access
2. **Include cn() utility**: Allow className overrides
3. **Set displayName**: Improves debugging in React DevTools
4. **Spread remaining props**: Use `{...props}` for flexibility
5. **Type everything**: Proper TypeScript types for props
6. **Export variants**: Export CVA variant functions for reuse

---

## Theme Customization

### Dark Mode Implementation

The project uses `class`-based dark mode with next-themes:

#### Configuration
```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  // ...
}
```

#### Theme Provider Setup
```typescript
import { ThemeProvider } from "next-themes"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Your app */}
    </ThemeProvider>
  )
}
```

#### Dark Mode CSS Variables
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... light mode colors */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode colors */
  }
}
```

#### Usage in Components
```typescript
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  )
}
```

### Custom Color Scheme

The project implements a retro-tech fusion aesthetic:

#### Color Palette
```css
:root {
  /* Primary Palette */
  --background: 240 28% 14%;           /* Deep charcoal */
  --background-secondary: 40 33% 93%; /* Cream */
  --surface: 45 33% 97%;              /* Card surfaces */

  /* Accent Colors */
  --accent-primary: 30 50% 64%;       /* Muted amber/gold */
  --accent-secondary: 345 34% 41%;    /* Soft burgundy */

  /* Text Colors */
  --text-primary: 240 14% 20%;        /* Primary text */
  --text-secondary: 240 8% 38%;       /* Secondary text */
  --text-light: 40 17% 90%;           /* Light text */
}
```

#### Adding Custom Colors

**Step 1**: Define CSS variable in `src/index.css`
```css
:root {
  --my-custom-color: 200 50% 50%;
}
```

**Step 2**: Add to Tailwind config
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      "my-custom": "hsl(var(--my-custom-color))",
    },
  },
}
```

**Step 3**: Use in components
```typescript
<div className="bg-my-custom text-white">
  Custom colored element
</div>
```

### Border Radius Customization

The project uses CSS variable-based border radius:

```css
:root {
  --radius: 0.5rem;
}
```

```typescript
// tailwind.config.ts
borderRadius: {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
}
```

**Change globally**:
```css
:root {
  --radius: 0.75rem; /* More rounded */
}
```

---

## Variant Patterns with CVA

### What is CVA?

**class-variance-authority** (CVA) is a library for creating variant-based component styles. It provides type-safe variant props with excellent DX.

### Basic CVA Pattern

```typescript
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  "base-classes-for-all-variants",
  {
    variants: {
      variantName: {
        option1: "classes-for-option1",
        option2: "classes-for-option2",
      },
    },
    defaultVariants: {
      variantName: "option1",
    },
  }
)
```

### Real Example: Button Component

From `/home/parth/ws/myres-site/src/components/ui/button.tsx`:

```typescript
const buttonVariants = cva(
  // Base classes applied to ALL buttons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // Visual variant
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Size variant
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // Defaults when props not specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Component Integration

```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Type-Safe Usage

```typescript
// TypeScript knows valid variant values
<Button variant="default" size="lg">Default Large</Button>
<Button variant="destructive" size="sm">Delete Small</Button>
<Button variant="outline">Outline Default Size</Button>
<Button variant="ghost" size="icon"><Icon /></Button>

// Error: Type '"invalid"' is not assignable to type '"default" | "destructive" | ...'
<Button variant="invalid">Error</Button> ❌
```

### Compound Variants

CVA supports compound variants for complex styling:

```typescript
const buttonVariants = cva("base", {
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
    size: {
      sm: "text-sm",
      lg: "text-lg",
    },
  },
  compoundVariants: [
    {
      // Apply these classes when BOTH conditions match
      variant: "primary",
      size: "lg",
      class: "font-bold uppercase",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
})
```

### Advanced Pattern: Badge Component

From `/home/parth/ws/myres-site/src/components/ui/badge.tsx`:

```typescript
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
```

---

## Accessibility Features

### Built-In Accessibility

shadcn/ui components are built on **Radix UI primitives**, which provide:

- Full keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management
- Proper semantic HTML

### Focus Management

#### Focus Rings
All components include focus-visible styles:

```typescript
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

**Example**:
```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input...",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Keyboard Navigation

#### Tab Order
Components maintain proper tab order:

```typescript
// Dialog example
<DialogPrimitive.Content>
  {children}
  <DialogPrimitive.Close
    className="...focus:outline-none focus:ring-2..."
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
</DialogPrimitive.Content>
```

#### Keyboard Shortcuts
```typescript
// Components support standard shortcuts
// - Tab/Shift+Tab: Navigate
// - Enter/Space: Activate
// - Escape: Close dialogs/menus
// - Arrow keys: Navigate lists/menus
```

### Screen Reader Support

#### Screen Reader Only Text
```typescript
<span className="sr-only">Close</span>
```

The `sr-only` class hides content visually but keeps it accessible:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### ARIA Attributes

Radix UI primitives automatically include proper ARIA attributes:

```typescript
// Dialog component includes:
// - aria-describedby
// - aria-labelledby
// - role="dialog"
// - aria-modal="true"

<DialogPrimitive.Title>     // aria-labelledby
  Dialog Title
</DialogPrimitive.Title>
<DialogPrimitive.Description> // aria-describedby
  Dialog description
</DialogPrimitive.Description>
```

### Disabled States

#### Visual and Functional Disabled
```typescript
"disabled:pointer-events-none disabled:opacity-50"
```

**Example**:
```typescript
<Button disabled>
  Disabled Button
</Button>

// Renders with:
// - pointer-events: none (no clicks)
// - opacity: 0.5 (visual indication)
// - disabled attribute (semantic HTML)
```

### Color Contrast

#### WCAG Compliant Colors
The design system uses colors with sufficient contrast:

```css
/* Text on light background */
--text-primary: 240 14% 20%;        /* Dark text */
--background-secondary: 40 33% 93%; /* Light background */
/* Contrast ratio: 12.6:1 (AAA) */

/* Text on dark background */
--text-light: 40 17% 90%;           /* Light text */
--background: 240 28% 14%;          /* Dark background */
/* Contrast ratio: 11.8:1 (AAA) */
```

### Reduced Motion Support

The project respects user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Accessibility Checklist

When creating components:

- [ ] Use semantic HTML elements
- [ ] Include focus-visible styles
- [ ] Add sr-only labels for icon-only buttons
- [ ] Support keyboard navigation
- [ ] Include ARIA attributes when needed
- [ ] Ensure color contrast meets WCAG AA (4.5:1)
- [ ] Respect prefers-reduced-motion
- [ ] Test with screen reader
- [ ] Verify keyboard-only navigation
- [ ] Check disabled states

---

## Cross-References

- **Component Library**: See [COMPONENTS.md](/home/parth/ws/myres-site/docs/COMPONENTS.md) for complete component catalog
- **Architecture**: See [ARCHITECTURE.md](/home/parth/ws/myres-site/docs/ARCHITECTURE.md) for system architecture
- **Project Overview**: See [OVERVIEW.md](/home/parth/ws/myres-site/docs/OVERVIEW.md) for project introduction

---

## Additional Resources

### Official Documentation
- [shadcn/ui](https://ui.shadcn.com/) - Component library documentation
- [Radix UI](https://www.radix-ui.com/) - Primitive components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [CVA](https://cva.style/) - Class Variance Authority

### Key Packages
- `clsx` - Conditional className utility
- `tailwind-merge` - Tailwind class merging
- `class-variance-authority` - Type-safe variants
- `@radix-ui/react-*` - Accessible primitives

### Design Tokens
- Color palette: Slate base with custom amber/burgundy accents
- Typography: Inter (sans), Playfair Display (display), IBM Plex Mono (mono)
- Spacing scale: 4px base unit
- Border radius: 0.5rem default

---

**Last Updated**: 2026-01-08
**Maintained By**: Portfolio Development Team
**Related Files**:
- `/home/parth/ws/myres-site/components.json`
- `/home/parth/ws/myres-site/src/lib/utils.ts`
- `/home/parth/ws/myres-site/tailwind.config.ts`
- `/home/parth/ws/myres-site/src/index.css`
