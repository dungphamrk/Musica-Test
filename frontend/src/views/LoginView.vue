<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const selectedRole = ref<'admin' | 'user'>('user');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  // Giả lập delay một chút cho chuyên nghiệp
  setTimeout(() => {
    authStore.setDemoUser(selectedRole.value);
    router.push('/library');
    loading.value = false;
  }, 800);
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 relative flex items-center justify-center p-6 overflow-hidden">
    <!-- Ambient Backgrounds -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none fixed">
      <div class="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-900/10 blur-[180px] rounded-full mix-blend-screen"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/10 blur-[180px] rounded-full mix-blend-screen"></div>
    </div>

    <div class="w-full max-w-xl relative z-10">
      <div class="text-center mb-12">
        <h1 class="text-6xl font-black text-white mb-4 tracking-tighter">MUSICA</h1>
        <p class="text-slate-400 text-lg font-medium">Select your portal to continue</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <!-- User Selection -->
        <div 
          @click="selectedRole = 'user'"
          :class="['group relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden', selectedRole === 'user' ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.2)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20']"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative z-10 flex flex-col items-center text-center">
            <div :class="['w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500', selectedRole === 'user' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-slate-500']">
              <i class="pi pi-user text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Customer</h3>
            <p class="text-sm text-slate-500">Explore and purchase premium audio assets</p>
          </div>
          <!-- Selection indicator -->
          <div v-if="selectedRole === 'user'" class="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <i class="pi pi-check text-[10px] text-white font-black"></i>
          </div>
        </div>

        <!-- Admin Selection -->
        <div 
          @click="selectedRole = 'admin'"
          :class="['group relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden', selectedRole === 'admin' ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20']"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative z-10 flex flex-col items-center text-center">
            <div :class="['w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500', selectedRole === 'admin' ? 'bg-purple-500 text-white shadow-lg' : 'bg-white/5 text-slate-500']">
              <i class="pi pi-shield text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Manager</h3>
            <p class="text-sm text-slate-500">Control catalog and manage platform tracks</p>
          </div>
          <!-- Selection indicator -->
          <div v-if="selectedRole === 'admin'" class="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <i class="pi pi-check text-[10px] text-white font-black"></i>
          </div>
        </div>
      </div>

      <button 
        @click="handleLogin"
        :disabled="loading"
        class="w-full py-5 rounded-[2rem] font-black text-xl text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-[position:right_center] shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner"></i>
        <span v-else>ENTER PORTAL <i class="pi pi-arrow-right ml-2"></i></span>
      </button>

      <p class="text-center mt-12 text-slate-600 text-xs font-bold uppercase tracking-widest">
        Rapid Demo Mode Enabled
      </p>
    </div>
  </div>
</template>
