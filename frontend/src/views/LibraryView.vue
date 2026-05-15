<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import apiClient from '../api';
import { useAuthStore } from '../stores/auth';
import { useCartStore, type CartTrack } from '../stores/cart';

type TrackCard = {
  id: string;
  asset_id: string;
  title: string;
  artist_name: string;
  cover_image_url: string;
  price: number;
  currency: string;
  genre: string[];
  mood: string[];
  use_case: string[];
  duration: number;
  bpm: number;
  verification_status: string;
  commercial_allowed: boolean;
  youtube_allowed: boolean;
};

type FilterMeta = {
  genres: string[];
  moods: string[];
  useCases: string[];
  vocalTypes: string[];
  languages: string[];
  energyLevels: string[];
  stats: {
    total: number;
    minDuration: number;
    maxDuration: number;
    minPrice: number;
    maxPrice: number;
    minBpm: number;
    maxBpm: number;
  };
};

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const toast = useToast();

const loading = ref(false);
const filtersLoading = ref(false);
const errorMessage = ref<string | null>(null);
const items = ref<TrackCard[]>([]);
const filterMeta = ref<FilterMeta | null>(null);

const keyword = ref('');
const selectedGenres = ref<string[]>([]);
const selectedMoods = ref<string[]>([]);
const selectedUseCases = ref<string[]>([]);
const selectedLanguages = ref<string[]>([]);
const selectedEnergyLevels = ref<string[]>([]);
const selectedVocalTypes = ref<string[]>([]);
const sort = ref<{ label: string; value: string }>({ label: 'Newest', value: 'new' });
const page = ref(1);
const pageSize = 12;
const total = ref(0);

const sortOptions = [
  { label: 'Newest', value: 'new' },
  { label: 'Trending', value: 'trending' },
  { label: 'Most Downloaded', value: 'most_downloaded' },
  { label: 'Price Low To High', value: 'price_low_to_high' },
  { label: 'Price High To Low', value: 'price_high_to_low' },
];

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));
const visiblePages = computed(() => {
  const current = page.value;
  const totalP = totalPages.value;
  let pages = [];
  if (totalP <= 5) {
    for (let i = 1; i <= totalP; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages = [1, 2, 3, 4, 5];
    } else if (current >= totalP - 2) {
      pages = [totalP - 4, totalP - 3, totalP - 2, totalP - 1, totalP];
    } else {
      pages = [current - 2, current - 1, current, current + 1, current + 2];
    }
  }
  return pages;
});

function buildParams() {
  const params: Record<string, string> = {
    page: String(page.value),
    pageSize: String(pageSize),
    sort: sort.value.value,
  };

  if (keyword.value.trim()) params.q = keyword.value.trim();
  if (selectedGenres.value.length) params.genre = selectedGenres.value.join(',');
  if (selectedMoods.value.length) params.mood = selectedMoods.value.join(',');
  if (selectedUseCases.value.length) params.useCase = selectedUseCases.value.join(',');
  if (selectedLanguages.value.length) params.language = selectedLanguages.value.join(',');
  if (selectedEnergyLevels.value.length) params.energyLevel = selectedEnergyLevels.value.join(',');
  if (selectedVocalTypes.value.length) params.vocalType = selectedVocalTypes.value.join(',');

  return params;
}

async function fetchFilters() {
  filtersLoading.value = true;
  try {
    const { data } = await apiClient.get('/tracks/filters');
    filterMeta.value = data;
  } finally {
    filtersLoading.value = false;
  }
}

