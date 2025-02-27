// AppLayout.tsx
'use client';

import { Header } from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FloatingInput } from '@/components/FloatingInput';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [aiContent, setAIContent] = useState<React.ReactNode | null>(null);

  const handleDisplayContent = (content: React.ReactNode) => {
    setAIContent(content);
  };

  return (
    <div className="relative bg-[#0a192f]">
      <Header />
      
      {/* Main Content */}
      <div className="min-h-screen pb-32"> {/* Added padding for input */}
        <div className="max-w-screen-xl mx-auto">
          <AnimatePresence mode="wait">
            {aiContent ? (
              <motion.div
                key="ai-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-8 px-8 display flex justify-center w-[100%]"
              >
                {aiContent}
              </motion.div>
            ) : (
              <motion.div
                key="regular-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Input */}
      <FloatingInput onDisplayContent={handleDisplayContent} />
    </div>
  );
};