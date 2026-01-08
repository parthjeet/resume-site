# Interaction Design Specification

**Project:** Personal Resume/Portfolio Website  
**Author:** Parthjeet  
**Version:** 1.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Initial Load Sequence](#2-initial-load-sequence)
3. [Screen Transitions](#3-screen-transitions)
4. [Title Bar Animations](#4-title-bar-animations)
5. [Content Reveal Animations](#5-content-reveal-animations)
6. [Component Micro-Interactions](#6-component-micro-interactions)
7. [Navigation Interactions](#7-navigation-interactions)
8. [Timing Reference](#8-timing-reference)

---

## 1. Overview

### 1.1 Purpose

This document specifies all motion, animation, and interaction behaviors for the portfolio website. It covers everything from initial page load through micro-interactions on individual components.

### 1.2 Interaction Model

The site uses a **click-based navigation** model:
- Users navigate between screens by clicking taskbar navigation buttons
- The window container remains persistent; only inner content changes
- Each screen change triggers a coordinated sequence of animations

### 1.3 Animation Principles

| Principle | Description |
|-----------|-------------|
| **Purposeful** | Every animation serves a functional purpose (feedback, orientation, delight) |
| **Consistent** | Similar interactions produce similar animations across the site |
| **Restrained** | Animations are subtle and professional; never distracting |
| **Era-Appropriate** | Motion references early computing (CRT flicker, window behaviors) without being cartoonish |

---

## 2. Initial Load Sequence

### 2.1 Boot Sequence Overview

When the page first loads, a brief "boot sequence" animation plays before revealing the interface. This establishes the retro-tech aesthetic immediately.

### 2.2 Sequence Timeline

```
0ms      ─────────────────────────────────────────────────────────────
         │ Screen is black/dark (#1a1a2e)
         │
200ms    │ PHASE 1: BIOS Flash
         │ Brief white/cream flash across entire viewport
         │ Simulates CRT "power on" phosphor burst
         │
400ms    │ PHASE 2: Boot Text (Optional)
         │ Single line of monospace text appears center-screen
         │ Text: "INITIALIZING PORTFOLIO.SYS..."
         │ Text uses amber color (#d4a574)
         │
800ms    │ PHASE 3: Text Fade
         │ Boot text fades out
         │
1000ms   │ PHASE 4: Window Reveal
         │ Main window container fades in from 0% to 100% opacity
         │ Slight scale animation: starts at 98%, ends at 100%
         │
1200ms   │ PHASE 5: Taskbar Slide
         │ Taskbar slides up from below viewport
         │ Lands at fixed bottom position
         │
1400ms   │ PHASE 6: Content Reveal
         │ About screen content begins staggered reveal
         │ (See Section 5 for stagger patterns)
         │
1800ms   ─────────────────────────────────────────────────────────────
         │ Boot sequence complete
         │ Site fully interactive
```

### 2.3 Phase Specifications

#### Phase 1: BIOS Flash
| Property | Value |
|----------|-------|
| Element | Full-screen overlay |
| Animation | Opacity: 0 → 0.8 → 0 |
| Color | `#f5f0e6` (cream) |
| Duration | 150ms |
| Easing | Linear |

#### Phase 2: Boot Text
| Property | Value |
|----------|-------|
| Element | Centered text element |
| Content | `INITIALIZING PORTFOLIO.SYS...` |
| Font | Monospace, 14px |
| Color | `#d4a574` (amber) |
| Animation | Fade in over 100ms |
| Position | Center of viewport |

#### Phase 3: Text Fade
| Property | Value |
|----------|-------|
| Animation | Opacity: 1 → 0 |
| Duration | 150ms |
| Easing | Ease-out |

#### Phase 4: Window Reveal
| Property | Value |
|----------|-------|
| Element | Main window container |
| Animation | Opacity: 0 → 1, Scale: 0.98 → 1 |
| Duration | 300ms |
| Easing | Ease-out |
| Transform Origin | Center |

#### Phase 5: Taskbar Slide
| Property | Value |
|----------|-------|
| Element | Bottom taskbar |
| Animation | TranslateY: 100% → 0 |
| Duration | 250ms |
| Easing | Ease-out |

### 2.4 Reduced Motion Alternative

When `prefers-reduced-motion` is enabled:
- Skip phases 1-3 entirely
- Window and taskbar appear immediately with no animation
- Content appears without stagger (all at once)
- Total load time: Instant visibility

---

## 3. Screen Transitions

### 3.1 Transition Model

The window container (title bar + content area frame) remains **static and persistent**. Only the content inside the window changes via crossfade animation.

```
┌──────────────────────────────────────────────────────────┐
│ TITLE_BAR.EXE                              ○  ○         │ ← PERSISTENT
├──────────────────────────────────────────────────────────┤
│                                                          │
│    ┌──────────────────────────────────────────────┐     │
│    │                                              │     │
│    │            CONTENT AREA                      │     │ ← CROSSFADES
│    │         (This area transitions)              │     │
│    │                                              │     │
│    └──────────────────────────────────────────────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Content Crossfade Specification

When user clicks a navigation button:

| Stage | Timing | Description |
|-------|--------|-------------|
| 1. Exit Start | 0ms | Current content begins fading out |
| 2. Exit Complete | 200ms | Current content fully transparent |
| 3. Content Swap | 200ms | New content component mounts (invisible) |
| 4. Enter Start | 200ms | New content begins fading in |
| 5. Enter Complete | 400ms | New content fully opaque |
| 6. Stagger Begin | 400ms | Content elements begin staggered reveal |

#### Exit Animation
| Property | Value |
|----------|-------|
| Animation | Opacity: 1 → 0 |
| Duration | 200ms |
| Easing | Ease-in |

#### Enter Animation
| Property | Value |
|----------|-------|
| Animation | Opacity: 0 → 1 |
| Duration | 200ms |
| Easing | Ease-out |

### 3.3 Navigation Lock

During the transition sequence (0ms - 400ms minimum, extended by stagger duration):
- All navigation clicks are ignored
- Taskbar buttons show no hover response
- Prevents rapid navigation that could cause visual glitches

Lock release occurs after:
- Crossfade complete (400ms) + Content stagger complete (varies by screen)

### 3.4 Same-Screen Click Behavior

If user clicks the navigation button for the currently active screen:
- No transition occurs
- Button shows brief "press" feedback (see Section 7.2)
- No state change

---

## 4. Title Bar Animations

### 4.1 Title Flicker Effect

When navigating between screens, the window title bar text changes with a CRT-style flicker effect.

### 4.2 Flicker Sequence

```
0ms      Current title visible: "PORTFOLIO.EXE"
         │
50ms     │ Flicker 1: Opacity drops to 30%
         │
100ms    │ Flicker 1: Opacity returns to 100%
         │
150ms    │ Flicker 2: Opacity drops to 50%
         │
200ms    │ TEXT SWAP: New title replaces old
         │ "EXPERIENCE_LOG.TXT"
         │ Opacity at 50%
         │
250ms    │ Flicker 3: Opacity jumps to 100%
         │
300ms    │ Flicker 4: Brief drop to 80%
         │
350ms    │ Final: Opacity settles at 100%
         │
         Title change complete
```

### 4.3 Flicker Specifications

| Property | Value |
|----------|-------|
| Element | Title bar text only (not background or controls) |
| Pre-swap flickers | 2 flickers over 150ms |
| Text swap point | 200ms (synchronized with content exit completion) |
| Post-swap flickers | 2 flickers over 150ms |
| Total duration | 350ms |
| Easing | Step/discrete (no smooth transitions) |

### 4.4 Title Bar Icon

The icon to the left of the title also changes with each screen. The icon swap occurs at the same 200ms mark as text swap, with a simpler animation:

| Property | Value |
|----------|-------|
| Animation | Opacity: 1 → 0 → 1 |
| Fade out | 100ms |
| Swap point | 200ms |
| Fade in | 100ms |
| Total | 300ms |

### 4.5 Window Control Dots

The minimize/maximize dots in the title bar remain static during transitions. No animation.

---

## 5. Content Reveal Animations

### 5.1 Stagger Pattern Overview

After the screen crossfade completes, content elements animate in sequentially (staggered reveal). The pattern varies by screen type but follows consistent principles.

### 5.2 General Stagger Rules

| Rule | Value |
|------|-------|
| Base delay | Starts after crossfade (400ms from nav click) |
| Stagger interval | 80-120ms between elements |
| Individual element duration | 300ms |
| Easing | Ease-out (fast start, gentle stop) |
| Animation type | Fade + subtle slide up |

### 5.3 Element Animation

Each content element animates with:

| Property | Start | End |
|----------|-------|-----|
| Opacity | 0 | 1 |
| TranslateY | 12px | 0 |
| Duration | 300ms | — |
| Easing | Ease-out | — |

### 5.4 Screen-Specific Stagger Sequences

#### About Screen
```
Order  Element                          Delay from crossfade
─────  ───────────────────────────────  ────────────────────
1      Role badge ("DEVOPS ENGINEER")   0ms
2      Main headline line 1             100ms
3      Main headline line 2 (accent)    180ms
4      Bio paragraph                    280ms
5      CTA button                       380ms
6      Profile image container          300ms (parallel with bio)
```

#### Experience Screen
```
Order  Element                          Delay from crossfade
─────  ───────────────────────────────  ────────────────────
1      Section title + underline        0ms
2      Timeline line (draws down)       150ms
3      First job card                   300ms
4      First timeline dot               350ms
5      Second job card                  500ms
6      Second timeline dot              550ms
7      Third job card                   700ms
8      Third timeline dot               750ms
```

**Timeline Draw Animation:**
The vertical timeline line animates from top to bottom using a clip-path or scaleY animation:
| Property | Value |
|----------|-------|
| Animation | ScaleY: 0 → 1 (or height: 0 → 100%) |
| Transform Origin | Top |
| Duration | 600ms |
| Easing | Ease-out |

#### Skills Screen
```
Order  Element                          Delay from crossfade
─────  ───────────────────────────────  ────────────────────
1      Section title + underline        0ms
2      First category panel             150ms
3      Second category panel            250ms
4      Third category panel             350ms
5      Fourth category panel            450ms
       (Tags within panels animate      +50ms after panel
        as a group, not individually)
```

#### Projects Screen
```
Order  Element                          Delay from crossfade
─────  ───────────────────────────────  ────────────────────
1      Address bar                      0ms
2      First row of cards (3)           150ms (simultaneous)
3      Second row of cards (3)          350ms (simultaneous)
```

Cards within the same row animate together, not individually, to avoid excessive motion.

#### Education Screen
```
Order  Element                          Delay from crossfade
─────  ───────────────────────────────  ────────────────────
1      Address bar                      0ms
2      "Academic History" header        100ms
3      First education card             200ms
4      Second education card            350ms
5      "Certifications" header          500ms
6      Certification cards (row)        600ms (simultaneous)
```

#### Contact Screen
```
Order  Element                          Delay from crossfade
─────  ───────────────────────────────  ────────────────────
1      Section title                    0ms
2      Subtitle/description text        120ms
3      LinkedIn card                    250ms
4      GitHub card                      350ms
5      Email card                       450ms
```

### 5.5 Reduced Motion Alternative

When `prefers-reduced-motion` is enabled:
- All stagger delays removed
- Elements appear simultaneously
- Fade animation only (no translateY)
- Duration reduced to 150ms

---

## 6. Component Micro-Interactions

### 6.1 Buttons

#### Primary Button (CTA)
| State | Animation |
|-------|-----------|
| **Hover** | Background darkens 10%, subtle shadow lift. Duration: 150ms. |
| **Active/Press** | Scale: 0.97, shadow reduces. Duration: 100ms. |
| **Focus** | 2px amber outline appears. Duration: instant. |
| **Release** | Returns to hover state. Duration: 100ms. |

#### Secondary Button (Dark)
| State | Animation |
|-------|-----------|
| **Hover** | Background lightens 10%, border color shifts to amber. Duration: 150ms. |
| **Active/Press** | Scale: 0.97. Duration: 100ms. |
| **Focus** | 2px amber outline. Duration: instant. |

### 6.2 Cards

#### Experience/Education Cards
| State | Animation |
|-------|-----------|
| **Default** | Static |
| **Hover** | Shadow increases (sm → md), subtle lift (translateY: -2px). Duration: 200ms. Easing: ease-out. |
| **Focus-within** | Same as hover + focus outline on focusable child. |

#### Project Cards
| State | Animation |
|-------|-----------|
| **Default** | Static |
| **Hover** | Shadow increases, border-color transitions to amber, thumbnail scales 1.02 within container. Duration: 250ms. |
| **Active** | Scale: 0.99 on entire card. Duration: 100ms. |

#### Contact Cards
| State | Animation |
|-------|-----------|
| **Default** | Static |
| **Hover** | Lift (translateY: -4px), shadow increases significantly, border shifts to amber, icon color transitions to amber. Duration: 200ms. |
| **Active** | Scale: 0.97, shadow reduces. Duration: 100ms. |

### 6.3 Tags and Badges

#### Skill Tags
| State | Animation |
|-------|-----------|
| **Default** | Static |
| **Hover** | Background shifts from white to cream (#f5f0e6), border darkens slightly. Duration: 150ms. |

#### Technology Tags (in cards)
| State | Animation |
|-------|-----------|
| **Default** | Static |
| **Hover** | No animation (tags are informational, not interactive) |

#### Date Badges
| State | Animation |
|-------|-----------|
| **Default** | Static |
| **Hover** | No animation (non-interactive) |

### 6.4 Icons

#### Taskbar Social Icons
| State | Animation |
|-------|-----------|
| **Default** | Color: `#b0b0b0` (muted) |
| **Hover** | Color transitions to `#d4a574` (amber). Duration: 150ms. Scale: 1.1. |
| **Active** | Scale: 0.95. Duration: 100ms. |

#### Card Icons (Category, Company)
| State | Animation |
|-------|-----------|
| **Default** | Static |
| **Hover (card hover)** | Slight color saturation increase. Duration: 200ms. |

#### Navigation Icons
| State | Animation |
|-------|-----------|
| **Default** | Inherits button text color |
| **Transitions** | Synced with parent button state |

### 6.5 Timeline Elements

#### Timeline Dots
| State | Animation |
|-------|-----------|
| **Initial reveal** | Scale: 0 → 1 with slight bounce. Duration: 300ms. Easing: ease-out with overshoot. |
| **Hover (when card hovered)** | Subtle pulse (scale 1 → 1.15 → 1). Duration: 400ms. |

#### Timeline Line
| State | Animation |
|-------|-----------|
| **Initial reveal** | Draws from top to bottom (see Section 5.4). |
| **After reveal** | Static, no interaction. |

### 6.6 Form Elements (If Any)

#### Address Bar (Non-interactive Display)
| State | Animation |
|-------|-----------|
| **Default** | Static display |
| **No interaction** | Purely decorative element |

### 6.7 Links

#### Inline Text Links
| State | Animation |
|-------|-----------|
| **Default** | Underline: none or subtle |
| **Hover** | Color shifts to amber, underline appears. Duration: 150ms. |
| **Active** | Color darkens 10%. |
| **Focus** | Outline ring + color shift. |

### 6.8 Window Control Dots

| State | Animation |
|-------|-----------|
| **Default** | Static (purely decorative) |
| **Hover** | Subtle brightness increase. Duration: 150ms. |
| **No click behavior** | Decorative only |

---

## 7. Navigation Interactions

### 7.1 Taskbar Button States

#### Inactive State
| Property | Value |
|----------|-------|
| Background | Transparent |
| Text Color | `#b0b0b0` (muted gray) |
| Border | None |

#### Hover State
| Property | Value |
|----------|-------|
| Background | `rgba(45, 45, 58, 0.5)` (semi-transparent charcoal) |
| Text Color | `#e8e4dc` (light) |
| Transition | 150ms ease-out |

#### Active/Current State
| Property | Value |
|----------|-------|
| Background | `#2d2d3a` (solid charcoal) |
| Text Color | `#d4a574` (amber) |
| Bottom Border | 2px solid `#d4a574` |

#### Pressed State (during click)
| Property | Value |
|----------|-------|
| Background | `#1a1a2e` (darker) |
| Scale | 0.97 |
| Duration | 100ms |

#### Disabled State (during transition)
| Property | Value |
|----------|-------|
| Pointer Events | None |
| Opacity | 0.6 |
| Cursor | Default |

### 7.2 Navigation State Transition

When user clicks a nav button:

```
0ms      Click detected
         │ Button enters "pressed" state (scale 0.97)
         │
100ms    │ Button releases press state
         │ Previous active button begins transition to inactive
         │ Clicked button begins transition to active
         │
250ms    │ Button state transition complete
         │ (Content transition runs in parallel - see Section 3)
```

### 7.3 Start Button

| State | Animation |
|-------|-----------|
| **Default** | Burgundy background, white text/icon |
| **Hover** | Background lightens 10%. Duration: 150ms. |
| **Active/Press** | Scale: 0.97, background darkens. Duration: 100ms. |
| **Behavior** | Decorative only - no functional action |

### 7.4 System Tray Clock

| Property | Value |
|----------|-------|
| Update | Every minute (if showing real time) |
| Animation | None (static display) |
| Format | `HH:MM AM/PM` |

---

## 8. Timing Reference

### 8.1 Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-instant` | 0ms | Immediate state changes |
| `--duration-fast` | 100ms | Button press feedback |
| `--duration-normal` | 150ms | Hover transitions |
| `--duration-moderate` | 200ms | Content crossfade |
| `--duration-slow` | 300ms | Element reveal animations |
| `--duration-slower` | 400ms | Complex transitions |
| `--duration-slowest` | 600ms | Timeline draw, boot sequence |

### 8.2 Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Most animations (natural deceleration) |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetrical transitions |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Timeline dots, playful elements |
| `--ease-linear` | `linear` | Flicker effects, opacity pulses |
| `--ease-step` | `steps(1)` | Discrete flicker (no interpolation) |

### 8.3 Stagger Intervals

| Context | Interval |
|---------|----------|
| Content elements (same level) | 80-120ms |
| Cards in sequence | 150-200ms |
| Cards in same row | 0ms (simultaneous) |
| Title → Content start | 100ms |

### 8.4 Complete Interaction Timeline Example

**User clicks "Experience" from "About" screen:**

```
0ms      ─ Click detected on "Experience" button
         ├─ Nav button enters pressed state
         ├─ Navigation lock engaged
         │
100ms    ├─ Nav button releases, begins active transition
         ├─ "About" button begins inactive transition
         │
50ms     ├─ Title bar flicker begins (first pre-swap flicker)
         │
100ms    ├─ Title bar second flicker
         │
0ms      ├─ About content begins fade out
         │
200ms    ├─ About content fully faded
         ├─ Title text swaps to "EXPERIENCE_LOG.TXT"
         ├─ Experience content mounts (invisible)
         ├─ Experience content begins fade in
         │
250ms    ├─ Navigation button transitions complete
         │
300ms    ├─ Title bar flicker settles
         │
400ms    ├─ Experience content fully visible
         ├─ Stagger sequence begins:
         │
400ms    │  └─ Section title reveals
550ms    │  └─ Timeline begins drawing
700ms    │  └─ First job card reveals
750ms    │  └─ First timeline dot pops in
900ms    │  └─ Second job card reveals
950ms    │  └─ Second timeline dot pops in
1100ms   │  └─ Third job card reveals
1150ms   │  └─ Third timeline dot pops in
         │
1200ms   ├─ Timeline draw complete
         │
1450ms   ─ All animations complete
         ├─ Navigation lock released
         └─ Screen fully interactive
```

---

## Appendix A: Animation Checklist by Screen

| Screen | Boot | Crossfade | Title Flicker | Stagger | Card Hover | Button Hover |
|--------|------|-----------|---------------|---------|------------|--------------|
| About | ✓ (first load only) | ✓ | ✓ | ✓ | — | ✓ |
| Experience | — | ✓ | ✓ | ✓ + Timeline | ✓ | ✓ |
| Skills | — | ✓ | ✓ | ✓ | ✓ (panels) | — |
| Projects | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Education | — | ✓ | ✓ | ✓ | ✓ | — |
| Contact | — | ✓ | ✓ | ✓ | ✓ | — |

---

## Appendix B: Interaction State Matrix

| Element | Default | Hover | Active | Focus | Disabled |
|---------|---------|-------|--------|-------|----------|
| Primary Button | ○ | ● Darken + lift | ● Scale down | ● Outline | ○ Opacity 0.5 |
| Secondary Button | ○ | ● Lighten | ● Scale down | ● Outline | ○ Opacity 0.5 |
| Nav Button | ○ | ● BG tint | ● Scale + darken | ● Outline | ○ Opacity 0.6 |
| Card | ○ | ● Lift + shadow | — | ● Outline | — |
| Contact Card | ○ | ● Lift + border color | ● Scale down | ● Outline | — |
| Skill Tag | ○ | ● BG shift | — | — | — |
| Social Icon | ○ | ● Color + scale | ● Scale down | ● Outline | — |
| Timeline Dot | ○ | ● Pulse (via card) | — | — | — |
| Link | ○ | ● Color + underline | ● Darken | ● Outline | — |

Legend: ○ = No special treatment, ● = Has animation/change

---

*End of Interaction Design Specification*