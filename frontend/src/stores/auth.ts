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

  // Backward compatibility for components that manually set it (if any)
  function setUser(userData: { email: string; role?: AuthRole }, userToken: string) {
    user.value = { id: '', email: userData.email, role: userData.role ?? 'user' };
    token.value = userToken;
  }

  async function logout() {
    await supabase.auth.signOut();
    user.value = null;
    token.value = null;
  }

  return { user, token, role, isAdmin, isAuthenticated, loading, setUser, logout };
});