async function fetchTracks() {
  loading.value = true;
  errorMessage.value = null;
  try {
    const { data } = await apiClient.get('/tracks', { params: buildParams() });
    items.value = data.data ?? [];
    total.value = data.total ?? 0;
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Failed to load tracks';
    items.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  page.value = 1;
  fetchTracks();
}

watchDebounced(
  keyword,
  () => {
    applyFilters();
  },
  { debounce: 500 }
);

watch(
  [selectedGenres, selectedMoods, selectedUseCases, selectedLanguages, selectedEnergyLevels, selectedVocalTypes, sort],
  () => {
    applyFilters();
  },
  { deep: true }
);

function clearFilters() {
  selectedGenres.value = [];
  selectedMoods.value = [];
  selectedUseCases.value = [];
  selectedLanguages.value = [];
  selectedEnergyLevels.value = [];
  selectedVocalTypes.value = [];
  keyword.value = '';
  page.value = 1;
  fetchTracks();
}

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    page.value = p;
    fetchTracks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function addToCart(track: TrackCard, event: Event) {
  event.stopPropagation();
  const item: CartTrack = {
    id: track.id,
    title: track.title,
    artist_name: track.artist_name,
    duration: track.duration,
    genre: track.genre,
    mood: track.mood,
    preview_url: null,
    cover_image_url: track.cover_image_url,
    price: track.price,
    currency: track.currency,
    license_type: 'Standard',
    quantity: 1,
  };
  cartStore.add(item);
  toast.add({ severity: 'success', summary: 'Added to Cart', detail: `${track.title} has been added to your cart.`, life: 3000 });
}

function viewDetail(trackId: string) {
  router.push(`/tracks/${trackId}`);
}

onMounted(async () => {
  await Promise.all([fetchFilters(), fetchTracks()]);
});
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
    <!-- Abstract Background Highlights -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none fixed">
      <div class="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[150px] rounded-full"></div>
      <div class="absolute top-[50%] left-[40%] w-[20%] h-[20%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
    </div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz4KPC9zdmc+')] opacity-50 pointer-events-none fixed"></div>

    <!-- Hero Section -->
    <div class="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-2xl z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none"></div>
      <div class="mx-auto max-w-7xl px-4 py-8 relative z-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Premium Audio
              </span> Collection
            </h1>
            <p class="text-lg text-slate-400">
              Discover world-class, royalty-free tracks for your next big project. Elevate your content with the perfect sound.
            </p>
          </div>
          <div class="flex gap-3">
            <Button 
              label="View Cart" 
              icon="pi pi-shopping-cart" 
              class="p-button-rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors" 
              @click="router.push('/cart')" 
            />
            <Button
              v-if="authStore.isAdmin"
              label="Admin Panel"
              icon="pi pi-cog"
              class="p-button-rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
              @click="router.push('/admin/tracks')"
            />
          </div>
        </div>

        <!-- Search Bar -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white/5 p-3 rounded-2xl border border-white/10">
          <div class="md:col-span-8 relative group">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input
              v-model="keyword"
              type="text"
              placeholder="Search title, artist, mood..."
              class="w-full bg-black/20 text-white border border-transparent focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-500"
            />
          </div>
          <div class="md:col-span-4">
            <Dropdown v-model="sort" :options="sortOptions" optionLabel="label" class="w-full bg-black/20 border-transparent text-white rounded-xl h-full flex items-center py-1" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 xl:grid-cols-4 gap-8 relative z-10">
      
      <!-- Filters Sidebar -->
      <aside class="xl:col-span-1 space-y-6">
        <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Filters</h2>
            <button @click="clearFilters" class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Clear All</button>
          </div>

          <div v-if="filtersLoading" class="animate-pulse space-y-4">
            <div class="h-10 bg-white/10 rounded-xl w-full"></div>
            <div class="h-10 bg-white/10 rounded-xl w-full"></div>
            <div class="h-10 bg-white/10 rounded-xl w-full"></div>
          </div>

          <div v-else class="space-y-5">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Genre</label>
              <MultiSelect v-model="selectedGenres" :options="filterMeta?.genres ?? []" placeholder="Select Genres" class="w-full bg-black/20 border-white/10 rounded-xl" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Mood</label>
              <MultiSelect v-model="selectedMoods" :options="filterMeta?.moods ?? []" placeholder="Select Moods" class="w-full bg-black/20 border-white/10 rounded-xl" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Use Case</label>
              <MultiSelect v-model="selectedUseCases" :options="filterMeta?.useCases ?? []" placeholder="Select Use Cases" class="w-full bg-black/20 border-white/10 rounded-xl" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Energy Level</label>
              <MultiSelect v-model="selectedEnergyLevels" :options="filterMeta?.energyLevels ?? []" placeholder="Select Energy" class="w-full bg-black/20 border-white/10 rounded-xl" />
            </div>
          </div>
        </div>
      </aside>

      <!-- Track Grid -->
      <section class="xl:col-span-3">
        <div class="flex items-center justify-between mb-6">
          <div class="text-slate-400">
            Found <span class="text-white font-semibold">{{ total }}</span> tracks
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 backdrop-blur-md">
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse bg-white/5 border border-white/10 rounded-2xl h-80"></div>
        </div>

        <div v-else-if="items.length === 0" class="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
          <i class="pi pi-inbox text-4xl text-slate-500 mb-4"></i>
          <h3 class="text-xl font-medium text-white mb-2">No tracks found</h3>
          <p class="text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
          <button @click="clearFilters" class="mt-4 text-indigo-400 hover:text-indigo-300">Clear all filters</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="track in items" 
            :key="track.id" 
            @click="viewDetail(track.id)"
            class="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden cursor-pointer hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ease-out"
          >
            <!-- Image Section -->
            <div class="relative h-48 overflow-hidden bg-black/50">
              <img :src="track.cover_image_url" :alt="track.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <!-- Hover Play Overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                <div class="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <i class="pi pi-play ml-1"></i>
                </div>
              </div>

              <!-- Top badges -->
              <div class="absolute top-3 right-3 flex gap-2">
                <span class="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/10">
                  {{ track.duration }}s
                </span>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-5 flex-1 flex flex-col">
              <div class="flex justify-between items-start mb-2">
                <div class="min-w-0 pr-3">
                  <h3 class="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{{ track.title }}</h3>
                  <p class="text-sm text-slate-400 truncate">{{ track.artist_name }}</p>
                </div>
                <div class="text-right shrink-0">
                  <div class="text-lg font-bold text-emerald-400">${{ track.price }}</div>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 mt-3">
                <span v-if="track.genre[0]" class="px-2 py-0.5 rounded-md bg-white/10 text-xs text-slate-300">{{ track.genre[0] }}</span>
                <span v-if="track.mood[0]" class="px-2 py-0.5 rounded-md bg-white/10 text-xs text-slate-300">{{ track.mood[0] }}</span>
                <span v-if="track.bpm" class="px-2 py-0.5 rounded-md bg-white/10 text-xs text-slate-300">{{ track.bpm }} BPM</span>
              </div>

              <div class="mt-auto pt-5 flex gap-2">
                <button 
                  @click="(e) => addToCart(track, e)"
                  class="w-full bg-white/10 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 border border-white/10 hover:border-transparent text-white rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <i class="pi pi-shopping-cart group-hover/btn:scale-110 transition-transform"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1 && !loading" class="mt-12 flex items-center justify-center gap-2">
          <button 
            @click="goToPage(page - 1)" 
            :disabled="page === 1"
            class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <i class="pi pi-chevron-left"></i>
          </button>
          
          <button 
            v-for="p in visiblePages" 
            :key="p"
            @click="goToPage(p)"
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all duration-300',
              page === p 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 border-transparent' 
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            ]"
          >
            {{ p }}
          </button>
          
          <button 
            @click="goToPage(page + 1)" 
            :disabled="page === totalPages"
            class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>

      </section>
    </div>
  </div>
