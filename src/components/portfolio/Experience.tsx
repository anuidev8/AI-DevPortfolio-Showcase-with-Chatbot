import { jobs, links } from "./content";
import { external } from "./SiteChrome";
import { container, eyebrow, outlineButton, sectionTitle } from "./styles";

export const Experience = () => (
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

