'use client'
// components/ChatInterface.tsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  MessageSquare, Send, Volume2 } from 'lucide-react';
import { AudioResponse } from '@/components/assistant/AudioResponse';
// Only adding these type definitions
type MessageType = 'user' | 'assistant';

interface Message {
  content: string;
  type: MessageType;
}
export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [responseMode, setResponseMode] = useState<'audio' | 'text'>('text');
  
    const handleSendMessage = async () => {
      if (!inputText.trim()) return;
  
      // Type-safe message creation
    const userMessage: Message = {
      content: inputText,
      type: 'user'
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsProcessing(true);
  
      try {
        // Get text response from backend
        const response = await fetch('https://portfolio-chatbot-mauve.vercel.app/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: inputText }),
        });
  
        const data = await response.json();
  
        if (responseMode === 'text') {
          setMessages([...newMessages, { content: data.answer, type: 'assistant' }]);
        } else {
      
          try {
            const audioResponse = await fetch(
              'https://api.elevenlabs.io/v1/text-to-speech/XZLYuvSROjlj7EO2DLvW',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!,
                },
                body: JSON.stringify({
                  text: data.answer,
                  voice_settings: {
                    stability: 0.7,
                    similarity_boost: 0.7,
                  },
                }),
              }
            );
  
            const audioBlob = await audioResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
  
            setIsProcessing(false);
            setIsPlaying(true);
  
            audio.onended = () => {
              setIsPlaying(false);
              URL.revokeObjectURL(audioUrl);
            };
  
            await audio.play();
          } catch (error) {
            console.error('Audio conversion error:', error);
            setIsPlaying(false);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        if (responseMode === 'text') {
          setIsProcessing(false);
        }
      }
    };
  
    return (
  
             
      <div className="min-h-screen bg-[#0a192f] text-white p-4 w-[400px] w-full">
        <div className="max-w-4xl mx-auto h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-700/50 rounded-lg p-6 min-h-[600px] flex flex-col"
          >
            {/* Mode Toggle */}
            <div className="flex justify-end mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setResponseMode(prev => prev === 'audio' ? 'text' : 'audio')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${responseMode === 'audio' 
                    ? 'bg-[#5cbef8]/20 text-[#5cbef8] border border-[#5cbef8]/50' 
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'}`}
              >
                {responseMode === 'audio' ? (
                  <>
                    <Volume2 size={20} />
                    <span className="text-sm font-mono">Audio Response</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={20} />
                    <span className="text-sm font-mono">Text Response</span>
                  </>
                )}
              </motion.button>
            </div>
  
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {responseMode === 'audio' ? (
                // Audio Mode Layout
                <div className="flex-1 flex flex-col">
                  {/* Centered Avatar and Waves */}
     
                  <div className="flex-1 flex items-center justify-center">
                    <AudioResponse 
                      isPlaying={isPlaying} 
                      isProcessing={isProcessing}
                    />
                  </div>
                  
                  {/* Previous Questions Display */}
                  <div className="h-32 overflow-y-auto mb-4 border-t border-gray-700/50 pt-4">
                    <div className="space-y-2">
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-gray-400 text-sm"
                        >
                          {message.content}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Text Mode Layout
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-[#5cbef8]/20'
                              : 'bg-gray-800/50'
                          }`}
                        >
                          <p className="text-white">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
  
            {/* Input Area - Always at Bottom */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/50 rounded-lg px-4 py-2
                         border border-gray-700/50 focus:border-[#5cbef8]/50
                         focus:outline-none transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="p-2 bg-[#5cbef8]/20 rounded-full text-[#5cbef8]
                         hover:bg-[#5cbef8]/30 transition-colors"
              >
                <Send size={24} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
     
     
    );
  };
  