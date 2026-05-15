<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import apiClient from '../api';

type TrackCard = {
  id: string;
  title: string;
  artist_name: string;
  price: number;
  genre: string[];
  mood: string[];
};

const router = useRouter();
const loading = ref(false);
const listLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const tracks = ref<TrackCard[]>([]);

const form = reactive({
  title: '',
  artist_name: '',
  composer: '',
  publisher: 'Solo Coder Music',
  description: '',
  release_date: '2026-06-01',
  cover_image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
  file_url: 'https://cdn.example.com/audio/original/new-track.mp3',
  preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  genre: 'Pop',
  mood: 'Happy',
  use_case: 'Commercial',
  theme: 'Bright, Uplifting',
  language: 'English',
  energy_level: 'Medium',
  vocal_type: 'Vocal',
  duration: 32,
  bpm: 112,
  key: 'C Major',
  file_type: 'mp3',
  bitrate: 320,
  sample_rate: 44100,
  file_size_mb: 4.8,
  rights_holder: 'Solo Coder Music',
  ownership_type: 'master',
  copyright_status: 'registered',
  licensing_available: true,
  commercial_allowed: true,
  allowed_platforms: 'YouTube,TikTok,Reels,Shorts',
  territory: 'Worldwide',
  expiration: '',
  price: 29,
  license_type: 'Standard',
  monetization_allowed: true,
  commercial_usage_allowed: true,
  sponsor_usage_allowed: true,
  ads_usage_allowed: true,
  personal_usage_allowed: true,
  youtube_allowed: true,
  youtube_shorts_allowed: true,
  youtube_long_form_allowed: true,
  platform_scope_note: 'Applies to creator content on supported platforms',
  certification_id: 'MSC-2026-9001',
  certification_status: 'Certified',
  certification_scope: 'YouTube Monetization',
  content_id_safe_declaration: true,
  certified_by: 'admin-demo',
  certified_at: '2026-06-01T10:00:00Z',
  certificate_valid_from: '2026-06-01T10:00:00Z',
  certificate_valid_until: '',
  verification_status: 'verified',
  asset_status: 'active',
  status: 'published',
  visibility: 'public',
  archive_status: false,
});

function splitCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function fetchTracks() {
  listLoading.value = true;
  try {
    const { data } = await apiClient.get('/tracks', {
      params: { page: 1, pageSize: 20, sort: 'new' },
    });
    tracks.value = data.data ?? [];
  } finally {
    listLoading.value = false;
  }
}

