import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
      <header className="sp-header">
        <div className="sp-header-inner">
          <div className="sp-header-left">
            <div className="sp-brand">
              <motion.div
                layoutId="profile-image"
                className="sp-avatar"
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ImageWithFallback
                  src={resume.personal.avatar}
                  alt={resume.personal.name}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </motion.div>
              <div>
                <p className="sp-header-name">{resume.personal.name}</p>
                <span className="sp-header-title">{resume.personal.title}</span>
              </div>
            </div>

            <nav className="sp-nav" aria-label="Sections">
              {["About", "Skills", "Education", "Experience", "Projects", "Contact"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="sp-nav-link"
                  >
                    {item}
                  </button>
                )
              )}
            </nav>
          </div>

          <div className="sp-header-social">
            <a className="sp-icon-btn" href={resume.personal.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
            <a className="sp-icon-btn" href={resume.personal.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
            <a className="sp-icon-btn" href={`mailto:${resume.personal.email}`} aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isModalOpen && (
          <>
            {typeof document !== "undefined" &&
              createPortal(
                <>
                  {/* Modal backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 100,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(8px)'
                    }}
                    onClick={() => {
                      setIsModalOpen(false);
                      setZoom(1);
                    }}
                  />
                  
                  {/* Image container - centered with fixed positioning */}
                  <div
                    style={{
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 100,
                      width: '90%',
                      maxWidth: '672px'
                    }}
                  >
                    <motion.div
                      layoutId="profile-image"
                      className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl border-4 border-white"
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
                          cursor: zoom > 1 ? 'grab' : 'pointer',
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
                          className="w-full h-full object-contain cursor-pointer"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Close button - fixed at top right of viewport */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'fixed',
                      top: '32px',
                      right: '32px',
                      zIndex: 101,
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      border: '2px solid #d1d5db',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer'
                    }}
                    className="hover:bg-gray-100 hover:scale-110 transition-all duration-200"
                    onClick={() => {
                      setIsModalOpen(false);
                      setZoom(1);
                    }}
                  >
                    <X className="h-6 w-6 text-gray-700" />
                  </motion.button>
                </>,
                document.body
              )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
