import { Download } from "lucide-react";
import Image from "next/image";
import { AppLayout } from "@/layout/AppLayout";
import { brand, links, sponsors } from "./content";
import { SiteNav } from "./SiteNav";
import { container } from "./styles";

export const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// Shared shell for every brand page: nav, main and footer on the portfolio theme.
export const SitePage = ({ children }: { children: React.ReactNode }) => (
  <AppLayout bare>
    <div className="min-h-screen bg-pf-bg font-plex text-[17px] leading-[1.55] text-pf-text">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  </AppLayout>
);

export const CtaBanner = ({
  id = "contact",
  title,
  label = "Book a 20-min call",
  href = links.booking,
}: {
  id?: string;
  title: string;
  label?: string;
  href?: string;
}) => (
  <section id={id} className={`${container} scroll-mt-6 pt-28`}>
    <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] bg-pf-accent px-[clamp(24px,4vw,48px)] py-[clamp(36px,5vw,56px)] text-pf-bg">
      <div className="min-w-0 flex-[1_1_520px]">
        <h2 className="m-0 font-display text-[clamp(36px,5vw,52px)] font-extrabold leading-[1.02] tracking-[-1.4px]">{title}</h2>
        <p className="mt-4 text-lg text-pf-on-accent">
          Reply within 24 hours · English &amp; Spanish · Colombia time (UTC−5)
        </p>
      </div>
      <div className="flex flex-[0_1_340px] flex-col gap-3">
        <a
          href={href}
          {...external}
          className="flex min-h-[44px] items-center justify-center rounded-xl bg-pf-bg px-[22px] py-4 text-[17px] font-semibold text-pf-text no-underline hover:bg-pf-surface hover:text-white"
        >
          {label}
        </a>
        <a
          href={`mailto:${links.email}`}
          className="flex min-h-[44px] items-center justify-center break-all rounded-xl border-2 border-pf-bg px-[22px] py-3.5 text-base font-semibold text-pf-bg no-underline hover:bg-pf-bg/10 hover:text-pf-bg"
        >
          {links.email}
        </a>
      </div>
    </div>
  </section>
);

export const SponsorStrip = ({ label = "COMMUNITY PARTNERS & SPONSORS" }: { label?: string }) => (
  <div>
    <div className="font-plex-mono text-[13px] tracking-[1px] text-pf-faint">{label}</div>
    <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-5">
      {sponsors.map((s) => (
        <Image
          key={s.name}
          src={s.logo}
          alt={s.name}
          width={s.width}
          height={s.height}
          className="h-12 w-auto rounded-lg object-contain opacity-80 transition-opacity hover:opacity-100"
        />
      ))}
    </div>
  </div>
);

export const PageHeader = ({
  eyebrow,
  title,
  accent,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro: string;
  children?: React.ReactNode;
}) => (
  <section className={`${container} pb-16 pt-[88px]`}>
    <div className="font-plex-mono text-[13px] tracking-[1px] text-pf-accent">{eyebrow}</div>
    <h1 className="mt-4 max-w-[900px] font-display text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-2px]">
      {title} {accent && <span className="text-pf-accent">{accent}</span>}
    </h1>
    <p className="mt-6 max-w-[640px] text-xl text-pf-body">{intro}</p>
    {children}
  </section>
);

const SiteFooter = () => (
  <footer className={`${container} flex flex-wrap justify-between gap-4 pb-12 pt-14 text-sm text-pf-faint`}>
    <span>© {new Date().getFullYear()} {brand.name} · AI voice agents, software, mentorship &amp; events · Medellín, Colombia</span>
    <span className="flex flex-wrap gap-5">
      <a href={links.cv} download className="inline-flex items-center gap-1 text-pf-faint underline hover:text-white">
        <Download size={14} aria-hidden="true" />
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
      <a href="/contact" className="text-pf-faint underline hover:text-white">
        Contact
      </a>
    </span>
  </footer>
);
