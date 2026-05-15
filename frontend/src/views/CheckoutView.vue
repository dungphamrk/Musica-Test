<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();

const step = ref(1);
const customerName = ref(authStore.user?.email.split('@')[0] || '');
const customerEmail = ref(authStore.user?.email || '');
const paymentMethod = ref('credit_card');
const loading = ref(false);

const nextStep = () => {
  if (step.value === 1 && (!customerName.value || !customerEmail.value)) {
    toast.add({ severity: 'warn', summary: 'Missing Info', detail: 'Please provide name and email', life: 3000 });
    return;
  }
  if (step.value < 3) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

async function submitCheckout() {
  loading.value = true;
  try {
    const { data } = await apiClient.post('/orders/checkout', {
      customerName: customerName.value.trim(),
      customerEmail: customerEmail.value.trim(),
      paymentMethod: paymentMethod.value,
    });
    
    toast.add({ severity: 'success', summary: 'Order Placed', detail: 'Thank you for your purchase!', life: 3000 });
    cartStore.clear();
    router.push('/checkout/success');
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Checkout Failed', detail: err.response?.data?.message || 'Try again later', life: 5000 });
  } finally {
    loading.value = false;
  }
}

const sponsors = [
  { name: 'Visa', icon: 'pi pi-credit-card' },
  { name: 'Mastercard', icon: 'pi pi-wallet' },
  { name: 'Stripe', icon: 'pi pi-external-link' },
  { name: 'PayPal', icon: 'pi pi-paypal' },
];
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
    <!-- Ambient Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none fixed">
      <div class="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-900/10 blur-[180px] rounded-full mix-blend-screen"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-900/10 blur-[180px] rounded-full mix-blend-screen"></div>
    </div>

    <!-- Navigation -->
    <div class="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-2xl">
      <div class="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
        <button @click="router.push('/cart')" class="flex items-center gap-3 text-slate-400 hover:text-white transition-all group">
          <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
            <i class="pi pi-arrow-left text-sm"></i>
          </div>
          Return to Cart
        </button>
        <div class="flex items-center gap-4">
          <div v-for="i in 3" :key="i" :class="['w-2 h-2 rounded-full transition-all duration-500', step >= i ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10']"></div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-5xl px-6 py-12 relative z-10">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-black text-white mb-4 tracking-tight">Secure Checkout</h1>
        <div class="flex items-center justify-center gap-8">
          <span :class="['text-sm font-bold uppercase tracking-widest transition-all', step === 1 ? 'text-indigo-400' : 'text-slate-600']">1. Information</span>
          <i class="pi pi-chevron-right text-slate-800"></i>
          <span :class="['text-sm font-bold uppercase tracking-widest transition-all', step === 2 ? 'text-indigo-400' : 'text-slate-600']">2. Payment</span>
          <i class="pi pi-chevron-right text-slate-800"></i>
          <span :class="['text-sm font-bold uppercase tracking-widest transition-all', step === 3 ? 'text-indigo-400' : 'text-slate-600']">3. Review</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-7 space-y-8">
          <!-- Step 1: Customer Info -->
          <div v-if="step === 1" class="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 class="text-2xl font-bold text-white mb-8">Contact Information</h2>
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                <input v-model="customerName" type="text" class="w-full bg-black/40 text-white border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 px-6 outline-none transition-all text-lg" placeholder="Enter your full name" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <input v-model="customerEmail" type="email" class="w-full bg-black/40 text-white border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 px-6 outline-none transition-all text-lg" placeholder="your@email.com" />
              </div>
            </div>
            <div class="mt-12 flex justify-end">
              <button @click="nextStep" class="px-10 py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2">
                Continue to Payment <i class="pi pi-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Step 2: Payment -->
          <div v-if="step === 2" class="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 class="text-2xl font-bold text-white mb-8">Choose Payment Method</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                @click="paymentMethod = 'credit_card'" 
                :class="['p-6 rounded-2xl border cursor-pointer transition-all flex flex-col gap-4', paymentMethod === 'credit_card' ? 'bg-indigo-500/10 border-indigo-500' : 'bg-black/40 border-white/5 hover:border-white/20']"
              >
                <i class="pi pi-credit-card text-2xl" :class="paymentMethod === 'credit_card' ? 'text-indigo-400' : 'text-slate-500'"></i>
                <div>
                  <div class="font-bold text-lg">Credit / Debit Card</div>
                  <div class="text-sm text-slate-500">All major cards accepted</div>
                </div>
              </div>
              <div 
                @click="paymentMethod = 'paypal'" 
                :class="['p-6 rounded-2xl border cursor-pointer transition-all flex flex-col gap-4', paymentMethod === 'paypal' ? 'bg-indigo-500/10 border-indigo-500' : 'bg-black/40 border-white/5 hover:border-white/20']"
              >
                <i class="pi pi-paypal text-2xl" :class="paymentMethod === 'paypal' ? 'text-indigo-400' : 'text-slate-500'"></i>
                <div>
                  <div class="font-bold text-lg">PayPal</div>
                  <div class="text-sm text-slate-500">Pay via your PayPal account</div>
                </div>
              </div>
            </div>
            
            <div class="mt-12 pt-8 border-t border-white/5">
              <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 text-center">Official Partners & Sponsors</p>
              <div class="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <div v-for="s in sponsors" :key="s.name" class="flex items-center gap-2">
                  <i :class="[s.icon, 'text-xl']"></i>
                  <span class="font-bold text-sm">{{ s.name }}</span>
                </div>
              </div>
            </div>

            <div class="mt-12 flex justify-between">
              <button @click="prevStep" class="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all">Back</button>
              <button @click="nextStep" class="px-10 py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2">
                Review Order <i class="pi pi-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Step 3: Review -->
          <div v-if="step === 3" class="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 class="text-2xl font-bold text-white mb-8">Review Your Order</h2>
            <div class="space-y-4">
              <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center py-4 border-b border-white/5">
                <div class="flex items-center gap-4">
                  <img :src="item.cover_image_url || ''" class="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <div class="font-bold">{{ item.title }}</div>
                    <div class="text-xs text-slate-500 uppercase tracking-widest">{{ item.license_type || 'Standard' }} License</div>
                  </div>
                </div>
                <div class="font-bold text-lg text-indigo-400">${{ item.price }}</div>
              </div>
            </div>
            <div class="mt-12 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-slate-400">Customer</span>
                <span class="text-white font-medium">{{ customerName }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-400">Payment</span>
                <span class="text-white font-medium uppercase tracking-wider">{{ paymentMethod.replace('_', ' ') }}</span>
              </div>
            </div>
            <div class="mt-12 flex justify-between">
              <button @click="prevStep" class="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all">Back</button>
              <button @click="submitCheckout" :disabled="loading" class="px-12 py-5 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center gap-3">
                <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                <span v-else>Confirm & Pay ${{ cartStore.subtotal.toFixed(2) }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar Summary -->
        <div class="lg:col-span-5">
          <div class="bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5 sticky top-28">
            <h3 class="text-xl font-bold text-white mb-8">Summary</h3>
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-slate-400">
                <span>Items ({{ cartStore.itemCount }})</span>
                <span class="text-white font-bold">${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-slate-400">
                <span>Digital Delivery</span>
                <span class="text-emerald-400 font-bold">FREE</span>
              </div>
              <div class="h-px bg-white/5 my-4"></div>
              <div class="flex justify-between items-end">
                <span class="text-white font-bold text-lg">Total</span>
                <span class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  ${{ cartStore.subtotal.toFixed(2) }}
                </span>
              </div>
            </div>
            <div class="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
              <div class="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <i class="pi pi-shield text-emerald-500"></i> Why shop with us?
              </div>
              <ul class="space-y-2 text-sm text-slate-400">
                <li class="flex items-start gap-2"><i class="pi pi-check text-indigo-400 mt-1"></i> Lifetime access to downloads</li>
                <li class="flex items-start gap-2"><i class="pi pi-check text-indigo-400 mt-1"></i> Commercial usage rights included</li>
                <li class="flex items-start gap-2"><i class="pi pi-check text-indigo-400 mt-1"></i> Professional high-res audio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

