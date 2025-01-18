'use client'
import { skills } from '@/mocks/skills__mock';
import { motion} from 'framer-motion';
import { Cpu } from 'lucide-react';
export const TechsSection = () =>{
    return (
        <>
             {/* Technologies Section */}
             <motion.section
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-8"
           >
             <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
               <Cpu className="text-blue-500" />
               Skills_&_Technologies
             </h2>
   
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {skills.map((category, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: index * 0.1 }}
                   className="retro-card border border-gray-700/50 rounded-lg p-6 bg-[#0a192f]/80 backdrop-blur-sm
                              hover:border-blue-500/50 transition-all duration-300"
                 >
                   <h3 className="text-xl font-mono mb-4 text-blue-500">
                     {category.category}_
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {category.items.map((item, i) => (
                       <motion.span
                         key={i}
                         whileHover={{ scale: 1.1 }}
                         className="px-3 py-1 bg-gray-800/50 rounded-full text-sm font-mono text-gray-300
                                   hover:bg-blue-500/20 transition-colors"
                       >
                         {item}
                       </motion.span>
                     ))}
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.section>
           </>
    )
}