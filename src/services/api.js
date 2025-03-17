import axios from 'axios';

const token = localStorage.getItem('tokenWall'); // Tokenni localStorage'dan olish
const api = axios.create({
  baseURL: 'https://walldesign.limsa.uz/', // Asosiy API manzili
  withCredentials: true,
  headers: {
    Authorization: token ? `Bearer ${token}` : '', // Tokenni avtomatik qo'shish
  },
});

api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401) {

//       try {
//         const response = await api.post('auth/refresh');
//         originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         console.error("Refresh token ishlamadi");
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