async function createTrack() {
  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;
  try {
    await apiClient.post('/tracks/admin', {
      title: form.title,
      artist_name: form.artist_name,
      composer: form.composer,
      publisher: form.publisher,
      description: form.description,
      release_date: form.release_date,
      cover_image_url: form.cover_image_url,
      file_url: form.file_url,
      preview_url: form.preview_url,
      genre: splitCsv(form.genre),
      mood: splitCsv(form.mood),
      use_case: splitCsv(form.use_case),
      theme: splitCsv(form.theme),
      language: form.language,
      energy_level: form.energy_level,
      vocal_type: form.vocal_type,
      duration: Number(form.duration),
      bpm: Number(form.bpm),
      key: form.key,
      file_type: form.file_type,
      bitrate: Number(form.bitrate),
      sample_rate: Number(form.sample_rate),
      file_size_mb: Number(form.file_size_mb),
      rights_holder: form.rights_holder,
      ownership_type: form.ownership_type,
      copyright_status: form.copyright_status,
      licensing_available: form.licensing_available,
      commercial_allowed: form.commercial_allowed,
      allowed_platforms: splitCsv(form.allowed_platforms),
      territory: form.territory,
      expiration: form.expiration || null,
      price: Number(form.price),
      currency: 'USD',
      license_type: form.license_type,
      monetization_allowed: form.monetization_allowed,
      commercial_usage_allowed: form.commercial_usage_allowed,
      sponsor_usage_allowed: form.sponsor_usage_allowed,
      ads_usage_allowed: form.ads_usage_allowed,
      personal_usage_allowed: form.personal_usage_allowed,
      youtube_allowed: form.youtube_allowed,
      youtube_shorts_allowed: form.youtube_shorts_allowed,
      youtube_long_form_allowed: form.youtube_long_form_allowed,
      platform_scope_note: form.platform_scope_note,
      certification_id: form.certification_id,
      certification_status: form.certification_status,
      certification_scope: form.certification_scope,
      content_id_safe_declaration: form.content_id_safe_declaration,
      certified_by: form.certified_by,
      certified_at: form.certified_at,
      certificate_valid_from: form.certificate_valid_from,
      certificate_valid_until: form.certificate_valid_until || null,
      verification_status: form.verification_status,
      asset_status: form.asset_status,
      status: form.status,
      visibility: form.visibility,
      archive_status: form.archive_status,
      deleted_at: null,
    });
    successMessage.value = 'Track created successfully';
    await fetchTracks();
  } catch (err: any) {
    errorMessage.value = err?.message ?? 'Failed to create track';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchTracks);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <div class="mx-auto max-w-7xl px-4 py-6 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-2xl font-semibold">Admin Track Manager</div>
          <div class="text-sm text-slate-400">Create sellable music assets with marketplace-ready metadata.</div>
        </div>
        <div class="flex gap-2">
          <Button label="Catalog" icon="pi pi-home" class="p-button-sm p-button-outlined" @click="router.push('/library')" />
          <Button label="Cart" icon="pi pi-shopping-cart" class="p-button-sm p-button-outlined" @click="router.push('/cart')" />
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
        {{ successMessage }}
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card class="xl:col-span-2 bg-slate-900/50 border border-slate-800">
          <template #title>Create New Track</template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2"><label class="text-sm text-slate-400">Title</label><InputText v-model="form.title" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Artist</label><InputText v-model="form.artist_name" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Composer</label><InputText v-model="form.composer" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Publisher</label><InputText v-model="form.publisher" class="w-full" /></div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-sm text-slate-400">Description</label>
                <textarea v-model="form.description" rows="4" class="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
              </div>

              <div class="space-y-2"><label class="text-sm text-slate-400">Genre (csv)</label><InputText v-model="form.genre" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Mood (csv)</label><InputText v-model="form.mood" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Use Case (csv)</label><InputText v-model="form.use_case" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Theme (csv)</label><InputText v-model="form.theme" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Language</label><InputText v-model="form.language" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Energy</label><InputText v-model="form.energy_level" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Vocal Type</label><InputText v-model="form.vocal_type" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Release Date</label><InputText v-model="form.release_date" class="w-full" /></div>

              <div class="space-y-2"><label class="text-sm text-slate-400">Duration (s)</label><InputText v-model="form.duration" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">BPM</label><InputText v-model="form.bpm" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Key</label><InputText v-model="form.key" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">File Type</label><InputText v-model="form.file_type" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Bitrate</label><InputText v-model="form.bitrate" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Sample Rate</label><InputText v-model="form.sample_rate" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">File Size MB</label><InputText v-model="form.file_size_mb" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Rights Holder</label><InputText v-model="form.rights_holder" class="w-full" /></div>

              <div class="space-y-2"><label class="text-sm text-slate-400">Ownership Type</label><InputText v-model="form.ownership_type" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Copyright Status</label><InputText v-model="form.copyright_status" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Allowed Platforms (csv)</label><InputText v-model="form.allowed_platforms" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Territory</label><InputText v-model="form.territory" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Price</label><InputText v-model="form.price" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">License Type</label><InputText v-model="form.license_type" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Preview URL</label><InputText v-model="form.preview_url" class="w-full" /></div>
              <div class="space-y-2"><label class="text-sm text-slate-400">Original File URL</label><InputText v-model="form.file_url" class="w-full" /></div>
              <div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-400">Cover Image URL</label><InputText v-model="form.cover_image_url" class="w-full" /></div>
              <div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-400">Platform Scope Note</label><InputText v-model="form.platform_scope_note" class="w-full" /></div>
            </div>

            <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <label class="flex items-center gap-2"><input v-model="form.licensing_available" type="checkbox" /> Licensing</label>
              <label class="flex items-center gap-2"><input v-model="form.commercial_allowed" type="checkbox" /> Commercial</label>
              <label class="flex items-center gap-2"><input v-model="form.monetization_allowed" type="checkbox" /> Monetization</label>
              <label class="flex items-center gap-2"><input v-model="form.sponsor_usage_allowed" type="checkbox" /> Sponsor</label>
              <label class="flex items-center gap-2"><input v-model="form.ads_usage_allowed" type="checkbox" /> Ads</label>
              <label class="flex items-center gap-2"><input v-model="form.personal_usage_allowed" type="checkbox" /> Personal</label>
              <label class="flex items-center gap-2"><input v-model="form.youtube_allowed" type="checkbox" /> YouTube</label>
              <label class="flex items-center gap-2"><input v-model="form.youtube_shorts_allowed" type="checkbox" /> Shorts</label>
            </div>

            <div class="mt-4 flex justify-end">
              <Button label="Create Track" icon="pi pi-plus" :loading="loading" @click="createTrack" />
            </div>
          </template>
        </Card>

        <Card class="bg-slate-900/50 border border-slate-800">
          <template #title>Recent Catalog Items</template>
          <template #content>
            <div v-if="listLoading" class="text-sm text-slate-500">Loading tracks...</div>
            <div v-else class="space-y-3">
              <div v-for="track in tracks" :key="track.id" class="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div class="font-medium">{{ track.title }}</div>
                <div class="text-xs text-slate-400">{{ track.artist_name }}</div>
                <div class="mt-2 flex items-center justify-between text-xs">
                  <span>{{ track.genre[0] }} / {{ track.mood[0] }}</span>
                  <span>${{ track.price }}</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
