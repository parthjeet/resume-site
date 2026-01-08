import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface BootSequenceProps {
  children: ReactNode;
  onComplete: () => void;
}

export function BootSequence({ children, onComplete }: BootSequenceProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Quick boot text display then reveal
    const timer = setTimeout(() => {
      setShowContent(true);
      onComplete();
    }, 600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showContent) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm text-amber"
        >
          INITIALIZING PORTFOLIO.SYS...
        </motion.span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
