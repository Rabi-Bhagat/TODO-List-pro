import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, Play, Pause, RotateCcw, Volume2, Clock, Sparkles, AlertTriangle, ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Alarm = () => {
  const [targetTime, setTargetTime] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePreset = (minutesToAdd) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutesToAdd);
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    setTargetTime(`${h}:${m}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    let interval = null;

    if (isActive && targetTime) {
      interval = setInterval(() => {
        const now = new Date();
        const target = new Date();
        const [hours, minutes] = targetTime.split(':');
        target.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        if (target < now) {
          target.setDate(target.getDate() + 1);
        }

        const diff = target - now;
        if (diff <= 0) {
          clearInterval(interval);
          handleTrigger();
        } else {
          setTimeRemaining(diff);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, targetTime]);

  const handleTrigger = () => {
    setTriggered(true);
    setIsActive(false);
    setTimeRemaining(0);
  };

  const startAlarm = () => {
    if (!targetTime) return;
    setIsActive(true);
    setTriggered(false);
    
    const now = new Date();
    const target = new Date();
    const [hours, minutes] = targetTime.split(':');
    target.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    if (target < now) target.setDate(target.getDate() + 1);
    setTimeRemaining(target - now);
  };

  const stopAlarm = () => {
    setIsActive(false);
    setTriggered(false);
    setTimeRemaining(null);
  };

  const formatTimeRemaining = (ms) => {
    if (!ms) return '00:00:00';
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return {
      h: hours.toString().padStart(2, '0'),
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0')
    };
  };

  const t = formatTimeRemaining(timeRemaining);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card max-w-lg mx-auto p-10 border-white/10 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2.5 rounded-xl text-blue-400">
            <Bell size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none">Alert Module</h3>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1.5 opacity-60">Time-Based Trigger</p>
          </div>
        </div>
        {isActive && !triggered && (
           <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
             <Clock size={12} className="animate-spin-slow" /> Armed
           </div>
        )}
      </div>

      <AnimatePresence>
        {triggered && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="mb-8 p-6 rounded-3xl bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center justify-center gap-4 border-2 border-white/20"
          >
            <AlertTriangle size={32} className="animate-bounce" />
            <div className="text-left">
              <h4 className="text-xl font-black tracking-tighter leading-none">THRESHOLD REACHED</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Immediate attention required</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8">
        <div className="relative w-full" ref={dropdownRef}>
          <div className="flex bg-white/5 border border-white/10 rounded-3xl overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
            <input 
              type="time" 
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              disabled={isActive}
              className={`flex-1 bg-transparent py-8 pl-8 pr-4 text-4xl sm:text-5xl font-black text-center transition-all appearance-none cursor-pointer focus:outline-none ${
                isActive ? 'opacity-40 grayscale text-white/50' : 'text-white hover:bg-white/5'
              }`}
            />
            
            <button
              type="button"
              disabled={isActive}
              onClick={() => setShowDropdown(!showDropdown)}
              className={`px-4 sm:px-6 flex items-center justify-center border-l w-[80px] sm:w-[100px] border-white/10 transition-colors ${
                isActive ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-white/10 text-indigo-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <ChevronDown size={24} className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Presets</span>
              </div>
            </button>
          </div>

          <AnimatePresence>
            {showDropdown && !isActive && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-3 p-2 bg-[#12131a] rounded-2xl border border-white/10 shadow-2xl z-20"
              >
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '5 Min', value: 5 },
                    { label: '15 Min', value: 15 },
                    { label: '30 Min', value: 30 },
                    { label: '1 Hour', value: 60 }
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePreset(preset.value)}
                      className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-white hover:text-indigo-400 font-bold tracking-wide transition-all border border-transparent hover:border-indigo-500/30"
                    >
                      <Plus size={16} /> {preset.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isActive && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 py-6 bg-white/[0.03] rounded-3xl border border-white/5"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">{t.h}</span>
              <span className="text-[8px] font-bold text-white/20 uppercase">Hours</span>
            </div>
            <span className="text-white/20 font-black mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">{t.m}</span>
              <span className="text-[8px] font-bold text-white/20 uppercase">Minutes</span>
            </div>
            <span className="text-white/20 font-black mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-indigo-500">{t.s}</span>
              <span className="text-[8px] font-bold text-indigo-400 uppercase">Seconds</span>
            </div>
          </motion.div>
        )}

        <div className="pt-2">
          {!isActive ? (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={startAlarm}
              disabled={!targetTime}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_15px_30px_rgba(37,99,235,0.3)] disabled:opacity-20 flex items-center justify-center gap-3"
            >
              <Bell size={20} />
              Engage Alert
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={stopAlarm}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 ${
                triggered 
                ? 'bg-white text-[#0a0a0c] shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
                : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
              }`}
            >
              {triggered ? <BellOff size={20} /> : <RotateCcw size={20} />}
              {triggered ? 'Silence Module' : 'Abort Mission'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Alarm;
