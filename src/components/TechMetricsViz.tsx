// components/TechMetricsView.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { scaleLinear } from 'd3-scale';
import { Terminal } from 'lucide-react';

interface TechMetric {
  name: string;
  level: number;
}

export const TechMetricsView = ({ metrics }: { metrics: TechMetric[] }) => {
  const scale = scaleLinear()
    .domain([0, 100])
    .range([0, 100]);

  return (
    <div className="w-[100%]  space-y-6 ">
      <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
        <Terminal className="text-[#5cbef8]" />
        Tech_Metrics
      </h2>

      <div className="space-y-4 grid grid-cols-4 gap-4 w-[100%]">
        {metrics.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="retro-card border border-gray-700/50 rounded-lg p-4 bg-[#0a192f]/80 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#5cbef8] font-mono">{tech.name}</span>
              <span className="text-gray-400 font-mono">{tech.level}%</span>
            </div>
            
            <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scale(tech.level)}%` }}
                className="absolute h-full bg-[#5cbef8]/50 rounded-full"
              />
              
              {/* Glow effect */}
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#5cbef8]"
                style={{ width: '4px' }}
                animate={{
                  x: [0, `${scale(tech.level)}%`, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};