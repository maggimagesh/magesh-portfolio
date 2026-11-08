import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Download, ArrowRight, MousePointer2, Hand } from "lucide-react";
import resume from "../data/resume";
import { Skyline, SpiderGlyph, WebCorner, scrollToSection } from "./spidey/Spidey";

const STATS = [
  { label: "Years on patrol", value: "6+" },
  { label: "Missions shipped", value: "10+" },
  { label: "Bugs caught", value: "1000+" },
  { label: "Frameworks built", value: "2" },
];

/**
 * Portrait with a "hover to reveal" lens: a comic-poster version sits on top,
 * and a circular lens that follows the pointer reveals the real photo.
 */
function RevealPortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pinned, setPinned] = useState(false);
  const raf = useRef<number | null>(null);

  const setLens = useCallback((x: number, y: number) => {
    const el = frameRef.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--lens-x", `${x}px`);
      el.style.setProperty("--lens-y", `${y}px`);
    });
  }, []);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLens(e.clientX - rect.left, e.clientY - rect.top);
    if (!active) setActive(true);
  };

  // Start the lens over the mask so the first reveal lands on the face.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const place = () => {
      const r = el.getBoundingClientRect();
      setLens(r.width * 0.45, r.height * 0.24);
    };
    place();
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("resize", place);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [setLens]);

  const revealed = active || pinned;
  const real = "/spidey/me-cutout.webp";
  const comic = resume.personal.alterEgo ?? "/spidey/comic.webp";

  return (
    <div
      ref={frameRef}
      className={`reveal-frame${revealed ? " is-revealed" : ""}${pinned ? " is-pinned" : ""}`}
      onPointerMove={handleMove}
      onPointerEnter={handleMove}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setActive(false);
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== "mouse") setActive(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPinned((p) => !p);
      }}
      role="img"
      aria-label={`${resume.personal.name} as comic-book art — hover or tap to reveal the photo`}
    >
      <div className="reveal-sky" aria-hidden="true">
        <div className="reveal-moon" />
        <Skyline className="reveal-skyline" />
        <WebCorner corner="tr" className="reveal-web" />
      </div>

      <img className="reveal-img reveal-suit" src={comic} alt="" draggable={false} />
      <div className="reveal-real">
        <img className="reveal-img" src={real} alt="" draggable={false} />
      </div>
      <div className="reveal-lens-ring" aria-hidden="true" />

      <div className="reveal-hint" aria-hidden="true">
        <MousePointer2 className="reveal-hint-icon reveal-hint-mouse" />
        <Hand className="reveal-hint-icon reveal-hint-touch" />
        <span className="reveal-hint-mouse">Hover to reveal</span>
        <span className="reveal-hint-touch">Touch &amp; drag to reveal</span>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [first, ...rest] = resume.personal.name.split(" ");
  const restName = rest.join(" ");

  return (
    <section data-paper id="about" className="sp-hero">
      <div className="sp-halftone" aria-hidden="true" />
      <WebCorner corner="tl" className="sp-hero-web" />
      <WebCorner corner="br" className="sp-hero-web sp-hero-web-red" />

      <div className="sp-hero-inner">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="sp-hero-copy"
        >
          <p className="sp-kicker">Your friendly neighbourhood QA engineer</p>

          <h1 className="sp-title">
            <span>{first}</span>
            {restName ? <span>{restName}.</span> : null}
          </h1>

          <p className="sp-role">
            <SpiderGlyph className="sp-role-glyph" />
            {resume.personal.title}
          </p>

          <p className="sp-profile">{resume.profile}</p>

          <div className="sp-chips">
            {resume.skills.slice(0, 6).map((skill) => (
              <span key={skill} className="sp-chip">
                {skill}
              </span>
            ))}
          </div>

          <div className="sp-actions">
            <button
              type="button"
              className="sp-btn sp-btn-red"
              onClick={() => scrollToSection("projects")}
            >
              Explore Projects <ArrowRight size={18} />
            </button>
            {resume.personal.resumePdf ? (
              <a
                className="sp-btn sp-btn-navy"
                href={resume.personal.resumePdf}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={18} /> Download Resume
              </a>
            ) : null}
          </div>

          <dl className="sp-stats">
            {STATS.map(({ label, value }) => (
              <div key={label} className="sp-stat">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="sp-hero-art"
        >
          <RevealPortrait />
          <span className="sp-burst sp-burst-hero" aria-hidden="true">
            Spidey-sense: bugs nearby!
          </span>
        </motion.div>
      </div>
    </section>
  );
}
