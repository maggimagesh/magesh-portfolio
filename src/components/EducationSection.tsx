import React from "react";
import { motion } from "motion/react";
import { Calendar, MapPin } from "lucide-react";
import resume from "../data/resume";
import { ImageWithFallback } from "./fallback/ImageWithFallback";
import { SectionHeading, WebCorner } from "./spidey/Spidey";

export function EducationSection() {
  return (
    <section id="education" className="sp-section sp-section-paper">
      <div className="sp-halftone" aria-hidden="true" />
      <WebCorner corner="bl" className="sp-section-web sp-section-web-dark" />

      <div className="sp-container">
        <SectionHeading
          tone="light"
          kicker="Origin Story"
          title="Academic Background"
          subtitle="Every hero starts somewhere. Before the suit came the schooling."
        />

        <div className="sp-grid sp-grid-3">
          {resume.education.map((edu, index) => (
            <motion.article
              key={edu.degree}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="sp-panel sp-origin"
            >
              <span className="sp-issue">Issue #{String(index + 1).padStart(2, "0")}</span>
              <div className="sp-origin-head">
                <span className="sp-logo-box">
                  <ImageWithFallback src={edu.logo} alt={edu.institution} />
                </span>
                <div>
                  <h3 className="sp-panel-title">{edu.degree}</h3>
                  <p className="sp-muted">{edu.institution}</p>
                </div>
              </div>
              <div className="sp-meta">
                <span>
                  <Calendar size={15} /> {edu.period}
                </span>
                <span>
                  <MapPin size={15} /> {edu.location}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
