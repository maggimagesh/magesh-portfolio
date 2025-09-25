import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { SkillsSection } from "./components/SkillsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection";
import { EducationSection } from "./components/EducationSection";
import React from "react";
import { motion } from "motion/react";
import { Heart, Code } from "lucide-react";
import resume from "./data/resume";

export default function App() {
  return (
    <div className="min-h-screen pr-3 md:pr-6">
      <Header />
      <main>
        <HeroSection />
        <SkillsSection />
        <EducationSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      
      <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-12 border-t border-purple-500/20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Code className="h-5 w-5" />
              <span className="text-lg font-medium">Built with passion for quality</span>
              <Heart className="h-5 w-5 text-pink-400" />
            </div>
            
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} {resume.personal.name}. All rights reserved.
            </p>
            
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              This resume website showcases modern web technologies and attention to detail - 
              the same principles I bring to software testing.
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
              <div className="text-purple-400 text-xs">{resume.personal.title.toUpperCase()}</div>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}