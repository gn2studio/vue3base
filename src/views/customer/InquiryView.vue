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
          <span class="bc-current">문의사항</span>
        </div>
        <h1 class="page-title mt-4">1:1 <span class="text-gradient">문의하기</span></h1>
        <p class="page-subtitle">무엇이든 편하게 물어보세요. 빠르게 답변해 드립니다.</p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 md:px-12 py-16">
      <!-- Contact Info Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div v-for="info in contactInfos" :key="info.label" class="info-card">
          <span class="info-icon">{{ info.icon }}</span>
          <p class="text-white/60 text-xs mb-1">{{ info.label }}</p>
          <p class="text-white font-semibold text-sm">{{ info.value }}</p>
        </div>
      </div>

      <!-- Form -->
      <form class="inquiry-form" @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-field">
            <label>이름 <span class="required">*</span></label>
            <input v-model="form.name" type="text" placeholder="홍길동" required />
          </div>
          <div class="form-field">
            <label>이메일 <span class="required">*</span></label>
            <input v-model="form.email" type="email" placeholder="example@email.com" required />
          </div>
        </div>
        <div class="form-field">
          <label>연락처</label>
          <input v-model="form.phone" type="tel" placeholder="010-0000-0000" />
        </div>
        <div class="form-field">
          <label>문의 유형 <span class="required">*</span></label>
          <select v-model="form.type" required>
            <option value="">선택해주세요</option>
            <option value="개발문의">개발 프로젝트 문의</option>
            <option value="서비스문의">서비스 이용 문의</option>
            <option value="기술지원">기술 지원 요청</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div class="form-field">
          <label>제목 <span class="required">*</span></label>
          <input v-model="form.subject" type="text" placeholder="문의 제목을 입력해주세요" required />
        </div>
        <div class="form-field">
          <label>내용 <span class="required">*</span></label>
          <textarea v-model="form.content" rows="6" placeholder="문의 내용을 자세히 입력해주세요..." required></textarea>
        </div>
        <div class="form-field">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.agree" required />
            <span>개인정보 처리방침에 동의합니다 <span class="required">*</span></span>
          </label>
        </div>
        <button type="submit" class="submit-btn" :disabled="submitting">
          <span v-if="!submitting">문의 제출하기 →</span>
          <span v-else>제출 중...</span>
        </button>
      </form>

      <transition name="modal-fade">
        <div v-if="submitted" class="success-box mt-8">
          <span class="text-3xl">✅</span>
          <div>
            <p class="text-white font-bold">문의가 접수되었습니다!</p>
            <p class="text-white/50 text-sm mt-1">영업일 기준 1~2일 내에 이메일로 회신해 드리겠습니다.</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const contactInfos = [
  { icon: '📧', label: '이메일', value: 'contact@gn2studio.com' },
  { icon: '🕐', label: '운영시간', value: '평일 09:00~18:00' },
  { icon: '📞', label: '전화', value: '문의 후 안내' },
]

const form = reactive({ name: '', email: '', phone: '', type: '', subject: '', content: '', agree: false })
const submitting = ref(false)
const submitted = ref(false)

const submitForm = async () => {
  submitting.value = true
  await new Promise(r => setTimeout(r, 1200))
  submitting.value = false
  submitted.value = true
  Object.assign(form, { name: '', email: '', phone: '', type: '', subject: '', content: '', agree: false })
}
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

.info-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 1.25rem; text-align: center;
}
.info-icon { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; }

.inquiry-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }

.form-field { display: flex; flex-direction: column; gap: 8px; }
.form-field label { font-size: 0.85rem; font-weight: 600; color: oklch(80% 0.04 250); }
.required { color: var(--accent); }

.form-field input, .form-field select, .form-field textarea {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 0.75rem 1rem; color: white; font-size: 0.9rem;
  outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}
.form-field input:focus, .form-field select:focus, .form-field textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px oklch(75% 0.15 200 / 0.15);
}
.form-field input::placeholder, .form-field textarea::placeholder { color: rgba(255,255,255,0.2); }
.form-field select option { background: rgb(20, 20, 35); }
.form-field textarea { resize: vertical; min-height: 140px; }

.checkbox-label {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; font-size: 0.875rem; color: oklch(75% 0.04 250);
  flex-direction: row !important;
}
.checkbox-label input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--accent); flex-shrink: 0; }

.submit-btn {
  padding: 0.875rem 2rem; border-radius: 12px; width: 100%;
  background: oklch(55% 0.18 250); color: white; font-weight: 700; font-size: 1rem;
  border: none; cursor: pointer; transition: all 0.3s ease;
}
.submit-btn:hover:not(:disabled) {
  background: oklch(62% 0.2 250);
  box-shadow: 0 0 30px oklch(55% 0.18 250 / 0.5); transform: translateY(-2px);
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.success-box {
  display: flex; align-items: center; gap: 1rem; padding: 1.5rem;
  background: rgba(100, 220, 120, 0.08); border: 1px solid rgba(100, 220, 120, 0.25);
  border-radius: 14px;
}
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
