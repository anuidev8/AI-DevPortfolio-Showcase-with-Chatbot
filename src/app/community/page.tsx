'use client';

import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import Link from 'next/link';
import { community } from '@/components/portfolio/content';
import { CommunityReel } from '@/components/portfolio/CommunityReel';
import { MediaCarousel } from '@/components/portfolio/MediaCarousel';
import { CtaBanner, SitePage, external } from '@/components/portfolio/SiteChrome';
import { container, eyebrow, outlineButton, primaryButton, sectionTitle } from '@/components/portfolio/styles';

const AI_HUB_URL = 'https://theaihub.vip/';
const AI_WEEK_URL = 'https://inmerxia.co/';
const VB_URL = community.site;

function BigQr({
  value,
  label,
  sub,
  size = 260,
}: {
  value: string;
  label: string;
  sub?: string;
  size?: number;
}) {
  return (
    <a
      href={value}
      {...external}
      className="group inline-flex flex-col items-center gap-4 text-center no-underline"
    >
      <div className="rounded-[28px] bg-white p-5 transition-transform group-hover:scale-[1.02]">
        <QRCodeSVG value={value} size={size} fgColor="#05070d" bgColor="#ffffff" level="M" />
      </div>
      <div>
        <p className="font-display text-lg font-bold text-pf-text group-hover:text-white">{label}</p>
        {sub ? <p className="mt-1 font-plex-mono text-[13px] text-pf-muted">{sub}</p> : null}
      </div>
    </a>
  );
}

