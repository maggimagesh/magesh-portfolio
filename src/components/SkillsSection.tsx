import React from "react";
import { motion } from "motion/react";
import { TestTube, Wrench, Code, Settings } from "lucide-react";
import { SectionHeading, WebCorner } from "./spidey/Spidey";

const skillCategories = [
  {
    title: "Testing Methodologies",
    tag: "Spidey-Sense",
    icon: TestTube,
    skills: [
      { name: "Manual Testing", level: 95 },
      { name: "Automated Testing", level: 90 },
      { name: "API Testing", level: 90 },
      { name: "Performance Testing", level: 85 },
    ],
  },
  {
    title: "Automation Tools",
    tag: "Web-Shooters",
    icon: Wrench,
    skills: [
      { name: "Selenium WebDriver", level: 90 },
      { name: "TestNG", level: 85 },
      { name: "BDD Cucumber", level: 80 },
      { name: "Playwright", level: 80 },
      { name: "Appium", level: 80 },
    ],
  },
  {
    title: "Programming Languages",
    tag: "Suit Tech",
    icon: Code,
    skills: [
      { name: "Java", level: 80 },
      { name: "TypeScript", level: 75 },
      { name: "SQL", level: 80 },
    ],
  },
  {
    title: "Testing Tools",
    tag: "Utility Belt",
    icon: Settings,
    skills: [
      { name: "JIRA", level: 95 },
      { name: "Postman", level: 90 },
      { name: "Jenkins", level: 85 },
      { name: "Git/GitHub", level: 90 },
      { name: "Docker", level: 75 },
    ],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="sp-section sp-section-red">
      <div className="sp-halftone sp-halftone-light" aria-hidden="true" />
      <WebCorner corner="tr" className="sp-section-web" />

      <div className="sp-container">
        <SectionHeading
          tone="red"
          kicker="Gadgets & Powers"
          title="Skills & Proficiencies"
          subtitle="Every hero needs a toolkit. Here's mine — sharpened over 6 years of hunting bugs across web, API and database layers."
        />

        <div className="sp-grid sp-grid-4">
          {skillCategories.map(({ title, tag, icon: Icon, skills }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="sp-panel sp-gadget"
            >
              <header className="sp-gadget-head">
                <span className="sp-icon-badge">
                  <Icon size={22} />
                </span>
                <div>
                  <span className="sp-tag">{tag}</span>
                  <h3 className="sp-panel-title">{title}</h3>
                </div>
              </header>

              <ul className="sp-meters">
                {skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="sp-meter-label">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div
                      className="sp-meter"
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={skill.level}
                      aria-label={skill.name}
                    >
                      <motion.span
                        className="sp-meter-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
