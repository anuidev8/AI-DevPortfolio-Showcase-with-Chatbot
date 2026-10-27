import { ShieldCheck } from "lucide-react";
import type { ServicePageContent } from "./service-pages";
import { CtaBanner, PageHeader, SitePage, external } from "./SiteChrome";
import { container, eyebrow, outlineButton, primaryButton, sectionTitle } from "./styles";
import { CaseGrid } from "./WorkSection";

const linkProps = (href: string) => (href.startsWith("http") ? external : {});

// One template for /software, /voice-ai, /mentorship and /events.
// `showcase` renders beside the offer (demo card, photos); `children` renders before the case studies.
export const ServicePage = ({
  content: c,
  showcase,
  children,
}: {
  content: ServicePageContent;
  showcase?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <SitePage>
    <PageHeader eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} intro={c.intro}>
      <div className="mt-9 flex flex-wrap gap-3.5">
        <a href={c.primaryCta.href} {...linkProps(c.primaryCta.href)} className={`${primaryButton} px-[26px] py-4 text-[17px]`}>
          {c.primaryCta.label}
        </a>
        {c.secondaryCta && (
          <a
            href={c.secondaryCta.href}
            {...linkProps(c.secondaryCta.href)}
            className={`${outlineButton} px-[26px] py-4 text-[17px]`}
          >
            {c.secondaryCta.label}
          </a>
        )}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-plex-mono text-[13px] tracking-[1px] text-pf-faint">FOR</span>
        {c.audience.map((a) => (
          <span key={a} className="rounded-full border border-pf-chip px-3 py-1.5 text-sm text-pf-soft">
            {a}
          </span>
        ))}
      </div>
    </PageHeader>

    <section className={`${container} flex flex-wrap gap-8 border-t border-pf-line pt-16`}>
      <div className="min-w-0 flex-[2_1_520px]">
        <div className={eyebrow}>{c.offerTitle.toUpperCase()}</div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {c.offer.map((o) => (
            <div key={o.title} className="rounded-[20px] border border-pf-border p-6">
              <h3 className="m-0 font-display text-[22px] font-bold leading-[1.2]">{o.title}</h3>
              <p className="mt-2 text-base text-pf-body">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {showcase && <div className="min-w-0 flex-[1_1_340px]">{showcase}</div>}
    </section>

    <section className={`${container} pt-24`}>
      <div className="rounded-3xl border border-pf-border bg-pf-surface p-[clamp(24px,4vw,40px)]">
        <div className={eyebrow}>{c.stepsEyebrow}</div>
        <h2 className="mt-2.5 max-w-[720px] font-display text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.1] tracking-[-0.8px]">
          {c.stepsTitle}
        </h2>
        <ol className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((step) => (
            <li key={step.label}>
              <div className="font-plex-mono text-[13px] text-pf-live">{step.label}</div>
              <div className="mt-1.5 text-[19px] font-semibold">{step.title}</div>
              <p className="mt-1 text-[15px] text-pf-body">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className={`${container} pt-24`}>
      <h2 className={`${sectionTitle} text-[clamp(32px,4.5vw,44px)]`}>{c.packagesTitle}</h2>
      <div className="mt-8 flex flex-wrap gap-5">
        {c.packages.map((p) => (
          <div
            key={p.name}
            className={`flex min-w-0 flex-[1_1_240px] flex-col gap-2 rounded-[20px] border p-6 ${
              p.highlight ? "border-pf-accent bg-pf-surface" : "border-pf-border"
            }`}
          >
            <div className="text-[17px] font-semibold">{p.name}</div>
            <div className="font-display text-[26px] font-extrabold tracking-[-0.5px]">{p.price}</div>
            {p.note && <p className="m-0 text-[15px] text-pf-muted">{p.note}</p>}
          </div>
        ))}
      </div>
      {c.guarantee && (
        <div className="mt-6 flex flex-wrap items-start gap-4 rounded-[20px] border border-pf-ok/40 bg-pf-ok/[0.06] p-6">
          <ShieldCheck size={28} className="flex-none text-pf-ok" aria-hidden="true" />
          <div className="min-w-0 flex-[1_1_300px]">
            <div className="text-lg font-semibold">{c.guarantee.title}</div>
            <p className="mt-1 text-pf-body">{c.guarantee.body}</p>
          </div>
        </div>
      )}
      {c.packagesNote && <p className="mt-6 max-w-[760px] text-[15px] text-pf-muted">{c.packagesNote}</p>}
    </section>

    {children}

    {c.cases.length > 0 && (
      <section id="cases" className={`${container} scroll-mt-6 pt-24`}>
        <div className={eyebrow}>PROOF</div>
        <h2 className={`${sectionTitle} mt-2.5 text-[clamp(32px,4.5vw,44px)]`}>Shipped, used, measured.</h2>
        <CaseGrid studies={c.cases} />
      </section>
    )}

    <CtaBanner title={c.cta.title} label={c.cta.label} href={c.cta.href} />
  </SitePage>
);
