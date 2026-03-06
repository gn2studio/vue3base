<template>
  <div class="skeleton-wrapper w-full relative overflow-hidden rounded-2xl bg-white/5 border border-white/5" :style="{ height, width }">
    <div class="shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' }
})
</script>

<style scoped>
.shimmer {
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
