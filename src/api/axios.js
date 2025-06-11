import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // adjust if needed
  withCredentials: true, // optional if using sanctum/cookie auth
});

export default api;