import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2, Sparkles, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

const Signup = () => {
    const [mode, setMode] = useState('password'); // 'password' or 'otp'
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [formData, setFormData] = useState({ username: '', email: '', password: '', otp: '' });
    const [loading, setLoading] = useState(false);
    const { register, sendOTP, verifyOTP, error } = useAuth();
    const navigate = useNavigate();

    const handlePasswordSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await register({ 
            username: formData.username, 
            email: formData.email, 
            password: formData.password 
        });
        setLoading(false);
        if (success) navigate('/');
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await sendOTP(formData.email);
        setLoading(false);
        if (success) setStep(2);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await verifyOTP(formData.email, formData.otp);
        setLoading(false);
        if (success) navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0c] selection:bg-indigo-500/30">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mx-auto px-4 sm:px-6 z-10"
            >
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <div className="text-center mb-10 relative">
                        <motion.div 
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            className="bg-blue-500/10 border border-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group-hover:bg-blue-500/20 transition-all duration-500"
                        >
                            <UserPlus className="text-blue-400 w-8 h-8" />
                            <Sparkles className="absolute -top-1 -left-1 text-yellow-500/70" size={16} />
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Join Now
                        </h2>
                        <p className="text-blue-200/60 mt-2 sm:mt-3 text-sm font-medium">Start your journey to productivity</p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/5 shadow-inner">
                        <button 
                            onClick={() => { setMode('password'); setStep(1); }}
                            className={`flex-1 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${mode === 'password' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <KeyRound size={16} /> Classic
                        </button>
                        <button 
                            onClick={() => { setMode('otp'); setStep(1); }}
                            className={`flex-1 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${mode === 'otp' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <ShieldCheck size={16} /> OTP Signup
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-400"
                            >
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {mode === 'password' ? (
                        <form onSubmit={handlePasswordSignup} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                                className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[15px] placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="Choose a username"
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                                className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[15px] placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="your@email.com"
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                                className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[15px] placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="••••••••"
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 text-sm"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Get Started <ArrowRight size={16} /></>}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {step === 1 ? (
                                <form onSubmit={handleSendOTP} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-white/50 uppercase tracking-widest ml-1">Email for OTP</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[15px] placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                                placeholder="example@gmail.com"
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 text-sm"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <>Send Verification Code <ArrowRight size={16} /></>}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <p className="text-indigo-200/60 text-sm">Verification code sent to</p>
                                        <p className="text-white font-bold">{formData.email}</p>
                                    </div>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            required
                                            maxLength="6"
                                            className="w-full bg-[#12131a] border border-white/5 rounded-xl py-4 pl-11 pr-4 text-center text-xl tracking-[0.8em] font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            placeholder="000000"
                                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 text-sm"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18}/> : <>Verify & Complete <ArrowRight size={16} /></>}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
                                    >
                                        Back to Email
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 font-medium text-sm sm:text-base">
                            Already a member?{' '}
                            <Link to="/login" className="text-white font-bold hover:text-blue-400 transition-colors underline-offset-4 decoration-blue-500/40 underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
