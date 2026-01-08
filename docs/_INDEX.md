# MyRes Site - Documentation Index

> **Project**: MyRes Site (Modern Portfolio/Resume Web Application)
> **Documentation Generated**: 2026-01-08
> **Source**: `/home/parth/ws/myres-site`
> **Total Documentation**: 7 comprehensive documents (304 KB)

---

## Welcome to MyRes Site Documentation

This documentation provides comprehensive technical information about the MyRes Site portfolio application. Built with React, TypeScript, and Vite, this project features a unique desktop OS-inspired interface for presenting professional portfolio content.

### Documentation Purpose

This documentation is designed for:
- **Contributors** extending or improving the codebase
- **Developers** learning from the architecture and patterns
- **Technical Reviewers** understanding the implementation details
- **AI/LLM Agents** retrieving specific technical information (RAG-optimized)

---

## Quick Navigation

### For New Contributors
Start here to get up and running:
1. [OVERVIEW.md](#overview) - Understand what the project is
2. [DEVELOPMENT.md](#development) - Set up your environment
3. [ARCHITECTURE.md](#architecture) - Learn the system design
4. [COMPONENTS.md](#components) - Explore the components

### For Component Development
- [COMPONENTS.md](#components) - Component API reference
- [UI-PATTERNS.md](#ui-patterns) - shadcn/ui patterns and styling
- [STATE-MANAGEMENT.md](#state-management) - State management patterns

### For Data Management
- [DATA-MODELS.md](#data-models) - Data structures and types
- [DEVELOPMENT.md](#development) - How to update content

### For Debugging
- [STATE-MANAGEMENT.md](#state-management) - State debugging strategies
- [DEVELOPMENT.md](#development) - Troubleshooting guide

---

## Documentation Files

### OVERVIEW.md
**Size**: 9.8 KB | **File**: [OVERVIEW.md](./OVERVIEW.md)

**Purpose**: High-level project introduction and quick reference

**Contents**:
- What is MyRes Site (desktop OS-inspired portfolio)
- Key features and technology stack
- Project structure overview
- Quick start guide
- Architecture overview
- Core concepts introduction

**Read this if**:
- You're new to the project
- You need a quick overview
- You want to understand the project at a glance
- You need to explain the project to others

**Key Sections**:
- Technology stack comparison table
- Project directory structure
- Component hierarchy diagram
- Data structure overview
- Development workflow commands

---

### ARCHITECTURE.md
**Size**: 31 KB | **File**: [ARCHITECTURE.md](./ARCHITECTURE.md)

**Purpose**: Detailed system architecture and design patterns

**Contents**:
- System architecture diagrams
- Design patterns (Container/Presentation, Custom Hooks, Compound Components, etc.)
- Component architecture and hierarchy
- Data flow and event handling
- Animation system architecture
- Routing strategy explanation
- State management philosophy
- Styling architecture
- Performance considerations
- Security considerations
- Extensibility guidelines

**Read this if**:
- You need to understand how the system works
- You're adding major new features
- You're refactoring existing code
- You need to make architectural decisions
- You're reviewing the codebase

**Key Sections**:
- High-level architecture diagram
- Component layer breakdown
- Navigation event flow (step-by-step)
- Animation timeline and system
- Data flow patterns
- Extensibility examples

---

### COMPONENTS.md
**Size**: 27 KB | **File**: [COMPONENTS.md](./COMPONENTS.md)

**Purpose**: Comprehensive component documentation and API reference

**Contents**:
- Component overview and statistics
- Layout components (BootSequence, WindowContainer, Taskbar)
- Screen components (About, Experience, Skills, Projects, Education)
- UI components (shadcn/ui library - 35+ components)
- Component patterns and best practices
- Props reference
- Testing considerations
- Performance optimization
- Accessibility features

**Read this if**:
- You're creating new components
- You need to understand component APIs
- You're debugging component behavior
- You're writing tests for components
- You need component usage examples

**Key Sections**:
- Complete BootSequence implementation breakdown
- WindowContainer flicker animation logic
- Taskbar live clock implementation
- Screen component patterns (animations, layouts)
- shadcn/ui component catalog
- Common component patterns

---

### UI-PATTERNS.md
**Size**: 34 KB | **File**: [UI-PATTERNS.md](./UI-PATTERNS.md)

**Purpose**: UI patterns, styling guidelines, and shadcn/ui usage

**Contents**:
- shadcn/ui philosophy and architecture
- Configuration (components.json explained)
- The cn() utility function
- Component customization patterns
- Styling patterns with Tailwind CSS
- Common UI patterns in the project
- Creating new UI components
- Theme customization
- Variant patterns with class-variance-authority (CVA)
- Accessibility features

**Read this if**:
- You're styling components
- You need to add new shadcn/ui components
- You're customizing UI component variants
- You need to understand theming
- You're implementing responsive designs
- You need accessibility guidance

**Key Sections**:
- Complete cn() function explanation
- shadcn/ui component customization patterns
- CSS variable-based theming system
- CVA variant patterns with Button example
- Custom component classes catalog
- Accessibility checklist

---

### STATE-MANAGEMENT.md
**Size**: 83 KB | **File**: [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md)

**Purpose**: Deep dive into state management patterns and navigation

**Contents**:
- State management philosophy (why no Redux)
- State architecture overview (4 layers)
- Navigation state (useScreenNavigation hook deep dive)
- UI state management patterns
- Data flow patterns
- State update lifecycle (millisecond-accurate timelines)
- State debugging strategies
- Testing state logic
- Future state considerations
- Performance considerations

**Read this if**:
- You're adding new navigation features
- You need to debug state issues
- You're wondering whether to add global state
- You're testing state logic
- You need to understand the navigation system
- You're optimizing performance

**Key Sections**:
- Complete useScreenNavigation implementation breakdown
- Navigation lifecycle with timing diagrams
- State debugging strategies with examples
- Complete test suite examples
- When to add global state (clear thresholds)
- Performance monitoring metrics

---

### DATA-MODELS.md
**Size**: 67 KB | **File**: [DATA-MODELS.md](./DATA-MODELS.md)

**Purpose**: Data structures, types, and content management

**Contents**:
- Data architecture overview
- Content data models (7 structures):
  - Personal information
  - Experiences
  - Skill categories
  - Projects
  - Education
  - Certifications
  - Screens
- Type definitions and TypeScript patterns
- Data validation with Zod schemas
- Data update patterns
- Adding new data (step-by-step guides)
- Data migration strategies
- Type safety best practices
- Future data considerations (API/CMS integration)

**Read this if**:
- You're updating portfolio content
- You're adding new data structures
- You need to understand data types
- You're implementing data validation
- You're planning API integration
- You need type safety guidance

**Key Sections**:
- Complete TypeScript interfaces for all data structures
- Real examples from content.ts
- Zod validation schemas
- Safe update strategies
- Step-by-step guides for adding content
- API/CMS migration strategies

---

### DEVELOPMENT.md
**Size**: 52 KB | **File**: [DEVELOPMENT.md](./DEVELOPMENT.md)

**Purpose**: Development workflow, setup, and contribution guidelines

**Contents**:
- Development environment setup
- Project scripts and commands
- Development workflow
- Coding standards and conventions
- Component development guide
- Styling guidelines
- Testing guidelines
- Build and deployment
- Troubleshooting common issues
- Contributing guidelines

**Read this if**:
- You're setting up the development environment
- You need coding standards
- You're creating new features
- You're troubleshooting issues
- You're preparing to contribute
- You need deployment instructions

**Key Sections**:
- Complete setup instructions
- VS Code extensions and settings
- Coding standards with examples (good vs bad)
- Component and screen creation guides
- Troubleshooting with solutions
- Complete deployment checklist
- Contributing process

---

## Documentation Statistics

| Document | Size | Sections | Lines | Focus Area |
|----------|------|----------|-------|------------|
| OVERVIEW.md | 9.8 KB | 10 | ~250 | Project introduction |
| ARCHITECTURE.md | 31 KB | 12 | ~900 | System design |
| COMPONENTS.md | 27 KB | 12 | ~800 | Component reference |
| UI-PATTERNS.md | 34 KB | 11 | ~1000 | Styling and UI |
| STATE-MANAGEMENT.md | 83 KB | 11 | ~2500 | State and navigation |
| DATA-MODELS.md | 67 KB | 10 | ~2000 | Data structures |
| DEVELOPMENT.md | 52 KB | 11 | ~1500 | Development workflow |
| **Total** | **304 KB** | **77 sections** | **~9000 lines** | **Comprehensive coverage** |

---

## Reading Paths

### Path 1: Quick Start (New Contributor)
```
OVERVIEW.md
    → Quick Start section
    → Project Structure

DEVELOPMENT.md
    → Development Environment Setup
    → Project Scripts

COMPONENTS.md
    → Component Overview
    → Screen Components
```

**Time**: ~30 minutes
**Outcome**: Ready to make first contribution

---

### Path 2: Architecture Deep Dive (Technical Review)
```
OVERVIEW.md
    → Full read

ARCHITECTURE.md
    → Full read
    → Focus on design patterns

STATE-MANAGEMENT.md
    → State Architecture Overview
    → Navigation State

COMPONENTS.md
    → Component Architecture
    → Layout Components
```

**Time**: ~2 hours
**Outcome**: Deep understanding of system architecture

---

### Path 3: UI Development (Frontend Focus)
```
COMPONENTS.md
    → Screen Components
    → Component Patterns

UI-PATTERNS.md
    → Full read
    → Focus on customization patterns

DATA-MODELS.md
    → Content Data Models section

DEVELOPMENT.md
    → Styling Guidelines
```

**Time**: ~90 minutes
**Outcome**: Ready to develop UI components

---

### Path 4: State and Data (Logic Focus)
```
STATE-MANAGEMENT.md
    → Full read
    → Focus on navigation hook

DATA-MODELS.md
    → Full read
    → Focus on type definitions

ARCHITECTURE.md
    → Data Flow section
    → State Management section
```

**Time**: ~2.5 hours
**Outcome**: Deep understanding of state and data management

---

## Project Technology Summary

### Core Technologies
- **Frontend**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12.24.10
- **Routing**: React Router DOM 6.30.1
- **Forms**: React Hook Form 7.61.1 + Zod 3.25.76
- **State**: React Query 5.83 (installed, for future use)

### Development Tools
- **Linting**: ESLint 9.32
- **Type Checking**: TypeScript 5.8.3
- **Package Manager**: npm (also compatible with bun)

---

## Key Architectural Decisions

### 1. Desktop OS Metaphor
The entire application is designed around a desktop operating system concept with boot sequence, windowed interface, and taskbar navigation.

**Why**: Creates a unique, memorable user experience that stands out from typical portfolio sites.

**Documented in**: ARCHITECTURE.md, COMPONENTS.md

---

### 2. Screen-Based Navigation (Not Traditional Routing)
The app uses a single route (`/`) with screen switching instead of multiple routes.

**Why**: Enables smooth transitions, persistent layouts, and better animation control.

**Documented in**: ARCHITECTURE.md (Routing Strategy), STATE-MANAGEMENT.md

---

### 3. No Global State Library
Uses local state with custom hooks instead of Redux/Zustand.

**Why**: Simple state requirements, shallow component tree, better performance.

**When to reconsider**: User authentication, real-time collaboration, complex cross-screen state.

**Documented in**: STATE-MANAGEMENT.md (Philosophy section)

---

### 4. Static Data with Direct Imports
Portfolio content is in `src/data/content.ts` and components import it directly.

**Why**: No prop drilling, easy to update, type-safe, suitable for static portfolios.

**Future consideration**: API/CMS integration for dynamic content.

**Documented in**: DATA-MODELS.md, ARCHITECTURE.md (Data Flow)

---

### 5. shadcn/ui (Copy-Paste Components)
Uses shadcn/ui components copied into the codebase instead of a component library package.

**Why**: Full customization control, no library lock-in, better bundle size control.

**Documented in**: UI-PATTERNS.md, COMPONENTS.md (UI Components section)

---

## Common Tasks Quick Reference

### Update Portfolio Content
1. Edit `src/data/content.ts`
2. No component changes needed (data-driven)
3. Test in development mode

**Details**: DATA-MODELS.md → Adding New Data

---

### Add New Screen
1. Create component in `src/components/screens/`
2. Add to `screens` array in `data/content.ts`
3. Add case in `Index.tsx` renderScreen
4. Update ScreenId type

**Details**: COMPONENTS.md → Extensibility, DEVELOPMENT.md → Component Development

---

### Add New shadcn/ui Component
```bash
npx shadcn@latest add [component-name]
```

**Details**: UI-PATTERNS.md → Creating New UI Components

---

### Debug Navigation Issue
1. Check `useScreenNavigation` hook state
2. Verify `isTransitioning` state
3. Check navigation callback flow
4. Review STATE-MANAGEMENT.md debugging section

**Details**: STATE-MANAGEMENT.md → State Debugging

---

### Customize Theme Colors
1. Update CSS variables in `src/index.css`
2. Update `tailwind.config.ts` color definitions
3. Test in both light mode (if added)

**Details**: UI-PATTERNS.md → Theme Customization

---

## Documentation Maintenance

### Updating Documentation

When making significant code changes, update relevant documentation sections:

| Change Type | Update These Docs |
|-------------|-------------------|
| New component | COMPONENTS.md, ARCHITECTURE.md (if architectural) |
| New data structure | DATA-MODELS.md |
| State management changes | STATE-MANAGEMENT.md |
| New UI pattern | UI-PATTERNS.md |
| Build/deployment changes | DEVELOPMENT.md |
| Architecture changes | ARCHITECTURE.md, OVERVIEW.md |

### Documentation Style Guidelines

All documentation follows these principles:
- **Self-contained sections**: Each section can be understood independently
- **File path references**: All code references include `file:line` format
- **Code examples**: Real examples from the codebase
- **RAG-optimized**: Structured for LLM retrieval
- **Cross-referenced**: Links to related sections and documents

---

## Getting Help

### Documentation Questions
- Search this index for relevant document
- Use document table of contents for navigation
- Check "Related Documentation" sections in each file

### Code Questions
- Check COMPONENTS.md for component APIs
- Check STATE-MANAGEMENT.md for state logic
- Check DEVELOPMENT.md for troubleshooting

### Contributing Questions
- Read DEVELOPMENT.md → Contributing Guidelines
- Follow coding standards in DEVELOPMENT.md
- Review architecture in ARCHITECTURE.md before major changes

---

## Future Documentation Needs

As the project evolves, consider adding:
- **API-INTEGRATION.md** - When adding backend API
- **TESTING.md** - Comprehensive testing guide when test suite is added
- **DEPLOYMENT.md** - Platform-specific deployment guides
- **PERFORMANCE.md** - Performance optimization techniques
- **ACCESSIBILITY.md** - Detailed accessibility guidelines
- **SECURITY.md** - Security best practices and audit results

---

## Document Generation Information

**Generated By**: Claude Code - codebase-documenter skill
**Generation Date**: 2026-01-08
**Documentation Version**: 1.0.0
**Last Updated**: 2026-01-08

**Generation Process**:
1. Codebase analysis and structure mapping
2. Component and architecture documentation
3. State and data model documentation
4. UI patterns and styling documentation
5. Development workflow documentation
6. Index generation and cross-referencing

**RAG Optimization**:
- Self-contained sections for independent retrieval
- Descriptive headers optimized for semantic search
- Code examples with file paths for precise reference
- Clear section boundaries for chunk-based retrieval
- Cross-references for related information discovery

---

## Feedback and Improvements

This documentation is designed to be comprehensive and maintainable. As the project evolves, documentation should evolve with it.

### How to Improve This Documentation
1. Identify outdated sections
2. Add missing examples
3. Clarify confusing explanations
4. Add new sections for new features
5. Update statistics and metrics
6. Improve code examples

### Documentation Best Practices
- Keep examples up-to-date with actual code
- Include screenshots for visual components (future enhancement)
- Add diagrams where helpful
- Link to external resources when relevant
- Maintain consistent formatting and structure

---

**Ready to dive in? Start with [OVERVIEW.md](./OVERVIEW.md) for a high-level introduction, then explore specific topics based on your needs.**
