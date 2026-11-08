import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { SkillsSection } from "./components/SkillsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection";
import { EducationSection } from "./components/EducationSection";
import React from "react";
import { motion } from "motion/react";
import resume from "./data/resume";
import { PaperStack, SpiderGlyph, WebShooter, Skyline } from "./components/spidey/Spidey";

export default function App() {
  return (
    <div className="sp-app">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <EducationSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <footer className="sp-footer">
        <Skyline className="sp-footer-skyline" stretch />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="sp-footer-inner"
        >
          <SpiderGlyph className="sp-footer-glyph" />
          <p className="sp-footer-quote">
            “With great test coverage comes great responsibility.”
          </p>
          <p className="sp-footer-copy">
            &copy; {new Date().getFullYear()} {resume.personal.name} · {resume.personal.title}
          </p>
          <p className="sp-footer-note">
            A fan-made spider theme for a personal portfolio. Not affiliated with or endorsed by Marvel.
          </p>
        </motion.div>
      </footer>

      <PaperStack />
      <WebShooter />
    </div>
  );
}
