import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // const login = async (credentials) => {
  //   try {
  //     const response = await authAPI.login(credentials);
  //     const { token: newToken, user: userData } = response.data;
     
      
  //     localStorage.setItem('token', newToken);
  //     localStorage.setItem('user', JSON.stringify(userData));
      
  //     setToken(newToken);
  //     setUser(userData);
      
  //     // return { success: true, user:userData }; added
  //     return { success: true };
  //   } catch (error) {
  //     return { 
  //       success: false, 
  //       error: error.response?.data?.message || 'Login failed' 
  //     };
  //   }
  // };
  const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);

    // Return user along with success
    return { success: true, user: userData };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

  const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    const { token: newToken, user: userInfo } = response.data;

    const completeUser = { ...userInfo, role: userInfo.role || userData.role };

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(completeUser));

    setToken(newToken);
    setUser(completeUser);

    return { success: true, user: completeUser }; // send back user
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Registration failed",
    };
  }
};

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const isStaff = () => {
    return hasRole('staff');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin,
    isStaff,
  };

  // return (
  //   <AuthContext.Provider value={value}>
  //     {children}
  //   </AuthContext.Provider>
  // );
  //myown add
  //    return (
  //   <AuthContext.Provider value={{ user, setUser }}>
  //     {children}
  //   </AuthContext.Provider>
  // );
  return (
  <AuthContext.Provider value={{
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin,
    isStaff,
    setUser
  }}>
    {children}
  </AuthContext.Provider>
);
};
