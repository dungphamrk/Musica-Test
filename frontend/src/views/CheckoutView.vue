<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const customerName = ref('');
const customerEmail = ref('');
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const canSubmit = computed(
  () =>
    cartStore.items.length > 0 &&
    customerName.value.trim().length > 0 &&
    customerEmail.value.trim().length > 0,
);

async function submitCheckout() {
  if (!canSubmit.value) return;
  loading.value = true;
  errorMessage.value = null;
  try {
    const { data } = await apiClient.post('/checkout/mock', {
      customerName: customerName.value.trim(),
      customerEmail: customerEmail.value.trim(),
      items: cartStore.items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        license_type: item.license_type,
      })),
    });
    sessionStorage.setItem('demo.checkout.result', JSON.stringify(data));
    cartStore.clear();
    router.push('/checkout/success');
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Checkout failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
    <!-- Abstract Background Highlights -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none fixed">
      <div class="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-teal-600/10 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[150px] rounded-full"></div>
    </div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz4KPC9zdmc+')] opacity-50 pointer-events-none fixed"></div>

    <div class="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div class="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <button 
          @click="router.push('/cart')"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
        >
          <i class="pi pi-arrow-left"></i> Back to Cart
        </button>
      </div>
    </div>

    <div class="mx-auto max-w-5xl px-4 py-8 relative z-10">
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold text-white mb-2">Checkout</h1>
        <p class="text-slate-400">Complete your secure mock order.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Billing Details -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white/5 rounded-3xl p-8 border border-white/10">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <i class="pi pi-user text-indigo-400"></i> Billing Information
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-400">Full Name</label>
                <input 
                  v-model="customerName" 
                  type="text" 
                  class="w-full bg-black/20 text-white border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 px-4 outline-none transition-all placeholder:text-slate-600" 
                  placeholder="John Doe" 
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-400">Email Address</label>
                <input 
                  v-model="customerEmail" 
                  type="email" 
                  class="w-full bg-black/20 text-white border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 px-4 outline-none transition-all placeholder:text-slate-600" 
                  placeholder="john@example.com" 
                />
              </div>
            </div>

            <div v-if="errorMessage" class="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 backdrop-blur-md">
              <i class="pi pi-exclamation-circle mr-2"></i> {{ errorMessage }}
            </div>
          </div>
        </div>

        <!-- Summary & Pay -->
        <div class="lg:col-span-1">
          <div class="bg-white/5 rounded-3xl p-6 border border-white/10 sticky top-24 shadow-2xl shadow-indigo-500/5">
            <h3 class="text-xl font-bold text-white mb-6">Order Summary</h3>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-slate-300">
                <span>Total Items</span>
                <span class="font-medium text-white">{{ cartStore.itemCount }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span class="font-medium text-white">${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div class="w-full h-px bg-white/10"></div>
              <div class="flex justify-between items-end">
                <span class="text-white font-medium">Total</span>
                <span class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                  ${{ cartStore.subtotal.toFixed(2) }}
                </span>
              </div>
            </div>

            <button 
              @click="submitCheckout"
              :disabled="!canSubmit || loading"
              class="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="pi pi-spin pi-spinner"></i>
              <span v-else><i class="pi pi-check-circle mr-1"></i> Pay Mock Order</span>
            </button>
            
            <div class="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <i class="pi pi-shield"></i> SSL Secured Transaction
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
