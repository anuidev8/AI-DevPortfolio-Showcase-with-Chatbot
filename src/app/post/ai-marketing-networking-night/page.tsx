'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Handshake,
  MapPin,
  Megaphone,
  Mic2,
  Network,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_SLIDES = 7;

const sponsors = ['Kingdom Creators', 'The Credle Group', 'GOAT', 'The School of Breath'];

const speakers = [
  {
    name: 'David Elias (Elias) Palacio',
    initials: 'DE',
    topic: 'Building AI Products & Agentic Workflows',
    color: 'cyan',
    image: '/speakers/david-elias-palacio.jpg',
  },
  {
    name: 'Derex Hammer',
    initials: 'DH',
    topic: 'The Mindset Behind Exceptional Marketing',
    color: 'orange',
    image: '/speakers/derex-hammer.jpg',
  },
  {
    name: 'Carlos',
    initials: 'C',
    topic: 'AI, Websites, CRM & Automation for Lead Generation',
    color: 'magenta',
    image: '/speakers/carlos.jpg',
  },
];

const events = [
  'Practical AI workshops',
  'Marketing growth sessions',
  'Founder + creator mixers',
  'Automation and CRM clinics',
];

const demoFilters = ['Events', 'Workshops', 'Sessions', 'Creative', 'Networking'];

const demoCategories = [
  {
    title: 'AI & Business',
    spanish: 'IA y Negocios',
    description: 'Tools, automation, lead generation, and growth.',
    icon: Zap,
    accent: '#00e5ff',
  },
  {
    title: 'Marketing & Content',
    spanish: 'Marketing y Contenido',
    description: 'Branding, storytelling, social media, and creative strategy.',
    icon: Megaphone,
    accent: '#ff7400',
  },
  {
    title: 'Startups & Freelancing',
    spanish: 'Startups y Freelance',
    description: 'Founders, independent creators, offers, and collaboration.',
    icon: Target,
    accent: '#ff0080',
  },
  {
    title: 'Local / Expat Connections',
    spanish: 'Locales y Expatriados',
    description: 'Language practice, networking, culture, and community.',
    icon: Users,
    accent: '#00e5ff',
  },
  {
    title: 'Creative Experiences',
    spanish: 'Experiencias Creativas',
    description: 'Painting, art, culture, and social connection.',
    icon: Sparkles,
    accent: '#ff7400',
  },
];

const categoryMasonryClasses = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-2',
  'md:col-span-1',
];

const demoOffers: Record<string, Array<{ title: string; type: string; price: string; time: string; description: string; action: string }>> = {
  'AI & Business': [
    {
      title: 'AI Lead Gen Lab',
      type: 'Workshop',
      price: 'COP 85k',
      time: 'Thu 7:00 PM',
      description: 'Build a simple automation flow for leads, follow-up, and CRM notes.',
      action: 'Register',
    },
    {
      title: 'Automation Clinic',
      type: 'Session',
      price: 'Free RSVP',
      time: 'Sat 10:00 AM',
      description: 'Bring one business process and map a practical AI workflow.',
      action: 'RSVP',
    },
  ],
  'Marketing & Content': [
    {
      title: 'Storytelling Sprint',
      type: 'Workshop',
      price: 'COP 65k',
      time: 'Wed 6:30 PM',
      description: 'Turn your offer into a clear content angle for English and Spanish audiences.',
      action: 'Register',
    },
    {
      title: 'Creator Feedback Table',
      type: 'Networking',
      price: 'COP 30k',
      time: 'Fri 7:30 PM',
      description: 'Share a campaign, get feedback, and meet collaborators.',
      action: 'Join',
    },
  ],
  'Startups & Freelancing': [
    {
      title: 'Founder Offer Night',
      type: 'Event',
      price: 'COP 45k',
      time: 'Tue 7:00 PM',
      description: 'Pitch your service, find partners, and test your offer with the room.',
      action: 'RSVP',
    },
    {
      title: 'Freelancer Match Session',
      type: 'Session',
      price: 'Free waitlist',
      time: 'Coming soon',
      description: 'Meet people looking for design, marketing, tech, media, and operations support.',
      action: 'Waitlist',
    },
  ],
  'Local / Expat Connections': [
    {
      title: 'Bilingual Mixer',
      type: 'Networking',
      price: 'COP 25k',
      time: 'Sun 5:00 PM',
      description: 'Practice languages, meet locals and expats, and discover Medellin projects.',
      action: 'RSVP',
    },
    {
      title: 'Culture Walk + Coffee',
      type: 'Creative',
      price: 'COP 55k',
      time: 'Sat 3:00 PM',
      description: 'Explore a neighborhood, learn context, and connect through conversation.',
      action: 'Register',
    },
  ],
  'Creative Experiences': [
    {
      title: 'Paint & Connect',
      type: 'Creative',
      price: 'COP 70k',
      time: 'Fri 6:00 PM',
      description: 'A social painting session for art, language practice, and relaxed networking.',
      action: 'Register',
    },
    {
      title: 'Creative Culture Jam',
      type: 'Event',
      price: 'COP 40k',
      time: 'Coming soon',
      description: 'Music, media, storytelling, and community building in one evening.',
      action: 'Waitlist',
    },
  ],
};

function EventBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,116,0,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,116,0,0.13)_1px,transparent_1px)] bg-[size:68px_68px] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,116,0,0.18),transparent_30%),radial-gradient(circle_at_73%_45%,rgba(0,229,255,0.12),transparent_22%),radial-gradient(circle_at_40%_68%,rgba(255,0,128,0.14),transparent_24%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,116,0,0.22)_1px,transparent_1px)] bg-[size:8px_8px] opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
    </div>
  );
}

function CornerLabel({
  side,
  title,
  text,
}: {
  side: 'left' | 'right';
  title: string;
  text: string;
}) {
  return (
    <div
      className={`absolute top-8 hidden md:flex items-center gap-4 border border-[#ff7400] px-5 py-3 text-[#ff7400] ${
        side === 'left' ? 'left-8' : 'right-8'
      }`}
    >
      <div className="font-mono text-4xl font-black leading-none tracking-tight">{title}</div>
      <div className="h-12 w-px bg-[#ff7400]/80" />
      <div className="font-mono text-sm font-black uppercase leading-tight tracking-wide whitespace-pre-line">{text}</div>
    </div>
  );
}

function SlideFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`slide-section relative shrink-0 w-screen h-screen flex items-center px-6 md:px-16 xl:px-28 overflow-hidden ${className}`}
    >
      <EventBackdrop />
      <div className="absolute left-8 bottom-8 hidden md:block h-20 w-20 border-l-2 border-b-2 border-[#ff7400]/80" />
      <div className="absolute right-8 top-28 hidden md:block h-20 w-20 border-r-2 border-t-2 border-[#00e5ff]/70" />
      <div className="absolute right-[12%] bottom-[14%] hidden lg:block h-28 w-28 rounded-full border border-[#ff0080]/60" />
      <div className="relative z-10 w-full max-w-7xl mx-auto mobile-animate">{children}</div>
    </section>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="slide-bullet inline-flex w-fit items-center gap-2 border border-[#ff7400]/70 bg-black/70 px-3 py-1 font-mono text-[11px] font-black uppercase tracking-[0.28em] text-[#ff7400]">
      <CircleDot size={12} />
      {children}
    </span>
  );
}

function Title({
  children,
  accent,
  center = false,
}: {
  children: React.ReactNode;
  accent?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <h2
      className={`slide-title mt-5 text-4xl font-black uppercase leading-[0.92] tracking-normal text-white md:text-6xl xl:text-7xl ${
        center ? 'text-center' : ''
      }`}
    >
      <span className="block overflow-hidden py-1">
        <span className="slide-title-line block">{children}</span>
      </span>
      {accent && (
        <span className="block overflow-hidden py-1">
          <span className="slide-title-line block text-[#00e5ff]">{accent}</span>
        </span>
      )}
    </h2>
  );
}

