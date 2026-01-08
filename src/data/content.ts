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

export const screens = [
  { id: "about", label: "About", windowTitle: "ALEX_CHEN_PORTFOLIO.EXE", icon: "terminal" },
  { id: "experience", label: "Experience", windowTitle: "EXPERIENCE_LOG.TXT", icon: "building" },
  { id: "skills", label: "Skills", windowTitle: "TECHNICAL_SKILLS_MATRIX.EXE", icon: "settings" },
  { id: "projects", label: "Projects", windowTitle: "Project Explorer", icon: "folder" },
  { id: "education", label: "Education", windowTitle: "System Credentials", icon: "disc" }
];
