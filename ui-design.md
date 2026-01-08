# Design Specification Document: Portfolio Website

**Project:** Personal Resume/Portfolio Website  
**Author:** Parthjeet  
**Version:** 1.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Library](#5-component-library)
6. [Screen Specifications](#6-screen-specifications)
7. [Navigation System](#7-navigation-system)
8. [Iconography](#8-iconography)
9. [Responsive Design](#9-responsive-design)
10. [Accessibility Guidelines](#10-accessibility-guidelines)

---

## 1. Design Philosophy

### 1.1 Overview

The design follows a **"Professional Retro-Tech Fusion"** aesthetic—a modern, sophisticated interpretation of early computing visual language (Windows 95 era) without literal recreation. The goal is to evoke nostalgic warmth while maintaining professional credibility suitable for tech recruiters and engineering managers.

### 1.2 Core Principles

| Principle | Description |
|-----------|-------------|
| **Nostalgic Warmth** | Subtle references to early computing through window metaphors, beveled edges, and CRT-inspired color warmth |
| **Professional First** | Design choices that establish technical competence and credibility |
| **Distinctive Identity** | Memorable visual language that differentiates from template-based portfolios |
| **Functional Clarity** | Clear visual hierarchy prioritizing content readability and navigation |

### 1.3 Visual Metaphor

The entire site operates as a **desktop environment metaphor**:
- Each screen appears within a "window" container with title bar
- Navigation mimics a Windows 95-style taskbar
- File-naming conventions in title bars (e.g., `PORTFOLIO.EXE`, `EXPERIENCE_LOG.TXT`)
- System tray area for social/contact links

### 1.4 Mood & Tone

- **Confident** — Establishes expertise without arrogance
- **Approachable** — Warm colors and familiar metaphors reduce barriers
- **Technical** — Design choices that resonate with engineering audiences
- **Memorable** — Distinctive enough to be remembered after viewing

---

## 2. Color System

### 2.1 Primary Palette

| Token | Hex Value | RGB | Usage |
|-------|-----------|-----|-------|
| `--color-background-primary` | `#1a1a2e` | `rgb(26, 26, 46)` | Page background, deep charcoal base |
| `--color-background-secondary` | `#f5f0e6` | `rgb(245, 240, 230)` | Content panels, cream/off-white with aged paper warmth |
| `--color-surface` | `#faf8f3` | `rgb(250, 248, 243)` | Card surfaces, lighter cream variant |

### 2.2 Accent Colors

| Token | Hex Value | RGB | Usage |
|-------|-----------|-----|-------|
| `--color-accent-primary` | `#d4a574` | `rgb(212, 165, 116)` | Primary accent, muted amber/gold (CRT phosphor warmth) |
| `--color-accent-secondary` | `#8b4557` | `rgb(139, 69, 87)` | Secondary accent, soft burgundy (window title bars, highlights) |
| `--color-accent-tertiary` | `#c9a87c` | `rgb(201, 168, 124)` | Tertiary amber, underlines and decorative elements |

### 2.3 Text Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-text-primary` | `#2d2d3a` | Primary text on light backgrounds |
| `--color-text-secondary` | `#5a5a6a` | Secondary/muted text on light backgrounds |
| `--color-text-light` | `#e8e4dc` | Text on dark backgrounds |
| `--color-text-accent` | `#8b4557` | Accent text (company names, highlights) |

### 2.4 UI Element Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-border-light` | `rgba(255, 255, 255, 0.2)` | Light edge of beveled borders |
| `--color-border-shadow` | `rgba(0, 0, 0, 0.3)` | Shadow edge of beveled borders |
| `--color-border-card` | `#e5e0d5` | Card border color |
| `--color-window-title` | `#8b4557` | Window title bar background (burgundy gradient) |
| `--color-timeline` | `#d4a574` | Timeline connector line |
| `--color-timeline-dot` | `#c9a87c` | Timeline marker dots |

### 2.5 Tag/Badge Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-tag-background` | `#ffffff` | Skill/technology tag background |
| `--color-tag-border` | `#e5e0d5` | Tag border |
| `--color-tag-text` | `#5a5a6a` | Tag text color |
| `--color-tag-icon` | `#8b4557` | Tag icon/checkmark color |

### 2.6 Color Application Rules

1. **Dark background (`#1a1a2e`)** covers the full viewport, creating depth and making content panels "float"
2. **Cream panels (`#f5f0e6`)** contain all primary content, evoking aged paper/early monitor warmth
3. **Burgundy (`#8b4557`)** used sparingly for window title bars and accent text (company names, active states)
4. **Amber (`#d4a574`)** for interactive elements, buttons, and decorative accents
5. **Never use pure white (`#ffffff`)** for backgrounds; always warm-tinted

---

## 3. Typography

### 3.1 Font Stack

| Role | Font Family | Fallback Stack |
|------|-------------|----------------|
| **Display/Headings** | Custom serif or geometric sans | `Georgia, 'Times New Roman', serif` |
| **Body Text** | System sans-serif | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| **Monospace** | Monospace for code/terminal elements | `'SF Mono', 'Monaco', 'Consolas', monospace` |

### 3.2 Type Scale

| Token | Size (Desktop) | Size (Mobile) | Line Height | Weight | Usage |
|-------|----------------|---------------|-------------|--------|-------|
| `--text-display` | 72px | 40px | 1.1 | 400 | Hero headline ("Architecting") |
| `--text-display-accent` | 72px | 40px | 1.1 | 400 | Hero headline accent ("Resilient Systems") |
| `--text-h1` | 48px | 32px | 1.2 | 700 | Section titles ("Work Experience") |
| `--text-h2` | 24px | 20px | 1.3 | 700 | Card titles (job titles, project names) |
| `--text-h3` | 18px | 16px | 1.4 | 600 | Subsection headers |
| `--text-body` | 16px | 15px | 1.6 | 400 | Body text, descriptions |
| `--text-small` | 14px | 13px | 1.5 | 400 | Secondary text, dates, labels |
| `--text-caption` | 12px | 11px | 1.4 | 500 | Tags, badges, window titles |

### 3.3 Typography Styles

#### Hero Display Text
```
Font: Display font
Size: 72px (desktop) / 40px (mobile)
Weight: 400 (regular)
Color: --color-text-primary (#2d2d3a) for main text
       --color-accent-secondary (#8b4557) for accent line
Letter-spacing: -0.02em
```

#### Section Titles
```
Font: Display font
Size: 48px (desktop) / 32px (mobile)
Weight: 700 (bold)
Color: --color-text-primary
Text-transform: None
Decoration: Amber underline (60px wide, 3px height, 12px below text)
```

#### Card Headers
```
Font: Body font
Size: 24px / 20px
Weight: 700
Color: --color-text-primary
```

#### Body Text
```
Font: Body font
Size: 16px / 15px
Weight: 400
Color: --color-text-secondary (#5a5a6a)
Line-height: 1.6
```

#### Window Title Bar Text
```
Font: Monospace
Size: 14px
Weight: 600
Color: --color-text-light (#e8e4dc)
Text-transform: UPPERCASE
Letter-spacing: 0.05em
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Minimal spacing, icon padding |
| `--space-2` | 8px | Tight spacing, tag gaps |
| `--space-3` | 12px | Small component padding |
| `--space-4` | 16px | Standard component padding |
| `--space-5` | 24px | Section internal spacing |
| `--space-6` | 32px | Component margins |
| `--space-7` | 48px | Section margins |
| `--space-8` | 64px | Large section separation |
| `--space-9` | 96px | Major section separation |

### 4.2 Layout Grid

#### Desktop (1920x1080)
```
Viewport: 100vw × 100vh (single screen at a time)
Content Max-Width: 1200px
Content Panel Width: ~1140px (centered)
Side Margins: Auto (centered)
Taskbar Height: 48px (fixed bottom)
```

#### Content Panel Inset
```
Top Margin: 40px from viewport top
Bottom Margin: 96px (48px content + 48px taskbar clearance)
Left/Right: Centered with auto margins
```

### 4.3 Window Container Structure

```
┌─────────────────────────────────────────────────────────┐
│  TITLE_BAR.EXE                               ○  ○     │ ← 48px height
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ┌─────────────────────────────────────────────┐     │
│    │                                             │     │ ← Optional address bar
│    │  ← →   C:\Path\To\Content                  🔍│     │   (40px height)
│    │                                             │     │
│    └─────────────────────────────────────────────┘     │
│                                                         │
│                    CONTENT AREA                         │ ← Flexible height
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Window title bar top corners (when combined with panel) |
| `--radius-sm` | 4px | Tags, small buttons |
| `--radius-md` | 8px | Cards, panels, main containers |
| `--radius-lg` | 12px | Large containers, window outer edges |
| `--radius-full` | 9999px | Circular elements (timeline dots) |

### 4.5 Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift for tags |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | Card elevation |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Window container drop shadow |
| `--shadow-window` | `0 12px 40px rgba(0,0,0,0.2)` | Main window panel shadow |
| `--shadow-inset` | `inset 0 1px 0 rgba(255,255,255,0.1)` | Beveled inner highlight |

---

## 5. Component Library

### 5.1 Window Container

The primary container component mimicking a desktop application window.

#### Structure
```
┌──────────────────────────────────────────────────────────────┐
│ ⚙ WINDOW_TITLE.EXE                                    ○  ○ │ ← Title Bar
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                      Content Area                            │ ← Main Content
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Title Bar Specifications
| Property | Value |
|----------|-------|
| Height | 48px |
| Background | Linear gradient from `#a05a6a` to `#8b4557` |
| Border Radius | 12px 12px 0 0 (top corners only) |
| Padding | 0 20px |
| Icon | 16×16px, left-aligned with 12px margin |
| Title Font | Monospace, 14px, uppercase, letter-spacing 0.05em |
| Title Color | `#e8e4dc` (cream/white) |
| Window Controls | Two circles (8px diameter), right-aligned, `#c9a87c` and `#d4a574` |

#### Content Area Specifications
| Property | Value |
|----------|-------|
| Background | `#f5f0e6` (cream) |
| Border Radius | 0 0 12px 12px (bottom corners only) |
| Padding | 40px 60px (desktop), 24px (mobile) |
| Border | None (shadow provides definition) |

### 5.2 Address Bar (Optional Sub-header)

Used in Education and Projects screens to add file-explorer metaphor.

| Property | Value |
|----------|-------|
| Height | 40px |
| Background | `#ffffff` |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 4px |
| Font | Monospace, 14px |
| Text Color | `#5a5a6a` |
| Icons | Back/forward arrows (left), Search icon (right) |

### 5.3 Content Cards

#### Standard Card (Experience, Education)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Job Title                            2021 - Present   │
│  ☁ COMPANY NAME                              Location  │
│                                                         │
│  • Bullet point description text here                  │
│  • Another achievement or responsibility               │
│  • Third point with metrics or impact                  │
│                                                         │
│  [Tag] [Tag] [Tag] [Tag]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 8px |
| Padding | 24px |
| Shadow | `--shadow-md` |
| Left Accent | 4px solid `#c9a87c` (amber) on left edge |

#### Project Card
```
┌─────────────────────────────────────────────────────────┐
│ filename.ext                                        ○ │ ← Mini title bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│              [Thumbnail/Image Area]                     │
│                        180px                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Project Title                                         │
│                                                         │
│  Description text spanning one or two lines            │
│                                                         │
│  [Tag] [Tag] [Tag]                                     │
│                                                         │
│  ┌────────────────┐                                    │
│  │ View Details → │                                    │
│  └────────────────┘                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Width | ~380px (3-column grid on desktop) |
| Background | `#ffffff` |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 8px |
| Mini Title Bar | Height 32px, background `#8b4557`, monospace font |
| Thumbnail Height | 180px |
| Content Padding | 20px |

### 5.4 Tags/Badges

#### Skill Tag (with icon)
| Property | Value |
|----------|-------|
| Height | 32px |
| Padding | 8px 12px |
| Background | `#ffffff` |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 4px |
| Font | 14px, regular weight |
| Text Color | `#5a5a6a` |
| Icon | 14px, `#8b4557` or category-specific color |
| Gap | 8px between icon and text |

#### Technology Tag (compact)
| Property | Value |
|----------|-------|
| Height | 28px |
| Padding | 6px 10px |
| Background | `#f5f0e6` |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 4px |
| Font | 12px, medium weight |
| Text Color | `#5a5a6a` |

#### Date Badge
| Property | Value |
|----------|-------|
| Padding | 6px 12px |
| Background | `#f5f0e6` |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 4px |
| Font | 14px, regular |
| Text Color | `#2d2d3a` |

### 5.5 Buttons

#### Primary Button (CTA)
| Property | Value |
|----------|-------|
| Height | 48px |
| Padding | 12px 24px |
| Background | `#d4a574` (amber) |
| Border | None |
| Border Radius | 6px |
| Font | 16px, semi-bold |
| Text Color | `#2d2d3a` |
| Shadow | `0 2px 4px rgba(0,0,0,0.1)` |
| Hover | Darken 10%, lift shadow |
| Icon | Right arrow, 16px, 8px left margin |

#### Secondary Button (View Details)
| Property | Value |
|----------|-------|
| Height | 40px |
| Padding | 10px 16px |
| Background | `#2d2d3a` (charcoal) |
| Border | None |
| Border Radius | 4px |
| Font | 14px, medium |
| Text Color | `#ffffff` |
| Icon | Contextual (external link, GitHub, etc.), 14px |

### 5.6 Timeline Component

#### Vertical Timeline Line
| Property | Value |
|----------|-------|
| Width | 2px |
| Color | `#d4a574` (amber) |
| Position | Centered horizontally between alternating cards |

#### Timeline Node/Dot
| Property | Value |
|----------|-------|
| Size | 16px diameter |
| Background | `#c9a87c` |
| Border | 3px solid `#f5f0e6` |
| Border Radius | 50% |
| Position | Centered on timeline line, vertically aligned with card top |

### 5.7 Category Panels (Skills Screen)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ☁ CATEGORY TITLE                                      │
│                                                         │
│  ┌──────────┐ ┌──────────────────┐ ┌──────────┐       │
│  │ ✓ Skill  │ │ ✓ Longer Skill   │ │ ✓ Skill  │       │
│  └──────────┘ └──────────────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐                             │
│  │ ✓ Skill  │ │ ✓ Skill  │                             │
│  └──────────┘ └──────────┘                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `#faf8f3` (slightly lighter cream) |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 8px |
| Padding | 24px |
| Header Font | 14px, uppercase, semi-bold, letter-spacing 0.05em |
| Header Color | `#2d2d3a` |
| Header Icon | 20px, matches category theme |
| Tag Grid | Flex wrap, 8px gap |

### 5.8 Certification Card

| Property | Value |
|----------|-------|
| Layout | Horizontal, icon left + content right |
| Background | `#ffffff` |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 8px |
| Padding | 16px |
| Icon Container | 48px × 48px, `#f5f0e6` background, 6px radius |
| Icon | 24px, `#8b4557` |
| Title Font | 16px, semi-bold |
| Subtitle Font | 14px, regular, `#5a5a6a` |
| Date Font | 12px, regular, `#8b8b8b` |

---

## 6. Screen Specifications

### 6.1 About/Hero Screen

#### Layout Structure (Desktop)
```
┌──────────────────────────────────────────────────────────────────────────┐
│ >_ NAME_PORTFOLIO.EXE                                             ○  ○  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐                                                    │
│  │ ⚙ DEVOPS ENGINEER│                                                   │
│  └─────────────────┘                    ┌─────────────────────────┐     │
│                                          │                         │     │
│  Architecting                            │    [Profile Image]      │     │
│  Resilient Systems                       │                         │     │
│                                          │    > ssh root@server    │     │
│  Professional bio text spanning          │    > docker-compose up  │     │
│  multiple lines describing expertise     │    > System: ONLINE     │     │
│  and specializations...                  │                         │     │
│                                          └─────────────────────────┘     │
│  ┌─────────────────┐                                                    │
│  │ View Projects → │                                                    │
│  └─────────────────┘                                                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Component Specifications

| Element | Specification |
|---------|---------------|
| Role Badge | Inline-flex, padding 8px 16px, border 1px solid `#e5e0d5`, radius 4px, icon `#8b4557` |
| Main Headline | 72px display font, normal weight, `#2d2d3a` |
| Accent Headline | 72px display font, normal weight, `#8b4557` (burgundy) |
| Bio Text | 16px body font, line-height 1.6, `#5a5a6a`, max-width 480px |
| CTA Button | Primary button style (see 5.5) |
| Image Container | 320px × 400px, rounded corners, drop shadow |
| Terminal Overlay | Bottom of image, semi-transparent dark background, monospace green text |

#### Content Hierarchy
1. Role badge (establishes context)
2. Two-line headline (largest visual element)
3. Bio paragraph (supporting detail)
4. CTA button (action)
5. Profile image with terminal overlay (visual interest + technical identity)

### 6.2 Experience Screen

#### Layout Structure
```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🏛 EXPERIENCE_LOG.TXT                                            ○  ○   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        Work Experience                                   │
│                        ───────────────                                   │
│                                                                          │
│                              │                                           │
│                              │    ┌────────────────────────────┐        │
│                              ●────│ Job Title      2021-Present│        │
│                              │    │ COMPANY NAME                │        │
│                              │    │ • Achievement 1             │        │
│                              │    │ • Achievement 2             │        │
│     ┌────────────────────────┤    │ [Tag] [Tag] [Tag]          │        │
│     │ Job Title    2019-2021 │    └────────────────────────────┘        │
│     │ COMPANY NAME           │────●                                      │
│     │ • Achievement 1        │    │                                      │
│     │ • Achievement 2        │    │    ┌────────────────────────┐       │
│     │ [Tag] [Tag]            │    ●────│ Job Title    2017-2019 │       │
│     └────────────────────────┘    │    │ COMPANY NAME           │       │
│                                   │    │ • Achievement 1        │       │
│                                   │    └────────────────────────┘       │
│                                   │                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Timeline Layout Rules
- Timeline line: Vertical, centered in viewport
- Cards alternate left and right of timeline
- Most recent position at top (reverse chronological)
- Timeline dots align with top of each card
- Cards offset horizontally by 40px from timeline center

#### Experience Card Content
| Element | Specification |
|---------|---------------|
| Job Title | 24px, bold, `#2d2d3a` |
| Company Name | 16px, uppercase, `#8b4557`, with icon |
| Date Badge | Right-aligned, pill style |
| Bullet Points | 15px, `#5a5a6a`, standard list styling |
| Technology Tags | Bottom of card, flex wrap |

### 6.3 Skills Screen

#### Layout Structure
```
┌──────────────────────────────────────────────────────────────────────────┐
│ ⚙ TECHNICAL_SKILLS_MATRIX.EXE                                    ○  ○   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        Technology Stack                                  │
│                        ────────────────                                  │
│                                                                          │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────┐   │
│  │ ☁ CLOUD & INFRASTRUCTURE       │  │ ⚙ CONTAINERIZATION          │   │
│  │                                 │  │                             │   │
│  │ [✓ AWS] [✓ GCP] [✓ Azure]     │  │ [⚙ Docker] [⚙ Kubernetes]  │   │
│  │ [✓ Terraform] [✓ Ansible]     │  │ [⚙ Helm] [⚙ OpenShift]     │   │
│  │ [✓ CloudFormation]            │  │ [⚙ Podman]                  │   │
│  └─────────────────────────────────┘  └─────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────┐   │
│  │ 🔧 CI/CD & DEVOPS TOOLS        │  │ 📊 MONITORING & LOGGING     │   │
│  │                                 │  │                             │   │
│  │ [>_ Jenkins] [>_ GitLab CI]    │  │ [📊 Prometheus] [📊 Grafana]│   │
│  │ [>_ GitHub Actions]            │  │ [📊 ELK Stack] [📊 Datadog] │   │
│  │ [>_ ArgoCD] [>_ CircleCI]      │  │ [📊 PagerDuty]              │   │
│  └─────────────────────────────────┘  └─────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Grid Layout
| Property | Value |
|----------|-------|
| Grid | 2 columns on desktop, 1 column on mobile |
| Gap | 24px |
| Panel Width | Equal (50% - gap) |

#### Category Icons
| Category | Icon Style |
|----------|------------|
| Cloud & Infrastructure | Cloud icon (☁) |
| Containerization | Gear/container icon (⚙) |
| CI/CD & DevOps Tools | Wrench/terminal icon (>_) |
| Monitoring & Logging | Chart/graph icon (📊) |

### 6.4 Projects Screen

#### Layout Structure
```
┌──────────────────────────────────────────────────────────────────────────┐
│ 📁 Project Explorer                                              ○ ○ ○  │
├──────────────────────────────────────────────────────────────────────────┤
│ ← →  C:\Users\DevOps\Documents\Projects                              🔍  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │
│  │ cloud_migration  │ │ kube_autoscaler  │ │ pipeline_v4      │        │
│  ├──────────────────┤ ├──────────────────┤ ├──────────────────┤        │
│  │   [Thumbnail]    │ │   [Thumbnail]    │ │   [Thumbnail]    │        │
│  ├──────────────────┤ ├──────────────────┤ ├──────────────────┤        │
│  │ Project Title    │ │ Project Title    │ │ Project Title    │        │
│  │ Description...   │ │ Description...   │ │ Description...   │        │
│  │ [Tag][Tag][Tag]  │ │ [Tag][Tag]       │ │ [Tag][Tag][Tag]  │        │
│  │ [View Details →] │ │ [View Repo →]    │ │ [View Details →] │        │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘        │
│                                                                          │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │
│  │ security_audit   │ │ monitor_dash     │ │ iac_library      │        │
│  │      ...         │ │      ...         │ │      ...         │        │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Grid Specifications
| Property | Value |
|----------|-------|
| Grid | 3 columns desktop, 2 columns tablet, 1 column mobile |
| Gap | 20px |
| Card Max Width | 380px |

#### Project Card Thumbnail Styles
- Abstract/thematic images related to project type
- Consistent aspect ratio (16:9 or similar)
- Burgundy mini title bar with filename

### 6.5 Education Screen

#### Layout Structure
```
┌──────────────────────────────────────────────────────────────────────────┐
│ ⚙ System Credentials                                            ○ ○ ○   │
├──────────────────────────────────────────────────────────────────────────┤
│ ← →  C:\Users\DevOps\Credentials\Education                           🔍  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📚 Academic History                                                     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Institution Name                                     2018 - 2020 │ │
│  │  Master of Science in Cloud Computing                  Boston, MA │ │
│  │                                                                    │ │
│  │  Specialized in distributed systems and cloud infrastructure.     │ │
│  │  Thesis focused on optimizing container orchestration...          │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Institution Name                                     2014 - 2018 │ │
│  │  Bachelor of Science in Computer Science                Austin, TX │ │
│  │  Description text...                                               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  🏆 Industry Certifications                                              │
│                                                                          │
│  ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐     │
│  │ [☁] AWS Solutions │ │ [⚙] CKA: K8s     │ │ [</>] Terraform   │     │
│  │     Architect     │ │     Admin         │ │     Associate     │     │
│  │     Pro Level     │ │     CNCF          │ │     HashiCorp     │     │
│  │     Aug 2023      │ │     Jan 2023      │ │     Nov 2022      │     │
│  └───────────────────┘ └───────────────────┘ └───────────────────┘     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Education Card Specifications
| Element | Specification |
|---------|---------------|
| Institution | 20px, bold, `#2d2d3a` |
| Degree | 16px, semi-bold, `#8b4557` |
| Date Badge | Right side, pill style |
| Location | Below date, 14px, `#5a5a6a` |
| Description | 15px, `#5a5a6a`, max 2-3 lines |
| Left Accent | 4px solid `#c9a87c` |

#### Certification Grid
| Property | Value |
|----------|-------|
| Grid | 3-4 columns desktop, 2 columns tablet, 1 column mobile |
| Gap | 16px |

### 6.6 Contact Screen

#### Layout Structure
```
┌──────────────────────────────────────────────────────────────────────────┐
│ 📧 CONTACT.EXE                                                   ○  ○   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                          Get In Touch                                    │
│                          ────────────                                    │
│                                                                          │
│              Open to new opportunities and collaborations.               │
│              Feel free to reach out through any channel.                 │
│                                                                          │
│                                                                          │
│         ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│         │              │  │              │  │              │           │
│         │   LinkedIn   │  │    GitHub    │  │    Email     │           │
│         │      🔗      │  │      ⚙      │  │      ✉      │           │
│         │              │  │              │  │              │           │
│         │  Connect →   │  │  View Code → │  │  Send Mail → │           │
│         │              │  │              │  │              │           │
│         └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Contact Card Specifications
| Property | Value |
|----------|-------|
| Width | 200px |
| Height | 180px |
| Background | `#ffffff` |
| Border | 1px solid `#e5e0d5` |
| Border Radius | 12px |
| Shadow | `--shadow-lg` |
| Icon Size | 48px |
| Icon Color | `#8b4557` |
| Label Font | 18px, semi-bold |
| CTA Font | 14px, `#d4a574` |
| Hover | Lift + enhanced shadow + amber border |

---

## 7. Navigation System

### 7.1 Taskbar Navigation

The persistent bottom navigation bar mimics a Windows 95 taskbar.

#### Structure
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [⚙ Start] │ [About] [Experience] [Skills] [Projects] [Education] │ [🔗][📧] 10:42 PM │
└────────────────────────────────────────────────────────────────────────────────┘
```

#### Specifications
| Property | Value |
|----------|-------|
| Height | 48px |
| Background | `#1a1a2e` (matches page background) |
| Position | Fixed bottom |
| Padding | 0 16px |

#### Start Button
| Property | Value |
|----------|-------|
| Background | `#8b4557` (burgundy) |
| Height | 36px |
| Padding | 8px 16px |
| Border Radius | 4px |
| Icon | ⚙ gear, 16px, white |
| Text | "Start", 14px, semi-bold, white |
| Hover | Lighten 10% |

#### Navigation Buttons
| Property | Value |
|----------|-------|
| Background | Transparent (inactive), `#2d2d3a` (active) |
| Height | 32px |
| Padding | 8px 16px |
| Border Radius | 4px |
| Font | 14px, regular |
| Text Color | `#b0b0b0` (inactive), `#d4a574` (active) |
| Hover | Background `#2d2d3a50` |
| Active Indicator | Amber underline or background change |

#### System Tray
| Property | Value |
|----------|-------|
| Position | Right side of taskbar |
| Icons | LinkedIn, Email (16px each) |
| Icon Color | `#b0b0b0` |
| Icon Hover | `#d4a574` (amber) |
| Clock | 14px, `#b0b0b0`, right-most |
| Divider | 1px vertical line, `#3d3d4d` |

### 7.2 Active State Indication

| State | Visual Treatment |
|-------|------------------|
| Inactive | Default text color, transparent background |
| Hover | Subtle background tint |
| Active | Amber text color, darker background, optional underline |
| Focused | Focus ring for accessibility |

---

## 8. Iconography

### 8.1 Icon Style

- **Style:** Simple line icons with slight weight
- **Size:** 16px (small), 20px (medium), 24px (large), 48px (feature)
- **Stroke:** 1.5-2px weight
- **Color:** Inherits from parent or specific accent color

### 8.2 Icon Library

| Icon | Usage | Suggested Symbol |
|------|-------|------------------|
| Start | Taskbar start button | Gear (⚙) |
| About | Navigation | User/Person |
| Experience | Navigation | Building/Briefcase |
| Skills | Navigation | Tool/Wrench |
| Projects | Navigation | Folder |
| Education | Navigation | Graduation cap |
| Contact | Navigation | Envelope |
| LinkedIn | Social link | LinkedIn logo |
| GitHub | Social link | GitHub logo |
| Email | Contact | Envelope |
| External Link | Project CTAs | Arrow with box |
| Check | Skill tags | Checkmark |
| Cloud | Cloud category | Cloud |
| Container | Container category | Box/Gear |
| Terminal | CI/CD category | Terminal prompt |
| Chart | Monitoring category | Bar chart |
| Arrow Right | CTAs | → |
| Back/Forward | Address bar | ← → |
| Search | Address bar | Magnifying glass |

### 8.3 Window Control Dots

| Position | Color | Size |
|----------|-------|------|
| Left dot | `#c9a87c` (muted gold) | 8px |
| Right dot | `#d4a574` (amber) | 8px |
| Gap | 8px between dots |

---

## 9. Responsive Design

### 9.1 Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| `--bp-mobile` | < 640px | Mobile phones |
| `--bp-tablet` | 640px - 1024px | Tablets, small laptops |
| `--bp-desktop` | 1024px - 1440px | Standard desktops |
| `--bp-wide` | > 1440px | Large monitors |

### 9.2 Layout Adaptations

#### Mobile (< 640px)
- Single column layouts for all grids
- Taskbar remains at bottom, simplified
- Window title bar simplified (shorter title)
- Cards stack vertically
- Timeline becomes single-column (cards stack, no alternating)
- Typography scales down per type scale
- Reduced padding (24px instead of 60px)

#### Tablet (640px - 1024px)
- 2-column grids for projects, skills, certifications
- Timeline alternates but narrower cards
- Full taskbar navigation

#### Desktop (> 1024px)
- Full 3-column grids where applicable
- Maximum content width: 1200px
- Full typography scale
- Full padding and spacing

### 9.3 Touch Considerations

- Minimum touch target: 44px × 44px
- Adequate spacing between interactive elements
- Taskbar buttons sized for thumb navigation
- Swipe gestures for screen navigation on touch devices

---

## 10. Accessibility Guidelines

### 10.1 Color Contrast

| Combination | Ratio | Status |
|-------------|-------|--------|
| `#2d2d3a` on `#f5f0e6` | ~10:1 | ✅ AAA |
| `#5a5a6a` on `#f5f0e6` | ~5.5:1 | ✅ AA |
| `#8b4557` on `#f5f0e6` | ~5:1 | ✅ AA |
| `#e8e4dc` on `#8b4557` | ~5:1 | ✅ AA |
| `#d4a574` on `#1a1a2e` | ~6:1 | ✅ AA |

### 10.2 Focus States

All interactive elements must have visible focus indicators:
- Buttons: 2px solid outline in amber (`#d4a574`)
- Links: Underline + color change
- Cards: Subtle shadow increase or border change
- Navigation: Clear highlight state

### 10.3 Keyboard Navigation

- All screens navigable via keyboard (Tab, Shift+Tab)
- Arrow keys for screen navigation
- Enter/Space for button activation
- Escape to close any overlays/modals

### 10.4 Screen Reader Considerations

- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- ARIA labels for icon-only buttons
- Skip navigation link option

### 10.5 Motion Preferences

- Respect `prefers-reduced-motion` media query
- Provide option to disable screen transitions
- Ensure content is accessible without animation

---

## Appendix A: CSS Custom Properties Reference

```css
:root {
  /* Colors - Background */
  --color-background-primary: #1a1a2e;
  --color-background-secondary: #f5f0e6;
  --color-surface: #faf8f3;
  
  /* Colors - Accent */
  --color-accent-primary: #d4a574;
  --color-accent-secondary: #8b4557;
  --color-accent-tertiary: #c9a87c;
  
  /* Colors - Text */
  --color-text-primary: #2d2d3a;
  --color-text-secondary: #5a5a6a;
  --color-text-light: #e8e4dc;
  --color-text-accent: #8b4557;
  
  /* Colors - UI */
  --color-border-light: rgba(255, 255, 255, 0.2);
  --color-border-shadow: rgba(0, 0, 0, 0.3);
  --color-border-card: #e5e0d5;
  --color-window-title: #8b4557;
  
  /* Typography */
  --font-display: Georgia, 'Times New Roman', serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', Monaco, Consolas, monospace;
  
  /* Type Scale */
  --text-display: 72px;
  --text-h1: 48px;
  --text-h2: 24px;
  --text-h3: 18px;
  --text-body: 16px;
  --text-small: 14px;
  --text-caption: 12px;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  --shadow-window: 0 12px 40px rgba(0,0,0,0.2);
  
  /* Breakpoints (for reference) */
  --bp-mobile: 640px;
  --bp-tablet: 1024px;
  --bp-desktop: 1440px;
}
```

---

## Appendix B: Component Checklist

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Window Container | ✅ | ✅ | ✅ |
| Title Bar | ✅ | ✅ | ✅ (simplified) |
| Address Bar | ✅ | ✅ | ❌ (hidden) |
| Experience Card | ✅ | ✅ | ✅ |
| Timeline | ✅ (alternating) | ✅ (alternating) | ✅ (single column) |
| Skill Category Panel | ✅ (2-col grid) | ✅ (2-col) | ✅ (1-col) |
| Skill Tag | ✅ | ✅ | ✅ |
| Project Card | ✅ (3-col) | ✅ (2-col) | ✅ (1-col) |
| Education Card | ✅ | ✅ | ✅ |
| Certification Card | ✅ (3-4 col) | ✅ (2-col) | ✅ (1-col) |
| Contact Card | ✅ | ✅ | ✅ |
| Taskbar | ✅ (full) | ✅ (full) | ✅ (condensed) |
| Primary Button | ✅ | ✅ | ✅ |
| Secondary Button | ✅ | ✅ | ✅ |

---

*End of Design Specification Document*