import Image from "next/image";
import Link from "next/link";
import { brand, clients, community, featuredCases, links, services, stats, testimonial } from "./content";
import { container, eyebrow, outlineButton, primaryButton, sectionTitle } from "./styles";
import { CommunityReel } from "./CommunityReel";
import { MediaCarousel } from "./MediaCarousel";
import { CtaBanner, SponsorStrip, external } from "./SiteChrome";
import { CaseGrid } from "./WorkSection";

const waveHeights = [18, 34, 52, 40, 62, 30, 46, 58, 24, 38, 64, 50, 28, 44, 56, 36, 22, 48, 60, 32, 42, 54, 26, 40, 58, 34, 20, 30];

export const PortfolioHome = () => (
  <>
    <Hero />
    <ProofStrip />
    <Clients />
    <Services />
    <FeaturedWork />
    <Community />
    {testimonial && <Testimonial {...testimonial} />}
    <CtaBanner title="Got an AI product idea? Let’s put it in front of users." />
  </>
);

const Hero = () => (
  <section id="top" className={`${container} flex flex-wrap items-center gap-14 pb-[72px] pt-[88px]`}>
    <div className="min-w-0 flex-[999_1_520px]">
      <div className="inline-flex items-center gap-2.5 rounded-full border border-pf-chip px-3.5 py-[7px] font-plex-mono text-[13px] text-pf-soft">
        <span className="inline-block h-2 w-2 rounded-full bg-pf-ok" />
        Taking new clients · Medellín → LatAm &amp; US
      </div>
      <h1 className="mt-[26px] font-display text-[clamp(44px,6vw,78px)] font-extrabold leading-[1.02] tracking-[-2px]">
        I build AI products people <span className="text-pf-accent">actually talk to.</span>
      </h1>
      <p className="mt-6 max-w-[600px] text-xl text-pf-body">{brand.positioning}</p>
      <div className="mt-9 flex flex-wrap gap-3.5">
        <Link href="/contact" className={`${primaryButton} px-[26px] py-4 text-[17px]`}>
          Book a 20-min call
        </Link>
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
    <div className="mt-10">
      <SponsorStrip />
    </div>
  </section>
);

const Services = () => (
  <section id="services" className={`${container} scroll-mt-6 pt-28`}>
    <div className={eyebrow}>WHAT I DO FOR YOU</div>
    <h2 className={`${sectionTitle} mt-2.5 max-w-[760px] text-[clamp(34px,5vw,48px)]`}>
      Four ways to work together, each ending in something real people use.
    </h2>
    <div className="mt-10 flex flex-wrap gap-6">
      {services.map((s) => (
        <Link
          key={s.num}
          href={s.href}
          className="group flex min-w-0 flex-[1_1_440px] flex-col gap-3.5 rounded-[20px] border border-pf-border p-7 text-pf-text no-underline transition-colors hover:border-pf-strong hover:bg-pf-surface hover:text-pf-text"
        >
          <div className="flex justify-between font-plex-mono text-[13px] text-pf-live">
            {s.num}
            <span aria-hidden="true" className="text-pf-accent transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
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
        </Link>
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



const FeaturedWork = () => (
  <section id="work" className={`${container} scroll-mt-6 pt-28`}>
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <div className={eyebrow}>SELECTED WORK</div>
        <h2 className={`${sectionTitle} mt-2.5 text-[clamp(36px,5vw,48px)]`}>Shipped, used, measured.</h2>
      </div>
      <Link href="/work" className="inline-flex min-h-[44px] items-center font-semibold text-pf-accent no-underline hover:text-pf-text">
        See all work →
      </Link>
    </div>
    <CaseGrid studies={featuredCases} />
  </section>
);
