import { cases, whatsapp, type CaseCategory, type CaseStudy } from "./content";

export type ServicePageContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  audience: string[];
  offerTitle: string;
  offer: { title: string; desc: string }[];
  stepsEyebrow: string;
  stepsTitle: string;
  steps: { label: string; title: string; desc: string }[];
  packagesTitle: string;
  packages: { name: string; price: string; note?: string; highlight?: boolean }[];
  packagesNote?: string;
  guarantee?: { title: string; body: string };
  cases: CaseStudy[];
  cta: { title: string; label: string; href: string };
};

const casesIn = (...categories: CaseCategory[]) => cases.filter((c) => categories.includes(c.category));

export const softwarePage: ServicePageContent = {
  eyebrow: "ENTERPRISE SOFTWARE",
  title: "AI platforms and internal tools,",
  titleAccent: "connected to your own data.",
  intro:
    "Custom AI platforms, internal tools, integrations, web and mobile apps, and AI agents that work with the systems your company already runs. Built with a senior engineer from discovery to support.",
  primaryCta: {
    label: "Book a discovery call",
    href: whatsapp("Hi Angel, I'd like to book a discovery call about a software / AI project for my company."),
  },
  secondaryCta: { label: "See the work →", href: "#cases" },
  audience: ["Mid-size and enterprise companies", "LatAm and US teams", "Ops, innovation and product leaders"],
  offerTitle: "What I build",
  offer: [
    { title: "AI agents on your data", desc: "Support, internal ops and voice agents that call your APIs and follow your rules." },
    { title: "Custom AI platforms", desc: "Agentic web apps and dashboards with generative UI, built on Next.js, LangGraph and AWS." },
    { title: "Internal tools & integrations", desc: "Replace spreadsheets and manual hand-offs with tools your team actually uses." },
    { title: "Web & mobile apps", desc: "Production React, Next.js and React Native apps with analytics and solid performance." },
  ],
  stepsEyebrow: "HOW IT GOES",
  stepsTitle: "A clear path from first call to running in production.",
  steps: [
    { label: "01", title: "Discovery", desc: "Map processes, data and the use cases with the clearest ROI." },
    { label: "02", title: "Proposal", desc: "Scope, timeline and a fixed price, under NDA if you need it." },
    { label: "03", title: "Build", desc: "Weekly demos of working software, not slide updates." },
    { label: "04", title: "Launch", desc: "Deployed on your cloud, with monitoring, docs and hand-off." },
    { label: "05", title: "Support", desc: "A monthly retainer for fixes, improvements and new features." },
  ],
  packagesTitle: "Ways to start",
  packages: [
    { name: "Discovery / AI roadmap", price: "2 weeks", note: "What to automate first, and the expected return." },
    { name: "Build project", price: "From USD 15k", note: "Fixed scope, fixed price.", highlight: true },
    { name: "Monthly retainer", price: "Support + features", note: "Ongoing improvements after launch." },
  ],
  packagesNote:
    "Security first: NDAs on request, your data stays in your cloud, and access is scoped to what the project needs. Stack: Next.js, NestJS, Python, LangGraph, LiveKit, AWS, PostgreSQL.",
  cases: casesIn("Platforms", "Voice AI", "E-commerce"),
  cta: {
    title: "Not sure what to automate first? Start with a 2-week roadmap.",
    label: "Book a discovery call",
    href: whatsapp("Hi Angel, I'd like to book a discovery call about a software / AI project for my company."),
  },
};

export const voiceAiPage: ServicePageContent = {
  eyebrow: "AI VOICE AGENTS",
  title: "An AI receptionist that never",
  titleAccent: "misses a patient.",
  intro:
    "It answers calls and WhatsApp 24/7 in English and Spanish, replies in seconds and books straight into your calendar. Live in 14 days.",
  primaryCta: {
    label: "Try the demo",
    href: whatsapp("Hi Angel, I'd like to try the AI receptionist demo."),
  },
  secondaryCta: {
    label: "Book a 15-min call",
    href: whatsapp("Hi Angel, I'd like to book a 15-min call about an AI receptionist for my business."),
  },
  audience: ["Aesthetic & dental clinics", "Medical tourism", "Real estate", "Hotels & restaurants", "Event organizers"],
  offerTitle: "What your receptionist does",
  offer: [
    { title: "Answers every call and message", desc: "Phone and WhatsApp, nights and weekends included, in under 10 seconds." },
    { title: "Speaks English & Spanish", desc: "Foreign patients and local ones get the same fast, friendly answers." },
    { title: "Books appointments", desc: "Checks availability and books directly into your calendar." },
    { title: "Reports to you", desc: "Every conversation summarized, with leads and bookings tracked each month." },
  ],
  stepsEyebrow: "LIVE IN 14 DAYS",
  stepsTitle: "From first call to a receptionist answering your patients.",
  steps: [
    { label: "Day 1", title: "Kickoff", desc: "Your services, prices, FAQs, calendar and tone of voice." },
    { label: "Day 7", title: "First version", desc: "You call it, message it and try to break it." },
    { label: "Day 14", title: "Live", desc: "Connected to your number, WhatsApp and calendar." },
    { label: "Monthly", title: "Improve", desc: "Hosting, minutes, tuning and a monthly report." },
  ],
  packagesTitle: "Pricing",
  packages: [
    { name: "Setup", price: "From USD 2,500", note: "Receptionist live in 14 days.", highlight: true },
    { name: "Monthly", price: "From USD 500 / mo", note: "Hosting, minutes, improvements and reports." },
  ],
  guarantee: {
    title: "The 15-appointment guarantee",
    body: "If your AI receptionist doesn’t book at least 15 appointments in the first 30 days, you don’t pay the monthly fee until it does.",
  },
  cases: casesIn("Voice AI"),
  cta: {
    title: "Every unanswered message at 9 pm is a patient booking somewhere else.",
    label: "Book a 15-min call",
    href: whatsapp("Hi Angel, I'd like to book a 15-min call about an AI receptionist for my business."),
  },
};

