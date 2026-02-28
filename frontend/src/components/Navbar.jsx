import React from 'react';
import { Search, Moon, Sun, ListTodo, User, LogOut, Bell, Timer, Sparkles, Flame, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="glass p-3 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between sticky top-0 sm:top-4 z-[100] mx-auto w-full gap-3 sm:gap-4 md:gap-0 border-white/10 shadow-xl bg-[#0a0a0c]/80"
    >
      {/* 
        MOBILE LAYOUT (flex-col):
        Row 1: Brand (Left) + Mobile Right Actions (Profile, Logout)
        Row 2: Stats (Flame, Lvl, Bell) - full width or centered
        Row 3: Search Bar
      */}
      <div className="flex w-full md:w-auto items-center justify-between gap-2">
        {/* Brand Section */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 no-underline group shrink-0">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-indigo-500/10 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-indigo-500/10 border border-indigo-500/20 text-indigo-400"
          >
            <ListTodo size={20} className="sm:w-6 sm:h-6" />
          </motion.div>
          <div className="flex flex-col">
            <h2 className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 m-0 tracking-tight leading-none">
              ToDo Pro
            </h2>
            <span className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
              Agile Workflow
            </span>
          </div>
        </Link>

        {/* Mobile ONLY: Profile & Logout */}
        {user && (
          <div className="md:hidden flex items-center gap-2 shrink-0">
            <Link to="/profile" className="flex items-center justify-center p-0 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
              <div className="w-9 h-9 bg-indigo-600/30 border border-indigo-500/50 rounded-xl flex items-center justify-center text-indigo-300 shadow-inner relative overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover z-10 relative" />
                ) : (
                  <User size={16} className="z-10 relative" />
                )}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-indigo-500/30 z-0 transition-all duration-1000 ease-out" 
                  style={{ height: `${((user.xp || 0) % 100)}%` }}
                />
              </div>
            </Link>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout} 
              className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Mobile ONLY: Stats / Notifications Row */}
      {user && (
        <div className="md:hidden flex items-center justify-between w-full gap-2 px-1">
          <div className="flex items-center gap-2">
            <motion.div 
              className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2 py-1.5 rounded-xl text-orange-400 cursor-default"
              title={`Current Streak: ${user.currentStreak || 0} days`}
            >
              <Flame size={14} className={`${(user.currentStreak || 0) > 0 ? 'animate-pulse text-orange-500' : 'opacity-50'}`} />
              <span className="text-[11px] font-bold">{user.currentStreak || 0}</span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1.5 rounded-xl text-indigo-400"
              title={`XP: ${user.xp || 0}`}
            >
              <Star size={12} className="text-indigo-400" />
              <span className="text-[11px] font-bold">Lvl {user.level || 1}</span>
            </motion.div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
          >
            <Bell size={16} />
          </motion.button>
        </div>
      )}

      {/* Search Section */}
      <div className="w-full md:flex-1 md:max-w-md mx-0 md:mx-8">
        <div className="relative group">
          <Search 
            size={16} 
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-colors" 
          />
          <input 
            type="text" 
            placeholder="Search everything..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12131a] border border-white/5 rounded-2xl py-2.5 sm:py-3.5 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Desktop ONLY Actions Section */}
      <div className="hidden md:flex items-center justify-between w-full md:w-auto px-1 md:px-0">
        <div className="flex items-center gap-2 md:gap-4 md:pl-4 md:border-l md:border-white/10 w-full justify-between">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
            >
              <Bell size={20} />
            </motion.button>

            {user && (
              <>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-orange-400 cursor-default"
                  title={`Current Streak: ${user.currentStreak || 0} days`}
                >
                  <Flame size={16} className={`${(user.currentStreak || 0) > 0 ? 'animate-pulse text-orange-500' : 'opacity-50'}`} />
                  <span className="text-xs font-bold">{user.currentStreak || 0}</span>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-indigo-400"
                  title={`XP: ${user.xp || 0}`}
                >
                  <Star size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold">Lvl {user.level || 1}</span>
                </motion.div>
              </>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 group p-1 pr-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600/30 border border-indigo-500/50 rounded-xl flex items-center justify-center text-indigo-300 shadow-inner relative overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover z-10 relative" />
                  ) : (
                    <User size={16} className="z-10 relative" />
                  )}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-indigo-500/30 z-0 transition-all duration-1000 ease-out" 
                    style={{ height: `${((user.xp || 0) % 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-white/80 group-hover:text-white hidden sm:block">
                  {user.username}
                </span>
              </Link>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout} 
                className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20"
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
