import { motion } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Search, ExternalLink, 
  Github, FileText, Monitor, BookOpen 
} from "lucide-react";
import { projects } from "@/data/content";
import { ReactNode } from "react";
import { staggerContainer, fadeSlideUp, rowVariants } from "@/lib/animations";

const ctaIcons: Record<string, ReactNode> = {
  external: <ExternalLink className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  arrow: <ArrowRight className="w-4 h-4" />,
  file: <FileText className="w-4 h-4" />,
  monitor: <Monitor className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />,
};

// Abstract project thumbnail backgrounds
const thumbnailStyles = [
  "from-blue-600/20 via-blue-400/30 to-cyan-300/20",
  "from-sky-400/30 via-white/40 to-sky-200/30",
  "from-slate-800/80 via-slate-700/60 to-slate-600/50",
  "from-amber-700/40 via-amber-600/30 to-amber-500/20",
  "from-emerald-600/30 via-teal-500/30 to-cyan-400/20",
  "from-slate-700/50 via-slate-600/40 to-slate-500/30",
];

export function ProjectsScreen() {
  const firstRow = projects.slice(0, 3);
  const secondRow = projects.slice(3, 6);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto"
    >
      {/* Address Bar */}
      <motion.div variants={fadeSlideUp} className="address-bar mb-6">
        <button className="p-1 hover:bg-muted rounded" aria-label="Go back">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <button className="p-1 hover:bg-muted rounded" aria-label="Go forward">
          <ArrowRight className="w-4 h-4 text-text-secondary" />
        </button>
        <span className="address-bar-path">C:\Users\DevOps\Documents\Projects</span>
        <button className="p-1 hover:bg-muted rounded" aria-label="Search">
          <Search className="w-4 h-4 text-text-secondary" />
        </button>
      </motion.div>

      {/* Projects Grid - First Row */}
      <motion.div variants={rowVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {firstRow.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            thumbnailStyle={thumbnailStyles[index]} 
          />
        ))}
      </motion.div>

      {/* Projects Grid - Second Row */}
      <motion.div variants={rowVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {secondRow.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            thumbnailStyle={thumbnailStyles[index + 3]} 
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

interface ProjectCardProps {
  project: typeof projects[0];
  thumbnailStyle: string;
}

function ProjectCard({ project, thumbnailStyle }: ProjectCardProps) {
  return (
    <div className="project-card group">
      {/* Mini Title Bar */}
      <div className="project-card-header">
        <span className="project-card-header-text">{project.filename}</span>
        <div className="w-2 h-2 rounded-full bg-amber-light/50" />
      </div>

      {/* Thumbnail */}
      <div className={`h-44 bg-gradient-to-br ${thumbnailStyle} bg-cover bg-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-h2 mb-2">{project.title}</h3>
        <p className="text-small text-text-secondary mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>

        {/* CTA Button */}
        <a href={project.cta.url} className="btn-secondary inline-flex">
          {project.cta.text}
          {ctaIcons[project.cta.icon]}
        </a>
      </div>
    </div>
  );
}
