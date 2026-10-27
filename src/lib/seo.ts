import type { Metadata } from "next";

export const siteUrl = "https://www.angelmateus.com";
export const siteName = "Angel Mateus";
export const siteDescription =
  "Angel Mateus builds AI voice agents and enterprise software, mentors developers into AI engineers, and hosts Medellín’s AI builder community.";

export const sameAs = [
  "https://github.com/anuidev8",
  "https://linkedin.com/in/angel-mateus-arrieta-morelo-739623123",
  "https://youtube.com/@anuidev",
  "https://visiblebuilders.io",
];

// A page that sets `openGraph` drops the inherited file-based image, so pages pass it explicitly.
const defaultImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Angel Mateus — AI voice agents, software, mentorship and events",
};

// Per-page metadata with a canonical URL and matching Open Graph / Twitter tags.
// `title` is the page part only; the root layout appends " · Angel Mateus".
export const pageMetadata = ({
  title,
  description,
  path,
  keywords,
  type = "website",
  locale = "en_US",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  locale?: "en_US" | "es_CO";
}): Metadata => ({
  title,
  description,
  keywords,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, siteName, type, locale, images: [defaultImage] },
  twitter: { card: "summary_large_image", title, description, images: [defaultImage] },
});

export const personJsonLd = {
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Angel Mateus",
  alternateName: ["Angel Mateus Arrieta Morelo", "Angel Arrieta"],
  url: siteUrl,
  image: `${siteUrl}/angel-arrieta.jpg`,
  jobTitle: "AI & Full-Stack Engineer",
  description: siteDescription,
  email: "mailto:angelarrieta34@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Medellín", addressCountry: "CO" },
  knowsAbout: ["AI voice agents", "LiveKit", "LangGraph", "Next.js", "Generative UI", "AI engineering", "Tech events"],
  knowsLanguage: ["en", "es"],
  sameAs,
};

export const serviceJsonLd = ({
  name,
  description,
  path,
  serviceType,
  areaServed = ["Colombia", "Latin America", "United States"],
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  areaServed?: string[];
}) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name,
      description,
      serviceType,
      url: `${siteUrl}${path}`,
      provider: { "@id": `${siteUrl}/#person` },
      areaServed: areaServed.map((a) => ({ "@type": "Place", name: a })),
      availableLanguage: ["English", "Spanish"],
    },
    breadcrumbJsonLd([{ name, path }]),
  ],
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${siteUrl}${item.path === "/" ? "" : item.path}`,
  })),
});
