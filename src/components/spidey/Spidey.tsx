import React, { useEffect, useRef, useState } from "react";

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
  return (
    <div className={`sp-heading sp-heading-${tone}`}>
      <span className="sp-heading-kicker">
        <SpiderGlyph className="sp-heading-glyph" />
        {kicker}
      </span>
      <h2 className="sp-heading-title">{title}</h2>
      {subtitle ? <p className="sp-heading-sub">{subtitle}</p> : null}
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
   Paper stack + the spider that reels each sheet in
   ------------------------------------------------------------------ */

// Spider rig geometry, in SVG viewBox units (viewBox "-60 -50 120 140").
// The spider hangs head-down, like a real spider hauling prey up its line.
const VB = { x: -60, y: -50, w: 120, h: 140 };
const MOUTH = { x: 0, y: 14 }; // where the line leaves the spider
const FRONT = { sx: 6, sy: 11, l1: 30, l2: 34 }; // shoulder + segment lengths
const REACH_HIGH = 22; // tip height at the end of a pull (near the jaws)
const REACH_LOW = 76; // tip height when reaching down to grab the line
const STROKE = REACH_LOW - REACH_HIGH; // line travel per pull, in viewBox units
const BACK_LEGS = [
  // [shoulder x, shoulder y, knee angle°, tip angle°, l1, l2] for the right side;
  // mirrored for the left. They grip the silk above and splay outward.
  [7, 4, -28, 8, 24, 28],
  [8, -1, -58, -18, 24, 30],
  [7, -6, -88, -52, 22, 30],
] as const;

type Pt = { x: number; y: number };

/** Two-segment inverse kinematics; the knee bends away from the body. */
function solveKnee(s: Pt, t: Pt, l1: number, l2: number, side: number): Pt {
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  const d = Math.min(l1 + l2 - 0.01, Math.max(Math.abs(l1 - l2) + 0.01, Math.hypot(dx, dy)));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ux = dx / Math.hypot(dx, dy || 1e-6);
  const uy = dy / Math.hypot(dx, dy || 1e-6);
  const px = s.x + a * ux;
  const py = s.y + a * uy;
  const k1 = { x: px - h * uy, y: py + h * ux };
  const k2 = { x: px + h * uy, y: py - h * ux };
  return k1.x * side > k2.x * side ? k1 : k2;
}

/** Tip of a front leg for a given cycle position p ∈ [0,1). */
function frontTip(p: number, side: number): Pt {
  if (p < 0.5) {
    // gripping the line and hauling it up
    const s = p / 0.5;
    return { x: side * 1.6, y: REACH_LOW - STROKE * s };
  }
  // let go, swing out and reach back down for the next grab
  const s = (p - 0.5) / 0.5;
  const e = 0.5 - 0.5 * Math.cos(Math.PI * s);
  return { x: side * (1.6 + 20 * Math.sin(Math.PI * s)), y: REACH_HIGH + STROKE * e - 6 * Math.sin(Math.PI * s) };
}

function legPath(s: Pt, k: Pt, t: Pt) {
  return `M${s.x.toFixed(2)} ${s.y.toFixed(2)}L${k.x.toFixed(2)} ${k.y.toFixed(2)}L${t.x.toFixed(2)} ${t.y.toFixed(2)}`;
}

const frac = (v: number) => v - Math.floor(v);

/**
 * Paper-stack scrolling: every `[data-paper]` section is sticky, so the one
 * you've read stays pinned while the next slides over it like a new sheet.
 * Each sheet travels one screen height, hauled up hand-over-hand by a spider
 * in the top-left corner. Every pose is derived from the scroll position, so
 * scrolling back plays the pull in reverse (the spider pays the line out).
 */
export function PaperStack() {
  const rigRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const frontRefs = useRef<(SVGPathElement | null)[]>([]);
  const clawRefs = useRef<(SVGCircleElement | null)[]>([]);
  const backRefs = useRef<(SVGPathElement | null)[]>([]);
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
    let lastPulled = 0;
    let dirTimer = 0;

    const pose = (phase: number) => {
      // body bobs slightly with each haul
      body.setAttribute("transform", `translate(0 ${(1.6 * Math.sin(phase * Math.PI * 4)).toFixed(2)})`);
      [-1, 1].forEach((side, i) => {
        const p = frac(phase + (side < 0 ? 0 : 0.5));
        const sh = { x: side * FRONT.sx, y: FRONT.sy };
        const tip = frontTip(p, side);
        const knee = solveKnee(sh, tip, FRONT.l1, FRONT.l2, side);
        frontRefs.current[i]?.setAttribute("d", legPath(sh, knee, tip));
        const claw = clawRefs.current[i];
        if (claw) {
          claw.setAttribute("cx", tip.x.toFixed(2));
          claw.setAttribute("cy", tip.y.toFixed(2));
          claw.setAttribute("r", p < 0.5 ? "2.6" : "1.6"); // closed fist while gripping
        }
      });
      // back legs brace and twitch with the effort
      let j = 0;
      for (const side of [-1, 1]) {
        BACK_LEGS.forEach(([sx, sy, ka, ta, l1, l2], k) => {
          const tw = 4 * Math.sin(phase * Math.PI * 4 + k * 1.3 + (side > 0 ? Math.PI : 0));
          const s0 = { x: side * sx, y: sy };
          const a1 = ((ka + tw) * Math.PI) / 180;
          const knee = { x: s0.x + side * l1 * Math.cos(a1), y: s0.y + l1 * Math.sin(a1) };
          const a2 = ((ta + tw * 0.6) * Math.PI) / 180;
          const tip = { x: knee.x + side * l2 * Math.cos(a2), y: knee.y + l2 * Math.sin(a2) };
          backRefs.current[j++]?.setAttribute("d", legPath(s0, knee, tip));
        });
      }
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const tops = sections.map((s) => s.getBoundingClientRect().top);

      // Each sheet is hauled from the bottom of the screen to just under the
      // header: one screen of scrolling. Summing every sheet's progress gives
      // one continuous "line hauled" value, so the legs never jump between sheets.
      let pulled = 0;
      let incoming = -1;
      for (let i = 1; i < sections.length; i++) {
        const dock = Math.max(stickTops[i], headerBottom);
        const travel = Math.max(1, vh - dock);
        pulled += Math.min(travel, Math.max(0, vh - tops[i]));
        if (incoming === -1 && tops[i] > dock + 0.5 && tops[i] < vh - 1) incoming = i;
      }

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

      // Convert hauled pixels into leg-cycle phase: during each half-cycle one
      // leg hauls exactly STROKE units, so the gripping tip moves with the line.
      const r = svg.getBoundingClientRect();
      const scale = r.height / VB.h; // px per viewBox unit
      pose(pulled / (2 * STROKE * scale));

      const dir = Math.sign(pulled - lastPulled);
      if (dir !== 0) {
        rig.classList.toggle("is-hauling", dir > 0);
        rig.classList.toggle("is-releasing", dir < 0);
        window.clearTimeout(dirTimer);
        dirTimer = window.setTimeout(() => rig.classList.remove("is-hauling", "is-releasing"), 180);
      }
      lastPulled = pulled;

      const mouthY = r.top + (MOUTH.y - VB.y) * scale;
      if (incoming === -1) {
        rig.classList.remove("is-pulling");
        thread.style.height = "0px";
        return;
      }
      const len = Math.max(0, tops[incoming] - mouthY);
      rig.classList.add("is-pulling");
      thread.style.top = `${(MOUTH.y - VB.y) * scale}px`;
      thread.style.height = `${len}px`;
      patch.style.top = `${(MOUTH.y - VB.y) * scale + len}px`;
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
          <g ref={bodyRef}>
            <g className="sp-legs" stroke="currentColor" strokeWidth="3.6">
              {Array.from({ length: 6 }).map((_, i) => (
                <path key={i} ref={(el) => { backRefs.current[i] = el; }} />
              ))}
            </g>
            {/* abdomen (up) and head (down, facing the prey) */}
            <ellipse cx="0" cy="-19" rx="13" ry="17" fill="currentColor" />
            <path d="M-6 -27 Q0 -31 6 -27 M-7 -18 Q0 -22 7 -18 M-6 -9 Q0 -13 6 -9" stroke="#e0182d" strokeWidth="2" />
            <ellipse cx="0" cy="4" rx="9.5" ry="10.5" fill="currentColor" />
            <circle cx="-3.2" cy="9" r="1.7" fill="#fff" />
            <circle cx="3.2" cy="9" r="1.7" fill="#fff" />
            <path d="M-2.4 12.5 L-1.4 15.5 M2.4 12.5 L1.4 15.5" stroke="currentColor" strokeWidth="2.2" />
            <g className="sp-front-legs" stroke="currentColor" strokeWidth="4.2">
              {[0, 1].map((i) => (
                <path key={i} ref={(el) => { frontRefs.current[i] = el; }} />
              ))}
            </g>
            {[0, 1].map((i) => (
              <circle key={i} ref={(el) => { clawRefs.current[i] = el; }} r="2" fill="currentColor" />
            ))}
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
