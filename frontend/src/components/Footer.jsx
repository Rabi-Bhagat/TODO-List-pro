import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto relative z-50 pt-24 pb-8 px-6 overflow-hidden">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-t-full" />

      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-6 relative z-10">
        
        {/* Main Branding & Made By */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-indigo-100"
        >
          <span>Crafted with</span>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-red-500 hidden sm:block"
          >
            <Heart size={18} fill="currentColor" />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-red-500 sm:hidden"
          >
            <Heart size={16} fill="currentColor" />
          </motion.div>
          <span>by</span>
          <a 
            href="https://rabibhagat.com.np" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-500/10"
          >
            Rabi Bhagat
            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 translate-x-1 group-hover:translate-x-0 group-hover:translate-y-0" />
            
            {/* Hover Underline Effect */}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300 ease-out rounded-full" />
          </a>
        </motion.div>

        {/* Social Links / Secondary Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          {[
            { icon: <Globe size={18} />, href: "https://rabibhagat.com.np", label: "Portfolio" },
          ].map((link, i) => (
             <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-indigo-200 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              {link.icon}
            </a>
          ))}
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
