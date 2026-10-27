import type { Metadata } from "next";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import Image from "next/image";
import { community } from "@/components/portfolio/content";
import { CommunityReel } from "@/components/portfolio/CommunityReel";
import { MediaCarousel } from "@/components/portfolio/MediaCarousel";
import { ServicePage } from "@/components/portfolio/ServicePage";
import { eventsPage } from "@/components/portfolio/service-pages";
import { SponsorStrip, external } from "@/components/portfolio/SiteChrome";
import { container, eyebrow, outlineButton, primaryButton, sectionTitle } from "@/components/portfolio/styles";

export const metadata: Metadata = pageMetadata({
  title: "Community Host, Connector & Tech Events in Medellín",
  description:
    "Angel Mateus connects people: tech events, AI nights, hackathons and strategic introductions in Medellín, hosted by an engineer, MC and community builder. Sponsor AI After Hours.",
  path: "/events",
});

const jsonLd = serviceJsonLd({
  name: "Community hosting, introductions and tech events",
  description: metadata.description!,
  path: "/events",
  serviceType: "Event planning and hosting",
});

const strengths = [
  {
    tag: "CONNECTOR",
    title: "The right people",
    desc: "Founders, engineers, creators, companies and speakers across Medellín’s tech scene. I make intros that lead to clients, partners and hires.",
  },
  {
    tag: "HOST",
    title: "A room that talks",
    desc: "On stage and off, in English and Spanish: I warm people up, keep the energy high and make sure nobody leaves without meeting someone new.",
  },
  {
    tag: "ENGINEER",
    title: "Tech no other host has",
    desc: "I build AI voice agents for a living, so your event gets a voice AI host, QR check-in and matchmaking built in.",
  },
  {
    tag: "RESULTS",
    title: "Proof, not just photos",
    desc: "Check-in and matchmaking show who came and who met whom, so sponsors see qualified conversations, not impressions.",
  },
];

export default function EventsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ServicePage
        content={eventsPage}
        showcase={
          <div className="mx-auto max-w-[340px]">
            <CommunityReel {...community.reel} />
          </div>
        }
      >
        <section className={`${container} pt-24`}>
          <div className={eyebrow}>WHY ME</div>
          <h2 className={`${sectionTitle} mt-2.5 max-w-[860px] text-[clamp(32px,4.5vw,44px)]`}>
            Most hosts can run a room. I also <span className="text-pf-accent">know who should meet whom</span>, and
            build the tech to make it happen.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map((st) => (
              <div key={st.title} className="rounded-[20px] border border-pf-border bg-pf-surface p-6">
                <div className="font-plex-mono text-[13px] text-pf-live">{st.tag}</div>
                <div className="mt-1.5 font-display text-[22px] font-bold">{st.title}</div>
                <p className="mt-1.5 text-[15px] text-pf-body">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${container} pt-24`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[760px]">
              <div className={eyebrow}>THE COMMUNITY</div>
              <h2 className={`${sectionTitle} mt-2.5 text-[clamp(32px,4.5vw,44px)]`}>
                <span className="text-pf-accent">{community.name}</span> and AI After Hours, Medellín’s AI builders.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/post/ai-after-hours" className={`${primaryButton} px-[22px] py-3.5`}>
                Next AI After Hours
              </a>
              <a href="/noshy-voice" className={`${outlineButton} px-[22px] py-3.5`}>
                Try the Noshy voice host
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

          <MediaCarousel
            media={community.photos}
            label="Visible Builders"
            className="mt-8 aspect-video overflow-hidden rounded-[22px] border border-pf-border"
          />

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
              </a>
            ))}
          </div>

          <div className="mt-14">
            <SponsorStrip />
          </div>
          <p className="mt-6 text-[15px] text-pf-muted">
            Join the community at{" "}
            <a href={community.site} {...external} className="text-pf-soft underline hover:text-white">
              visiblebuilders.io
            </a>
            .
          </p>
        </section>
      </ServicePage>
    </>
  );
}
