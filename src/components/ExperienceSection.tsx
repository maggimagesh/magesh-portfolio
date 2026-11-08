import React from "react";
import { motion } from "motion/react";
import { Calendar, MapPin } from "lucide-react";
import resume from "../data/resume";
import { ImageWithFallback } from "./fallback/ImageWithFallback";
import { SectionHeading, SpiderGlyph, WebCorner } from "./spidey/Spidey";

export function ExperienceSection() {
  return (
    <section data-paper id="experience" className="sp-section sp-section-night">
      <div className="sp-stars" aria-hidden="true" />
      <WebCorner corner="tl" className="sp-section-web sp-section-web-light" />
      <WebCorner corner="br" className="sp-section-web sp-section-web-light" />

      <div className="sp-container">
        <SectionHeading
          tone="dark"
          kicker="Mission Log"
          title="Work Experience"
          subtitle="6+ years patrolling software for defects — from manual sweeps to leading automation squads."
        />

        <ol className="sp-timeline">
          {resume.experience.map((exp, index) => (
            <motion.li
              key={`${exp.company}-${exp.period}`}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="sp-mission"
            >
              <span className="sp-mission-node" aria-hidden="true">
                <SpiderGlyph className="sp-mission-glyph" />
              </span>

              <article className="sp-panel sp-mission-card">
                <header className="sp-mission-head">
                  <span className="sp-tag sp-tag-red">
                    Mission {String(resume.experience.length - index).padStart(2, "0")}
                  </span>
                  <h3 className="sp-mission-role">{exp.role}</h3>
                  <div className="sp-meta">
                    <span className="sp-company">
                      <span className="sp-logo-box sp-logo-sm">
                        <ImageWithFallback src={exp.logo} alt={exp.company} />
                      </span>
                      {exp.company}
                    </span>
                    <span>
                      <MapPin size={15} /> {exp.location}
                    </span>
                    <span>
                      <Calendar size={15} /> {exp.period}
                    </span>
                  </div>
                </header>

                <p className="sp-mission-summary">{exp.summary}</p>

                <h4 className="sp-subhead">Case files</h4>
                <ul className="sp-cases">
                  {exp.highlights.map((h) => {
                    const i = h.indexOf(":");
                    const hasTitle = i > 0 && i < 70;
                    return (
                      <li key={h}>
                        {hasTitle ? (
                          <>
                            <strong>{h.slice(0, i)}</strong>
                            {h.slice(i)}
                          </>
                        ) : (
                          h
                        )}
                      </li>
                    );
                  })}
                </ul>

                <h4 className="sp-subhead">Gear used</h4>
                <div className="sp-chips">
                  {exp.skills.map((tech) => (
                    <span key={tech} className="sp-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
