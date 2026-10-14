import { Download } from "lucide-react";
import Image from "next/image";
import {
  clients,
  community,
  jobs,
  links,
  navItems,
  processSteps,
  services,
  stats,
  testimonial,
} from "./content";
import { container, eyebrow, outlineButton, primaryButton, sectionTitle } from "./styles";
import { CommunityReel } from "./CommunityReel";
import { MediaCarousel } from "./MediaCarousel";
import { WorkSection } from "./WorkSection";

const waveHeights = [18, 34, 52, 40, 62, 30, 46, 58, 24, 38, 64, 50, 28, 44, 56, 36, 22, 48, 60, 32, 42, 54, 26, 40, 58, 34, 20, 30];

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export const PortfolioHome = () => (
  <div className="min-h-screen bg-pf-bg font-plex text-[17px] leading-[1.55] text-pf-text">
    <PortfolioNav />
    <main>
      <Hero />
      <ProofStrip />
      <Clients />
      <WorkSection />
      <Services />
      <Process />
      <Experience />
      <Community />
      {testimonial && <Testimonial {...testimonial} />}
      <Contact />
    </main>
    <PortfolioFooter />
  </div>
);

const PortfolioNav = () => (
  <header className="border-b border-pf-line">
    <nav className={`${container} flex flex-wrap items-center justify-between gap-4 py-5`}>
      <a href="#top" className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-pf-text no-underline hover:text-white">
        angel<span className="text-pf-accent">.</span>arrieta
      </a>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[15px]">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="text-pf-soft no-underline hover:text-white">
            {item.label}
          </a>
        ))}
        <a
          href={links.cv}
          download
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[10px] border border-pf-strong px-3.5 text-pf-soft no-underline hover:border-pf-muted hover:text-white"
        >
          <Download size={16} aria-hidden="true" />
          CV (PDF)
        </a>
        <a href="#contact" className={`${primaryButton} rounded-[10px] px-[18px] py-[11px]`}>
          Book a call
        </a>
      </div>
    </nav>
  </header>
);

const Hero = () => (
  <section id="top" className={`${container} flex flex-wrap items-center gap-14 pb-[72px] pt-[88px]`}>
    <div className="min-w-0 flex-[999_1_520px]">
      <div className="inline-flex items-center gap-2.5 rounded-full border border-pf-chip px-3.5 py-[7px] font-plex-mono text-[13px] text-pf-soft">
        <span className="inline-block h-2 w-2 rounded-full bg-pf-ok" />
        Available for AI &amp; frontend projects · Medellín → remote
      </div>
      <h1 className="mt-[26px] font-display text-[clamp(44px,6vw,78px)] font-extrabold leading-[1.02] tracking-[-2px]">
        I build AI products people <span className="text-pf-accent">actually talk to.</span>
      </h1>
      <p className="mt-6 max-w-[600px] text-xl text-pf-body">
        Real-time voice agents, agentic web apps and AI-powered storefronts, built end to end with Next.js, LiveKit,
        LangGraph and AWS. 7+ years taking products from first prototype to real users.
      </p>
      <div className="mt-9 flex flex-wrap gap-3.5">
        <a href="#contact" className={`${primaryButton} px-[26px] py-4 text-[17px]`}>
          Book a 20-min call
        </a>
        <a href="#work" className={`${outlineButton} px-[26px] py-4 text-[17px]`}>
          See the work →
        </a>
      </div>
      <div className="mt-[26px] flex flex-wrap gap-[22px] text-[15px]">
        <a href={links.cv} download className="text-pf-soft underline hover:text-white">
          Download CV (PDF)
        </a>
        <a href={links.github} {...external} className="text-pf-soft underline hover:text-white">
          GitHub
        </a>
        <a href={links.linkedin} {...external} className="text-pf-soft underline hover:text-white">
          LinkedIn
        </a>
      </div>
    </div>
    <VoiceAgentCard />
  </section>
);

