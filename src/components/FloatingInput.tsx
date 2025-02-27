'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import { useActions } from 'ai/rsc';

interface FloatingInputProps {
  onDisplayContent: (content: React.ReactNode) => void;
}

export const FloatingInput = ({ onDisplayContent }: FloatingInputProps) => {
  const { sendMessage } = useActions();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await sendMessage(inputText);
      onDisplayContent(response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
      setInputText('');
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-8 left-[35%] transform -translate-x-1/2 z-50 w-[90%] max-w-[600px]"
    >
      <div className="relative">
        {/* Input Container with new gradient background */}
        <div className="retro-card border border-purple-500/30 bg-gradient-to-r from-blue-900/90 via-[#0a192f]/95 to-blue-900/90 
                     backdrop-blur-sm rounded-lg p-4
                     shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]
                     transition-all duration-300">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about projects or technology metrics..."
              className="flex-1 bg-purple-900/30 rounded-lg px-4 py-3
                       border border-purple-500/30 focus:border-purple-400/50
                       focus:outline-none transition-colors text-white placeholder-white
                       font-mono"
              disabled={isProcessing}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={isProcessing}
              className="p-3 bg-purple-500/20 rounded-full text-purple-300
                       hover:bg-purple-500/30 transition-colors disabled:opacity-50
                       border border-purple-500/30"
            >
              {isProcessing ? 
                <Bot className="animate-pulse" /> : 
                <Send className="text-white" />
              }
            </motion.button>
          </div>
        </div>

        {/* Processing Indicator with new color scheme */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2
                       bg-gradient-to-r from-purple-900/90 to-[#0a192f]/95 
                       border border-purple-500/30 rounded-lg py-2 px-4
                       text-purple-300 text-sm flex items-center gap-2
                       shadow-[0_0_10px_rgba(168,85,247,0.15)]"
            >
              <Bot size={16} />
              <span className="font-mono">Processing your request...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};