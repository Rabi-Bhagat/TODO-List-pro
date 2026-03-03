import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/profile');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const register = async (formData) => {
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const sendOTP = async (email) => {
        setLoading(true);
        try {
            await api.post('/auth/send-otp', { email });
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send OTP');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (email, otp) => {
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', { email, otp });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'OTP verification failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (formData) => {
        try {
            const res = await api.put('/auth/profile', formData);
            setUser(res.data);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Update failed');
            return false;
        }
    };

    const changePassword = async (passwords) => {
        try {
            await api.put('/auth/change-password', passwords);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Password change failed');
            return false;
        }
    };

    const refreshProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setUser(res.data);
            return true;
        } catch (err) {
            console.error("Failed to refresh profile", err);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, sendOTP, verifyOTP, logout, updateProfile, changePassword, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
