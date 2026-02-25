import React from 'react';
import { Briefcase, User, ShoppingCart, Heart, LayoutGrid, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: 'All Tasks', icon: <LayoutGrid size={18} />, color: 'indigo' },
  { id: 'Work', name: 'Work', icon: <Briefcase size={18} />, color: 'blue' },
  { id: 'Personal', name: 'Personal', icon: <User size={18} />, color: 'rose' },
  { id: 'Shopping', name: 'Shopping', icon: <ShoppingCart size={18} />, color: 'emerald' },
  { id: 'Health', name: 'Health', icon: <Heart size={18} />, color: 'amber' },
];

const CategorySection = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="mb-8">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar items-center">
        <div className="flex items-center gap-1.5 px-2 mr-2 border-r border-white/10 hide-mobile">
          <Sparkles className="text-indigo-400" size={14} />
          <span className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest leading-none">Context filters</span>
        </div>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap ${
              activeCategory === cat.id 
              ? 'bg-white/10 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
              : 'bg-transparent border-white/5 text-white/40 hover:bg-white/[0.03] hover:text-white/80'
            }`}
          >
            <span className={`${activeCategory === cat.id ? 'text-indigo-400' : 'text-inherit'} scale-90`}>
              {cat.icon}
            </span>
            <span className="text-xs font-semibold tracking-wide">{cat.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
