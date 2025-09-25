import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Github, Linkedin, Mail } from "lucide-react";
import resume from "../data/resume";
import { ImageWithFallback } from "./fallback/ImageWithFallback";

export function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md border-b border-purple-500/20 pr-3 md:pr-6">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-400/40">
              <ImageWithFallback src={resume.personal.avatar} alt={resume.personal.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{`${resume.personal.name}`}</h1>
              <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-200 border-purple-400/30">
                {resume.personal.title}
              </Badge>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1">
            {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((item) => (
              <Button 
                key={item}
                variant="ghost" 
                size="sm"
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {item}
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <a href={resume.personal.github} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
              <Github className="h-4 w-4" />
            </Button>
          </a>
          <a href={resume.personal.linkedin} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
              <Linkedin className="h-4 w-4" />
            </Button>
          </a>
          <a href={`mailto:${resume.personal.email}`}>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
              <Mail className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}