import {
  type FormEvent,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  CodeXml,
  ContactRound,
  ExternalLink,
  GraduationCap,
  LoaderCircle,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

const portrait =
  "/logos/me.png";

const motionImages = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const expertise = [
  {
    number: "01",
    name: "Test Automation",
    description:
      "Scalable Playwright + TypeScript and Selenium + Java frameworks built around maintainable page objects, reusable fixtures, and dependable end-to-end coverage.",
  },
  {
    number: "02",
    name: "API & Data Quality",
    description:
      "Contract, integration, and data validation across Postman, Rest Assured, SQL, and interconnected business systems—catching failures beyond the browser.",
  },
  {
    number: "03",
    name: "Quality Architecture",
    description:
      "Pragmatic test strategy, risk-based coverage, stable selectors, meaningful reporting, and framework decisions that reduce maintenance as products grow.",
  },
  {
    number: "04",
    name: "CI/CD Quality Gates",
    description:
      "Automation integrated with Jenkins, Bitbucket, Git, and AWS pipelines so teams get fast, useful feedback before releases move forward.",
  },
  {
    number: "05",
    name: "QA Leadership",
    description:
      "Release sign-off, cross-product coordination, defect triage, mentoring, and clear quality ownership across complex customer and internal platforms.",
  },
];

const experience = [
  {
    company: "Zoho",
    role: "Quality Analyst",
    period: "Dec 2025 — Present",
    location: "Chennai",
    logo: "/logos/zoho-logo.png",
    summary:
      "Quality engineering for data and crawling platforms, with a focus on resilient validation, protocol-level investigation, and production-grade test design.",
    tags: ["Quality Engineering", "Java", "API Testing", "Data Validation"],
  },
  {
    company: "Nibav Lifts Pvt Ltd",
    role: "Software Quality Engineer · Team Lead",
    period: "Jun 2024 — Nov 2025",
    location: "Chennai",
    logo: "/logos/nibav-logo.png",
    summary:
      "Owned quality strategy and automation across sales, factory, orders, logistics, HRIS, SOS, and customer-facing products while coordinating a 14-member QA team.",
    tags: ["Playwright", "TypeScript", "Postman", "MySQL", "AWS Pipeline"],
  },
  {
    company: "Infosys",
    role: "Software Test Engineer",
    period: "Nov 2019 — Jun 2024",
    location: "Chennai",
    logo: "/logos/infosys-logo.png",
    summary:
      "Delivered manual and automated testing across banking and e-commerce, including customer journeys, payment flows, regulatory scenarios, API checks, and data-driven regression.",
    tags: ["Selenium", "Java", "Cucumber", "TestNG", "Rest Assured", "Jenkins"],
  },
];

type Project = {
  number: string;
  name: string;
  category: string;
  description: string;
  href: string;
  cta: string;
  tags: string[];
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  tone: string;
};

const projects: Project[] = [
  {
    number: "01",
    name: "Angaadi",
    category: "Automation practice platform",
    description:
      "A realistic e-commerce product designed for automation engineers to practise UI, API, cart, checkout, and order-tracking scenarios against modern application behaviour.",
    href: "https://angaadi.vercel.app",
    cta: "Live project",
    tags: ["Next.js", "TypeScript", "Playwright-ready", "E-commerce"],
    metric: "E2E",
    metricLabel: "Real-world test journeys",
    icon: Workflow,
    tone: "project-purple",
  },
  {
    number: "02",
    name: "Career Spider",
    category: "AI-assisted product",
    description:
      "A focused job-discovery experience that helps people search, filter, and track roles with an AI-assisted workflow and a fast, approachable interface.",
    href: "https://career-spider.vercel.app",
    cta: "Live project",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    metric: "AI",
    metricLabel: "Assisted role discovery",
    icon: Sparkles,
    tone: "project-orange",
  },
  {
    number: "03",
    name: "Enterprise QA Systems",
    category: "Professional case study",
    description:
      "Quality coverage spanning sales, manufacturing, logistics, HRIS, banking, and e-commerce—connecting browser automation, APIs, databases, and release decisions.",
    href: "#experience",
    cta: "View experience",
    tags: ["Playwright", "Selenium", "API", "SQL", "CI/CD"],
    metric: "6+",
    metricLabel: "Years building confidence",
    icon: ShieldCheck,
    tone: "project-blue",
  },
];

const education = [
  {
    degree: "B.E. Mechanical Engineering",
    institution: "Adhiyamaan College of Engineering",
    period: "2015 — 2019",
    location: "Hosur",
  },
  {
    degree: "Higher Secondary",
    institution: "Sunbeam Matric Hr. Sec. School",
    period: "2014 — 2015",
    location: "Katpadi",
  },
  {
    degree: "Secondary School",
    institution: "Saraswathi Vidhyalaya Matric Hr. Sec. School",
    period: "2012 — 2013",
    location: "Gudiyatham",
  },
];

type FadeInProps = PropsWithChildren<{
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}>;

function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ContactButton({ href = "#contact" }: { href?: string }) {
  return (
    <a href={href} className="contact-button group">
      <span>Contact me</span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}

function LiveProjectButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="live-project-button group"
    >
      {label}
      <ExternalLink
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
      />
    </a>
  );
}

