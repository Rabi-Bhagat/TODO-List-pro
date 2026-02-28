import React, { useState } from 'react';
import { X, Plus, Clock, Tag, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Work', 'Personal', 'Shopping', 'Health'];

const TaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [text, setText] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('Personal');
  const [time, setTime] = useState('12:00 PM');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTask({ task: text, text, details, category, time });
    setText('');
    setDetails('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden p-6 sm:p-8 bg-[#12131a] rounded-3xl border border-white/5 shadow-2xl"
          >
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Create Task</h2>
                <p className="text-sm font-medium text-indigo-200/50 mt-1">What's on your mind?</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Task Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                  <MessageSquare size={16} className="text-indigo-400" /> Title
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="E.g., Finish project proposal..." 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-[#1a1b23] border border-white/5 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-base"
                    autoFocus
                  />
                </div>
              </div>

              {/* Details Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                  <MessageSquare size={16} className="text-indigo-400" /> Details (Optional)
                </label>
                <div className="relative group">
                  <textarea 
                    placeholder="Add more context..." 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows="2"
                    className="w-full bg-[#1a1b23] border border-white/5 rounded-2xl py-3 px-5 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm resize-none"
                  />
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                    <Tag size={16} className="text-emerald-400" /> Category
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1a1b23] border border-white/5 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-[#12131a]">{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" /> Time
                  </label>
                  <input 
                    type="text" 
                    placeholder="10:00 AM" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#1a1b23] border border-white/5 rounded-2xl py-3.5 px-4 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-[0_10px_20px_rgba(79,70,229,0.2)] flex items-center justify-center gap-2 transition-colors border border-indigo-500/50"
                >
                  <Sparkles size={16} className="text-indigo-200" />
                  Save Task
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
