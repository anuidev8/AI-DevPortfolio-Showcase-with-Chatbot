'use client'
// components/CodeSnippetsSection.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Search, Github } from 'lucide-react';

interface CodeSnippet {
  id: number;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  link:string;
}

export const CodeSnippetsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const snippetsPerPage = 3;

  // Sample snippets data
  const allSnippets: CodeSnippet[] = [
    {
      id: 1,
      title: "Copilot Chat for React Front-End",
      description: "Copilot Chat for React Front-End Development: Slash Commands vs Natural Language",
      code: `## Key Differences in React Front-End Context

      | Aspect | Slash Commands | Natural Language |
      |--------|----------------|-------------------|
      | Speed | ✅ Faster for common React tasks | ❌ May require more typing |
      | Depth | ❌ Limited to predefined actions | ✅ Can ask for detailed React-specific explanations |
      | Learning React | ❌ Less educational | ✅ Can ask for explanations of React concepts |
      | Customization | ❌ Fixed output | ✅ Can request specific React patterns or best practices |
      | Context | ❌ Might miss component-specific details | ✅ Can consider the entire component context |;
};`,
      language: "notesbook",
      category: "AI",
      link:'https://github.com/anuidev8/frontend-copilot-commands/blob/main/copilot-chat-slash-commands.md'
    },
   
    // Add more snippets...
  ];

  // Categories for filtering
  const categories = ['All', 'React', 'TypeScript', 'Node.js', 'Utils','AI'];

  // Filter and search snippets
  const filteredSnippets = useMemo(() => {
    return allSnippets.filter(snippet => {
      const matchesFilter = filter === 'all' || snippet.category.toLowerCase() === filter.toLowerCase();
      const matchesSearch = 
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredSnippets.length / snippetsPerPage);
  const currentSnippets = filteredSnippets.slice(
    (currentPage - 1) * snippetsPerPage,
    currentPage * snippetsPerPage
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
        <Code2 className="text-[#5cbef8]" />
        Code_Snippets
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
            placeholder="Search snippets..."
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

      {/* Snippets List */}
      <div className="space-y-6">
        <AnimatePresence mode='wait'>
          {currentSnippets.map((snippet) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="retro-card border border-gray-700/50 rounded-lg overflow-hidden
                       bg-[#0a192f]/80 backdrop-blur-sm
                       hover:border-[#5cbef8]/50 transition-all duration-300"
            >
              <div className="bg-gray-800/50 p-4 flex justify-between items-center">
                <h3 className="font-mono text-white">
                  <span className="text-[#5cbef8]">&gt; </span>
                  {snippet.title}
                </h3>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={snippet.link}
                  className="text-gray-400 hover:text-[#5cbef8]"
                >
                  <Github size={20} />
                </motion.a>
                
              </div>
              <pre className="p-4 bg-gray-900/50 overflow-x-auto">
                <code className="text-sm font-mono text-gray-300">
                  {snippet.code}
                </code>
              </pre>
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
      {currentSnippets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 py-12"
        >
          <p className="font-mono">No code snippets found matching your criteria</p>
        </motion.div>
      )}
    </motion.section>
  );
};

