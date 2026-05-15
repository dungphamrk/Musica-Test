import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

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

  function hydrate() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CartTrack[];
      items.value = Array.isArray(parsed) ? parsed : [];
    } catch {
      items.value = [];
    }
  }

  function persist() {
    localStorage.setItem(storageKey, JSON.stringify(items.value));
  }

  function add(track: CartTrack) {
    const existing = items.value.find((x) => x.id === track.id);
    if (existing) {
      items.value = items.value.map((item) =>
        item.id === track.id ? { ...item, quantity: item.quantity + (track.quantity || 1) } : item,
      );
      persist();
      return;
    }
    items.value = [...items.value, track];
    persist();
  }

  function remove(id: string) {
    items.value = items.value.filter((x) => x.id !== id);
    persist();
  }

  function clear() {
    items.value = [];
    persist();
  }

  const count = computed(() => items.value.length);
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + Math.max(item.quantity || 1, 1), 0),
  );
  const subtotal = computed(() =>
    items.value.reduce(
      (sum, item) => sum + item.price * Math.max(item.quantity || 1, 1),
      0,
    ),
  );

  return { items, count, itemCount, subtotal, hydrate, add, remove, clear };
});
