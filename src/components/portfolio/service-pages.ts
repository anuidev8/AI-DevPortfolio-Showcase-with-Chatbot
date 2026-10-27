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
  title: "Build AI agents, lead with confidence,",
  titleAccent: "and grow the right network.",
  intro:
    "An 8-week program for LatAm developers who want to become AI engineers people want to work with. Real technical skills from agents running in production, plus the leadership, mindset and connections that turn skills into opportunities. Ends on stage at AI After Hours.",
  primaryCta: {
    label: "Join the next cohort",
    href: whatsapp("Hi Angel, I'd like to join the next AI Engineer cohort."),
  },
  secondaryCta: {
    label: "Workshops for companies",
    href: whatsapp("Hi Angel, I'd like an AI workshop for my company's team."),
  },
  audience: [
    "Developers moving into AI",
    "Freelancers who want USD clients",
    "Engineers stepping into tech lead roles",
    "Company teams adopting AI",
  ],
  offerTitle: "Skills, mindset and people",
  offer: [
    { title: "AI engineering skills", desc: "LLMs, function calling, RAG, LiveKit voice agents, deploys and cost control." },
    { title: "A production-grade portfolio project", desc: "A real client-style AI agent you can demo in interviews and sales calls." },
    {
      title: "Leadership",
      desc: "Lead a project end to end: talk to clients, scope work, give feedback, run a team and own the result.",
    },
    {
      title: "Builder mindset",
      desc: "Ship before you feel ready, build in public, handle rejection and keep momentum when it gets hard.",
    },
    {
      title: "Networking that works",
      desc: "How to show up at events, start conversations, follow up and turn contacts into collaborators.",
    },
    {
      title: "Warm introductions",
      desc: "Intros to founders, companies, speakers and builders from the AI After Hours and Visible Builders network.",
    },
  ],
  stepsEyebrow: "8-WEEK PROGRAM",
  stepsTitle: "Every week: one technical skill, one growth skill.",
  steps: [
    { label: "Week 1", title: "Fundamentals & mindset", desc: "LLMs, prompts and tools. Your goals and a builder mindset." },
    { label: "Week 2", title: "RAG & building in public", desc: "Chatbots on your own data. Share your progress publicly." },
    { label: "Week 3", title: "Voice agents & communication", desc: "LiveKit, STT/TTS and latency. Explain tech to non-tech people." },
    { label: "Week 4", title: "Production & ownership", desc: "Deploy, monitoring and costs. Own outcomes, not tasks." },
    { label: "Week 5", title: "Portfolio project & leadership", desc: "A client-style build. Lead the scope, decisions and feedback." },
    { label: "Week 6", title: "Pricing & negotiation", desc: "Offers, proposals and contracts. Ask for what you’re worth." },
    { label: "Week 7", title: "Networking & personal brand", desc: "LinkedIn, events and warm outreach. Intros to people in the network." },
    { label: "Week 8", title: "Demo day & connections", desc: "Present live at AI After Hours and meet founders and companies." },
  ],
  packagesTitle: "Formats",
  packages: [
    { name: "8-week group cohort", price: "From USD 500", note: "8–15 developers per cohort.", highlight: true },
    { name: "1:1 session", price: "From USD 100", note: "60 minutes on your project, career or leadership." },
    {
      name: "Monthly 1:1 mentorship",
      price: "From USD 400 / mo",
      note: "Weekly calls, code review, career coaching and intros.",
    },
    { name: "Company AI workshop", price: "Half or full day", note: "Hands-on, built around your team’s use cases." },
  ],
  packagesNote:
    "Free monthly live workshop: “Build your first AI voice agent”, followed by networking with the community. Message me to get the next date.",
  cases: casesIn("Voice AI"),
  cta: {
    title: "Ready to grow as an engineer, a leader and a connector?",
    label: "Join the next cohort",
    href: whatsapp("Hi Angel, I'd like to join the next AI Engineer cohort."),
  },
};

export const eventsPage: ServicePageContent = {
  eyebrow: "COMMUNITY HOST & CONNECTOR",
  title: "I put the right people in the same room,",
  titleAccent: "and make sure they meet.",
  intro:
    "Connecting people is my gift. I host Medellín’s AI builder community, and I design events where founders, engineers, creators and companies leave with real conversations, partners and opportunities, not just a selfie. As an engineer I also build the tech that makes it happen: a voice AI host, QR check-in and matchmaking that gets strangers talking.",
  primaryCta: {
    label: "Plan an event with me",
    href: whatsapp("Hi Angel, I'd like to plan an event or community experience with you."),
  },
  secondaryCta: {
    label: "Sponsor AI After Hours",
    href: whatsapp("Hi Angel, I'd like the AI After Hours sponsorship deck."),
  },
  audience: ["Companies & brands", "Startups launching to builders", "Coworkings & hubs", "Universities", "Founders who need the right intros"],
  offerTitle: "How I can help you",
  offer: [
    {
      title: "Events that create connections",
      desc: "Meetups, AI nights, dinners and launches: speakers, run of show, venue and hosting, designed so people actually meet.",
    },
    {
      title: "Host & MC",
      desc: "I hold the stage in English and Spanish, warm up the room, introduce speakers and keep the energy up all night.",
    },
    {
      title: "Strategic introductions",
      desc: "Tell me who you need (clients, partners, talent, speakers, investors). I make curated, double opt-in intros: fewer, better, and both sides want the call.",
    },
    {
      title: "Community building for brands",
      desc: "Launch and grow your own community: format, calendar, content, partners and a host who shows up every month.",
    },
    {
      title: "Hackathons",
      desc: "1–2 day builds with prep workshops, mentors, judging and demo day, connecting your brand with real builders.",
    },
    {
      title: "Networking tech",
      desc: "Noshy voice host, QR check-in, matchmaking and challenge cards: icebreakers that turn a crowd into conversations.",
    },
  ],
  stepsEyebrow: "HOW IT GOES",
  stepsTitle: "You bring the goal, I bring the room and the right people.",
  steps: [
    { label: "01", title: "Goal & audience", desc: "Who should be there, who should meet whom, and what they leave with." },
    { label: "02", title: "Program", desc: "Speakers, demos, format and the networking moments." },
    { label: "03", title: "Invite the right people", desc: "My community, partners, Luma, social and personal invites." },
    { label: "04", title: "Show day & follow-up", desc: "Hosting, check-in, AI host, intros on the night and after." },
  ],
  packagesTitle: "Packages",
  packages: [
    { name: "Hosted event", price: "From USD 1,500", note: "Meetup, AI night, dinner or launch.", highlight: true },
    { name: "Hackathon", price: "From USD 5,000", note: "1–2 days, end to end." },
    { name: "Host / MC only", price: "Per event", note: "For your own event, in English or Spanish." },
    { name: "Networking tech only", price: "From USD 800", note: "Voice host, QR check-in, matchmaking, challenge cards." },
    { name: "Community building", price: "Monthly", note: "Your own community, run and hosted with you." },
    {
      name: "AI After Hours sponsor",
      price: "From USD 500",
      note: "Stage time, curated intros to attendees you want to meet, and a results report within 48 hours.",
    },
  ],
  packagesNote:
    "Sponsors don’t just get a logo: check-in and matchmaking data show who came, who you met and who wants a follow-up. Need one specific introduction rather than an event? Message me who you’re looking for.",
  cases: casesIn("Events"),
  cta: {
    title: "Who do you need to meet? I probably know them, or someone who does.",
    label: "Tell me who you’re looking for",
    href: whatsapp("Hi Angel, I'm looking to connect with: "),
  },
};