function Bullet({ children, color = 'cyan' }: { children: React.ReactNode; color?: 'cyan' | 'orange' | 'magenta' }) {
  const colorClass = color === 'orange' ? 'text-[#ff7400]' : color === 'magenta' ? 'text-[#ff0080]' : 'text-[#00e5ff]';

  return (
    <div className="slide-bullet flex gap-4 border-l border-white/10 bg-black/45 p-4 backdrop-blur-sm">
      <CheckCircle2 className={`mt-1 h-5 w-5 shrink-0 ${colorClass}`} />
      <p className="text-base leading-relaxed text-zinc-200 md:text-lg">{children}</p>
    </div>
  );
}

function OrbitMark({ label }: { label: string }) {
  return (
    <div className="slide-visual relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-[#ff7400]/70" />
      <div className="absolute inset-[8%] rounded-full border border-[#00e5ff]/60" />
      <div className="absolute inset-[18%] rounded-full border border-[#ff0080]/50" />
      <div className="absolute inset-[30%] rounded-full bg-black/80 shadow-[0_0_90px_rgba(255,116,0,0.26)]" />
      <div className="absolute left-[8%] top-[17%] h-4 w-4 rounded-full bg-[#00e5ff] shadow-[0_0_26px_rgba(0,229,255,0.8)]" />
      <div className="absolute bottom-[20%] right-[11%] h-5 w-5 rounded-full bg-[#ff0080] shadow-[0_0_28px_rgba(255,0,128,0.75)]" />
      <div className="relative text-center">
        <div className="text-6xl font-black uppercase tracking-[0.2em] text-[#d9a632] md:text-8xl">{label}</div>
        <div className="mt-4 font-mono text-xs font-black uppercase tracking-[0.35em] text-[#00e5ff]">Build - Market - Connect</div>
      </div>
    </div>
  );
}

function SpeakerPortrait({
  image,
  name,
  initials,
  ringClass,
}: {
  image: string;
  name: string;
  initials: string;
  ringClass: string;
}) {
  const [imageAvailable, setImageAvailable] = useState(true);

  return (
    <div className={`relative mx-auto aspect-square w-40 overflow-hidden rounded-full border-2 ${ringClass} bg-black shadow-[0_0_42px_rgba(0,229,255,0.12)] md:w-44`}>
      {imageAvailable ? (
        <img
          src={image}
          alt={name}
          onError={() => setImageAvailable(false)}
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(0,0,0,0.82))] text-5xl font-black">
          {initials}
        </div>
      )}
    </div>
  );
}

