import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api.com/api/v1', // Asosiy API manzili
});

export default api;
