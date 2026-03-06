<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="text-center">
      <div class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-white text-lg">로그인 처리 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    const state = await authStore.completeLogin()
    const redirectPath = state?.redirectPath ?? '/'
    await router.replace(redirectPath)
  } catch (error) {
    console.error('[CallbackView] 로그인 콜백 처리 실패:', error)
    await router.replace('/')
  }
})
</script>
