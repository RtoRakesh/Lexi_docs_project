import React, { createContext, useContext, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await axios.get(`http://localhost:3000/users`);
      const userData = res.data.find(
        (item) => item.email === email && item.password === password
      );
      setUser(userData);
      console.log(user);
      if (userData) {
        navigate("/documents");
      }
      return userData;
    } catch (err) {
      console.log("Error occured while login", err);
    }
  };
  const logout = () => {
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
