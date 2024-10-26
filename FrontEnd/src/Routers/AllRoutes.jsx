import React from "react";
import { Route, Routes } from "react-router-dom";
import WelcomePage from "../Components/WelcomePage/WelcomePage";
import Login from "../Components/Authentication/Login";
import Register from "../Components/Authentication/Register";
import DocumentManger from "../Components/DocsManager/DocumentManger";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/documents" element={<DocumentManger />} />
    </Routes>
  );
};

export default AllRoutes;
