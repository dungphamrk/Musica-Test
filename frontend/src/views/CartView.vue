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
  <div class="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
    <!-- Ambient glowing backgrounds -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none fixed">
      <div class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-fuchsia-900/20 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
      <div class="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60vw] h-[20vw] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
    </div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz4KPC9zdmc+')] opacity-40 pointer-events-none fixed"></div>

    <!-- Navigation Header -->
    <div class="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-2xl">
      <div class="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <button 
          @click="backToLibrary"
          class="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-medium group"
        >
          <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:-translate-x-1 transition-all">
            <i class="pi pi-arrow-left text-sm"></i>
          </div>
          Continue Shopping
        </button>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-6 py-12 relative z-10">
      <div class="flex items-end justify-between mb-12">
        <div>
          <h1 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-3 tracking-tight">Your Cart</h1>
          <p class="text-lg text-slate-400 font-medium">Review your handpicked audio assets before finalizing.</p>
        </div>
        <button
          v-if="hasItems"
          @click="cartStore.clear()"
          class="text-sm font-bold text-red-400 hover:text-white hover:bg-red-500 transition-all flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/5"
        >
          <i class="pi pi-trash"></i> Empty Cart
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!hasItems" class="text-center py-32 bg-white/[0.02] backdrop-blur-sm rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div class="w-32 h-32 mx-auto bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
          <i class="pi pi-shopping-bag text-5xl text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.5)]"></i>
        </div>
        <h3 class="text-3xl font-extrabold text-white mb-3">Your cart is empty</h3>
        <p class="text-slate-400 mb-10 text-lg">Your next masterpiece is waiting for the perfect sound.</p>
        <button 
          @click="backToLibrary"
          class="px-10 py-4 rounded-2xl font-black text-white bg-white/10 hover:bg-white border border-white/20 hover:text-black shadow-2xl transition-all duration-300 hover:scale-105"
        >
          Explore the Catalog
        </button>
      </div>

      <!-- Filled Cart -->
      <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <!-- Cart Items List -->
        <div class="xl:col-span-8 space-y-5">
          <div 
            v-for="t in cartStore.items" 
            :key="t.id" 
            class="flex flex-col sm:flex-row gap-6 p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-300 group relative"
          >
            <!-- Glowing effect behind item -->
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-[2rem] pointer-events-none transition-opacity duration-500"></div>
            
            <div class="relative w-full sm:w-36 h-36 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/10 group-hover:border-indigo-500/50 transition-colors">
              <img
                v-if="t.cover_image_url"
                :src="t.cover_image_url"
                :alt="t.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity"></div>
              <!-- Play icon overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer hover:bg-white hover:text-black transition-colors">
                  <i class="pi pi-play ml-1"></i>
                </div>
              </div>
            </div>
            
            <div class="flex-1 flex flex-col py-2 relative z-10">
              <div class="flex justify-between items-start mb-1">
                <div>
                  <h3 class="text-2xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors" @click="router.push(`/tracks/${t.id}`)">
                    {{ t.title }}
                  </h3>
                  <p class="text-indigo-300 text-base font-medium">{{ t.artist_name || 'Premium Artist' }}</p>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-teal-500">${{ (t.price * t.quantity).toFixed(2) }}</div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mt-4 mb-4">
                <span class="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {{ t.license_type || 'Standard License' }}
                </span>
                <span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  High-Res Audio
                </span>
              </div>

              <div class="flex items-center gap-4 mt-auto">
                <button 
                  @click="router.push(`/tracks/${t.id}`)"
                  class="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                  View Track Details
                </button>
                <div class="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                <button 
                  @click="cartStore.remove(t.id)"
                  class="text-sm font-bold text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <i class="pi pi-trash text-xs"></i> Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="xl:col-span-4">
          <div class="bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 sticky top-28 shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500">
            <!-- Sidebar ambient -->
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[60px] rounded-full group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
            
            <h3 class="text-2xl font-extrabold text-white mb-8 relative z-10">Summary</h3>
            
            <div class="space-y-5 mb-8 relative z-10 text-lg">
              <div class="flex justify-between text-slate-400 font-medium">
                <span>Subtotal ({{ cartStore.itemCount }} items)</span>
                <span class="text-white">{{ subtotalLabel }}</span>
              </div>
              <div class="flex justify-between text-slate-400 font-medium">
                <span>License Coverage</span>
                <span class="text-emerald-400">Worldwide</span>
              </div>
              <div class="flex justify-between text-slate-400 font-medium">
                <span>Taxes</span>
                <span class="text-slate-500">Calculated next step</span>
              </div>
              
              <div class="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6"></div>
              
              <div class="flex justify-between items-end">
                <span class="text-white font-bold text-xl">Total Due</span>
                <span class="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{{ subtotalLabel }}</span>
              </div>
            </div>

            <button 
              @click="router.push('/checkout')"
              class="w-full py-5 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-[position:right_center] shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all duration-500 flex justify-center items-center gap-3 relative z-10 hover:-translate-y-1"
            >
              Checkout Securely <i class="pi pi-arrow-right"></i>
            </button>
            
            <div class="mt-8 flex justify-center gap-4 relative z-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <!-- Placeholder payment icons -->
              <div class="px-3 py-1.5 bg-white rounded flex items-center justify-center">
                <span class="text-blue-900 font-black italic text-xs tracking-tighter">VISA</span>
              </div>
              <div class="px-3 py-1.5 bg-white rounded flex items-center justify-center relative overflow-hidden">
                <div class="w-4 h-4 rounded-full bg-red-500 mix-blend-multiply absolute -translate-x-1.5"></div>
                <div class="w-4 h-4 rounded-full bg-yellow-500 mix-blend-multiply absolute translate-x-1.5"></div>
              </div>
              <div class="px-3 py-1.5 bg-black border border-white/20 rounded flex items-center justify-center">
                <span class="text-white font-bold text-xs tracking-tighter">Pay<span class="text-blue-400">Pal</span></span>
              </div>
            </div>
            <p class="text-center text-xs font-medium text-slate-500 mt-6 flex items-center justify-center gap-2 relative z-10">
              <i class="pi pi-lock text-emerald-500"></i> 256-bit SSL Encrypted Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