export default function CommunityPage() {
  return (
    <SitePage>
      <section className={`${container} pb-10 pt-[88px]`}>
        <div className={eyebrow}>COMMUNITIES · MEDELLÍN</div>
        <h1 className="mt-4 max-w-[920px] font-display text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-2px]">
          Two rooms where builders <span className="text-pf-accent">show up and ship.</span>
        </h1>
        <p className="mt-6 max-w-[640px] text-xl text-pf-body">
          I run Visible Builders and help organize The AI Hub — talk nights, live system openings, dinners and
          hackathons in Medellín.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#visible-builders" className={`${primaryButton} px-[22px] py-3.5`}>
            Visible Builders
          </a>
          <a href="#ai-hub" className={`${outlineButton} px-[22px] py-3.5`}>
            The AI Hub
          </a>
          <a href="#ai-week" className={`${outlineButton} px-[22px] py-3.5`}>
            AI Week
          </a>
        </div>
      </section>

      {/* Visible Builders */}
      <section id="visible-builders" className={`${container} scroll-mt-8 border-t border-pf-line pt-20`}>
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className={eyebrow}>01 · VISIBLE BUILDERS</div>
            <h2 className={`${sectionTitle} mt-2.5 max-w-[720px] text-[clamp(32px,4.5vw,48px)]`}>
              Medellín’s community of <span className="text-pf-accent">AI builders.</span>
            </h2>
            <p className="mt-5 max-w-[560px] text-lg text-pf-body">
              Solo builders, creators and teams showing what they ship with AI through talk nights, dinners and
              hackathons. Real demos, not panels — and the people building what actually works.
            </p>

            <div className="mt-8 flex flex-wrap gap-8 border-y border-pf-line py-7">
              {community.stats.map((s) => (
                <div key={s.label} className="flex-[1_1_160px]">
                  <div className="font-display text-[40px] font-extrabold tracking-[-1px]">{s.value}</div>
                  <div className="text-[15px] text-pf-muted">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={VB_URL} {...external} className={`${primaryButton} px-[22px] py-3.5`}>
                visiblebuilders.io
              </a>
              <Link href="/post/ai-after-hours" className={`${outlineButton} px-[22px] py-3.5`}>
                AI After Hours
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {community.events.map((e) => (
                <Link
                  key={e.title}
                  href={e.href}
                  className="group flex min-w-0 flex-[1_1_260px] items-start gap-4 rounded-[18px] border border-pf-border p-4 text-pf-text no-underline transition-colors hover:border-pf-strong hover:bg-pf-surface"
                >
                  {e.image ? (
                    <Image
                      src={e.image.src}
                      alt={e.image.alt}
                      width={64}
                      height={64}
                      className="h-16 w-16 flex-none rounded-xl object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-pf-raised font-display text-xl font-extrabold text-pf-strong"
                    >
                      VB
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block font-plex-mono text-xs tracking-[0.5px] text-pf-muted">{e.tag}</span>
                    <span className="mt-0.5 block text-lg font-semibold">{e.title}</span>
                    <span className="mt-1 block text-[14px] text-pf-body">{e.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="mx-auto w-full max-w-[320px]">
              <CommunityReel {...community.reel} />
            </div>
            <BigQr value={VB_URL} label="Join Visible Builders" sub="visiblebuilders.io" size={180} />
          </div>
        </div>

        <MediaCarousel
          media={community.photos}
          label="Visible Builders"
          className="mt-12 aspect-video overflow-hidden rounded-[22px] border border-pf-border"
        />
      </section>

      {/* The AI Hub */}
      <section id="ai-hub" className={`${container} scroll-mt-8 border-t border-pf-line pt-20`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <div className={eyebrow}>02 · THE AI HUB</div>
            <h2 className={`${sectionTitle} mt-2.5 max-w-[720px] text-[clamp(32px,4.5vw,48px)]`}>
              Watch real AI systems <span className="text-pf-accent">opened live.</span>
            </h2>
            <p className="mt-5 max-w-[560px] text-lg text-pf-body">
              Ringside seats in Medellín or livestream from anywhere. Weekly builder sessions, monthly live openings,
              and a build package — recordings, transcripts and Markdown your team can study and adapt.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { n: '01', t: 'Weekly Builder Sessions', d: 'Small intimate syncs. Live code, real failures, working systems.' },
                { n: '02', t: 'Monthly Sessions', d: 'Working AI systems opened live. Room seats + livestream.' },
                { n: '03', t: 'The Build Package', d: 'Recordings, transcripts and organized Markdown to reuse.' },
              ].map((item) => (
                <li key={item.n} className="rounded-[18px] border border-pf-border bg-pf-surface p-5">
                  <div className="font-plex-mono text-[13px] text-pf-accent">{item.n}</div>
                  <div className="mt-1.5 font-display text-[20px] font-bold leading-snug">{item.t}</div>
                  <p className="mt-2 text-[14px] text-pf-body">{item.d}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a href={AI_HUB_URL} {...external} className={`${primaryButton} px-[22px] py-3.5`}>
                theaihub.vip
              </a>
            </div>
          </div>
          <BigQr value={AI_HUB_URL} label="The AI Hub" sub="theaihub.vip" size={200} />
        </div>
      </section>

      {/* AI Week */}
      <section id="ai-week" className={`${container} scroll-mt-8 border-t border-pf-line py-20`}>
        <div className="relative overflow-hidden rounded-[32px] border border-pf-border bg-pf-surface px-[clamp(24px,5vw,56px)] py-[clamp(40px,6vw,72px)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 70% 80% at 85% 20%, rgb(47 107 255 / 0.28), transparent 55%), radial-gradient(ellipse 50% 60% at 10% 90%, rgb(69 212 245 / 0.12), transparent 50%)',
            }}
          />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_auto]">
            <div>
              <div className={eyebrow}>03 · AI WEEK · MEDELLÍN</div>
              <h2 className={`${sectionTitle} mt-2.5 max-w-[640px] text-[clamp(32px,5vw,52px)]`}>
                INMERXIA 2026 — <span className="text-pf-accent">Colombia’s AI Week.</span>
              </h2>
              <p className="mt-5 max-w-[520px] text-lg text-pf-body">
                Nov 9–13 in Medellín. Five days of talks, workshops, expo and the Colombian AI Forum. Visible Builders
                and The AI Hub will be in the room — scan to get the agenda and show up.
              </p>
              <p className="mt-4 font-plex-mono text-[13px] tracking-[0.5px] text-pf-muted">
                9–13 NOV 2026 · PLANETARIO · C4TA · FÓRUM UPB
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={AI_WEEK_URL} {...external} className={`${primaryButton} px-[22px] py-3.5`}>
                  Open INMERXIA
                </a>
                <a href={AI_HUB_URL} {...external} className={`${outlineButton} px-[22px] py-3.5`}>
                  AI Hub sessions
                </a>
              </div>
            </div>
            <BigQr value={AI_WEEK_URL} label="Scan for AI Week" sub="inmerxia.co" size={280} />
          </div>
        </div>
      </section>

      <CtaBanner title="Want to speak, sponsor or bring your team?" />
    </SitePage>
  );
}