const VoiceAgentCard = () => (
  <div className="min-w-0 max-w-[460px] flex-[1_1_380px] rounded-[22px] border border-pf-border bg-pf-surface p-[22px]">
    <div className="flex items-center gap-3.5">
      <Image
        src="/angel-arrieta.jpg"
        alt="Angel Arrieta"
        width={56}
        height={56}
        priority
        className="h-14 w-14 rounded-full object-cover"
      />
      <div className="flex-auto">
        <div className="font-semibold">Breathwork voice agent</div>
        <div className="font-plex-mono text-xs text-pf-muted">LiveKit · LangGraph · AWS</div>
      </div>
      <div className="inline-flex items-center gap-1.5 font-plex-mono text-xs text-pf-live">
        <span className="inline-block h-2 w-2 rounded-full bg-pf-live motion-safe:animate-pulse" />
        LIVE
      </div>
    </div>
    <div aria-hidden="true" className="mb-[18px] mt-[22px] flex h-16 items-center gap-1">
      {waveHeights.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-[3px] bg-pf-accent motion-safe:animate-pf-wave"
          style={{ height: h, opacity: 0.45 + (i % 5) * 0.12, animationDelay: `${(i % 7) * -0.23}s` }}
        />
      ))}
    </div>
    <div className="flex flex-col gap-2.5 text-[15px]">
      <div className="max-w-[80%] self-end rounded-[14px_14px_4px_14px] bg-pf-bubble px-3.5 py-2.5">
        I can&apos;t switch off tonight.
      </div>
      <div className="max-w-[85%] self-start rounded-[14px_14px_14px_4px] border border-pf-border bg-pf-bg px-3.5 py-2.5 text-pf-soft">
        Let&apos;s slow it down together. Breathe in for four… hold for seven…
      </div>
    </div>
    <div className="mt-[18px] border-t border-pf-border pt-3.5 text-[13px] text-pf-muted">
      Built for The School of Breath · 2,000+ active users in 3 months
    </div>
  </div>
);

