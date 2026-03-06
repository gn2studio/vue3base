<template>
  <div class="service-detail-view max-w-4xl mx-auto py-8">
    <div v-if="loading">
      <Gn2Skeleton height="60px" class="mb-4" />
      <Gn2Skeleton height="200px" class="mb-8" />
      <div class="flex gap-4">
        <Gn2Skeleton width="120px" height="40px" />
        <Gn2Skeleton width="120px" height="40px" />
      </div>
    </div>

    <div v-else-if="error" class="text-center text-red-400 py-12">
      <p>{{ error }}</p>
      <button @click="router.back()" class="btn mt-4">목록으로</button>
    </div>

    <div v-else-if="service" class="glass-panel text-left p-8 md:p-12">
      <h1 class="text-4xl md:text-5xl font-extrabold mb-6 text-white">{{ service.title }}</h1>
      <div class="flex items-center gap-4 text-sm text-text-muted mb-8 border-b border-white/10 pb-6">
        <span>등록일: {{ service.createdAt }}</span>
        <span>ID: {{ service.id }}</span>
      </div>
      
      <div class="prose prose-invert max-w-none text-lg leading-relaxed text-text-secondary mb-12">
        <p>{{ service.desc }}</p>
        <p class="mt-6 text-base">이 시스템은 최신 인프라와 AI 기술을 결합하여 최상의 품질을 제공합니다.</p>
      </div>

      <div class="flex flex-wrap gap-4 mt-8 pt-8 border-t border-white/10">
        <a :href="service.link" target="_blank" class="btn primary">바로가기 방문 🌐</a>
        <button @click="router.back()" class="btn">목록으로 돌아가기</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ServiceService, type ServiceItem } from '@/api/ServiceService'
import Gn2Skeleton from '@/components/Gn2Skeleton.vue'

const route = useRoute()
const router = useRouter()

const service = ref<ServiceItem | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const idStr = route.params.id as string
  const id = parseInt(idStr, 10)
  
  if (isNaN(id)) {
    error.value = '잘못된 접근입니다.'
    loading.value = false
    return
  }

  try {
    loading.value = true
    const result = await ServiceService.getServiceDetail(id)
    if (result) {
      service.value = result
    } else {
      error.value = '존재하지 않는 서비스입니다.'
    }
  } catch (err: any) {
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
})
</script>
