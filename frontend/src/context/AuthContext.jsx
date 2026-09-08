import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { CloudSnow } from 'lucide-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // App load hone par Server se Profile sync karein
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Fresh user profile API se mangwaiye
        const { data } = await API.get('/auth/me');
       
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        // Token invalid/expired hone par cleanup
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login Function (Accepts user data and JWT token)
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {!loading && children}
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