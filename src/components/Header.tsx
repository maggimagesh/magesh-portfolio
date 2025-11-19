import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Github, Linkedin, Mail, X } from "lucide-react";
import resume from "../data/resume";
import { ImageWithFallback } from "./fallback/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md border-b border-purple-500/20 pr-3 md:pr-6">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <motion.div
                layoutId="profile-image"
                className="w-10 h-10 rounded-full overflow-hidden border border-purple-400/40 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ImageWithFallback
                  src={resume.personal.avatar}
                  alt={resume.personal.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white">{`${resume.personal.name}`}</h1>
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-500/20 text-purple-200 border-purple-400/30"
                >
                  {resume.personal.title}
                </Badge>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {["About", "Skills", "Experience", "Projects", "Contact"].map(
                (item) => (
                  <Button
                    key={item}
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {item}
                  </Button>
                )
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <a href={resume.personal.github} target="_blank" rel="noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Github className="h-4 w-4" />
              </Button>
            </a>
            <a href={resume.personal.linkedin} target="_blank" rel="noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </a>
            <a href={`mailto:${resume.personal.email}`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isModalOpen && (
          <>
            {typeof document !== "undefined" &&
              createPortal(
                <div
                  className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/70 backdrop-blur-sm"
                    onClick={() => {
                      setIsModalOpen(false);
                      setZoom(1);
                    }}
                  />
                  <motion.div
                    layoutId="profile-image"
                    className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl border-4 border-white"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.3
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => {
                      e.preventDefault();
                      const delta = e.deltaY;
                      // Zoom in or out based on scroll direction
                      if (delta < 0) {
                        // Zoom in
                        setZoom(prev => Math.min(prev + 0.1, 3));
                      } else {
                        // Zoom out
                        setZoom(prev => Math.max(prev - 0.1, 1));
                      }
                    }}
                  >
                    <motion.div
                      className="w-full h-full relative"
                      style={{
                        scale: zoom,
                        cursor: zoom > 1 ? 'grab' : 'default',
                        transformOrigin: 'center center'
                      }}
                      drag={zoom > 1}
                      dragMomentum={false}
                      onDragStart={() => {
                        if (zoom > 1) {
                          document.body.style.cursor = 'grabbing';
                        }
                      }}
                      onDragEnd={() => {
                        document.body.style.cursor = 'default';
                      }}
                    >
                      <ImageWithFallback
                        src={resume.personal.avatar}
                        alt={resume.personal.name}
                        className="w-full h-full object-contain"
                      />

                      {/* Close button with circular background - positioned outside the image area but on top of it */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -top-2 -right-2 w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full z-50 cursor-pointer shadow-lg border-2 border-white transition-all duration-200 group"
                        onClick={() => {
                          setIsModalOpen(false);
                          setZoom(1); // Reset zoom when closing
                        }}
                      >
                        <X className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>,
                document.body
              )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
