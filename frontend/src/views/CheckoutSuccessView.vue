<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const result = computed(() => {
  const raw = sessionStorage.getItem('demo.checkout.result');
  return raw ? JSON.parse(raw) : null;
});
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-indigo-500/30 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-teal-600/10 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl text-center">
      <div class="w-24 h-24 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
        <i class="pi pi-check text-5xl text-emerald-400"></i>
      </div>
      
      <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-3">Payment Successful</h1>
      <p class="text-slate-400 mb-8">Thank you for your mock order. Your digital assets are ready.</p>

      <div class="bg-black/20 rounded-2xl border border-white/5 p-6 mb-8 text-left">
        <h3 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">Order Details</h3>
        
        <div v-if="result" class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <div class="text-slate-500 mb-1">Order ID</div>
            <div class="text-white font-medium font-mono">{{ result.orderId }}</div>
          </div>
          <div>
            <div class="text-slate-500 mb-1">Total Paid</div>
            <div class="text-emerald-400 font-bold">${{ result.total }}</div>
          </div>
          <div>
            <div class="text-slate-500 mb-1">Customer Name</div>
            <div class="text-white font-medium">{{ result.customerName }}</div>
          </div>
          <div>
            <div class="text-slate-500 mb-1">Email Address</div>
            <div class="text-white font-medium">{{ result.customerEmail }}</div>
          </div>
        </div>
        <div v-else class="text-slate-500 italic">Order details unavailable.</div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="router.push('/library')"
          class="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-compass"></i> Back to Catalog
        </button>
        <button 
          @click="router.push('/admin/tracks')"
          class="px-8 py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-cog"></i> Go to Admin
        </button>
      </div>
    </div>
  </div>
</template>
