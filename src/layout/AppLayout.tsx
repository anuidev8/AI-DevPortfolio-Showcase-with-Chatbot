'use client'
import { FloatingAssistant } from '@/components/floatingAssistant/FloatingAssistant';
import { Header } from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SidebarCloseIcon, ArrowLeft } from 'lucide-react';
import { ChatInterface } from '@/components/assistant/ChatInterface';

// Media Query Hook
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="relative bg-[#0a192f]">
      {/* Header */}
      <motion.div
        animate={{
          width: isAssistantOpen && !isMobile ? 'calc(100% - 400px)' : '100%',
          opacity: isAssistantOpen && isMobile ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <Header />
      </motion.div>

      {/* Main Content Container */}
      <motion.div
        animate={{
          width: isAssistantOpen && !isMobile ? 'calc(100% - 400px)' : '100%',
          opacity: isAssistantOpen && isMobile ? 0 : 1,
          display: isAssistantOpen && isMobile ? 'none' : 'block',
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className="min-h-screen relative z-10"
      >
        <div className="max-w-screen-xl mx-auto">
          {children}
        </div>
      </motion.div>

      <AnimatePresence>
        {!isAssistantOpen && (
          <FloatingAssistant onOpen={() => setIsAssistantOpen(true)} />
        )}

        {/* Assistant Sidebar/Fullscreen */}
        {isAssistantOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className={`fixed top-0 right-0 h-screen bg-[#0a192f] border-l border-gray-700/50 z-50 
                       ${isMobile ? 'w-full' : 'w-[400px]'}`}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAssistantOpen(false)}
              className={`absolute p-2 rounded-full bg-[#0a192f] text-[#0a192f]
                         hover:bg-[#152238] transition-colors z-50 opacity-30
                         ${isMobile 
                           ? 'top-4 left-4' 
                           : 'top-8 left-[12rem]'}`}
            >
              <motion.span
                className="h-6 w-6 text-[#0a192f] opacity-20"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <SidebarCloseIcon 
                  color='#fff' 
                  size={30} 
                  className='opacity-30' 
                />
              </motion.span>
            </motion.button>

            {/* Mobile Header - Only shown on mobile */}
            {isMobile && (
              <div className="pt-16 pb-4 px-4 text-center border-b border-gray-700/50">
                <h2 className="text-[#5cbef8] font-mono text-lg">AI Assistant</h2>
              </div>
            )}

            {/* Chat Interface Container */}
            <div className={`h-full ${isMobile ? 'pt-4 w-full' : ''}`}>
              <ChatInterface />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background lines effect */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '100% 4px'
        }}
      />
    </div>
  );
};

export default AppLayout;