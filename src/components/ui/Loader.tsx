'use client'
import { motion } from 'framer-motion';
export const RetroLoader = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {/* Retro Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a192f] border border-[#5cbef8]/30 rounded-lg p-6 max-w-md w-full"
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-4 border-b border-[#5cbef8]/20 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <span className="text-[#5cbef8] font-mono text-sm ml-2">loading.exe</span>
          </div>
  
          {/* Loading Text */}
          <div className="font-mono text-[#5cbef8] mb-4">
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="flex items-center"
            >
              <span className="text-green-400 mr-2">&gt;</span>
              <span>Fetching data...</span>
              <span className="ml-1">_</span>
            </motion.div>
          </div>
  
          {/* Loading Progress */}
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
                className="h-1 bg-[#5cbef8]/30 rounded"
              >
                <motion.div
                  className="h-full bg-[#5cbef8] rounded"
                  animate={{
                    opacity: [1, 0.5],
                    width: ["0%", "100%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            ))}
          </div>
  
          {/* Loading Stats */}
          <div className="mt-4 text-xs font-mono text-gray-400 space-y-1">
            <motion.div
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              <span className="text-[#5cbef8]">&gt;</span> Initializing connection...
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
            >
              <span className="text-[#5cbef8]">&gt;</span> Reading database...
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
            >
              <span className="text-[#5cbef8]">&gt;</span> Processing projects...
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };
  