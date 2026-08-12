'use client'

import { motion } from 'framer-motion';
import { Activity, BrainCircuit, BriefcaseBusiness, HeartPulse, Layers3, Users } from 'lucide-react';

const audiences = [
  {
    title: "Wellness Founders",
    description: "Build meditation, breathwork, sleep, coaching, and health apps with calm UI, reliable architecture, and product flows that support retention.",
    icon: <HeartPulse className="h-6 w-6 text-[#5cbef8]" />
  },
  {
    title: "Hiring Teams & Agencies",
    description: "Create internal dashboards, talent matching systems, automation workflows, and AI assistants that reduce manual work.",
    icon: <Users className="h-6 w-6 text-[#5cbef8]" />
  },
  {
    title: "AI Product Builders",
    description: "Prototype and ship voice AI, realtime interfaces, chat copilots, agentic UI, and workflow automation that users can actually operate.",
    icon: <BrainCircuit className="h-6 w-6 text-[#5cbef8]" />
  }
];

const proofPoints = [
  "Breathwork and meditation mobile app experience",
  "Sleep music and wellness web app delivery",
  "Realtime voice and camera AI demos",
  "AI fitness, coaching, and matching product prototypes"
];

const process = [
  {
    title: "Clarify",
    description: "Define the user journey, must-have features, AI workflow, and the fastest version worth testing."
  },
  {
    title: "Prototype",
    description: "Build the interface, core flows, AI integration, and enough product logic to validate the idea."
  },
  {
    title: "Ship",
    description: "Stabilize the experience, connect analytics or automations, and prepare the product for real users."
  }
];

const logos = [
  { src: "/sponsors/the schoolofbretah.png", alt: "The School of Breath" },
  { src: "/sponsors/thecredlegroup.png", alt: "The Credle Group" },
  { src: "/sponsors/goat.png", alt: "GOAT" }
];

export const PositioningSection = () => {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        id="who-i-help"
        className="space-y-8"
      >
        <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
          <BriefcaseBusiness className="text-[#5cbef8]" />
          Who_I_Help
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="retro-card border border-gray-700/50 rounded-lg p-6 bg-[#0a192f]/80 backdrop-blur-sm hover:border-[#5cbef8]/50 transition-all"
            >
              <div className="mb-5">{audience.icon}</div>
              <h3 className="text-xl font-mono text-white mb-3">
                <span className="text-[#5cbef8]">&gt; </span>
                {audience.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">{audience.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-stretch"
      >
        <div className="retro-card border border-gray-700/50 rounded-lg p-8 bg-[#0a192f]/80 backdrop-blur-sm">
          <h2 className="text-3xl font-mono text-white mb-5 flex items-center gap-3">
            <Activity className="text-[#5cbef8]" />
            Wellness_Product_Experience
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            I have worked on breathwork, meditation, sleep music, fitness, and AI-guided wellness experiences. I understand the difference between a generic app and a calm, trustworthy wellness product: onboarding, audio flows, progress tracking, mobile UX, subscriptions, and retention all matter.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {proofPoints.map((point) => (
              <div key={point} className="rounded-lg border border-gray-700/50 bg-gray-900/30 p-3 text-sm text-gray-300">
                <span className="text-[#5cbef8]">› </span>
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="retro-card border border-gray-700/50 rounded-lg p-8 bg-[#0a192f]/80 backdrop-blur-sm">
          <h2 className="text-3xl font-mono text-white mb-5 flex items-center gap-3">
            <Layers3 className="text-[#5cbef8]" />
            Process
          </h2>
          <div className="space-y-5">
            {process.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#5cbef8]/40 bg-[#5cbef8]/10 font-mono text-sm text-[#5cbef8]">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-mono text-white">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-mono text-white flex items-center gap-3">
          <Users className="text-[#5cbef8]" />
          Product_Teams_&_Brands
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {logos.map((logo) => (
            <div key={logo.alt} className="rounded-lg border border-gray-700/50 bg-white/95 p-5 min-h-[96px] flex items-center justify-center">
              <img src={logo.src} alt={logo.alt} className="max-h-14 max-w-full object-contain" />
            </div>
          ))}
        </div>
      </motion.section>
    </>
  );
};
