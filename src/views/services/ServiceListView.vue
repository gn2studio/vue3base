<template>
  <div class="page-view">
    <!-- Page Hero -->
    <div class="page-hero relative overflow-hidden">
      <div class="hero-glow"></div>
      <div class="page-container py-16 relative z-10">
        <div class="breadcrumb">
          <router-link to="/" class="bc-link">홈</router-link>
          <span class="bc-sep">›</span>
          <span class="bc-current">주요서비스</span>
        </div>
        <h1 class="page-title mt-4">Our <span class="text-gradient">Services</span></h1>
        <p class="page-subtitle">혁신적인 기술과 창의적인 연결을 제공합니다</p>
      </div>
    </div>

    <div class="page-container py-12">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Gn2Skeleton v-for="i in pageSize" :key="i" height="280px" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-400 py-12">
        <p>{{ error }}</p>
      </div>

      <!-- List -->
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="service in pagedServices"
            :key="service.id"
            class="glass-panel cursor-pointer flex flex-col items-start"
            @click="goToDetail(service.id)"
          >
            <div class="text-4xl mb-6">🚀</div>
            <h3 class="text-2xl font-bold mb-3 text-white">{{ service.title }}</h3>
            <p class="text-text-secondary leading-relaxed flex-1 mb-6">{{ service.desc }}</p>
            <div class="mt-auto flex justify-between items-center w-full">
              <span class="text-sm text-text-muted">{{ service.createdAt }}</span>
              <span class="text-accent font-medium">자세히 보기 &rarr;</span>
            </div>
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
import { ServiceService, type ServiceItem } from '@/api/ServiceService'
import Gn2Skeleton from '@/components/Gn2Skeleton.vue'
import Gn2Pagination from '@/components/Gn2Pagination.vue'

const router = useRouter()
const allServices = ref<ServiceItem[]>([])
const loading = ref(true)
const error = ref('')

// ── Pagination ──────────────────────────────────
const pageSize = 6
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(allServices.value.length / pageSize))
const pagedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allServices.value.slice(start, start + pageSize)
})

const onPageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Data Fetch ──────────────────────────────────
onMounted(async () => {
  try {
    loading.value = true
    allServices.value = await ServiceService.getServices()
  } catch (err: any) {
    error.value = '서비스 목록을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})

const goToDetail = (id: number) => router.push(`/services/${id}`)
</script>

<style scoped>
.page-hero {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(10, 10, 20, 0.9) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.hero-glow {
  position: absolute; top: -80px; right: -80px;
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
.glass-panel:hover .text-accent {
  text-shadow: 0 0 10px var(--accent-glow);
}
</style>
