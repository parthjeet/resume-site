import { motion } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Search, GraduationCap, Award,
  Cloud, Box, Code, Shield
} from "lucide-react";
import { education, certifications } from "@/data/content";
import { ReactNode } from "react";
import { staggerContainer, fadeSlideUp } from "@/lib/animations";

const certIcons: Record<string, ReactNode> = {
  cloud: <Cloud className="w-6 h-6" />,
  container: <Box className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
};

export function EducationScreen() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto"
    >
      {/* Address Bar */}
      <motion.div variants={fadeSlideUp} className="address-bar mb-8">
        <button className="p-1 hover:bg-muted rounded" aria-label="Go back">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <button className="p-1 hover:bg-muted rounded" aria-label="Go forward">
          <ArrowRight className="w-4 h-4 text-text-secondary" />
        </button>
        <span className="address-bar-path">C:\Users\DevOps\Credentials\Education</span>
        <button className="p-1 hover:bg-muted rounded" aria-label="Search">
          <Search className="w-4 h-4 text-text-secondary" />
        </button>
      </motion.div>

      {/* Academic History Section */}
      <motion.div variants={fadeSlideUp} className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-6 h-6 text-burgundy" data-testid="academic-history-icon" />
          <h2 className="text-2xl font-bold text-text-primary">Academic History</h2>
        </div>

        <div className="space-y-4">
          {education.map((edu) => (
            <motion.div 
              key={edu.id}
              variants={fadeSlideUp}
              className="content-card-accent"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary">
                    {edu.institution}
                  </h3>
                  <p className="text-base font-semibold text-burgundy mt-1">
                    {edu.degree}
                  </p>
                  <p className="text-body text-text-secondary mt-3">
                    {edu.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="date-badge">{edu.period}</span>
                  <p className="text-small text-text-secondary mt-2">
                    {edu.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Industry Certifications Section */}
      <motion.div variants={fadeSlideUp}>
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-burgundy" />
          <h2 className="text-2xl font-bold text-text-primary">Industry Certifications</h2>
        </div>

        <motion.div 
          variants={fadeSlideUp}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {certifications.map((cert) => (
            <div key={cert.id} className="cert-card">
              <div className="cert-icon-wrapper">
                {certIcons[cert.icon]}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary text-small">
                  {cert.name}
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  {cert.level}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {cert.issuer}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
