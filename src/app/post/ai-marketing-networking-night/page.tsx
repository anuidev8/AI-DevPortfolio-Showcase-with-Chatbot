'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Handshake, MapPin, Mic2, Network, Sparkles, Users } from 'lucide-react';

const sponsors = [
  { name: 'Kingdom Creators', image: '/sponsors/Screenshot 2026-07-29 at 2.43.45 PM.png' },
  { name: 'The Credle Group', image: '/sponsors/thecredlegroup.png' },
  { name: 'GOAT', image: '/sponsors/goat.png' },
  { name: 'The School of Breath', image: '/sponsors/the schoolofbretah.png' },
];

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

const upcomingEvents = [
  {
    title: 'Drawing MUSIC in the park',
    schedule: 'Viernes a las 17:00',
    location: 'Medellin Modern Art Museum, Cra 44 #19a-100, El Poblado, Medellin, Antioquia, Colombia',
    host: 'Evento de Derek A Hammer',
  },
  {
    title: 'AI Marketing Dinner Night - August Edition',
    schedule: 'August 2026',
    location: 'Medellin, Colombia',
    host: 'Private dinner event for AI, marketing, networking, and high-value conversations',
  },
];

const tagList = ['Events', 'Workshops', 'Sessions', 'Creative', 'Networking'];

const sections = [
  {
    id: 'vision',
    number: '01',
    title: 'Community Vision',
    eyebrow: 'Why this exists',
    subtitle: 'Our mission',
    accent: '#ff7400',
    icon: Sparkles,
    description: 'Provide the best tools (software, mindset, opportunities) to grow businesses, relationships and entrepreneurship.',
    bullets: ['Provide the best tools (software, mindset, opportunities) to grow businesses, relationships and entrepreneurship.'],
  },
  {
    id: 'sponsors',
    number: '02',
    title: 'Sponsors & Partners',
    eyebrow: 'Support',
    subtitle: 'Sponsors',
    accent: '#ff0080',
    icon: Handshake,
    description: '',
    bullets: [],
  },
  {
    id: 'speakers',
    number: '03',
    title: 'Speaker Topics',
    eyebrow: 'Tonight',
    subtitle: 'Three focused talks with clear themes and practical takeaways.',
    accent: '#00e5ff',
    icon: Mic2,
    description:
      'Each speaker card can be clicked and the main content panel can expand their topic, bio, CTA, or media without changing the layout.',
    bullets: [
      'AI products and agentic workflows.',
      'Marketing mindset and positioning.',
      'Websites, CRM, automation, and lead generation.',
    ],
  },
  {
    id: 'next',
    number: '04',
    title: 'Upcoming Formats',
    eyebrow: 'What comes next',
    subtitle: 'Upcoming events',
    accent: '#ff0080',
    icon: Network,
    description: '',
    bullets: [],
  },
] as const;

const cardCtaLabel: Record<(typeof sections)[number]['id'], string> = {
  vision: 'Our mission',
  sponsors: 'Sponsors',
  speakers: 'View topics',
  next: 'View events',
};

function EventBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,116,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,116,0,0.12)_1px,transparent_1px)] bg-[size:68px_68px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,116,0,0.18),transparent_24%),radial-gradient(circle_at_78%_35%,rgba(0,229,255,0.12),transparent_18%),radial-gradient(circle_at_22%_68%,rgba(255,0,128,0.14),transparent_24%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/92 to-black" />
    </div>
  );
}

function TopicTags() {
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {tagList.map((tag) => (
        <span
          key={tag}
          className="border-2 border-white/30 bg-black px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-white"
        >
          {tag}
        </span>
      ))}
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
    <div className={`relative aspect-square w-20 overflow-hidden rounded-full border-2 bg-black ${ringClass}`}>
      {imageAvailable ? (
        <img
          src={image}
          alt={name}
          onError={() => setImageAvailable(false)}
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white">{initials}</div>
      )}
    </div>
  );
}

function SponsorLogo({ image, name }: { image: string; name: string }) {
  const [imageAvailable, setImageAvailable] = useState(true);

  return (
    <div className="flex h-20 w-20 items-center justify-center overflow-hidden border-[3px] border-white/15 bg-white p-2">
      {imageAvailable ? (
        <img
          src={image}
          alt={name}
          onError={() => setImageAvailable(false)}
          className="max-h-full max-w-full object-contain"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#ff7400] text-center font-mono text-[10px] font-black uppercase tracking-[0.18em] text-black">
          Logo
        </div>
      )}
    </div>
  );
}

