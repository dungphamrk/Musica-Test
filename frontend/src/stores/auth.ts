import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../supabase';

type AuthRole = 'user' | 'admin';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ email: string; role: AuthRole; id: string } | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!token.value);
  const role = computed<AuthRole>(() => user.value?.role ?? 'user');
  const isAdmin = computed(() => role.value === 'admin');

  // Sync with Supabase Auth
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      token.value = session.access_token;
      user.value = {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.email?.includes('admin') ? 'admin' : 'user', // Basic role check for demo
      };
    }
    loading.value = false;
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      token.value = session.access_token;
      user.value = {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.email?.includes('admin') ? 'admin' : 'user',
      };
    } else {
      user.value = null;
      token.value = null;
    }
  });

  // Manual login for demo purposes
  function setDemoUser(role: AuthRole) {
    const id = role === 'admin' ? '00000000-0000-0000-0000-000000000001' : '00000000-0000-0000-0000-000000000002';
    const email = role === 'admin' ? 'admin@demo.com' : 'user@demo.com';
    const fakeToken = `fake-${role}`;

    user.value = { id, email, role };
    token.value = fakeToken;
    
    // Save to localStorage so it persists on refresh
    localStorage.setItem('sb-demo-session', JSON.stringify({ user: user.value, token: fakeToken }));
  }

  // Check for demo session on init
  const saved = localStorage.getItem('sb-demo-session');
  if (saved) {
    const parsed = JSON.parse(saved);
    user.value = parsed.user;
    token.value = parsed.token;
    loading.value = false;
  }

  async function logout() {
    await supabase.auth.signOut();
    user.value = null;
    token.value = null;
    localStorage.removeItem('sb-demo-session');
  }

  return { user, token, role, isAdmin, isAuthenticated, loading, setUser, logout };
});
