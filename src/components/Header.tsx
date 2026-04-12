// components/Header.tsx
'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '#services', label: 'Services' },
  { href: '#plans', label: 'Plans' },
  { href: '#process', label: 'Process' },
  { href: '#results', label: 'Results' },
  { href: '#about', label: 'About' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#010102]/80 backdrop-blur-md border-b border-white/10 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-xl font-mono font-bold flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C58BC] to-[#9C6487] flex items-center justify-center text-white text-xs">
                AA
              </div>
              <span className='text-white tracking-widest'>Angel Arrieta</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 transition-all"
              >
                {item.label}
              </a>
            ))}
            
            {/* CTA Button */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(28,88,188,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#1C58BC] to-[#9C6487] rounded-full text-white text-sm font-medium transition-all"
            >
              <span>Book Strategy Call</span>
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          className={`md:hidden overflow-hidden ${isMenuOpen ? 'pt-6 pb-4' : ''}`}
        >
          <div className="flex flex-col space-y-4 bg-[#0a101d] p-6 rounded-2xl border border-white/10 mt-2">
            {navItems.map((item) => (
              <a 
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                {item.label}
              </a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center items-center space-x-2 w-full mt-4 py-3 bg-gradient-to-r from-[#1C58BC] to-[#9C6487] rounded-xl text-white font-medium"
            >
              <span>Book Strategy Call</span>
              <ArrowRight size={18} />
            </motion.a>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
};

// components/Footer.tsx
export const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-[#010102] border-t border-white/10 py-16 relative z-50"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="text-xl font-mono font-bold flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C58BC] to-[#9C6487] flex items-center justify-center text-white text-xs">
                AA
              </div>
              <span className='text-white tracking-widest'>Angel Arrieta</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
              Empowering business owners to build custom AI tools and automate workflows without the overhead of a traditional dev team.
            </p>
            <a href="mailto:contact@angelarrieta.com" className="text-gray-400 hover:text-white transition-colors">
              contact@angelarrieta.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Navigation</h3>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Social Placeholder */}
          <div>
            <h3 className="text-white font-bold mb-6">Connect</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1C58BC] transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/anuidev8" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://wa.me/+573206456179" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Angel Arrieta. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

