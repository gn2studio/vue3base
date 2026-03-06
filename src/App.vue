<template>
  <div class="app-layout min-h-screen flex flex-col">
    <!-- Background Canvas -->
    <canvas id="bg-canvas"></canvas>

    <!-- Header -->
    <Gn2Header @open-login="handleOpenLogin" />

    <!-- Login Modal -->
    <Gn2LoginModal ref="loginModal" />

    <!-- Global Dialog (Confirm/Alert) -->
    <Gn2Dialog />

    <!-- Main Content: full width, no padding enforced here -->
    <main class="flex-1 w-full">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="w-full border-t border-white/10 bg-white/[0.03] backdrop-blur-md py-10 mt-auto">
      <div class="page-container flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-left">
          <span class="text-white font-extrabold text-lg tracking-tight">GN2<span class="text-[var(--accent)]">Studio</span></span>
          <p class="text-white/40 text-xs mt-1">소프트웨어 개발 & 커뮤니티 서비스</p>
        </div>
        <div class="flex gap-6 text-white/40 text-sm">
          <router-link to="/company/greetings" class="hover:text-white/80 transition-colors">회사소개</router-link>
          <router-link to="/services" class="hover:text-white/80 transition-colors">주요서비스</router-link>
          <router-link to="/portfolio" class="hover:text-white/80 transition-colors">포트폴리오</router-link>
          <router-link to="/customer/inquiry" class="hover:text-white/80 transition-colors">문의하기</router-link>
        </div>
        <p class="text-white/30 text-xs">© 2026 GN2Studio. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { GraphEngine } from '@/core/GraphEngine'
import Gn2Header from '@/components/Gn2Header.vue'
import Gn2LoginModal from '@/components/Gn2LoginModal.vue'
import Gn2Dialog from '@/components/Gn2Dialog.vue'

const authStore = useAuthStore()
let graphEngine: GraphEngine | null = null

const loginModal = ref<InstanceType<typeof Gn2LoginModal> | null>(null)

const handleOpenLogin = () => {
  loginModal.value?.open()
}

onBeforeMount(async () => {
  await authStore.initialize()
})

onMounted(() => {
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement
  if (canvas) {
    graphEngine = new GraphEngine(canvas)
  }
})

onUnmounted(() => {
  if (graphEngine) {
    graphEngine.destroy()
  }
})
</script>

<style>
/* Page transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
