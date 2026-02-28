import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Flag, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return {
      min: minutes.toString().padStart(2, '0'),
      sec: seconds.toString().padStart(2, '0'),
      ms: hundredths.toString().padStart(2, '0')
    };
  };

  const timeParts = formatTime(time);

  const handleLap = () => {
    setLaps([{ id: Date.now(), time }, ...laps]);
  };

  const reset = () => {
    setTime(0);
    setRunning(false);
    setLaps([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-lg mx-auto p-6 sm:p-10 border-white/10"
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2.5 rounded-xl text-indigo-400">
            <Timer size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none">Stopwatch</h3>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1.5 opacity-60">Precision Timing</p>
          </div>
        </div>
        {running && (
           <motion.div 
             animate={{ opacity: [0.3, 1, 0.3] }} 
             transition={{ duration: 1.5, repeat: Infinity }}
             className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20"
           >
             <Activity size={12} /> Active
           </motion.div>
        )}
      </div>

      {/* Main Display */}
      <div className="flex flex-col items-center justify-center py-6 sm:py-8 mb-8 sm:mb-10 relative">
        <div className="absolute inset-0 bg-indigo-600/5 blur-[80px] rounded-full" />
        <div className="flex items-baseline gap-1 sm:gap-2 relative z-10 font-[700] tracking-tighter">
          <div className="text-6xl sm:text-7xl md:text-8xl text-white">{timeParts.min}</div>
          <div className="text-3xl sm:text-4xl text-white/20">:</div>
          <div className="text-6xl sm:text-7xl md:text-8xl text-white">{timeParts.sec}</div>
          <div className="text-2xl sm:text-3xl md:text-4xl text-indigo-500 ml-1 sm:ml-2">{timeParts.ms}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-12">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <RotateCcw size={22} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning(!running)}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 ${
            running 
            ? 'bg-red-500 shadow-red-500/30' 
            : 'bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-indigo-500/30'
          }`}
        >
          {running ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLap}
          disabled={!running}
          className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-indigo-400 hover:bg-white/10 transition-all disabled:opacity-20"
        >
          <Flag size={22} />
        </motion.button>
      </div>

      {/* Laps List */}
      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 no-scrollbar border-t border-white/5 pt-8">
        <AnimatePresence mode="popLayout">
          {laps.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs font-bold text-white/10 uppercase tracking-widest italic">No Laps Recorded</p>
            </div>
          ) : (
            laps.map((lap, index) => {
              const parts = formatTime(lap.time);
              return (
                <motion.div 
                  key={lap.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-indigo-400/40 uppercase w-12">Lap {laps.length - index}</span>
                    <Activity size={12} className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="font-mono text-sm tracking-widest text-white/80">
                    {parts.min}:{parts.sec}.<span className="text-indigo-500/60 font-black">{parts.ms}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Stopwatch;