export const mentorshipPage: ServicePageContent = {
  eyebrow: "AI ENGINEER MENTORSHIP",
  title: "Build & sell AI agents.",
  titleAccent: "Earn in USD.",
  intro:
    "An 8-week program for LatAm developers who want to become AI engineers, taught from voice agents and chatbots running in production, not from slides. Ends with a demo day at AI After Hours.",
  primaryCta: {
    label: "Join the next cohort",
    href: whatsapp("Hi Angel, I'd like to join the next AI Engineer cohort."),
  },
  secondaryCta: {
    label: "Workshops for companies",
    href: whatsapp("Hi Angel, I'd like an AI workshop for my company's team."),
  },
  audience: ["Developers moving into AI", "Freelancers who want USD clients", "Company teams adopting AI"],
  offerTitle: "What you walk away with",
  offer: [
    { title: "A production-grade portfolio project", desc: "A real client-style AI agent you can demo in interviews and sales calls." },
    { title: "Voice agents, RAG and tools", desc: "LLMs, function calling, RAG, LiveKit voice agents, deploys and cost control." },
    { title: "A way to sell it", desc: "Pricing, proposals, contracts and how to find international clients." },
    { title: "A community", desc: "Demo day on stage at AI After Hours, and a network of builders in Medellín." },
  ],
  stepsEyebrow: "8-WEEK CURRICULUM",
  stepsTitle: "From LLM basics to your first paying client.",
  steps: [
    { label: "Week 1", title: "LLM fundamentals", desc: "Prompts, tools and function calling." },
    { label: "Week 2", title: "RAG", desc: "Chatbots on your own data." },
    { label: "Week 3", title: "Voice agents", desc: "LiveKit, STT/TTS and latency." },
    { label: "Week 4", title: "Production", desc: "Deploy, monitoring and costs." },
    { label: "Week 5", title: "Portfolio project", desc: "A real client-style use case." },
    { label: "Week 6", title: "Pricing & proposals", desc: "Offers, proposals and contracts." },
    { label: "Week 7", title: "Getting clients", desc: "Outreach, LinkedIn and offers that sell." },
    { label: "Week 8", title: "Demo day", desc: "Present live at AI After Hours." },
  ],
  packagesTitle: "Formats",
  packages: [
    { name: "8-week group cohort", price: "From USD 500", note: "8–15 developers per cohort.", highlight: true },
    { name: "1:1 session", price: "From USD 100", note: "60 minutes on your project or career." },
    { name: "Monthly 1:1 mentorship", price: "From USD 400 / mo", note: "Weekly calls and async code review." },
    { name: "Company AI workshop", price: "Half or full day", note: "Hands-on, built around your team’s use cases." },
  ],
  packagesNote: "Free monthly live workshop: “Build your first AI voice agent”. Message me to get the next date.",
  cases: casesIn("Voice AI"),
  cta: {
    title: "Ready to build AI agents people pay for?",
    label: "Join the next cohort",
    href: whatsapp("Hi Angel, I'd like to join the next AI Engineer cohort."),
  },
};

export const eventsPage: ServicePageContent = {
  eyebrow: "EVENTS & COMMUNITY",
  title: "Tech events people remember,",
  titleAccent: "with tech in the room.",
  intro:
    "I design and host tech events end to end, from meetups and AI nights to hackathons, with interactive tech no other host brings: a voice AI host, QR check-in and challenge cards that get people talking.",
  primaryCta: {
    label: "Plan an event",
    href: whatsapp("Hi Angel, I'd like to plan a tech event with you."),
  },
  secondaryCta: {
    label: "Sponsor AI After Hours",
    href: whatsapp("Hi Angel, I'd like the AI After Hours sponsorship deck."),
  },
  audience: ["Companies", "Coworkings", "Universities", "Brands launching to builders"],
  offerTitle: "What I run",
  offer: [
    { title: "Hosted events", desc: "Meetups, AI nights and launches: speakers, run of show, venue and hosting." },
    { title: "Hackathons", desc: "1–2 day builds with prep workshops, mentors, judging and demo day." },
    { title: "Interactive tech", desc: "Noshy voice host, QR check-in and challenge cards, for your own event." },
    { title: "Sponsorships", desc: "Put your brand in front of Medellín’s AI builders at AI After Hours." },
  ],
  stepsEyebrow: "HOW IT GOES",
  stepsTitle: "You bring the goal, I bring the room.",
  steps: [
    { label: "01", title: "Goal & audience", desc: "Who should be there and what they should leave with." },
    { label: "02", title: "Program", desc: "Speakers, demos, format and the interactive pieces." },
    { label: "03", title: "Promotion", desc: "Luma page, community, social and partner channels." },
    { label: "04", title: "Show day", desc: "Hosting, check-in, AI host and photo/video." },
  ],
  packagesTitle: "Packages",
  packages: [
    { name: "Hosted event", price: "From USD 1,500", note: "Meetup, AI night or launch.", highlight: true },
    { name: "Hackathon", price: "From USD 5,000", note: "1–2 days, end to end." },
    { name: "Interactive tech only", price: "From USD 800", note: "Voice host, QR check-in, challenge cards." },
    { name: "AI After Hours sponsor", price: "From USD 500", note: "Per event." },
  ],
  cases: casesIn("Events"),
  cta: {
    title: "Want your brand in front of Medellín’s AI builders?",
    label: "Get the sponsorship deck",
    href: whatsapp("Hi Angel, I'd like the AI After Hours sponsorship deck."),
  },
};
