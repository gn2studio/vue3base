<template>
  <div class="portfolio-detail-view max-w-4xl mx-auto py-8">
    <div v-if="loading">
      <Gn2Skeleton height="60px" class="mb-4" />
      <Gn2Skeleton height="400px" class="mb-8" />
    </div>

    <div v-else-if="error" class="text-center text-red-400 py-12">
      <p>{{ error }}</p>
      <button @click="router.back()" class="btn mt-4">목록으로</button>
    </div>

    <div v-else-if="portfolio" class="glass-panel text-left p-8 md:p-12 relative overflow-hidden">
      <!-- Background Glow Effect for Detail -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div class="mb-8">
        <span class="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-bold mb-4 border border-accent/40 shadow-[0_0_15px_rgba(120,200,250,0.2)]">
          {{ portfolio.year }}
        </span>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 text-white leading-tight">{{ portfolio.title }}</h1>
        <p class="text-xl text-text-muted font-medium pb-6 border-b border-white/10">Clinet: <span class="text-text-secondary">{{ portfolio.client }}</span></p>
      </div>
      
      <div class="content text-lg leading-relaxed text-text-secondary mb-12">
        <h3 class="text-2xl text-white font-bold mb-4">프로젝트 개요</h3>
        <p class="mb-6">{{ portfolio.desc }}</p>
        <p class="mb-6">본 프로젝트는 최신 클라우드 기술 및 데이터 처리 솔루션을 바탕으로 안정성과 확장성을 모두 만족시키는 결과를 도출했습니다.</p>
        
        <h3 class="text-2xl text-white font-bold mt-10 mb-4">적용 기술 및 스택</h3>
        <div class="flex flex-wrap gap-3">
          <span v-for="tag in portfolio.tags" :key="tag" class="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-text-primary">
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="flex gap-4 mt-12 pt-8 border-t border-white/10">
        <button @click="router.back()" class="btn">포트폴리오 목록으로</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PortfolioService, type PortfolioItem } from '@/api/PortfolioService'
import Gn2Skeleton from '@/components/Gn2Skeleton.vue'

const route = useRoute()
const router = useRouter()

const portfolio = ref<PortfolioItem | null>(null)
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
    const result = await PortfolioService.getPortfolioDetail(id)
    if (result) {
      portfolio.value = result
    } else {
      error.value = '존재하지 않는 포트폴리오입니다.'
    }
  } catch (err: any) {
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
})
</script>