export default function AIMarketingNetworkingNight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activeSlideRef = useRef(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(demoCategories[0].title);
  const [selectedFilter, setSelectedFilter] = useState('Events');

  // Wait for client mount before branching layout / pinning.
  // Avoids GSAP pin-spacer fighting React on first paint (insertBefore crash).
  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth < 1024);
    syncViewport();
    setIsReady(true);
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      const entrance = gsap.timeline({ delay: 0.1 });
      entrance.fromTo(
        '.cover-title-line',
        { y: '110%', skewY: 4 },
        { y: '0%', skewY: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }
      );
      entrance.fromTo(
        '.cover-reveal',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
        '-=0.55'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  useEffect(() => {
    if (!isDemoOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDemoOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDemoOpen]);

  useEffect(() => {
    if (!isReady) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const ctx = gsap.context(() => {
      if (isMobile) {
        const items = gsap.utils.toArray<HTMLElement>('.mobile-animate');
        items.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 34 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );
        });
        return;
      }

      const slides = gsap.utils.toArray<HTMLElement>('.slide-section');
      const pinTween = gsap.to(wrapper, {
        x: () => -(wrapper.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.55,
          start: 'top top',
          end: () => `+=${wrapper.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }
            const next = Math.min(Math.floor(self.progress * TOTAL_SLIDES), TOTAL_SLIDES - 1);
            if (next !== activeSlideRef.current) {
              activeSlideRef.current = next;
              setActiveSlide(next);
            }
          },
        },
      });

      slides.forEach((slide, index) => {
        if (index === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: slide,
            containerAnimation: pinTween,
            start: 'left 70%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.fromTo(
          slide.querySelectorAll('.slide-title-line'),
          { y: '110%', skewY: 3 },
          { y: '0%', skewY: 0, duration: 0.95, stagger: 0.08, ease: 'power3.out' },
          0
        )
          .fromTo(
            slide.querySelectorAll('.slide-bullet'),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' },
            0.15
          )
          .fromTo(
            slide.querySelectorAll('.slide-visual'),
            { opacity: 0, scale: 0.97, y: 18 },
            { opacity: 1, scale: 1, y: 0, duration: 0.85, stagger: 0.06, ease: 'power3.out' },
            0.22
          );
      });
    }, container);

    return () => ctx.revert();
  }, [isReady, isMobile]);

  const scrollToSlide = (index: number) => {
    if (isMobile || !wrapperRef.current) return;
    const totalScroll = wrapperRef.current.scrollWidth - window.innerWidth;
    window.scrollTo({ top: (index / (TOTAL_SLIDES - 1)) * totalScroll, behavior: 'smooth' });
  };

  const demoOverlay =
    isReady &&
    createPortal(
      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            className="fixed inset-0 z-[100] overflow-y-auto bg-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <EventBackdrop />
            <motion.div
              className="relative z-10 min-h-screen px-5 py-5 md:px-8 md:py-7"
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.99 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-b border-[#ff7400]/35 pb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.32, ease: 'easeOut' }}
              >
                <div>
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-[#ff7400]">Full page demo</p>
                  <h3 className="mt-2 text-2xl font-black uppercase leading-none text-white md:text-4xl">Medellin Community Platform</h3>
                </div>
                <motion.button
                  onClick={() => setIsDemoOpen(false)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 bg-black/70 text-white transition-colors hover:border-[#ff7400] hover:text-[#ff7400]"
                  aria-label="Close platform demo"
                >
                  <X size={22} />
                </motion.button>
              </motion.div>

              <motion.section
                className="mx-auto max-w-[1500px] py-8"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.38, ease: 'easeOut' }}
              >
                <div className="grid auto-rows-[minmax(260px,auto)] grid-cols-1 gap-0 overflow-hidden border-[3px] border-black bg-[#d8d8d3] text-black shadow-[18px_18px_0_rgba(255,116,0,0.9)] md:grid-cols-3">
                  {demoCategories.map((category, categoryIndex) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.title;

                    return (
                      <motion.button
                        key={category.title}
                        onClick={() => setSelectedCategory(category.title)}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.16 + categoryIndex * 0.035, ease: 'easeOut' }}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.985 }}
                        className={`group relative flex min-h-[260px] flex-col justify-between border-b-[3px] border-r-[3px] border-black bg-[#eeeeea] p-6 text-left transition-all hover:bg-white md:p-8 ${categoryMasonryClasses[categoryIndex]} ${
                          isSelected ? 'z-10 bg-white shadow-[inset_0_0_0_8px_#ff7400]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="border-2 border-black bg-[#d8d8d3] px-3 py-2 font-mono text-sm font-black uppercase tracking-widest">
                            {String(categoryIndex + 1).padStart(2, '0')}
                          </div>
                          <div
                            className="flex h-16 w-16 shrink-0 items-center justify-center border-[3px] border-black"
                            style={{ backgroundColor: category.accent, color: category.accent === '#ff7400' ? '#000000' : '#ffffff' }}
                          >
                            <Icon size={32} />
                          </div>
                        </div>

                        <div className="mt-8">
                          <p className={`${categoryIndex === 0 ? 'text-6xl md:text-8xl' : 'text-4xl md:text-5xl'} font-black uppercase leading-[0.82] tracking-normal text-black`}>
                            {category.title}
                          </p>
                          <p className="mt-4 font-mono text-sm font-black uppercase tracking-[0.22em] text-black/55">{category.spanish}</p>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-2">
                          {demoFilters.map((filter) => (
                            <span key={filter} className="border-2 border-black bg-[#eeeeea] px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-black">
                              {filter}
                            </span>
                          ))}
                        </div>

                        <div className="mt-7 grid grid-cols-[1fr_auto] border-[3px] border-black bg-white">
                          <p className="p-4 text-base font-black leading-snug text-black md:text-lg">{category.description}</p>
                          <div className="flex min-w-16 items-center justify-center border-l-[3px] border-black bg-[#ff7400] font-mono text-3xl font-black text-black">
                            +
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );

  if (!isReady) {
    return <main className="min-h-screen bg-black" aria-hidden />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-[#ff7400]/40">
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-[#ff7400]/35 bg-black/75 px-6 py-4 backdrop-blur-xl md:px-8">
        <Link href="/" className="group flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:text-[#ff7400]">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Portfolio
        </Link>
        <div className="flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#00e5ff]">
          <span className="hidden sm:inline">AI & Marketing</span>
          <span className="border border-[#ff7400]/60 px-3 py-1 text-[#ff7400]">Deck</span>
        </div>
      </header>

      {!isMobile && (
        <div className="fixed left-0 right-0 top-[57px] z-50 h-[2px] bg-[#ff7400]/15">
          <div ref={progressBarRef} className="h-full w-0 bg-gradient-to-r from-[#ff7400] via-[#00e5ff] to-[#ff0080]" />
        </div>
      )}

      {demoOverlay}

      <div ref={containerRef} className="relative z-10">
        <div ref={wrapperRef} className={isMobile ? 'flex flex-col' : 'flex h-screen w-[700vw] items-center'}>
          <section className="slide-section relative flex h-screen w-screen shrink-0 items-center overflow-hidden px-6 pt-16 md:px-16 xl:px-28">
            <EventBackdrop />
            <CornerLabel side="left" title="AI" text={'Build\nMarket\nConnect'} />
            <CornerLabel side="right" title="GO" text={'Create\nGrow\nRepeat'} />
            <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-10 mx-auto lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="cover-reveal mb-6 inline-flex items-center gap-3 border border-[#ff7400] bg-black/70 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.28em] text-[#ff7400] opacity-0">
                  <CalendarDays size={16} />
                  Medellin - Networking Night
                </div>
                <h1 className="cover-title text-5xl font-black uppercase leading-[0.9] tracking-normal text-white md:text-7xl xl:text-8xl">
                  <span className="block overflow-hidden py-1">
                    <span className="cover-title-line block">AI & Marketing</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="cover-title-line block text-[#ff7400]">Networking</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="cover-title-line block font-serif italic normal-case text-[#ff0080]">Night</span>
                  </span>
                </h1>
                <p className="cover-reveal mt-7 max-w-2xl text-xl leading-relaxed text-zinc-200 opacity-0 md:text-2xl">
                  Practical AI, modern marketing, and real connections in Medellin.
                </p>
                <div className="cover-reveal mt-9 flex flex-wrap gap-4 opacity-0">
                  <div className="border border-[#00e5ff]/70 bg-black/70 px-5 py-3 font-mono text-xs font-black uppercase tracking-widest text-[#00e5ff]">
                    Kingdom Creators
                  </div>
                  <div className="border border-white/20 bg-black/70 px-5 py-3 font-mono text-xs font-black uppercase tracking-widest text-zinc-200">
                    Moderator
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <OrbitMark label="KC" />
              </div>
            </div>
          </section>

          <SlideFrame>
            <div className="mx-auto max-w-4xl">
              <div>
                <Kicker>Welcome</Kicker>
                <Title accent="purpose">Welcome &</Title>
                <div className="mt-8 space-y-4">
                  <Bullet>Thank you for joining AI & Marketing Networking Night.</Bullet>
                  <Bullet color="orange">
                    Tonight we bring together people interested in AI & business, marketing & content, startups & freelancing, and local/expat connections.
                  </Bullet>
                  <Bullet color="magenta">
                    Our goal is to create a bilingual space where people can learn, connect, and build real relationships through practical conversations and meaningful experiences.
                  </Bullet>
                </div>
                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="slide-bullet mt-6 inline-flex items-center gap-3 border border-[#00e5ff]/70 bg-[#00e5ff]/10 px-5 py-3 font-mono text-xs font-black uppercase tracking-widest text-[#00e5ff] transition-colors hover:bg-[#00e5ff] hover:text-black"
                >
                  <Sparkles size={16} />
                  Open platform demo
                </button>
              </div>
            </div>
          </SlideFrame>

          <SlideFrame>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <Kicker>Community vision</Kicker>
                <Title accent="exists">Why this community</Title>
              </div>
              <div className="lg:col-span-7">
                <div className="space-y-4">
                  <Bullet>
                    To connect people through a bilingual network built around AI & business, marketing & content, startups & freelancing, and local/expat connections.
                  </Bullet>
                  <Bullet color="orange">
                    To create themed activities, events, and workshops that make it easy and interesting for people to meet, learn, and collaborate.
                  </Bullet>
                  <Bullet color="magenta">
                    To build a community that helps people discover Medellin, practice languages, share value, and form real connections.
                  </Bullet>
                </div>
                <div className="slide-bullet mt-6 border border-[#ff7400]/45 bg-black/70 p-5">
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.26em] text-[#ff7400]">Brand statement</p>
                  <p className="mt-3 text-lg leading-relaxed text-zinc-100">
                    We are a bilingual community brand creating themed events, workshops, and networking experiences in Medellin that connect people through AI, business, marketing, startups, freelancing, and local culture.
                  </p>
                </div>
                <div className="slide-visual mt-8 grid grid-cols-3 border border-[#00e5ff]/45 text-center font-mono text-xs font-black uppercase tracking-widest">
                  {['AI', 'Business', 'Media'].map((item) => (
                    <div key={item} className="border-r border-[#00e5ff]/30 px-4 py-6 last:border-r-0">
                      <span className="text-[#00e5ff]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SlideFrame>

          <SlideFrame>
            <div className="text-center">
              <Kicker>Partners</Kicker>
              <Title center accent="our sponsors">Thank you to</Title>
              <div className="slide-visual mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
                {sponsors.map((sponsor, index) => (
                  <div key={sponsor} className="relative min-h-44 border border-[#ff7400]/50 bg-black/75 p-5 text-left">
                    <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-full border ${index % 2 ? 'border-[#00e5ff] text-[#00e5ff]' : 'border-[#ff7400] text-[#ff7400]'}`}>
                      <Handshake size={26} />
                    </div>
                    <p className="font-mono text-xl font-black uppercase leading-tight tracking-wide text-white">{sponsor}</p>
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#ff7400] via-[#00e5ff] to-[#ff0080]" />
                  </div>
                ))}
              </div>
              <p className="slide-bullet mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-zinc-200">
                Supporting AI, marketing, creativity, education, and community in Medellin.
              </p>
            </div>
          </SlideFrame>

          <SlideFrame>
            <div>
              <Kicker>Lineup</Kicker>
              <Title accent="speakers">Tonight&apos;s</Title>
              <div className="slide-visual mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {speakers.map((speaker) => {
                  const ring =
                    speaker.color === 'cyan'
                      ? 'border-[#00e5ff] text-[#00e5ff]'
                      : speaker.color === 'magenta'
                      ? 'border-[#ff0080] text-[#ff0080]'
                      : 'border-[#ff7400] text-[#ff7400]';

                  return (
                    <div key={speaker.name} className="border border-white/15 bg-black/70 p-5">
                      <SpeakerPortrait image={speaker.image} name={speaker.name} initials={speaker.initials} ringClass={ring} />
                      <div className="mt-6 border-t border-[#ff7400]/70 pt-4">
                        <h3 className="font-mono text-2xl font-black uppercase leading-tight text-white">{speaker.name}</h3>
                        <p className="mt-3 text-lg leading-relaxed text-zinc-300">{speaker.topic}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SlideFrame>

          <SlideFrame>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <Kicker>Engage</Kicker>
                <Title accent="tonight">Make the most of</Title>
              </div>
              <div className="lg:col-span-6">
                <div className="space-y-4">
                  <Bullet>Meet at least 3 new people: founders, marketers, developers, creators.</Bullet>
                  <Bullet color="orange">Ask questions during the panel and to speakers afterwards.</Bullet>
                  <Bullet color="magenta">Exchange LinkedIn profiles and share your projects.</Bullet>
                  <Bullet>If you are interested in future AI & marketing events, come talk to us at the end.</Bullet>
                </div>
              </div>
            </div>
          </SlideFrame>

          <SlideFrame>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <Kicker>Next</Kicker>
                <Title accent="events">Upcoming AI & Marketing</Title>
                <p className="slide-bullet mt-7 text-xl leading-relaxed text-zinc-200">
                  Connect. Learn. Share. Build what&apos;s next.
                </p>
              </div>
              <div className="slide-visual lg:col-span-7">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {events.map((event, index) => (
                    <div key={event} className="flex min-h-36 items-center gap-5 border border-[#00e5ff]/40 bg-black/70 p-5">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center border ${index % 2 ? 'border-[#ff0080] text-[#ff0080]' : 'border-[#ff7400] text-[#ff7400]'}`}>
                        {index % 2 ? <Users size={26} /> : <Mic2 size={26} />}
                      </div>
                      <div>
                        <p className="font-mono text-lg font-black uppercase leading-tight text-white">{event}</p>
                        <p className="mt-2 text-sm text-zinc-400">Medellin bilingual network</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4 border border-[#ff7400]/45 bg-black/70 p-5 font-mono text-xs font-black uppercase tracking-widest text-zinc-200">
                  <MapPin className="text-[#ff7400]" size={18} />
                  Zendaya Retro House - Sabaneta, Antioquia
                  <Network className="ml-auto text-[#00e5ff]" size={18} />
                </div>
              </div>
            </div>
          </SlideFrame>
        </div>
      </div>

      {!isMobile && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 border border-[#ff7400]/40 bg-black/75 px-4 py-3 backdrop-blur-xl">
          <button
            onClick={() => scrollToSlide(Math.max(activeSlide - 1, 0))}
            disabled={activeSlide === 0}
            className="p-1.5 text-white transition-colors hover:text-[#ff7400] disabled:opacity-25"
            aria-label="Previous slide"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_SLIDES }, (_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`h-2 transition-all ${activeSlide === index ? 'w-5 bg-[#ff7400]' : 'w-2 bg-white/25 hover:bg-[#00e5ff]'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => scrollToSlide(Math.min(activeSlide + 1, TOTAL_SLIDES - 1))}
            disabled={activeSlide === TOTAL_SLIDES - 1}
            className="p-1.5 text-white transition-colors hover:text-[#ff7400] disabled:opacity-25"
            aria-label="Next slide"
          >
            <ArrowRight size={16} />
          </button>
          <span className="border-l border-white/15 pl-3 font-mono text-xs text-zinc-400">
            {activeSlide + 1} / {TOTAL_SLIDES}
          </span>
        </div>
      )}
    </main>
  );
}
