<template>
  <div class="placeholder-view min-h-[60vh] flex flex-col items-center justify-center text-center">
    <div class="icon drop-shadow-md text-6xl mb-6">🚧</div>
    <h1 class="text-3xl font-extrabold text-white mb-4">페이지 준비 중입니다</h1>
    <p class="text-[oklch(80%_0.05_250)] text-lg mb-8 max-w-[600px]">
      현재 <strong class="text-accent">{{ routePath }}</strong> 페이지를 구축하고 있습니다.
      더 나은 서비스로 찾아뵙겠습니다.
    </p>
    <button @click="goBack" class="btn">이전 페이지로 돌아가기</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const routePath = computed(() => route.path)

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.btn {
  padding: 0.8rem 2rem;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}
.btn:hover {
  background: rgba(120, 200, 250, 0.15);
  border-color: var(--accent);
  box-shadow: 0 0 20px var(--accent-glow);
  transform: translateY(-2px);
}
</style>
