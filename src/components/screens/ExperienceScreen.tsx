import { motion } from "framer-motion";
import { Building2, Cloud } from "lucide-react";
import { experiences } from "@/data/content";
import { staggerContainer, fadeSlideUp, timelineVariants, dotVariants } from "@/lib/animations";

export function ExperienceScreen() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto"
    >
      {/* Section Title */}
      <motion.div variants={fadeSlideUp} className="text-center mb-12">
        <h2 className="section-title">Work Experience</h2>
        <div className="section-title-underline mx-auto mt-4" />
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <motion.div
          variants={timelineVariants}
          style={{ originY: 0 }}
          className="timeline-line absolute left-1/2 -translate-x-1/2 top-0 h-full hidden md:block"
        />

        {/* Experience Cards */}
        <div className="space-y-8 md:space-y-0">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              variants={fadeSlideUp}
              className={`relative md:flex items-start ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
            >
              {/* Timeline Dot */}
              <motion.div
                variants={dotVariants}
                className="timeline-dot hidden md:block absolute left-1/2 -translate-x-1/2 top-6 z-10"
              />

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2" />

              {/* Card */}
              <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                <div className="content-card-accent">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-h2">{exp.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {index === 0 ? (
                          <Building2 className="w-4 h-4 text-burgundy" />
                        ) : (
                          <Cloud className="w-4 h-4 text-burgundy" />
                        )}
                        <span className="company-name">{exp.company}</span>
                      </div>
                    </div>
                    <span className="date-badge">{exp.period}</span>
                  </div>

                  {/* Achievements */}
                  <ul className="space-y-2 mt-4">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-body text-text-secondary flex gap-2">
                        <span className="text-burgundy mt-1">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
