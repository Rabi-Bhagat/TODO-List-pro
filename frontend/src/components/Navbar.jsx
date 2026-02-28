import React, { useState } from 'react';
import { Search, Moon, Sun, ListTodo, User, LogOut, Bell, Timer, Sparkles, Flame, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence } from 'framer-motion';

const Navbar = ({ searchQuery, setSearchQuery, notifications = [], setNotifications }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="glass p-3 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between sticky top-0 sm:top-4 z-[100] mx-auto w-full gap-4 md:gap-0 border-white/10 shadow-xl bg-[#0a0a0c]/90 backdrop-blur-2xl"
    >
      {/* 
        MOBILE LAYOUT (flex-col):
        Row 1: Brand (Left) + Mobile Right Actions (Profile, Logout)
        Row 2: Stats (Flame, Lvl, Bell)
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
            <h2 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 m-0 tracking-tight leading-none">
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
              <div className="w-8 h-8 bg-indigo-600/30 border border-indigo-500/50 rounded-xl flex items-center justify-center text-indigo-300 shadow-inner relative overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover z-10 relative" />
                ) : (
                  <User size={14} className="z-10 relative" />
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
              className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20"
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Mobile ONLY: Stats / Notifications Row */}
      {user && (
        <div className="md:hidden flex w-full items-center justify-between gap-2 px-1 bg-white/[0.02] p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <Link 
              to="/profile#streak"
              className="flex items-center shrink-0 gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 transition-colors border border-orange-500/20 px-2 py-1.5 rounded-lg text-orange-400 cursor-pointer"
              title={`Current Streak: ${user.currentStreak || 0} days`}
            >
              <Flame size={14} className={`${(user.currentStreak || 0) > 0 ? 'animate-pulse text-orange-500' : 'opacity-50'}`} />
              <span className="text-[11px] font-bold">{user.currentStreak || 0}</span>
            </Link>

            <Link 
              to="/profile#level"
              className="flex items-center shrink-0 gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors border border-indigo-500/20 px-2 py-1.5 rounded-lg text-indigo-400 cursor-pointer"
              title={`XP: ${user.xp || 0}`}
            >
              <Star size={12} className="text-indigo-400" />
              <span className="text-[11px] font-bold shrink-0">Lvl {user.level || 1}</span>
            </Link>
          </div>

          <div className="relative shrink-0">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 relative"
            >
              <Bell size={14} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0c]" />
              )}
            </motion.button>
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-[280px] sm:w-72 bg-[#12131a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110]"
                >
                  <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-sm font-bold text-white tracking-tight">Activity Log</h3>
                    {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])} className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors">Clear All</button>
                    )}
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto p-2 space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center p-4 text-white/40 text-xs font-semibold">No recent activity</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${n.type === 'success' ? 'text-emerald-400' : n.type === 'warning' ? 'text-orange-400' : 'text-blue-400'}`}>{n.title}</span>
                            <span className="text-[9px] text-white/30 font-medium">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <span className="text-xs text-indigo-100/70 leading-snug">{n.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 relative"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0c]" />
                )}
              </motion.button>
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-3 w-80 bg-[#12131a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110]"
                  >
                    <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                      <h3 className="text-sm font-bold text-white tracking-tight">Activity Log</h3>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors">Clear All</button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2 space-y-2">
                      {notifications.length === 0 ? (
                        <div className="text-center p-6 text-white/40 text-xs font-semibold">No recent activity</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${n.type === 'success' ? 'text-emerald-400' : n.type === 'warning' ? 'text-orange-400' : 'text-blue-400'}`}>{n.title}</span>
                              <span className="text-[10px] text-white/30 font-medium">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <span className="text-sm text-indigo-100/70 leading-snug">{n.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user && (
              <>
                <Link 
                  to="/profile#streak"
                  className="flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 transition-all border border-orange-500/20 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-orange-400 cursor-pointer hover:scale-105 active:scale-95"
                  title={`Current Streak: ${user.currentStreak || 0} days`}
                >
                  <Flame size={16} className={`${(user.currentStreak || 0) > 0 ? 'animate-pulse text-orange-500' : 'opacity-50'}`} />
                  <span className="text-xs font-bold">{user.currentStreak || 0}</span>
                </Link>

                <Link 
                  to="/profile#level"
                  className="flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all border border-indigo-500/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-indigo-400 cursor-pointer hover:scale-105 active:scale-95"
                  title={`XP: ${user.xp || 0}`}
                >
                  <Star size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold">Lvl {user.level || 1}</span>
                </Link>
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
