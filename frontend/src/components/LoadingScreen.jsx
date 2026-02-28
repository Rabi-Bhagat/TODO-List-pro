import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, Sparkles } from 'lucide-react';

const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState('Initializing Workspace');
  
  useEffect(() => {
    const texts = [
      'Loading your tasks...',
      'Syncing with agile workflow...',
      'Preparing your momentum...',
      'Opening ToDo Pro...'
    ];
    let i = 0;
    const intervalId = setInterval(() => {
      setLoadingText(texts[i]);
      i = (i + 1) % texts.length;
    }, 1500);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0c] overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full animate-pulse-slow mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full animate-pulse-slow mix-blend-screen pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/[0.03] to-transparent opacity-50 pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 flex flex-col items-center gap-8 p-12 glass rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl group"
      >
        {/* Interactive Logo Area */}
        <div className="relative">
          {/* Animated rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border border-indigo-500/20 border-t-indigo-500/60 transition-all duration-300 group-hover:scale-110"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-[-35px] rounded-full border border-blue-500/10 border-b-blue-500/40 transition-all duration-300 group-hover:scale-125"
          />
          
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative bg-gradient-to-tr from-indigo-600/20 to-blue-500/20 p-5 rounded-2xl shadow-lg shadow-indigo-500/10 border border-indigo-500/30 text-indigo-400 group flex items-center justify-center cursor-default z-10 backdrop-blur-md"
          >
            <ListTodo size={40} className="relative z-10 group-hover:text-white transition-colors duration-300" />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-md -z-10"
            />
            
            {/* Sparkles on hover container */}
            <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
               <Sparkles size={12} className="text-blue-300 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-3">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-gray-400 m-0 tracking-tight"
          >
            ToDo Pro
          </motion.h1>
          
          <div className="h-6 relative w-48 flex justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingText}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-bold text-indigo-300/60 uppercase tracking-widest absolute text-center w-full"
              >
                {loadingText}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Indication */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
