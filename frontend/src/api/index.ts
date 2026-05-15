import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động chèn token vào header
apiClient.interceptors.request.use((config) => {
  const session = localStorage.getItem('supabase.auth.session');
  if (session) {
    try {
      const parsed = JSON.parse(session) as { token?: string };
      if (parsed.token) config.headers.Authorization = `Bearer ${parsed.token}`;
    } catch {
      localStorage.removeItem('supabase.auth.session');
    }
  }
  return config;
});

export default apiClient;
