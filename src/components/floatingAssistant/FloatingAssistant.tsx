// components/FloatingAssistant.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';


interface FloatingAssistantProps {
  onOpen: () => void;
}

export const FloatingAssistant = ({ onOpen }: FloatingAssistantProps) => (
<motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onOpen}
    className="fixed bottom-8 right-8 bg-[#5cbef8]/20 p-4 rounded-full border border-[#5cbef8]/30
               hover:bg-[#5cbef8]/30 transition-colors group z-50"
  >
    <Bot className="w-8 h-8 text-[#5cbef8]" />
    <div className="absolute inset-0 rounded-full bg-[#5cbef8]/10 animate-pulse" />
    <motion.div
      className="absolute -inset-2 rounded-full border border-[#5cbef8]/20"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.2, 0.5]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </motion.button>
);



