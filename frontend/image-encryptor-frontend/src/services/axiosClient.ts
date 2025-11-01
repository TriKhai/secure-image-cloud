import axios from "axios";
// import { refreshToken } from "../services/authApi";
const API_URL = import.meta.env.VITE_API_URL

const axiosClient = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, 
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> logout
      localStorage.removeItem("token");
      window.location.href = "/dang-nhap"; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;