import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load authenticated user on app launch
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setProfile(res.data.profile);
      } catch (err) {
        console.warn('Session expired or invalid, logging out:', err.message);
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData, profile: profileData } = res.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setProfile(profileData);
    return userData;
  };

  // Register handler
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const { token: newToken, user: userData, profile: profileData } = res.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setProfile(profileData);
    return userData;
  };

  // Demo Login helper
  const demoLogin = async (role) => {
    // Seed demo accounts first
    try {
      await api.post('/auth/seed-demo');
    } catch (seedErr) {
      console.warn('Demo seed endpoint skipped or unavailable:', seedErr.message);
    }

    const demoCredentials = {
      citizen: { email: 'citizen@societysolve.org', password: 'password123' },
      university: { email: 'university@societysolve.org', password: 'password123' },
      industry: { email: 'industry@societysolve.org', password: 'password123' },
      government: { email: 'gov@societysolve.org', password: 'password123' },
      admin: { email: 'admin@societysolve.org', password: 'password123' },
    };

    const creds = demoCredentials[role] || demoCredentials.citizen;

    try {
      return await login(creds.email, creds.password);
    } catch (loginErr) {
      // Automatic fallback if MongoDB doesn't have the government account created yet
      if (role === 'government') {
        try {
          await api.post('/auth/register', {
            name: 'Municipal Authority Officer',
            email: 'gov@societysolve.org',
            password: 'password123',
            role: 'government',
          });
          return await login(creds.email, creds.password);
        } catch (regErr) {
          console.error('Auto-registration of government demo account failed:', regErr.message);
        }
      }
      throw loginErr;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'citizen':
        return '/citizen';
      case 'university':
        return '/university';
      case 'industry':
        return '/industry';
      case 'government':
        return '/government';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};