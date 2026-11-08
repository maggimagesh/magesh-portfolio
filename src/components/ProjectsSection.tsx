import React from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import resume from "../data/resume";
import { SectionHeading, WebCorner } from "./spidey/Spidey";

const BURSTS = ["THWIP!", "POW!", "ZAP!", "BAM!"];

export function ProjectsSection() {
  return (
    <section id="projects" className="sp-section sp-section-paper">
      <div className="sp-halftone" aria-hidden="true" />
      <WebCorner corner="tr" className="sp-section-web sp-section-web-dark" />

      <div className="sp-container">
        <SectionHeading
          tone="light"
          kicker="Side Missions"
          title="Projects"
          subtitle="Things I've built when I'm not out catching regressions."
        />

        <div className="sp-grid sp-grid-2">
          {resume.projects.map((proj, index) => (
            <motion.article
              key={proj.name}
              initial={{ opacity: 0, y: 40, rotate: index % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 0.6 : -0.6 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 0, y: -6 }}
              transition={{ duration: 0.45 }}
              className="sp-panel sp-project"
            >
              <span className="sp-burst" aria-hidden="true">
                {BURSTS[index % BURSTS.length]}
              </span>
              <span className="sp-issue">Panel #{String(index + 1).padStart(2, "0")}</span>
              <h3 className="sp-project-title">{proj.name}</h3>
              <p className="sp-project-desc">{proj.description}</p>

              {proj.status ? (
                <p className="sp-status">
                  <span>Status</span> {proj.status}
                </p>
              ) : null}

              <div className="sp-chips">
                {proj.tech.map((tech) => (
                  <span key={tech} className="sp-chip">
                    {tech}
                  </span>
                ))}
              </div>

              {proj.link ? (
                <a className="sp-btn sp-btn-red sp-btn-sm" href={proj.link} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} /> Swing by (Live)
                </a>
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
