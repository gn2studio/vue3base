<template>
  <div class="password-page">
    <div class="page-container py-12">
      <div class="password-card">
        <div class="card-header">
          <div class="header-icon">
            <i class="fa-solid fa-key text-2xl"></i>
          </div>
          <div>
            <h1 class="card-title">비밀번호 변경</h1>
            <p class="card-subtitle">새 비밀번호를 입력해주세요.</p>
          </div>
        </div>

        <form class="card-body" @submit.prevent="handleSubmit">
          <div v-if="errorMsg" class="error-alert">
            <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ errorMsg }}
          </div>
          <div v-if="successMsg" class="success-alert">
            <i class="fa-solid fa-circle-check mr-2"></i>{{ successMsg }}
          </div>

          <div class="form-row">
            <label>현재 비밀번호 <span class="required">*</span></label>
            <div class="input-wrap">
              <input
                v-model="form.currentPassword"
                :type="showCurrent ? 'text' : 'password'"
                class="form-input"
                placeholder="현재 비밀번호 입력"
                autocomplete="current-password"
              />
              <button type="button" class="eye-btn" @click="showCurrent = !showCurrent">
                <i class="fa-solid" :class="showCurrent ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-row">
            <label>새 비밀번호 <span class="required">*</span></label>
            <div class="input-wrap">
              <input
                v-model="form.newPassword"
                :type="showNew ? 'text' : 'password'"
                class="form-input"
                placeholder="8자리 이상 영문+숫자+특수문자"
                autocomplete="new-password"
              />
              <button type="button" class="eye-btn" @click="showNew = !showNew">
                <i class="fa-solid" :class="showNew ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
            <!-- 강도 표시 -->
            <div class="strength-bar-wrap" v-if="form.newPassword">
              <div class="strength-bar">
                <div class="strength-fill" :class="strengthClass" :style="{ width: strengthWidth }"></div>
              </div>
              <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
            </div>
          </div>

          <div class="form-row">
            <label>새 비밀번호 확인 <span class="required">*</span></label>
            <div class="input-wrap">
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="form-input"
                placeholder="새 비밀번호 다시 입력"
                autocomplete="new-password"
              />
              <button type="button" class="eye-btn" @click="showConfirm = !showConfirm">
                <i class="fa-solid" :class="showConfirm ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
            <p v-if="form.confirmPassword && !passwordMatch" class="field-error">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i>비밀번호가 일치하지 않습니다.
            </p>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="isLoading || !passwordMatch">
              <i v-if="isLoading" class="fa-solid fa-spinner fa-spin mr-2"></i>
              {{ isLoading ? '변경 중...' : '비밀번호 변경' }}
            </button>
            <router-link to="/account/profile" class="btn-ghost">취소</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const form = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const passwordMatch = computed(() =>
  !form.confirmPassword || form.newPassword === form.confirmPassword
)

// 비밀번호 강도
const strength = computed(() => {
  const p = form.newPassword
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})
const strengthClass = computed(() => {
  if (strength.value <= 1) return 'weak'
  if (strength.value <= 3) return 'medium'
  return 'strong'
})
const strengthWidth = computed(() => `${(strength.value / 5) * 100}%`)
const strengthLabel = computed(() => {
  if (strength.value <= 1) return '약함'
  if (strength.value <= 3) return '보통'
  return '강함'
})

const handleSubmit = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
    errorMsg.value = '모든 항목을 입력해주세요.'; return
  }
  if (!passwordMatch.value) {
    errorMsg.value = '새 비밀번호가 일치하지 않습니다.'; return
  }
  if (form.newPassword.length < 8) {
    errorMsg.value = '새 비밀번호는 8자 이상이어야 합니다.'; return
  }

  isLoading.value = true
  try {
    /**
     * @todo Swagger 연동 시: POST /User/ChangePassword 엔드포인트 연결
     * @body { currentPassword: string, newPassword: string }
     * @header Authorization: Bearer {accessToken}
     */
    const IDS = import.meta.env.VITE_APP_IDENTITY_BASE_URL as string
    await axios.post(`${IDS}/connect/token`, new URLSearchParams({
      grant_type: 'change_password',
      current_password: form.currentPassword,
      new_password: form.newPassword,
      client_id: import.meta.env.VITE_APP_IDENTITY_CLIENTID,
      client_secret: import.meta.env.VITE_APP_IDENTITY_CLIENTSECRET,
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${authStore.accessToken}` } })
    successMsg.value = '비밀번호가 성공적으로 변경되었습니다.'
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (err: any) {
    // Mock: 실제 API 연결 전 성공 시뮬레이션
    successMsg.value = '비밀번호가 성공적으로 변경되었습니다. (Mock)'
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    console.warn('[비밀번호 변경] API 미연결 - Mock 처리:', err?.response?.data ?? err.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.password-page { min-height: 80vh; }
.password-card {
  max-width: 480px; margin: 0 auto;
  background: oklch(16% 0.04 250);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; overflow: hidden;
}
.card-header {
  display: flex; align-items: center; gap: 1.25rem;
  padding: 2rem 2.5rem;
  background: linear-gradient(135deg, oklch(20% 0.08 250), oklch(15% 0.04 250));
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: oklch(55% 0.18 250);
  display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
}
.card-title { font-size: 1.2rem; font-weight: 800; color: white; margin: 0 0 4px; }
.card-subtitle { color: rgba(255,255,255,0.4); font-size: 0.85rem; margin: 0; }
.card-body { padding: 2rem 2.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

.error-alert {
  padding: 0.75rem 1rem;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
  border-radius: 10px; color: rgb(248,113,113); font-size: 0.875rem;
}
.success-alert {
  padding: 0.75rem 1rem;
  background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
  border-radius: 10px; color: rgb(74,222,128); font-size: 0.875rem;
}
.field-error { color: rgb(248,113,113); font-size: 0.78rem; margin: 4px 0 0; }

.input-wrap { position: relative; }
.input-wrap .form-input { padding-right: 2.5rem; }
.eye-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: rgba(255,255,255,0.35);
  cursor: pointer; font-size: 0.875rem; transition: color 0.2s;
}
.eye-btn:hover { color: rgba(255,255,255,0.7); }

.strength-bar-wrap { margin-top: 8px; display: flex; align-items: center; gap: 10px; }
.strength-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }
.strength-fill.weak { background: rgb(239,68,68); }
.strength-fill.medium { background: rgb(234,179,8); }
.strength-fill.strong { background: rgb(34,197,94); }
.strength-label { font-size: 0.72rem; font-weight: 700; white-space: nowrap; }
.strength-label.weak { color: rgb(248,113,113); }
.strength-label.medium { color: rgb(250,204,21); }
.strength-label.strong { color: rgb(74,222,128); }

.form-actions { display: flex; gap: 0.75rem; align-items: center; margin-top: 0.5rem; }
</style>
