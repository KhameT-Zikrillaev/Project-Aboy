import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://walldesign.limsa.uz/",
  withCredentials: true,
});

// Har bir so‘rov oldidan tokenni yangilab qo‘shish
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Javoblarni intercept qilish va 401 bo‘lsa tokenni yangilash
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Agar so‘rov 401 qaytgan bo‘lsa va avval qayta urinish qilinmagan bo‘lsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Cheksiz qayta urinishdan qochish

      const newToken = Cookies.get("authToken");
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
