// pages/index.tsx
'use client'
import { useState } from 'react';
import { Mic, MessageSquare, Send, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HomeSection = () => {
  const [mode, setMode] = useState<'voice' | 'chat'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<Array<{text: string, isPlaying: boolean}>>([]);
  const [currentAudio, setCurrentAudio] = useState<number | null>(null);

  const simulateResponse = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newResponse = {
      text: "Experience: 5 years as Full Stack Developer, specialized in React and Node.js, with expertise in building scalable web applications and cloud architecture.",
      isPlaying: false
    };
    setResponses(prev => [newResponse, ...prev]);
    setIsLoading(false);
  };

  const toggleAudioPlay = (index: number) => {
    setCurrentAudio(currentAudio === index ? null : index);
    setResponses(responses.map((response, i) => ({
      ...response,
      isPlaying: i === index && !response.isPlaying
    })));
  };

  const handleSubmit = () => {
    if (inputText.trim() || isRecording) {
      simulateResponse();
      setInputText('');
    }
  };

  // Animation variants remain the same
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const loadingVariants = {
    initial: {
      scale: 0.8,
      opacity: 0.5
    },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        repeat: Infinity,
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a192f] text-white p-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="p-6 rounded-lg border border-gray-700"
        >
          {/* Header with mode toggle buttons */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Portfolio Assistant with {mode === 'voice' ? 'voice' : 'chat'}
            </h2>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode('voice')}
                className={`p-4 rounded-full ${mode === 'voice' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                <Mic size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode('chat')}
                className={`p-4 rounded-full ${mode === 'chat' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                <MessageSquare size={24} />
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'voice' ? (
              // Voice Mode - Two Column Layout
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-8"
              >
                {/* Left Column - Voice Input */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex flex-col items-center justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseDown={() => setIsRecording(true)}
                    onMouseUp={() => {
                      setIsRecording(false);
                      handleSubmit();
                    }}
                    className="relative w-48 h-48 cursor-pointer mb-6"
                  >
                    <motion.div
                      animate={isRecording ? {
                        scale: [1, 1.1, 1],
                        transition: { duration: 1.5, repeat: Infinity }
                      } : {}}
                      className="absolute inset-0 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                    >
                      <motion.div
                        animate={isRecording ? {
                          scale: [1, 1.15, 1],
                          transition: { duration: 1.5, repeat: Infinity, delay: 0.2 }
                        } : {}}
                        className="w-40 h-40 rounded-full bg-white bg-opacity-30 flex items-center justify-center"
                      >
                        <motion.div
                          animate={isRecording ? {
                            scale: [1, 1.2, 1],
                            transition: { duration: 1.5, repeat: Infinity, delay: 0.4 }
                          } : {}}
                          className="w-32 h-32 rounded-full bg-white bg-opacity-40 flex items-center justify-center"
                        >
                          <span className="text-xl font-bold">VOICE</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <p className="text-sm text-gray-400">
                    {isRecording ? 'Listening...' : 'Hold to speak'}
                  </p>
                </motion.div>

                {/* Right Column - Responses */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              variants={loadingVariants}
                              initial="initial"
                              animate="animate"
                              style={{ animationDelay: `${i * 0.15}s` }}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                            />
                          ))}
                        </div>
                        <p className="text-gray-400">AI is thinking...</p>
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {responses.map((response, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-gray-300 flex-1">{response.text}</p>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleAudioPlay(index)}
                            className={`ml-4 p-2 rounded-full ${response.isPlaying ? 'bg-blue-600' : 'bg-gray-700'}`}
                          >
                            <Volume2 size={20} />
                          </motion.button>
                        </div>
                        {response.isPlaying && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden"
                          >
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 3 }}
                              className="h-full bg-blue-500"
                              onAnimationComplete={() => toggleAudioPlay(index)}
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              // Chat Mode (remaining the same as before)
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col"
              >
                {/* Chat interface code remains the same */}
                <div className="flex gap-2">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSubmit}
                    className="p-2 bg-blue-600 rounded-full"
                  >
                    <Send size={24} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

