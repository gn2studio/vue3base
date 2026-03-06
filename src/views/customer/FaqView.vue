<template>
  <div class="page-view">
    <div class="page-hero relative overflow-hidden">
      <div class="hero-glow"></div>
      <div class="page-container py-20 relative z-10">
        <div class="breadcrumb">
          <router-link to="/" class="bc-link">홈</router-link>
          <span class="bc-sep">›</span>
          <span class="bc-current">고객센터</span>
          <span class="bc-sep">›</span>
          <span class="bc-current">FAQ</span>
        </div>
        <h1 class="page-title mt-4">자주 묻는 <span class="text-gradient">질문</span></h1>
        <p class="page-subtitle">궁금한 점을 빠르게 해결하세요</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <!-- Category Filter -->
      <div class="flex flex-wrap gap-3 mb-10">
        <button v-for="cat in categories" :key="cat"
          class="cat-btn" :class="{ active: selectedCat === cat }"
          @click="selectedCat = cat">
          {{ cat }}
        </button>
      </div>

      <!-- FAQ Accordion -->
      <div class="faq-list">
        <div v-for="(faq, idx) in filteredFaqs" :key="faq.id"
             class="faq-item" :class="{ open: openIdx === idx }">
          <button class="faq-question" @click="toggle(idx)">
            <span class="faq-q-label">Q</span>
            <span class="flex-1 text-left">{{ faq.question }}</span>
            <i class="fa-solid fa-chevron-down faq-chevron"></i>
          </button>
          <transition name="faq-expand">
            <div v-if="openIdx === idx" class="faq-answer">
              <span class="faq-a-label">A</span>
              <p>{{ faq.answer }}</p>
            </div>
          </transition>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-16 cta-box text-center">
        <p class="text-[oklch(75%_0.04_250)] mb-4">찾으시는 답변이 없으신가요?</p>
        <router-link to="/customer/inquiry" class="btn-cta">1:1 문의하기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Faq {
  id: number
  category: string
  question: string
  answer: string
}

const categories = ['전체', '서비스', '계약/비용', '기술지원', '파트너십']
const selectedCat = ref('전체')
const openIdx = ref<number | null>(null)

const toggle = (idx: number) => {
  openIdx.value = openIdx.value === idx ? null : idx
}

const faqs: Faq[] = [
  { id: 1, category: '서비스', question: '어떤 종류의 서비스를 제공하나요?', answer: 'GN2Studio는 웹/앱 개발, AI 솔루션 개발, 클라우드 인프라 구축 및 운영, 커뮤니티 플랫폼(메리톡톡, 와글커뮤니티) 서비스를 제공합니다. 기획부터 운영까지 One-Stop으로 지원합니다.' },
  { id: 2, category: '서비스', question: '프로젝트 개발 기간은 어느 정도 걸리나요?', answer: '프로젝트의 규모와 복잡도에 따라 다르지만, 일반적인 웹 개발의 경우 1~3개월, 대규모 시스템 개발은 3~6개월 정도 소요됩니다. 정확한 일정은 상담 후 제안서를 통해 안내드립니다.' },
  { id: 3, category: '계약/비용', question: '개발 비용은 어떻게 산정되나요?', answer: '비용은 프로젝트 스코프, 개발 기간, 기술 난이도 등을 종합적으로 고려하여 산정됩니다. 문의사항을 통해 간단한 요구사항을 알려주시면 예산 범위 내에서 최적의 솔루션을 제안해 드립니다.' },
  { id: 4, category: '계약/비용', question: '유지보수 계약은 별도로 체결해야 하나요?', answer: '네, 개발 완료 후 유지보수는 별도 계약을 통해 진행됩니다. 월정액 유지보수 또는 이슈별 단건 처리 형태로 제공되며, 고객의 상황에 맞는 방식을 선택하실 수 있습니다.' },
  { id: 5, category: '기술지원', question: 'AI 기능을 기존 시스템에 추가할 수 있나요?', answer: '기존 시스템과 GPT/Azure AI 서비스를 연동하는 작업이 가능합니다. 챗봇, 자연어 처리, 이미지 분석, 데이터 예측 등 다양한 AI 기능을 기존 시스템에 통합해 드립니다.' },
  { id: 6, category: '기술지원', question: '클라우드 마이그레이션 지원이 가능한가요?', answer: 'AWS 및 Azure 파트너로서 온프레미스 환경에서 클라우드로의 마이그레이션을 전문적으로 지원합니다. 현황 분석부터 마이그레이션 계획 수립, 실행, 운영 안정화까지 전 과정을 함께합니다.' },
  { id: 7, category: '파트너십', question: '사업 제휴 제안은 어떻게 하나요?', answer: '사업제휴 페이지를 통해 제안서를 제출해 주시면 검토 후 연락드립니다. IT 기술 파트너십, 플랫폼 연동, 공동 마케팅 등 다양한 형태의 협력을 환영합니다.' },
]

