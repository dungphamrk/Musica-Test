import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import apiClient from '../api';
import { useAuthStore } from './auth';

export type CartTrack = {
  id: string;
  title: string;
  artist_name?: string | null;
  duration?: number | null;
  genre?: string[] | null;
  mood?: string[] | null;
  preview_url?: string | null;
  cover_image_url?: string | null;
  price: number;
  currency: string;
  license_type?: string | null;
  quantity: number;
};

const storageKey = 'demo.cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartTrack[]>([]);
  const authStore = useAuthStore();
  const loading = ref(false);

  async function hydrate() {
    if (authStore.isAuthenticated) {
      loading.value = true;
      try {
        const { data } = await apiClient.get('/cart');
        items.value = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          artist_name: item.artist_name,
          cover_image_url: item.cover_image_url,
          price: Number(item.price),
          quantity: 1,
          currency: 'USD'
        }));
      } catch (error) {
        console.error('Failed to load cart from DB', error);
      } finally {
        loading.value = false;
      }
    } else {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as CartTrack[];
          items.value = Array.isArray(parsed) ? parsed : [];
        } catch {
          items.value = [];
        }
      }
    }
  }

  function persistLocal() {
    if (!authStore.isAuthenticated) {
      localStorage.setItem(storageKey, JSON.stringify(items.value));
    }
  }

  async function add(track: CartTrack) {
    const existing = items.value.find((x) => x.id === track.id);
    if (!existing) {
      items.value = [...items.value, { ...track, quantity: 1 }];
    }
    
    if (authStore.isAuthenticated) {
      try {
        await apiClient.post('/cart/items', { trackId: track.id, price: track.price });
      } catch (error) {
        console.error('Failed to sync add to cart', error);
      }
    } else {
      persistLocal();
    }
  }

  async function remove(id: string) {
    items.value = items.value.filter((x) => x.id !== id);
    
    if (authStore.isAuthenticated) {
      try {
        await apiClient.delete(`/cart/items/${id}`);
      } catch (error) {
        console.error('Failed to sync remove from cart', error);
      }
    } else {
      persistLocal();
    }
  }

  async function clear() {
    const trackIds = items.value.map(i => i.id);
    items.value = [];
    
    if (authStore.isAuthenticated) {
      try {
        await Promise.all(trackIds.map(id => apiClient.delete(`/cart/items/${id}`)));
      } catch (error) {
        console.error('Failed to sync clear cart', error);
      }
    } else {
      persistLocal();
    }
  }

  // Auto-sync when auth state changes (login)
  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
      hydrate();
    } else {
      items.value = [];
    }
  });

  const count = computed(() => items.value.length);
  const itemCount = computed(() => items.value.reduce((sum, item) => sum + 1, 0)); // 1 per track since digital
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.price, 0));

  return { items, count, itemCount, subtotal, loading, hydrate, add, remove, clear };
});
