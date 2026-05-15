<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import apiClient from '../api';

const router = useRouter();
const toast = useToast();
const loading = ref(false);
const currentStep = ref(1);
const totalSteps = 4;

const form = reactive({
  title: '',
  artist_name: '',
  composer: '',
  publisher: '',
  description: '',
  release_date: new Date().toISOString().split('T')[0],
  cover_image_url: '',
  file_url: '',
  preview_url: '',
  genre: [],
  mood: [],
  use_case: [],
  theme: [],
  language: 'English',
  energy_level: 'Medium',
  vocal_type: 'Vocal',
  duration: 0,
  bpm: 120,
  key: 'C Major',
  file_type: 'mp3',
  bitrate: 320,
  sample_rate: 44100,
  file_size_mb: 0,
  rights_holder: '',
  ownership_type: 'master',
  copyright_status: 'registered',
  licensing_available: true,
  commercial_allowed: true,
  allowed_platforms: [],
  territory: 'Worldwide',
  expiration: '',
  price: 0,
  license_type: 'Standard',
  monetization_allowed: true,
  commercial_usage_allowed: true,
  sponsor_usage_allowed: true,
  ads_usage_allowed: true,
  personal_usage_allowed: true,
  youtube_allowed: true,
  youtube_shorts_allowed: true,
  youtube_long_form_allowed: true,
  platform_scope_note: '',
  certification_id: '',
  certification_status: 'Certified',
  certification_scope: 'YouTube Monetization',
  content_id_safe_declaration: true,
  certified_by: 'admin-demo',
  certified_at: new Date().toISOString(),
  certificate_valid_from: new Date().toISOString(),
  certificate_valid_until: '',
  verification_status: 'verified',
  asset_status: 'active',
  status: 'published',
  visibility: 'public',
  archive_status: false,
});

// Enums for selection
const genres = ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Lo-Fi', 'Electronic', 'Ambient', 'Cinematic'];
const moods = ['Happy', 'Sad', 'Energetic', 'Chill', 'Dark', 'Epic', 'Romantic'];
const platforms = ['YouTube', 'TikTok', 'Instagram Reels', 'Facebook', 'Twitch', 'Podcast'];
const useCases = ['Commercial', 'Social Media', 'Film/TV', 'Game', 'Personal'];
const energyLevels = ['Very Low', 'Low', 'Medium', 'High', 'Extremely High'];
const vocalTypes = ['Vocal', 'Instrumental', 'Choir', 'Background Vocals'];

async function createTrack() {
  loading.value = true;
  try {
    await apiClient.post('/tracks/admin', {
      ...form,
      duration: Number(form.duration),
      bpm: Number(form.bpm),
      bitrate: Number(form.bitrate),
      sample_rate: Number(form.sample_rate),
      file_size_mb: Number(form.file_size_mb),
      price: Number(form.price),
    });
    toast.add({ severity: 'success', summary: 'Success', detail: 'Track created successfully', life: 3000 });
    router.push('/library');
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to create track', life: 5000 });
  } finally {
    loading.value = false;
  }
}

