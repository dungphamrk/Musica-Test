<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import apiClient from '../api';
import { useCartStore, type CartTrack } from '../stores/cart';

type Track = {
  id: string;
  asset_id: string;
  title: string;
  artist_name: string;
  composer: string;
  publisher: string;
  description: string;
  release_date: string;
  bpm: number;
  key: string;
  duration: number;
  genre: string[];
  mood: string[];
  use_case: string[];
  language: string;
  energy_level: string;
  vocal_type: string;
  theme: string[];
  preview_url: string;
  preview_duration: number;
  file_url: string | null;
  cover_image_url: string;
  price: number;
  currency: string;
  license_type: string;
  file_type: string;
  bitrate: number;
  sample_rate: number;
  file_size_mb: number;
  verification_status: string;
  certification_status: string;
  monetization_allowed: boolean;
  commercial_usage_allowed: boolean;
  sponsor_usage_allowed: boolean;
  ads_usage_allowed: boolean;
  personal_usage_allowed: boolean;
  youtube_allowed: boolean;
  youtube_shorts_allowed: boolean;
  youtube_long_form_allowed: boolean;
  territory: string;
};

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const toast = useToast();

const loading = ref(false);
const errorMessage = ref<string | null>(null);
const track = ref<Track | null>(null);

const id = computed(() => String(route.params.id || ''));

async function fetchDetail() {
  if (!id.value) return;
  loading.value = true;
  errorMessage.value = null;
  try {
    const { data } = await apiClient.get(`/tracks/${id.value}`);
    track.value = data ?? null;
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Failed to load track';
    track.value = null;
  } finally {
    loading.value = false;
  }
}

function addToCart(redirectToCart = true) {
  if (!track.value) return;
  const t: CartTrack = {
    id: track.value.id,
    title: track.value.title,
    artist_name: track.value.artist_name,
    duration: track.value.duration,
    genre: track.value.genre,
    mood: track.value.mood,
    preview_url: track.value.preview_url,
    cover_image_url: track.value.cover_image_url,
    price: track.value.price,
    currency: track.value.currency,
    license_type: track.value.license_type,
    quantity: 1,
  };
  cartStore.add(t);
  
  if (redirectToCart) {
    router.push('/cart');
  } else {
    toast.add({ severity: 'success', summary: 'Added to Cart', detail: `${track.value.title} has been added to your cart.`, life: 3000 });
  }
}

function buyNow() {
  addToCart(false);
  router.push('/checkout');
}

function backToLibrary() {
  router.push('/library');
}

