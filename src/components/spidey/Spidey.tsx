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

/**
 * Paper-stack scrolling: every `[data-paper]` section is sticky, so the one
 * you've read stays pinned while the next slides over it like a new sheet.
 * A spider in the top-left corner shoots a web line onto the incoming sheet
 * and reels it up as you scroll.
 */
export function PaperStack() {
  const rigRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const patchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-paper]"));
    const rig = rigRef.current;
    const thread = threadRef.current;
    const patch = patchRef.current;
    if (!sections.length || !rig || !thread || !patch) return;

    let stickTops: number[] = [];
    let raf = 0;
    let idleTimer = 0;
    let lastLen = -1;

    const headerHeight = () =>
      document.querySelector(".sp-header")?.getBoundingClientRect().height ?? 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rects = sections.map((s) => s.getBoundingClientRect());

      // Find the sheet currently travelling up (not yet pinned, but on screen).
      let incoming = -1;
      for (let i = 1; i < sections.length; i++) {
        const top = rects[i].top;
        if (top > stickTops[i] + 0.5 && top < vh - 1) {
          incoming = i;
          break;
        }
      }

      // Darken each sheet as the next one covers it.
      sections.forEach((s, i) => {
        const next = rects[i + 1];
        let dim = 0;
        if (next) {
          const travel = vh - stickTops[i + 1];
          dim = travel > 0 ? Math.min(1, Math.max(0, (vh - next.top) / travel)) : 0;
        }
        s.style.setProperty("--paper-dim", (dim * 0.45).toFixed(3));
      });

      const anchorY = rig.getBoundingClientRect().bottom - 6;
      if (incoming === -1) {
        rig.classList.remove("is-pulling");
        thread.style.height = "0px";
        lastLen = 0;
        return;
      }
      const len = Math.max(0, rects[incoming].top - anchorY);
      rig.classList.add("is-pulling");
      thread.style.height = `${len}px`;
      patch.style.transform = `translate(-50%, ${len}px)`;

      if (lastLen >= 0 && Math.abs(len - lastLen) > 0.5) {
        rig.classList.add("is-reeling");
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => rig.classList.remove("is-reeling"), 160);
      }
      lastLen = len;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const measure = () => {
      const header = headerHeight();
      const vh = window.innerHeight;
      stickTops = sections.map((s, i) => {
        // Short sheets pin under the header; tall ones pin once their bottom
        // reaches the bottom of the screen, so nothing is covered unread.
        const t = Math.min(header, vh - s.offsetHeight);
        s.style.top = `${Math.round(t)}px`;
        s.style.zIndex = String(i + 1);
        return Math.round(t);
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
      window.clearTimeout(idleTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sp-puller" aria-hidden="true">
      <div className="sp-puller-rig" ref={rigRef}>
        <div className="sp-puller-anchor" />
        <SpiderGlyph className="sp-puller-spider" />
        <div className="sp-puller-thread" ref={threadRef} />
        <div className="sp-puller-patch" ref={patchRef}>
          <WebDisc className="sp-puller-web" />
        </div>
      </div>
    </div>
  );
}
