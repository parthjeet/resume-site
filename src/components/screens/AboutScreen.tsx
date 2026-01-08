import { motion } from "framer-motion";
import { Settings, ArrowRight } from "lucide-react";
import { personalInfo } from "@/data/content";
import { ScreenId } from "@/hooks/useScreenNavigation";
import { staggerContainer, fadeSlideUp } from "@/lib/animations";

interface AboutScreenProps {
  onNavigate: (screenId: ScreenId) => void;
}

export function AboutScreen({ onNavigate }: AboutScreenProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12 min-h-full"
    >
      {/* Left Column - Text Content */}
      <div className="flex-1 max-w-xl">
        {/* Role Badge */}
        <motion.div variants={fadeSlideUp}>
          <span className="role-badge">
            <Settings className="w-4 h-4 role-badge-icon" />
            {personalInfo.title}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={fadeSlideUp}
          className="mt-6"
        >
          <span className="hero-display block">{personalInfo.headline.line1}</span>
        </motion.h1>
        
        <motion.h1 variants={fadeSlideUp}>
          <span className="hero-display-accent block">{personalInfo.headline.line2}</span>
        </motion.h1>

        {/* Bio */}
        <motion.p 
          variants={fadeSlideUp}
          className="mt-8 text-body text-text-secondary max-w-md leading-relaxed"
        >
          {personalInfo.bio}
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={fadeSlideUp} className="mt-8">
          <button 
            onClick={() => onNavigate("projects")}
            className="btn-primary"
          >
            View Projects
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Right Column - Profile Image with Terminal */}
      <motion.div 
        variants={fadeSlideUp}
        className="relative w-full max-w-sm lg:max-w-md"
      >
        <div className="relative rounded-lg overflow-hidden shadow-window">
          {/* Placeholder Image - Stylized DevOps themed */}
          <div className="aspect-[4/5] bg-gradient-to-br from-rose-300 via-amber-200 to-rose-400 relative">
            {/* Abstract tech pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Decorative elements suggesting a professional photo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm" />
            </div>
          </div>
          
          {/* Terminal Overlay */}
          <div className="terminal-overlay">
            <div className="terminal-line">
              <span className="terminal-prompt">&gt;</span> ssh root@server
            </div>
            <div className="terminal-line">
              <span className="terminal-prompt">&gt;</span> docker-compose up -d
            </div>
            <div className="terminal-line">
              <span className="terminal-prompt">&gt;</span> System status: ONLINE
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
