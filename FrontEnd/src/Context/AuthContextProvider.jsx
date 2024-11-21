import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://lexi-docs-project.onrender.com/api/auth/login",
        { email, password }
      );
      const token = res.data.token;

      localStorage.setItem("token", token);

      setUser({ email });
      navigate("/documents");

      return res.data;
    } catch (err) {
      console.error("Error occurred while login", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
