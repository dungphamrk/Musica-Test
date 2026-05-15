<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const hasItems = computed(() => cartStore.items.length > 0);
const subtotalLabel = computed(() => `$${cartStore.subtotal.toFixed(2)}`);

function backToLibrary() {
  router.push('/library');
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
    <!-- Abstract Background Highlights -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none fixed">
      <div class="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[150px] rounded-full"></div>
    </div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz4KPC9zdmc+')] opacity-50 pointer-events-none fixed"></div>

    <div class="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div class="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <button 
          @click="backToLibrary"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
        >
          <i class="pi pi-arrow-left"></i> Continue Shopping
        </button>
      </div>
    </div>

    <div class="mx-auto max-w-5xl px-4 py-8 relative z-10">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h1 class="text-4xl font-extrabold text-white mb-2">Your Cart</h1>
          <p class="text-slate-400">Review your selected tracks before checkout.</p>
        </div>
        <button
          v-if="hasItems"
          @click="cartStore.clear()"
          class="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <i class="pi pi-trash"></i> Clear Cart
        </button>
      </div>

      <div v-if="!hasItems" class="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
        <div class="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
          <i class="pi pi-shopping-cart text-4xl text-slate-500"></i>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">Your cart is empty</h3>
        <p class="text-slate-400 mb-8">Looks like you haven't added any tracks yet.</p>
        <button 
          @click="backToLibrary"
          class="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all"
        >
          Discover Tracks
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div 
            v-for="t in cartStore.items" 
            :key="t.id" 
            class="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div class="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0">
              <img
                v-if="t.cover_image_url"
                :src="t.cover_image_url"
                :alt="t.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>
            
            <div class="flex-1 flex flex-col py-1">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="text-lg font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors" @click="router.push(`/tracks/${t.id}`)">
                    {{ t.title }}
                  </h3>
                  <p class="text-slate-400 text-sm">{{ t.artist_name || 'Unknown Artist' }}</p>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold text-emerald-400">${{ (t.price * t.quantity).toFixed(2) }}</div>
                  <div class="text-xs text-slate-500">Qty: {{ t.quantity }}</div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mt-auto mb-4">
                <span v-if="t.genre?.length" class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                  {{ t.genre[0] }}
                </span>
                <span v-if="t.duration" class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                  {{ t.duration }}s
                </span>
                <span v-if="t.license_type" class="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                  {{ t.license_type }} License
                </span>
              </div>

              <div class="flex items-center gap-3 mt-auto">
                <button 
                  @click="router.push(`/tracks/${t.id}`)"
                  class="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  View Details
                </button>
                <div class="w-px h-4 bg-white/10"></div>
                <button 
                  @click="cartStore.remove(t.id)"
                  class="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                >
                  <i class="pi pi-times"></i> Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white/5 rounded-3xl p-6 border border-white/10 sticky top-24">
            <h3 class="text-xl font-bold text-white mb-6">Order Summary</h3>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-slate-300">
                <span>Items ({{ cartStore.itemCount }})</span>
                <span class="font-medium text-white">{{ subtotalLabel }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Payment Method</span>
                <span class="font-medium text-white">Mock Checkout</span>
              </div>
              <div class="w-full h-px bg-white/10"></div>
              <div class="flex justify-between items-end">
                <span class="text-white font-medium">Total</span>
                <span class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">{{ subtotalLabel }}</span>
              </div>
            </div>

            <button 
              @click="router.push('/checkout')"
              class="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2"
            >
              Proceed to Checkout <i class="pi pi-arrow-right ml-1"></i>
            </button>
            
            <p class="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
              <i class="pi pi-lock"></i> Secure SSL Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