onMounted(fetchDetail);
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-indigo-500/30 pb-20 relative overflow-hidden">
    <!-- Abstract Background Highlights -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[150px] rounded-full"></div>
      <div class="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
    </div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz4KPC9zdmc+')] opacity-50 pointer-events-none"></div>

    <!-- Navbar / Back -->
    <div class="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div class="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <button 
          @click="backToLibrary"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
        >
          <i class="pi pi-arrow-left"></i> Back to Library
        </button>
        <button 
          @click="router.push('/cart')"
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
        >
          <i class="pi pi-shopping-cart"></i> Cart
        </button>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 pt-8">
      <div v-if="errorMessage" class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 backdrop-blur-md mb-8">
        {{ errorMessage }}
      </div>

      <div v-if="loading" class="animate-pulse space-y-8">
        <div class="h-10 bg-white/5 rounded-xl w-1/3"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <div class="h-96 bg-white/5 rounded-2xl"></div>
            <div class="h-24 bg-white/5 rounded-2xl"></div>
          </div>
          <div class="h-96 bg-white/5 rounded-2xl"></div>
        </div>
      </div>

      <div v-else-if="track" class="space-y-8">
        <!-- Header -->
        <div class="space-y-2">
          <div class="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
            {{ track.asset_id }}
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold text-white">{{ track.title }}</h1>
          <p class="text-xl text-slate-400">{{ track.artist_name }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Cover & Audio -->
            <div class="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
              <img :src="track.cover_image_url" :alt="track.title" class="w-full h-[400px] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div class="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-black/40 border-t border-white/10">
                <div class="mb-3 flex items-center justify-between text-sm font-medium">
                  <span class="text-indigo-300">Preview Track ({{ track.preview_duration }}s)</span>
                  <span class="text-slate-400">High Quality Audio</span>
                </div>
                <audio :src="track.preview_url" controls class="w-full h-12 rounded-lg" />
              </div>
            </div>

            <!-- Description -->
            <div class="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-300 leading-relaxed text-lg">
              {{ track.description }}
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                <div class="text-slate-500 text-sm mb-1">Release Date</div>
                <div class="text-white font-semibold">{{ track.release_date }}</div>
              </div>
              <div class="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                <div class="text-slate-500 text-sm mb-1">Duration</div>
                <div class="text-white font-semibold">{{ track.duration }}s</div>
              </div>
              <div class="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                <div class="text-slate-500 text-sm mb-1">BPM</div>
                <div class="text-white font-semibold">{{ track.bpm }}</div>
              </div>
              <div class="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                <div class="text-slate-500 text-sm mb-1">Key</div>
                <div class="text-white font-semibold">{{ track.key }}</div>
              </div>
            </div>

            <!-- Detailed Specs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <i class="pi pi-tags text-indigo-400"></i> Creative Info
                </h3>
                <ul class="space-y-3 text-sm">
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Genre</span> <span class="text-slate-200">{{ track.genre.join(', ') }}</span></li>
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Mood</span> <span class="text-slate-200">{{ track.mood.join(', ') }}</span></li>
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Use Case</span> <span class="text-slate-200">{{ track.use_case.join(', ') }}</span></li>
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Language</span> <span class="text-slate-200">{{ track.language }}</span></li>
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Vocal</span> <span class="text-slate-200">{{ track.vocal_type }}</span></li>
                  <li class="flex justify-between pb-2"><span class="text-slate-500">Energy</span> <span class="text-slate-200">{{ track.energy_level }}</span></li>
                </ul>
              </div>

              <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <i class="pi pi-server text-indigo-400"></i> Technical Info
                </h3>
                <ul class="space-y-3 text-sm">
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Format</span> <span class="text-slate-200 uppercase">{{ track.file_type }}</span></li>
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Bitrate</span> <span class="text-slate-200">{{ track.bitrate }} kbps</span></li>
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Sample Rate</span> <span class="text-slate-200">{{ track.sample_rate }} Hz</span></li>
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Size</span> <span class="text-slate-200">{{ track.file_size_mb }} MB</span></li>
                  <li class="flex justify-between border-b border-white/5 pb-2"><span class="text-slate-500">Composer</span> <span class="text-slate-200">{{ track.composer }}</span></li>
                  <li class="flex justify-between pb-2"><span class="text-slate-500">Publisher</span> <span class="text-slate-200">{{ track.publisher }}</span></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Sidebar Purchasing -->
          <div class="space-y-6 sticky top-24">
            <!-- Purchase Card -->
            <div class="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
              <!-- Glow effect on hover -->
              <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div class="relative z-10">
              <div class="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">License Price</div>
              <div class="flex items-end gap-2 mb-1">
                <span class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">${{ track.price }}</span>
                <span class="text-xl text-slate-500 font-medium pb-1">{{ track.currency }}</span>
              </div>
              <div class="text-emerald-400 text-sm font-medium mb-6">
                <i class="pi pi-check-circle mr-1"></i> {{ track.license_type }} License Included
              </div>

              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="bg-black/30 rounded-xl p-3 border border-white/5">
                  <div class="text-xs text-slate-500 mb-1">Verification</div>
                  <div class="text-sm font-semibold text-white">{{ track.verification_status }}</div>
                </div>
                <div class="bg-black/30 rounded-xl p-3 border border-white/5">
                  <div class="text-xs text-slate-500 mb-1">Certification</div>
                  <div class="text-sm font-semibold text-white">{{ track.certification_status }}</div>
                </div>
              </div>

              <div class="space-y-3">
                <button 
                  @click="buyNow"
                  class="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2"
                >
                  <i class="pi pi-bolt"></i> Buy Now
                </button>
                <button 
                  @click="() => addToCart(false)"
                  class="w-full py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex justify-center items-center gap-2"
                >
                  <i class="pi pi-shopping-cart"></i> Add to Cart
                </button>
                
                <a 
                  v-if="track.file_url"
                  :href="track.file_url"
                  target="_blank"
                  rel="noreferrer"
                  class="w-full py-3 mt-4 rounded-xl font-medium text-slate-400 hover:text-white bg-transparent hover:bg-white/5 transition-all flex justify-center items-center gap-2"
                >
                  <i class="pi pi-download"></i> Download Original File
                </a>
              </div>
              </div>
            </div>

            <!-- Rights Card -->
            <div class="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 class="text-lg font-bold text-white border-b border-white/10 pb-3">Usage Rights</h3>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center justify-between">
                  <span class="text-slate-400">Monetization</span>
                  <i :class="track.monetization_allowed ? 'pi pi-check text-emerald-400' : 'pi pi-times text-red-400'"></i>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-slate-400">Commercial Use</span>
                  <i :class="track.commercial_usage_allowed ? 'pi pi-check text-emerald-400' : 'pi pi-times text-red-400'"></i>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-slate-400">Sponsorships</span>
                  <i :class="track.sponsor_usage_allowed ? 'pi pi-check text-emerald-400' : 'pi pi-times text-red-400'"></i>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-slate-400">Paid Ads</span>
                  <i :class="track.ads_usage_allowed ? 'pi pi-check text-emerald-400' : 'pi pi-times text-red-400'"></i>
                </li>
              </ul>
            </div>

            <!-- Platforms Card -->
            <div class="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 class="text-lg font-bold text-white border-b border-white/10 pb-3">Supported Platforms</h3>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center justify-between">
                  <span class="text-slate-400">YouTube</span>
                  <i :class="track.youtube_allowed ? 'pi pi-check text-emerald-400' : 'pi pi-times text-red-400'"></i>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-slate-400">YT Shorts</span>
                  <i :class="track.youtube_shorts_allowed ? 'pi pi-check text-emerald-400' : 'pi pi-times text-red-400'"></i>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-slate-400">Territory</span>
                  <span class="text-white font-medium">{{ track.territory }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="mt-8 text-center bg-white/5 rounded-2xl p-12 border border-white/10">
        <i class="pi pi-search text-4xl text-slate-500 mb-4"></i>
        <h3 class="text-xl font-medium text-white mb-2">Track not found</h3>
        <p class="text-slate-400 mb-6">The track you are looking for does not exist or has been removed.</p>
        <button 
          @click="backToLibrary"
          class="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
        >
          Return to Library
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
audio::-webkit-media-controls-panel {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
