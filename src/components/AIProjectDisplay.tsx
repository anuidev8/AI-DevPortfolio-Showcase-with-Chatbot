// components/AIProjectDisplay.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Github, ExternalLink } from 'lucide-react';

export const AIProjectDisplay = ({ category }: { category: string }) => {
  // Using the same project card structure as ProjectsSection
  const projects = [
    {
      title: `${category} Project`,
      description: "An AI-generated project based on Angel's expertise and tech stack.",
      techs: [
        { id: "1", name: "React", color: "blue" },
        { id: "2", name: "TypeScript", color: "blue" },
        { id: "3", name: "Next.js", color: "blue" }
      ],
      featured: true,
      category: { name: category, color: "blue" },
    },
    // Add more generated projects as needed
  ];

  return (
    <div className="w-full max-w-[500px] space-y-6">
      <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
        <Terminal className="text-[#5cbef8]" />
        AI_Generated_Projects
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode='wait'>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="retro-card border border-gray-700/50 rounded-lg p-6 bg-[#0a192f]/80 backdrop-blur-sm
                       hover:border-[#5cbef8]/50 transition-all duration-300"
            >
              {project.featured && (
                <div className="text-xs text-[#5cbef8] font-mono mb-2">Featured Project</div>
              )}
              
              <h5 className="text-xl font-bold mb-2 font-mono">
                <span className="text-[#5cbef8]">&gt; </span>
                <span className='text-white'>{project.title}</span>
              </h5>
              
              <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techs.map((tech) => (
                  <span
                    key={tech.id}
                    className="px-2 py-1 bg-gray-800/50 rounded text-xs font-mono text-gray-300"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-[#5cbef8]"
                >
                  <Github size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-[#5cbef8]"
                >
                  <ExternalLink size={20} />
                </motion.button>
              </div>

              {/* AI Generated Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <span className="text-xs text-gray-400 font-mono">
                  AI Generated Based on Portfolio
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};