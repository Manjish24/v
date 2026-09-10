import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data.user);
            setProfile(res.data.data.profile);
            localStorage.setItem('cc_user', JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          console.error('Failed to verify existing session:', err);
          logout();
        }
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: newUser, profile: newProfile } = res.data.data;
        localStorage.setItem('cc_token', newToken);
        localStorage.setItem('cc_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setProfile(newProfile);
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data.data;
        localStorage.setItem('cc_token', newToken);
        localStorage.setItem('cc_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data.user);
        setProfile(res.data.data.profile);
        localStorage.setItem('cc_user', JSON.stringify(res.data.data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
