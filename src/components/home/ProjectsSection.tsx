'use client'

import { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Github, ExternalLink, Search,  } from 'lucide-react';
import { NotionProject } from '@/types/project.types';



// Types for projects
interface ProjectsSectionProps {
  projects: NotionProject[];
}
  // Categories for filtering
  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'Mobile'];
export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
   console.log(projects);
   
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6; // Number of projects per page

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category.name.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.techs.some(tech => 
        tech.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
        <Terminal className="text-[#5cbef8]" />
        Featured_Projects
      </h2>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFilter(category.toLowerCase());
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-mono text-sm
                ${filter === category.toLowerCase()
                  ? 'bg-[#5cbef8]/20 text-[#5cbef8] border border-[#5cbef8]/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-[#5cbef8]/30'}
              `}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 pl-10
                     focus:outline-none focus:border-[#5cbef8]/50 font-mono text-sm w-full md:w-64"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='wait'>
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.id}
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
               <span className='text-white'> {project.title}</span>
              </h5>
              <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techs.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-800/50 rounded text-xs font-mono text-gray-300"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={project.github}
                  className="text-gray-400 hover:text-[#5cbef8]"
                >
                  <Github size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={project.live}
                  className="text-gray-400 hover:text-[#5cbef8]"
                >
                  <ExternalLink size={20} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg font-mono text-sm
                ${currentPage === i + 1
                  ? 'bg-[#5cbef8]/20 text-[#5cbef8] border border-[#5cbef8]/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-[#5cbef8]/30'}
              `}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {currentProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 py-12"
        >
          <p className="font-mono">No projects found matching your criteria</p>
        </motion.div>
      )}
    </motion.section>
  );
};



