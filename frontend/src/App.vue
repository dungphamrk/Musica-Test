<script setup lang="ts">
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';
</script>

<template>
  <div class="app-container">
    <Toast />
    <RouterView />
  </div>
</template>

<style>
/* Global styles */
body {
  @apply bg-slate-950;
  margin: 0;
}
</style>
