<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const role = ref<'user' | 'admin'>('user');
const authStore = useAuthStore();
const router = useRouter();
const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
];

const handleLogin = async () => {
  loading.value = true;
  try {
    setTimeout(() => {
      authStore.setUser(
        { email: email.value || `${role.value}@demo.local`, role: role.value },
        `fake-${role.value}-jwt-token`,
      );
      router.push('/library');
      loading.value = false;
    }, 1500);
  } catch (error) {
    loading.value = false;
    console.error('Login failed', error);
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
      <div class="text-center mb-10">
        <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">Chào mừng trở lại</h2>
        <p class="text-slate-400">Đăng nhập vào hệ thống Supabase của bạn</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-400 ml-1">Vai trò demo</label>
          <SelectButton v-model="role" :options="roleOptions" optionLabel="label" optionValue="value" class="w-full" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-400 ml-1">Email</label>
          <div class="relative group">
            <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input
              v-model="email"
              type="email"
              placeholder="email@example.com"
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
              class="w-full bg-black/20 text-white border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        <div class="flex items-center justify-between text-sm pt-2">
          <div class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4 rounded border-white/20 bg-black/30 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 transition-all" id="remember" />
            <label for="remember" class="text-slate-400 cursor-pointer">Ghi nhớ tôi</label>
          </div>
          <a href="#" class="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Quên mật khẩu?</a>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full mt-2 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <span v-else>Đăng nhập</span>
        </button>
      </form>

      <div class="mt-10 pt-6 border-t border-white/10 text-center">
        <p class="text-slate-500 text-sm">
          Chưa có tài khoản? 
          <a href="#" class="text-white font-semibold hover:text-indigo-300 transition-colors">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-selectbutton) {
  @apply flex;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem;
  padding: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
:deep(.p-selectbutton .p-button) {
  @apply flex-1 border-none rounded-lg text-slate-400 bg-transparent transition-all;
  padding: 0.5rem;
}
:deep(.p-selectbutton .p-button.p-highlight) {
  background: rgba(99, 102, 241, 0.2); /* indigo-500 */
  color: white;
}
:deep(.p-selectbutton .p-button:not(.p-highlight):not(.p-disabled):hover) {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}
</style>