export default function AIMarketingNetworkingNight() {
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]['id']>('vision');

  const currentSection = useMemo(
    () => sections.find((section) => section.id === activeSection) ?? sections[0],
    [activeSection]
  );
  const currentDescription = currentSection.description ?? '';
  const cardLayoutClasses = [
    'lg:col-start-3 lg:row-start-1',
    'lg:col-start-3 lg:row-start-2',
    'lg:col-start-1 lg:row-start-3',
    'lg:col-start-2 lg:col-span-2 lg:row-start-3',
  ];
  return (
    <main className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-[#ff7400]/40">
      <EventBackdrop />

      <header className="sticky top-0 z-50 border-b border-[#ff7400]/25 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:text-[#ff7400]"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Portfolio
          </Link>

          <div className="text-right">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white">AI Marketing Networking Night</p>
          </div>
        </div>
      </header>

      <section className="relative z-10 px-6 py-7 md:px-10 md:py-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#ff7400]/25 pb-4">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-[#ff7400]">Kingdom Creators</p>
              <h1 className="mt-2 text-3xl font-black uppercase leading-none text-white md:text-5xl">Bilingual Community Platform</h1>
            </div>
          </div>

          <div className="grid gap-12 overflow-visible lg:h-[calc(100vh-180px)] lg:grid-cols-[minmax(220px,0.78fr)_minmax(220px,0.78fr)_minmax(320px,0.9fr)] lg:grid-rows-[minmax(210px,1fr)_minmax(210px,1fr)_minmax(240px,1.08fr)]">
            <div className="border-[3px] border-white/15 bg-[#0d0d0d] text-white shadow-[6px_6px_0_rgba(255,116,0,0.75)] lg:col-span-2 lg:row-span-2">
              <div className="grid h-full min-h-[640px] grid-rows-[auto_1fr_auto] lg:min-h-0">
                <div className="flex items-start justify-between gap-6 border-b-[3px] border-white/15 p-6 md:p-8">
                  <div className="border-2 border-white/25 bg-[#171717] px-3 py-2 font-mono text-sm font-black uppercase tracking-widest">
                    {currentSection.number}
                  </div>
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center border-[3px] border-white/15"
                    style={{ backgroundColor: currentSection.accent, color: currentSection.accent === '#ff7400' ? '#000' : '#fff' }}
                  >
                    <currentSection.icon size={30} />
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSection.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.24, ease: 'easeOut' }}
                      className="h-full"
                    >
                      <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-white/55">{currentSection.eyebrow}</p>
                      <h2 className="mt-8 max-w-4xl text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl">
                        {currentSection.title}
                      </h2>
                      <p className="mt-5 max-w-3xl font-mono text-sm font-black uppercase tracking-[0.22em] text-white/45">
                        {currentSection.subtitle}
                      </p>

                      {currentSection.id !== 'speakers' && <TopicTags />}

                      {currentSection.id === 'vision' ? (
                        <div className="mt-10 border-[3px] border-white/15 bg-[#171717] p-6 md:p-8 lg:max-w-[88%]">
                          <p className="text-2xl font-black leading-[1.08] text-white md:text-3xl xl:text-4xl">
                            Provide the best tools (software, mindset, opportunities) to grow businesses, relationships and entrepreneurship.
                          </p>
                        </div>
                      ) : currentSection.id !== 'speakers' && (currentSection.bullets.length > 0 || currentSection.description) && (
                        <div className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
                          <div className="space-y-4">
                            {currentSection.bullets.map((bullet, index) => (
                              <div key={bullet} className="flex gap-4 border-l-2 border-white/30 bg-[#141414] p-4">
                                <CheckCircle2
                                  className={
                                    index % 3 === 1
                                      ? 'mt-1 h-5 w-5 shrink-0 text-[#ff7400]'
                                      : index % 3 === 2
                                      ? 'mt-1 h-5 w-5 shrink-0 text-[#ff0080]'
                                      : 'mt-1 h-5 w-5 shrink-0 text-[#00a8c2]'
                                  }
                                />
                                <p className="text-base font-medium leading-relaxed text-white md:text-lg">{bullet}</p>
                              </div>
                            ))}
                          </div>

                          {currentDescription ? (
                            <div className="border-[3px] border-white/15 bg-[#171717] p-5">
                              <p className="mt-4 text-lg font-black leading-snug text-white">{currentDescription}</p>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {currentSection.id === 'sponsors' && (
                        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          {sponsors.map((sponsor) => (
                            <div key={sponsor.name} className="border-[3px] border-white/15 bg-[#141414] p-5">
                              <SponsorLogo image={sponsor.image} name={sponsor.name} />
                              <p className="mt-6 text-xl font-black uppercase leading-tight">{sponsor.name}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {currentSection.id === 'speakers' && (
                        <div className="mt-10 grid gap-4 xl:grid-cols-3">
                          {speakers.map((speaker) => {
                            const ringClass =
                              speaker.color === 'orange'
                                ? 'border-[#ff7400]'
                                : speaker.color === 'magenta'
                                ? 'border-[#ff0080]'
                                : 'border-[#00e5ff]';

                            return (
                              <div key={speaker.name} className="min-w-0 border-[3px] border-white/15 bg-[#141414] p-5">
                                <div className="flex items-start gap-4">
                                  <SpeakerPortrait
                                    image={speaker.image}
                                    name={speaker.name}
                                    initials={speaker.initials}
                                    ringClass={ringClass}
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xl font-black uppercase leading-tight break-words">{speaker.name}</p>
                                    <p className="mt-3 text-sm leading-relaxed text-white/75">{speaker.topic}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {currentSection.id === 'next' && (
                        <div className="mt-10 grid gap-4 md:grid-cols-2">
                          {upcomingEvents.map((event, index) => (
                            <div key={event.title} className="border-[3px] border-white/15 bg-[#141414] p-5">
                              <div className="flex items-start gap-4">
                                <div
                                  className="flex h-14 w-14 shrink-0 items-center justify-center border-[3px] border-white/15"
                                  style={{ backgroundColor: index % 2 === 0 ? '#ff7400' : '#ff0080' }}
                                >
                                  {index % 2 === 0 ? <Mic2 size={24} className="text-black" /> : <Users size={24} className="text-white" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#ff7400]">{event.schedule}</p>
                                  <p className="mt-3 text-xl font-black leading-tight">{event.title}</p>
                                  <p className="mt-3 text-sm leading-relaxed text-white/70">{event.location}</p>
                                  <p className="mt-4 text-sm font-semibold text-white/85">{event.host}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>

                {currentSection.id === 'next' && (
                  <div className="border-t-[3px] border-white/15 bg-[#111111] p-5 md:p-6">
                    <p className="text-lg font-black leading-snug text-white md:text-2xl">Upcoming AI and community events in Medellin.</p>
                    <div className="mt-4 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.24em] text-white/55">
                      <MapPin size={15} />
                      Medellin, Colombia
                    </div>
                  </div>
                )}
              </div>
            </div>

            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = section.id === activeSection;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`group flex min-h-[220px] min-w-0 flex-col overflow-hidden border-[3px] p-6 text-left transition-colors ${
                    cardLayoutClasses[index]
                  } ${
                    isActive
                      ? 'border-[#ff7400] bg-[#1a1a1a] shadow-[inset_0_0_0_4px_#ff7400]'
                      : 'border-white/15 bg-[#111111] hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`border-2 px-3 py-2 font-mono text-sm font-black uppercase tracking-widest ${
                        isActive ? 'border-[#ff7400] bg-[#24160a] text-[#ff7400]' : 'border-white/25 bg-[#171717] text-white'
                      }`}
                    >
                      {section.number}
                    </div>
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center border-[3px] ${
                        isActive ? 'border-[#ff7400]' : 'border-white/15'
                      }`}
                      style={{ backgroundColor: section.accent, color: section.accent === '#ff7400' ? '#000' : '#fff' }}
                    >
                      <Icon size={30} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className={`${index === 3 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-4xl'} font-black uppercase leading-[0.84] tracking-normal text-white break-words`}>
                      {section.title}
                    </p>
                    <p className="mt-4 font-mono text-sm font-black uppercase tracking-[0.22em] text-white/55">{section.eyebrow}</p>
                  </div>

                  <div className="mt-auto pt-6">
                    <div
                      className={`grid grid-cols-[1fr_auto] border-[3px] ${
                        isActive ? 'border-[#ff7400] bg-[#171717]' : 'border-white/15 bg-[#171717]'
                      }`}
                    >
                      <p className="min-w-0 p-4 text-base font-black leading-snug text-white">{cardCtaLabel[section.id]}</p>
                      <div className="flex min-w-16 items-center justify-center border-l-[3px] border-black bg-[#ff7400] font-mono text-3xl font-black text-black">
                        {isActive ? '-' : '+'}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 border border-white/10 bg-black/55 px-5 py-4 font-mono text-xs font-black uppercase tracking-[0.2em] text-zinc-300">
            <span className="text-[#00e5ff]">Yes, this design can be reused for all current content.</span>
            <span className="text-zinc-500">|</span>
            <span>Each card becomes a topic switcher</span>
            <span className="text-zinc-500">|</span>
            <span>Future sections can be added to the same data array</span>
          </div>
        </div>
      </section>
    </main>
  );
}
