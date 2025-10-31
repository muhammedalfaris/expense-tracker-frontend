import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 

const apiClient = axios.create({
  baseURL: `${baseURL}/api`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token automatically
apiClient.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;