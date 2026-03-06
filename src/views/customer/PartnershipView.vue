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
          <span class="bc-current">사업제휴</span>
        </div>
        <h1 class="page-title mt-4">사업 <span class="text-gradient">제휴 제안</span></h1>
        <p class="page-subtitle">함께 성장할 파트너를 찾고 있습니다. 제안서를 보내주세요.</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <!-- Partnership Types -->
      <div class="mb-14">
        <h2 class="section-title text-center mb-10">제휴 유형</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="type in partnershipTypes" :key="type.title" class="type-card">
            <span class="type-icon">{{ type.icon }}</span>
            <h4 class="text-white font-bold mb-2">{{ type.title }}</h4>
            <p class="text-white/50 text-xs leading-relaxed">{{ type.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Partnership Form -->
      <div class="glass-form-wrap">
        <h3 class="text-xl font-bold text-white mb-6">제휴 제안서 제출</h3>
        <form @submit.prevent="submitPartnership">
          <div class="form-grid mb-5">
            <div class="form-field">
              <label>회사명 <span class="required">*</span></label>
              <input v-model="form.company" type="text" placeholder="(주)회사명" required />
            </div>
            <div class="form-field">
              <label>담당자명 <span class="required">*</span></label>
              <input v-model="form.name" type="text" placeholder="홍길동" required />
            </div>
          </div>
          <div class="form-grid mb-5">
            <div class="form-field">
              <label>이메일 <span class="required">*</span></label>
              <input v-model="form.email" type="email" placeholder="biz@company.com" required />
            </div>
            <div class="form-field">
              <label>연락처 <span class="required">*</span></label>
              <input v-model="form.phone" type="tel" placeholder="010-0000-0000" required />
            </div>
          </div>
          <div class="form-field mb-5">
            <label>제휴 유형 <span class="required">*</span></label>
            <select v-model="form.type" required>
              <option value="">선택해주세요</option>
              <option>기술 파트너십</option>
              <option>플랫폼 연동</option>
              <option>공동 마케팅</option>
              <option>투자 / 엑셀러레이팅</option>
              <option>기타</option>
            </select>
          </div>
          <div class="form-field mb-6">
            <label>제안 내용 <span class="required">*</span></label>
            <textarea v-model="form.content" rows="6" placeholder="제휴 목적, 기대 효과, 제안 내용 등을 자유롭게 작성해 주세요..." required></textarea>
          </div>
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '제출 중...' : '제안서 제출하기 →' }}
          </button>
        </form>

        <transition name="modal-fade">
          <div v-if="submitted" class="success-msg">
            <span class="text-2xl">🤝</span>
            <div>
              <p class="font-bold text-white">제안서가 접수되었습니다!</p>
              <p class="text-white/50 text-sm mt-1">영업일 기준 3~5일 내에 검토 후 연락드리겠습니다.</p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const partnershipTypes = [
  { icon: '🔧', title: '기술 파트너십', desc: 'AI/클라우드 기술 협력 및 공동 솔루션 개발' },
  { icon: '🔗', title: '플랫폼 연동', desc: '메리톡톡, 와글커뮤니티 등 API 연동 협력' },
  { icon: '📢', title: '공동 마케팅', desc: '브랜드 공동 캠페인 및 상호 프로모션' },
  { icon: '💡', title: '투자/엑셀러레이팅', desc: '스타트업 투자 및 성장 지원 프로그램' },
]

const form = reactive({ company: '', name: '', email: '', phone: '', type: '', content: '' })
const submitting = ref(false)
const submitted = ref(false)

const submitPartnership = async () => {
  submitting.value = true
  await new Promise(r => setTimeout(r, 1200))
  submitting.value = false
  submitted.value = true
  Object.assign(form, { company: '', name: '', email: '', phone: '', type: '', content: '' })
}
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
.page-title { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: white; letter-spacing: -0.03em; }
.page-subtitle { color: oklch(70% 0.04 250); font-size: 1.05rem; margin-top: 0.75rem; }
.text-gradient {
  background: linear-gradient(135deg, var(--accent) 0%, #fff 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}

.section-title { font-size: 1.6rem; font-weight: 800; color: white; letter-spacing: -0.02em; }
.type-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 1.5rem; text-align: center;
  transition: all 0.3s ease;
}
.type-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); transform: translateY(-4px); }
.type-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }

.glass-form-wrap {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; padding: 2.5rem;
}
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
.form-field { display: flex; flex-direction: column; gap: 8px; }
.form-field label { font-size: 0.85rem; font-weight: 600; color: oklch(80% 0.04 250); }
.required { color: var(--accent); }
.form-field input, .form-field select, .form-field textarea {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 0.75rem 1rem; color: white; font-size: 0.9rem;
  outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; font-family: inherit;
}
.form-field input:focus, .form-field select:focus, .form-field textarea:focus {
  border-color: var(--accent); box-shadow: 0 0 0 3px oklch(75% 0.15 200 / 0.15);
}
.form-field input::placeholder, .form-field textarea::placeholder { color: rgba(255,255,255,0.2); }
.form-field select option { background: rgb(20, 20, 35); }
.form-field textarea { resize: vertical; min-height: 140px; }
.submit-btn {
  width: 100%; padding: 0.875rem 2rem; border-radius: 12px;
  background: oklch(55% 0.18 250); color: white; font-weight: 700; font-size: 1rem;
  border: none; cursor: pointer; transition: all 0.3s ease;
}
.submit-btn:hover:not(:disabled) {
  background: oklch(62% 0.2 250); box-shadow: 0 0 30px oklch(55% 0.18 250 / 0.5); transform: translateY(-2px);
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.success-msg {
  display: flex; align-items: center; gap: 1rem; padding: 1.25rem; margin-top: 1.5rem;
  background: rgba(100, 220, 120, 0.08); border: 1px solid rgba(100, 220, 120, 0.25); border-radius: 12px;
}
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
