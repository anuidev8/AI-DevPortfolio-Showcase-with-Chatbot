'use client'
// components/ChatInterface.tsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  MessageSquare, Send, Volume2, AlertCircle } from 'lucide-react';
import { AudioResponse } from '@/components/assistant/AudioResponse';
import { chatWithAI } from '@/utils/api';

// Only adding these type definitions
type MessageType = 'user' | 'assistant' | 'error';

interface Message {
  content: string;
  type: MessageType;
}

export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);

      try {
        // Get text response from API utility
        const result = await chatWithAI(inputText);

        // Check for API error
        if (result.error) {
          setMessages([
            ...newMessages,
            { content: 'Something went wrong. Please try again.', type: 'error' }
          ]);
          setIsLoading(false);
          return;
        }

        const answer = result.data?.answer;
        if (!answer) {
          setMessages([
            ...newMessages,
            { content: 'Something went wrong. Please try again.', type: 'error' }
          ]);
          setIsLoading(false);
          return;
        }

        if (responseMode === 'text') {
          setMessages([...newMessages, { content: answer, type: 'assistant' }]);
          setIsLoading(false);
        } else {
          // Audio mode
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
                  text: answer,
                  voice_settings: {
                    stability: 0.7,
                    similarity_boost: 0.7,
                  },
                }),
              }
            );

            if (!audioResponse.ok) {
              // Fallback to text if audio fails
              setMessages([...newMessages, { content: answer, type: 'assistant' }]);
              setIsLoading(false);
              return;
            }

            const audioBlob = await audioResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            setMessages([...newMessages, { content: answer, type: 'assistant' }]);
            setIsLoading(false);
            setIsPlaying(true);

            audio.onended = () => {
              setIsPlaying(false);
              URL.revokeObjectURL(audioUrl);
            };

            await audio.play();
          } catch (error) {
            console.error('Audio conversion error:', error);
            // Fallback to text
            setMessages([...newMessages, { content: answer, type: 'assistant' }]);
            setIsLoading(false);
            setIsPlaying(false);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages([
          ...newMessages,
          { content: 'Something went wrong. Please try again.', type: 'error' }
        ]);
        setIsLoading(false);
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
                      isProcessing={isLoading}
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
                          className={`max-w-[80%] rounded-lg p-4 flex items-start gap-2 ${
                            message.type === 'user'
                              ? 'bg-[#5cbef8]/20'
                              : message.type === 'error'
                              ? 'bg-red-900/20 border border-red-500/30'
                              : 'bg-gray-800/50'
                          }`}
                        >
                          {message.type === 'error' && (
                            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <p className={message.type === 'error' ? 'text-red-200' : 'text-white'}>
                            {message.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                            </div>
                            <span className="text-gray-400 text-sm">Thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
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
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isLoading}
                className={`flex-1 bg-gray-800/50 rounded-lg px-4 py-2
                         border border-gray-700/50 focus:border-[#5cbef8]/50
                         focus:outline-none transition-colors
                         ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-800/20' : ''}`}
              />
              <motion.button
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                onClick={handleSendMessage}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors
                         ${isLoading
                           ? 'bg-gray-700/20 text-gray-500 cursor-not-allowed opacity-50'
                           : 'bg-[#5cbef8]/20 text-[#5cbef8] hover:bg-[#5cbef8]/30'}`}
              >
                <Send size={24} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
     
     
    );
  };
  