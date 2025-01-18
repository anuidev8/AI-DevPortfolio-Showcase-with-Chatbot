'use client'
import { motion } from 'framer-motion';
import { Code2, Layout, PhoneCall, Terminal} from 'lucide-react';

const services = [
  {
    title: "I will build responsive and interactive web layouts",
    description: "Create modern, user-friendly web layouts that adapt perfectly to all devices. Using the latest technologies to ensure your website is both beautiful and functional.",
    icon: <Layout className="w-6 h-6 text-[#5cbef8]" />,
    features: [
      "Responsive design for all devices",
      "Interactive UI elements",
      "Modern web technologies",
      "SEO-friendly structure"
    ]
  },
  {
    title: "I will add CSS animations to your website",
    description: "Enhance your website with smooth, engaging animations that improve user experience and bring your interface to life.",
    icon: <Code2 className="w-6 h-6 text-[#5cbef8]" />,
    features: [
      "Custom CSS animations",
      "Interactive effects",
      "Performance optimization",
      "Cross-browser compatibility"
    ]
  }
];

export const ServicesSection = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/3137020974?text=Hi, I am interested in your services!', '_blank');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
           <h2 className="text-3xl font-mono text-white mb-8 flex items-center gap-3">
           <Terminal className="text-[#5cbef8]" />
        Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="retro-card border border-gray-700/50 rounded-lg p-8 bg-[#0a192f]/80 backdrop-blur-sm
                     hover:border-[#5cbef8]/50 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="absolute inset-0" 
                   style={{
                     backgroundImage: 'linear-gradient(to right, #5cbef8 1px, transparent 1px), linear-gradient(to bottom, #5cbef8 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                   }}
              />
            </div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-6">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl text-white font-bold mb-4 font-mono">
                <span className="text-[#5cbef8]">&gt; </span>
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + i * 0.1 }}
                    className="flex items-center text-gray-400"
                  >
                    <span className="text-[#5cbef8] mr-2">›</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* WhatsApp CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsAppClick}
          className="flex items-center gap-3 px-8 py-4 bg-green-500 rounded-lg text-white font-mono
                   hover:bg-green-600 transition-colors group relative overflow-hidden"
        >
          <PhoneCall className="w-6 h-6" />
          <span className="relative z-10">Let's discuss your project</span>
          {/* Button Glow Effect */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
               style={{
                 background: 'radial-gradient(circle at center, white 0%, transparent 70%)'
               }}
          />
        </motion.button>
      </motion.div>
    </motion.section>
  );
};