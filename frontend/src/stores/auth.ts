import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

type AuthRole = 'user' | 'admin';

type AuthSession = {
  email: string;
  role: AuthRole;
  token: string;
};

const storageKey = 'supabase.auth.session';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ email: string; role: AuthRole } | null>(null);
  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const role = computed<AuthRole>(() => user.value?.role ?? 'user');
  const isAdmin = computed(() => role.value === 'admin');

  const raw = localStorage.getItem(storageKey);
  if (raw) {
    try {
      const session = JSON.parse(raw) as AuthSession;
      token.value = session.token;
      user.value = { email: session.email, role: session.role };
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  function persist(session: AuthSession) {
    localStorage.setItem(storageKey, JSON.stringify(session));
  }

  function setUser(userData: { email: string; role?: AuthRole }, userToken: string) {
    const nextRole = userData.role ?? 'user';
    user.value = userData;
    token.value = userToken;
    persist({ email: userData.email, role: nextRole, token: userToken });
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem(storageKey);
  }

  return { user, token, role, isAdmin, isAuthenticated, setUser, logout };
});
