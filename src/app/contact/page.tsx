import type { Metadata } from "next";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { links, whatsapp } from "@/components/portfolio/content";
import { PageHeader, SitePage, external } from "@/components/portfolio/SiteChrome";
import { container } from "@/components/portfolio/styles";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Book a Call",
  description:
    "Book a call with Angel Mateus about AI software, voice agents, mentorship or events. Reply within 24 hours, in English or Spanish.",
  path: "/contact",
});

const jsonLd = { "@context": "https://schema.org", ...breadcrumbJsonLd([{ name: "Contact & Book a Call", path: "/contact" }]) };

const channels = [
  {
    icon: Phone,
    title: "15-min intro call",
    desc: "Quick fit check: what you need and whether I’m the right person.",
    href: whatsapp("Hi Angel, I'd like to book a 15-min intro call."),
  },
  {
    icon: Phone,
    title: "45-min discovery call",
    desc: "For software and AI projects: processes, data and a first plan.",
    href: whatsapp("Hi Angel, I'd like to book a 45-min discovery call."),
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    desc: "Fastest way to reach me.",
    href: links.booking,
  },
  {
    icon: Mail,
    title: "Email",
    desc: links.email,
    href: `mailto:${links.email}`,
  },
];

export default function ContactPage() {
  return (
    <SitePage>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow="CONTACT"
        title="Let’s build"
        accent="something real."
        intro="Reply within 24 hours · English & Spanish · Colombia time (UTC−5)."
      />
      <section className={`${container} flex flex-wrap gap-8 pb-8`}>
        <div className="min-w-0 flex-[2_1_480px]">
          <ContactForm />
        </div>
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          {channels.map((c) => (
            <a
              key={c.title}
              href={c.href}
              {...(c.href.startsWith("http") ? external : {})}
              className="flex items-start gap-4 rounded-[18px] border border-pf-border p-5 text-pf-text no-underline transition-colors hover:border-pf-strong hover:bg-pf-surface hover:text-pf-text"
            >
              <c.icon size={22} className="mt-0.5 flex-none text-pf-accent" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-lg font-semibold">{c.title}</span>
                <span className="mt-0.5 block break-words text-[15px] text-pf-body">{c.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
