import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------
   Shared spider-theme pieces: web corners, emblem, headings, effects
   ------------------------------------------------------------------ */

/** Builds a quarter (or full) cobweb path anchored at (0,0). */
function webPath(size: number, spokes: number, rings: number, full = false) {
  const span = full ? Math.PI * 2 : Math.PI / 2;
  const angles = Array.from({ length: spokes + (full ? 0 : 1) }, (_, i) => (i * span) / spokes);
  let d = "";
  for (const a of angles) {
    d += `M0 0L${(Math.cos(a) * size).toFixed(1)} ${(Math.sin(a) * size).toFixed(1)}`;
  }
  for (let r = 1; r <= rings; r++) {
    const rad = (size * r) / (rings + 0.6);
    const ring = full ? [...angles, angles[0] + Math.PI * 2] : angles;
    for (let i = 0; i < ring.length - 1; i++) {
      const a1 = ring[i];
      const a2 = ring[i + 1];
      const x1 = Math.cos(a1) * rad;
      const y1 = Math.sin(a1) * rad;
      const x2 = Math.cos(a2) * rad;
      const y2 = Math.sin(a2) * rad;
      const mid = (a1 + a2) / 2;
      const sag = rad * 0.86;
      d += `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${(Math.cos(mid) * sag).toFixed(1)} ${(
        Math.sin(mid) * sag
      ).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }
  }
  return d;
}

const CORNER_PATH = webPath(300, 8, 7);
const FULL_PATH = webPath(100, 12, 6, true);

type Corner = "tl" | "tr" | "bl" | "br";

export function WebCorner({ corner, className }: { corner: Corner; className?: string }) {
  const flip = {
    tl: "",
    tr: "scale(-1 1) translate(-300 0)",
    bl: "scale(1 -1) translate(0 -300)",
    br: "scale(-1 -1) translate(-300 -300)",
  }[corner];
  return (
    <svg
      className={`sp-web-corner sp-web-${corner} ${className ?? ""}`}
      viewBox="0 0 300 300"
      aria-hidden="true"
    >
      <path d={CORNER_PATH} transform={flip} fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function WebDisc({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-100 -100 200 200" aria-hidden="true">
      <path d={FULL_PATH} fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Original eight-legged spider glyph. */
export function SpiderGlyph({ className, title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="-3 -6 106 128" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <g fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="50" cy="22" rx="8" ry="9" />
        <ellipse cx="50" cy="44" rx="13" ry="16" />
        <ellipse cx="50" cy="80" rx="17" ry="25" />
        <g fill="none" strokeWidth="5">
          <path d="M40 36 L18 18 L12 -2" />
          <path d="M60 36 L82 18 L88 -2" />
          <path d="M38 44 L10 34 L0 20" />
          <path d="M62 44 L90 34 L100 20" />
          <path d="M38 54 L10 66 L2 86" />
          <path d="M62 54 L90 66 L98 86" />
          <path d="M40 62 L20 88 L16 118" />
          <path d="M60 62 L80 88 L84 118" />
        </g>
      </g>
    </svg>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  tone = "dark",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  tone?: "dark" | "light" | "red";
}) {
  const ref = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger reveal: kicker slides in, title rises through a mask,
  // subtitle tips up in 3D. Skipped entirely for reduced-motion visitors.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 82%", once: true } })
          .from(".sp-heading-kicker", { x: -30, opacity: 0, clipPath: "inset(0 100% 0 0)", duration: 0.55, ease: "power3.out" })
          .from(".sp-heading-reveal > span", { yPercent: 110, duration: 0.8, ease: "power4.out" }, "-=0.25")
          .from(
            ".sp-heading-sub",
            { y: 30, opacity: 0, rotationX: -40, transformOrigin: "50% 100%", duration: 0.75, ease: "back.out(1.6)" },
            "-=0.45"
          );
      });
    }, el);
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <div ref={ref} className={`sp-heading sp-heading-${tone}`}>
      <span className="sp-heading-kicker">
        <SpiderGlyph className="sp-heading-glyph" />
        {kicker}
      </span>
      <h2 className="sp-heading-title">
        <span className="sp-heading-reveal">
          <span>{title}</span>
        </span>
      </h2>
      {subtitle ? (
        <div className="sp-heading-subwrap">
          <p className="sp-heading-sub">{subtitle}</p>
        </div>
      ) : null}
    </div>
  );
}

/** Night-city skyline silhouette used behind the hero portrait. */
export function Skyline({ className, stretch = false }: { className?: string; stretch?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 220"
      preserveAspectRatio={stretch ? "none" : "xMidYMax slice"}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M0 220V150h22v-30h18v30h14V96h30v54h10V70h8V52h6v18h8v80h16v-46h26v46h12V30h4V12h4v18h4v120h18V110h22v40h10V86h34v64h14V60l18-14 18 14v90h14v-38h28v38h10V96h12V74h10v22h12v54h18v-60h30v60h10v-34h22v34h14V40h26v110h12v-44h28v44h20V120h20v100z"
      />
      <g fill="#fde68a" opacity="0.8">
        {[
          [70, 110], [70, 128], [148, 70], [148, 92], [218, 120], [292, 100], [300, 124],
          [336, 78], [344, 100], [430, 110], [488, 64], [496, 90], [488, 116], [550, 134],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="5" height="7" />
        ))}
      </g>
    </svg>
  );
}

/** Click anywhere to "shoot" a web splat (decorative, pointer-events: none). */
export function WebShooter() {
  const [shots, setShots] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("input, textarea, select, label")) return;
      const id = nextId.current++;
      setShots((s) => [...s.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setShots((s) => s.filter((p) => p.id !== id)), 900);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="sp-shots" aria-hidden="true">
      {shots.map((s) => (
        <div key={s.id} className="sp-shot" style={{ left: s.x, top: s.y }}>
          <WebDisc className="sp-shot-web" />
          <span className="sp-shot-text">THWIP!</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Scrolls to a section's natural (un-stuck) position. Needed because the
 * paper-stack sections are sticky: once pinned, scrollIntoView thinks they
 * are already on screen and does nothing.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const prevPosition = el.style.position;
  el.style.position = "static";
  const top = el.getBoundingClientRect().top + window.scrollY;
  el.style.position = prevPosition;
  const header = document.querySelector(".sp-header")?.getBoundingClientRect().height ?? 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: Math.max(0, top - header), behavior: reduce ? "auto" : "smooth" });
}

/* ------------------------------------------------------------------
   Paper stack + the spider that hauls the page
   ------------------------------------------------------------------ */

// Spider rig geometry, in SVG viewBox units. A real spider is wide and low:
// a compact two-part body with long, arched legs spread far out. It hangs
// head-down, the way a spider hauls prey up its line.
const VB = { x: -80, y: -40, w: 160, h: 120 };
const MOUTH = { x: 0, y: 13 }; // where the line leaves the spider
const FRONT = { sx: 4.5, sy: 9, l1: 24, l2: 27 }; // front-leg shoulders + segments
const REACH_HIGH = 18; // tip height at the end of a haul (at the jaws)
const REACH_LOW = 64; // tip height when reaching down to grab the line
const STROKE = REACH_LOW - REACH_HIGH; // line hauled per stroke, viewBox units
// Back legs, right side (mirrored for left): shoulder, knee angle°, tip angle°,
// segment lengths. Knees sit high above the tips for the arched spider look.
const BACK_LEGS = [
  { sx: 6, sy: 6, ka: -22, ta: 48, l1: 30, l2: 36 },
  { sx: 7, sy: 2, ka: -48, ta: 18, l1: 30, l2: 38 },
  { sx: 6, sy: -2, ka: -82, ta: -22, l1: 28, l2: 36 },
];

type Pt = { x: number; y: number };

/** Two-segment inverse kinematics; the knee bends away from the body. */
function solveKnee(s: Pt, t: Pt, l1: number, l2: number, side: number): Pt {
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  const len = Math.hypot(dx, dy) || 1e-6;
  const d = Math.min(l1 + l2 - 0.01, Math.max(Math.abs(l1 - l2) + 0.01, len));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ux = dx / len;
  const uy = dy / len;
  const px = s.x + a * ux;
  const py = s.y + a * uy;
  const k1 = { x: px - h * uy, y: py + h * ux };
  const k2 = { x: px + h * uy, y: py - h * ux };
  return k1.x * side > k2.x * side ? k1 : k2;
}

/** Tip of a front leg for a cycle position p ∈ [0,1). */
function frontTip(p: number, side: number): Pt {
  if (p < 0.5) {
    // gripping the line and hauling it up
    const s = p / 0.5;
    return { x: side * 1.4, y: REACH_LOW - STROKE * s };
  }
  // let go, swing out and reach back down for the next grab
  const s = (p - 0.5) / 0.5;
  const e = 0.5 - 0.5 * Math.cos(Math.PI * s);
  return { x: side * (1.4 + 22 * Math.sin(Math.PI * s)), y: REACH_HIGH + STROKE * e - 8 * Math.sin(Math.PI * s) };
}

/** Smooth leg: shoulder → knee → tip with a slight curve, like a real segment. */
function legPath(s: Pt, k: Pt, t: Pt) {
  const f = (v: number) => v.toFixed(2);
  const c1 = { x: (s.x + k.x) / 2, y: (s.y + k.y) / 2 - 2 };
  const c2 = { x: (k.x + t.x) / 2, y: (k.y + t.y) / 2 - 1 };
  return `M${f(s.x)} ${f(s.y)}Q${f(c1.x)} ${f(c1.y)} ${f(k.x)} ${f(k.y)}Q${f(c2.x)} ${f(c2.y)} ${f(t.x)} ${f(t.y)}`;
}

const frac = (v: number) => v - Math.floor(v);

/**
 * Paper-stack scrolling: every `[data-paper]` section is sticky, so the one
 * you've read stays pinned while the next slides over it like a new sheet.
 *
 * A glowing spider in the top-left corner hauls the page up its line the
 * whole time you scroll: its front legs take turns gripping and pulling, and
 * every pose comes from the scroll position, so it pulls as you scroll down,
 * pays the line out as you scroll up, and freezes when you stop.
 */
export function PaperStack() {
  const rigRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const frontRefs = useRef<(SVGPathElement | null)[]>([]);
  const kneeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const clawRefs = useRef<(SVGCircleElement | null)[]>([]);
  const backRefs = useRef<(SVGPathElement | null)[]>([]);
  const backKneeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);
  const patchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-paper]"));
    const rig = rigRef.current;
    const svg = svgRef.current;
    const body = bodyRef.current;
    const thread = threadRef.current;
    const patch = patchRef.current;
    if (!sections.length || !rig || !svg || !body || !thread || !patch) return;

    let stickTops: number[] = [];
    let headerBottom = 0;
    let raf = 0;
    let lastY = window.scrollY;
    let dirTimer = 0;

    const setCircle = (c: SVGCircleElement | null | undefined, p: Pt) => {
      if (!c) return;
      c.setAttribute("cx", p.x.toFixed(2));
      c.setAttribute("cy", p.y.toFixed(2));
    };

    const pose = (phase: number) => {
      // the body rocks slightly with each haul
      const bob = 1.4 * Math.sin(phase * Math.PI * 4);
      const tilt = 3 * Math.sin(phase * Math.PI * 2);
      body.setAttribute("transform", `translate(0 ${bob.toFixed(2)}) rotate(${tilt.toFixed(2)} 0 0)`);

      [-1, 1].forEach((side, i) => {
        const p = frac(phase + (side < 0 ? 0 : 0.5));
        const sh = { x: side * FRONT.sx, y: FRONT.sy };
        const tip = frontTip(p, side);
        const knee = solveKnee(sh, tip, FRONT.l1, FRONT.l2, side);
        frontRefs.current[i]?.setAttribute("d", legPath(sh, knee, tip));
        setCircle(kneeRefs.current[i], knee);
        const claw = clawRefs.current[i];
        setCircle(claw, tip);
        claw?.setAttribute("r", p < 0.5 ? "2.4" : "1.5"); // closed grip while hauling
      });

      // back legs brace and shift with the effort
      let j = 0;
      for (const side of [-1, 1]) {
        BACK_LEGS.forEach((L, k) => {
          const tw = 5 * Math.sin(phase * Math.PI * 4 + k * 1.4 + (side > 0 ? Math.PI : 0));
          const s0 = { x: side * L.sx, y: L.sy };
          const a1 = ((L.ka + tw) * Math.PI) / 180;
          const knee = { x: s0.x + side * L.l1 * Math.cos(a1), y: s0.y + L.l1 * Math.sin(a1) };
          const a2 = ((L.ta + tw * 0.5) * Math.PI) / 180;
          const tip = { x: knee.x + side * L.l2 * Math.cos(a2), y: knee.y + L.l2 * Math.sin(a2) };
          backRefs.current[j]?.setAttribute("d", legPath(s0, knee, tip));
          setCircle(backKneeRefs.current[j], knee);
          j++;
        });
      }
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const tops = sections.map((s) => s.getBoundingClientRect().top);

      // Darken each sheet as the next one covers it.
      sections.forEach((s, i) => {
        let dim = 0;
        if (i + 1 < sections.length) {
          const dock = Math.max(stickTops[i + 1], headerBottom);
          const travel = vh - dock;
          dim = travel > 0 ? Math.min(1, Math.max(0, (vh - tops[i + 1]) / travel)) : 0;
        }
        s.style.setProperty("--paper-dim", (dim * 0.45).toFixed(3));
      });

      // The line is hauled exactly as fast as the page scrolls, so the
      // gripping leg tip moves with the line: one stroke per STROKE units.
      const r = svg.getBoundingClientRect();
      const scale = r.height / VB.h; // px per viewBox unit
      pose(y / (2 * STROKE * scale));

      const dir = Math.sign(y - lastY);
      if (dir !== 0) {
        rig.classList.toggle("is-hauling", dir > 0);
        rig.classList.toggle("is-releasing", dir < 0);
        window.clearTimeout(dirTimer);
        dirTimer = window.setTimeout(() => rig.classList.remove("is-hauling", "is-releasing"), 180);
      }
      lastY = y;

      // The line runs to the edge of the incoming sheet when one is on its
      // way up, otherwise down off the bottom of the screen.
      let incoming = -1;
      for (let i = 1; i < sections.length; i++) {
        const dock = Math.max(stickTops[i], headerBottom);
        if (tops[i] > dock + 0.5 && tops[i] < vh - 1) {
          incoming = i;
          break;
        }
      }
      const mouthTop = (MOUTH.y - VB.y) * scale;
      const mouthY = r.top + mouthTop;
      const end = incoming === -1 ? vh + 20 : tops[incoming];
      const len = Math.max(0, end - mouthY);
      thread.style.top = `${mouthTop}px`;
      thread.style.height = `${len}px`;
      // beads ride with the page, so you can see the line being hauled
      thread.style.backgroundPosition = `0 ${(-y).toFixed(1)}px`;
      patch.style.top = `${mouthTop + len}px`;
      rig.classList.toggle("is-hooked", incoming !== -1);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const measure = () => {
      headerBottom = document.querySelector(".sp-header")?.getBoundingClientRect().bottom ?? 0;
      const vh = window.innerHeight;
      stickTops = sections.map((s, i) => {
        // Short sheets pin under the header; tall ones pin once their bottom
        // reaches the bottom of the screen, so nothing is covered unread.
        const t = Math.round(Math.min(headerBottom, vh - s.offsetHeight));
        s.style.top = `${t}px`;
        s.style.zIndex = String(i + 1);
        return t;
      });
      schedule();
    };

    const ro = new ResizeObserver(measure);
    sections.forEach((s) => ro.observe(s));
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.clearTimeout(dirTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sp-puller" aria-hidden="true">
      <div className="sp-puller-rig" ref={rigRef}>
        <div className="sp-puller-anchor" />
        <svg
          ref={svgRef}
          className="sp-puller-spider"
          viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <radialGradient id="sp-abdomen" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#2a3150" />
              <stop offset="60%" stopColor="#11152a" />
              <stop offset="100%" stopColor="#05060d" />
            </radialGradient>
            <radialGradient id="sp-head" cx="45%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#262c48" />
              <stop offset="100%" stopColor="#070912" />
            </radialGradient>
            <linearGradient id="sp-neon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff3d6e" />
              <stop offset="55%" stopColor="#ff2bd6" />
              <stop offset="100%" stopColor="#38e8ff" />
            </linearGradient>
            <filter id="sp-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g ref={bodyRef}>
            {/* legs: dark segments with glowing joints */}
            <g stroke="#0a0c16" strokeWidth="3.2">
              {Array.from({ length: 6 }).map((_, i) => (
                <path key={i} ref={(el) => { backRefs.current[i] = el; }} />
              ))}
            </g>
            <g className="sp-front-legs" stroke="#0a0c16" strokeWidth="3.6">
              {[0, 1].map((i) => (
                <path key={i} ref={(el) => { frontRefs.current[i] = el; }} />
              ))}
            </g>
            <g fill="#38e8ff" filter="url(#sp-glow)">
              {Array.from({ length: 6 }).map((_, i) => (
                <circle key={i} r="1.6" ref={(el) => { backKneeRefs.current[i] = el; }} />
              ))}
              {[0, 1].map((i) => (
                <circle key={i} r="1.8" ref={(el) => { kneeRefs.current[i] = el; }} />
              ))}
            </g>
            {[0, 1].map((i) => (
              <circle key={i} r="2" fill="#ff2bd6" filter="url(#sp-glow)" ref={(el) => { clawRefs.current[i] = el; }} />
            ))}

            {/* abdomen (up) with an original glowing marking */}
            <ellipse cx="0" cy="-14" rx="11.5" ry="13" fill="url(#sp-abdomen)" stroke="#05060d" strokeWidth="1" />
            <g filter="url(#sp-glow)" stroke="url(#sp-neon)" strokeWidth="1.9">
              <path d="M0 -24 L5 -16 L0 -8 L-5 -16 Z" />
              <path d="M-7.5 -20 Q-9 -14 -7.5 -8 M7.5 -20 Q9 -14 7.5 -8" />
              <path d="M0 -8 L0 -4" />
            </g>
            {/* waist + head (down, facing the line) */}
            <ellipse cx="0" cy="0" rx="3" ry="2.4" fill="#070912" />
            <ellipse cx="0" cy="7" rx="7.5" ry="7" fill="url(#sp-head)" stroke="#05060d" strokeWidth="1" />
            <g fill="#ff3d6e" filter="url(#sp-glow)">
              <circle cx="-2.4" cy="10.2" r="1.15" />
              <circle cx="2.4" cy="10.2" r="1.15" />
              <circle cx="-4.6" cy="8.6" r="0.75" />
              <circle cx="4.6" cy="8.6" r="0.75" />
            </g>
            <path d="M-1.6 12.2 L-1 14.2 M1.6 12.2 L1 14.2" stroke="#05060d" strokeWidth="1.6" />
          </g>
        </svg>
        <div className="sp-puller-thread" ref={threadRef} />
        <div className="sp-puller-patch" ref={patchRef}>
          <WebDisc className="sp-puller-web" />
        </div>
      </div>
    </div>
  );
}
