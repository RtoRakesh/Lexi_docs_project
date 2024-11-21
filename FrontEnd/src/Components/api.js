import axios from "axios";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const axiosInstance = axios.create({
  baseURL: "https://lexi-docs-project.onrender.com",
});
