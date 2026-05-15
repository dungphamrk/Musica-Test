<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const mode = ref<'login' | 'register'>('login');
const email = ref('');
const password = ref('');
const fullName = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  if (!email.value || !password.value) return;
  loading.value = true;

  try {
    if (mode.value === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: {
            full_name: fullName.value,
          },
        },
      });

      if (error) throw error;
      toast.add({ severity: 'success', summary: 'Success', detail: 'Registration successful! Check your email to verify (if enabled) or log in now.', life: 5000 });
      mode.value = 'login';
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      if (error) throw error;
      
      // Update local store
      authStore.setUser({
        email: data.user.email || '',
        role: 'user', // Basic role logic, upgrade later if needed
      }, data.session.access_token);
      
      toast.add({ severity: 'success', summary: 'Welcome', detail: 'Logged in successfully', life: 3000 });
      router.push('/library');
    }
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'An error occurred', life: 5000 });
    console.error('Auth error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-sans selection:bg-indigo-500/30 p-4">
    <!-- Hiệu ứng background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
          {{ mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới' }}
        </h2>
        <p class="text-slate-400">
          {{ mode === 'login' ? 'Đăng nhập vào hệ thống của bạn' : 'Tham gia cộng đồng âm nhạc bản quyền' }}
        </p>
      </div>

      <div class="flex p-1 bg-black/20 rounded-xl mb-6 border border-white/5">
        <button 
          @click="mode = 'login'" 
          :class="['flex-1 py-2 text-sm font-semibold rounded-lg transition-all', mode === 'login' ? 'bg-indigo-500/20 text-white shadow' : 'text-slate-400 hover:text-white']"
        >
          Đăng nhập
        </button>
        <button 
          @click="mode = 'register'" 
          :class="['flex-1 py-2 text-sm font-semibold rounded-lg transition-all', mode === 'register' ? 'bg-indigo-500/20 text-white shadow' : 'text-slate-400 hover:text-white']"
        >
          Đăng ký
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        
        <div v-if="mode === 'register'" class="space-y-2">
          <label class="text-sm font-medium text-slate-400 ml-1">Họ và tên</label>
          <div class="relative group">
            <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input
              v-model="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              required
              class="w-full bg-black/20 text-white border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-400 ml-1">Email</label>
          <div class="relative group">
            <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input
              v-model="email"
              type="email"
              placeholder="email@example.com"
              required
              class="w-full bg-black/20 text-white border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-400 ml-1">Mật khẩu</label>
          <div class="relative group">
            <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
              class="w-full bg-black/20 text-white border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        <div v-if="mode === 'login'" class="flex items-center justify-between text-sm pt-2">
          <div class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4 rounded border-white/20 bg-black/30 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 transition-all" id="remember" />
            <label for="remember" class="text-slate-400 cursor-pointer">Ghi nhớ tôi</label>
          </div>
          <a href="#" class="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Quên mật khẩu?</a>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full mt-4 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <span v-else>{{ mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
