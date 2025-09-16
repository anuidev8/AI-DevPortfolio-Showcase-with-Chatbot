// Hero section with Framer Motion animations
'use client'
import { motion } from 'framer-motion';
import { Github } from 'lucide-react'

  
  // Update your personalInfo const to include the photo
  const personalInfo = {
    name: "Hi,I'm Angel Arrieta",
    title: "Web Developer & UI Specialist",
    bio: "Web developer with 7+ years of experience building dynamic, user-friendly, and high-performance web and mobile applications. Specialized in React, Next.js, Node.js, and automation workflows. Skilled in creating engaging UI/UX with animations, integrating analytics and marketing tools, and delivering maintainable, scalable solutions. Passionate about AI integration, real-time apps, and open-source contributions.",
    photo: "/your-photo.jpg" // Add your photo path
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

  const photoVariants = {
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
      scale: 1.05,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.4
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
     
         {/* Profile Image Section - Simplified circular design */}
<motion.div
  variants={itemVariants}
  className="relative min-w-[240px]" // Added min-width for better spacing
>
  <div className="relative">
    {/* Main circular image container */}
    <div className="w-60 h-60 rounded-full p-2 bg-gradient-to-b from-[#5cbef8]/20 to-transparent">
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#5cbef8]/20">
        <img
          src="https://res.cloudinary.com/dnmjmjdsj/image/upload/v1730585859/image/Screenshot_2024-11-02_at_5.14.48_PM_ynwltl.png" // Replace with your photo path
          alt="Angel Arrieta"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>

    {/* Subtle glow effect */}
    <div className="absolute inset-0 rounded-full bg-[#5cbef8]/5 blur-xl -z-10" />
  </div>
</motion.div>
        {/* Text Content */}
        <motion.div
          variants={itemVariants}
          className="flex-1"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold mb-2 font-mono"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-blue-500"
            >
              &gt;{" "}
            </motion.span>
          <span className='text-white'>{personalInfo.name}</span> 
          </motion.h1>

          <motion.h2 
            variants={itemVariants}
            className="text-xl text-gray-400 mb-6 font-mono"
          >
             <motion.h2 
            variants={itemVariants}
            className="text-xl text-white font-mono"
          >
          Let's Build Something Exceptional Together
          </motion.h2>
          </motion.h2>
          <motion.h2 
            variants={itemVariants}
            className="text-xl text-gray-400 mb-6 font-mono"
          >
            {personalInfo.title}
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-gray-300 leading-relaxed max-w-2xl mb-6"
          >
        Web developer with 7+ years of experience building dynamic, user-friendly, and high-performance web and mobile applications. Specialized in React, Next.js, Node.js, and automation workflows. Skilled in creating engaging UI/UX with animations, integrating analytics and marketing tools, and delivering maintainable, scalable solutions. Passionate about AI integration, real-time apps, and open-source contributions.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex gap-4"
          >
            <motion.a
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(92, 190, 248, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="px-4 py-2 border border-[#5cbef8]/20 rounded-lg text-[#5cbef8] 
                         hover:bg-[#5cbef8]/10 transition-colors font-mono"
            >
              View Projects
            </motion.a>

            <motion.a
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/anuidev8"
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