function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
}: PropsWithChildren<{
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left - padding &&
        event.clientX <= rect.right + padding &&
        event.clientY >= rect.top - padding &&
        event.clientY <= rect.bottom + padding;

      if (!inside) {
        setActive(false);
        setOffset({ x: 0, y: 0 });
        return;
      }

      setActive(true);
      setOffset({
        x: (event.clientX - (rect.left + rect.width / 2)) / strength,
        y: (event.clientY - (rect.top + rect.height / 2)) / strength,
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCharacter({
  character,
  progress,
  start,
  end,
}: {
  character: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const value = character === " " ? "\u00A0" : character;

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{value}</span>
      <motion.span aria-hidden="true" className="absolute inset-0" style={{ opacity }}>
        {value}
      </motion.span>
    </span>
  );
}

function AnimatedText({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <p ref={ref} className="animated-copy" aria-label={children}>
      {children.split("").map((character, index) => {
        const start = index / children.length;
        const end = Math.min(1, start + 1 / children.length);
        return (
          <AnimatedCharacter
            key={`${character}-${index}`}
            character={character}
            progress={scrollYProgress}
            start={start}
            end={end}
          />
        );
      })}
    </p>
  );
}

function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <FadeIn y={-20} className="relative z-30">
        <nav className="hero-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#expertise">Expertise</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </FadeIn>

      <FadeIn delay={0.15} y={40} className="hero-title-wrap">
        <h1 className="hero-heading hero-title">Hi, I&apos;m Magesh</h1>
      </FadeIn>

      <FadeIn delay={0.6} y={30} className="hero-portrait-wrap">
        <Magnet>
          <div className="hero-portrait-shell">
            <div className="portrait-glow" aria-hidden="true" />
            <img
              src={portrait}
              alt="Magesh Kumar A T"
              className="hero-portrait"
              fetchPriority="high"
            />
            <div className="portrait-label">
              <span className="status-dot" />
              Open to building quality
            </div>
          </div>
        </Magnet>
      </FadeIn>

      <div className="hero-bottom">
        <FadeIn delay={0.35} y={20}>
          <p className="hero-intro">
            A quality engineer turning complex products into confident releases
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (!ref.current) return;
      const sectionTop = ref.current.offsetTop;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const firstRow = motionImages.slice(0, 11);
  const secondRow = motionImages.slice(11);
  const renderRow = (images: string[], label: string) =>
    [...images, ...images, ...images].map((src, index) => (
      <figure className="marquee-tile" key={`${label}-${index}`}>
        <img src={src} alt="" loading="lazy" decoding="async" />
        <figcaption>{String((index % images.length) + 1).padStart(2, "0")}</figcaption>
      </figure>
    ));

  return (
    <section ref={ref} className="marquee-section" aria-label="Motion showcase">
      <div
        className="marquee-track"
        style={{ transform: `translate3d(${offset - 200}px, 0, 0)` }}
      >
        {renderRow(firstRow, "top")}
      </div>
      <div
        className="marquee-track"
        style={{ transform: `translate3d(${-1 * (offset - 200)}px, 0, 0)` }}
      >
        {renderRow(secondRow, "bottom")}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-section" id="about">
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="deco deco-moon">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt=""
          loading="lazy"
        />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="deco deco-orb">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt=""
          loading="lazy"
        />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="deco deco-lego">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt=""
          loading="lazy"
        />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="deco deco-cluster">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt=""
          loading="lazy"
        />
      </FadeIn>

      <div className="about-content">
        <FadeIn y={40}>
          <p className="section-kicker">Quality, engineered</p>
          <h2 className="hero-heading section-heading">About me</h2>
        </FadeIn>

        <div className="about-copy-wrap">
          <AnimatedText>
            With six years across web UI, API, database, and release testing, I build quality systems that help teams move quickly without guessing. From Playwright and TypeScript to Selenium, Java, CI/CD, and QA leadership, I turn risk into clear, repeatable confidence.
          </AnimatedText>
        </div>

        <FadeIn delay={0.15}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

function ExpertiseSection() {
  return (
    <section className="light-section" id="expertise">
      <FadeIn>
        <p className="section-kicker text-dark">What I bring</p>
        <h2 className="light-heading">Expertise</h2>
      </FadeIn>

      <div className="expertise-list">
        {expertise.map((item, index) => (
          <FadeIn key={item.number} delay={index * 0.1}>
            <article className="expertise-item">
              <span className="expertise-number">{item.number}</span>
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>

      <div className="experience-block" id="experience">
        <FadeIn>
          <div className="experience-heading-row">
            <div>
              <p className="section-kicker text-dark">Career timeline</p>
              <h2 className="experience-heading">Experience</h2>
            </div>
            <p className="experience-aside">
              Six years of testing products where reliability directly affects customers,
              operations, and releases.
            </p>
          </div>
        </FadeIn>

        <div className="experience-grid">
          {experience.map((item, index) => (
            <FadeIn key={item.company} delay={index * 0.12}>
              <article className="experience-card">
                <div className="experience-logo">
                  <img src={item.logo} alt={`${item.company} logo`} loading="lazy" />
                </div>
                <div className="experience-meta">
                  <span>{item.period}</span>
                  <span>
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                    {item.location}
                  </span>
                </div>
                <h3>{item.company}</h3>
                <p className="experience-role">{item.role}</p>
                <p className="experience-summary">{item.summary}</p>
                <div className="tag-row">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <div className={`project-visual ${project.tone}`}>
      <div className="project-visual-left">
        <div className="visual-panel visual-flow">
          <div className="panel-topline">
            <span>Quality flow</span>
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          </div>
          <div className="flow-line">
            {["Plan", "Build", "Test", "Ship"].map((step, index) => (
              <div key={step} className="flow-step">
                <span>{index + 1}</span>
                <small>{step}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="visual-panel visual-code">
          <div className="code-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p>
            <b>test</b>(<i>&quot;critical journey&quot;</i>, async () =&gt; {"{"}
          </p>
          <p className="indent">await quality.verify();</p>
          <p>{"}"});</p>
          <div className="code-status">
            <Zap aria-hidden="true" className="h-4 w-4" />
            Fast feedback · stable signal
          </div>
        </div>
      </div>

      <div className="visual-panel visual-feature">
        <div className="feature-orbit" aria-hidden="true" />
        <div className="feature-icon">
          <Icon aria-hidden="true" />
        </div>
        <div className="feature-metric">{project.metric}</div>
        <p>{project.metricLabel}</p>
        <div className="feature-stack" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1, targetScale]);

  return (
    <div ref={ref} className="project-card-space">
      <motion.article
        className="project-card"
        style={{ scale, top: `calc(var(--project-sticky-top) + ${index * 28}px)` }}
      >
        <div className="project-card-top">
          <span className="project-number">{project.number}</span>
          <div className="project-title-block">
            <p>{project.category}</p>
            <h3>{project.name}</h3>
          </div>
          <LiveProjectButton href={project.href} label={project.cta} />
        </div>

        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <ProjectVisual project={project} />
      </motion.article>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section className="projects-section" id="projects">
      <FadeIn>
        <p className="section-kicker">Selected work</p>
        <h2 className="hero-heading section-heading">Projects</h2>
      </FadeIn>

      <div className="project-stack">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={index}
            total={projects.length}
          />
        ))}
      </div>

      <section className="education-section" aria-labelledby="education-title">
        <FadeIn>
          <div className="education-heading-row">
            <div>
              <p className="section-kicker">Foundations</p>
              <h2 id="education-title">Education</h2>
            </div>
            <GraduationCap aria-hidden="true" />
          </div>
        </FadeIn>
        <div className="education-list">
          {education.map((item, index) => (
            <FadeIn key={item.degree} delay={index * 0.08}>
              <article className="education-item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.degree}</h3>
                  <p>{item.institution}</p>
                </div>
                <div className="education-meta">
                  <span>{item.period}</span>
                  <span>{item.location}</span>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>
    </section>
  );
}

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function ContactSection() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const [firstName, ...lastNameParts] = form.name.trim().split(/\s+/);
    const payload = {
      firstName,
      lastName: lastNameParts.join(" "),
      email: form.email,
      company: "",
      subject: form.subject,
      message: form.message,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Contact endpoint unavailable");
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      const query = new URLSearchParams({
        subject: form.subject,
        body: `${form.message}\n\nFrom: ${form.name} (${form.email})`,
      });
      setStatus("fallback");
      window.location.href = `mailto:maggi121123@gmail.com?${query.toString()}`;
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-heading-row">
        <FadeIn>
          <p className="section-kicker">Start a conversation</p>
          <h2 className="hero-heading contact-heading">Let&apos;s ship quality</h2>
        </FadeIn>
        <FadeIn delay={0.15} className="contact-location">
          <MapPin aria-hidden="true" />
          Chennai, India · Working globally
        </FadeIn>
      </div>

      <div className="contact-layout">
        <FadeIn className="contact-details">
          <p>
            Need a QA engineer who can investigate deeply, automate thoughtfully,
            and keep release decisions clear? Let&apos;s talk.
          </p>
          <a href="mailto:maggi121123@gmail.com" className="contact-email">
            maggi121123@gmail.com
            <ArrowUpRight aria-hidden="true" />
          </a>
          <div className="social-links">
            <a href="https://github.com/maggimagesh" target="_blank" rel="noreferrer">
              <CodeXml aria-hidden="true" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/magesh-kumar-a-t-35782b184/"
              target="_blank"
              rel="noreferrer"
            >
              <ContactRound aria-hidden="true" /> LinkedIn
            </a>
            <a
              href="https://drive.google.com/file/d/1EG-T0Upmfp7kEgQruc4BA58zMDt6c_ID/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              <BriefcaseBusiness aria-hidden="true" /> Résumé
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>Name</span>
                <input
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your name"
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <label>
              <span>Subject</span>
              <input
                required
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                placeholder="QA role or project"
              />
            </label>
            <label>
              <span>Message</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Tell me what you are building..."
              />
            </label>
            <button className="submit-button" type="submit" disabled={status === "sending"}>
              {status === "sending" ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : (
                <Send aria-hidden="true" />
              )}
              {status === "sending" ? "Sending" : "Send message"}
            </button>
            <p className="form-status" aria-live="polite">
              {status === "sent" && "Message sent. Thank you—I'll be in touch."}
              {status === "fallback" && "Opening your email app to complete the message."}
            </p>
          </form>
        </FadeIn>
      </div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Magesh Kumar A T</span>
        <a href="#top">Back to top <ArrowUpRight aria-hidden="true" /></a>
      </footer>
    </section>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ExpertiseSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
