import React, { useState } from 'react';
import { Trash2, Check, Clock, Tag, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskCard = ({ task, onToggle, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
      className={`glass-card group relative overflow-hidden flex flex-col gap-4 p-5 ${
        task.completed 
          ? 'bg-white/[0.02] border-white/5 opacity-60' 
          : 'bg-white/[0.04] border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.06] shadow-lg shadow-black/20'
      }`}
    >
      {/* Visual Accent */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
          task.completed 
            ? 'bg-emerald-500/30' 
            : 'bg-gradient-to-b from-indigo-500 to-blue-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
        }`} 
      />

      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Checkbox & Content */}
        <div className="flex items-start gap-4 flex-1">
          {/* Custom Checkbox */}
          <motion.button 
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.85, rotate: -10 }}
            onClick={() => onToggle(task.id)}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              task.completed 
                ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                : 'border-white/20 hover:border-indigo-400 bg-transparent'
            }`}
          >
            <motion.div
              initial={false}
              animate={{ scale: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check size={14} strokeWidth={3} className="text-[#0a0a0c]" />
            </motion.div>
          </motion.button>
          
          <div className="flex-1 min-w-0">
            <h4 
              className={`text-base sm:text-lg font-bold tracking-tight transition-all duration-300 ${
                task.completed 
                  ? 'text-white/40 line-through decoration-white/20' 
                  : 'text-white group-hover:text-indigo-50'
              }`}
            >
              {task.text}
            </h4>

            <AnimatePresence>
              {task.details && isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-[13px] text-indigo-200/80 mt-2 font-medium leading-relaxed pr-4 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    {task.details}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {task.category && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/50 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">
                  <Tag size={10} className="text-indigo-400" />
                  <span className="uppercase tracking-widest">{task.category}</span>
                </div>
              )}
              
              {task.time && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/50 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">
                  <Clock size={10} className="text-blue-400" />
                  <span className="uppercase tracking-widest">{task.time}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex flex-col items-end justify-between self-stretch shrink-0 ml-1">
          <motion.button 
            whileHover={{ scale: 1.15, backgroundColor: 'rgba(239, 68, 68, 0.2)', rotate: 5 }}
            whileTap={{ scale: 0.85, rotate: -5 }}
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 transition-all opacity-0 group-hover:opacity-100 mb-2"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </motion.button>

          {!task.completed && task.details && (
             <button 
               onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
               className="flex items-center gap-1 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest hover:text-indigo-400 transition-colors mt-auto focus:outline-none shrink-0"
             >
               Details 
               {isExpanded ? (
                 <ChevronDown size={14} className="transition-transform duration-300" />
               ) : (
                 <ChevronRight size={14} className="transition-transform duration-300" />
               )}
             </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