const filteredFaqs = computed(() => {
  if (selectedCat.value === '전체') return faqs
  return faqs.filter(f => f.category === selectedCat.value)
})
</script>

<style scoped>
.page-hero {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(10, 10, 20, 0.9) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.hero-glow {
  position: absolute; bottom: -80px; left: -80px;
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

/* Category Buttons */
.cat-btn {
  padding: 0.4rem 1.1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  color: oklch(75% 0.04 250); cursor: pointer; transition: all 0.2s ease;
}
.cat-btn:hover { background: rgba(255,255,255,0.1); color: white; }
.cat-btn.active {
  background: rgba(120,200,250,0.12); border-color: var(--accent);
  color: var(--accent);
}

/* FAQ Accordion */
.faq-list { display: flex; flex-direction: column; gap: 8px; }
.faq-item { border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; transition: border-color 0.25s ease; }
.faq-item.open { border-color: rgba(120,200,250,0.25); }
.faq-question {
  display: flex; align-items: center; gap: 1rem; width: 100%;
  padding: 1.1rem 1.5rem; background: none; border: none; cursor: pointer;
  text-align: left; transition: background 0.2s ease;
}
.faq-question:hover { background: rgba(255,255,255,0.03); }
.faq-open .faq-question { background: rgba(120,200,250,0.04); }
.faq-q-label {
  width: 28px; height: 28px; flex-shrink: 0;
  background: rgba(120,200,250,0.12); color: var(--accent);
  border-radius: 8px; font-size: 0.8rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.faq-question span:nth-child(2) { color: oklch(88% 0.03 250); font-size: 0.95rem; }
.faq-chevron { color: rgba(255,255,255,0.3); font-size: 0.75rem; flex-shrink: 0; transition: transform 0.3s ease; }
.faq-item.open .faq-chevron { transform: rotate(180deg); color: var(--accent); }

.faq-answer {
  display: flex; gap: 1rem; padding: 1rem 1.5rem 1.25rem;
  background: rgba(120,200,250,0.03); border-top: 1px solid rgba(255,255,255,0.06);
}
.faq-a-label {
  width: 28px; height: 28px; flex-shrink: 0;
  background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.4);
  border-radius: 8px; font-size: 0.8rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.faq-answer p { color: oklch(78% 0.04 250); font-size: 0.9rem; line-height: 1.7; margin: 0; padding-top: 4px; }

.faq-expand-enter-active, .faq-expand-leave-active { transition: max-height 0.3s ease, opacity 0.3s ease; max-height: 300px; overflow: hidden; }
.faq-expand-enter-from, .faq-expand-leave-to { max-height: 0; opacity: 0; }

/* CTA */
.cta-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem; }
.btn-cta {
  display: inline-block; padding: 0.75rem 2rem; border-radius: 30px;
  background: oklch(55% 0.18 250); color: white; font-weight: 700; font-size: 0.95rem;
  text-decoration: none; transition: all 0.25s ease;
}
.btn-cta:hover { background: oklch(62% 0.2 250); box-shadow: 0 0 24px oklch(55% 0.18 250 / 0.5); transform: translateY(-2px); color: white; }
</style>
