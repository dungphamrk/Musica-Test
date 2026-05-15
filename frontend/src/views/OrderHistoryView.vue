<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const orders = ref<any[]>([]);
const loading = ref(true);

const fetchHistory = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get('/orders/history');
    orders.value = data;
  } catch (error) {
    console.error('Failed to fetch history', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchHistory);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-slate-200 font-sans p-6">
    <div class="mx-auto max-w-5xl">
      <div class="flex items-center justify-between mb-12">
        <h1 class="text-4xl font-black text-white tracking-tight">Order History</h1>
        <button @click="router.push('/library')" class="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold">Back to Library</button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <i class="pi pi-spin pi-spinner text-3xl text-indigo-500"></i>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading your orders...</p>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
        <i class="pi pi-history text-5xl text-slate-700 mb-6"></i>
        <h3 class="text-2xl font-bold text-white mb-2">No orders found</h3>
        <p class="text-slate-400 mb-8">You haven't purchased any tracks yet.</p>
        <button @click="router.push('/library')" class="px-8 py-3 rounded-xl bg-indigo-600 font-bold text-white">Start Shopping</button>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:border-white/10 transition-all group">
          <div class="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-6 border-b border-white/5">
            <div>
              <div class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Order ID</div>
              <div class="text-sm font-mono text-indigo-300">{{ order.id }}</div>
            </div>
            <div>
              <div class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Date</div>
              <div class="text-sm font-bold text-white">{{ formatDate(order.created_at) }}</div>
            </div>
            <div>
              <div class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Status</div>
              <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                {{ order.status }}
              </span>
            </div>
            <div>
              <div class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Total Paid</div>
              <div class="text-2xl font-black text-white">${{ Number(order.total_amount).toFixed(2) }}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in order.order_items" :key="item.track_id" class="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
              <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <i class="pi pi-music text-indigo-400"></i>
              </div>
              <div class="flex-1">
                <div class="font-bold text-white text-sm">Track ID: {{ item.track_id }}</div>
                <div class="text-xs text-slate-500 uppercase tracking-widest">{{ item.license_type }} License</div>
              </div>
              <div class="text-sm font-bold text-emerald-400">${{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
