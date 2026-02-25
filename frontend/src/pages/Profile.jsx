import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Save, Lock, ShieldCheck, AlertCircle, CheckCircle, Camera, Loader2, Sparkles, LogOut, Star, Flame, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateProfile, changePassword, logout, error } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        bio: user?.bio || '',
        profileImage: user?.profileImage || ''
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showProfileMsg = (type, text) => {
        setProfileMsg({ type, text });
        setTimeout(() => setProfileMsg({ type: '', text: '' }), 4000);
    };

    const showPasswordMsg = (type, text) => {
        setPasswordMsg({ type, text });
        setTimeout(() => setPasswordMsg({ type: '', text: '' }), 4000);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await updateProfile(profileData);
        setLoading(false);
        if (success) showProfileMsg('success', 'Profile updated successfully!');
        else showProfileMsg('error', 'Update failed. Please try again.');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showPasswordMsg('error', 'Passwords do not match');
            return;
        }
        setLoading(true);
        const success = await changePassword({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
        });
        setLoading(false);
        if (success) {
            showPasswordMsg('success', 'Your password is changed successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            showPasswordMsg('error', 'Password change failed. Check your current password.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 10 * 1024 * 1024) {
             setMsg({ type: 'error', text: 'Image size should be less than 10MB' });
             return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
             const base64String = reader.result;
             setProfileData({ ...profileData, profileImage: base64String });
             
             setLoading(true);
             const success = await updateProfile({ ...profileData, profileImage: base64String });
             setLoading(false);
             
             if (success) showProfileMsg('success', 'Profile picture updated!');
             else showProfileMsg('error', 'Upload failed. Please try again.');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] pt-24 pb-12 px-4 selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

            <div className="max-w-5xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Sidebar Profile Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                            
                            <div className="relative">
                                <div className="relative w-32 h-32 mx-auto mb-6 group">
                                    <label htmlFor="avatar-upload" className="cursor-pointer block w-full h-full relative">
                                        <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-3xl flex items-center justify-center border-4 border-white/5 shadow-[0_10px_30px_rgba(79,70,229,0.3)] overflow-hidden">
                                            {user?.profileImage ? (
                                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="text-white w-14 h-14" />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2.5 rounded-xl border-2 border-[#0a0a0c] text-white hover:scale-110 transition-transform">
                                            <Camera size={18} />
                                        </div>
                                    </label>
                                    <input 
                                        id="avatar-upload" 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageUpload} 
                                    />
                                </div>
                                
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{user?.username}</h3>
                                    <p className="text-indigo-200/60 font-medium text-sm">{user?.email}</p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                                    {/* Gamification Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-center shadow-inner">
                                            <div className="text-3xl font-black text-indigo-400 tracking-tighter">{user?.level || 1}</div>
                                            <div className="flex items-center justify-center gap-1 mt-1">
                                                <Star className="text-indigo-400" size={10} />
                                                <div className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest">Level</div>
                                            </div>
                                        </div>
                                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center shadow-inner">
                                            <div className="text-3xl font-black text-orange-400 tracking-tighter">{user?.currentStreak || 0}</div>
                                            <div className="flex items-center justify-center gap-1 mt-1">
                                                <Flame className="text-orange-400" size={10} />
                                                <div className="text-[10px] font-bold text-orange-300/60 uppercase tracking-widest">Day Streak</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Training Calendar */}
                                    <div className="flex flex-col items-center w-full mx-auto relative z-10 py-8 bg-white/[0.02] rounded-3xl mb-6 border border-white/5 shadow-2xl">
                                        <div className="flex items-center justify-between w-full max-w-[300px] mb-6 px-2">
                                            <h3 className="text-xl font-medium text-white tracking-wide">Streak Calendar</h3>
                                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full">
                                                {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', width: '100%', maxWidth: '300px', justifyItems: 'center', rowGap: '20px', columnGap: '8px' }} className="mb-8 relative">
                                            {['S','M','T','W','T','F','S'].map((d, i) => (
                                                <div key={`header-${i}`} className="text-[14px] font-medium text-gray-400 mb-2">{d}</div>
                                            ))}
                                            {(() => {
                                            const today = new Date();
                                            const year = today.getFullYear();
                                            const month = today.getMonth();
                                            
                                            const firstDay = new Date(year, month, 1).getDay();
                                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                                            
                                            const days = [];
                                            // Empty slots for alignment
                                            for(let i = 0; i < firstDay; i++) {
                                                days.push(<div key={`empty-${i}`} />);
                                            }
                                            // Actual days
                                            for(let i = 1; i <= daysInMonth; i++) {
                                                const dateObj = new Date(year, month, i);
                                                // Create a safe YYYY-MM-DD string that matches however the backend stores it.
                                                // Often, backend stores ISO strings (e.g., "2026-02-25T00:00:00.000Z") or just the date part.
                                                // Let's check against what might be in the user.activeDates array.
                                                
                                                // Safest local date string formatted as YYYY-MM-DD
                                                const localDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                                                
                                                // Check if ANY date in activeDates starts with our localDateStr or matches it exactly
                                                const isActive = user?.activeDates?.some(d => {
                                                    if (!d) return false;
                                                    // Handle both 'YYYY-MM-DD' and full ISO 'YYYY-MM-DDTHH...' formats
                                                    return d.startsWith(localDateStr);
                                                }) || false;
                                                
                                                // Calculate diffDays for streak flames safely
                                                const targetDate = new Date(year, month, i, 0, 0, 0); 
                                                const todayMidnight = new Date(today);
                                                todayMidnight.setHours(0,0,0,0);
                                                const diffDays = Math.floor((todayMidnight - targetDate) / (1000 * 60 * 60 * 24));
                                                
                                                // If part of the "Current Streak" (contiguous back from today/yesterday), we show fire.
                                                // For a simple visual, we just check if it's active and within the last `user.currentStreak` days
                                                const isStreakFire = isActive && diffDays < (user?.currentStreak || 0) && diffDays >= 0;

                                                const isToday = i === today.getDate();

                                                days.push(
                                                    <div key={i} className="flex flex-col justify-center items-center w-8 h-8 relative group" title={localDateStr}>
                                                        <div 
                                                            className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-300 cursor-default ${
                                                                isStreakFire
                                                                    ? 'bg-gradient-to-tr from-orange-400 to-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.6)] font-bold'
                                                                    : isActive 
                                                                        ? 'bg-teal-400 text-teal-950 shadow-[0_0_10px_rgba(45,212,191,0.4)] font-bold' 
                                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                        >
                                                            {i}
                                                        </div>
                                                        {isStreakFire && (
                                                            <div className="absolute -top-2 -right-1 z-10 animate-[bounce_2s_infinite]">
                                                                <Flame size={14} className="text-orange-400 fill-orange-400 drop-shadow-sm" />
                                                            </div>
                                                        )}
                                                        {isToday && (
                                                            <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-indigo-400" title="Today"></div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return days;
                                        })()}
                                        </div>
                                        
                                        <div className="flex items-center justify-center gap-2 mt-2 text-white/90 font-medium text-[17px]">
                                            Current streak: <Flame size={26} className="text-orange-500 fill-orange-500 ml-1" /> <span className="text-orange-500 font-bold ml-[-2px]">{user?.currentStreak || 0} DAYS</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm px-2 pt-2 border-t border-white/5">
                                        <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]"></span>
                                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                            <ShieldCheck size={14} /> Verified
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3.5 rounded-2xl border border-red-500/20 transition-all duration-300"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Edit Profile Section */}
                        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-indigo-600/20 p-3 rounded-2xl text-indigo-400">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Profile Settings</h2>
                                    <p className="text-indigo-200/40 text-sm font-medium italic"></p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {profileMsg.text && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                                            profileMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}
                                    >
                                        {profileMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                        <span className="text-sm font-bold tracking-wide">{profileMsg.text}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">Username</label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2 opacity-60">
                                    <label className="text-xs font-bold text-indigo-300/60 uppercase tracking-widest ml-1">Email (unchangable)</label>
                                    <div className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-gray-400 font-mono text-sm overflow-hidden text-ellipsis">
                                        {user?.email}
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">About Me</label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        rows="3"
                                        className="w-full bg-[#12131a] border border-white/5 rounded-xl py-3.5 px-5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none font-medium"
                                        placeholder="Write something cool about yourself..."
                                    />
                                </div>
                                <div className="md:col-span-2 pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_15px_30px_rgba(79,70,229,0.2)] disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Security Section */}
                        <div className="bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 border border-white/5 shadow-xl relative overflow-hidden group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-blue-600/20 p-3 rounded-2xl text-blue-400">
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Security & Privacy</h2>
                                    <p className="text-blue-200/40 text-sm font-medium italic">You also change your passwordx</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {passwordMsg.text && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                                            passwordMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}
                                    >
                                        {passwordMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                        <span className="text-sm font-bold tracking-wide">{passwordMsg.text}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            required
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 px-5 pr-12 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            placeholder="Verify your identity"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 focus:outline-none transition-colors"
                                        >
                                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                required
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 px-5 pr-12 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 focus:outline-none transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 px-5 pr-12 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 focus:outline-none transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white font-bold py-4 px-8 rounded-2xl transition-all border border-white/10 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="text-yellow-400" />}
                                        Update Security Keys
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
