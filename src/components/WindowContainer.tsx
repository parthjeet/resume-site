import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { 
  Terminal, Building2, Settings, FolderOpen, Disc, 
  Cloud, Box, BarChart3, Wrench 
} from "lucide-react";

interface WindowContainerProps {
  title: string;
  icon?: string;
  children: ReactNode;
  isTransitioning: boolean;
}

const iconMap: Record<string, ReactNode> = {
  terminal: <Terminal className="w-4 h-4" />,
  building: <Building2 className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
  folder: <FolderOpen className="w-4 h-4" />,
  disc: <Disc className="w-4 h-4" />,
  cloud: <Cloud className="w-4 h-4" />,
  container: <Box className="w-4 h-4" />,
  chart: <BarChart3 className="w-4 h-4" />,
  wrench: <Wrench className="w-4 h-4" />,
};

export function WindowContainer({ 
  title, 
  icon = "terminal", 
  children,
  isTransitioning 
}: WindowContainerProps) {
  const [displayTitle, setDisplayTitle] = useState(title);
  const [isFlickering, setIsFlickering] = useState(false);

  useEffect(() => {
    if (title !== displayTitle) {
      setIsFlickering(true);
      const timer = setTimeout(() => {
        setDisplayTitle(title);
        setTimeout(() => setIsFlickering(false), 150);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [title, displayTitle]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="flex flex-col w-full max-w-6xl mx-auto h-[calc(100vh-8rem)] shadow-window rounded-xl overflow-hidden"
    >
      {/* Title Bar */}
      <div className="window-title-bar shrink-0">
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ opacity: isFlickering ? 0 : 1 }}
            transition={{ duration: 0.1 }}
            className="text-white/90"
          >
            {iconMap[icon]}
          </motion.span>
          <motion.span
            className={`window-title-text ${isFlickering ? 'animate-flicker' : ''}`}
          >
            {displayTitle}
          </motion.span>
        </div>
        
        {/* Window Controls */}
        <div className="flex items-center gap-2">
          <div className="window-control-dot window-control-dot-amber" />
          <div className="window-control-dot window-control-dot-gold" />
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-cream">
        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full overflow-y-auto p-6 md:p-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
