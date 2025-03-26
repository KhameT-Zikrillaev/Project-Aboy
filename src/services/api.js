import axios from 'axios';
import Cookies from "js-cookie";

const token = Cookies.get("authToken"); // Tokenni localStorage'dan olish
const api = axios.create({
  baseURL: 'https://walldesign.limsa.uz/', // Asosiy API manzili
  withCredentials: true,
  headers: {
    Authorization: token ? `Bearer ${token}` : '', // Tokenni avtomatik qo'shish
  },
});

// api.interceptors.request.use(
//   (config) => {
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    originalRequest.headers.Authorization = `Bearer ${Cookies.get("authToken")}`;
    return api(originalRequest);
  }
);

export default api;
