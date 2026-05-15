<script setup lang="ts">
import { useMouse } from '@vueuse/core';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const { x, y } = useMouse();
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const goToLibrary = () => {
  router.push('/library');
};
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden flex flex-col items-center justify-center p-4">
    <!-- Abstract Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
      <div class="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]"></div>
    </div>

    <div class="relative z-10 bg-white/5 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/10 max-w-xl w-full text-center space-y-8">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          System Online
        </div>
        <button 
          @click="handleLogout" 
          class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          title="Logout"
        >
          <i class="pi pi-power-off"></i>
        </button>
      </div>

      <div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Welcome Back
        </h1>
        <p class="text-lg text-slate-400">
          Hello, <strong class="text-white font-medium">{{ authStore.user?.email || 'Guest' }}</strong>. You are connected.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 text-left">
        <div class="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors group">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400 group-hover:scale-110 transition-transform">
            <i class="pi pi-database text-lg"></i>
          </div>
          <div class="text-sm text-slate-400 mb-1">Database</div>
          <div class="font-bold text-white text-lg">Supabase</div>
        </div>
        <div class="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors group">
          <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 text-purple-400 group-hover:scale-110 transition-transform">
            <i class="pi pi-server text-lg"></i>
          </div>
          <div class="text-sm text-slate-400 mb-1">Backend</div>
          <div class="font-bold text-white text-lg">NestJS</div>
        </div>
      </div>

      <div class="p-5 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Cursor Position</p>
          <p class="text-xl font-mono text-indigo-300 font-medium">X: {{ x.toFixed(0) }} <span class="text-slate-600">|</span> Y: {{ y.toFixed(0) }}</p>
        </div>
        <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500">
          <i class="pi pi-compass text-xl"></i>
        </div>
      </div>

      <button 
        @click="goToLibrary"
        class="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2 text-lg"
      >
        <i class="pi pi-music"></i> Open Library
      </button>
    </div>
  </div>
</template>
