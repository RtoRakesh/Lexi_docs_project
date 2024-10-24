import React, { createContext, useContext, useState } from "react";

import axios from "axios";

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  const login = async (email, password) => {
    try {
      const res = await axios.get(`http://localhost:3000/users`);
      const userData = res.data.find(
        (item) => item.Email === email && item.Password === password
      );
      // setUser(userData);
      return userData;
    } catch (err) {
      console.log("Error occured while login", err);
    }
  };
  const logout = () => {
    setUser(false);
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
