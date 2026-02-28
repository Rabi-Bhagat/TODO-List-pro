import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './services/api';

import Navbar from './components/Navbar';
import CategorySection from './components/CategorySection';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Stopwatch from './components/Stopwatch';
import Alarm from './components/Alarm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListTodo, Timer, Bell, Loader2 } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <Loader2 className="text-white animate-spin" size={48} />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user, loading, refreshProfile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem('agile-theme') === 'dark');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    localStorage.setItem('agile-theme', darkTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', darkTheme ? 'dark' : 'light');
  }, [darkTheme]);

  // Fetch tasks from backend
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        setTasksLoading(true);
        try {
          const res = await api.get('/todos');
          setTasks(res.data);
        } catch (err) {
          console.error("Failed to fetch tasks", err);
        } finally {
          setTasksLoading(false);
        }
      };
      fetchTasks();
    }
  }, [user]);

  const addTask = async (taskData) => {
    try {
      const res = await api.post('/todos', taskData);
      setTasks([res.data, ...tasks]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t._id === id);
    try {
      const res = await api.put(`/todos/${id}`, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
      
      // If task was just completed, refresh the profile to update XP and Streaks
      if (!task.completed) {
        await refreshProfile();
      }
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategory === 'all' || task.category === activeCategory;
    const matchesSearch = task.task.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <Loader2 className="text-white animate-spin" size={48} />
    </div>
  );

  return (
    <div className="app-container">
      <div className="gradient-bg" />
      
      {user && (
        <Navbar 
          darkTheme={darkTheme} 
          setDarkTheme={setDarkTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <main className="pt-12">
              {/* Premium Tabs Navigation */}
              <div className="bg-white/[0.03] backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 flex gap-1 mb-12 max-w-lg mx-auto shadow-2xl overflow-hidden relative">
                <AnimatePresence>
                  {[
                    { id: 'tasks', label: 'Tasks', icon: <ListTodo size={18} /> },
                    { id: 'stopwatch', label: 'Time Control', icon: <Timer size={18} /> },
                    { id: 'alarm', label: 'Alerts', icon: <Bell size={18} /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold tracking-tight transition-all duration-500 z-10 ${
                        activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl shadow-lg shadow-indigo-600/20 z-[-1]"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'tasks' ? (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <CategorySection 
                      activeCategory={activeCategory} 
                      setActiveCategory={setActiveCategory} 
                    />

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-2">
                      <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Your Tasks</h2>
                        <p className="text-sm font-medium text-indigo-300/60 mt-1">Manage your agile workflow</p>
                      </div>
                      <div className="bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                        <span className="text-sm font-bold text-emerald-100/90">{filteredTasks.length} Active Items</span>
                      </div>
                    </div>

                    <div className="grid">
                      {tasksLoading ? (
                        <div className="flex justify-center p-12 col-span-full">
                          <Loader2 className="text-indigo-400 animate-spin" size={32} />
                        </div>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                              <TaskCard 
                                key={task._id} 
                                task={{ ...task, text: task.task, id: task._id }} 
                                onToggle={() => toggleTask(task._id)} 
                                onDelete={() => deleteTask(task._id)} 
                              />
                            ))
                          ) : (
                            <motion.div 
                              key="no-tasks"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center glass-card border-dashed border-2 border-white/10"
                            >
                              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                <ListTodo size={40} className="text-indigo-400" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Focus & Conquer</h3>
                              <p className="text-indigo-200/60 max-w-sm text-sm mb-6">You have no tasks in this context. Add a new task to start building your momentum and earn XP.</p>
                              <button 
                                onClick={() => setIsModalOpen(true)}
                                className="group flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                              >
                                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> Create First Task
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.div>
                ) : activeTab === 'stopwatch' ? (
                  <motion.div key="stopwatch" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Stopwatch />
                  </motion.div>
                ) : (
                  <motion.div key="alarm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Alarm />
                  </motion.div>
                ) }
              </AnimatePresence>
            </main>

            {activeTab === 'tasks' && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, y: -4, rotate: 90 }}
                whileTap={{ scale: 0.9, rotate: -90 }}
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.6)] flex items-center justify-center z-[100] transition-colors"
              >
                <Plus size={32} />
              </motion.button>
            )}

            <TaskModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onAddTask={addTask} 
            />
          </ProtectedRoute>
        } />
      </Routes>
      
      {/* Footer */}
      <footer className="w-full text-center py-6 text-white/50 text-sm mt-auto z-50 relative pointer-events-auto">
        Made By <a href="https://rabibhagat.com.np" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline">Rabi Bhagat</a>
      </footer>
    </div>
  );
}

export default App;
