<template>
  <div class="page-view">
    <!-- Page Hero -->
    <div class="page-hero relative overflow-hidden">
      <div class="hero-glow"></div>
      <div class="page-container py-16 relative z-10">
        <div class="breadcrumb">
          <router-link to="/" class="bc-link">홈</router-link>
          <span class="bc-sep">›</span>
          <span class="bc-current">포트폴리오</span>
        </div>
        <h1 class="page-title mt-4">Port<span class="text-gradient">folio</span></h1>
        <p class="page-subtitle">클라우드와 AI를 활용한 성공 사례들을 소개합니다</p>
      </div>
    </div>

    <div class="page-container py-12">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Gn2Skeleton v-for="i in pageSize" :key="i" height="320px" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-500 py-12">
        <p>{{ error }}</p>
      </div>

      <!-- List -->
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="item in pagedPortfolios"
            :key="item.id"
            class="glass-panel cursor-pointer flex flex-col group relative overflow-hidden"
            @click="goToDetail(item.id)"
          >
            <div class="mb-4">
              <span class="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold mb-3 border border-accent/30">
                {{ item.year }}
              </span>
              <h3 class="text-2xl font-bold text-white mb-2">{{ item.title }}</h3>
              <p class="text-text-secondary text-sm mb-4">{{ item.client }}</p>
            </div>

            <p class="text-text-muted leading-relaxed flex-1">{{ item.desc }}</p>

            <div class="mt-6 flex flex-wrap gap-2">
              <span v-for="tag in item.tags" :key="tag" class="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                #{{ tag }}
              </span>
            </div>

            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <!-- Pagination -->
        <Gn2Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="onPageChange"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PortfolioService, type PortfolioItem } from '@/api/PortfolioService'
import Gn2Skeleton from '@/components/Gn2Skeleton.vue'
import Gn2Pagination from '@/components/Gn2Pagination.vue'

const router = useRouter()
const allPortfolios = ref<PortfolioItem[]>([])
const loading = ref(true)
const error = ref('')

// ── Pagination ──────────────────────────────────
const pageSize = 6
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(allPortfolios.value.length / pageSize))
const pagedPortfolios = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allPortfolios.value.slice(start, start + pageSize)
})

const onPageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Data Fetch ──────────────────────────────────
onMounted(async () => {
  try {
    loading.value = true
    allPortfolios.value = await PortfolioService.getPortfolios()
  } catch (err: any) {
    error.value = '포트폴리오 목록을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})

const goToDetail = (id: number) => router.push(`/portfolio/${id}`)
</script>

<style scoped>
.page-hero {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(10, 10, 20, 0.9) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.hero-glow {
  position: absolute; top: -80px; left: -80px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, oklch(75% 0.15 200 / 0.12) 0%, transparent 70%);
  border-radius: 50%; pointer-events: none;
}
.breadcrumb { display: flex; align-items: center; gap: 8px; }
.bc-link { color: var(--accent); text-decoration: none; font-size: 0.85rem; }
.bc-sep { color: rgba(255,255,255,0.3); font-size: 0.85rem; }
.bc-current { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
.page-title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800; color: white; letter-spacing: -0.03em;
}
.page-subtitle { color: oklch(70% 0.04 250); font-size: 1.05rem; margin-top: 0.75rem; }
.text-gradient {
  background: linear-gradient(135deg, var(--accent) 0%, #fff 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
</style>
