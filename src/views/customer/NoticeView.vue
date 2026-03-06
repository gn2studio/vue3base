<template>
  <div class="page-view">
    <div class="page-hero relative overflow-hidden">
      <div class="hero-glow"></div>
      <div class="page-container py-16 relative z-10">
        <div class="breadcrumb">
          <router-link to="/" class="bc-link">홈</router-link>
          <span class="bc-sep">›</span>
          <span class="bc-current">고객센터</span>
          <span class="bc-sep">›</span>
          <span class="bc-current">공지사항</span>
        </div>
        <h1 class="page-title mt-4">공지<span class="text-gradient">사항</span></h1>
        <p class="page-subtitle">GN2Studio의 새로운 소식과 중요 안내를 전합니다</p>
      </div>
    </div>

    <div class="page-container py-12">
      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in pageSize" :key="i" class="skeleton-row"></div>
      </div>

      <!-- List -->
      <template v-else>
        <!-- Pinned (항상 상단 고정 표시) -->
        <div v-if="pinnedNotices.length" class="notice-list mb-4">
          <div v-for="notice in pinnedNotices" :key="notice.id"
               class="notice-row pinned" @click="selectedNotice = notice">
            <span class="notice-badge pin">📌 중요</span>
            <p class="notice-title">{{ notice.title }}</p>
            <span class="notice-date">{{ notice.date }}</span>
          </div>
        </div>

        <!-- Regular (페이징) -->
        <div class="notice-list">
          <div v-for="notice in pagedNotices" :key="notice.id"
               class="notice-row" @click="selectedNotice = notice">
            <span class="notice-badge">공지</span>
            <p class="notice-title">{{ notice.title }}</p>
            <span class="notice-date">{{ notice.date }}</span>
          </div>

          <div v-if="pagedNotices.length === 0" class="notice-empty">
            등록된 공지사항이 없습니다.
          </div>
        </div>

        <!-- Pagination -->
        <Gn2Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="onPageChange"
        />
      </template>

      <!-- Detail Modal -->
      <transition name="modal-fade">
        <div v-if="selectedNotice" class="modal-backdrop" @click.self="selectedNotice = null">
          <div class="modal-box">
            <div class="modal-header">
              <h2 class="text-xl font-bold text-white">{{ selectedNotice.title }}</h2>
              <button class="modal-close" @click="selectedNotice = null">✕</button>
            </div>
            <p class="text-white/40 text-xs mb-4">{{ selectedNotice.date }}</p>
            <div class="text-[oklch(80%_0.04_250)] leading-relaxed text-sm">
              {{ selectedNotice.content }}
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Gn2Pagination from '@/components/Gn2Pagination.vue'

interface Notice {
  id: number
  title: string
  date: string
  content: string
  pinned?: boolean
}

const loading = ref(true)
const selectedNotice = ref<Notice | null>(null)
const allNotices = ref<Notice[]>([])

// ── Pagination ──────────────────────────────────
const pageSize = 8
const currentPage = ref(1)

const pinnedNotices = computed(() => allNotices.value.filter(n => n.pinned))
const regularNotices = computed(() => allNotices.value.filter(n => !n.pinned))

const totalPages = computed(() => Math.ceil(regularNotices.value.length / pageSize))
const pagedNotices = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return regularNotices.value.slice(start, start + pageSize)
})

const onPageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Data Fetch ──────────────────────────────────
onMounted(async () => {
  await new Promise(r => setTimeout(r, 500))
  allNotices.value = [
    { id: 1, title: '[필독] GN2Studio 홈페이지 리뉴얼 안내', date: '2026.03.06', pinned: true, content: 'GN2Studio 공식 홈페이지가 Vue3 기반으로 새롭게 리뉴얼되었습니다. 더욱 빠르고 편리한 서비스로 찾아뵙겠습니다. 이용에 불편함이 생기시면 문의사항을 통해 알려주시기 바랍니다.' },
    { id: 2, title: '메리톡톡 신규 기능 업데이트 안내', date: '2026.02.15', content: '메리톡톡에 새로운 창작자 지원 기능이 추가되었습니다. 작가 대시보드, 독자 통계, 정기구독 기능 등이 새롭게 도입됩니다.' },
    { id: 3, title: '2026년 1분기 서비스 점검 안내', date: '2026.01.20', content: '시스템 안정성 향상을 위한 정기 점검이 진행됩니다. 점검 시간: 2026년 1월 25일(일) 새벽 02:00 ~ 04:00. 이용에 불편을 드려 죄송합니다.' },
    { id: 4, title: '와글커뮤니티 Beta 서비스 오픈 안내', date: '2026.01.10', content: '와글커뮤니티 Beta 서비스가 오픈되었습니다. 누구나 쉽게 자신만의 커뮤니티를 만들 수 있는 SaaS 플랫폼입니다.' },
    { id: 5, title: 'AWS 파트너 인증 획득 소식', date: '2025.03.01', content: 'GN2Studio가 AWS 공식 파트너 인증을 획득했습니다.' },
    { id: 6, title: '개인정보처리방침 개정 안내', date: '2025.02.01', content: '당사의 개인정보처리방침이 일부 개정되었습니다. 변경된 내용을 반드시 확인해주시기 바랍니다.' },
    { id: 7, title: '2025년 연말 휴무 안내', date: '2024.12.20', content: '2024년 12월 27일(금)부터 2025년 1월 2일(목)까지 연말 휴무기간입니다. 휴무기간 중 접수된 문의는 업무 재개 후 순차적으로 답변드립니다.' },
    { id: 8, title: '메리톡톡 서비스 정식 런칭', date: '2025.06.01', content: '메리톡톡이 정식으로 런칭되었습니다! 작가와 독자가 함께하는 웹소설 커뮤니티 플랫폼에 많은 관심 부탁드립니다.' },
    { id: 9, title: 'SGC에너지 모니터링 솔루션 납품 완료', date: '2024.11.30', content: 'SGC에너지 열병합발전소를 위한 실시간 모니터링 솔루션 개발이 완료되었습니다.' },
    { id: 10, title: '스마트팩토리 컨설팅 수행 완료', date: '2023.10.30', content: '중소벤처기업부 스마트팩토리 보급사업 컨설팅을 성공적으로 완료하였습니다.' },
  ]
  loading.value = false
})
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
.page-title { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: white; letter-spacing: -0.03em; }
.page-subtitle { color: oklch(70% 0.04 250); font-size: 1.05rem; margin-top: 0.75rem; }
.text-gradient {
  background: linear-gradient(135deg, var(--accent) 0%, #fff 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}

.skeleton-row { height: 56px; border-radius: 10px; background: rgba(255,255,255,0.04); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

.notice-list { border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
.notice-row {
  display: flex; align-items: center; gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  cursor: pointer; transition: background 0.2s ease;
}
.notice-row:last-child { border-bottom: none; }
.notice-row:hover { background: rgba(255,255,255,0.05); }
.notice-row.pinned { background: rgba(120,200,250,0.04); }
.notice-badge {
  flex-shrink: 0; font-size: 0.72rem; font-weight: 700;
  padding: 3px 10px; border-radius: 20px;
  background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); white-space: nowrap;
}
.pinned .notice-badge { background: rgba(120,200,250,0.1); color: var(--accent); }
.notice-title { flex: 1; color: oklch(88% 0.03 250); font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notice-date { flex-shrink: 0; font-size: 0.8rem; color: rgba(255,255,255,0.3); }
.notice-empty { padding: 3rem; text-align: center; color: rgba(255,255,255,0.3); font-size: 0.9rem; }

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
}
.modal-box {
  background: rgb(22, 22, 35); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; padding: 2rem; max-width: 560px; width: 100%;
  max-height: 80vh; overflow-y: auto;
  box-shadow: 0 40px 100px rgba(0,0,0,0.6);
}
.modal-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem; }
.modal-close { background: none; border: none; color: rgba(255,255,255,0.4); font-size: 1.1rem; cursor: pointer; padding: 4px; flex-shrink: 0; }
.modal-close:hover { color: white; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
