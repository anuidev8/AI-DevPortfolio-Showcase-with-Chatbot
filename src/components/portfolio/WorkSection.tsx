'use client'

import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { caseCategories, cases, type CaseCategory, type CaseStudy } from "./content";
import { MediaCarousel } from "./MediaCarousel";
import { container } from "./styles";

type Filter = "All" | CaseCategory;

const filters: Filter[] = ["All", ...caseCategories];

export const WorkSection = () => {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? cases : cases.filter((c) => c.category === filter);

  return (
    <section id="work" className={`${container} scroll-mt-6`}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter case studies">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`min-h-[44px] rounded-full px-4 py-2.5 text-sm transition-colors ${
              filter === f
                ? "bg-pf-text text-pf-bg"
                : "border border-pf-chip text-pf-soft hover:border-pf-strong hover:text-pf-text"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <CaseGrid studies={visible} />
    </section>
  );
};

export const CaseGrid = ({ studies }: { studies: CaseStudy[] }) => (
  <div className="mt-10 flex flex-wrap gap-7">
    {studies.map((c) => (
      <CaseCard key={c.title} study={c} />
    ))}
  </div>
);

const CaseCard = ({ study }: { study: CaseStudy }) => {
  const external = study.link?.href.startsWith("http");

  return (
    <article className="flex min-w-0 flex-[1_1_480px] flex-col overflow-hidden rounded-[22px] border border-pf-border bg-pf-surface">
      {study.media?.length ? (
        <MediaCarousel media={study.media} label={study.title} />
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center gap-2 border-b border-pf-border bg-pf-raised p-5 text-center">
          <span className="font-display text-[clamp(26px,4vw,40px)] font-extrabold tracking-[-1px] text-pf-strong">
            {study.client.split(" · ")[0]}
          </span>
          <span className="font-plex-mono text-[13px] text-pf-faint">{study.tag}</span>
        </div>
      )}
      {study.brand && (
        <div className="flex items-center gap-3 border-b border-pf-border bg-pf-bg px-[26px] py-3.5">
          <Image src={study.brand.logo} alt="" width={44} height={44} className="h-11 w-11 flex-none rounded-full object-contain" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-semibold">
              {study.brand.name}
              <BadgeCheck size={16} className="flex-none text-pf-text" aria-label="Verified" />
            </div>
            <div className="text-[13px] text-pf-muted">
              {study.brand.handle} · {study.brand.meta}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-auto flex-col gap-3.5 p-[26px]">
        <div className="flex justify-between gap-3 font-plex-mono text-xs tracking-[0.5px] text-pf-muted">
          <span>{study.tag}</span>
          <span className="text-right">{study.client}</span>
        </div>
        <h3 className="m-0 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.5px]">{study.title}</h3>
        <p className="m-0 text-base text-pf-body">{study.built}</p>
        {study.result && (
          <div className="rounded-xl border border-pf-border bg-pf-bg px-3.5 py-3 text-[15px]">
            <span className="font-semibold text-pf-live">Result · </span>
            {study.result}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {study.stack.map((s) => (
            <span key={s} className="rounded-md border border-pf-chip px-2 py-1 font-plex-mono text-xs text-pf-soft">
              {s}
            </span>
          ))}
        </div>
        {study.link && (
          <a
            href={study.link.href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-auto inline-flex min-h-[44px] items-center font-semibold text-pf-accent no-underline hover:text-pf-text"
          >
            {study.link.label}
          </a>
        )}
      </div>
    </article>
  );
};
