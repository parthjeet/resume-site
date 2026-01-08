import { motion } from "framer-motion";
import { Settings, Linkedin, Mail, Github } from "lucide-react";
import { screens, personalInfo } from "@/data/content";
import { ScreenId } from "@/hooks/useScreenNavigation";
import { useState, useEffect } from "react";

interface TaskbarProps {
  currentScreen: ScreenId;
  onNavigate: (screenId: ScreenId) => void;
  isTransitioning: boolean;
}

export function Taskbar({ currentScreen, onNavigate, isTransitioning }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      setCurrentTime(`${displayHours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ delay: 0.8, duration: 0.25, ease: [0, 0, 0.2, 1] }}
      className="taskbar"
    >
      {/* Start Button */}
      <div className="flex items-center gap-4">
        <button className="taskbar-start" aria-label="Start menu">
          <Settings className="w-4 h-4" />
          <span>Start</span>
        </button>

        <div className="taskbar-divider" />

        {/* Navigation Buttons */}
        <nav className="flex items-center gap-1">
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => !isTransitioning && onNavigate(screen.id as ScreenId)}
              disabled={isTransitioning}
              className={`taskbar-nav-btn ${currentScreen === screen.id ? "active" : ""}`}
              aria-current={currentScreen === screen.id ? "page" : undefined}
            >
              {screen.label}
            </button>
          ))}
        </nav>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2">
        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="taskbar-icon"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="taskbar-icon"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        <a
          href={`mailto:${personalInfo.email}`}
          className="taskbar-icon"
          aria-label="Email"
        >
          <Mail className="w-4 h-4" />
        </a>

        <div className="taskbar-divider mx-2" />

        <span className="taskbar-clock">{currentTime}</span>
      </div>
    </motion.div>
  );
}
