'use client'
import { motion } from 'framer-motion';
import { Github, Linkedin, MessageCircle, Sparkles } from 'lucide-react'

const personalInfo = {
  name: "Angel Arrieta",
  title: "AI Product Engineer for Wellness Founders",
  bio: "I help wellness founders and growing teams build AI-powered apps, dashboards, voice interfaces, and automation workflows with React, Next.js, React Native, Node.js, and modern AI APIs.",
  photo: "https://res.cloudinary.com/dnmjmjdsj/image/upload/v1730585859/image/Screenshot_2024-11-02_at_5.14.48_PM_ynwltl.png",
  whatsapp: "https://wa.me/+573206456179?text=Hi%20Angel,%20I%20want%20to%20talk%20about%20an%20AI%20or%20wellness%20product.",
  linkedin: "https://www.linkedin.com/in/angel-mateus-arrieta-morelo-739623123/",
  github: "https://github.com/anuidev8"
};

export const Hero = () => {


  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  const experienceCounterVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    },
    hover: {
      y: [-5, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="retro-card retro-card-effect border border-gray-700/50 rounded-lg p-8 bg-[#0a192f]/80 backdrop-blur-sm relative mt-14"
    >
      {/* Experience Counter */}
      <motion.div
        variants={experienceCounterVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="absolute top-8 right-8 text-center"
      >
        <motion.div
          className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4"
          whileHover={{ 
            boxShadow: "0 0 20px rgba(92, 190, 248, 0.3)",
            borderColor: "rgba(92, 190, 248, 0.5)"
          }}
        >
          <motion.span 
            className="text-1xl font-bold text-[#5cbef8] font-mono"
            animate={{ 
              scale: [1, 1.1, 1],
              transition: { 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          >
            7+
          </motion.span>
          <motion.div className="text-xs text-gray-400 font-mono mt-1">
            Years of<br/>Experience
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
     
<motion.div
  variants={itemVariants}
  className="relative min-w-[240px]"
>
  <div className="relative">
    <div className="w-60 h-60 rounded-full p-2 bg-gradient-to-b from-[#5cbef8]/20 to-transparent">
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#5cbef8]/20">
        <img
          src={personalInfo.photo}
          alt="Angel Arrieta"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>

    <div className="absolute inset-0 rounded-full bg-[#5cbef8]/5 blur-xl -z-10" />
  </div>
</motion.div>

        <motion.div
          variants={itemVariants}
          className="flex-1"
        >
          <motion.div
            variants={itemVariants}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5cbef8]/30 bg-[#5cbef8]/10 px-3 py-1 text-sm text-[#5cbef8]"
          >
            <Sparkles className="h-4 w-4" />
            AI apps, voice interfaces, and wellness product systems
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 font-mono text-white leading-tight"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-blue-500"
            >
              &gt;{" "}
            </motion.span>
            I build AI-powered product experiences for wellness founders and growing teams.
          </motion.h1>

          <motion.h2 
            variants={itemVariants}
            className="text-xl text-[#5cbef8] mb-4 font-mono"
          >
            {personalInfo.name} · {personalInfo.title}
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-gray-300 leading-relaxed max-w-2xl mb-6"
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm"
          >
            {["7+ years shipping web/mobile products", "Breathwork, meditation, sleep, and fitness apps", "Realtime AI, automation, and product dashboards"].map((item) => (
              <div key={item} className="rounded-lg border border-gray-700/50 bg-gray-900/30 p-3 text-gray-300">
                {item}
              </div>
            ))}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(92, 190, 248, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              href={personalInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#5cbef8]/40 rounded-lg text-[#5cbef8] 
                         hover:bg-[#5cbef8]/10 transition-colors font-mono"
            >
              <MessageCircle className="h-4 w-4" />
              Start a project
            </motion.a>

            <motion.a
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="px-4 py-2 border border-gray-700/50 rounded-lg text-gray-300 
                         hover:text-white hover:border-gray-600 transition-colors font-mono"
            >
              See case studies
            </motion.a>

            <motion.a
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-700/50 rounded-lg text-gray-400 
                         hover:text-white hover:border-gray-600 transition-colors font-mono"
            >
              <Linkedin className="inline-block mr-2 h-4 w-4" />
              LinkedIn
            </motion.a>

            <motion.a
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-700/50 rounded-lg text-gray-400 
                         hover:text-white hover:border-gray-600 transition-colors font-mono"
            >
              <Github className="inline-block mr-2 h-4 w-4" />
              GitHub
            </motion.a>
          </motion.div>
        </motion.div>

     
      </div>
    </motion.section>
  );
};
