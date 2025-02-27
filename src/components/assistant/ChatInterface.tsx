'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import { useActions } from 'ai/rsc';
import { Message } from '../message';


interface ChatInterfaceProps {
  onDisplayContent: (content: React.ReactNode) => void;
}

export const ChatInterface = ({ onDisplayContent }: ChatInterfaceProps) => {
  const { sendMessage } = useActions();
  const [messages, setMessages] = useState<Array<React.ReactNode>>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;
  
    setIsProcessing(true);
    
    // Only add user message to chat
    setMessages((prev) => [
      ...prev,
      <Message key={prev.length} role="user" content={inputText} />
    ]);
  
    try {
      const response = await sendMessage(inputText);
      // Instead of adding to messages, send to main content
      onDisplayContent(response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
    
    setInputText('');
  };

  return (
    <div className="h-full flex flex-col bg-[#0a192f] text-white w-[500px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="retro-card border border-gray-700/50 rounded-lg p-6 bg-[#0a192f]/80"
          >
            <div className="flex items-start gap-4">
              <Bot className="text-[#5cbef8] mt-1" size={24} />
              <div>
                <h3 className="text-[#5cbef8] font-mono mb-2">Welcome! Ask me about:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-[#5cbef8]">›</span>
                    Projects and their details
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#5cbef8]">›</span>
                    Technology usage metrics
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {message}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-gray-400"
          >
            <Bot size={24} className="text-[#5cbef8]" />
            <div className="flex items-center gap-2">
              <span className="text-sm">Processing</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-[#5cbef8]"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about projects or technology metrics..."
            className="flex-1 bg-gray-800/50 rounded-lg px-4 py-2
                     border border-gray-700/50 focus:border-[#5cbef8]/50
                     focus:outline-none transition-colors"
            disabled={isProcessing}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={isProcessing}
            className="p-2 bg-[#5cbef8]/20 rounded-full text-[#5cbef8]
                     hover:bg-[#5cbef8]/30 transition-colors"
          >
            <Send size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};