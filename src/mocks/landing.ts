import { 
  LandingPlan, 
  UseCase, 
  ProcessStep, 
  LandingTestimonial, 
  FAQ 
} from '../types/project.types';

export const aboutContent = {
  bio: "I'm Angel Arrieta, a frontend developer and AI solutions architect. I specialize in bridging the gap between state-of-the-art AI capabilities and real-world business needs. By leveraging powerful tools like Claude, Perplexity, and Gemini, I help you build custom software and automate workflows without the overhead of a traditional dev team.",
  bullets: [
    "7+ years of experience in product development and frontend engineering.",
    "Expertise in modern AI integrations (OpenAI, Anthropic, ElevenLabs, etc.).",
    "Focus on practical, ROI-driven solutions over hype."
  ]
};

export const whoIsItFor = [
  "Non-technical founders looking to build an MVP quickly.",
  "Consultants & agencies wanting to automate repetitive analytical tasks.",
  "Small business owners looking to integrate AI into their customer service.",
  "Operators who want to scale their output without scaling their headcount."
];

export const plans: LandingPlan[] = [
  {
    id: "plan-1",
    label: "Sprint",
    name: "AI Product Sprint for Wellness Founders",
    shortDescription: "Build your AI MVP in weeks.",
    bullets: [
      "Ship a wellness AI web app (frontend + backend)",
      "Integrate OpenAI, Claude, and other models",
      "Modern UI/UX with smooth micro-interactions",
      "Deploy, test, and hand over your MVP"
    ],
    investment: "From $3,500",
    primaryCTA: "Book a free strategy session",
    secondaryCTA: "Learn more"
  },
  {
    id: "plan-2",
    label: "Automation",
    name: "AI Process Automation for Coaches & Studios",
    shortDescription: "Reclaim hours of your week by automating manual workflows.",
    bullets: [
      "Audit your highest-impact workflows",
      "Build automations with n8n / Make / Zapier",
      "Extract and structure client data with AI",
      "Add logging, monitoring, and error handling"
    ],
    investment: "From $1,500",
    primaryCTA: "Book a free workflow audit",
    secondaryCTA: "Learn more"
  },
  {
    id: "plan-3",
    label: "Mentoring",
    name: "1:1 AI Mentoring for Wellness Entrepreneurs",
    shortDescription: "Build and integrate AI tools without getting stuck.",
    subtitle: "For yoga teachers, breathwork guides, and wellness coaches.",
    bullets: [
      "Weekly 1-hour pair programming",
      "Code reviews and architecture guidance",
      "Prompt and AI workflow best practices",
      "Direct async support between calls",
      "Optional: content, email, and onboarding automations"
    ],
    investment: "$30 / hour",
    investmentDetail: "$800 / month \u00b7 4 sessions included",
    primaryCTA: "Book a free 30-minute session",
    secondaryCTA: "Learn more"
  },
  {
    id: "plan-4",
    label: "Audit",
    name: "AI Audit & Roadmap for Wellness Brands",
    shortDescription: "Get a clear AI roadmap for your wellness business.",
    bullets: [
      "Review your tools, data, and client journeys",
      "Identify high-impact AI opportunities",
      "Get cost vs. impact estimates",
      "Receive a 30-60-90 day execution plan"
    ],
    investment: "$500 one\u2011time",
    primaryCTA: "Book a free roadmap call",
    secondaryCTA: "Learn more"
  }
];

export const useCases: UseCase[] = [
  {
    id: "uc-1",
    icon: "Calculator",
    title: "AI Calculators",
    benefit: "Capture leads by instantly answering complex pricing questions."
  },
  {
    id: "uc-2",
    icon: "FileText",
    title: "Automated Reports",
    benefit: "Turn messy raw data into structured insights in seconds."
  },
  {
    id: "uc-3",
    icon: "MessageSquare",
    title: "AI Sales Assistant",
    benefit: "Train a chatbot on your own data to pre-qualify inbound leads."
  },
  {
    id: "uc-4",
    icon: "Mic",
    title: "Voice Interfaces",
    benefit: "Allow users to interact with your platform hands-free via real-time audio."
  },
  {
    id: "uc-5",
    icon: "Database",
    title: "Knowledge Base Agents",
    benefit: "Instantly retrieve exact answers from your company's internal documents."
  }
];

export const processSteps: ProcessStep[] = [
  {
    index: 1,
    title: "Discover & define",
    description: "We start with a deep dive into your business context, pinpointing exactly where AI can add the most value and defining the scope of the project.",
    icon: "Search"
  },
  {
    index: 2,
    title: "Design the solution",
    description: "I map out the architecture, user experience, and the specific APIs (OpenAI, Claude, custom models) required to bring the idea to life.",
    icon: "PenTool"
  },
  {
    index: 3,
    title: "Build live with AI",
    description: "Using cutting-edge development workflows, I rapidly prototype and build the tool, keeping you in the loop with live demos and iterations.",
    icon: "Code"
  },
  {
    index: 4,
    title: "Deploy & support",
    description: "Once tested, the solution is launched to production. I provide documentation and optional ongoing support to ensure everything runs smoothly.",
    icon: "Rocket"
  }
];

export const testimonials: LandingTestimonial[] = [
  {
    id: "test-1",
    quote: "Angel helped me automate my entire soil analysis reporting pipeline using AI. I used to spend hours manually copying data and formatting PDFs. Now it's done instantly.",
    role: "Agronomy Consultant - Latin America",
    outcomeTag: "Time saved: ~5h/week"
  },
  {
    id: "test-2",
    quote: "Coming soon. This could be your success story.",
    role: "Business Owner",
    outcomeTag: "Future Outcome"
  },
  {
    id: "test-3",
    quote: "Coming soon. This could be your success story.",
    role: "Startup Founder",
    outcomeTag: "Future Outcome"
  }
];

export const faqs: FAQ[] = [
  {
    question: "Do I need technical knowledge to work with you?",
    answer: "Not at all. My goal is to abstract the technical complexity away. You just need to deeply understand your own business problems and processes, and I will handle the AI and software implementation."
  },
  {
    question: "How long does a typical AI Product Sprint take?",
    answer: "It depends on the complexity of the tool, but most custom internal tools or MVP customer-facing apps take between 2 to 4 weeks from kickoff to deployment."
  },
  {
    question: "Can we use our own company data securely?",
    answer: "Yes. I use enterprise-grade APIs (like OpenAI's API, which explicitly does not train on your data) and strict cloud security practices to ensure your proprietary information remains private and secure."
  }
];

export const proofStats = [
  { id: 'years', value: 7, suffix: '+', label: 'Years building with AI' },
  { id: 'clients', value: 12, suffix: '+', label: 'Industries served' },
  { id: 'hours', value: 200, suffix: '+', label: 'Hours saved for clients', badge: 'and counting' }
];