</template>

<style scoped>
/* Custom PrimeVue Overrides for MultiSelect & Dropdown inside dark theme */
:deep(.p-multiselect), :deep(.p-dropdown) {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
}
:deep(.p-multiselect:not(.p-disabled):hover), :deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: rgba(99, 102, 241, 0.5); /* indigo-500 */
}
:deep(.p-multiselect-label), :deep(.p-dropdown-label) {
  color: white;
}
:deep(.p-multiselect-panel), :deep(.p-dropdown-panel) {
  background: #1e293b; /* slate-800 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 0.75rem;
  overflow: hidden;
}
:deep(.p-multiselect-item), :deep(.p-dropdown-item) {
  color: #cbd5e1; /* slate-300 */
}
:deep(.p-multiselect-item:not(.p-highlight):not(.p-disabled):hover), :deep(.p-dropdown-item:not(.p-highlight):not(.p-disabled):hover) {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}
:deep(.p-multiselect-item.p-highlight), :deep(.p-dropdown-item.p-highlight) {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8; /* indigo-400 */
}
:deep(.p-multiselect-header) {
  background: #0f172a; /* slate-900 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
:deep(.p-checkbox-box) {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
:deep(.p-checkbox.p-highlight .p-checkbox-box) {
  background: #6366f1;
  border-color: #6366f1;
}
</style>
