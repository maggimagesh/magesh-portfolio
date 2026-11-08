import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Download, ArrowRight, MousePointer2, Hand } from "lucide-react";
import resume from "../data/resume";

const STATS = [
  { label: "Years Experience", value: "6+" },
  { label: "Projects", value: "10+" },
  { label: "Bug Reports", value: "1000+" },
  { label: "Automation Frameworks", value: "2" },
];

/**
 * Original "scan target" ornament (crosshair + concentric rings) used as the
 * hero's decorative corner pieces — a QA-themed nod to finding bugs.
 */
function ScanOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {[30, 55, 80, 98].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} strokeWidth="1.2" strokeDasharray={r === 98 ? "4 6" : undefined} />
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * 12}
            y1={100 + Math.sin(a) * 12}
            x2={100 + Math.cos(a) * 98}
            y2={100 + Math.sin(a) * 98}
            strokeWidth="1"
          />
        );
      })}
      <circle cx="100" cy="100" r="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Portrait with a "hover to reveal" spotlight: the base layer is a comic-book
 * (halftone, duotone) alter ego; a circular lens that follows the pointer
 * reveals the real photo underneath.
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

  // Start the lens over the face so the first reveal looks intentional.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const place = () => {
      const r = el.getBoundingClientRect();
      setLens(r.width * 0.46, r.height * 0.27);
    };
    place();
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("resize", place);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [setLens]);

  const revealed = active || pinned;
  const avatar = resume.personal.avatar ?? "/logos/me.png";
  const alterEgo = resume.personal.alterEgo;

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
      onClick={() => setPinned((p) => !p)}
      role="img"
      aria-label={`${resume.personal.name} — hover or tap the portrait to reveal the photo behind the comic alter ego`}
    >
      {/* Alter-ego layer */}
      <div className="reveal-layer reveal-alter">
        {alterEgo ? (
          <img src={alterEgo} alt="" draggable={false} />
        ) : (
          <>
            <img src={avatar} alt="" draggable={false} className="reveal-alter-photo" />
            <div className="reveal-halftone" />
            <svg
              className="reveal-visor"
              viewBox="0 0 120 40"
              aria-hidden="true"
            >
              <path
                d="M4 14 C 20 2, 48 4, 60 12 C 72 4, 100 2, 116 14 C 114 30, 92 38, 72 32 C 66 30, 62 26, 60 26 C 58 26, 54 30, 48 32 C 28 38, 6 30, 4 14 Z"
                fill="#0f172a"
              />
              <ellipse cx="34" cy="19" rx="11" ry="6.5" fill="#f8fafc" />
              <ellipse cx="86" cy="19" rx="11" ry="6.5" fill="#f8fafc" />
            </svg>
          </>
        )}
      </div>

      {/* Real photo, clipped to the lens */}
      <div className="reveal-layer reveal-real">
        <img src={avatar} alt="" draggable={false} />
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
    <section id="about" className="comic-hero">
      <div className="comic-hero-dots" aria-hidden="true" />
      <ScanOrnament className="comic-ornament comic-ornament-tl" />
      <ScanOrnament className="comic-ornament comic-ornament-br" />

      <div className="comic-hero-inner">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="comic-hero-copy"
        >
          <p className="comic-kicker">Bug hunter by day · Quality guardian always</p>

          <h1 className="comic-title">
            <span>{first}</span>
            {restName ? <span>{restName}.</span> : null}
          </h1>

          <p className="comic-role">{resume.personal.title}</p>

          <p className="comic-profile">{resume.profile}</p>

          <div className="comic-skills">
            {resume.skills.slice(0, 6).map((skill) => (
              <span key={skill} className="comic-chip">
                {skill}
              </span>
            ))}
          </div>

          <div className="comic-actions">
            <button
              type="button"
              className="comic-btn comic-btn-red"
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Projects <ArrowRight size={18} />
            </button>
            {resume.personal.resumePdf ? (
              <a
                className="comic-btn comic-btn-navy"
                href={resume.personal.resumePdf}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={18} /> Download Resume
              </a>
            ) : null}
          </div>

          <dl className="comic-stats">
            {STATS.map(({ label, value }) => (
              <div key={label} className="comic-stat">
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
          className="comic-hero-art"
        >
          <RevealPortrait />
        </motion.div>
      </div>
    </section>
  );
}
