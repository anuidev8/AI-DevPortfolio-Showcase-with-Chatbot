// pages/about.tsx
'use client'
import { motion } from 'framer-motion';
import { Terminal, Code2, Cpu, Github, ExternalLink } from 'lucide-react';
import { Hero } from './HeroSection';
import { ProjectsSection } from './ProjectsSection';
import { CodeSnippetsSection } from './SnnipedGitHub';

export const About = () => {
  // Personal info section data
  const personalInfo = {
    name: "Your Name",
    title: "Senior Software Engineer",
    location: "City, Country",
    email: "your.email@example.com",
    bio: "Passionate software engineer with 5+ years of experience building scalable web applications. Focused on creating elegant solutions to complex problems."
  };

  // Projects data
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Full-stack shopping platform with real-time inventory management and payment processing.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      github: "https://github.com/yourusername/project",
      live: "https://project.com"
    },
    {
      title: "Portfolio Assistant",
      description: "AI-powered chatbot for portfolio interaction using GPT-3 and voice recognition.",
      tech: ["Next.js", "OpenAI", "TailwindCSS", "TypeScript"],
      github: "https://github.com/yourusername/project",
      live: "https://project.com"
    },
    // Add more projects as needed
  ];

  // GitHub snippets data
  const githubSnippets = [
    {
      title: "Custom React Hook",
      description: "A reusable hook for handling API requests",
      code: `const useAPI = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
};`
    },
    // Add more snippets
  ];

  // Skills data
  const skills = [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Python", "Express", "PostgreSQL", "MongoDB"]
    },
    {
      category: "DevOps",
      items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Git"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f]">
      {/* Grid Background */}
      {/* Updated Grid Background with blue effect and glow */}
      <div className="fixed inset-0">
  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent mix-blend-multiply" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a192f_70%)] opacity-60" />
  <div className="absolute inset-0 grid-glow" />
</div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
      <Hero />

        {/* Projects Section */}
        <ProjectsSection />

        {/* GitHub Snippets Section */}
       <CodeSnippetsSection />

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};
