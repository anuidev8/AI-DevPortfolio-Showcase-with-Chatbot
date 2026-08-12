'use client'
import { motion } from 'framer-motion';
import { Bot, ChartNoAxesCombined, PhoneCall, Smartphone, Terminal} from 'lucide-react';

const services = [
  {
    title: "AI Wellness App MVP",
    description: "For founders who need a first version of a meditation, breathwork, sleep, coaching, fitness, or health product that feels polished enough to show users and investors.",
    icon: <Smartphone className="w-6 h-6 text-[#5cbef8]" />,
    features: [
      "Mobile and web product architecture",
      "Onboarding, subscriptions, audio, and progress flows",
      "Calm, trustworthy wellness UX",
      "React, Next.js, React Native, and Node.js"
    ]
  },
  {
    title: "Voice AI & Realtime Interfaces",
    description: "For products that need conversational AI, realtime coaching, camera or voice interaction, AI-guided sessions, or a copilot inside the product experience.",
    icon: <Bot className="w-6 h-6 text-[#5cbef8]" />,
    features: [
      "OpenAI, Google Live, ElevenLabs, and WebRTC workflows",
      "Streaming chat, voice, and multimodal UI",
      "Agentic UI patterns and tool calling",
      "Fast prototypes that can become real product features"
    ]
  },
  {
    title: "Frontend Product Systems",
    description: "For teams that need dashboards, internal tools, hiring workflows, analytics screens, landing experiences, or performance improvements in an existing product.",
    icon: <ChartNoAxesCombined className="w-6 h-6 text-[#5cbef8]" />,
    features: [
      "Dashboard and admin experiences",
      "Design systems and reusable UI components",
      "Analytics, automation, and marketing integrations",
      "Maintainable architecture for growing teams"
    ]
  }
];

export const ServicesSection = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/+573206456179?text=Hi%20Angel,%20I%20want%20to%20talk%20about%20an%20AI%20or%20wellness%20product.', '_blank');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      id="services"
      className="space-y-12"
    >
           <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
           <Terminal className="text-[#5cbef8]" />
        Signature_Offers
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          className="retro-card border border-gray-700/50 rounded-lg p-8 bg-[#0a192f]/80 backdrop-blur-sm
                     hover:border-[#5cbef8]/50 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="absolute inset-0" 
                   style={{
                     backgroundImage: 'linear-gradient(to right, #5cbef8 1px, transparent 1px), linear-gradient(to bottom, #5cbef8 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                   }}
              />
            </div>

            <div className="relative z-10">
              <div className="mb-6">
                {service.icon}
              </div>

              <h3 className="text-xl text-white font-bold mb-4 font-mono leading-snug">
                <span className="text-[#5cbef8]">&gt; </span>
                {service.title}
              </h3>

              <p className="text-gray-300 mb-6">
                {service.description}
              </p>

              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + i * 0.1 }}
                    className="flex items-center text-gray-400"
                  >
                    <span className="text-[#5cbef8] mr-2">›</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* WhatsApp CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsAppClick}
          className="flex items-center gap-3 px-8 py-4 bg-green-500 rounded-lg text-white font-mono
                   hover:bg-green-600 transition-colors group relative overflow-hidden"
        >
          <PhoneCall className="w-6 h-6" />
          <span className="relative z-10">Book a quick project call</span>
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
               style={{
                 background: 'radial-gradient(circle at center, white 0%, transparent 70%)'
               }}
          />
        </motion.button>
      </motion.div>
    </motion.section>
  );
};