const nextStep = () => { if (currentStep.value < totalSteps) currentStep.value++; };
const prevStep = () => { if (currentStep.value > 1) currentStep.value--; };
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-slate-200 font-sans p-6 overflow-hidden relative">
    <!-- Background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none fixed">
      <div class="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-indigo-500/5 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-purple-500/5 blur-[150px] rounded-full"></div>
    </div>

    <div class="max-w-4xl mx-auto relative z-10 pt-10 pb-20">
      <!-- Header -->
      <div class="flex items-center justify-between mb-16">
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter">PUBLISH TRACK</h1>
          <p class="text-slate-500 mt-2 font-medium">Add new high-fidelity audio asset to the marketplace.</p>
        </div>
        <button @click="router.push('/library')" class="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <i class="pi pi-times text-slate-400"></i>
        </button>
      </div>

      <!-- Step Indicator -->
      <div class="flex items-center justify-between mb-12 relative px-4">
        <div class="absolute h-0.5 bg-white/5 left-10 right-10 top-1/2 -translate-y-1/2 z-0"></div>
        <div 
          class="absolute h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 left-10 transition-all duration-500 z-0"
          :style="{ width: `calc(${(currentStep - 1) / (totalSteps - 1) * 100}% - 40px)` }"
        ></div>
        
        <div v-for="s in totalSteps" :key="s" class="relative z-10">
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500',
              currentStep === s ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 
              currentStep > s ? 'bg-indigo-900 border-indigo-700' : 'bg-[#050505] border-white/10 text-slate-600'
            ]"
          >
            <i v-if="currentStep > s" class="pi pi-check text-xs text-white"></i>
            <span v-else class="text-xs font-black">{{ s }}</span>
          </div>
          <span class="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">
            {{ s === 1 ? 'Basic' : s === 2 ? 'Media' : s === 3 ? 'Metadata' : 'Price' }}
          </span>
        </div>
      </div>

      <!-- Form Content -->
      <div class="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl min-h-[500px] flex flex-col">
        
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Track Title</label>
              <InputText v-model="form.title" placeholder="e.g. Midnight City" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Artist Name</label>
              <InputText v-model="form.artist_name" placeholder="e.g. M83" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Composer</label>
              <InputText v-model="form.composer" placeholder="Original composer name" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Publisher</label>
              <InputText v-model="form.publisher" placeholder="Company or Individual" class="w-full" />
            </div>
            <div class="md:col-span-2 space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Track Description</label>
              <textarea v-model="form.description" rows="4" placeholder="Briefly describe the track's vibe and instruments..." class="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-indigo-500 transition-all"></textarea>
            </div>
          </div>
        </div>

        <!-- Step 2: Media Assets -->
        <div v-if="currentStep === 2" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Cover Artwork URL</label>
              <InputText v-model="form.cover_image_url" placeholder="https://..." class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Master Audio File URL (.mp3/.wav)</label>
              <InputText v-model="form.file_url" placeholder="https://..." class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Public Preview URL</label>
              <InputText v-model="form.preview_url" placeholder="https://..." class="w-full" />
            </div>
            <div class="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-4 mt-8">
              <i class="pi pi-info-circle text-indigo-400 mt-1"></i>
              <p class="text-sm text-indigo-300/80 leading-relaxed">Ensure all links are public and reachable. For best quality, use high-bitrate (320kbps) audio files for the master version.</p>
            </div>
          </div>
        </div>

        <!-- Step 3: Attributes & Technical -->
        <div v-if="currentStep === 3" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Genre</label>
              <MultiSelect v-model="form.genre" :options="genres" placeholder="Select Genres" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Mood</label>
              <MultiSelect v-model="form.mood" :options="moods" placeholder="Select Moods" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">BPM (Beats Per Minute)</label>
              <InputText v-model="form.bpm" type="number" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Energy Level</label>
              <Dropdown v-model="form.energy_level" :options="energyLevels" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Vocal Type</label>
              <Dropdown v-model="form.vocal_type" :options="vocalTypes" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Duration (seconds)</label>
              <InputText v-model="form.duration" type="number" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Step 4: Rights & Pricing -->
        <div v-if="currentStep === 4" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Price (USD)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">$</span>
                <InputText v-model="form.price" type="number" class="w-full pl-8 text-emerald-400 font-black text-xl" />
              </div>
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">License Type</label>
              <Dropdown v-model="form.license_type" :options="['Standard', 'Extended', 'Premium']" class="w-full" />
            </div>
            <div class="md:col-span-2 space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Allowed Platforms</label>
              <MultiSelect v-model="form.allowed_platforms" :options="platforms" placeholder="Select Platforms" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Rights Holder</label>
              <InputText v-model="form.rights_holder" placeholder="Who owns this music?" class="w-full" />
            </div>
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Territory</label>
              <InputText v-model="form.territory" class="w-full" />
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-4">
            <label class="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-black/40 cursor-pointer hover:bg-white/5 transition-all">
              <input type="checkbox" v-model="form.commercial_allowed" class="w-5 h-5 rounded accent-indigo-500">
              <span class="text-sm font-bold">Commercial Use Allowed</span>
            </label>
            <label class="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-black/40 cursor-pointer hover:bg-white/5 transition-all">
              <input type="checkbox" v-model="form.monetization_allowed" class="w-5 h-5 rounded accent-indigo-500">
              <span class="text-sm font-bold">Monetization Allowed</span>
            </label>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-auto pt-10 flex items-center justify-between">
          <button 
            v-if="currentStep > 1" 
            @click="prevStep"
            class="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-slate-300"
          >
            <i class="pi pi-arrow-left mr-2"></i> Back
          </button>
          <div v-else></div>

          <button 
            v-if="currentStep < totalSteps" 
            @click="nextStep"
            class="px-10 py-4 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 transition-all font-black text-white flex items-center"
          >
            Next Phase <i class="pi pi-arrow-right ml-2"></i>
          </button>

          <button 
            v-else 
            @click="createTrack"
            :disabled="loading"
            class="px-12 py-5 rounded-[1.8rem] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-[0_0_50px_rgba(99,102,241,0.3)] transition-all font-black text-xl text-white flex items-center gap-3 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-cloud-upload"></i>
            SAVE TRACK TO CATALOG
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-multiselect) {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  color: white;
  transition: all 0.3s;
}

:deep(.p-inputtext:focus), :deep(.p-dropdown:not(.p-disabled).p-focus), :deep(.p-multiselect:not(.p-disabled).p-focus) {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2);
}

:deep(.p-dropdown-trigger), :deep(.p-multiselect-trigger) {
  width: 3rem;
  color: #64748b;
}

:deep(.p-dropdown-panel), :deep(.p-multiselect-panel) {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

:deep(.p-dropdown-item), :deep(.p-multiselect-item) {
  color: #94a3b8;
  padding: 0.75rem 1rem;
}

:deep(.p-dropdown-item.p-highlight), :deep(.p-multiselect-item.p-highlight) {
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
}
</style>
