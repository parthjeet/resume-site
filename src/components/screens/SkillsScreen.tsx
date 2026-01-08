import { motion } from "framer-motion";
import { Cloud, Box, Terminal, BarChart3, Check } from "lucide-react";
import { skillCategories } from "@/data/content";
import { ReactNode } from "react";
import { staggerContainer, fadeSlideUp } from "@/lib/animations";

const categoryIcons: Record<string, ReactNode> = {
  cloud: <Cloud className="w-5 h-5" />,
  container: <Box className="w-5 h-5" />,
  terminal: <Terminal className="w-5 h-5" />,
  chart: <BarChart3 className="w-5 h-5" />,
};

const skillIcons: Record<string, ReactNode> = {
  check: <Check className="w-4 h-4" />,
  box: <Box className="w-4 h-4" />,
  terminal: <Terminal className="w-4 h-4" />,
  chart: <BarChart3 className="w-4 h-4" />,
};

export function SkillsScreen() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto"
    >
      {/* Section Title */}
      <motion.div variants={fadeSlideUp} className="text-center mb-12">
        <h2 className="section-title">Technology Stack</h2>
        <div className="section-title-underline mx-auto mt-4" />
      </motion.div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <motion.div
            key={category.id}
            variants={fadeSlideUp}
            className="category-panel"
          >
            {/* Category Header */}
            <div className="category-header">
              <span className="category-icon">
                {categoryIcons[category.icon]}
              </span>
              <span>{category.title}</span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span key={skill.name} className="skill-tag">
                  <span className="skill-tag-icon">
                    {skillIcons[skill.icon]}
                  </span>
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
