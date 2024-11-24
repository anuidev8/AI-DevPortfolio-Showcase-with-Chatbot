import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
export const AudioResponse = ({ isPlaying, isProcessing }: { isPlaying: boolean; isProcessing: boolean }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative mb-4">
        {/* Avatar Container */}
       
        <Player
        src={'/avatar.json'}
        autoplay
        loop
        speed={1}
      />
        {/* Processing/Speaking Glow Effect */}
        {(isPlaying || isProcessing) && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: isProcessing ? 1.5 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 rounded-full ${
              isProcessing ? 'bg-yellow-500/20' : 'bg-[#5cbef8]/20'
            }`}
          />
        )}
      </div>
  
      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 text-center"
      >
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-2">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-500 font-mono"
            >
              Processing your request...
            </motion.p>
            {/* Processing Dots */}
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 rounded-full bg-yellow-500"
                />
              ))}
            </div>
          </div>
        ) : isPlaying ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#5cbef8] font-mono"
          >
            Speaking...
          </motion.p>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 font-mono"
          >
            Waiting for your question...
          </motion.p>
        )}
      </motion.div>
  
      {/* Audio Waves */}
      <div className="flex items-center gap-1 h-12">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={isPlaying ? {
              height: ["15px", "40px", "15px"],
              backgroundColor: ["#5cbef8", "#63e6be", "#5cbef8"]
            } : isProcessing ? {
              height: ["15px", "25px", "15px"],
              backgroundColor: ["#eab308", "#fcd34d", "#eab308"]
            } : {
              height: "15px",
              backgroundColor: "#4a5568"
            }}
            transition={{
              duration: isProcessing ? 0.8 : 1,
              repeat: (isPlaying || isProcessing) ? Infinity : 0,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
            className="w-1.5 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );