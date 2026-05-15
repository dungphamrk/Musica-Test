import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

import { supabase } from '../supabase';

// Thêm interceptor để tự động chèn token vào header
apiClient.interceptors.request.use(async (config) => {
  // Check for demo session first
  const demoSession = localStorage.getItem('sb-demo-session');
  if (demoSession) {
    const { token } = JSON.parse(demoSession);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }

  // Fallback to real Supabase session
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export default apiClient;
