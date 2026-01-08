# Data Models Documentation

> **Project**: MyRes Site
> **Generated**: 2026-01-08
> **Source**: `/home/parth/ws/myres-site`
> **Related Docs**: [OVERVIEW.md](./OVERVIEW.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md)

---

## Table of Contents

- [Data Architecture Overview](#data-architecture-overview)
- [Content Data Models](#content-data-models)
  - [Personal Information](#personal-information)
  - [Experiences](#experiences)
  - [Skill Categories](#skill-categories)
  - [Projects](#projects)
  - [Education](#education)
  - [Certifications](#certifications)
  - [Screens](#screens)
- [Type Definitions](#type-definitions)
- [Data Validation](#data-validation)
- [Data Update Patterns](#data-update-patterns)
- [Adding New Data](#adding-new-data)
- [Data Migration Strategies](#data-migration-strategies)
- [Type Safety Best Practices](#type-safety-best-practices)
- [Future Data Considerations](#future-data-considerations)

---

## Data Architecture Overview

### Data Layer Design

MyRes Site follows a **centralized static data** approach where all portfolio content is stored in a single source of truth: `/src/data/content.ts`. This architectural decision provides several benefits:

```
┌──────────────────────────────────────────────────────────────┐
│                    Data Layer Architecture                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Static Data Source (data/content.ts)                  │  │
│  │  • personalInfo: Object                                │  │
│  │  • experiences: Array<Experience>                      │  │
│  │  • skillCategories: Array<SkillCategory>               │  │
│  │  • projects: Array<Project>                            │  │
│  │  • education: Array<Education>                         │  │
│  │  • certifications: Array<Certification>                │  │
│  │  • screens: Array<Screen>                              │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                       │
│                       ▼                                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Component Layer (Import & Consume)                    │  │
│  │  • AboutScreen → personalInfo                          │  │
│  │  • ExperienceScreen → experiences                      │  │
│  │  • SkillsScreen → skillCategories                      │  │
│  │  • ProjectsScreen → projects                           │  │
│  │  • EducationScreen → education, certifications         │  │
│  │  • Taskbar → screens                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Core Design Principles

1. **Single Source of Truth**: All content in one file for easy maintenance
2. **Type Inference**: TypeScript infers types from data structure
3. **Immutable Data**: Export as const for runtime immutability
4. **Direct Imports**: Components import data directly (no prop drilling)
5. **Validation Ready**: Structure supports future Zod schema validation

### Data File Location

**Source**: `/src/data/content.ts`

All portfolio data is exported from this single file:

```typescript
// All exports from content.ts
export const personalInfo = { /* ... */ };
export const experiences = [ /* ... */ ];
export const skillCategories = [ /* ... */ ];
export const projects = [ /* ... */ ];
export const education = [ /* ... */ ];
export const certifications = [ /* ... */ ];
export const screens = [ /* ... */ ];
```

### Why Static Data?

Current implementation uses static data because:

1. **Portfolio content changes infrequently** - No need for real-time updates
2. **Performance** - No API calls, instant data availability
3. **Simplicity** - No backend infrastructure required
4. **Type Safety** - TypeScript can infer exact types
5. **Version Control** - Content changes tracked in git
6. **Build Optimization** - Data bundled and tree-shaken at build time

---

## Content Data Models

### Personal Information

Personal information represents the portfolio owner's core identity and contact details.

**Source**: `/src/data/content.ts:1-12`

#### Structure

```typescript
export const personalInfo = {
  name: "Alex Chen",
  title: "DevOps Engineer",
  headline: {
    line1: "Architecting",
    line2: "Resilient Systems"
  },
  bio: "I bridge the gap between complex code and reliable operations. Specializing in cloud infrastructure, automated CI/CD pipelines, and scalable Kubernetes environments for high-growth tech teams.",
  email: "alex.chen@email.com",
  linkedin: "https://linkedin.com/in/alexchen",
  github: "https://github.com/alexchen"
};
```

#### TypeScript Interface

```typescript
interface PersonalInfo {
  /** Full name of the portfolio owner */
  name: string;

  /** Professional title/role */
  title: string;

  /** Two-line headline for hero section */
  headline: {
    line1: string;
    line2: string;
  };

  /** Professional bio/summary (1-2 sentences) */
  bio: string;

  /** Contact email address */
  email: string;

  /** LinkedIn profile URL */
  linkedin: string;

  /** GitHub profile URL */
  github: string;
}
```

#### Usage Example

```typescript
// In AboutScreen component
import { personalInfo } from "@/data/content";

export function AboutScreen() {
  return (
    <div>
      <h1>{personalInfo.name}</h1>
      <p>{personalInfo.title}</p>
      <div>
        <span>{personalInfo.headline.line1}</span>
        <span>{personalInfo.headline.line2}</span>
      </div>
      <p>{personalInfo.bio}</p>
      <a href={`mailto:${personalInfo.email}`}>Contact</a>
    </div>
  );
}
```

#### Field Constraints

- **name**: 2-50 characters, required
- **title**: 5-100 characters, required
- **headline.line1/line2**: 5-50 characters each, required
- **bio**: 50-500 characters, required
- **email**: Valid email format, required
- **linkedin**: Valid URL starting with https://, optional
- **github**: Valid URL starting with https://, optional

#### Extension Points

To add new personal info fields:

```typescript
export const personalInfo = {
  // ... existing fields
  location: "San Francisco, CA",        // Add location
  phone: "+1-555-0123",                 // Add phone
  website: "https://alexchen.dev",      // Add personal website
  twitter: "https://twitter.com/alex",  // Add Twitter
  resume: "/docs/resume.pdf"            // Add resume link
};
```

---

### Experiences

Work experience entries representing professional history in reverse chronological order.

**Source**: `/src/data/content.ts:14-54`

#### Structure

```typescript
export const experiences = [
  {
    id: 1,
    title: "Senior DevOps Engineer",
    company: "TECHFLOW SYSTEMS",
    period: "2021 - Present",
    location: "San Francisco, CA",
    achievements: [
      "Architected and maintained multi-region AWS infrastructure using Terraform, reducing latency by 40% for global users.",
      "Implemented GitOps workflows with ArgoCD and Kubernetes, increasing deployment frequency from weekly to daily.",
      "Led the migration from monolithic architecture to microservices, improving system scalability and fault tolerance."
    ],
    technologies: ["AWS", "Kubernetes", "Terraform", "Python"]
  },
  {
    id: 2,
    title: "Cloud Infrastructure Engineer",
    company: "NEBULON DATA",
    period: "2019 - 2021",
    location: "Austin, TX",
    achievements: [
      "Automated server provisioning and configuration management using Ansible, cutting setup time by 75%.",
      "Designed and managed ELK stack logging pipelines to process 500GB+ of daily log data.",
      "Hardened CI/CD pipelines (Jenkins) and implemented automated security scanning (SonarQube)."
    ],
    technologies: ["Jenkins", "Ansible", "Docker", "ELK"]
  },
  {
    id: 3,
    title: "Systems Administrator",
    company: "CORESERVE SOLUTIONS",
    period: "2017 - 2019",
    location: "Denver, CO",
    achievements: [
      "Managed Linux server fleet (Ubuntu/CentOS) ensuring 99.9% uptime for critical business applications.",
      "Scripted routine maintenance tasks in Bash, eliminating manual errors and reducing support tickets.",
      "Coordinated network security updates and firewall configurations across 3 physical data centers."
    ],
    technologies: ["Linux", "Bash", "MySQL", "Nginx"]
  }
];
```

#### TypeScript Interface

```typescript
interface Experience {
  /** Unique identifier for the experience entry */
  id: number;

  /** Job title/position */
  title: string;

  /** Company name (typically UPPERCASE for styling) */
  company: string;

  /** Time period (e.g., "2021 - Present", "2019 - 2021") */
  period: string;

  /** Work location (city, state/country) */
  location: string;

  /** Array of key achievements/responsibilities (3-5 items recommended) */
  achievements: string[];

  /** Array of key technologies used (3-6 items recommended) */
  technologies: string[];
}

type Experiences = Experience[];
```

#### Usage Example

```typescript
// In ExperienceScreen component
import { experiences } from "@/data/content";

export function ExperienceScreen() {
  return (
    <div>
      {experiences.map((exp) => (
        <article key={exp.id}>
          <h3>{exp.title}</h3>
          <p>{exp.company}</p>
          <p>{exp.period} • {exp.location}</p>
          <ul>
            {exp.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
          <div>
            {exp.technologies.map((tech, i) => (
              <span key={i}>{tech}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
```

#### Field Constraints

- **id**: Unique positive integer, sequential, required
- **title**: 5-100 characters, required
- **company**: 2-100 characters, required
- **period**: Valid date range format, required
- **location**: 5-100 characters, required
- **achievements**: Array of 2-8 strings, each 20-300 characters
- **technologies**: Array of 2-10 strings, each 2-50 characters

#### Best Practices

1. **Ordering**: List experiences in reverse chronological order (most recent first)
2. **Achievements**: Start with action verbs (Architected, Implemented, Led, etc.)
3. **Metrics**: Include quantifiable results when possible (40% reduction, 500GB+, etc.)
4. **Technologies**: List 3-6 most relevant technologies per role
5. **Company Names**: Use UPPERCASE for visual consistency in design
6. **ID Management**: Keep IDs sequential and unique

#### Adding New Experience

```typescript
export const experiences = [
  // Add new experience at the beginning (most recent)
  {
    id: 4,  // Increment ID
    title: "Lead DevOps Architect",
    company: "NEW COMPANY INC",
    period: "2024 - Present",
    location: "Remote",
    achievements: [
      "Achievement 1 with metrics",
      "Achievement 2 with impact",
      "Achievement 3 with results"
    ],
    technologies: ["Tech1", "Tech2", "Tech3"]
  },
  // ... existing experiences
];
```

---

### Skill Categories

Skill categories organize technical skills into logical groups with visual icons.

**Source**: `/src/data/content.ts:56-106`

#### Structure

```typescript
export const skillCategories = [
  {
    id: "cloud",
    title: "CLOUD & INFRASTRUCTURE",
    icon: "cloud",
    skills: [
      { name: "AWS (EC2, S3, RDS)", icon: "check" },
      { name: "Google Cloud Platform", icon: "check" },
      { name: "Azure", icon: "check" },
      { name: "Terraform", icon: "check" },
      { name: "Ansible", icon: "check" },
      { name: "CloudFormation", icon: "check" }
    ]
  },
  {
    id: "containerization",
    title: "CONTAINERIZATION",
    icon: "container",
    skills: [
      { name: "Docker", icon: "box" },
      { name: "Kubernetes", icon: "box" },
      { name: "Helm Charts", icon: "box" },
      { name: "OpenShift", icon: "box" },
      { name: "Podman", icon: "box" }
    ]
  },
  {
    id: "cicd",
    title: "CI/CD & DEVOPS TOOLS",
    icon: "terminal",
    skills: [
      { name: "Jenkins", icon: "terminal" },
      { name: "GitLab CI", icon: "terminal" },
      { name: "GitHub Actions", icon: "terminal" },
      { name: "ArgoCD", icon: "terminal" },
      { name: "CircleCI", icon: "terminal" }
    ]
  },
  {
    id: "monitoring",
    title: "MONITORING & LOGGING",
    icon: "chart",
    skills: [
      { name: "Prometheus", icon: "chart" },
      { name: "Grafana", icon: "chart" },
      { name: "ELK Stack", icon: "chart" },
      { name: "Datadog", icon: "chart" },
      { name: "PagerDuty", icon: "chart" }
    ]
  }
];
```

#### TypeScript Interface

```typescript
interface Skill {
  /** Skill name (2-50 characters) */
  name: string;

  /** Icon identifier for visual representation */
  icon: string;
}

interface SkillCategory {
  /** Unique identifier (lowercase, kebab-case) */
  id: string;

  /** Category title (UPPERCASE for styling) */
  title: string;

  /** Icon identifier for category header */
  icon: string;

  /** Array of skills in this category (3-10 recommended) */
  skills: Skill[];
}

type SkillCategories = SkillCategory[];
```

#### Available Icons

Icons are mapped from Lucide React icon library. Common icons used:

- **Category icons**: cloud, container, terminal, chart, code, database, shield, server
- **Skill icons**: check, box, terminal, chart, code, database, lock, cpu

**Icon Mapping**: See component implementation for full icon mapping.

#### Usage Example

```typescript
// In SkillsScreen component
import { skillCategories } from "@/data/content";

export function SkillsScreen() {
  return (
    <div>
      {skillCategories.map((category) => (
        <section key={category.id}>
          <h2>
            <Icon name={category.icon} />
            {category.title}
          </h2>
          <ul>
            {category.skills.map((skill, i) => (
              <li key={i}>
                <Icon name={skill.icon} />
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

#### Field Constraints

- **id**: Unique string, lowercase, kebab-case, 3-30 characters
- **title**: 5-50 characters, typically UPPERCASE
- **icon**: Valid icon name from Lucide React
- **skills**: Array of 3-15 skill objects
- **skill.name**: 2-50 characters, can include version info in parentheses
- **skill.icon**: Valid icon name from Lucide React

#### Best Practices

1. **Grouping**: Group skills by technology domain or use case
2. **Ordering**: Place most important categories first
3. **Skill Count**: Aim for 4-8 skills per category for visual balance
4. **Naming**: Use clear, industry-standard skill names
5. **Icons**: Keep icons consistent within each category
6. **Detail Level**: Include specific tools/versions in parentheses when relevant

#### Adding New Category

```typescript
export const skillCategories = [
  // ... existing categories
  {
    id: "security",  // Unique ID
    title: "SECURITY & COMPLIANCE",
    icon: "shield",
    skills: [
      { name: "OAuth 2.0", icon: "lock" },
      { name: "Vault (HashiCorp)", icon: "lock" },
      { name: "SIEM Solutions", icon: "lock" },
      { name: "Penetration Testing", icon: "lock" },
      { name: "SOC2 Compliance", icon: "check" }
    ]
  }
];
```

---

### Projects

Project entries showcase portfolio work with descriptions, technologies, and call-to-action links.

**Source**: `/src/data/content.ts:108-157`

#### Structure

```typescript
export const projects = [
  {
    id: 1,
    filename: "cloud_migration.v2",
    title: "Enterprise Cloud Migration",
    description: "Orchestrated the zero-downtime migration of a monolithic legacy ERP system to AWS microservices architecture.",
    technologies: ["AWS", "Terraform", "Docker"],
    cta: { text: "View Case Study", icon: "external", url: "#" }
  },
  {
    id: 2,
    filename: "kube_autoscaler.yml",
    title: "K8s Custom Autoscaler",
    description: "Developed a custom Kubernetes metrics adapter to scale pods based on real-time RabbitMQ queue depth.",
    technologies: ["Go", "Kubernetes", "Helm"],
    cta: { text: "View Repo", icon: "github", url: "#" }
  },
  {
    id: 3,
    filename: "pipeline_v4.jenkins",
    title: "GitOps CI/CD Pipeline",
    description: "Implemented a fully automated GitOps workflow reducing deployment time from 2 hours to 15 minutes.",
    technologies: ["ArgoCD", "GitLab CI", "Ansible"],
    cta: { text: "View Details", icon: "arrow", url: "#" }
  },
  {
    id: 4,
    filename: "security_audit.log",
    title: "Infrastructure Hardening",
    description: "Comprehensive security audit and remediation of production infrastructure, achieving SOC2 compliance.",
    technologies: ["Python", "Vault", "AWS IAM"],
    cta: { text: "View Report", icon: "file", url: "#" }
  },
  {
    id: 5,
    filename: "monitor_dash.json",
    title: "Observability Stack",
    description: "Centralized logging and monitoring solution processing 5TB of logs daily with sub-second query latency.",
    technologies: ["ELK", "Prometheus", "Grafana"],
    cta: { text: "View Dashboards", icon: "monitor", url: "#" }
  },
  {
    id: 6,
    filename: "iac_library.mod",
    title: "IaC Module Library",
    description: "Created a standardized library of reusable Terraform modules adopted by 5 different engineering teams.",
    technologies: ["Terraform", "HCL", "Git"],
    cta: { text: "View Library", icon: "book", url: "#" }
  }
];
```

#### TypeScript Interface

```typescript
interface CallToAction {
  /** CTA button text */
  text: string;

  /** Icon identifier for button */
  icon: string;

  /** Target URL (can be # for placeholder) */
  url: string;
}

interface Project {
  /** Unique identifier */
  id: number;

  /** Filename displayed in project card (adds tech aesthetic) */
  filename: string;

  /** Project title */
  title: string;

  /** Project description (1-2 sentences) */
  description: string;

  /** Array of key technologies (3-4 recommended) */
  technologies: string[];

  /** Call-to-action button configuration */
  cta: CallToAction;
}

type Projects = Project[];
```

#### Usage Example

```typescript
// In ProjectsScreen component
import { projects } from "@/data/content";

export function ProjectsScreen() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <article key={project.id} className="project-card">
          <div className="filename">{project.filename}</div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="technologies">
            {project.technologies.map((tech, i) => (
              <span key={i}>{tech}</span>
            ))}
          </div>
          <a href={project.cta.url}>
            <Icon name={project.cta.icon} />
            {project.cta.text}
          </a>
        </article>
      ))}
    </div>
  );
}
```

#### Field Constraints

- **id**: Unique positive integer, sequential, required
- **filename**: 5-50 characters, file extension optional but recommended
- **title**: 10-100 characters, required
- **description**: 50-300 characters, required
- **technologies**: Array of 2-5 strings, each 2-30 characters
- **cta.text**: 5-30 characters, action-oriented
- **cta.icon**: Valid icon name
- **cta.url**: Valid URL or "#" for placeholder

#### CTA Icon Options

Common CTA icons:
- **external**: External link (generic)
- **github**: GitHub repository
- **arrow**: Internal navigation
- **file**: Documentation/report
- **monitor**: Dashboard/live view
- **book**: Library/documentation
- **video**: Video presentation
- **play**: Demo/interactive

#### Best Practices

1. **Filename**: Use realistic file extensions (.yml, .json, .log, .py, etc.) for authenticity
2. **Title**: Keep concise but descriptive (3-8 words)
3. **Description**: Focus on impact and results, include metrics when possible
4. **Technologies**: List 3-4 most important technologies
5. **CTA**: Make button text action-oriented (View, Explore, Read, Watch)
6. **Ordering**: Place most impressive/recent projects first

#### Adding New Project

```typescript
export const projects = [
  // Add new project at appropriate position
  {
    id: 7,  // Increment ID
    filename: "new_project.py",
    title: "Project Title",
    description: "Impact-focused description with metrics and results achieved.",
    technologies: ["Tech1", "Tech2", "Tech3"],
    cta: {
      text: "View Details",
      icon: "external",
      url: "https://example.com/project"
    }
  },
  // ... existing projects
];
```

---

### Education

Education entries represent academic credentials and achievements.

**Source**: `/src/data/content.ts:159-176`

#### Structure

```typescript
export const education = [
  {
    id: 1,
    institution: "Polytechnic Institute of Technology",
    degree: "Master of Science in Cloud Computing",
    period: "2018 - 2020",
    location: "Boston, MA",
    description: "Specialized in distributed systems and cloud infrastructure. Thesis focused on optimizing container orchestration latencies in hybrid cloud environments."
  },
  {
    id: 2,
    institution: "State University",
    degree: "Bachelor of Science in Computer Science",
    period: "2014 - 2018",
    location: "Austin, TX",
    description: "Core curriculum in algorithms, data structures, and network security. Graduated Cum Laude. Dean's List 2016-2018. Member of ACM Student Chapter."
  }
];
```

#### TypeScript Interface

```typescript
interface Education {
  /** Unique identifier */
  id: number;

  /** Institution name */
  institution: string;

  /** Degree title with major/specialization */
  degree: string;

  /** Time period (e.g., "2018 - 2020") */
  period: string;

  /** Institution location (city, state/country) */
  location: string;

  /** Description including specialization, thesis, honors, etc. (2-4 sentences) */
  description: string;
}

type Education = Education[];
```

#### Usage Example

```typescript
// In EducationScreen component
import { education } from "@/data/content";

export function EducationScreen() {
  return (
    <div>
      <section>
        <h2>Education</h2>
        {education.map((edu) => (
          <article key={edu.id}>
            <h3>{edu.degree}</h3>
            <p>{edu.institution}</p>
            <p>{edu.period} • {edu.location}</p>
            <p>{edu.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
```

#### Field Constraints

- **id**: Unique positive integer, sequential, required
- **institution**: 5-100 characters, required
- **degree**: 10-150 characters, required
- **period**: Valid date range format, required
- **location**: 5-100 characters, required
- **description**: 50-500 characters, required

#### Best Practices

1. **Ordering**: List degrees in reverse chronological order (most recent first)
2. **Degree Format**: Include degree type, major, and specialization
3. **Description**: Include thesis topic, honors, GPA (if notable), relevant coursework
4. **Achievements**: Mention Dean's List, scholarships, publications, clubs
5. **Relevance**: Focus on aspects relevant to your professional focus

#### Adding New Education Entry

```typescript
export const education = [
  // Add new degree at beginning (most recent)
  {
    id: 3,  // Increment ID
    institution: "Institution Name",
    degree: "Degree Type in Major",
    period: "2020 - 2022",
    location: "City, State",
    description: "Specialization details. Thesis/capstone info. Honors and achievements."
  },
  // ... existing education
];
```

---

### Certifications

Professional certifications and credentials with issuer and date information.

**Source**: `/src/data/content.ts:178-207`

#### Structure

```typescript
export const certifications = [
  {
    id: 1,
    name: "AWS Solutions Architect",
    level: "Professional Level",
    issuer: "Issued: Aug 2023",
    icon: "cloud"
  },
  {
    id: 2,
    name: "CKA: Kubernetes Admin",
    level: "CNCF Certified",
    issuer: "Issued: Jan 2023",
    icon: "container"
  },
  {
    id: 3,
    name: "Terraform Associate",
    level: "HashiCorp",
    issuer: "Issued: Nov 2022",
    icon: "code"
  },
  {
    id: 4,
    name: "CompTIA Security+",
    level: "Security Operations",
    issuer: "Issued: Jun 2021",
    icon: "shield"
  }
];
```

#### TypeScript Interface

```typescript
interface Certification {
  /** Unique identifier */
  id: number;

  /** Certification name/title */
  name: string;

  /** Certification level or issuing organization */
  level: string;

  /** Issue date information (format: "Issued: MMM YYYY") */
  issuer: string;

  /** Icon identifier representing certification domain */
  icon: string;
}

type Certifications = Certification[];
```

#### Usage Example

```typescript
// In EducationScreen component (certifications section)
import { certifications } from "@/data/content";

export function EducationScreen() {
  return (
    <div>
      <section>
        <h2>Certifications</h2>
        <div className="grid grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <article key={cert.id}>
              <Icon name={cert.icon} />
              <h3>{cert.name}</h3>
              <p>{cert.level}</p>
              <p>{cert.issuer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
```

#### Field Constraints

- **id**: Unique positive integer, sequential, required
- **name**: 5-100 characters, required
- **level**: 5-100 characters, required
- **issuer**: Format "Issued: MMM YYYY", required
- **icon**: Valid icon name from available set

#### Common Icons

- **cloud**: Cloud platforms (AWS, Azure, GCP)
- **container**: Container/orchestration (Kubernetes, Docker)
- **code**: Development/programming certifications
- **shield**: Security certifications
- **database**: Database certifications
- **server**: Infrastructure/systems certifications
- **terminal**: DevOps/automation certifications

#### Best Practices

1. **Ordering**: List certifications by importance or recency
2. **Name**: Include certification abbreviation if widely known (e.g., "CKA:")
3. **Level**: Specify certification level (Professional, Associate, Expert)
4. **Issuer**: Always include issue date for credibility
5. **Expiry**: Consider adding expiry date for time-limited certifications
6. **Verification**: Link to verification page when available (future enhancement)

#### Adding New Certification

```typescript
export const certifications = [
  // Add new certification at beginning (most recent)
  {
    id: 5,  // Increment ID
    name: "Certification Name",
    level: "Level/Organization",
    issuer: "Issued: MMM YYYY",
    icon: "appropriate-icon"
  },
  // ... existing certifications
];
```

#### Future Enhancement: Expiry Tracking

```typescript
// Enhanced structure with expiry
interface Certification {
  id: number;
  name: string;
  level: string;
  issuer: string;
  issued: string;      // "2023-08"
  expires?: string;    // "2026-08" (optional)
  verificationUrl?: string;  // Link to verify
  icon: string;
}
```

---

### Screens

Screen definitions that configure the navigation system and window titles.

**Source**: `/src/data/content.ts:209-215`

#### Structure

```typescript
export const screens = [
  { id: "about", label: "About", windowTitle: "ALEX_CHEN_PORTFOLIO.EXE", icon: "terminal" },
  { id: "experience", label: "Experience", windowTitle: "EXPERIENCE_LOG.TXT", icon: "building" },
  { id: "skills", label: "Skills", windowTitle: "TECHNICAL_SKILLS_MATRIX.EXE", icon: "settings" },
  { id: "projects", label: "Projects", windowTitle: "Project Explorer", icon: "folder" },
  { id: "education", label: "Education", windowTitle: "System Credentials", icon: "disc" }
];
```

#### TypeScript Interface

```typescript
interface Screen {
  /** Screen identifier (must match ScreenId type) */
  id: ScreenId;

  /** Label for navigation button */
  label: string;

  /** Window title bar text (styled for retro/tech aesthetic) */
  windowTitle: string;

  /** Icon identifier for navigation button */
  icon: string;
}

type Screens = Screen[];

// ScreenId is defined in useScreenNavigation.ts
type ScreenId = "about" | "experience" | "skills" | "projects" | "education";
```

#### Relationship with ScreenId Type

**Critical**: The `screens` array and `ScreenId` type must be kept in sync.

**ScreenId Type**: `/src/hooks/useScreenNavigation.ts:4`

```typescript
export type ScreenId = "about" | "experience" | "skills" | "projects" | "education";
```

Every `screen.id` must exist in the `ScreenId` union type, and vice versa.

#### Usage Example

```typescript
// In Taskbar component
import { screens } from "@/data/content";

export function Taskbar({ currentScreen, onNavigate }) {
  return (
    <nav>
      {screens.map((screen) => (
        <button
          key={screen.id}
          onClick={() => onNavigate(screen.id)}
          className={currentScreen === screen.id ? "active" : ""}
        >
          <Icon name={screen.icon} />
          <span>{screen.label}</span>
        </button>
      ))}
    </nav>
  );
}

// In WindowContainer component
import { screens } from "@/data/content";

export function WindowContainer({ currentScreen }) {
  const screen = screens.find(s => s.id === currentScreen);
  return (
    <div className="window">
      <div className="title-bar">
        <Icon name={screen?.icon} />
        <span>{screen?.windowTitle}</span>
      </div>
    </div>
  );
}
```

#### Field Constraints

- **id**: Must be valid ScreenId literal, lowercase, kebab-case
- **label**: 3-20 characters, title case, required
- **windowTitle**: 5-100 characters, can include file extensions (.EXE, .TXT)
- **icon**: Valid icon name from Lucide React

#### Common Icons

- **terminal**: Command line/coding
- **building**: Professional/corporate
- **settings**: Technical/configuration
- **folder**: Files/projects
- **disc**: Storage/credentials
- **user**: Profile/personal
- **briefcase**: Work/portfolio
- **award**: Achievements/certifications

#### Best Practices

1. **Ordering**: Screens appear in taskbar in array order (logical flow matters)
2. **Window Title**: Use creative, tech-themed titles (e.g., .EXE, .TXT, .SYS)
3. **Label**: Keep short and clear for navigation buttons
4. **Icons**: Choose icons that clearly represent content
5. **Consistency**: Maintain consistent naming style across screens

#### Adding New Screen

**Step 1**: Update ScreenId type

```typescript
// src/hooks/useScreenNavigation.ts
export type ScreenId =
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "contact";  // Add new screen ID
```

**Step 2**: Add to screens array

```typescript
// src/data/content.ts
export const screens = [
  // ... existing screens
  {
    id: "contact",
    label: "Contact",
    windowTitle: "CONTACT_FORM.EXE",
    icon: "mail"
  }
];
```

**Step 3**: Create screen component

```typescript
// src/components/screens/ContactScreen.tsx
export function ContactScreen() {
  return <div>Contact content</div>;
}
```

**Step 4**: Add to render function

```typescript
// src/pages/Index.tsx
const renderScreen = () => {
  switch (currentScreen) {
    // ... existing cases
    case "contact":
      return <ContactScreen />;
  }
};
```

---

## Type Definitions

### Type Inference vs. Explicit Types

MyRes Site uses **type inference** for data structures, meaning TypeScript automatically determines types from the data. This approach provides:

1. **Less boilerplate**: No need to maintain separate interface definitions
2. **Always in sync**: Types automatically update when data changes
3. **Ease of refactoring**: Change data structure once, types update everywhere

### Inferring Types from Data

```typescript
// Data with inferred type
export const personalInfo = {
  name: "Alex Chen",
  title: "DevOps Engineer",
  // ...
};

// TypeScript infers:
// typeof personalInfo = {
//   name: string;
//   title: string;
//   ...
// }

// Use 'typeof' to extract the type
type PersonalInfo = typeof personalInfo;
```

### Using Inferred Types

```typescript
// In a component that receives personalInfo
interface Props {
  personal: typeof personalInfo;
}

export function AboutCard({ personal }: Props) {
  return <div>{personal.name}</div>;
}
```

### Array Element Types

Extract the type of array elements:

```typescript
// Get type of single experience
type Experience = typeof experiences[number];

// Get type of single skill category
type SkillCategory = typeof skillCategories[number];

// Get type of single project
type Project = typeof projects[number];

// Get type of single education entry
type Education = typeof education[number];

// Get type of single certification
type Certification = typeof certifications[number];

// Get type of single screen
type Screen = typeof screens[number];
```

### Nested Type Extraction

Extract types from nested structures:

```typescript
// Get Headline type from personalInfo
type Headline = typeof personalInfo["headline"];
// Result: { line1: string; line2: string }

// Get Skill type from skill category
type Skill = typeof skillCategories[number]["skills"][number];
// Result: { name: string; icon: string }

// Get CallToAction type from project
type CallToAction = typeof projects[number]["cta"];
// Result: { text: string; icon: string; url: string }
```

### ScreenId Type

**Special Case**: ScreenId is explicitly defined to enable type-safe navigation.

**Source**: `/src/hooks/useScreenNavigation.ts:4`

```typescript
export type ScreenId = "about" | "experience" | "skills" | "projects" | "education";
```

This type must be manually updated when adding new screens. It's a union of string literals representing valid screen identifiers.

### Creating Utility Types

```typescript
// Utility type: Make all fields optional
type PartialPersonalInfo = Partial<typeof personalInfo>;

// Utility type: Pick specific fields
type ContactInfo = Pick<typeof personalInfo, "email" | "linkedin" | "github">;

// Utility type: Make all fields readonly
type ImmutableExperience = Readonly<typeof experiences[number]>;

// Utility type: Array of specific type
type Experiences = typeof experiences;  // Experience[]
```

### Type Guards

Create type guards for runtime type checking:

```typescript
// Type guard for ScreenId
function isScreenId(value: string): value is ScreenId {
  return ["about", "experience", "skills", "projects", "education"].includes(value);
}

// Usage
const screenId = getScreenIdFromUrl();
if (isScreenId(screenId)) {
  // TypeScript knows screenId is ScreenId type
  navigateToScreen(screenId);
}
```

### Generic Types for Data

```typescript
// Generic type for items with IDs
type HasId = { id: number };

// Type for any data structure with ID
type IdentifiableData<T extends HasId> = T[];

// Usage
type IdentifiableExperiences = IdentifiableData<typeof experiences[number]>;
type IdentifiableProjects = IdentifiableData<typeof projects[number]>;
```

---

## Data Validation

### Why Validation?

Currently, data is validated only by TypeScript at compile time. Runtime validation is recommended for:

1. **User input**: When accepting data from forms
2. **API responses**: When fetching from external sources
3. **URL parameters**: When accepting screen IDs from URLs
4. **Local storage**: When reading persisted data

### Zod for Runtime Validation

The project includes Zod (`zod@^3.25.76`) for runtime schema validation.

**Package**: `package.json:63`

```json
{
  "dependencies": {
    "zod": "^3.25.76"
  }
}
```

### Validation Schemas

Create Zod schemas that mirror your TypeScript types:

#### Personal Information Schema

```typescript
import { z } from "zod";

const personalInfoSchema = z.object({
  name: z.string().min(2).max(50),
  title: z.string().min(5).max(100),
  headline: z.object({
    line1: z.string().min(5).max(50),
    line2: z.string().min(5).max(50)
  }),
  bio: z.string().min(50).max(500),
  email: z.string().email(),
  linkedin: z.string().url().startsWith("https://"),
  github: z.string().url().startsWith("https://")
});

// Infer TypeScript type from schema
type PersonalInfoValidated = z.infer<typeof personalInfoSchema>;
```

#### Experience Schema

```typescript
const experienceSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(5).max(100),
  company: z.string().min(2).max(100),
  period: z.string().regex(/^\d{4}\s*-\s*(\d{4}|Present)$/),
  location: z.string().min(5).max(100),
  achievements: z.array(z.string().min(20).max(300)).min(2).max(8),
  technologies: z.array(z.string().min(2).max(50)).min(2).max(10)
});

const experiencesSchema = z.array(experienceSchema);

// Validate at runtime
try {
  const validatedExperiences = experiencesSchema.parse(experiences);
  console.log("Experiences data is valid");
} catch (error) {
  console.error("Validation error:", error);
}
```

#### Skill Category Schema

```typescript
const skillSchema = z.object({
  name: z.string().min(2).max(50),
  icon: z.string()
});

const skillCategorySchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),  // lowercase kebab-case
  title: z.string().min(5).max(50),
  icon: z.string(),
  skills: z.array(skillSchema).min(3).max(15)
});

const skillCategoriesSchema = z.array(skillCategorySchema);
```

#### Project Schema

```typescript
const ctaSchema = z.object({
  text: z.string().min(5).max(30),
  icon: z.string(),
  url: z.string().url().or(z.literal("#"))
});

const projectSchema = z.object({
  id: z.number().int().positive(),
  filename: z.string().min(5).max(50),
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(300),
  technologies: z.array(z.string().min(2).max(30)).min(2).max(5),
  cta: ctaSchema
});

const projectsSchema = z.array(projectSchema);
```

#### Education Schema

```typescript
const educationSchema = z.object({
  id: z.number().int().positive(),
  institution: z.string().min(5).max(100),
  degree: z.string().min(10).max(150),
  period: z.string().regex(/^\d{4}\s*-\s*\d{4}$/),
  location: z.string().min(5).max(100),
  description: z.string().min(50).max(500)
});

const educationArraySchema = z.array(educationSchema);
```

#### Certification Schema

```typescript
const certificationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(5).max(100),
  level: z.string().min(5).max(100),
  issuer: z.string().regex(/^Issued:\s+\w+\s+\d{4}$/),
  icon: z.string()
});

const certificationsSchema = z.array(certificationSchema);
```

#### Screen Schema

```typescript
const screenIdSchema = z.enum(["about", "experience", "skills", "projects", "education"]);

const screenSchema = z.object({
  id: screenIdSchema,
  label: z.string().min(3).max(20),
  windowTitle: z.string().min(5).max(100),
  icon: z.string()
});

const screensSchema = z.array(screenSchema);
```

### Validation Utilities

Create a validation utility file:

**File**: `/src/lib/validation.ts`

```typescript
import { z } from "zod";

// Re-export all schemas
export * from "./schemas/personalInfo";
export * from "./schemas/experience";
export * from "./schemas/skills";
// ... etc

// Validation helper
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  dataName: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`Validation error in ${dataName}:`, error.errors);
      throw new Error(`Invalid ${dataName} data structure`);
    }
    throw error;
  }
}

// Safe parse (doesn't throw)
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
```

### Using Validation

```typescript
// Validate static data at startup
import { validateData, experiencesSchema } from "@/lib/validation";
import { experiences } from "@/data/content";

// Validate during development
if (import.meta.env.DEV) {
  validateData(experiencesSchema, experiences, "experiences");
  console.log("All data validated successfully");
}

// Validate API responses
async function fetchExperiencesFromAPI() {
  const response = await fetch("/api/experiences");
  const data = await response.json();

  // Validate before using
  const validatedExperiences = validateData(
    experiencesSchema,
    data,
    "API experiences"
  );

  return validatedExperiences;
}

// Validate user input
function handleScreenNavigation(screenId: string) {
  const result = safeValidateData(screenIdSchema, screenId);

  if (result.success) {
    navigateToScreen(result.data);
  } else {
    console.error("Invalid screen ID:", screenId);
    navigateToScreen("about");  // Fallback
  }
}
```

### Validation Best Practices

1. **Validate at boundaries**: API responses, user input, file uploads
2. **Don't over-validate**: Trust your own static data at compile time
3. **Provide feedback**: Show meaningful error messages to users
4. **Fallback gracefully**: Have sensible defaults when validation fails
5. **Development checks**: Run validation in development mode only for performance
6. **Schema as documentation**: Schemas serve as living documentation of data structure

---

## Data Update Patterns

### Safe Update Strategies

When updating data in `content.ts`, follow these patterns to avoid breaking changes:

### Pattern 1: Sequential Updates

Update one data structure at a time with validation:

```typescript
// 1. Update data
export const personalInfo = {
  name: "New Name",  // Updated
  // ... rest unchanged
};

// 2. Verify TypeScript compilation
// Run: npm run build

// 3. Test in dev mode
// Run: npm run dev

// 4. Check all usage sites
// Search: "personalInfo" in codebase
```

### Pattern 2: Additive Changes (Safe)

Adding new fields is generally safe:

```typescript
// Before
export const personalInfo = {
  name: "Alex Chen",
  title: "DevOps Engineer"
};

// After (safe - adds optional field)
export const personalInfo = {
  name: "Alex Chen",
  title: "DevOps Engineer",
  location: "San Francisco, CA"  // New field
};

// Components not using 'location' continue to work
```

### Pattern 3: Refactoring Changes (Risky)

Renaming or restructuring fields requires updating all usage:

```typescript
// Before
export const personalInfo = {
  headline: {
    line1: "Architecting",
    line2: "Resilient Systems"
  }
};

// After (risky - structure changed)
export const personalInfo = {
  headline: {
    primary: "Architecting",    // Renamed
    secondary: "Resilient Systems"  // Renamed
  }
};

// Required: Update all components using headline.line1/line2
```

**Search and replace**: Use IDE to find all references before refactoring.

### Pattern 4: ID Management

Keep IDs sequential and never reuse deleted IDs:

```typescript
// Current IDs: [1, 2, 3, 4]
export const experiences = [
  { id: 1, /* ... */ },
  { id: 2, /* ... */ },
  { id: 3, /* ... */ },
  { id: 4, /* ... */ }
];

// Delete entry with ID 2
// DON'T renumber IDs: [1, 2, 3] ❌
// DO keep gaps: [1, 3, 4] ✅

export const experiences = [
  { id: 1, /* ... */ },
  // ID 2 deleted
  { id: 3, /* ... */ },
  { id: 4, /* ... */ }
];

// Add new entry with next ID
export const experiences = [
  { id: 5, /* ... */ },  // New entry (ID 5, not 2)
  { id: 1, /* ... */ },
  { id: 3, /* ... */ },
  { id: 4, /* ... */ }
];
```

### Pattern 5: Array Ordering

Maintain consistent ordering principles:

```typescript
// Experiences: Reverse chronological (most recent first)
export const experiences = [
  { id: 3, period: "2021 - Present", /* ... */ },
  { id: 2, period: "2019 - 2021", /* ... */ },
  { id: 1, period: "2017 - 2019", /* ... */ }
];

// Skills: Logical grouping (most important first)
export const skillCategories = [
  { id: "cloud", /* ... */ },         // Most important
  { id: "containerization", /* ... */ },
  { id: "cicd", /* ... */ },
  { id: "monitoring", /* ... */ }
];

// Projects: Impact or recency
export const projects = [
  { id: 1, title: "Most Impressive", /* ... */ },
  { id: 2, title: "Second Best", /* ... */ },
  // ...
];
```

### Batch Update Checklist

When making multiple updates:

```typescript
// ✅ CHECKLIST FOR DATA UPDATES

// 1. Create backup
// Copy content.ts to content.ts.backup

// 2. Update data structures
export const personalInfo = { /* updated */ };

// 3. Run TypeScript check
// npm run build

// 4. Update validation schemas (if using)
// personalInfoSchema in validation.ts

// 5. Test in dev mode
// npm run dev
// Manually verify each screen

// 6. Check for console errors
// Open browser DevTools

// 7. Verify animations still work
// Navigate between all screens

// 8. Test responsive design
// Check mobile/tablet/desktop views

// 9. Commit changes
// git add src/data/content.ts
// git commit -m "Update portfolio content"

// 10. Deploy and verify production
// npm run build && npm run preview
```

---

## Adding New Data

### Adding New Experience

```typescript
// Step 1: Determine next ID
const nextId = Math.max(...experiences.map(e => e.id)) + 1;

// Step 2: Add to beginning of array (most recent first)
export const experiences = [
  {
    id: nextId,  // e.g., 4
    title: "Your Job Title",
    company: "COMPANY NAME",
    period: "2023 - Present",
    location: "City, State",
    achievements: [
      "Achievement 1 with quantifiable impact",
      "Achievement 2 with metrics and results",
      "Achievement 3 demonstrating expertise"
    ],
    technologies: ["Tech1", "Tech2", "Tech3", "Tech4"]
  },
  // ... existing experiences
];

// Step 3: Verify in browser (npm run dev)
```

### Adding New Skill Category

```typescript
// Step 1: Choose unique kebab-case ID
const newCategoryId = "new-category";  // e.g., "security"

// Step 2: Add to appropriate position
export const skillCategories = [
  // ... existing categories
  {
    id: newCategoryId,
    title: "CATEGORY TITLE",
    icon: "shield",  // Choose from Lucide icons
    skills: [
      { name: "Skill 1", icon: "check" },
      { name: "Skill 2", icon: "check" },
      { name: "Skill 3", icon: "check" },
      { name: "Skill 4", icon: "check" }
    ]
  }
];

// Step 3: Verify layout in SkillsScreen
```

### Adding New Project

```typescript
// Step 1: Determine next ID
const nextId = Math.max(...projects.map(p => p.id)) + 1;

// Step 2: Add to appropriate position (by importance/recency)
export const projects = [
  {
    id: nextId,  // e.g., 7
    filename: "project_file.ext",  // Use realistic extension
    title: "Project Title (3-8 words)",
    description: "Impact-focused description with metrics. One to two sentences maximum.",
    technologies: ["Tech1", "Tech2", "Tech3"],
    cta: {
      text: "View Project",      // Action-oriented
      icon: "external",           // Choose appropriate icon
      url: "https://example.com"  // Or "#" for placeholder
    }
  },
  // ... existing projects
];

// Step 3: Verify grid layout in ProjectsScreen
```

### Adding New Education Entry

```typescript
// Step 1: Determine next ID
const nextId = Math.max(...education.map(e => e.id)) + 1;

// Step 2: Add to beginning (most recent first)
export const education = [
  {
    id: nextId,  // e.g., 3
    institution: "Institution Full Name",
    degree: "Degree Type in Major/Specialization",
    period: "YYYY - YYYY",
    location: "City, State/Country",
    description: "Specialization details. Thesis or capstone project. Honors, GPA, relevant coursework, or clubs."
  },
  // ... existing education
];

// Step 3: Verify in EducationScreen
```

### Adding New Certification

```typescript
// Step 1: Determine next ID
const nextId = Math.max(...certifications.map(c => c.id)) + 1;

// Step 2: Add to appropriate position (by recency or importance)
export const certifications = [
  {
    id: nextId,  // e.g., 5
    name: "Certification Name",
    level: "Level/Organization",
    issuer: "Issued: MMM YYYY",  // e.g., "Issued: Jan 2024"
    icon: "cloud"  // Choose appropriate icon
  },
  // ... existing certifications
];

// Step 3: Verify grid layout in EducationScreen
```

### Adding New Screen

**Full Process** (requires code changes):

```typescript
// Step 1: Update ScreenId type
// File: src/hooks/useScreenNavigation.ts
export type ScreenId =
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "new-screen";  // Add here

// Step 2: Add to screens array
// File: src/data/content.ts
export const screens = [
  // ... existing screens
  {
    id: "new-screen",  // Must match ScreenId
    label: "New Screen",
    windowTitle: "NEW_SCREEN.EXE",
    icon: "icon-name"
  }
];

// Step 3: Create screen component
// File: src/components/screens/NewScreen.tsx
import { motion } from "framer-motion";
import { staggerContainer, fadeSlideUp } from "@/lib/animations";

interface NewScreenProps {
  onNavigate?: (screen: ScreenId) => void;
}

export function NewScreen({ onNavigate }: NewScreenProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.h1 variants={fadeSlideUp}>
        New Screen Title
      </motion.h1>
      {/* Screen content */}
    </motion.div>
  );
}

// Step 4: Add to render function
// File: src/pages/Index.tsx
import { NewScreen } from "@/components/screens/NewScreen";

const renderScreen = () => {
  switch (currentScreen) {
    case "about":
      return <AboutScreen onNavigate={goToScreen} />;
    // ... existing cases
    case "new-screen":
      return <NewScreen onNavigate={goToScreen} />;
    default:
      return <AboutScreen onNavigate={goToScreen} />;
  }
};

// Step 5: Test thoroughly
// - Navigation from taskbar works
// - Window title displays correctly
// - Animations work smoothly
// - Active state highlights correctly
```

---

## Data Migration Strategies

### Scenario 1: Moving to API/CMS

When transitioning from static data to API-based content:

#### Phase 1: Add API Types

```typescript
// src/types/api.ts
import type { experiences } from "@/data/content";

// Infer types from existing data
export type ExperienceAPI = typeof experiences[number];
export type ExperiencesAPI = typeof experiences;

// Or define explicitly if API differs
export interface ExperienceAPI {
  id: number;
  title: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
  technologies: string[];
  // API might have additional fields
  createdAt?: string;
  updatedAt?: string;
}
```

#### Phase 2: Create Data Fetching Hooks

```typescript
// src/hooks/useExperiences.ts
import { useQuery } from "@tanstack/react-query";
import { experiences as staticExperiences } from "@/data/content";
import type { ExperienceAPI } from "@/types/api";

const USE_API = false;  // Feature flag

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async (): Promise<ExperienceAPI[]> => {
      if (!USE_API) {
        // Return static data during transition
        return staticExperiences;
      }

      // Fetch from API
      const response = await fetch("/api/experiences");
      if (!response.ok) throw new Error("Failed to fetch experiences");

      const data = await response.json();

      // Validate with Zod
      return experiencesSchema.parse(data);
    },
    staleTime: 1000 * 60 * 5,  // 5 minutes
    // Fallback to static data on error
    placeholderData: staticExperiences
  });
}
```

#### Phase 3: Update Components

```typescript
// Before (static import)
import { experiences } from "@/data/content";

export function ExperienceScreen() {
  return (
    <div>
      {experiences.map((exp) => (
        <div key={exp.id}>{exp.title}</div>
      ))}
    </div>
  );
}

// After (API hook)
import { useExperiences } from "@/hooks/useExperiences";

export function ExperienceScreen() {
  const { data: experiences, isLoading, error } = useExperiences();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!experiences) return null;

  return (
    <div>
      {experiences.map((exp) => (
        <div key={exp.id}>{exp.title}</div>
      ))}
    </div>
  );
}
```

#### Phase 4: Gradual Rollout

```typescript
// src/config/features.ts
export const FEATURE_FLAGS = {
  useExperiencesAPI: false,
  useSkillsAPI: false,
  useProjectsAPI: false,
  useEducationAPI: false,
  useCertificationsAPI: false
} as const;

// Enable one at a time
// 1. Enable useExperiencesAPI: true → test → deploy
// 2. Enable useSkillsAPI: true → test → deploy
// 3. Continue until all migrated
// 4. Remove static data once fully migrated
```

### Scenario 2: Adding Multi-Language Support

Prepare data structure for internationalization:

```typescript
// Before
export const personalInfo = {
  name: "Alex Chen",
  title: "DevOps Engineer",
  bio: "I bridge the gap..."
};

// After (i18n ready)
export const personalInfo = {
  name: "Alex Chen",  // Name stays same
  title: {
    en: "DevOps Engineer",
    es: "Ingeniero DevOps",
    fr: "Ingénieur DevOps"
  },
  bio: {
    en: "I bridge the gap...",
    es: "Construyo puentes...",
    fr: "Je construis des ponts..."
  }
};

// Helper function
function t(field: LocalizedString, locale: string = "en"): string {
  return typeof field === "string" ? field : field[locale] || field.en;
}

// Usage
<p>{t(personalInfo.title, currentLocale)}</p>
```

### Scenario 3: Adding Timestamps

Track when content was last updated:

```typescript
// Enhanced structure with metadata
export const experiences = [
  {
    id: 1,
    title: "Senior DevOps Engineer",
    // ... rest of fields
    metadata: {
      createdAt: "2024-01-15",
      updatedAt: "2024-03-20",
      author: "alex.chen@email.com"
    }
  }
];

// Filter by recency
const recentExperiences = experiences.filter(exp => {
  const updated = new Date(exp.metadata.updatedAt);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return updated > sixMonthsAgo;
});
```

### Scenario 4: Version Control for Data

Track data structure versions for migrations:

```typescript
// src/data/content.ts
export const DATA_VERSION = "2.0.0";

export const personalInfo = {
  _version: "2.0.0",  // Track version per entity
  name: "Alex Chen",
  // ...
};

// Migration function
function migratePersonalInfo(data: any): PersonalInfo {
  const version = data._version || "1.0.0";

  if (version === "1.0.0") {
    // Migrate from v1 to v2
    return {
      _version: "2.0.0",
      name: data.fullName,  // Field renamed
      title: data.role,     // Field renamed
      // ... map old structure to new
    };
  }

  return data;  // Already current version
}
```

---

## Type Safety Best Practices

### 1. Use Const Assertions

Narrow types to specific literals:

```typescript
// Without const assertion
const status = "active";  // Type: string

// With const assertion
const status = "active" as const;  // Type: "active"

// For objects
export const personalInfo = {
  name: "Alex Chen",
  title: "DevOps Engineer"
} as const;  // All fields become readonly literals
```

### 2. Avoid Type Assertions Unless Necessary

```typescript
// ❌ Bad - Loses type safety
const experience = data as Experience;

// ✅ Good - Use validation
const experience = experienceSchema.parse(data);

// ✅ Good - Use type guards
if (isExperience(data)) {
  const experience = data;  // Type is narrowed
}
```

### 3. Create Discriminated Unions

For data with multiple shapes:

```typescript
// Project can have different CTA types
type ExternalLinkCTA = {
  type: "external";
  text: string;
  url: string;
};

type GithubLinkCTA = {
  type: "github";
  text: string;
  repo: string;
};

type DownloadCTA = {
  type: "download";
  text: string;
  fileUrl: string;
};

type CallToAction = ExternalLinkCTA | GithubLinkCTA | DownloadCTA;

// Type-safe handling
function renderCTA(cta: CallToAction) {
  switch (cta.type) {
    case "external":
      return <a href={cta.url}>{cta.text}</a>;
    case "github":
      return <a href={`https://github.com/${cta.repo}`}>{cta.text}</a>;
    case "download":
      return <a href={cta.fileUrl} download>{cta.text}</a>;
  }
}
```

### 4. Use Unknown Instead of Any

```typescript
// ❌ Bad - No type checking
function processData(data: any) {
  return data.name.toUpperCase();  // Runtime error if name is undefined
}

// ✅ Good - Forces validation
function processData(data: unknown) {
  if (isPersonalInfo(data)) {
    return data.name.toUpperCase();  // Type-safe
  }
  throw new Error("Invalid data");
}
```

### 5. Leverage Template Literal Types

```typescript
// Icon names with prefix
type IconName = `icon-${string}`;

// Screen ID with pattern
type ScreenId = `screen-${number}`;

// Email validation
type Email = `${string}@${string}.${string}`;

// Usage
const icon: IconName = "icon-cloud";  // ✅
const icon2: IconName = "cloud";       // ❌ Type error
```

### 6. Use Branded Types for IDs

Prevent mixing different ID types:

```typescript
// Branded type
type ExperienceId = number & { __brand: "ExperienceId" };
type ProjectId = number & { __brand: "ProjectId" };

// Constructor functions
function createExperienceId(id: number): ExperienceId {
  return id as ExperienceId;
}

function createProjectId(id: number): ProjectId {
  return id as ProjectId;
}

// Usage
const expId = createExperienceId(1);
const projId = createProjectId(1);

function getExperience(id: ExperienceId) { /* ... */ }

getExperience(expId);   // ✅ Correct
getExperience(projId);  // ❌ Type error - wrong ID type
getExperience(1);       // ❌ Type error - raw number
```

### 7. Exhaustive Switch Statements

Ensure all cases are handled:

```typescript
function renderScreen(screenId: ScreenId): JSX.Element {
  switch (screenId) {
    case "about":
      return <AboutScreen />;
    case "experience":
      return <ExperienceScreen />;
    case "skills":
      return <SkillsScreen />;
    case "projects":
      return <ProjectsScreen />;
    case "education":
      return <EducationScreen />;
    default:
      // TypeScript ensures this is unreachable
      const _exhaustive: never = screenId;
      throw new Error(`Unhandled screen: ${_exhaustive}`);
  }
}

// If you add new ScreenId, TypeScript will error here
```

### 8. Readonly Arrays and Objects

Prevent accidental mutations:

```typescript
// Readonly array
export const experiences: readonly Experience[] = [ /* ... */ ];

// Attempt to mutate
experiences.push({ /* ... */ });  // ❌ Type error

// Readonly object
export const personalInfo: Readonly<PersonalInfo> = { /* ... */ };

// Attempt to mutate
personalInfo.name = "New Name";  // ❌ Type error

// Deep readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

export const config: DeepReadonly<Config> = { /* ... */ };
```

---

## Future Data Considerations

### API Integration

#### REST API Structure

```typescript
// API endpoints
GET    /api/personal-info
GET    /api/experiences
GET    /api/experiences/:id
POST   /api/experiences        (admin only)
PUT    /api/experiences/:id    (admin only)
DELETE /api/experiences/:id    (admin only)

GET    /api/skills
GET    /api/projects
GET    /api/projects/:id
GET    /api/education
GET    /api/certifications

// API response types
interface APIResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
}

interface APIError {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}
```

#### GraphQL Structure

```graphql
type Query {
  personalInfo: PersonalInfo!
  experiences: [Experience!]!
  experience(id: ID!): Experience
  skills: [SkillCategory!]!
  projects: [Project!]!
  project(id: ID!): Project
  education: [Education!]!
  certifications: [Certification!]!
}

type PersonalInfo {
  name: String!
  title: String!
  headline: Headline!
  bio: String!
  email: String!
  linkedin: String
  github: String
}

type Headline {
  line1: String!
  line2: String!
}

type Experience {
  id: ID!
  title: String!
  company: String!
  period: String!
  location: String!
  achievements: [String!]!
  technologies: [String!]!
  createdAt: DateTime
  updatedAt: DateTime
}

# ... more types
```

### CMS Integration

#### Headless CMS Options

Popular choices for portfolio content:

1. **Contentful**
   - Excellent TypeScript support
   - Content modeling UI
   - Built-in validation
   - Real-time preview

2. **Sanity**
   - React-based studio
   - Real-time collaboration
   - Custom input components
   - Excellent developer experience

3. **Strapi**
   - Self-hosted
   - Full control
   - Built-in admin panel
   - REST & GraphQL APIs

#### CMS Data Mapping

```typescript
// Contentful example
import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!
});

// Fetch experiences from CMS
async function fetchExperiences(): Promise<Experience[]> {
  const response = await client.getEntries({
    content_type: "experience",
    order: "-fields.startDate"  // Most recent first
  });

  // Map CMS fields to app data structure
  return response.items.map(item => ({
    id: parseInt(item.sys.id),
    title: item.fields.title,
    company: item.fields.company,
    period: item.fields.period,
    location: item.fields.location,
    achievements: item.fields.achievements,
    technologies: item.fields.technologies
  }));
}
```

### Real-Time Updates

#### WebSocket Integration

```typescript
// Real-time data updates
import { io } from "socket.io-client";

const socket = io("wss://api.example.com");

// Listen for content updates
socket.on("experience:updated", (experience: Experience) => {
  // Update React Query cache
  queryClient.setQueryData(
    ["experiences"],
    (old: Experience[] = []) => {
      return old.map(exp =>
        exp.id === experience.id ? experience : exp
      );
    }
  );
});

socket.on("project:created", (project: Project) => {
  // Add new project to cache
  queryClient.setQueryData(
    ["projects"],
    (old: Project[] = []) => [project, ...old]
  );
});
```

### Analytics and Tracking

```typescript
// Track content views
export const experiences = [
  {
    id: 1,
    title: "Senior DevOps Engineer",
    // ... rest of fields
    analytics: {
      views: 0,
      lastViewed: null as Date | null
    }
  }
];

// Track when experience is viewed
function trackExperienceView(id: number) {
  // Send to analytics service
  analytics.track("experience_viewed", {
    experienceId: id,
    timestamp: new Date()
  });
}
```

### Content Versioning

```typescript
// Version history for content
interface ContentVersion<T> {
  version: number;
  data: T;
  timestamp: string;
  author: string;
  changeNote: string;
}

interface VersionedExperience extends Experience {
  versions: ContentVersion<Experience>[];
  currentVersion: number;
}

// Fetch specific version
function getExperienceVersion(
  experience: VersionedExperience,
  version: number
): Experience {
  const versionData = experience.versions.find(
    v => v.version === version
  );
  return versionData?.data || experience;
}
```

### Search and Filtering

```typescript
// Enhanced data structure with search metadata
export const experiences = [
  {
    id: 1,
    title: "Senior DevOps Engineer",
    // ... existing fields
    searchableText: "devops engineer aws kubernetes terraform cloud infrastructure automation",
    tags: ["devops", "cloud", "automation", "kubernetes"],
    category: "work-experience",
    featured: true
  }
];

// Search function
function searchContent(query: string): SearchResults {
  const lowercaseQuery = query.toLowerCase();

  const matchingExperiences = experiences.filter(exp =>
    exp.searchableText.includes(lowercaseQuery)
  );

  const matchingProjects = projects.filter(proj =>
    proj.title.toLowerCase().includes(lowercaseQuery) ||
    proj.description.toLowerCase().includes(lowercaseQuery)
  );

  return {
    experiences: matchingExperiences,
    projects: matchingProjects,
    total: matchingExperiences.length + matchingProjects.length
  };
}
```

### Performance Optimization

#### Data Pagination

```typescript
// Paginated API response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

// Infinite query hook
function useInfiniteExperiences() {
  return useInfiniteQuery({
    queryKey: ["experiences"],
    queryFn: ({ pageParam = 1 }) =>
      fetchExperiences({ page: pageParam, pageSize: 10 }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined
  });
}
```

#### Data Caching Strategy

```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Personal info rarely changes - long cache
      staleTime: 1000 * 60 * 60,  // 1 hour
      cacheTime: 1000 * 60 * 60 * 24,  // 24 hours

      // Retry failed requests
      retry: 3,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),

      // Use cache while revalidating
      refetchOnWindowFocus: true,
      refetchOnReconnect: true
    }
  }
});

// Per-query customization
useQuery({
  queryKey: ["experiences"],
  queryFn: fetchExperiences,
  staleTime: 1000 * 60 * 5,  // 5 minutes for frequently updated content
});
```

### Content Moderation

```typescript
// Content with moderation status
interface ModeratedContent<T> {
  data: T;
  status: "draft" | "pending" | "approved" | "rejected";
  moderatedBy?: string;
  moderatedAt?: string;
  rejectionReason?: string;
}

// Filter by moderation status
function getApprovedExperiences(): Experience[] {
  return experiences
    .filter(exp => exp.status === "approved")
    .map(exp => exp.data);
}
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and data flow
- [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) - State management patterns
- [COMPONENTS.md](./COMPONENTS.md) - Component structure and usage
- [OVERVIEW.md](./OVERVIEW.md) - Project overview and setup

---

**Last Updated**: 2026-01-08