const ProofStrip = () => (
  <section aria-label="Results" className="border-y border-pf-line bg-pf-strip">
    <div className={`${container} flex flex-wrap justify-between gap-8 py-9`}>
      {stats.map((s) => (
        <div key={s.value} className="flex-[1_1_200px]">
          <div className="font-display text-[44px] font-extrabold tracking-[-1px]">{s.value}</div>
          <div className="text-[15px] text-pf-muted">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

const Clients = () => (
  <section className={`${container} pt-10`}>
    <div className="font-plex-mono text-[13px] tracking-[1px] text-pf-faint">BUILT FOR</div>
    <div className="mt-3.5 flex flex-wrap gap-x-10 gap-y-3.5 font-display text-[22px] font-bold text-pf-faint">
      {clients.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  </section>
);

const Services = () => (
  <section id="services" className={`${container} scroll-mt-6 pt-28`}>
    <div className={eyebrow}>WHAT I DO FOR YOU</div>
    <h2 className={`${sectionTitle} mt-2.5 max-w-[760px] text-[clamp(34px,5vw,48px)]`}>
      Three ways to work together, each ending in something real users touch.
    </h2>
    <div className="mt-10 flex flex-wrap gap-6">
      {services.map((s) => (
        <div key={s.num} className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-[20px] border border-pf-border p-7">
          <div className="font-plex-mono text-[13px] text-pf-live">{s.num}</div>
          <h3 className="m-0 font-display text-[26px] font-bold leading-[1.15]">{s.title}</h3>
          <p className="m-0 text-base text-pf-body">{s.desc}</p>
          <div className="text-sm text-pf-muted">
            Ideal for: <span className="text-pf-text">{s.idealFor}</span>
          </div>
          {(s.timeline || s.price) && (
            <div className="mt-auto flex justify-between gap-3 border-t border-pf-border pt-4 text-[15px]">
              <span className="text-pf-muted">{s.timeline}</span>
              <span className="font-semibold">{s.price}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

const Process = () => (
  <section className={`${container} pt-24`}>
    <div className="flex flex-wrap gap-8 rounded-3xl border border-pf-border bg-pf-surface p-[clamp(24px,4vw,40px)]">
      <div className="flex-[1_1_260px]">
        <div className={eyebrow}>HOW IT GOES</div>
        <h2 className="mt-2.5 font-display text-4xl font-extrabold leading-[1.1] tracking-[-0.8px]">
          From idea to users, without the guesswork.
        </h2>
      </div>
      <div className="flex flex-[2_1_520px] flex-wrap gap-6">
        {processSteps.map((step) => (
          <div key={step.num} className="flex-[1_1_180px]">
            <div className="font-display text-[40px] font-extrabold text-pf-strong">{step.num}</div>
            <div className="mt-1.5 text-[19px] font-semibold">{step.title}</div>
            <p className="mt-1.5 text-[15px] text-pf-body">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Experience = () => (
  <section id="experience" className={`${container} flex scroll-mt-6 flex-wrap gap-12 pt-28`}>
    <div className="flex flex-[1_1_300px] flex-col items-start">
      <div className={eyebrow}>EXPERIENCE</div>
      <h2 className={`${sectionTitle} mt-2.5 text-[clamp(34px,4.5vw,44px)] tracking-[-1px]`}>
        Hiring? Here’s the short version.
      </h2>
      <p className="mt-4 text-pf-body">Tech Lead, consultant and hands-on engineer across AI, frontend and full-stack work.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={links.cv} {...external} className={`${outlineButton} px-[22px] py-3.5`}>
          View full CV
        </a>
        <a href={links.cv} download className={`${outlineButton} border-transparent px-[22px] py-3.5 text-pf-soft`}>
          Download PDF
        </a>
      </div>
    </div>
    <div className="min-w-0 flex-[2_1_560px]">
      {jobs.map((j) => (
        <div key={j.role + j.org} className="flex flex-wrap gap-x-6 gap-y-2 border-b border-pf-line py-5">
          <div className="flex-[0_0_150px] pt-[3px] font-plex-mono text-[13px] text-pf-muted">{j.when}</div>
          <div className="min-w-0 flex-[1_1_300px]">
            <div className="text-lg font-semibold">
              {j.role} <span className="font-normal text-pf-muted">· {j.org}</span>
            </div>
            <div className="mt-1 text-[15px] text-pf-body">{j.note}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Community = () => (
  <section id="community" className={`${container} scroll-mt-6 pt-28`}>
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[760px]">
        <div className={eyebrow}>COMMUNITY</div>
        <h2 className={`${sectionTitle} mt-2.5 text-[clamp(34px,5vw,48px)]`}>
          I lead <span className="text-pf-accent">{community.name}</span>, Medellín’s community of AI builders.
        </h2>
        <p className="mt-4 max-w-[640px] text-pf-body">
          Solo builders, creators and teams showing what they ship with AI through talk nights, dinners and
          hackathons. Running it keeps me close to what actually works in AI right now, and to the people building it.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href={community.site} {...external} className={`${primaryButton} px-[22px] py-3.5`}>
          Join the community
        </a>
        <a href={community.speakInvite} className={`${outlineButton} px-[22px] py-3.5`}>
          Invite me to speak
        </a>
      </div>
    </div>

    <div className="mt-10 flex flex-wrap gap-8 border-y border-pf-line py-7">
      {community.stats.map((s) => (
        <div key={s.label} className="flex-[1_1_200px]">
          <div className="font-display text-[40px] font-extrabold tracking-[-1px]">{s.value}</div>
          <div className="text-[15px] text-pf-muted">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="mt-8 flex flex-wrap items-stretch gap-6">
      <div className="mx-auto w-full max-w-[340px] flex-[0_1_340px] lg:mx-0">
        <CommunityReel {...community.reel} />
      </div>
      <div className="flex min-w-0 flex-[1_1_440px] flex-col">
        <MediaCarousel
          media={community.photos}
          label="Visible Builders"
          className="aspect-video overflow-hidden rounded-[22px] border border-pf-border lg:aspect-auto lg:min-h-[320px] lg:flex-1"
        />
      </div>
    </div>

    <div className="mt-6 flex flex-wrap gap-4">
      {community.events.map((e) => (
        <a
          key={e.title}
          href={e.href}
          className="group flex min-w-0 flex-[1_1_300px] items-start gap-4 rounded-[18px] border border-pf-border p-4 text-pf-text no-underline transition-colors hover:border-pf-strong hover:bg-pf-surface hover:text-pf-text"
        >
            {e.image ? (
              <Image src={e.image.src} alt={e.image.alt} width={72} height={72} className="h-[72px] w-[72px] flex-none rounded-xl object-cover" />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-[72px] w-[72px] flex-none items-center justify-center rounded-xl bg-pf-raised font-display text-2xl font-extrabold text-pf-strong"
              >
                VB
              </span>
            )}
            <span className="min-w-0 flex-auto">
              <span className="block font-plex-mono text-xs tracking-[0.5px] text-pf-muted">{e.tag}</span>
              <span className="mt-0.5 block text-lg font-semibold">{e.title}</span>
              <span className="mt-1 block text-[15px] text-pf-body">{e.desc}</span>
            </span>
            <span aria-hidden="true" className="flex-none text-pf-accent transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        ))}
    </div>
  </section>
);

const Testimonial = ({ quote, name, role }: { quote: string; name: string; role: string }) => (
  <section className={`${container} pt-28`}>
    <figure className="mx-auto max-w-[860px] text-center">
      <blockquote className="font-display text-[clamp(24px,3.5vw,34px)] font-medium leading-[1.25] tracking-[-0.5px]">
        “{quote}”
      </blockquote>
      <figcaption className="mt-[22px] text-base text-pf-muted">
        {name} · {role}
      </figcaption>
    </figure>
  </section>
);

const Contact = () => (
  <section id="contact" className={`${container} scroll-mt-6 pt-28`}>
    <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] bg-pf-accent px-[clamp(24px,4vw,48px)] py-[clamp(36px,5vw,56px)] text-pf-bg">
      <div className="min-w-0 flex-[1_1_520px]">
        <h2 className="m-0 font-display text-[clamp(36px,5vw,52px)] font-extrabold leading-[1.02] tracking-[-1.4px]">
          Got an AI product idea? Let’s put it in front of users.
        </h2>
        <p className="mt-4 text-lg text-pf-on-accent">
          Reply within 24 hours · English &amp; Spanish · Colombia time (UTC−5)
        </p>
      </div>
      <div className="flex flex-[0_1_340px] flex-col gap-3">
        <a
          href={links.booking}
          {...external}
          className="flex min-h-[44px] items-center justify-center rounded-xl bg-pf-bg px-[22px] py-4 text-[17px] font-semibold text-pf-text no-underline hover:bg-pf-surface hover:text-white"
        >
          Book a 20-min call
        </a>
        <a
          href={`mailto:${links.email}`}
          className="flex min-h-[44px] items-center justify-center break-all rounded-xl border-2 border-pf-bg px-[22px] py-3.5 text-base font-semibold text-pf-bg no-underline hover:bg-pf-bg/10 hover:text-pf-bg"
        >
          {links.email}
        </a>
        <a
          href={links.cv}
          download
          className="flex min-h-[44px] items-center justify-center gap-1.5 text-[15px] font-semibold text-pf-bg underline hover:text-pf-on-accent"
        >
          <Download size={16} aria-hidden="true" />
          Download my CV (PDF)
        </a>
      </div>
    </div>
  </section>
);

const PortfolioFooter = () => (
  <footer className={`${container} flex flex-wrap justify-between gap-4 pb-12 pt-14 text-sm text-pf-faint`}>
    <span>© {new Date().getFullYear()} Angel Arrieta · AI &amp; Full-Stack Engineer · Medellín, Colombia</span>
    <span className="flex flex-wrap gap-5">
      <a href={links.cv} download className="text-pf-faint underline hover:text-white">
        CV (PDF)
      </a>
      <a href={links.github} {...external} className="text-pf-faint underline hover:text-white">
        GitHub
      </a>
      <a href={links.linkedin} {...external} className="text-pf-faint underline hover:text-white">
        LinkedIn
      </a>
      <a href={links.youtube} {...external} className="text-pf-faint underline hover:text-white">
        YouTube
      </a>
    </span>
  </footer>
);
