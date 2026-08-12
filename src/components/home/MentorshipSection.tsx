'use client'

import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle2, GraduationCap, MessageCircle, UsersRound } from 'lucide-react';

const membershipUrl = "https://wa.me/+573206456179?text=Hi%20Angel,%20I%20want%20to%20learn%20more%20about%20your%20mentorship%20membership.";

const membershipFor = [
  "Wellness founders validating an app, AI coach, or digital product",
  "Developers who want to build with AI tools, voice interfaces, and modern frontend systems",
  "Operators who need help turning workflows, content, or services into productized experiences"
];

const included = [
  "Monthly strategy and implementation calls",
  "Async feedback on product ideas, UI flows, prompts, and architecture",
  "Practical build sessions for MVPs, automations, dashboards, and AI features",
  "Templates for product thinking, outreach, UI planning, and launch workflows"
];

export const MentorshipSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      id="membership"
      className="retro-card border border-gray-700/50 rounded-lg p-8 bg-[#0a192f]/80 backdrop-blur-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5cbef8]/30 bg-[#5cbef8]/10 px-3 py-1 text-sm text-[#5cbef8]">
            <GraduationCap className="h-4 w-4" />
            Mentorship membership
          </div>

          <h2 className="text-3xl md:text-4xl font-mono text-white mb-5 leading-tight">
            Build your AI product with senior guidance instead of guessing alone.
          </h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            A practical membership for founders, wellness operators, and developers who want help shaping, building, and launching AI-powered product experiences.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={membershipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-mono text-white transition-colors hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Ask about membership
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700/50 px-5 py-3 font-mono text-gray-300 transition-colors hover:border-[#5cbef8]/50 hover:text-white"
            >
              <CalendarCheck className="h-5 w-5" />
              See examples
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-lg border border-gray-700/50 bg-gray-900/30 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-mono text-xl text-white">
              <UsersRound className="h-5 w-5 text-[#5cbef8]" />
              For
            </h3>
            <ul className="space-y-3">
              {membershipFor.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5cbef8]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-700/50 bg-gray-900/30 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-mono text-xl text-white">
              <GraduationCap className="h-5 w-5 text-[#5cbef8]" />
              Included
            </h3>
            <ul className="space-y-3">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5cbef8]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
