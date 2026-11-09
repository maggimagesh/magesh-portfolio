import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import resume from "../data/resume";
import { SpiderGlyph, WebDisc } from "./spidey/Spidey";

const list = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0] ?? "";

/** Split the profile into a short lead sentence and the rest. */
function profileParagraphs() {
  const text = resume.profile.trim();
  const cut = text.indexOf(". ");
  const lead = cut > 0 ? text.slice(0, cut + 1) : text;
  const rest = cut > 0 ? text.slice(cut + 2) : "";
  const personal = `${list(resume.personality.slice(0, 3))} by nature. I speak ${list(
    resume.languages.map((l) => l.name)
  )}, and outside work I'm into ${list(resume.interests.slice(0, 4).map((i) => i.toLowerCase()))}.`;
  return [lead, rest, personal].filter(Boolean);
}

/**
 * About: a profile photo suspended from the ceiling on a long thread, hanging
 * webs in the corners, and a GSAP ScrollTrigger entrance. The entrance runs as
 * one timeline; the ambient motion (swing, web rotation, glow, floating pills)
 * runs as separate tweens that start once the entrance finishes.
 */
export function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);
  const hangRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const paragraphs = profileParagraphs();

  useEffect(() => {
    const root = rootRef.current;
    const hang = hangRef.current;
    const frame = frameRef.current;
    if (!root || !hang || !frame) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ambient motion, created paused and started after the entrance
        const swing = gsap.fromTo(
          hang,
          { rotation: -2.6 },
          { rotation: 2.6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true, transformOrigin: "50% 0%" }
        );
        const glow = gsap.to(frame, {
          boxShadow: "0 0 0 6px #fff, 0 0 0 10px #e0182d, 0 18px 60px rgba(224, 24, 45, 0.55)",
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          paused: true,
        });
        const webs = [
          gsap.to(".ab-web-left .ab-web-svg", { rotation: 360, duration: 140, ease: "none", repeat: -1, paused: true }),
          gsap.to(".ab-web-right .ab-web-svg", { rotation: -360, duration: 160, ease: "none", repeat: -1, paused: true }),
        ];
        const floats = gsap.utils.toArray<HTMLElement>(".ab-pill").map((pill) =>
          gsap.to(pill, {
            y: -5,
            duration: gsap.utils.random(1.6, 2.6),
            delay: gsap.utils.random(0, 1.2),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: true,
          })
        );

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
          onComplete: () => {
            swing.play();
            glow.play();
            floats.forEach((f) => f.play());
          },
        });
        tl.from(".ab-web", { y: -320, opacity: 0, duration: 1.4, ease: "elastic.out(1, 0.55)", stagger: 0.15 })
          .add(() => webs.forEach((w) => w.play()), "<0.2")
          .from(".ab-eyebrow", { x: -40, opacity: 0, clipPath: "inset(0 100% 0 0)", duration: 0.6, ease: "power3.out" }, "-=1.0")
          .from(".ab-title-line > span", { yPercent: 110, duration: 0.85, ease: "power4.out", stagger: 0.12 }, "-=0.35")
          .from(hang, { y: -800, duration: 1.7, ease: "elastic.out(1, 0.42)" }, "-=0.9")
          .from(
            ".ab-para",
            { y: 40, opacity: 0, rotationX: -45, transformOrigin: "50% 100%", duration: 0.85, ease: "back.out(1.6)", stagger: 0.15 },
            "-=1.3"
          )
          .from(".ab-pill", { scale: 0.5, opacity: 0, y: 20, duration: 0.5, ease: "back.out(2.2)", stagger: 0.06 }, "-=0.5");
      });
    }, root);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section data-paper id="about" ref={rootRef} className="sp-section sp-section-paper ab-section">
      <div className="sp-halftone" aria-hidden="true" />

      {/* webs hanging from the top corners on thin threads */}
      <div className="ab-web ab-web-left" aria-hidden="true">
        <span className="ab-web-thread" />
        <WebDisc className="ab-web-svg" />
      </div>
      <div className="ab-web ab-web-right" aria-hidden="true">
        <span className="ab-web-thread" />
        <WebDisc className="ab-web-svg" />
      </div>

      <div className="sp-container ab-grid">
        <div className="ab-hang-wrap">
          <div className="ab-hang" ref={hangRef}>
            <span className="ab-thread" aria-hidden="true" />
            <div className="ab-frame" ref={frameRef}>
              {/* photo + suit are one unit: they share the frame, so they
                  swing, scale and colour-shift together, and hover never
                  removes the suit */}
              <div className="ab-figure">
                <img
                  className="ab-photo"
                  src="/about/bust-photo-v2.webp"
                  alt={`${resume.personal.name} in black and red armour`}
                  width={490}
                  height={490}
                />
                <img className="ab-suit" src="/about/bust-suit-v2.webp" alt="" aria-hidden="true" width={490} height={490} />
              </div>
            </div>
          </div>
        </div>

        <div className="ab-copy">
          <p className="ab-eyebrow">
            <SpiderGlyph className="ab-eyebrow-glyph" />
            About me
          </p>
          <h2 className="ab-title">
            <span className="ab-title-line">
              <span>Breaking things</span>
            </span>
            <span className="ab-title-line ab-title-accent">
              <span>so you don't have to.</span>
            </span>
          </h2>
          <div className="ab-paras">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="ab-para">
                {p}
              </p>
            ))}
          </div>
          <ul className="ab-pills" aria-label="Tech stack">
            {resume.skills.map((s) => (
              <li key={s} className="ab-pill">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
