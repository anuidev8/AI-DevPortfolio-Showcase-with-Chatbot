// components/Header.tsx
'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, Home, User, FileText, Bot, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Home', icon: <Home size={20} /> },
/*     { href: '/posts', label: 'Posts', icon: <FileText size={20} /> },
    { href: '/chat', label: 'Assistant', icon: <Bot size={20} /> }, */
  ];
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f] border-b border-gray-700"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-xl font-mono font-bold"
            >
              <span className="text-blue-500">&gt;_</span> <span className='text-white'>anuidev8</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  {item.icon}
                  <span className="font-mono">{item.label}</span>
                </motion.div>
              </Link>
            ))}
            
            {/* WhatsApp Contact Button */}
            <motion.a
              href="https://wa.me/+573206456179"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg text-white font-mono"
            >
              <MessageCircle size={20} />
              <span>Contact Me</span>
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          className={`md:hidden overflow-hidden ${isMenuOpen ? 'pb-4' : ''}`}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  {item.icon}
                  <span className="font-mono">{item.label}</span>
                </motion.div>
              </Link>
            ))}
            <motion.a
              href="https://wa.me/YourPhoneNumber"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg text-white font-mono"
            >
              <MessageCircle size={20} />
              <span>Contact Me</span>
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
      animate={{ opacity: 1 }}
      className="bg-[#0a192f] border-t border-gray-700 py-8 relative z-50"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-xl font-mono mb-4 text-white">
              <span className="text-blue-500">&gt;_</span> About
            </h3>
            <p className="text-gray-400">
              Building digital experiences with modern technologies.
              Let's create something amazing together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-mono mb-4 text-white">
              <span className="text-blue-500">&gt;_</span> Quick Links
            </h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className="text-gray-400 hover:text-white transition-colors inline-flex items-center space-x-2"
                    >
                      {item.icon}
                      <span className="font-mono">{item.label}</span>
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-mono mb-4 text-white">
              <span className="text-blue-500">&gt;_</span> Connect
            </h3>
            <motion.a
              href="https://wa.me/YourPhoneNumber"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg text-white font-mono mb-4"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </motion.a>
            <p className="text-gray-400 mt-4 font-mono">
              © {new Date().getFullYear()} Angel Arrieta<br />
              All rights reserved
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

