import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { saveData, getData, removeData } from "../utils/fileSystem";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getData("token");
      const storedUser = getData("user");

      if (storedUser) {
        setUser(storedUser);
      }

      if (token) {
        const response = await api.auth.getProfile();
        const userData = response.data?.data?.user || response.data?.user;
        if (userData) {
          setUser(userData);
          saveData("user", userData);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);


  const login = async (email, password) => {
    const response = await api.auth.login({ email, password });
    const userData = response.data?.data?.user;
    const token = response.data?.data?.token;

    if (!userData || !token) {
      return {
        success: false,
        message: "Invalid response from server",
      };
    }

    saveData("token", token);
    saveData("user", userData);
    setUser(userData);

    return {
      success: true,
      user: userData,
      message: response.data?.message || "Login successful",
    };
  };

  const register = async (userData) => {
    const response = await api.auth.register(userData);
    const user = response.data?.data?.user;
    const token = response.data?.data?.token;

    if (!user || !token) {
      return {
        success: false,
        message: "Invalid response from server",
      };
    }

    saveData("token", token);
    saveData("user", user);
    setUser(user);

    return {
      success: true,
      user,
      message: response.data?.message || "User registered successfully",
    };
  };

  const logout = async () => {
    await api.auth.logout();
    removeData("token");
    removeData("user");
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const response = await api.auth.updateProfile(userData);
    const updatedUser = response.data?.data?.user;

    if (!updatedUser) {
      return {
        success: false,
        message: "Invalid response from server",
      };
    }

    saveData("user", updatedUser);
    setUser(updatedUser);

    return {
      success: true,
      user: updatedUser,
      message: response.data?.message || "Profile updated successfully",
    };
  };

  const isAdmin = () => {
    return user && user.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
