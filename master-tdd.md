# Technical Design Document: resume-site

**Project:** Personal Resume/Portfolio Website  
**Author:** Parthjeet  
**Version:** 1.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Component Architecture](#5-component-architecture)
6. [State Management](#6-state-management)
7. [Navigation System](#7-navigation-system)
8. [Screen Transitions](#8-screen-transitions)
9. [Content Configuration](#9-content-configuration)
10. [Build Configuration](#10-build-configuration)
11. [Deployment](#11-deployment)
12. [Testing Strategy](#12-testing-strategy)
13. [Development Workflow](#13-development-workflow)

---

## 1. Overview

### 1.1 Purpose

This document provides the technical specification for building a single-page application (SPA) portfolio website. The site uses a single-screen-at-a-time navigation paradigm rather than traditional scrolling.

### 1.2 Goals

- Build a production-ready, deployable portfolio website
- Implement discrete screen navigation with animated transitions
- Support multiple navigation input methods (mouse wheel, keyboard, touch swipe)
- Ensure mobile-first responsive design
- Maintain easily editable content through a centralized configuration

### 1.3 Sections

The website consists of six full-screen sections:

| Section | Purpose |
|---------|---------|
| About | Introduction and personal summary |
| Experience | Professional work history |
| Skills | Technical competencies |
| Projects | Portfolio of work |
| Education | Academic background |
| Contact | LinkedIn, GitHub, Email links |

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   App.jsx                        │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │         Navigation Controller            │    │   │
│  │  │  (useScreenNavigation hook)              │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  │                      │                          │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │           ScreenWrapper                  │    │   │
│  │  │  (handles transition animations)         │    │   │
│  │  │  ┌─────────────────────────────────┐    │    │   │
│  │  │  │      Active Screen Component     │    │    │   │
│  │  │  │  (About/Experience/Skills/etc)   │    │    │   │
│  │  │  └─────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  │                                                  │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │         ScreenIndicator                  │    │   │
│  │  │  (shows current position)                │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ content.js   │────▶│  Section         │────▶│  Rendered       │
│ (static data)│     │  Components      │     │  UI             │
└──────────────┘     └──────────────────┘     └─────────────────┘

┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ User Input   │────▶│ useScreen        │────▶│  State Update   │
│ (wheel/key/  │     │ Navigation       │     │  (currentScreen,│
│  touch)      │     │ hook             │     │   isTransitioning)
└──────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 3. Technology Stack

### 3.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.x | UI library |
| Vite | ^5.x | Build tool and dev server |
| Tailwind CSS | ^3.x | Utility-first CSS framework |

### 3.2 Development Dependencies

| Package | Purpose |
|---------|---------|
| @vitejs/plugin-react | React plugin for Vite |
| autoprefixer | PostCSS plugin for vendor prefixes |
| postcss | CSS transformation tool |
| tailwindcss | Tailwind CSS framework |
| vitest | Unit testing framework |
| @testing-library/react | React component testing utilities |
| @testing-library/jest-dom | Custom Jest matchers |
| jsdom | DOM implementation for testing |
| playwright | End-to-end testing framework |

### 3.3 Runtime Dependencies

| Package | Purpose |
|---------|---------|
| react | Core React library |
| react-dom | React DOM rendering |

---

## 4. Project Structure

```
resume-site/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── screens/
│   │   │   ├── AboutScreen.jsx
│   │   │   ├── ExperienceScreen.jsx
│   │   │   ├── SkillsScreen.jsx
│   │   │   ├── ProjectsScreen.jsx
│   │   │   ├── EducationScreen.jsx
│   │   │   └── ContactScreen.jsx
│   │   ├── ScreenWrapper.jsx
│   │   ├── ScreenIndicator.jsx
│   │   └── Navigation.jsx
│   ├── hooks/
│   │   └── useScreenNavigation.js
│   ├── data/
│   │   └── content.js
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
├── tests/
│   ├── unit/
│   │   ├── useScreenNavigation.test.js
│   │   └── components/
│   │       └── ScreenWrapper.test.jsx
│   └── e2e/
│       ├── navigation.spec.js
│       └── screens.spec.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vitest.config.js
├── playwright.config.js
└── README.md
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
App
├── Navigation (optional persistent nav element)
├── ScreenWrapper
│   └── [Active Screen Component]
│       ├── AboutScreen
│       ├── ExperienceScreen
│       ├── SkillsScreen
│       ├── ProjectsScreen
│       ├── EducationScreen
│       └── ContactScreen
└── ScreenIndicator
```

### 5.2 Component Specifications

#### App.jsx

**Responsibility:** Root component managing screen state and event listeners.

**Props:** None

**State:**
- `currentScreen: number` - Index of currently active screen (0-5)
- `isTransitioning: boolean` - Lock flag during screen transitions
- `transitionDirection: 'forward' | 'backward'` - Direction of transition animation

**Behavior:**
- Initializes the `useScreenNavigation` hook
- Renders the current screen within `ScreenWrapper`
- Passes navigation state to child components

---

#### ScreenWrapper.jsx

**Responsibility:** Handles transition animations between screens.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | ReactNode | Yes | The screen component to render |
| isTransitioning | boolean | Yes | Whether a transition is in progress |
| transitionDirection | string | Yes | 'forward' or 'backward' |
| onTransitionEnd | function | Yes | Callback when transition completes |

**Behavior:**
- Applies CSS classes for entry/exit animations
- Calls `onTransitionEnd` after animation completes
- Prevents interaction during transition

---

#### ScreenIndicator.jsx

**Responsibility:** Visual indicator of current screen position.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| totalScreens | number | Yes | Total number of screens |
| currentScreen | number | Yes | Index of current screen |
| onNavigate | function | Yes | Callback for direct navigation |

**Behavior:**
- Renders position indicators (dots, progress bar, or thematic element)
- Allows direct navigation to specific screens on click
- Updates visual state based on `currentScreen`

---

#### Navigation.jsx (Optional)

**Responsibility:** Persistent navigation element for direct screen access.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| screens | array | Yes | Array of screen metadata |
| currentScreen | number | Yes | Index of current screen |
| onNavigate | function | Yes | Callback for navigation |
| isTransitioning | boolean | Yes | Lock navigation during transitions |

---

#### Screen Components (AboutScreen, ExperienceScreen, etc.)

**Responsibility:** Render content for each section.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | object | Yes | Content data from configuration |
| isActive | boolean | Yes | Whether screen is currently visible |

**Behavior:**
- Render section-specific content
- Trigger within-screen animations when `isActive` becomes true
- Must fill exactly 100vh height

---

## 6. State Management

### 6.1 State Architecture

The application uses React's built-in hooks for state management. No external state management library is required given the application's scope.

### 6.2 State Location

| State | Location | Scope |
|-------|----------|-------|
| currentScreen | App.jsx | Global |
| isTransitioning | App.jsx | Global |
| transitionDirection | App.jsx | Global |
| within-screen UI state | Individual screen components | Local |

### 6.3 State Flow Diagram

```
User Input (wheel/key/swipe)
         │
         ▼
┌─────────────────────────┐
│ useScreenNavigation     │
│ (validates & debounces) │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Check: isTransitioning  │──── true ───▶ Ignore input
└────────────┬────────────┘
             │ false
             ▼
┌─────────────────────────┐
│ Check: boundary         │──── at boundary ───▶ Ignore input
│ (first/last screen)     │
└────────────┬────────────┘
             │ valid
             ▼
┌─────────────────────────┐
│ Set isTransitioning     │
│ = true                  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Update currentScreen    │
│ Set transitionDirection │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ ScreenWrapper animates  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ onTransitionEnd called  │
│ isTransitioning = false │
└─────────────────────────┘
```

---

## 7. Navigation System

### 7.1 Navigation Hook: useScreenNavigation

**Purpose:** Centralized hook for handling all navigation input methods.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| totalScreens | number | required | Total number of screens |
| initialScreen | number | 0 | Starting screen index |
| transitionDuration | number | 500 | Transition duration in ms |
| debounceDelay | number | 50 | Debounce delay for wheel events |
| swipeThreshold | number | 50 | Minimum swipe distance in pixels |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| currentScreen | number | Current screen index |
| isTransitioning | boolean | Transition lock state |
| transitionDirection | string | 'forward' or 'backward' |
| goToScreen | function | Navigate to specific screen |
| goNext | function | Navigate to next screen |
| goPrevious | function | Navigate to previous screen |

### 7.2 Input Methods

#### Mouse Wheel

```
Event: wheel
├── deltaY > 0 (scroll down) → Next screen
└── deltaY < 0 (scroll up) → Previous screen

Debouncing: 50ms minimum between accepted events
```

#### Keyboard

```
Event: keydown
├── ArrowDown → Next screen
├── ArrowUp → Previous screen
├── PageDown → Next screen
├── PageUp → Previous screen
├── Home → First screen
└── End → Last screen
```

#### Touch Swipe

```
Events: touchstart, touchmove, touchend

Detection:
├── Track start Y position on touchstart
├── Calculate delta on touchend
├── deltaY > threshold (50px) → Next screen
└── deltaY < -threshold → Previous screen

Prevention:
├── Horizontal swipes ignored (check deltaX vs deltaY)
└── Small movements ignored (below threshold)
```

### 7.3 Navigation Guards

| Guard | Behavior |
|-------|----------|
| Transition lock | Ignore all input while `isTransitioning === true` |
| Boundary check | Ignore "previous" on first screen, "next" on last screen |
| Debounce | Throttle wheel events to prevent rapid firing |
| Swipe threshold | Require minimum 50px movement for touch navigation |

---

## 8. Screen Transitions

### 8.1 Transition Requirements

| Requirement | Value |
|-------------|-------|
| Duration | 300-600ms (configurable) |
| Direction variants | Forward (next) and backward (previous) |
| Lock behavior | Navigation disabled during transition |
| Completion callback | Required for state cleanup |

### 8.2 Transition States

```
Screen States:
├── entering - Screen animating into view
├── active - Screen fully visible, interactive
├── exiting - Screen animating out of view
└── inactive - Screen not rendered
```

### 8.3 CSS Animation Structure

```css
/* Base transition setup */
.screen {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
}

/* Entry animation (implement specific animation) */
.screen-enter {
  /* Initial state before entering */
}

.screen-enter-active {
  /* Animating to visible state */
  transition: [properties] [duration] [easing];
}

/* Exit animation (implement specific animation) */
.screen-exit {
  /* Starting visible state */
}

.screen-exit-active {
  /* Animating to hidden state */
  transition: [properties] [duration] [easing];
}
```

### 8.4 Transition Implementation Options

The transition animation style is a design decision. Implementation should:

1. Define CSS keyframes or transition properties
2. Apply appropriate classes based on `transitionDirection`
3. Use `onAnimationEnd` or `onTransitionEnd` events to signal completion
4. Consider reduced-motion preferences via `prefers-reduced-motion` media query

---

## 9. Content Configuration

### 9.1 Configuration File Location

All editable content is centralized in `src/data/content.js`.

### 9.2 Configuration Principles

- All text content externalized to configuration
- Social links configurable
- Section order configurable
- Content structure supports easy editing without code changes

### 9.3 Editing Content

To modify site content:

1. Open `src/data/content.js`
2. Edit the relevant section's data object
3. Save the file
4. Changes reflect immediately in development mode
5. Rebuild for production deployment

---

## 10. Build Configuration

### 10.1 Vite Configuration

**File:** `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Adjust for subdirectory deployment if needed
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Single bundle for small SPA
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 10.2 Tailwind Configuration

**File:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
      // Colors, fonts, spacing, etc.
    },
  },
  plugins: [],
};
```

### 10.3 PostCSS Configuration

**File:** `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 10.4 Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext js,jsx"
  }
}
```

---

## 11. Deployment

### 11.1 Build Process

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Output directory: dist/
```

### 11.2 GitHub Pages Deployment

#### Option A: Manual Deployment

1. Build the project: `npm run build`
2. Contents of `dist/` folder are the deployable assets
3. Push to `gh-pages` branch or configure GitHub Pages to serve from `main/docs`

#### Option B: GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### GitHub Pages Configuration

If deploying to `https://<username>.github.io/<repo-name>/`, update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/<repo-name>/',
  // ... rest of config
});
```

### 11.3 Cloudflare Pages Deployment

#### Option A: Git Integration (Recommended)

1. Connect repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (or subdirectory if monorepo)
   - Node.js version: 20

#### Option B: Direct Upload

1. Build locally: `npm run build`
2. Upload `dist/` folder via Cloudflare Pages dashboard

#### Option C: Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Deploy
wrangler pages deploy dist --project-name=resume-site
```

### 11.4 Environment Variables

| Variable | GitHub Pages | Cloudflare Pages | Description |
|----------|--------------|------------------|-------------|
| VITE_BASE_URL | Set in vite.config.js | Not needed (root) | Base path for assets |

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
        ┌─────────────┐
        │    E2E      │  ← Few critical user journeys
        │  (Playwright)│
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ Integration │  ← Component interactions
        │  (Vitest +   │
        │   RTL)      │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │    Unit     │  ← Hooks, utilities, logic
        │  (Vitest)   │
        └─────────────┘
```

### 12.2 Unit Tests

**Scope:** Pure functions, custom hooks, utility functions

**Framework:** Vitest

**Configuration:** `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
});
```

**Test Setup:** `tests/setup.js`

```javascript
import '@testing-library/jest-dom';
```

#### useScreenNavigation Hook Tests

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Initial state | totalScreens: 6 | currentScreen: 0, isTransitioning: false |
| goNext from screen 0 | goNext() | currentScreen: 1 |
| goNext from last screen | goNext() | currentScreen unchanged (boundary) |
| goPrevious from screen 0 | goPrevious() | currentScreen unchanged (boundary) |
| goToScreen valid | goToScreen(3) | currentScreen: 3 |
| goToScreen invalid | goToScreen(10) | currentScreen unchanged |
| Navigation during transition | goNext() while transitioning | Ignored |

### 12.3 Integration Tests

**Scope:** Component rendering, component interactions

**Framework:** Vitest + React Testing Library

#### Component Test Examples

**ScreenWrapper Tests:**

| Test Case | Setup | Assertion |
|-----------|-------|-----------|
| Renders children | Provide child component | Child visible in DOM |
| Applies enter class | isTransitioning: true, direction: forward | Enter class applied |
| Calls onTransitionEnd | Trigger transition end event | Callback invoked |

**ScreenIndicator Tests:**

| Test Case | Setup | Assertion |
|-----------|-------|-----------|
| Renders correct number of indicators | totalScreens: 6 | 6 indicators rendered |
| Highlights current screen | currentScreen: 2 | Third indicator highlighted |
| Calls onNavigate on click | Click indicator 4 | onNavigate(4) called |

### 12.4 End-to-End Tests

**Scope:** Complete user flows across the application

**Framework:** Playwright

**Configuration:** `playwright.config.js`

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### E2E Test Scenarios

**Navigation Tests:**

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Keyboard navigation forward | Press ArrowDown 5 times | Navigate through all 6 screens |
| Keyboard navigation backward | From last screen, press ArrowUp | Return to previous screen |
| Mouse wheel navigation | Scroll down | Navigate to next screen |
| Touch swipe navigation | Swipe up on mobile viewport | Navigate to next screen |
| Direct navigation | Click screen indicator | Navigate to selected screen |
| Rapid input handling | Spam ArrowDown | Only one transition occurs |

**Screen Content Tests:**

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| About screen loads | Navigate to About | Name and summary visible |
| Contact links work | Click LinkedIn link | Opens correct URL |
| All screens accessible | Navigate to each screen | All 6 screens render content |

### 12.5 Test Commands

```bash
# Run unit and integration tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npx playwright test --ui

# Run E2E tests for specific browser
npx playwright test --project=chromium
```

---

## 13. Development Workflow

### 13.1 Local Development

```bash
# Clone repository
git clone <repository-url>
cd resume-site

# Install dependencies
npm install

# Start development server
npm run dev

# Application available at http://localhost:3000
```

### 13.2 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit/integration tests |
| `npm run test:e2e` | Run end-to-end tests |

### 13.3 Git Workflow

```
main (production)
  │
  └── feature/<feature-name>
        │
        ├── Develop feature
        ├── Run tests locally
        ├── Create pull request
        ├── CI runs tests
        └── Merge to main → Auto-deploy
```

### 13.4 Pre-commit Checklist

- [ ] All tests pass (`npm test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in development
- [ ] Mobile responsiveness verified
- [ ] Content configuration is valid

---

## Appendix A: Dependencies Reference

### Production Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/react": "^14.1.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "jsdom": "^23.0.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

---

## Appendix B: File Templates

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Parthjeet - DevOps Engineer Portfolio" />
    <title>Parthjeet | DevOps Engineer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| Screen | A full-viewport section of the website (100vh) |
| Transition | Animation between screens |
| Transition lock | State preventing navigation during animation |
| Debounce | Delay to prevent rapid repeated event firing |
| Swipe threshold | Minimum touch movement distance to trigger navigation |
| HMR | Hot Module Replacement - updates code without full reload |

---

*End of Technical Design Document*