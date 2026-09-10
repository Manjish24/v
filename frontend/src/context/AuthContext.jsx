import React, { createContext, useState, useEffect } from "react";
import { api } from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await api.getProfile();
        setUser(response.user);
      } catch (err) {
        console.error("Token verification failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.login({ email, password });
    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const signup = async (userData) => {
    const response = await api.signup(userData);
    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isTrainee: user?.role === "trainee",
        isTrainer: user?.role === "trainer",
        isAdmin: user?.role === "admin"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
